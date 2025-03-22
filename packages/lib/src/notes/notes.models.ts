import { buildUrl } from '@corentinth/chisels';
import { isEmpty } from 'lodash-es';

export { createNoteUrl, createNoteUrlHashFragment, parseNoteUrl, parseNoteUrlHashFragment };

const PASSWORD_PROTECTED_HASH_FRAGMENT = 'pw';
const DELETED_AFTER_READING_HASH_FRAGMENT = 'dar';

function createNoteUrlHashFragment({ encryptionKey, isPasswordProtected, isDeletedAfterReading }: { encryptionKey: string; isPasswordProtected?: boolean; isDeletedAfterReading?: boolean }) {
  const hashFragment = [
    isPasswordProtected && PASSWORD_PROTECTED_HASH_FRAGMENT,
    isDeletedAfterReading && DELETED_AFTER_READING_HASH_FRAGMENT,
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
  const encryptionKey = segments.pop();

  const hasInvalidSegments = segments.some(segment => ![PASSWORD_PROTECTED_HASH_FRAGMENT, DELETED_AFTER_READING_HASH_FRAGMENT].includes(segment));

  if (!encryptionKey || hasInvalidSegments) {
    throw new Error('Invalid hash fragment');
  }

  return {
    encryptionKey,
    isPasswordProtected: segments.includes(PASSWORD_PROTECTED_HASH_FRAGMENT),
    isDeletedAfterReading: segments.includes(DELETED_AFTER_READING_HASH_FRAGMENT),
  };
}

function createNoteUrl({
  noteId,
  encryptionKey,
  clientBaseUrl,
  isPasswordProtected,
  isDeletedAfterReading,
  pathPrefix,
}: {
  noteId: string;
  encryptionKey: string;
  clientBaseUrl: string;
  isPasswordProtected?: boolean;
  isDeletedAfterReading?: boolean;
  pathPrefix?: string;
}): { noteUrl: string } {
  const hashFragment = createNoteUrlHashFragment({ encryptionKey, isPasswordProtected, isDeletedAfterReading });

  const noteUrl = buildUrl({
    path: [pathPrefix, noteId],
    hash: hashFragment,
    baseUrl: clientBaseUrl,
  });

  return { noteUrl };
}

function parseNoteUrl({ noteUrl }: { noteUrl: string }) {
  const url = new URL(noteUrl);

  const noteId = url.pathname.split('/').filter(Boolean).pop();

  if (!noteId) {
    throw new Error('Invalid note url');
  }

  const { encryptionKey, isPasswordProtected, isDeletedAfterReading } = parseNoteUrlHashFragment({ hashFragment: url.hash });

  return { noteId, encryptionKey, isPasswordProtected, isDeletedAfterReading };
}
