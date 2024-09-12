import { createEncryptionAlgorithmsRegistry } from '../../encryption-algorithms/encryption-algorithms.registry';
import { aes256GcmEncryptionAlgorithmDefinition } from './crypto.web.aes-256-gcm';

const encryptionMethodDefinitions = [
  aes256GcmEncryptionAlgorithmDefinition,
];

export const {
  encryptionAlgorithms,
  encryptionMethodDefinitionsByName,
  getDecryptionMethod,
  getEncryptionMethod,
} = createEncryptionAlgorithmsRegistry({ encryptionMethodDefinitions });
