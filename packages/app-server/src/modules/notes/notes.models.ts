import type { StoredNote } from './notes.types';
import { addSeconds, isBefore, isEqual } from 'date-fns';
import { omit } from 'lodash-es';

export { formatNoteForApi, getNoteExpirationDate, isNoteExpired };

function isNoteExpired({ note, now = new Date() }: { note: { expirationDate: Date }; now?: Date }) {
  return isBefore(note.expirationDate, now) || isEqual(note.expirationDate, now);
}

function formatNoteForApi({ note }: { note: StoredNote }) {
  return {
    apiNote: omit(note, ['expirationDate', 'deleteAfterReading']),
  };
}

function getNoteExpirationDate({ ttlInSeconds, now = new Date() }: { ttlInSeconds: number; now?: Date }) {
  return {
    expirationDate: addSeconds(now, ttlInSeconds),
  };
}
