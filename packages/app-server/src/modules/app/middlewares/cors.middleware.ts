import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import type { Context } from '../server.types';

export const corsMiddleware = createMiddleware(async (context: Context, next) => {
  const { server: { corsOrigins } } = context.get('config');

  const corsHandler = cors({ origin: corsOrigins });

  return corsHandler(context, next);
});
