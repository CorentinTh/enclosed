import { apiClient } from '../api/api.client';

export { storeNote, fetchNote };

async function storeNote({
  payload,
  isPasswordProtected,
  ttlInSeconds,
  deleteAfterReading,
  apiBaseUrl,
  serializationFormat,
  encryptionAlgorithm,
}: {
  payload: string;
  isPasswordProtected: boolean;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
  apiBaseUrl?: string;
  serializationFormat: string;
  encryptionAlgorithm: string;
}): Promise<{ noteId: string }> {
  const { noteId } = await apiClient<{ noteId: string }>({
    path: 'api/notes',
    baseUrl: apiBaseUrl,
    method: 'POST',
    body: {
      payload,
      isPasswordProtected,
      ttlInSeconds,
      deleteAfterReading,
      serializationFormat,
      encryptionAlgorithm,
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
    isPasswordProtected: boolean;
  }; }>({
    path: `api/notes/${noteId}`,
    baseUrl: apiBaseUrl,
    method: 'GET',
  });

  return note;
}
