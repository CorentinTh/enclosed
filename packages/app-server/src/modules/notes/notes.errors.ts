import { createErrorFactory } from '../shared/errors/errors';

export const createNoteNotFoundError = createErrorFactory({
  message: 'Note not found',
  code: 'note.not_found',
  statusCode: 404,
});

export const createNotePayloadTooLargeError = createErrorFactory({
  message: 'Note payload is too large',
  code: 'note.payload_too_large',
  statusCode: 413,
});
