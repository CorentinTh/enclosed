import { createErrorFactory } from '../shared/errors/errors';

export const createNoteNotFoundError = createErrorFactory({
  message: 'Note not found',
  code: 'note.not_found',
  statusCode: 404,
});
