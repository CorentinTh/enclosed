import { describe, expect, test } from 'vitest';
import memoryDriver from 'unstorage/drivers/memory';
import { omit } from 'lodash-es';
import { createStorage } from 'unstorage';
import { createServer } from '../../app/server';

describe('e2e', () => {
  describe('create and view note', () => {
    test('a note can be created and viewed', async () => {
      const storage = createStorage({ driver: memoryDriver() });

      const { app } = createServer({
        getStorage: () => storage,
      });

      const note = {
        content: '<encrypted-content>',
        isPasswordProtected: false,
        deleteAfterReading: false,
        ttlInSeconds: 600,
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
        content: '<encrypted-content>',
        isPasswordProtected: false,
        deleteAfterReading: false,
      });
    });
  });
});
