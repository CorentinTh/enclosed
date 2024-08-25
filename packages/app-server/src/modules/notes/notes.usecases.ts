import { createNoteNotFoundError } from './notes.errors';
import { isNoteExpired } from './notes.models';
import type { NotesRepository } from './notes.types';

export { getRefreshedNote };

async function getRefreshedNote({
  noteId,
  notesRepository,
  now = new Date(),
}: {
  noteId: string;
  notesRepository: NotesRepository;
  now?: Date;
}) {
  const { note } = await notesRepository.getNoteById({ noteId });

  if (isNoteExpired({ note, now })) {
    await notesRepository.deleteNoteById({ noteId });

    throw createNoteNotFoundError();
  }

  if (note.deleteAfterReading) {
    await notesRepository.deleteNoteById({ noteId });
  }

  return {
    note,
  };
}
