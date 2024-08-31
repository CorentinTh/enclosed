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
  try {
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
      },
    );

    return { noteId };
  } catch (baseError) {
    const error = new Error('Failed to store note');
    Object.assign(error, {
      cause: baseError,
    });

    throw error;
  }
}
