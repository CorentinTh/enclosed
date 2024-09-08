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

  /**
   * @deprecated Password protection information should be stored in the url
   */
  isPasswordProtected: boolean;
};
