import type { EncryptionAlgorithmDefinitions } from './encryption-algorithms.types';
import { describe, expect, test } from 'vitest';
import { createEncryptionAlgorithmsRegistry } from './encryption-algorithms.registry';

describe('encryption-algorithms registry', () => {
  describe('createEncryptionAlgorithmsRegistry', () => {
    const dummyEncryptionAlgorithmDefinition = {
      encryptBuffer: async () => ({ encryptedString: '' }),
      decryptString: async () => ({ decryptedBuffer: new Uint8Array() }),
    };

    describe('the encryption algorithms registry exposed methods to manage multiples encryption algorithms', () => {
      test('when creating the registry, it exposes the available encryption algorithms names and definition', () => {
        const { encryptionAlgorithms, encryptionMethodDefinitions } = createEncryptionAlgorithmsRegistry({
          encryptionMethodDefinitions: {
            'aes-256-gcm': dummyEncryptionAlgorithmDefinition,
            'foo': dummyEncryptionAlgorithmDefinition,
          } as EncryptionAlgorithmDefinitions,
        });

        expect(encryptionAlgorithms).to.eql(['aes-256-gcm', 'foo']);
        expect(encryptionMethodDefinitions).to.eql({
          'aes-256-gcm': dummyEncryptionAlgorithmDefinition,
          'foo': dummyEncryptionAlgorithmDefinition,
        });
      });

      test('you can get the encryption method definition by its name', () => {
        const { getEncryptionMethod } = createEncryptionAlgorithmsRegistry({
          encryptionMethodDefinitions: {
            'aes-256-gcm': dummyEncryptionAlgorithmDefinition,
            'foo': dummyEncryptionAlgorithmDefinition,
          } as EncryptionAlgorithmDefinitions,
        });

        const { encryptBuffer } = getEncryptionMethod({ encryptionAlgorithm: 'aes-256-gcm' });

        expect(encryptBuffer).to.be.a('function');
      });

      test('if the encryption method does not exist, an error is thrown', () => {
        const { getEncryptionMethod } = createEncryptionAlgorithmsRegistry({
          encryptionMethodDefinitions: {
            'aes-256-gcm': dummyEncryptionAlgorithmDefinition,
          },
        });

        expect(() => getEncryptionMethod({ encryptionAlgorithm: 'foo' })).to.throw('Encryption algorithm "foo" not found');
      });

      test('you can get the decryption method definition by its name', () => {
        const { getDecryptionMethod } = createEncryptionAlgorithmsRegistry({
          encryptionMethodDefinitions: {
            'aes-256-gcm': {
              encryptBuffer: async () => ({ encryptedString: 'encrypted using aes-256-gcm' }),
              decryptString: async () => ({ decryptedBuffer: new Uint8Array([1]) }),
            },
            'foo': {
              encryptBuffer: async () => ({ encryptedString: 'encrypted using foo' }),
              decryptString: async () => ({ decryptedBuffer: new Uint8Array([2]) }),
            },
          } as EncryptionAlgorithmDefinitions,
        });

        const { decryptString } = getDecryptionMethod({ encryptionAlgorithm: 'foo' });

        expect(decryptString).to.be.a('function');
      });

      test('if the decryption method does not exist, an error is thrown', () => {
        const { getDecryptionMethod } = createEncryptionAlgorithmsRegistry({
          encryptionMethodDefinitions: {
            'aes-256-gcm': dummyEncryptionAlgorithmDefinition,
          },
        });

        expect(() => getDecryptionMethod({ encryptionAlgorithm: 'foo' })).to.throw('Decryption algorithm "foo" not found');
      });
    });
  });
});
