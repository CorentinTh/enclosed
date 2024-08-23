import { defineConfig, z } from 'figue';

export function getConfig({ env }: { env: any }) {
  const { config } = defineConfig(
    {
      env: {
        doc: 'The application environment.',
        schema: z.enum(['development', 'production', 'test']),
        default: 'development',
        env: 'NODE_ENV',
      },
      server: {
        corsOrigin: {
          doc: 'The CORS origin the server should allow',
          schema: z.union([
            z.string(),
            z.array(z.string()),
          ]).transform(value => (typeof value === 'string' ? value.split(',') : value)),
          default: '*',
          env: 'CORS_ORIGIN',
        },
      },
      storage: {
        driver: {
          doc: 'The storage driver to use',
          schema: z.enum(['cloudflare-kv-binding', 'fs-lite']),
          default: 'cloudflare-kv-binding',
          env: 'STORAGE_DRIVER',
        },
        driverConfig: {
          cloudflareKVBinding: {
            bindingName: {
              doc: 'The binding name for the Cloudflare KV storage driver',
              schema: z.string(),
              default: 'notes',
              env: 'STORAGE_DRIVER_CLOUDFLARE_KV_BINDING',
            },
          },
          fsLite: {
            path: {
              doc: 'The path for data storage for the fs-lite storage driver',
              schema: z.string(),
              default: './.data',
              env: 'STORAGE_DRIVER_FS_LITE_PATH',
            },
          },
        },
      },
    } as const,
    {
      envSource: env,
    },
  );

  return config;
}
