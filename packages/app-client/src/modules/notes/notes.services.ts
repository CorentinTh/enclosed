import { apiClient } from '../shared/http/http-client';

export { storeNote, fetchNoteById };

async function storeNote({ content, isPasswordProtected, ttlInSeconds, deleteAfterReading }: { content: string; isPasswordProtected: boolean; ttlInSeconds: number; deleteAfterReading: boolean }) {
  const { noteId } = await apiClient<{ noteId: string }>({
    path: '/api/notes',
    method: 'POST',
    body: {
      content,
      isPasswordProtected,
      ttlInSeconds,
      deleteAfterReading,
    },
  });

  return { noteId };
}

async function fetchNoteById({ noteId }: { noteId: string }) {
  const { note } = await apiClient<{ note: { content: string; isPasswordProtected: boolean } }>({
    path: `/api/notes/${noteId}`,
    method: 'GET',
  });

  return { note };
}
