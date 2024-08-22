import type { Storage } from 'unstorage';
import { createError } from '../shared/errors/errors';
import { generateNoteId } from './notes.models';

export { createNoteRepository };

function createNoteRepository({ storage }: { storage: Storage }) {
  return {
    async saveNote({ content, isPasswordProtected }: { content: string; isPasswordProtected: boolean }) {
      const noteId = generateNoteId();

      await storage.setItem(noteId, { content, isPasswordProtected });

      return { noteId };
    },

    async getNoteById({ noteId }: { noteId: string }) {
      const note = await storage.getItem<{ content: string; isPasswordProtected: boolean }>(noteId);

      if (!note) {
        throw createError({
          message: 'Note not found',
          code: 'note.not_found',
          statusCode: 404,
        });
      }

      return { note };
    },
  };
}
