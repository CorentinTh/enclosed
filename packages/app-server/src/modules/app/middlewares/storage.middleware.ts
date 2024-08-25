import { createMiddleware } from 'hono/factory';
import type { BindableStorageFactory } from '../../storage/storage.types';

export function createStorageMiddleware({ storageFactory }: { storageFactory: BindableStorageFactory }) {
  return createMiddleware(async (context, next) => {
    const config = context.get('config');

    const { storage } = storageFactory({ config, context });

    context.set('storage', storage);

    await next();
  });
}
