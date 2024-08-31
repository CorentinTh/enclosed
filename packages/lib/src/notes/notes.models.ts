export { createNoteUrl };

function createNoteUrl({ noteId, encryptionKey, clientBaseUrl }: { noteId: string; encryptionKey: string; clientBaseUrl: string }): { noteUrl: string } {
  const url = new URL(`/${noteId}`, clientBaseUrl);
  url.hash = encryptionKey;

  const noteUrl = url.toString();

  return { noteUrl };
}
