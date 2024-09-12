import { injectArguments } from '@corentinth/chisels';
import type { Storage } from '../storage/storage.types';
import { generateId } from '../shared/utils/random';
import { createNoteNotFoundError } from './notes.errors';
import { getNoteExpirationDate } from './notes.models';
import type { StoredNote } from './notes.types';

export { createNoteRepository };

function createNoteRepository({ storage }: { storage: Storage }) {
  return injectArguments(
    {
      saveNote,
      getNoteById,
      getNotesIds,
      deleteNoteById,
    },
    {
      storage,
    },
  );
}

async function getNotesIds({ storage }: { storage: Storage }) {
  const noteIds = await storage.getKeys();

  return { noteIds };
}

async function saveNote(
  {
    payload,
    ttlInSeconds,
    deleteAfterReading,
    storage,
    generateNoteId = generateId,
    now = new Date(),
    encryptionAlgorithm,
    serializationFormat,
  }:
  {
    payload: string;
    ttlInSeconds: number;
    deleteAfterReading: boolean;
    storage: Storage;
    generateNoteId?: () => string;
    now?: Date;
    encryptionAlgorithm: string;
    serializationFormat: string;
  },
) {
  const noteId = generateNoteId();
  const { expirationDate } = getNoteExpirationDate({ ttlInSeconds, now });

  await storage.setItem(
    noteId,
    {
      payload,
      expirationDate: expirationDate.toISOString(),
      deleteAfterReading,
      encryptionAlgorithm,
      serializationFormat,
    },
    {
      // Some storage drivers have a different API for setting TTLs
      ttl: ttlInSeconds,
      // Cloudflare KV Binding - https://developers.cloudflare.com/kv/api/write-key-value-pairs/#create-expiring-keys
      expirationTtl: ttlInSeconds,
    },
  );

  return { noteId };
}

async function getNoteById({ noteId, storage }: { noteId: string; storage: Storage }) {
  const note = await storage.getItem<StoredNote>(noteId);

  if (!note) {
    throw createNoteNotFoundError();
  }

  return {
    note: {
      ...note,
      expirationDate: new Date(note.expirationDate),
    },
  };
}

async function deleteNoteById({ noteId, storage }: { noteId: string; storage: Storage }) {
  await storage.removeItem(noteId, { removeMeta: true });
}
