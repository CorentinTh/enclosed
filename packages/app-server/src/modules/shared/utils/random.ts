import { ulidFactory } from 'ulid-workers';

export { generateId };

const createUlid = ulidFactory({ monotonic: false });

function generateId() {
  return createUlid().toLowerCase();
}
