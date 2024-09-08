export { generateBaseKey, deriveMasterKey, createRandomBuffer };

export { getEncryptionMethod, getDecryptionMethod } from './encryption-algorithms/encryption-algorithms.registry';

function createRandomBuffer({ length = 16 }: { length?: number } = {}): Uint8Array {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  return randomValues;
}

function generateBaseKey(): { baseKey: Uint8Array } {
  return { baseKey: createRandomBuffer({ length: 32 }) };
}

async function deriveMasterKey({ baseKey, password = '' }: { baseKey: Uint8Array; password?: string }) {
  const passwordBuffer = new TextEncoder().encode(password);
  const mergedBuffers = new Uint8Array([...baseKey, ...passwordBuffer]);

  const key = await crypto.subtle.importKey('raw', mergedBuffers, 'PBKDF2', false, ['deriveKey']);

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: baseKey,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    key,
    { name: 'AES-GCM', length: 256 },
    true, // Extractable
    ['encrypt', 'decrypt'],
  );

  const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);

  return {
    masterKey: new Uint8Array(exportedKey),
  };
}
