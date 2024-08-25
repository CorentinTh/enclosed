import { createStorage } from 'unstorage';
import { describe, expect, test } from 'vitest';
import memoryDriver from 'unstorage/drivers/memory';
import { createNoteRepository } from './notes.repository';
import { createNoteNotFoundError } from './notes.errors';

describe('notes repository', () => {
  describe('getNoteById', () => {
    test('a note can be retrieved from storage by its id, with the dates coerced to Date objects', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      const { getNoteById } = createNoteRepository({ storage });

      const { note } = await getNoteById({ noteId: 'note-1' });

      expect(note).to.eql({
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: new Date('2024-01-01T00:01:00.000Z'),
        deleteAfterReading: false,
      });
    });

    test('an error is raised when trying to retrieve a note that does not exist in storage', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      const { getNoteById } = createNoteRepository({ storage });

      expect(getNoteById({ noteId: 'note-2' })).rejects.toThrow(createNoteNotFoundError());
    });
  });

  describe('getNotesIds', () => {
    test('retrieves all note ids from storage, regardless of the expiration', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-2', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      const { getNotesIds } = createNoteRepository({ storage });

      const { noteIds } = await getNotesIds();

      expect(noteIds).to.eql(['note-1', 'note-2']);
    });

    test('returns an empty list of ids when there are no notes in storage', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      const { getNotesIds } = createNoteRepository({ storage });

      const { noteIds } = await getNotesIds();

      expect(noteIds).to.eql([]);
    });

    test('it does not delete notes from storage when retrieving their ids, even marked for deletion after reading', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: true,
      });

      const { getNotesIds } = createNoteRepository({ storage });

      await getNotesIds();

      const noteIds = await storage.getKeys();

      expect(noteIds).to.eql(['note-1']);
    });
  });

  describe('deleteNoteById', () => {
    test('deletes a note from storage by its id', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      storage.setItem('note-1', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      storage.setItem('note-2', {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });

      const { deleteNoteById } = createNoteRepository({ storage });

      await deleteNoteById({ noteId: 'note-1' });

      const noteIds = await storage.getKeys();

      expect(noteIds).to.eql(['note-2']);
    });

    test('when trying to delete a note that does not exist, no error is raised', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      const { deleteNoteById } = createNoteRepository({ storage });

      await deleteNoteById({ noteId: 'note-1' });

      expect(await storage.getKeys()).to.eql([]);
    });
  });

  describe('saveNote', () => {
    test('store a note in storage with its content and metadata', async () => {
      const storage = createStorage({ driver: memoryDriver() });
      let noteIdIndex = 1;

      const { saveNote } = createNoteRepository({ storage });

      expect(await storage.getKeys()).to.eql([]);

      const { noteId } = await saveNote({
        content: '<encrypted-content>',
        isPasswordProtected: false,
        ttlInSeconds: 60,
        deleteAfterReading: false,
        generateNoteId: () => `note-${noteIdIndex++}`,
        now: new Date('2024-01-01T00:00:00.000Z'),
      });

      expect(noteId).to.eql('note-1');
      expect(await storage.getKeys()).to.eql(['note-1']);

      expect(await storage.getItem<any>('note-1')).to.eql({
        content: '<encrypted-content>',
        isPasswordProtected: false,
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
      });
    });
  });
});
