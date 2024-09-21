import type { ENCRYPTION_ALGORITHMS } from './encryption-algorithms.constants';

export type EncryptionMethodsDefinition = {
  encryptBuffer: (args: { buffer: Uint8Array; encryptionKey: Uint8Array }) => Promise<{ encryptedString: string }>;
  decryptString: (args: { encryptedString: string; encryptionKey: Uint8Array }) => Promise<{ decryptedBuffer: Uint8Array }>;
};

export type EncryptionAlgorithm = typeof ENCRYPTION_ALGORITHMS[number];

export type EncryptionAlgorithmDefinitions = Record<EncryptionAlgorithm, EncryptionMethodsDefinition>;
