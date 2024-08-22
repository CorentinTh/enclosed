import { ulidFactory } from 'ulid-workers';

export { generateNoteId };

const createUlid = ulidFactory();

function generateNoteId() {
  return createUlid().toLowerCase();
}
