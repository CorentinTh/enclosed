import { base64UrlToBuffer, bufferToBase64Url } from './web/crypto.web.models';

export { createEncryptUsecase, createDecryptUsecase };

function createEncryptUsecase({
  generateBaseKey,
  deriveMasterKey,
  encryptNoteContent,
}: {
  generateBaseKey: () => { baseKey: Uint8Array };
  deriveMasterKey: ({ baseKey, password }: { baseKey: Uint8Array; password?: string }) => Promise<{ masterKey: Uint8Array }>;
  encryptNoteContent: ({ content, masterKey }: { content: string; masterKey: Uint8Array }) => Promise<{ encryptedContent: string }>;
}) {
  return {
    encryptNote: async ({ content, password }: { content: string; password?: string }) => {
      const { baseKey } = generateBaseKey();

      const { masterKey } = await deriveMasterKey({ baseKey, password });

      const { encryptedContent } = await encryptNoteContent({ content, masterKey });

      const encryptionKey = bufferToBase64Url({ buffer: baseKey });

      return { encryptedContent, encryptionKey };
    },
  };
}

function createDecryptUsecase({
  deriveMasterKey,
  decryptNoteContent,
}: {
  deriveMasterKey: ({ baseKey, password }: { baseKey: Uint8Array; password?: string }) => Promise<{ masterKey: Uint8Array }>;
  decryptNoteContent: ({ encryptedContent, masterKey }: { encryptedContent: string; masterKey: Uint8Array }) => Promise<{ decryptedContent: string }>;
}) {
  return {
    decryptNote: async ({ encryptedContent, password, encryptionKey }: { encryptedContent: string; password?: string; encryptionKey: string }) => {
      const baseKey = base64UrlToBuffer({ base64Url: encryptionKey });

      const { masterKey } = await deriveMasterKey({ baseKey, password });

      const { decryptedContent } = await decryptNoteContent({ encryptedContent, masterKey });

      return { decryptedContent };
    },
  };
}
