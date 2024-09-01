import { apiClient } from '../api/api.client';

export { storeNote, fetchNote };

async function storeNote({
  content,
  isPasswordProtected,
  ttlInSeconds,
  deleteAfterReading,
  apiBaseUrl,
}: {
  content: string;
  isPasswordProtected: boolean;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
  apiBaseUrl?: string;
}): Promise<{ noteId: string }> {
  const { noteId } = await apiClient<{ noteId: string }>({
    path: 'api/notes',
    baseUrl: apiBaseUrl,
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

async function fetchNote({
  noteId,
  apiBaseUrl,
}: {
  noteId: string;
  apiBaseUrl?: string;
}) {
  const { note } = await apiClient<{ note: { content: string; isPasswordProtected: boolean } }>({
    path: `api/notes/${noteId}`,
    baseUrl: apiBaseUrl,
    method: 'GET',
  });

  return note;
}
