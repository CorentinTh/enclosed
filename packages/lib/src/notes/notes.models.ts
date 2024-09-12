import { isEmpty } from 'lodash-es';

export { createNoteUrl, parseNoteUrl, createNoteUrlHashFragment, parseNoteUrlHashFragment };

function createNoteUrlHashFragment({ encryptionKey, isPasswordProtected }: { encryptionKey: string; isPasswordProtected?: boolean }) {
  const hashFragment = [
    isPasswordProtected && 'pw',
    encryptionKey,
  ].filter(Boolean).join(':');

  return hashFragment;
}

function parseNoteUrlHashFragment({ hashFragment }: { hashFragment: string }) {
  const cleanedHashFragment = hashFragment.replace(/^#/, '');

  if (isEmpty(cleanedHashFragment)) {
    throw new Error('Hash fragment is missing');
  }

  const segments = cleanedHashFragment.split(':');

  if (segments.length === 1) {
    return {
      isPasswordProtected: false,
      encryptionKey: segments[0],
    };
  }

  if (segments.length === 2 && segments[0] === 'pw') {
    return {
      isPasswordProtected: true,
      encryptionKey: segments[1],
    };
  }

  throw new Error('Invalid hash fragment');
}

function createNoteUrl({
  noteId,
  encryptionKey,
  clientBaseUrl,
  isPasswordProtected,
}: {
  noteId: string;
  encryptionKey: string;
  clientBaseUrl: string;
  isPasswordProtected?: boolean;
}): { noteUrl: string } {
  const hashFragment = createNoteUrlHashFragment({ encryptionKey, isPasswordProtected });

  const url = new URL(`/${noteId}`, clientBaseUrl);
  url.hash = hashFragment;

  const noteUrl = url.toString();

  return { noteUrl };
}

function parseNoteUrl({ noteUrl }: { noteUrl: string }): { noteId: string; encryptionKey: string; isPasswordProtected: boolean } {
  const url = new URL(noteUrl);

  const noteId = url.pathname.split('/').filter(Boolean).pop();

  if (!noteId) {
    throw new Error('Invalid note url');
  }

  const { encryptionKey, isPasswordProtected } = parseNoteUrlHashFragment({ hashFragment: url.hash });

  return { noteId, encryptionKey, isPasswordProtected };
}
