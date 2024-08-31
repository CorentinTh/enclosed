import { ofetch } from 'ofetch';

export { storeNote };

async function storeNote({
  content,
  isPasswordProtected,
  ttlInSeconds,
  deleteAfterReading,
  noteCreationApiUrl,
}: {
  content: string;
  isPasswordProtected: boolean;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
  noteCreationApiUrl: string;
}): Promise<{ noteId: string }> {
  const { noteId } = await ofetch<{ noteId: string }>(
    noteCreationApiUrl,
    {
      method: 'POST',
      body: {
        content,
        isPasswordProtected,
        ttlInSeconds,
        deleteAfterReading,
      },
      onResponseError: async ({ response }) => {
        throw Object.assign(new Error('Failed to create note'), { response });
      },
    },
  );

  return { noteId };
}
