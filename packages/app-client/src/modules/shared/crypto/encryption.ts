import { base64UrlToBuffer, bufferToBase64Url, createRandomBuffer } from './buffer';

export { aesEncrypt, aesDecrypt, deriveKey };

async function aesEncrypt({ data, key: rawKey }: { data: Uint8Array; key: Uint8Array }): Promise<string> {
  const iv = createRandomBuffer({ length: 12 });

  const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  const ivString = bufferToBase64Url({ buffer: iv });
  const encryptedString = bufferToBase64Url({ buffer: new Uint8Array(encrypted) });

  return `${ivString}:${encryptedString}`;
}

async function aesDecrypt({ data, key: rawKey }: { data: string; key: Uint8Array }): Promise<string> {
  const [ivString, encryptedString] = data.split(':').map(part => part.trim());

  if (!ivString || !encryptedString) {
    throw new Error('Invalid data');
  }

  const iv = base64UrlToBuffer({ base64Url: ivString });
  const encrypted = base64UrlToBuffer({ base64Url: encryptedString });

  const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

  return new TextDecoder().decode(decrypted);
}

async function deriveKey({ key: originalKey, iterations = 100_000 }: { key: Uint8Array; iterations?: number }): Promise<Uint8Array> {
  // The salt is deterministically derived from the key
  const saltHash = await crypto.subtle.digest('SHA-256', originalKey);
  const salt = new Uint8Array(saltHash).slice(0, 16);

  const key = await crypto.subtle.importKey('raw', originalKey, 'PBKDF2', false, ['deriveKey']);

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    key,
    { name: 'AES-GCM', length: 256 },
    true, // Extractable
    ['encrypt', 'decrypt'],
  );

  const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);

  return new Uint8Array(exportedKey);
}
