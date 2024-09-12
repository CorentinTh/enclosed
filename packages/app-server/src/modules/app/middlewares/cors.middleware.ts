import type { Context } from '../server.types';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';

export const corsMiddleware = createMiddleware(async (context: Context, next) => {
  const { server: { corsOrigins } } = context.get('config');

  const corsHandler = cors({ origin: corsOrigins });

  return corsHandler(context, next);
});
