import type { EncryptionAlgorithmDefinitions } from './encryption-algorithms/encryption-algorithms.types';
import { createEncryptionAlgorithmsRegistry } from './encryption-algorithms/encryption-algorithms.registry';

export { createEnclosedCryptoApi };

function createEnclosedCryptoApi({
  encryptionMethodDefinitions,
  ...api
}: {
  generateBaseKey: () => { baseKey: Uint8Array };
  deriveMasterKey: ({ baseKey, password }: { baseKey: Uint8Array; password?: string }) => Promise<{ masterKey: Uint8Array }>;
  base64UrlToBuffer: ({ base64Url }: { base64Url: string }) => Uint8Array;
  bufferToBase64Url: ({ buffer }: { buffer: Uint8Array }) => string;
  encryptionMethodDefinitions: EncryptionAlgorithmDefinitions;
}) {
  const { encryptionAlgorithms, getDecryptionMethod, getEncryptionMethod } = createEncryptionAlgorithmsRegistry({ encryptionMethodDefinitions });

  return {
    ...api,
    encryptionAlgorithms,
    encryptionMethodDefinitions,
    getDecryptionMethod,
    getEncryptionMethod,
  };
}
