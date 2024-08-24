import { base64UrlToBuffer, bufferToBase64Url } from '../shared/crypto/buffer';
import { createRandomBuffer } from '../shared/random/random';
import { createNoteUrl, decryptNoteContent, deriveMasterKey, encryptNoteContent } from './notes.models';
import { createNote } from './notes.services';

export { encryptAndCreateNote, decryptNote };

async function encryptAndCreateNote({ content, password, ttlInSeconds, deleteAfterReading }: { content: string; password?: string; ttlInSeconds: number; deleteAfterReading: boolean }) {
  // The base key ensure e2e encryption even if the user does not provide a password
  const baseKey = createRandomBuffer({ length: 32 });

  // If the user provides a password, we derive a master key from the base key and the password using PBKDF2
  const masterKey = await deriveMasterKey({ baseKey, password });

  const encryptedContent = await encryptNoteContent({ content, masterKey });

  // Send the encrypted note to the server for storage
  const { noteId } = await createNote({ content: encryptedContent, isPasswordProtected: Boolean(password), ttlInSeconds, deleteAfterReading });

  // The base key is stored in the URL hash fragment
  const encryptionKey = bufferToBase64Url({ buffer: baseKey });

  const { noteUrl } = createNoteUrl({ noteId, encryptionKey });

  return { encryptedContent, noteId, encryptionKey, noteUrl };
}

async function decryptNote({ encryptedContent, password, encryptionKey }: { encryptedContent: string; password?: string; encryptionKey: string }) {
  const baseKey = base64UrlToBuffer({ base64Url: encryptionKey });

  const masterKey = await deriveMasterKey({ baseKey, password });

  const decryptedContent = await decryptNoteContent({ encryptedContent, masterKey });

  return { decryptedContent };
}
