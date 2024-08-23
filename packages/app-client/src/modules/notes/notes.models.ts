import { createBuffer, mergeBuffers } from '../shared/crypto/buffer';
import { aesDecrypt, aesEncrypt } from '../shared/crypto/encryption';
import { createSha256Hash } from '../shared/crypto/hash';

export { createBufferFromPassword, getEncryptionKeyHash, encryptNoteContent, decryptNoteContent, createNoteUrl };

function createBufferFromPassword({ password }: { password: string }) {
  return new TextEncoder().encode(password);
}

async function getEncryptionKeyHash({
  password,
  baseEncryptionKeyBuffer,
}: {
  password?: string;
  baseEncryptionKeyBuffer: Uint8Array;
}): Promise<Uint8Array> {
  if (!password) {
    const baseEncryptionKeyHash = await createSha256Hash({ buffer: baseEncryptionKeyBuffer });

    return baseEncryptionKeyHash;
  }

  const passwordBuffer = createBufferFromPassword({ password });
  const mergedKeysBuffer = mergeBuffers(baseEncryptionKeyBuffer, passwordBuffer);
  const encryptionKey = await createSha256Hash({ buffer: mergedKeysBuffer });

  return encryptionKey;
}

async function encryptNoteContent({ content, encryptionHashBuffer }: { content: string; encryptionHashBuffer: Uint8Array }) {
  const contentBuffer = createBuffer({ value: content });
  const encryptedContent = await aesEncrypt({ data: contentBuffer, key: encryptionHashBuffer });

  return encryptedContent;
}

async function decryptNoteContent({ encryptedContent, decryptionHashBuffer }: { encryptedContent: string; decryptionHashBuffer: Uint8Array }) {
  const decryptedContent = await aesDecrypt({ data: encryptedContent, key: decryptionHashBuffer });

  return decryptedContent;
}

function createNoteUrl({ noteId, encryptionKey }: { noteId: string; encryptionKey: string }): { noteUrl: string } {
  const url = new URL(`/${noteId}`, window.location.origin);
  // add the encryption key as hash fragment

  url.hash = encryptionKey;

  const noteUrl = url.toString();

  return { noteUrl };
}
