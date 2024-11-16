import type { Driver } from 'unstorage';
import { safely } from '@corentinth/chisels';
import { createStorage } from 'unstorage';
import cloudflareKVBindingDriver from 'unstorage/drivers/cloudflare-kv-binding';
import { createError } from '../../shared/errors/errors';
import { defineBindableStorageFactory } from '../storage.models';
import { looksLikeCloudflare413Error } from './cloudflare-kv.storage.models';

export const KV_VALUE_LENGTH_EXCEEDED_ERROR_CODE = 'storage.kv.value_length_exceeds_limit';

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
          const [result, error] = await safely(binding.put(key, value, options));

          if (looksLikeCloudflare413Error({ error })) {
            throw createError({
              message: 'Value length exceeds limit',
              code: KV_VALUE_LENGTH_EXCEEDED_ERROR_CODE,
              statusCode: 413,
              isInternal: true,
            });
          }

          if (error) {
            throw error;
          }

          return result;
        },
      };

      const storage = createStorage({ driver });

      return { storage };
    },
  };
});
