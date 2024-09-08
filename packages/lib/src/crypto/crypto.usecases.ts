import type { NoteAsset } from '../notes/notes.types';
import type { EncryptionAlgorithm } from './crypto.types';
import { getParsingMethod, getSerializationMethod } from './serialization/serialization.registry';
import type { SerializationFormat } from './serialization/serialization.types';
import { base64UrlToBuffer, bufferToBase64Url } from './web/crypto.web.models';

export { createEncryptUsecase, createDecryptUsecase };

function createEncryptUsecase({
  generateBaseKey,
  deriveMasterKey,
  getEncryptionMethod,
}: {
  generateBaseKey: () => { baseKey: Uint8Array };
  deriveMasterKey: ({ baseKey, password }: { baseKey: Uint8Array; password?: string }) => Promise<{ masterKey: Uint8Array }>;
  getEncryptionMethod: (args: { encryptionAlgorithm: string }) => { encryptBuffer: (args: { buffer: Uint8Array; encryptionKey: Uint8Array }) => Promise<{ encryptedString: string }> };
}) {
  return {
    encryptNote: async ({
      content,
      password,
      assets = [],
      encryptionAlgorithm = 'aes-256-gcm',
      serializationFormat = 'cbor-array',
    }: {
      content: string;
      password?: string;
      assets?: NoteAsset[];
      encryptionAlgorithm?: EncryptionAlgorithm;
      serializationFormat?: SerializationFormat;
    }) => {
      const { serializeNote } = getSerializationMethod({ serializationFormat });
      const { encryptBuffer } = getEncryptionMethod({ encryptionAlgorithm });

      const { baseKey } = generateBaseKey();

      const { masterKey } = await deriveMasterKey({ baseKey, password });

      const { noteBuffer } = await serializeNote({ note: { content, assets } });

      const { encryptedString: encryptedPayload } = await encryptBuffer({ buffer: noteBuffer, encryptionKey: masterKey });

      const encryptionKey = bufferToBase64Url({ buffer: baseKey });

      return { encryptedPayload, encryptionKey };
    },
  };
}

function createDecryptUsecase({
  deriveMasterKey,
  getDecryptionMethod,
}: {
  deriveMasterKey: ({ baseKey, password }: { baseKey: Uint8Array; password?: string }) => Promise<{ masterKey: Uint8Array }>;
  getDecryptionMethod: (args: { encryptionAlgorithm: string }) => { decryptString: (args: { encryptedString: string;encryptionKey: Uint8Array }) => Promise<{ decryptedBuffer: Uint8Array }> };
}) {
  return {
    decryptNote: async ({
      encryptedPayload,
      password,
      encryptionKey,
      serializationFormat = 'cbor-array',
      encryptionAlgorithm = 'aes-256-gcm',
    }: {
      encryptedPayload: string;
      password?: string;
      encryptionKey: string;
      serializationFormat?: SerializationFormat;
      encryptionAlgorithm?: EncryptionAlgorithm;
    }) => {
      const { parseNote } = getParsingMethod({ serializationFormat });
      const { decryptString } = getDecryptionMethod({ encryptionAlgorithm });

      const baseKey = base64UrlToBuffer({ base64Url: encryptionKey });

      const { masterKey } = await deriveMasterKey({ baseKey, password });

      const { decryptedBuffer } = await decryptString({ encryptedString: encryptedPayload, encryptionKey: masterKey });

      const { note } = await parseNote({ noteBuffer: decryptedBuffer });

      return { note };
    },
  };
}
