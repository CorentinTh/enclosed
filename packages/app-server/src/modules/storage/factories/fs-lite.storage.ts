import fsLiteDriver from 'unstorage/drivers/fs-lite';
import { createStorage } from 'unstorage';
import type { Config } from '../../app/config/config.types';
import { defineStorage } from '../storage.models';

export const createFsLiteStorage = defineStorage(({ config }: { config: Config }) => {
  const storage = createStorage({
    driver: fsLiteDriver({ base: config.storage.driverConfig.fsLite.path }),
  });

  return {
    storage,
  };
});
