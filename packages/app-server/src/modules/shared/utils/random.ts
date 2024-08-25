import { ulidFactory } from 'ulid-workers';

export { generateId };

const createUlid = ulidFactory();

function generateId() {
  return createUlid().toLowerCase();
}
