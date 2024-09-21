import { describe, expect, test } from 'vitest';
import { runCommonEncryptionAlgorithmTest } from '../../encryption-algorithms/encryption-algorithms.test-utils';
import { aes256GcmEncryptionAlgorithmDefinition } from './crypto.node.aes-256-gcm';

describe('crypto node aes-256-gcm', () => {
  describe('aes256GcmEncryptionAlgorithmDefinition', () => {
    runCommonEncryptionAlgorithmTest({
      encryptionMethodDefinition: aes256GcmEncryptionAlgorithmDefinition,
    });

    describe('decryptString', () => {
      test('when the encrypted string does not contain the IV or the encrypted content, an error is thrown', async () => {
        const { decryptString } = aes256GcmEncryptionAlgorithmDefinition;
        const encryptionKey = new Uint8Array(32);
        const encryptedString = 'invalid encrypted string';

        await expect(decryptString({ encryptedString, encryptionKey })).rejects.toThrow('Invalid encrypted content');
      });
    });
  });
});
