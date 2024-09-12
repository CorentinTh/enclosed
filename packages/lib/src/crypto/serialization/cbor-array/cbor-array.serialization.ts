import type { Note } from '../../../notes/notes.types';
import { decode, encode } from 'cbor-x';
import { defineSerializationMethods } from '../serialization.models';

export const cborArraySerializationDefinition = defineSerializationMethods({
  name: 'cbor-array',

  serializeNote: async ({ note }) => {
    const noteBuffer = encode([note.content, note.assets.map(({ content, metadata }) => ([metadata, content]))]);
    return { noteBuffer };
  },

  parseNote: async ({ noteBuffer }) => {
    const [content, assets] = decode(noteBuffer) as [string, [Record<string, unknown>, Uint8Array][]];

    const note = { content, assets: assets.map(([metadata, content]) => ({ metadata, content })) } as Note;

    return { note };
  },
});
