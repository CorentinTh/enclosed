import { describe, expect, test } from 'vitest';
import type { Config } from '../../app/config/config.types';
import { createTestLogger } from '../../shared/logger/logger.test-utils';
import { createNoteNotFoundError } from '../notes.errors';
import { createMemoryStorage } from '../../storage/factories/memory.storage';
import { deleteExpiredNotesTask } from './delete-expired-notes.tasks';

describe('delete-expired-notes tasks', () => {
  describe('deleteExpiredNotesTask', () => {
    test('this task removes notes with an expiration date in the past', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-2', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-02T00:00:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-3', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-03T00:00:00.000Z',
        deleteAfterReading: false,
      });

      const { run } = deleteExpiredNotesTask;

      await run({
        storage,
        getNow: () => new Date('2024-01-02T00:00:00Z'),
        config: {} as Config,
      });

      expect(await storage.getKeys()).to.eql(['note-3']);
    });

    test('if an error occurs while retrieving a note from storage (like the note no longer exists), it does not prevent the other notes from being deleted', async () => {
      const { storage } = createMemoryStorage();

      const { getLoggerArgs, logger } = createTestLogger();

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-2', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-02T00:00:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-3', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-03T00:00:00.000Z',
        deleteAfterReading: false,
      });

      const { run } = deleteExpiredNotesTask;

      await run({
        storage: {
          ...storage,
          // Simulate a note that no longer exists in storage by returning a non-existing note ID
          getKeys: async () => ['note-1', 'non-existing-id', 'note-2', 'note-3'],
        },
        getNow: () => new Date('2024-01-02T00:00:00Z'),
        config: {} as Config,
        logger,
      });

      expect(await storage.getKeys()).to.eql(['note-3']);
      expect(getLoggerArgs().error).to.eql([
        [
          {
            error: createNoteNotFoundError(),
            noteId: 'non-existing-id',
          },
          'Unable to process expiration check for note',
        ],
      ]);
    });

    test('if an error occurs while deleting a note from storage, it does not prevent the other notes from being deleted', async () => {
      const { storage } = createMemoryStorage();

      const { getLoggerArgs, logger } = createTestLogger();

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-2', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-02T00:00:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-3', {
        content: '<encrypted-content>',
        expirationDate: '2024-01-03T00:00:00.000Z',
        deleteAfterReading: false,
      });

      const { run } = deleteExpiredNotesTask;

      await run({
        storage: {
          ...storage,
          removeItem: async (noteId: string) => {
            if (noteId === 'note-2') {
              throw new Error('foo');
            }

            return storage.removeItem(noteId);
          },
        },
        getNow: () => new Date('2024-01-02T00:00:00Z'),
        config: {} as Config,
        logger,
      });

      expect(await storage.getKeys()).to.eql(['note-2', 'note-3']);
      expect(getLoggerArgs().error).to.eql([
        [
          {
            error: new Error('foo'),
            noteId: 'note-2',
          },
          'Unable to process expiration check for note',
        ],
      ]);
    });
  });
});
