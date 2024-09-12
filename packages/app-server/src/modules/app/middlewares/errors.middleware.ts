import type { ServerInstance } from '../server.types';
import { isCustomError } from '../../shared/errors/errors';
import { createLogger } from '../../shared/logger/logger';

const logger = createLogger({ namespace: 'middlewares:error' });

export function registerErrorMiddleware({ app }: { app: ServerInstance }) {
  app.onError((error, context) => {
    logger.error({ error }, error.message ?? 'Error occurred');

    if (isCustomError(error) && !error.isInternal) {
      return context.json(
        {
          error: {
            message: error.message,
            code: error.code,
          },
        },
        error.statusCode,
      );
    }

    return context.json(
      {
        error: { message: 'Internal server error' },
      },
      500,
    );
  });

  app.notFound((context) => {
    return context.json(
      {
        error: {
          message: 'API route not found',
          code: 'api.not-found',
        },
      },
      404,
    );
  });
}
