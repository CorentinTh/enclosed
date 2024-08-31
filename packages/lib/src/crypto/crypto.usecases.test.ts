import { describe, expect, test } from 'vitest';
import { createDecryptUsecase, createEncryptUsecase } from './crypto.usecases';
import * as nodeCryptoLib from './node/crypto.node.usecases';
import * as webCryptoLib from './web/crypto.web.usecases';

export { runCommonCryptoUsecasesTests };

function runCommonCryptoUsecasesTests({
  encryptNote,
  decryptNote,
}: {
  encryptNote: (args: { content: string; password?: string }) => Promise<{ encryptedContent: string; encryptionKey: string }>;
  decryptNote: (args: { encryptedContent: string; password?: string; encryptionKey: string }) => Promise<{ decryptedContent: string }>;
}) {
  describe('encryption and decryption', () => {
    describe('without password', () => {
      test('a note can be decrypted with the same key used for encryption', async () => {
        const content = 'Hello, world!';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
        });

        const { decryptedContent } = await decryptNote({
          encryptedContent,
          encryptionKey,
        });

        expect(decryptedContent).toBe(content);
      });

      test('a slight variation in the encryption key results in an impossible decryption', async () => {
        const content = 'Hello, world!';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
        });

        expect(
          decryptNote({
            encryptedContent,
            encryptionKey: `${encryptionKey}a`,
          }),
        ).rejects.toThrow();

        expect(
          decryptNote({
            encryptedContent,
            encryptionKey: encryptionKey.slice(0, -1),
          }),
        ).rejects.toThrow();
      });

      test('a slight variation in the encrypted content results in an impossible decryption', async () => {
        const content = 'Hello, world!';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
        });

        expect(
          decryptNote({
            encryptedContent: `${encryptedContent}a`,
            encryptionKey,
          }),
        ).rejects.toThrow();

        expect(
          decryptNote({
            encryptedContent: encryptedContent.slice(0, -1),
            encryptionKey,
          }),
        ).rejects.toThrow();
      });

      test('an empty string as a password is the same as no password', async () => {
        const content = 'Hello, world!';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
          password: '',
        });

        const { decryptedContent } = await decryptNote({
          encryptedContent,
          encryptionKey,
          password: '',
        });

        expect(decryptedContent).toBe(content);
      });
    });

    describe('with password', () => {
      test('a note can be decrypted with the same base key and password used for encryption', async () => {
        const content = 'Hello, world!';
        const password = 'password';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
          password,
        });

        const { decryptedContent } = await decryptNote({
          encryptedContent,
          encryptionKey,
          password,
        });

        expect(decryptedContent).toBe(content);
      });

      test('a slight variation in the encryption key results in an impossible decryption', async () => {
        const content = 'Hello, world!';
        const password = 'password';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
          password,
        });

        expect(
          decryptNote({
            encryptedContent,
            encryptionKey: `${encryptionKey}a`,
            password,
          }),
        ).rejects.toThrow();

        expect(
          decryptNote({
            encryptedContent,
            encryptionKey: encryptionKey.slice(0, -1),
            password,
          }),
        ).rejects.toThrow();
      });

      test('a slight variation in the encrypted content results in an impossible decryption', async () => {
        const content = 'Hello, world!';
        const password = 'password';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
          password,
        });

        expect(
          decryptNote({
            encryptedContent: `${encryptedContent}a`,
            encryptionKey,
            password,
          }),
        ).rejects.toThrow();

        expect(
          decryptNote({
            encryptedContent: encryptedContent.slice(0, -1),
            encryptionKey,
            password,
          }),
        ).rejects.toThrow();
      });

      test('if the password used for decryption is different from the one used for encryption, the note cannot be decrypted', async () => {
        const content = 'Hello, world!';
        const password = 'password';

        const { encryptedContent, encryptionKey } = await encryptNote({
          content,
          password,
        });

        expect(
          decryptNote({
            encryptedContent,
            encryptionKey,
            password: 'different password',
          }),
        ).rejects.toThrow();
      });
    });

    test('if the encrypted content does not include the iv, the note cannot be decrypted', async () => {
      const content = 'Hello, world!';
      const password = 'password';

      const { encryptedContent, encryptionKey } = await encryptNote({
        content,
        password,
      });

      const [_ivString, encryptedStringWithAuthTag] = encryptedContent.split(':').map(part => part.trim());

      const encryptedContentWithoutIv = encryptedStringWithAuthTag;

      expect(
        decryptNote({
          encryptedContent: encryptedContentWithoutIv,
          encryptionKey,
          password,
        }),
      ).rejects.toThrow();
    });
  });
}

describe('cross-environment encryption and decryption', () => {
  test('a note encrypted in the web environment can be decrypted in the node environment', async () => {
    const content = 'Hello, world!';
    const password = 'password';

    const { encryptNote } = createEncryptUsecase(webCryptoLib);
    const { decryptNote } = createDecryptUsecase(nodeCryptoLib);

    const { encryptedContent, encryptionKey } = await encryptNote({
      content,
      password,
    });

    const { decryptedContent } = await decryptNote({
      encryptedContent,
      encryptionKey,
      password,
    });

    expect(decryptedContent).toBe(content);
  });

  test('a note encrypted in the node environment can be decrypted in the web environment', async () => {
    const content = 'Hello, world!';
    const password = 'password';

    const { encryptNote } = createEncryptUsecase(nodeCryptoLib);
    const { decryptNote } = createDecryptUsecase(webCryptoLib);

    const { encryptedContent, encryptionKey } = await encryptNote({
      content,
      password,
    });

    const { decryptedContent } = await decryptNote({
      encryptedContent,
      encryptionKey,
      password,
    });

    expect(decryptedContent).toBe(content);
  });
});
