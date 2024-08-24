import { createStorage } from 'unstorage';
import { describe, expect, test } from 'vitest';
import memoryDriver from 'unstorage/drivers/memory';
import { createNoteRepository } from './notes.repository';
import { createNoteNotFoundError } from './notes.errors';

describe('notes repository', () => {
  describe('getNoteById', () => {
    test('a note identifier is returned when a note is saved, and the note can be retrieved by its identifier', async () => {
      const { getNoteById, saveNote } = createNoteRepository({ storage: createStorage({ driver: memoryDriver() }) });

      const { noteId } = await saveNote({
        content: '<encrypted-content>',
        ttlInSeconds: 60,
        isPasswordProtected: false,
        deleteAfterReading: false,
        now: new Date('2024-01-01T00:00:00Z'),
      });

      const { note } = await getNoteById({
        noteId,
        now: new Date('2024-01-01T00:00:30Z'),
      });

      expect(note).to.eql({
        content: '<encrypted-content>',
        isPasswordProtected: false,
        deleteAfterReading: false,

      });
    });

    test('a note is deleted after reading if the deleteAfterReading flag is set', async () => {
      const { getNoteById, saveNote } = createNoteRepository({ storage: createStorage({ driver: memoryDriver() }) });

      const { noteId } = await saveNote({
        content: '<encrypted-content>',
        ttlInSeconds: 60,
        isPasswordProtected: false,
        deleteAfterReading: true,
        now: new Date('2024-01-01T00:00:00Z'),
      });

      await getNoteById({
        noteId,
        now: new Date('2024-01-01T00:00:30Z'),
      });

      expect(
        getNoteById({
          noteId,
          now: new Date('2024-01-01T00:01:00Z'),
        }),
      ).rejects.toThrow(createNoteNotFoundError());
    });

    test('a note that has expired is deleted and cannot be retrieved', async () => {
      const { getNoteById, saveNote } = createNoteRepository({ storage: createStorage({ driver: memoryDriver() }) });

      const { noteId } = await saveNote({
        content: '<encrypted-content>',
        ttlInSeconds: 60,
        isPasswordProtected: false,
        deleteAfterReading: false,
        now: new Date('2024-01-01T00:00:00Z'),
      });

      expect(
        getNoteById({
          noteId,
          now: new Date('2024-01-01T00:01:01Z'),
        }),
      ).rejects.toThrow(createNoteNotFoundError());
    });
  });
});
