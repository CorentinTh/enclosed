import type { Driver } from 'unstorage';
import { createStorage } from 'unstorage';
import cloudflareKVBindingDriver from 'unstorage/drivers/cloudflare-kv-binding';
import { createError } from '../../shared/errors/errors';
import { defineBindableStorageFactory } from '../storage.models';

export const createCloudflareKVStorageFactory = defineBindableStorageFactory(() => {
  return {
    storageFactory: ({ context, config }) => {
      const { bindingName } = config.storage.driverConfig.cloudflareKVBinding;
      const binding = (context.env as Record<string, KVNamespace | undefined>)[bindingName];

      if (!binding) {
        throw createError({
          message: `Missing Cloudflare KV binding: ${bindingName}`,
          code: 'missing_cloudflare_kv_binding',
          statusCode: 500,
          isInternal: true,
        });
      }

      const baseDriver = cloudflareKVBindingDriver({ binding });

      const driver: Driver = {
        ...baseDriver,

        // In current unstorage version (1.10.2) the options are not forwarded to the binding
        // Current : https://github.com/unjs/unstorage/blob/v1.10.2/src/drivers/cloudflare-kv-binding.ts
        // Future : https://github.com/unjs/unstorage/blob/main/src/drivers/cloudflare-kv-binding.ts
        async setItem(key, value, options) {
          return binding.put(key, value, options);
        },
      };

      const storage = createStorage({ driver });

      return { storage };
    },
  };
});
