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
          schema: z.enum(['cloudflare-kv-binding']),
          default: 'cloudflare-kv-binding',
          env: 'STORAGE_DRIVER',
        },
      },
    } as const,
    {
      envSource: env,
    },
  );

  return config;
}
