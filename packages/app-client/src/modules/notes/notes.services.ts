import { apiClient } from '../shared/http/http-client';

export { fetchNoteById, storeNote };

async function storeNote({
  payload,
  ttlInSeconds,
  deleteAfterReading,
  encryptionAlgorithm,
  serializationFormat,
  isPublic,
}: {
  payload: string;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
  encryptionAlgorithm: string;
  serializationFormat: string;
  isPublic?: boolean;
}) {
  const { noteId } = await apiClient<{ noteId: string }>({
    path: '/api/notes',
    method: 'POST',
    body: {
      payload,
      ttlInSeconds,
      deleteAfterReading,
      serializationFormat,
      encryptionAlgorithm,
      isPublic,
    },
  });

  return { noteId };
}

async function fetchNoteById({ noteId }: { noteId: string }) {
  const { note } = await apiClient<{ note: {
    payload: string;
    isPasswordProtected: boolean;
    assets: string[];
    serializationFormat: string;
    encryptionAlgorithm: string;
  }; }>({
    path: `/api/notes/${noteId}`,
    method: 'GET',
  });

  return { note };
}
