import { describe, expect, test } from 'vitest';
import { overrideConfig } from '../../app/config/config.test-utils';
import { createServer } from '../../app/server';
import { createMemoryStorage } from '../../storage/factories/memory.storage';

describe('e2e', () => {
  describe('no expiration delay', async () => {
    test('when the creation of notes without an expiration delay is allowed, a note can be created without an expiration delay', async () => {
      const { storage } = createMemoryStorage();

      const { app } = createServer({
        storageFactory: () => ({ storage }),
        config: overrideConfig({
          public: {
            isSettingNoExpirationAllowed: true,
          },
        }),
      });

      const note = {
        deleteAfterReading: false,
        ttlInSeconds: undefined,
        payload: 'aaaaaaaa',
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

      const reply = await createNoteResponse.json<any>();

      expect(createNoteResponse.status).to.eql(200);
      expect(reply.noteId).toBeTypeOf('string');
    });

    test('when the ability to create notes without an expiration delay is disabled, a note cannot be created without an expiration delay', async () => {
      const { storage } = createMemoryStorage();

      const { app } = createServer({
        storageFactory: () => ({ storage }),
        config: overrideConfig({
          public: {
            isSettingNoExpirationAllowed: false,
          },
        }),
      });

      const note = {
        deleteAfterReading: false,
        ttlInSeconds: undefined,
        payload: 'aaaaaaaa',
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

      const reply = await createNoteResponse.json<any>();

      expect(createNoteResponse.status).to.eql(400);
      expect(reply).to.eql({
        error: {
          code: 'note.expiration_delay_required',
          message: 'Expiration delay is required',
        },
      });
    });
  });
});
