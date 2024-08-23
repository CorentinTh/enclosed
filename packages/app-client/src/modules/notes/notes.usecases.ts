import { base64UrlToBuffer, bufferToBase64Url } from '../shared/crypto/buffer';
import { createRandomBuffer } from '../shared/random/random';
import { createNoteUrl, decryptNoteContent, encryptNoteContent, getEncryptionKeyHash } from './notes.models';
import { createNote } from './notes.services';

export { encryptAndCreateNote, decryptNote };

async function encryptAndCreateNote({ content, password }: { content: string; password?: string }) {
  const baseEncryptionKeyBuffer = createRandomBuffer({ length: 32 });

  const encryptionHashBuffer = await getEncryptionKeyHash({ baseEncryptionKeyBuffer, password });

  const encryptedContent = await encryptNoteContent({ content, encryptionHashBuffer });

  const { noteId } = await createNote({ content: encryptedContent, isPasswordProtected: Boolean(password) });

  const encryptionKey = bufferToBase64Url({ buffer: baseEncryptionKeyBuffer });

  const { noteUrl } = createNoteUrl({ noteId, encryptionKey });

  return { encryptedContent, noteId, encryptionKey, noteUrl };
}

async function decryptNote({ encryptedContent, password, encryptionKey }: { encryptedContent: string; password?: string; encryptionKey: string }) {
  const encryptionKeyBuffer = base64UrlToBuffer({ base64Url: encryptionKey });

  const decryptionHashBuffer = await getEncryptionKeyHash({ password, baseEncryptionKeyBuffer: encryptionKeyBuffer });

  const decryptedContent = await decryptNoteContent({ encryptedContent, decryptionHashBuffer });

  return { decryptedContent };
}
