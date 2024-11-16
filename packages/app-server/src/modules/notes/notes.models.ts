import type { Note } from './notes.types';
import { addSeconds, isBefore, isEqual } from 'date-fns';
import { isNil, omit } from 'lodash-es';

export { formatNoteForApi, getNoteExpirationDate, isNoteExpired };

function isNoteExpired({ note, now = new Date() }: { note: { expirationDate?: Date }; now?: Date }) {
  if (isNil(note.expirationDate)) {
    return false;
  }

  return isBefore(note.expirationDate, now) || isEqual(note.expirationDate, now);
}

function formatNoteForApi({ note }: { note: Note }) {
  return {
    apiNote: omit(note, ['expirationDate', 'deleteAfterReading', 'isPublic']),
  };
}

function getNoteExpirationDate({ ttlInSeconds, now = new Date() }: { ttlInSeconds: number; now?: Date }) {
  return {
    expirationDate: addSeconds(now, ttlInSeconds),
  };
}
