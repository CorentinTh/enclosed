import type { COMPRESSION_ALGORITHMS, ENCRYPTION_ALGORITHMS, KEY_DERIVATION_ALGORITHMS } from './crypto.constants';

export type EncryptionAlgorithm = typeof ENCRYPTION_ALGORITHMS[number];
export type KeyDerivationAlgorithm = typeof KEY_DERIVATION_ALGORITHMS[number];
export type CompressionAlgorithm = typeof COMPRESSION_ALGORITHMS[number];

export type CryptoServices = {
  encryptNote: (args: { content: string; password?: string }) => Promise<{ encryptedContent: string; encryptionKey: string }>;
};
