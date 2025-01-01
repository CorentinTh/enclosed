import { createErrorFactory } from '../../shared/errors/errors';

export const createUserAlreadyExistsError = createErrorFactory({
  code: 'users.create.already_exists',
  message: 'User already exists',
  statusCode: 409,
});
