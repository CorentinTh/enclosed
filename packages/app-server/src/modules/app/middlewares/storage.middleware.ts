import type { BindableStorageFactory } from '../../storage/storage.types';
import { createMiddleware } from 'hono/factory';

export function createStorageMiddleware({ storageFactory }: { storageFactory: BindableStorageFactory }) {
  return createMiddleware(async (context, next) => {
    const config = context.get('config');

    const { storage } = storageFactory({ config, context });

    context.set('storage', storage);

    await next();
  });
}
