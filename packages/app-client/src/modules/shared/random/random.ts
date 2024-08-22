export { createRandomString, createRandomBuffer };

function createRandomString({ length = 16 }: { length?: number } = {}): string {
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, value => value.toString(36)).join('');
}

function createRandomBuffer({ length = 16 }: { length?: number } = {}): Uint8Array {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  return randomValues;
}
