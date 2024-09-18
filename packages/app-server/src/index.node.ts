import process, { env } from 'node:process';
import { safelySync } from '@corentinth/chisels';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { getConfig } from './modules/app/config/config';
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

const taskScheduler = createTaskScheduler({
  config,
  taskDefinitions: [
    deleteExpiredNotesTask,
  ],
  tasksArgs: { storage },
});

taskScheduler.start();

const server = serve({
  fetch: app.fetch,
  port: config.server.port,
});

process.on('SIGINT', async () => {
  await storage.dispose();
  server.close();

  process.exit(0);
});
