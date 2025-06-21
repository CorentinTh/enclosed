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

export const createCannotCreatePrivateNoteOnPublicInstanceError = createErrorFactory({
  message: 'Cannot create private note on public instance',
  code: 'note.cannot_create_private_note_on_public_instance',
  statusCode: 403,
});

export const createExpirationDelayRequiredError = createErrorFactory({
  message: 'Expiration delay is required',
  code: 'note.expiration_delay_required',
  statusCode: 400,
});
