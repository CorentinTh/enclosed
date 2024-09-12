import type { EncryptionAlgorithm } from '../crypto/crypto.types';
import type { SerializationFormat } from '../crypto/serialization/serialization.types';
import { createNoteUrl as createNoteUrlImpl, parseNoteUrl } from './notes.models';
import type { NoteAsset } from './notes.types';

export { createEnclosedLib };

const ONE_HOUR_IN_SECONDS = 60 * 60;
const BASE_URL = 'https://enclosed.cc';

function createEnclosedLib({
  encryptNote,
  // decryptNote,
  storeNote: storeNoteImpl,
  // fetchNote: fetchNoteImpl,
}: {
  encryptNote: (args: {
    content: string;
    password?: string;
    assets?: NoteAsset[];
    encryptionAlgorithm?: EncryptionAlgorithm;
    serializationFormat?: SerializationFormat;
  }) => Promise<{
    encryptedPayload: string;
    encryptionKey: string;
  }>;
  // decryptNote: (args: { encryptedContent: string; encryptionKey: string }) => Promise<{ content: string }>;
  storeNote: (params: {
    payload: string;
    ttlInSeconds: number;
    deleteAfterReading: boolean;
    apiBaseUrl?: string;
  }) => Promise<{ noteId: string }>;
  // fetchNote: (params: { noteId: string; apiBaseUrl?: string }) => Promise<{ content: string; isPasswordProtected: boolean }>;
}) {
  return {
    parseNoteUrl,
    createNoteUrl: createNoteUrlImpl,

    createNote: async ({
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
      }) => Promise<{ noteId: string }>;
    }) => {
      const { encryptedPayload, encryptionKey } = await encryptNote({ content, password, assets, encryptionAlgorithm, serializationFormat });
      const isPasswordProtected = Boolean(password);

      const { noteId } = await storeNote({
        payload: encryptedPayload,
        ttlInSeconds,
        deleteAfterReading,
        encryptionAlgorithm,
        serializationFormat,
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
    },
  };
};
