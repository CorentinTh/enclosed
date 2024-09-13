import { omit } from 'lodash-es';
import { describe, expect, test } from 'vitest';
import { overrideConfig } from '../../app/config/config.test-utils';
import { createServer } from '../../app/server';
import { createMemoryStorage } from '../../storage/factories/memory.storage';

describe('e2e', () => {
  describe('create and view note with authentication enabled', () => {
    describe('when user is authenticated (valid jwt in Authorization header)', () => {
      const config = overrideConfig({
        public: {
          isAuthenticationRequired: true,
        },
        authentication: {
          jwtSecret: 'secret-key',
        },
      });

      test('a note can be created when authenticated and viewed publicly by default', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config,
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
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sSmY3kpYwtAY4wEJLXCWZVKZCYRW5cH4UGkw9RMEBrk', // valid token for key 'secret-key'
            }),
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

      test('a private note can be created when authenticated and viewed only by authenticated users', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config,
        });

        const note = {
          payload: '<encrypted-content>',
          deleteAfterReading: false,
          ttlInSeconds: 600,
          encryptionAlgorithm: 'aes-256-gcm',
          serializationFormat: 'cbor-array',
          isPublic: false,
        };

        const createNoteResponse = await app.request(
          '/api/notes',
          {
            method: 'POST',
            body: JSON.stringify(note),
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sSmY3kpYwtAY4wEJLXCWZVKZCYRW5cH4UGkw9RMEBrk', // valid token for key 'secret-key'
            }),
          },
        );

        expect(createNoteResponse.status).to.eql(200);

        const { noteId } = await createNoteResponse.json<any>();

        expect(noteId).toBeDefined();
        expect(noteId).to.be.a('string');

        const viewNoteUnAuthResponse = await app.request(`/api/notes/${noteId}`);

        expect(viewNoteUnAuthResponse.status).to.eql(401);
        expect(await viewNoteUnAuthResponse.json()).to.eql({
          error: {
            code: 'auth.unauthorized',
            message: 'Unauthorized',
          },
        });

        const viewNoteAuthResponse = await app.request(`/api/notes/${noteId}`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sSmY3kpYwtAY4wEJLXCWZVKZCYRW5cH4UGkw9RMEBrk', // valid token for key
          },
        });

        expect(viewNoteAuthResponse.status).to.eql(200);
        expect(await viewNoteAuthResponse.json()).to.eql({
          note: {
            payload: '<encrypted-content>',
            encryptionAlgorithm: 'aes-256-gcm',
            serializationFormat: 'cbor-array',
          },
        });
      });
    });
  });
});
