import type { CompressionAlgorithm, EncryptionAlgorithm, KeyDerivationAlgorithm } from '../crypto/crypto.types';
import type { SerializationFormat } from '../crypto/serialization/serialization.types';

export type NoteAsset = {
  metadata: {
    type: string;
    [key: string]: unknown ;
  };
  content: Uint8Array;
};

export type Note = {
  content: string;
  assets: NoteAsset[];
};

export type EncryptedNote = {
  version: number;
  payload: string;
  encryptionAlgorithm: EncryptionAlgorithm;
  serializationFormat: SerializationFormat;
  keyDerivationAlgorithm: KeyDerivationAlgorithm;
  compressionAlgorithm: CompressionAlgorithm;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
};
