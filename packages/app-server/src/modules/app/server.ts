import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import type { Driver } from 'unstorage';
import { registerNotesRoutes } from '../notes/notes.routes';
import type { ServerInstanceGenerics } from './server.types';
import { corsMiddleware } from './middlewares/cors.middleware';
import { createConfigMiddleware } from './middlewares/config.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { registerErrorMiddleware } from './middlewares/errors.middleware';
import { createStorageMiddleware } from './middlewares/storage.middleware';
import type { Config } from './config/config.types';

export { createServer };

function createServer({ config, storageDriver }: { config?: Config; storageDriver?: Driver } = {}) {
  const app = new Hono<ServerInstanceGenerics>({ strict: true });

  app.use(loggerMiddleware);
  app.use(createConfigMiddleware({ config }));
  app.use(corsMiddleware);
  app.use(createStorageMiddleware({ driver: storageDriver }));
  app.use(secureHeaders());

  registerErrorMiddleware({ app });
  registerNotesRoutes({ app });

  app.get('/api/ping', context => context.json({ status: 'ok' }));

  return {
    app,
  };
}
