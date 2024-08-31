import { createCipheriv, createDecipheriv, pbkdf2, randomBytes } from 'node:crypto';
import { TextEncoder, promisify } from 'node:util';
import { base64UrlToBuffer, bufferToBase64Url } from './crypto.node.models';

export { generateBaseKey, deriveMasterKey, encryptNoteContent, decryptNoteContent };

const deriveWithPbkdf2 = promisify(pbkdf2);

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

async function encryptNoteContent({ content, masterKey }: { content: string; masterKey: Uint8Array }) {
  const iv = createRandomBuffer({ length: 12 });

  const cipher = createCipheriv('aes-256-gcm', masterKey, iv);

  const encryptedBuffer = new Uint8Array([...cipher.update(content), ...cipher.final(), ...cipher.getAuthTag()]);
  const encrypted = bufferToBase64Url({ buffer: encryptedBuffer });

  return {
    encryptedContent: `${bufferToBase64Url({ buffer: iv })}:${encrypted}`,
  };
}

async function decryptNoteContent({ encryptedContent, masterKey }: { encryptedContent: string; masterKey: Uint8Array }) {
  const [ivString, encryptedStringWithAuthTag] = encryptedContent.split(':').map(part => part.trim());

  if (!ivString || !encryptedStringWithAuthTag) {
    throw new Error('Invalid encrypted content');
  }

  const iv = base64UrlToBuffer({ base64Url: ivString });
  const encryptedContentAndTagBuffer = base64UrlToBuffer({ base64Url: encryptedStringWithAuthTag });

  const encryptedBuffer = encryptedContentAndTagBuffer.slice(0, -16);
  const authTag = encryptedContentAndTagBuffer.slice(-16);

  const decipher = createDecipheriv('aes-256-gcm', masterKey, iv);
  decipher.setAuthTag(authTag);

  const decryptedBuffer = new Uint8Array([...decipher.update(encryptedBuffer), ...decipher.final()]);

  const decryptedContent = new TextDecoder().decode(decryptedBuffer);

  return {
    decryptedContent,
  };
}
