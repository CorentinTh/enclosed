import { omit } from 'lodash-es';
import { describe, expect, test } from 'vitest';
import { createServer } from '../../app/server';
import { createMemoryStorage } from '../../storage/factories/memory.storage';

describe('e2e', () => {
  describe('create and view note with authentication disabled (public instance)', () => {
    test('a note can be created and viewed', async () => {
      const { storage } = createMemoryStorage();

      const { app } = createServer({
        storageFactory: () => ({ storage }),
      });

      const note = {
        payload: '<encrypted-content>',
        deleteAfterReading: false,
        ttlInSeconds: 600,
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      };

      const createNoteResponse = await app.request(
        '/api/notes',
        {
          method: 'POST',
          body: JSON.stringify(note),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        },
      );

      expect(createNoteResponse.status).to.eql(200);

      const { noteId } = await createNoteResponse.json<any>();

      expect(noteId).toBeDefined();
      expect(noteId).to.be.a('string');

      const viewNoteResponse = await app.request(`/api/notes/${noteId}`);

      expect(viewNoteResponse.status).to.eql(200);

      const { note: retrievedNote } = await viewNoteResponse.json<any>();

      expect(omit(retrievedNote, 'expirationDate')).to.eql({
        payload: '<encrypted-content>',
        encryptionAlgorithm: 'aes-256-gcm',
        serializationFormat: 'cbor-array',
      });
    });

    test('an enregistered serialization format results in a bad request', async () => {
      const { storage } = createMemoryStorage();

      const { app } = createServer({
        storageFactory: () => ({ storage }),
      });

      const response = await app.request(
        '/api/notes',
        {
          method: 'POST',
          body: JSON.stringify({
            payload: '<encrypted-content>',
            deleteAfterReading: false,
            ttlInSeconds: 600,
            encryptionAlgorithm: 'aes-256-gcm',
            serializationFormat: 'foo', // <- invalid serialization format
          }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        },
      );

      expect(response.status).to.eql(400);
      expect(await response.json()).to.eql({
        error: {
          code: 'server.invalid_request.body',
          message: 'Invalid request body',
          details: [
            {
              message: 'Invalid enum value. Expected \'cbor-array\', received \'foo\'',
              path: 'serializationFormat',
            },
          ],
        },
      });
    });

    test('a note with an invalid encryption algorithm results in a bad request', async () => {
      const { storage } = createMemoryStorage();

      const { app } = createServer({
        storageFactory: () => ({ storage }),
      });

      const response = await app.request(
        '/api/notes',
        {
          method: 'POST',
          body: JSON.stringify({
            payload: '<encrypted-content>',
            deleteAfterReading: false,
            ttlInSeconds: 600,
            encryptionAlgorithm: 'foo', // <- invalid encryption algorithm
            serializationFormat: 'cbor-array',
          }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        },
      );

      expect(response.status).to.eql(400);
      expect(await response.json()).to.eql({
        error: {
          code: 'server.invalid_request.body',
          message: 'Invalid request body',
          details: [
            {
              message: 'Invalid enum value. Expected \'aes-256-gcm\', received \'foo\'',
              path: 'encryptionAlgorithm',
            },
          ],
        },
      });
    });

    test('on a public instance we cannot create a non-public note', async () => {
      const { storage } = createMemoryStorage();

      const { app } = createServer({
        storageFactory: () => ({ storage }),
      });

      const response = await app.request(
        '/api/notes',
        {
          method: 'POST',
          body: JSON.stringify({
            payload: '<encrypted-content>',
            deleteAfterReading: false,
            ttlInSeconds: 600,
            encryptionAlgorithm: 'aes-256-gcm',
            serializationFormat: 'cbor-array',
            isPublic: false, // <- non-public note
          }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        },
      );

      expect(response.status).to.eql(403);
      expect(await response.json()).to.eql({
        error: {
          code: 'note.cannot_create_private_note_on_public_instance',
          message: 'Cannot create private note on public instance',
        },
      });
    });
  });
});
