import type { EncryptionAlgorithm } from '../crypto/crypto.types';
import type { SerializationFormat } from '../crypto/serialization/serialization.types';
import type { NoteAsset } from './notes.types';
import { encryptNote } from '../crypto/crypto.usecases';
import { createNoteUrl as createNoteUrlImpl } from './notes.models';
import { storeNote as storeNoteImpl } from './notes.services';

export { createNote };

const ONE_HOUR_IN_SECONDS = 60 * 60;
const BASE_URL = 'https://enclosed.cc';

async function createNote({
  content,
  password,
  ttlInSeconds = ONE_HOUR_IN_SECONDS,
  deleteAfterReading = false,
  clientBaseUrl = BASE_URL,
  apiBaseUrl = clientBaseUrl,
  createNoteUrl = createNoteUrlImpl,
  storeNote = params => storeNoteImpl({ ...params, apiBaseUrl }),
  assets = [],
  encryptionAlgorithm = 'aes-256-gcm',
  serializationFormat = 'cbor-array',
  isPublic = true,
}: {
  content: string;
  password?: string;
  ttlInSeconds?: number;
  deleteAfterReading?: boolean;
  clientBaseUrl?: string;
  apiBaseUrl?: string;
  assets?: NoteAsset[];
  encryptionAlgorithm?: EncryptionAlgorithm;
  serializationFormat?: SerializationFormat;
  isPublic?: boolean;
  createNoteUrl?: (args: {
    noteId: string;
    encryptionKey: string;
    clientBaseUrl: string;
    isPasswordProtected: boolean;
  }) => { noteUrl: string };
  storeNote?: (params: {
    payload: string;
    ttlInSeconds: number;
    deleteAfterReading: boolean;
    encryptionAlgorithm: EncryptionAlgorithm;
    serializationFormat: SerializationFormat;
    isPublic?: boolean;
  }) => Promise<{ noteId: string }>;
}) {
  const { encryptedPayload, encryptionKey } = await encryptNote({ content, password, assets, encryptionAlgorithm, serializationFormat });
  const isPasswordProtected = Boolean(password);

  const { noteId } = await storeNote({
    payload: encryptedPayload,
    ttlInSeconds,
    deleteAfterReading,
    encryptionAlgorithm,
    serializationFormat,
    isPublic,
  });

  const { noteUrl } = createNoteUrl({
    noteId,
    encryptionKey,
    clientBaseUrl,
    isPasswordProtected,
  });

  return {
    encryptedPayload,
    encryptionKey,
    noteId,
    noteUrl,
  };
}
