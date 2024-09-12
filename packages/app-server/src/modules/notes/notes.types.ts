import type { createNoteRepository } from './notes.repository';

export type NotesRepository = ReturnType<typeof createNoteRepository>;

export type StoredNote = {
  payload: string;
  encryptionAlgorithm: string;
  serializationFormat: string;
  expirationDate: Date;
  deleteAfterReading: boolean;

  // compressionAlgorithm: string
  // keyDerivationAlgorithm: string;

};
