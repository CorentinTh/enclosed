import { describe, expect, test } from 'vitest';
import { overrideConfig } from '../../app/config/config.test-utils';
import { createServer } from '../../app/server';
import { createMemoryStorage } from '../../storage/factories/memory.storage';

describe('e2e', () => {
  describe('body limit note creation', async () => {
    test('a note with an encrypted content larger than the limit configured using maxEncryptedContentLength cannot be created', async () => {
      const { storage } = createMemoryStorage();

      const { app } = createServer({
        storageFactory: () => ({ storage }),
        config: overrideConfig({
          notes: {
            maxEncryptedPayloadLength: 1024 * 1024,
          },
        }),
      });

      const note = {
        deleteAfterReading: false,
        ttlInSeconds: 600,
        payload: 'a'.repeat(1024 * 1024 + 1),
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

      expect(createNoteResponse.status).to.eql(413);
      expect(reply).to.eql({
        error: {
          code: 'note.payload_too_large',
          message: 'Note payload is too large',
        },
      });
    });
  });
});
