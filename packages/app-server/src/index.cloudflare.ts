import { createServer } from './modules/app/server';
import { createCloudflareKVStorageFactory } from './modules/storage/factories/cloudflare-kv.storage';

const { storageFactory } = createCloudflareKVStorageFactory();

const { app } = createServer({ storageFactory });

export default app;
