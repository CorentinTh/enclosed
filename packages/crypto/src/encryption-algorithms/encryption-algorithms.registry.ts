import type { EncryptionAlgorithm, EncryptionMethodsDefinition } from './encryption-algorithms.types';
import { keys } from 'lodash-es';

export { createEncryptionAlgorithmsRegistry };

function createEncryptionAlgorithmsRegistry({
  encryptionMethodDefinitions,
}: {
  encryptionMethodDefinitions: Record<EncryptionAlgorithm, EncryptionMethodsDefinition>;
}) {
  const encryptionAlgorithms = keys(encryptionMethodDefinitions);

  return {
    encryptionMethodDefinitions,
    encryptionAlgorithms,

    getEncryptionMethod: ({ encryptionAlgorithm }: { encryptionAlgorithm: string }) => {
      const encryptionMethods: EncryptionMethodsDefinition | undefined = encryptionMethodDefinitions[encryptionAlgorithm];

      if (!encryptionMethods) {
        throw new Error(`Encryption algorithm "${encryptionAlgorithm}" not found`);
      }

      const { encryptBuffer } = encryptionMethods;

      return { encryptBuffer };
    },

    getDecryptionMethod: ({ encryptionAlgorithm }: { encryptionAlgorithm: string }) => {
      const encryptionMethods = encryptionMethodDefinitions[encryptionAlgorithm];

      if (!encryptionMethods) {
        throw new Error(`Decryption algorithm "${encryptionAlgorithm}" not found`);
      }

      const { decryptString } = encryptionMethods;

      return { decryptString };
    },

  };
};
