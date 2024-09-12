import type { Note } from '../../notes/notes.types';

export { defineSerializationMethods };

function defineSerializationMethods<Name extends string>(args: {
  name: Name;
  serializeNote: (args: { note: Note }) => Promise<{ noteBuffer: Uint8Array }>;
  parseNote: (args: { noteBuffer: Uint8Array }) => Promise<{ note: Note }>;
}) {
  return args;
}
