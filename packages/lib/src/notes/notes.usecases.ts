import { createNoteUrl as createNoteUrlImpl } from './notes.models';

export { createEnclosedLib };

const ONE_HOUR_IN_SECONDS = 60 * 60;
const BASE_URL = 'https://enclosed.cc';
const DEFAULT_NOTE_CREATION_API_URL = 'https://enclosed.cc/api/notes';

function createEnclosedLib({
  encryptNote,
  storeNote: storeNoteImpl,
}: {
  encryptNote: (args: { content: string; password?: string }) => Promise<{ encryptedContent: string; encryptionKey: string }>;
  storeNote: (params: { content: string; isPasswordProtected: boolean; ttlInSeconds: number; deleteAfterReading: boolean; noteCreationApiUrl: string }) => Promise<{ noteId: string }>;
}) {
  return {
    createNote: async ({
      content,
      password,
      ttlInSeconds = ONE_HOUR_IN_SECONDS,
      deleteAfterReading = false,
      noteCreationApiUrl = DEFAULT_NOTE_CREATION_API_URL,
      clientBaseUrl = BASE_URL,
      createNoteUrl = createNoteUrlImpl,
      storeNote = params => storeNoteImpl({ ...params, noteCreationApiUrl }),
    }: {
      content: string;
      password?: string;
      ttlInSeconds?: number;
      deleteAfterReading?: boolean;
      clientBaseUrl?: string;
      noteCreationApiUrl?: string;
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
}
