import { createErrorFactory } from '../../shared/errors/errors';

export const createUnauthorizedError = createErrorFactory({
  message: 'Unauthorized',
  code: 'auth.unauthorized',
  statusCode: 401,
});
