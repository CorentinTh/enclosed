import { describe, expect, test } from 'vitest';
import { decryptNote, encryptNote } from './notes.usecases';

describe('notes usecases', () => {
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
  });
});
