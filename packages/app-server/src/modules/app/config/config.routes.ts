import type { ServerInstance } from '../server.types';

export { registerConfigRoutes };

function registerConfigRoutes({ app }: { app: ServerInstance }) {
  setupGetPublicConfigRoute({ app });
}

function setupGetPublicConfigRoute({ app }: { app: ServerInstance }) {
  app.get('/api/config', async (context) => {
    const { public: publicConfig } = context.get('config');

    return context.json({
      config: publicConfig,
    });
  });
}
