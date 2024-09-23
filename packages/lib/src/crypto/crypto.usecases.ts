import type { NoteAsset } from '../notes/notes.types';
import type { EncryptionAlgorithm } from './crypto.types';
import type { SerializationFormat } from './serialization/serialization.types';
import { base64UrlToBuffer, bufferToBase64Url, deriveMasterKey, generateBaseKey, getDecryptionMethod, getEncryptionMethod } from '@enclosed/crypto';
import { getParsingMethod, getSerializationMethod } from './serialization/serialization.registry';

export { decryptNote, encryptNote };

async function encryptNote({
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
}) {
  const { serializeNote } = getSerializationMethod({ serializationFormat });
  const { encryptBuffer } = getEncryptionMethod({ encryptionAlgorithm });

  const { baseKey } = generateBaseKey();

  const { masterKey } = await deriveMasterKey({ baseKey, password });

  const { noteBuffer } = await serializeNote({ note: { content, assets } });

  const { encryptedString: encryptedPayload } = await encryptBuffer({ buffer: noteBuffer, encryptionKey: masterKey });

  const encryptionKey = bufferToBase64Url({ buffer: baseKey });

  return { encryptedPayload, encryptionKey };
}

async function decryptNote({
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
}) {
  const { parseNote } = getParsingMethod({ serializationFormat });
  const { decryptString } = getDecryptionMethod({ encryptionAlgorithm });

  const baseKey = base64UrlToBuffer({ base64Url: encryptionKey });

  const { masterKey } = await deriveMasterKey({ baseKey, password });

  const { decryptedBuffer } = await decryptString({ encryptedString: encryptedPayload, encryptionKey: masterKey });

  const { note } = await parseNote({ noteBuffer: decryptedBuffer });

  return { note };
}
