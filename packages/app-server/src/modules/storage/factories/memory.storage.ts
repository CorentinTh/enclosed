import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import { defineStorage } from '../storage.models';

export const createMemoryStorage = defineStorage(() => {
  return ({
    storage: createStorage({ driver: memoryDriver() }),
  });
});
