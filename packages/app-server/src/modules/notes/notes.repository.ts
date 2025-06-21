import type { Storage } from '../storage/storage.types';
import type { DatabaseNote, Note } from './notes.types';
import { injectArguments } from '@corentinth/chisels';
import { isCustomError } from '../shared/errors/errors';
import { generateId } from '../shared/utils/random';
import { KV_VALUE_LENGTH_EXCEEDED_ERROR_CODE } from '../storage/factories/cloudflare-kv.storage';
import { createNoteNotFoundError, createNotePayloadTooLargeError } from './notes.errors';
import { getNoteExpirationDate } from './notes.models';

export { createNoteRepository };

function createNoteRepository({ storage }: { storage: Storage }) {
  return injectArguments(
    {
      saveNote,
      getNoteById,
      getNotesIds,
      deleteNoteById,
      getNoteExists,
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
    isPublic,
  }:
  {
    payload: string;
    ttlInSeconds?: number;
    deleteAfterReading: boolean;
    storage: Storage<DatabaseNote>;
    generateNoteId?: () => string;
    now?: Date;
    encryptionAlgorithm: string;
    serializationFormat: string;
    isPublic: boolean;
  },
): Promise<{ noteId: string }> {
  try {
    const noteId = generateNoteId();
    const baseNote = {
      payload,
      deleteAfterReading,
      encryptionAlgorithm,
      serializationFormat,
      isPublic,
    };

    if (!ttlInSeconds) {
      await storage.setItem(noteId, baseNote);

      return { noteId };
    }

    const { expirationDate } = getNoteExpirationDate({ ttlInSeconds, now });

    await storage.setItem(
      noteId,
      {
        ...baseNote,
        expirationDate: expirationDate.toISOString(),
      },
      {
      // Some storage drivers have a different API for setting TTLs
        ttl: ttlInSeconds,
        // Cloudflare KV Binding - https://developers.cloudflare.com/kv/api/write-key-value-pairs/#create-expiring-keys
        expirationTtl: ttlInSeconds,
      },
    );

    return { noteId };
  } catch (error) {
    if (isCustomError(error) && error.code === KV_VALUE_LENGTH_EXCEEDED_ERROR_CODE) {
      throw createNotePayloadTooLargeError();
    }

    throw error;
  }
}

async function getNoteById({ noteId, storage }: { noteId: string; storage: Storage<DatabaseNote> }): Promise<{ note: Note }> {
  const note = await storage.getItem(noteId);

  if (!note) {
    throw createNoteNotFoundError();
  }

  return {
    note: {
      ...note,
      expirationDate: note.expirationDate ? new Date(note.expirationDate) : undefined,
    },
  };
}

async function deleteNoteById({ noteId, storage }: { noteId: string; storage: Storage }) {
  await storage.removeItem(noteId, { removeMeta: true });
}

async function getNoteExists({ noteId, storage }: { noteId: string; storage: Storage }) {
  const noteExists = await storage.hasItem(noteId);

  return { noteExists };
}
