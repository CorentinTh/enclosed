import { defineTask } from '../../tasks/tasks.models';
import { isNoteExpired } from '../notes.models';
import { createNoteRepository } from '../notes.repository';

export const deleteExpiredNotesTask = defineTask({
  name: 'deleteExpiredNotes',
  isEnabled: ({ config }) => config.tasks.deleteExpiredNotes.enabled,
  cronSchedule: ({ config }) => config.tasks.deleteExpiredNotes.cron,
  handler: async ({ storage, logger, now }) => {
    const { getNotesIds, deleteNoteById, getNoteById } = createNoteRepository({ storage });

    const { noteIds } = await getNotesIds();
    const expiredNoteIds = [];

    for (const noteId of noteIds) {
      try {
        const { note } = await getNoteById({ noteId });

        if (isNoteExpired({ note, now })) {
          expiredNoteIds.push(noteId);
          await deleteNoteById({ noteId });
        }
      } catch (error) {
        logger.error({ error, noteId }, 'Unable to process expiration check for note');
      }
    }

    logger.info({
      noteCount: noteIds.length,
      expiredNoteCount: expiredNoteIds.length,
    }, 'Expired notes deleted');
  },
});
