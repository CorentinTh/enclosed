import { createNoteUrl as createNoteUrlImpl, parseNoteUrl } from './notes.models';

export { createEnclosedLib };

const ONE_HOUR_IN_SECONDS = 60 * 60;
const BASE_URL = 'https://enclosed.cc';

function createEnclosedLib({
  encryptNote,
  // decryptNote,
  storeNote: storeNoteImpl,
  // fetchNote: fetchNoteImpl,
}: {
  encryptNote: (args: { content: string; password?: string }) => Promise<{ encryptedContent: string; encryptionKey: string }>;
  // decryptNote: (args: { encryptedContent: string; encryptionKey: string }) => Promise<{ content: string }>;
  storeNote: (params: { content: string; isPasswordProtected: boolean; ttlInSeconds: number; deleteAfterReading: boolean; apiBaseUrl?: string }) => Promise<{ noteId: string }>;
  // fetchNote: (params: { noteId: string; apiBaseUrl?: string }) => Promise<{ content: string; isPasswordProtected: boolean }>;
}) {
  return {
    parseNoteUrl,
    createNoteUrl: createNoteUrlImpl,

    createNote: async ({
      content,
      password,
      ttlInSeconds = ONE_HOUR_IN_SECONDS,
      deleteAfterReading = false,
      clientBaseUrl = BASE_URL,
      apiBaseUrl = clientBaseUrl,
      createNoteUrl = createNoteUrlImpl,
      storeNote = params => storeNoteImpl({ ...params, apiBaseUrl }),
    }: {
      content: string;
      password?: string;
      ttlInSeconds?: number;
      deleteAfterReading?: boolean;
      clientBaseUrl?: string;
      apiBaseUrl?: string;
      createNoteUrl?: (args: { noteId: string; encryptionKey: string; clientBaseUrl: string }) => { noteUrl: string };
      storeNote?: (params: { content: string; isPasswordProtected: boolean; ttlInSeconds: number; deleteAfterReading: boolean }) => Promise<{ noteId: string }>;
    }) => {
      const { encryptedContent, encryptionKey } = await encryptNote({ content, password });

      const { noteId } = await storeNote({ content: encryptedContent, isPasswordProtected: Boolean(password), ttlInSeconds, deleteAfterReading });

      const { noteUrl } = createNoteUrl({ noteId, encryptionKey, clientBaseUrl });

      return {
        encryptedContent,
        encryptionKey,
        noteId,
        noteUrl,
      };
    },
  };
};
