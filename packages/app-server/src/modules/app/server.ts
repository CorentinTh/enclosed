import { Hono } from 'hono';
import { registerNotesRoutes } from '../notes/notes.routes';
import type { ServerInstanceGenerics } from './server.types';
import { corsMiddleware } from './middlewares/cors.middleware';
import { configMiddleware } from './middlewares/config.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { registerErrorMiddleware } from './middlewares/errors.middleware';
import { storageMiddleware } from './middlewares/storage.middleware';

export { createServer };

function createServer() {
  const app = new Hono<ServerInstanceGenerics>({ strict: true });

  app.use(loggerMiddleware);
  app.use(configMiddleware);
  app.use(corsMiddleware);
  app.use(storageMiddleware);

  registerErrorMiddleware({ app });
  registerNotesRoutes({ app });

  return {
    app,
  };
}
