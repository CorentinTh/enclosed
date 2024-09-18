import { Buffer } from 'node:buffer';
import { pbkdf2, randomBytes } from 'node:crypto';
import { promisify, TextEncoder } from 'node:util';

export { base64UrlToBuffer, bufferToBase64Url, createRandomBuffer, deriveMasterKey, generateBaseKey };

const deriveWithPbkdf2 = promisify(pbkdf2);

function bufferToBase64Url({ buffer }: { buffer: Uint8Array }): string {
  const base64Url = Buffer.from(buffer).toString('base64url');

  return base64Url;
}

function base64UrlToBuffer({ base64Url }: { base64Url: string }): Uint8Array {
  const buffer = Buffer.from(base64Url, 'base64url');

  return new Uint8Array(buffer);
}

function generateBaseKey(): { baseKey: Uint8Array } {
  return { baseKey: createRandomBuffer({ length: 32 }) };
}

function createRandomBuffer({ length = 16 }: { length?: number } = {}): Uint8Array {
  const randomValues = randomBytes(length);

  return randomValues;
}

async function deriveMasterKey({ baseKey, password = '' }: { baseKey: Uint8Array; password?: string }): Promise<{ masterKey: Uint8Array }> {
  const passwordBuffer = new TextEncoder().encode(password);
  const mergedBuffers = new Uint8Array([...baseKey, ...passwordBuffer]);

  const masterKey = await deriveWithPbkdf2(mergedBuffers, baseKey, 100_000, 32, 'sha256');

  return {
    masterKey,
  };
}
