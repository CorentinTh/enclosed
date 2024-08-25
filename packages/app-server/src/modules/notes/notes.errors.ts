import { createErrorFactory } from '../shared/errors/errors';

export const createNoteNotFoundError = createErrorFactory({
  message: 'Note not found',
  code: 'note.not_found',
  statusCode: 404,
});

export const createNoteContentTooLargeError = createErrorFactory({
  message: 'Note content is too large',
  code: 'note.content_too_large',
  statusCode: 413,
});
