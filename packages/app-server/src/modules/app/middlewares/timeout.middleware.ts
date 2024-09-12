import type { Context } from '../server.types';
import { createMiddleware } from 'hono/factory';
import { createError } from '../../shared/errors/errors';

export const timeoutMiddleware = createMiddleware(async (context: Context, next) => {
  const { server: { routeTimeoutMs } } = context.get('config');

  let timerId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => reject(
      createError({
        code: 'api.timeout',
        message: 'The request timed out',
        statusCode: 504,
      }),
    ), routeTimeoutMs);
  });

  try {
    await Promise.race([next(), timeoutPromise]);
  } finally {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  }
});
