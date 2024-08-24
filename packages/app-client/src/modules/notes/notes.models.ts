import { createBuffer, mergeBuffers } from '../shared/crypto/buffer';
import { aesDecrypt, aesEncrypt, deriveKey } from '../shared/crypto/encryption';

export { encryptNoteContent, decryptNoteContent, createNoteUrl, deriveMasterKey };

function createBufferFromPassword({ password }: { password?: string }) {
  if (!password) {
    return new Uint8Array(0);
  }

  return new TextEncoder().encode(password);
}

async function encryptNoteContent({ content, masterKey }: { content: string; masterKey: Uint8Array }) {
  const contentBuffer = createBuffer({ value: content });
  const encryptedContent = await aesEncrypt({ data: contentBuffer, key: masterKey });

  return encryptedContent;
}

async function decryptNoteContent({ encryptedContent, masterKey }: { encryptedContent: string; masterKey: Uint8Array }) {
  const decryptedContent = await aesDecrypt({ data: encryptedContent, key: masterKey });

  return decryptedContent;
}

function createNoteUrl({ noteId, encryptionKey }: { noteId: string; encryptionKey: string }): { noteUrl: string } {
  const url = new URL(`/${noteId}`, window.location.origin);
  url.hash = encryptionKey;

  const noteUrl = url.toString();

  return { noteUrl };
}

function deriveMasterKey({ baseKey, password }: { baseKey: Uint8Array; password?: string }) {
  const passwordBuffer = createBufferFromPassword({ password });
  const mergedBuffers = mergeBuffers(baseKey, passwordBuffer);

  return deriveKey({ key: mergedBuffers });
}
