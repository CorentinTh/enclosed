import process, { env } from 'node:process';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createServer } from './modules/app/server';
import { getConfig } from './modules/app/config/config';

import { deleteExpiredNotesTask } from './modules/notes/tasks/delete-expired-notes.tasks';
import { createTaskScheduler } from './modules/tasks/task-scheduler';
import { createFsLiteStorage } from './modules/storage/factories/fs-lite.storage';

const config = getConfig({ env });
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
