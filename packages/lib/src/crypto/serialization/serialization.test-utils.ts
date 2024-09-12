import type { Note } from '../../notes/notes.types';
import { describe, expect, test } from 'vitest';

export { runCommonSerializationTests };

function runCommonSerializationTests({
  serializeNote,
  parseNote,
}: {
  serializeNote: (args: { note: Note }) => Promise<{ noteBuffer: Uint8Array }>;
  parseNote: (args: { noteBuffer: Uint8Array }) => Promise<{ note: Note }>;
}) {
  describe('a note serialized and parsed should stay the same', async () => {
    test('a note with content and no assets', async () => {
      const note = {
        content: 'Hello, world!',
        assets: [],
      };

      const { noteBuffer } = await serializeNote({ note });
      const { note: parsedNote } = await parseNote({ noteBuffer });

      expect(parsedNote).to.eql({
        content: 'Hello, world!',
        assets: [],
      });
    });

    test('a note with content and assets', async () => {
      const note = {
        content: 'Hello, world!',
        assets: [
          {
            metadata: { type: 'file', fileType: 'image/png', width: 1920, height: 1080 },
            content: new Uint8Array([0, 1, 2, 3]),
          },
        ],
      };

      const { noteBuffer } = await serializeNote({ note });
      const { note: parsedNote } = await parseNote({ noteBuffer });

      expect(parsedNote).to.eql({
        content: 'Hello, world!',
        assets: [
          {
            metadata: { type: 'file', fileType: 'image/png', width: 1920, height: 1080 },
            content: new Uint8Array([0, 1, 2, 3]),
          },
        ],
      });
    });

    test('a note with content and multiple assets', async () => {
      const note = {
        content: 'Hello, world!',
        assets: [
          {
            metadata: { type: 'file', fileType: 'image/png', width: 1920, height: 1080 },
            content: new Uint8Array([0, 1, 2, 3]),
          },
          {
            metadata: { type: 'file', fileType: 'image/png', width: 1920, height: 1080 },
            content: new Uint8Array([4, 5, 6, 7]),
          },
        ],
      };

      const { noteBuffer } = await serializeNote({ note });
      const { note: parsedNote } = await parseNote({ noteBuffer });

      expect(parsedNote).to.eql({
        content: 'Hello, world!',
        assets: [
          {
            metadata: { type: 'file', fileType: 'image/png', width: 1920, height: 1080 },
            content: new Uint8Array([0, 1, 2, 3]),
          },
          {
            metadata: { type: 'file', fileType: 'image/png', width: 1920, height: 1080 },
            content: new Uint8Array([4, 5, 6, 7]),
          },
        ],
      });
    });
  });
}
