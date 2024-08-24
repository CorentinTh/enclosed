import { base64UrlToBuffer, bufferToBase64Url } from '../shared/crypto/buffer';
import { createRandomBuffer } from '../shared/random/random';
import { createNoteUrl, decryptNoteContent, deriveMasterKey, encryptNoteContent } from './notes.models';
import { createNote } from './notes.services';

export { encryptAndCreateNote, decryptNote, encryptNote };

async function encryptAndCreateNote({
  content,
  password,
  ttlInSeconds,
  deleteAfterReading,
  storeNote = createNote,
}: {
  content: string;
  password?: string;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
  storeNote?: (params: { content: string; isPasswordProtected: boolean; ttlInSeconds: number; deleteAfterReading: boolean }) => Promise<{ noteId: string }>;
}) {
  const { encryptedContent, encryptionKey } = await encryptNote({ content, password });

  // Send the encrypted note to the server for storage, the server has no knowledge of the encryption key
  const { noteId } = await storeNote({ content: encryptedContent, isPasswordProtected: Boolean(password), ttlInSeconds, deleteAfterReading });

  // The base key is stored in the URL hash fragment
  const { noteUrl } = createNoteUrl({ noteId, encryptionKey });

  return { encryptedContent, noteId, encryptionKey, noteUrl };
}

async function encryptNote({ content, password }: { content: string; password?: string }) {
  // The base key ensure e2e encryption even if the user does not provide a password
  const baseKey = createRandomBuffer({ length: 32 });

  // If the user provides a password, we derive a master key from the base key and the password using PBKDF2
  const masterKey = await deriveMasterKey({ baseKey, password });

  const encryptedContent = await encryptNoteContent({ content, masterKey });

  const encryptionKey = bufferToBase64Url({ buffer: baseKey });

  return { encryptedContent, encryptionKey };
}

async function decryptNote({ encryptedContent, password, encryptionKey }: { encryptedContent: string; password?: string; encryptionKey: string }) {
  const baseKey = base64UrlToBuffer({ base64Url: encryptionKey });

  const masterKey = await deriveMasterKey({ baseKey, password });

  const decryptedContent = await decryptNoteContent({ encryptedContent, masterKey });

  return { decryptedContent };
}
