import type { BindableStorageFactory } from '../storage/storage.types';
import type { Config } from './config/config.types';
import type { ServerInstanceGenerics } from './server.types';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
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

// 50MB is the default max encrypted payload; allow a small envelope for the
// surrounding JSON fields. Reject oversized bodies while streaming instead of
// buffering the whole request into memory first (memory-exhaustion DoS).
const DEFAULT_MAX_PAYLOAD_BYTES = 1024 * 1024 * 50;
const BODY_ENVELOPE_OVERHEAD_BYTES = 1024 * 4;

function createServer({ config, storageFactory }: { config?: Config; storageFactory: BindableStorageFactory }) {
  const app = new Hono<ServerInstanceGenerics>({ strict: true });

  const maxBodyBytes = (config?.notes.maxEncryptedPayloadLength ?? DEFAULT_MAX_PAYLOAD_BYTES) + BODY_ENVELOPE_OVERHEAD_BYTES;

  app.use(loggerMiddleware);
  app.use(createConfigMiddleware({ config }));
  app.use(timeoutMiddleware);
  app.use(corsMiddleware);
  app.use(createStorageMiddleware({ storageFactory }));
  app.use(secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\''],
      // The client bundles styles and needs inline styles for theming.
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      imgSrc: ['\'self\'', 'data:'],
      connectSrc: ['\'self\''],
      fontSrc: ['\'self\'', 'data:'],
      objectSrc: ['\'none\''],
      baseUri: ['\'self\''],
      frameAncestors: ['\'none\''],
      formAction: ['\'self\''],
    },
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
      usb: [],
    },
  }));
  app.use(bodyLimit({
    maxSize: maxBodyBytes,
    onError: context => context.json({ error: { code: 'note.payload_too_large', message: 'Request body too large.' } }, 413),
  }));
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
