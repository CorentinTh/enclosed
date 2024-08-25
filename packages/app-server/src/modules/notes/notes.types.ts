import type { createNoteRepository } from './notes.repository';

export type NotesRepository = ReturnType<typeof createNoteRepository>;

export type StoredNote = {
  content: string;
  isPasswordProtected: boolean;
  expirationDate: Date;
  deleteAfterReading: boolean;
};
