import { describe, expect, test } from 'vitest';
import { createMemoryStorage } from '../storage/factories/memory.storage';
import { getRefreshedNote } from './notes.usecases';
import { createNoteRepository } from './notes.repository';
import { createNoteNotFoundError } from './notes.errors';

describe('notes usecases', () => {
  describe('getRefreshedNote', () => {
    test('a note whose expiration date is later than the current date can be retrieved', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      const { note } = await getRefreshedNote({
        noteId: 'note-1',
        notesRepository: createNoteRepository({ storage }),
        now: new Date('2024-01-01T00:00:30Z'),
      });

      expect(note).to.eql({
        content: '<encrypted-content>',
        isPasswordProtected: false,
        deleteAfterReading: false,
        expirationDate: new Date('2024-01-01T00:01:00.000Z'),
      });
    });

    test('a note whose expiration date is earlier than the current date is considered expired and cannot be retrieved', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      expect(
        getRefreshedNote({
          noteId: 'note-1',
          notesRepository: createNoteRepository({ storage }),
          now: new Date('2024-01-02T00:00:00Z'),
        }),
      ).rejects.toThrow(createNoteNotFoundError());
    });

    test('a note whose expiration date is the same as the current date is considered expired and cannot be retrieved', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:00:00.000Z',
        deleteAfterReading: false,
      });

      expect(
        getRefreshedNote({
          noteId: 'note-1',
          notesRepository: createNoteRepository({ storage }),
          now: new Date('2024-01-01T00:00:00Z'),
        }),
      ).rejects.toThrow(createNoteNotFoundError());
    });

    test('a note is deleted after reading if the deleteAfterReading flag is set', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-02T00:00:00.000Z',
        deleteAfterReading: true,
      });

      await getRefreshedNote({
        noteId: 'note-1',
        notesRepository: createNoteRepository({ storage }),
        now: new Date('2024-01-01T00:00:30Z'),
      });

      expect(
        getRefreshedNote({
          noteId: 'note-1',
          notesRepository: createNoteRepository({ storage }),
          now: new Date('2024-01-01T00:01:00Z'),
        }),
      ).rejects.toThrow(createNoteNotFoundError());
    });
  });
});
