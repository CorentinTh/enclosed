import { defineCommand, runMain } from 'citty';
import { createNoteCommand } from './create-note/create-note.command';
import { configCommand } from './config/config.command';

const main = defineCommand({
  meta: {
    name: 'enclosed',
    description: 'Create and view private and secure notes',
  },
  subCommands: {
    create: createNoteCommand,
    config: configCommand,
  },
});

runMain(main);
