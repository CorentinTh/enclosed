import { apiClient } from '../api/api.client';

export { fetchNote, storeNote };

async function storeNote({
  payload,
  ttlInSeconds,
  resultFormat,
  deleteAfterReading,
  apiBaseUrl,
  serializationFormat,
  encryptionAlgorithm,
  isPublic,
}: {
  payload: string;
  ttlInSeconds?: number;
  resultFormat: 'raw' | 'code' | 'markdown';
  deleteAfterReading: boolean;
  apiBaseUrl?: string;
  serializationFormat: string;
  encryptionAlgorithm: string;
  isPublic?: boolean;
}): Promise<{ noteId: string }> {
  const { noteId } = await apiClient<{ noteId: string }>({
    path: 'api/notes',
    baseUrl: apiBaseUrl,
    method: 'POST',
    body: {
      payload,
      ttlInSeconds,
      resultFormat,
      deleteAfterReading,
      serializationFormat,
      encryptionAlgorithm,
      isPublic,
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
  const { note } = await apiClient<{ note: {
    payload: string;
  }; }>({
    path: `api/notes/${noteId}`,
    baseUrl: apiBaseUrl,
    method: 'GET',
  });

  return note;
}
