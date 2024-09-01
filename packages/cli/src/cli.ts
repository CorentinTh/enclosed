import { defineCommand, runMain } from 'citty';
import { createNoteCommand } from './create-note/create-note.command';
import { configCommand } from './config/config.command';
import { viewNoteCommand } from './view-note/view-note.command';

const main = defineCommand({
  meta: {
    name: 'enclosed',
    description: 'Create and view private and secure notes',
  },
  subCommands: {
    create: createNoteCommand,
    view: viewNoteCommand,
    config: configCommand,
  },
});

runMain(main);
