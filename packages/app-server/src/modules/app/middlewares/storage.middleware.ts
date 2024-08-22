import { createMiddleware } from 'hono/factory';
import { createStorage } from 'unstorage';
import cloudflareKVBindingDriver from 'unstorage/drivers/cloudflare-kv-binding';

export const storageMiddleware = createMiddleware(async (context, next) => {
//   const config = context.get('config');

  const binding = context.env.notes;

  const storage = createStorage({
    driver: cloudflareKVBindingDriver({ binding }),
  });

  context.set('storage', storage);

  await next();
});
