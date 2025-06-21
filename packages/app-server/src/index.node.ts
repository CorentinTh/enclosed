import { readFile } from 'node:fs/promises';
import { createServer as createHttpsServer } from 'node:https';
import process, { env } from 'node:process';
import { safelySync } from '@corentinth/chisels';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { memoize } from 'lodash-es';
import { getConfig } from './modules/app/config/config';
import { injectPublicConfigInIndex } from './modules/app/config/config.models';
import { createServer } from './modules/app/server';
import { deleteExpiredNotesTask } from './modules/notes/tasks/delete-expired-notes.tasks';
import { createLogger } from './modules/shared/logger/logger';
import { createFsLiteStorage } from './modules/storage/factories/fs-lite.storage';
import { createTaskScheduler } from './modules/tasks/task-scheduler';

const logger = createLogger({ namespace: 'app-server' });

const [config, configError] = safelySync(() => getConfig({ env }));

if (configError) {
  logger.error({ error: configError }, `Invalid config: ${configError.message}`);
  process.exit(1);
}

const { storage } = createFsLiteStorage({ config });

const { app } = createServer({ config, storageFactory: () => ({ storage }) });

const getIndexContent = memoize(async () => {
  const index = await readFile('public/index.html', 'utf-8');

  return index;
});

app
  .use(
    '*',
    serveStatic({
      root: 'public',
      index: 'unexisting-file', // Disable index.html fallback to let the next middleware handle it
    }),
  )
  .use(
    '*',
    async (context, next) => {
      if (context.req.path.includes('/api/')) {
        return next();
      }

      const { public: publicConfig } = context.get('config');

      const indexHtmlContent = await getIndexContent();
      const indexWithConfig = injectPublicConfigInIndex({ publicConfig, indexHtmlContent });

      return context.html(indexWithConfig);
    },
  );

const taskScheduler = createTaskScheduler({
  config,
  taskDefinitions: [
    deleteExpiredNotesTask,
  ],
  tasksArgs: { storage },
});

taskScheduler.start();

const server = serve(
  {
    fetch: app.fetch,
    port: config.server.port,
    ...(config.server.useHttps
      ? {
          createServer: createHttpsServer,
          serverOptions: config.server.https,
        }
      : {}),
  },
  ({ port }) => logger.info({ port }, 'Server started'),
);

process.on('SIGINT', async () => {
  await storage.dispose();
  server.close();

  process.exit(0);
});
