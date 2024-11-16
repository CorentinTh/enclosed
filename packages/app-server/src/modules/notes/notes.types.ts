import type { Expand } from '@corentinth/chisels';
import type { createNoteRepository } from './notes.repository';

export type NotesRepository = ReturnType<typeof createNoteRepository>;

export type DatabaseNote = {
  payload: string;
  encryptionAlgorithm: string;
  serializationFormat: string;
  expirationDate?: string;
  deleteAfterReading: boolean;
  isPublic: boolean;

  // compressionAlgorithm: string
  // keyDerivationAlgorithm: string;

};

export type Note = Expand<Omit<DatabaseNote, 'expirationDate'> & { expirationDate?: Date }>;
