export { createNoteUrl, parseNoteUrl };

function createNoteUrl({ noteId, encryptionKey, clientBaseUrl }: { noteId: string; encryptionKey: string; clientBaseUrl: string }): { noteUrl: string } {
  const url = new URL(`/${noteId}`, clientBaseUrl);
  url.hash = encryptionKey;

  const noteUrl = url.toString();

  return { noteUrl };
}

function parseNoteUrl({ noteUrl }: { noteUrl: string }): { noteId: string; encryptionKey: string } {
  const url = new URL(noteUrl);

  const noteId = url.pathname.split('/').filter(Boolean).pop();
  const encryptionKey = url.hash.replace(/^#/, '');

  if (!noteId || !encryptionKey) {
    throw new Error('Invalid note url');
  }

  return { noteId, encryptionKey };
}
