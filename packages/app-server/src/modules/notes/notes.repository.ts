import type { Storage } from 'unstorage';
import { addSeconds, isBefore } from 'date-fns';
import { omit } from 'lodash-es';
import { generateNoteId } from './notes.models';
import { createNoteNotFoundError } from './notes.errors';

export { createNoteRepository };

function createNoteRepository({ storage }: { storage: Storage }) {
  return {
    async saveNote(
      {
        content,
        isPasswordProtected,
        ttlInSeconds,
        deleteAfterReading,
        now = new Date(),
      }:
      {
        content: string;
        isPasswordProtected: boolean;
        ttlInSeconds: number;
        deleteAfterReading: boolean;
        now?: Date;
      },
    ) {
      const noteId = generateNoteId();
      const expirationDate = addSeconds(now, ttlInSeconds).toISOString();

      await storage.setItem(noteId, { content, isPasswordProtected, expirationDate, deleteAfterReading }, { ttl: ttlInSeconds });

      return { noteId };
    },

    async getNoteById({ noteId, now = new Date() }: { noteId: string; now?: Date }) {
      const note = await storage.getItem<{ content: string; isPasswordProtected: boolean; expirationDate: string; deleteAfterReading: boolean }>(noteId);
      if (!note) {
        throw createNoteNotFoundError();
      }

      const isExpired = isBefore(note.expirationDate, now);

      if (isExpired) {
        await storage.removeItem(noteId);

        throw createNoteNotFoundError();
      }

      if (note.deleteAfterReading) {
        await storage.removeItem(noteId);
      }

      return {
        note: omit(note, 'expirationDate'),
      };
    },
  };
}
