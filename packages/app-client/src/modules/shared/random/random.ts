import { bufferToBase64Url } from '../crypto/buffer';

export { createRandomString, createRandomBuffer };

function createRandomString({ length = 16 }: { length?: number } = {}): string {
  const bufferLength = Math.ceil((length * 3) / 4);
  const randomValues = new Uint8Array(bufferLength);
  crypto.getRandomValues(randomValues);
  return bufferToBase64Url({ buffer: randomValues });
}

function createRandomBuffer({ length = 16 }: { length?: number } = {}): Uint8Array {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  return randomValues;
}
