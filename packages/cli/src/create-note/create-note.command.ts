import { createNote } from '@enclosed/lib';
import { defineCommand, showUsage } from 'citty';
import { castArray } from 'lodash-es';
import ora from 'ora';
import pc from 'picocolors';
import { getInstanceUrl } from '../config/config.usecases';
import { buildFileAssets, checkFilesExist } from '../files/files.services';
import { looksLikeRateLimitError } from '../shared/http.models';
import { getNoteContent } from './create-note.usecases';

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
    file: {
      description: 'Files to attach to the note',
      type: 'string',
      alias: 'f',
      required: false,
    },
    stdin: {
      description: 'Read note content from stdin',
      alias: 's',
      type: 'boolean',
      default: false,
    },
  },
  run: async ({ args }) => {
    const {
      password,
      content: rawContent,
      deleteAfterReading,
      ttl: ttlInSeconds,
      file,
      stdin: shouldReadFromStdin,
    } = args;

    const filePaths = file ? castArray(file) : [];

    const content = await getNoteContent({
      rawContent,
      shouldReadFromStdin,
    });

    if (!content && !filePaths.length) {
      await showUsage(createNoteCommand);
      return;
    }

    if (filePaths.length) {
      const { missingFiles, allFilesExist } = await checkFilesExist({ filePaths });

      if (!allFilesExist) {
        console.error(pc.red('The following files do not exist or are not accessible:'));
        console.error(pc.red(missingFiles.map(l => `  - ${l}`).join('\n')));
        return;
      }
    }

    const spinner = ora('Creating note').start();

    try {
      const { assets } = await buildFileAssets({ filePaths });

      const { noteUrl } = await createNote({
        content: content ?? '',
        password,
        deleteAfterReading,
        ttlInSeconds: Number(ttlInSeconds),
        clientBaseUrl: getInstanceUrl(),
        assets,
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
