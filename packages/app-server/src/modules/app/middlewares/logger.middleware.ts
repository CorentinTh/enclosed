import { createMiddleware } from 'hono/factory';
import { createLogger } from '../../shared/logger/logger';

const logger = createLogger({ namespace: 'app' });

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const requestedAt = new Date();

  await next();

  const durationMs = new Date().getTime() - requestedAt.getTime();

  logger.info(
    {
      status: c.res.status,
      method: c.req.method,
      path: c.req.path,
      routePath: c.req.routePath,
      durationMs,
    },
    'Request completed',
  );
});
