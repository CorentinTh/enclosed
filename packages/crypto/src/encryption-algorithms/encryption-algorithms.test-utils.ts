import type { EncryptionMethodsDefinition } from './encryption-algorithms.types';
import { times } from 'lodash-es';
import { describe, expect, test } from 'vitest';

export {
  runCommonEncryptionAlgorithmTest,
};

function runCommonEncryptionAlgorithmTest({
  encryptionMethodDefinition,
}: {
  encryptionMethodDefinition: EncryptionMethodsDefinition;
}) {
  const { encryptBuffer, decryptString } = encryptionMethodDefinition;

  describe('encryptBuffer and decryptString', () => {
    test('an encrypted buffer can be decrypted', async () => {
      const encryptionKey = new Uint8Array(times(32, i => i));
      const buffer = new Uint8Array([11, 22, 33, 44, 55, 66, 77, 88]);

      const { encryptedString } = await encryptBuffer({ buffer, encryptionKey });
      const { decryptedBuffer } = await decryptString({ encryptedString, encryptionKey });

      expect(decryptedBuffer).to.eql(buffer);
    });
  });
}
