import { ulidFactory } from 'ulid-workers';

export { generateId };

// monotonic: false — in monotonic mode ids created within the same millisecond
// are a deterministic +1 of the previous random suffix instead of fresh entropy,
// making burst-created ids partly predictable. We don't need sortability for a
// capability id, so keep the full 80 bits of randomness per id.
const createUlid = ulidFactory({ monotonic: false });

function generateId() {
  return createUlid().toLowerCase();
}
