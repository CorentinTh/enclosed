import { defineCommand, showUsage } from 'citty';
import { createNote } from '@enclosed/lib';
import ora from 'ora';
import pc from 'picocolors';
import { looksLikeRateLimitError } from '../shared/http.models';
import { readFromStdin } from '../shared/cli.models';
import { getInstanceUrl } from '../config/config.usecases';

const ONE_HOUR_IN_SECONDS = 60 * 60;

export const createNoteCommand = defineCommand({
  meta: {
    name: 'create',
    description: 'Create a new note',
  },
  args: {
    content: {
      description: 'Note content (leave empty to read from stdin)',
      type: 'positional',
      required: false,
    },
    password: {
      description: 'Password to protect the note (default is no password)',
      valueHint: 'password',
      default: '',
      alias: 'p',
      type: 'string',
    },
    ttl: {
      description: `Note time-to-live in seconds (default: ${ONE_HOUR_IN_SECONDS}s = 1 hour)`,
      default: String(ONE_HOUR_IN_SECONDS),
      valueHint: 'seconds',
      alias: 't',
      type: 'string',
    },
    deleteAfterReading: {
      description: 'Delete note after reading (default: false)',
      alias: 'd',
      type: 'boolean',
      default: false,
    },
  },
  run: async ({ args }) => {
    const { password, content: rawContent, deleteAfterReading, ttl: ttlInSeconds } = args;

    const content = rawContent ?? await readFromStdin();

    if (!content) {
      await showUsage(createNoteCommand);
      return;
    }

    const spinner = ora('Creating note').start();

    try {
      const { noteUrl } = await createNote({
        content: String(content),
        password,
        deleteAfterReading,
        ttlInSeconds: Number(ttlInSeconds),
        clientBaseUrl: getInstanceUrl(),
      });

      spinner.succeed('Note created successfully');

      console.log(`\nNote url: ${pc.green(noteUrl)}`);
    } catch (error) {
      spinner.fail('Failed to create note');

      if (looksLikeRateLimitError({ error })) {
        console.error(pc.red('Rate limit exceeded. Try again later.'));
        return;
      }

      console.error(error);
    }
  },
});
