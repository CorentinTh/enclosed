import { describe, expect, test } from 'vitest';
import { createMemoryStorage } from '../storage/factories/memory.storage';
import { createNoteNotFoundError } from './notes.errors';
import { createNoteRepository } from './notes.repository';

describe('notes repository', () => {
  describe('getNoteById', () => {
    test('a note can be retrieved from storage by its id, with the dates coerced to Date objects', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      const { getNoteById } = createNoteRepository({ storage });

      const { note } = await getNoteById({ noteId: 'note-1' });

      expect(note).to.eql({
        payload: '<encrypted-content>',
        expirationDate: new Date('2024-01-01T00:01:00.000Z'),
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });
    });

    test('an error is raised when trying to retrieve a note that does not exist in storage', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      const { getNoteById } = createNoteRepository({ storage });

      expect(getNoteById({ noteId: 'note-2' })).rejects.toThrow(createNoteNotFoundError());
    });
  });

  describe('getNotesIds', () => {
    test('retrieves all note ids from storage, regardless of the expiration', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      storage.setItem('note-2', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      const { getNotesIds } = createNoteRepository({ storage });

      const { noteIds } = await getNotesIds();

      expect(noteIds).to.eql(['note-1', 'note-2']);
    });

    test('returns an empty list of ids when there are no notes in storage', async () => {
      const { storage } = createMemoryStorage();

      const { getNotesIds } = createNoteRepository({ storage });

      const { noteIds } = await getNotesIds();

      expect(noteIds).to.eql([]);
    });

    test('it does not delete notes from storage when retrieving their ids, even marked for deletion after reading', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: true,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      const { getNotesIds } = createNoteRepository({ storage });

      await getNotesIds();

      const noteIds = await storage.getKeys();

      expect(noteIds).to.eql(['note-1']);
    });
  });

  describe('deleteNoteById', () => {
    test('deletes a note from storage by its id', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      storage.setItem('note-2', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      const { deleteNoteById } = createNoteRepository({ storage });

      await deleteNoteById({ noteId: 'note-1' });

      const noteIds = await storage.getKeys();

      expect(noteIds).to.eql(['note-2']);
    });

    test('when trying to delete a note that does not exist, no error is raised', async () => {
      const { storage } = createMemoryStorage();

      const { deleteNoteById } = createNoteRepository({ storage });

      await deleteNoteById({ noteId: 'note-1' });

      expect(await storage.getKeys()).to.eql([]);
    });
  });

  describe('saveNote', () => {
    test('store a note in storage with its content and metadata', async () => {
      const { storage } = createMemoryStorage();
      let noteIdIndex = 1;

      const { saveNote } = createNoteRepository({ storage });

      expect(await storage.getKeys()).to.eql([]);

      const { noteId } = await saveNote({
        payload: '<encrypted-content>',
        ttlInSeconds: 60,
        deleteAfterReading: false,
        generateNoteId: () => `note-${noteIdIndex++}`,
        now: new Date('2024-01-01T00:00:00.000Z'),
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
        isPublic: true,
      });

      expect(noteId).to.eql('note-1');
      expect(await storage.getKeys()).to.eql(['note-1']);

      expect(await storage.getItem<any>('note-1')).to.eql({
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
        isPublic: true,
      });
    });
  });

  describe('getNoteExists', () => {
    test('test the presence of a note in storage by its id', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: false,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      const { getNoteExists } = createNoteRepository({ storage });

      expect(await getNoteExists({ noteId: 'note-1' })).to.eql({ noteExists: true });
      expect(await getNoteExists({ noteId: 'note-2' })).to.eql({ noteExists: false });
    });

    test('when checking the existence of a note, it does not delete it from storage, even if marked for deletion after reading', async () => {
      const { storage } = createMemoryStorage();

      storage.setItem('note-1', {
        payload: '<encrypted-content>',
        expirationDate: '2024-01-01T00:01:00.000Z',
        deleteAfterReading: true,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });

      const { getNoteExists } = createNoteRepository({ storage });

      expect(await getNoteExists({ noteId: 'note-1' })).to.eql({ noteExists: true });
      expect(await getNoteExists({ noteId: 'note-1' })).to.eql({ noteExists: true });

      const noteIds = await storage.getKeys();

      expect(noteIds).to.eql(['note-1']);
    });
  });
});
