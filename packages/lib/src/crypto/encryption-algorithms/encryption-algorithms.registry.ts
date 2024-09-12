import type { EncryptionMethodsDefinition } from './encryption-algorithms.types';
import { keyBy } from 'lodash-es';

export { createEncryptionAlgorithmsRegistry };

function createEncryptionAlgorithmsRegistry({ encryptionMethodDefinitions }: { encryptionMethodDefinitions: EncryptionMethodsDefinition[] }) {
  const encryptionMethodDefinitionsByName: Record<string, EncryptionMethodsDefinition> = keyBy(encryptionMethodDefinitions, 'name');
  const encryptionAlgorithms = encryptionMethodDefinitions.map(({ name }) => name);

  return {
    encryptionMethodDefinitions,
    encryptionMethodDefinitionsByName,
    encryptionAlgorithms,

    getEncryptionMethod: ({ encryptionAlgorithm }: { encryptionAlgorithm: string }) => {
      const encryptionMethods = encryptionMethodDefinitionsByName[encryptionAlgorithm];

      if (!encryptionMethods) {
        throw new Error(`Encryption algorithm "${encryptionAlgorithm}" not found`);
      }

      const { encryptBuffer } = encryptionMethods;

      return { encryptBuffer };
    },

    getDecryptionMethod: ({ encryptionAlgorithm }: { encryptionAlgorithm: string }) => {
      const encryptionMethods = encryptionMethodDefinitionsByName[encryptionAlgorithm];

      if (!encryptionMethods) {
        throw new Error(`Encryption algorithm "${encryptionAlgorithm}" not found`);
      }

      const { decryptString } = encryptionMethods;

      return { decryptString };
    },

  };
};
