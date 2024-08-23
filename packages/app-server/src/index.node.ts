import { env } from 'node:process';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import fsLiteDriver from 'unstorage/drivers/fs-lite';
import { createServer } from './modules/app/server';
import { getConfig } from './modules/app/config/config';

const config = getConfig({ env });
const storageDriver = fsLiteDriver({ base: config.storage.driverConfig.fsLite.path });

const { app } = createServer({ config, storageDriver });

app
  .use(
    '*',
    serveStatic({ root: 'public' }),
  )
  .use(
    '*',
    serveStatic({
      path: 'index.html',
      root: 'public',
    }),
  );

serve({
  fetch: app.fetch,
  port: config.server.port,
});
