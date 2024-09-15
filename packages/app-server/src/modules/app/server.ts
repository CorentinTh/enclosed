import type { BindableStorageFactory } from '../storage/storage.types';
import type { Config } from './config/config.types';
import type { ServerInstanceGenerics } from './server.types';
import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { registerNotesRoutes } from '../notes/notes.routes';
import { authenticationMiddleware } from './auth/auth.middleware';
import { registerAuthRoutes } from './auth/auth.routes';
import { registerConfigRoutes } from './config/config.routes';
import { createConfigMiddleware } from './middlewares/config.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';
import { registerErrorMiddleware } from './middlewares/errors.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { createStorageMiddleware } from './middlewares/storage.middleware';
import { timeoutMiddleware } from './middlewares/timeout.middleware';

export { createServer };

function createServer({ config, storageFactory }: { config?: Config; storageFactory: BindableStorageFactory }) {
  const app = new Hono<ServerInstanceGenerics>({ strict: true });

  app.use(loggerMiddleware);
  app.use(createConfigMiddleware({ config }));
  app.use(timeoutMiddleware);
  app.use(corsMiddleware);
  app.use(createStorageMiddleware({ storageFactory }));
  app.use(secureHeaders());
  app.use(authenticationMiddleware);

  registerErrorMiddleware({ app });

  registerAuthRoutes({ app });
  registerConfigRoutes({ app });
  registerNotesRoutes({ app });

  app.get('/api/ping', context => context.json({ status: 'ok' }));

  return {
    app,
  };
}
