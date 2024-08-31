import { base64UrlToBuffer, bufferToBase64Url } from './crypto.web.models';

export { generateBaseKey, deriveMasterKey, encryptNoteContent, decryptNoteContent };

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

async function encryptNoteContent({ content, masterKey }: { content: string; masterKey: Uint8Array }) {
  const contentBuffer = new TextEncoder().encode(content);
  const iv = createRandomBuffer({ length: 12 });

  const key = await crypto.subtle.importKey('raw', masterKey, 'AES-GCM', false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, contentBuffer);

  const ivString = bufferToBase64Url({ buffer: iv });
  const encryptedString = bufferToBase64Url({ buffer: new Uint8Array(encrypted) });

  return {
    encryptedContent: `${ivString}:${encryptedString}`,
  };
}

async function decryptNoteContent({ encryptedContent, masterKey }: { encryptedContent: string; masterKey: Uint8Array }) {
  const [ivString, encryptedString] = encryptedContent.split(':').map(part => part.trim());

  if (!ivString || !encryptedString) {
    throw new Error('Invalid data');
  }

  const iv = base64UrlToBuffer({ base64Url: ivString });
  const encrypted = base64UrlToBuffer({ base64Url: encryptedString });

  const key = await crypto.subtle.importKey('raw', masterKey, 'AES-GCM', false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

  const decryptedContent = new TextDecoder().decode(decrypted);

  return { decryptedContent };
}
