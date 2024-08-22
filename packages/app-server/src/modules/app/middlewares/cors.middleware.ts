import { cors } from 'hono/cors';
import type { Context } from '../server.types';

export const corsMiddleware = cors({
  origin: (origin, context: Context) => {
    const allowedOrigins = context.get('config').server.corsOrigin;

    if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
      return origin;
    }

    return allowedOrigins.find(allowedOrigin => allowedOrigin === origin);
  },
  credentials: true,
});
