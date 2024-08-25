import type { ConfigDefinition } from 'figue';
import { defineConfig, z } from 'figue';

export const configDefinition = {
  env: {
    doc: 'The application environment.',
    schema: z.enum(['development', 'production', 'test']),
    default: 'development',
    env: 'NODE_ENV',
  },
  server: {
    port: {
      doc: 'The port to listen on when using node server',
      schema: z.coerce.number().min(1024).max(65535),
      default: 8787,
      env: 'PORT',
    },
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
  tasks: {
    deleteExpiredNotes: {
      isEnabled: {
        doc: 'Whether to enable a periodic task to delete expired notes (not available for cloudflare)',
        schema: z
          .string()
          .trim()
          .toLowerCase()
          .transform(x => x === 'true')
          .pipe(z.boolean()),
        default: 'true',
        env: 'TASK_DELETE_EXPIRED_NOTES_ENABLED',
      },
      cron: {
        doc: 'The frequency with which to run the task to delete expired notes (cron syntax)',
        schema: z.string(),
        default: '0 * * * *', // Every hour
        env: 'TASK_DELETE_EXPIRED_NOTES_CRON',
      },
      runOnStartup: {
        doc: 'Whether the task to delete expired notes should run on startup',
        schema: z
          .string()
          .trim()
          .toLowerCase()
          .transform(x => x === 'true')
          .pipe(z.boolean()),
        default: 'true',
        env: 'TASK_DELETE_EXPIRED_NOTES_RUN_ON_STARTUP',
      },
    },
  },
  storage: {
    driver: {
      doc: 'The storage driver to use (cloudflare-kv-binding is not available for non-Cloudflare environments)',
      schema: z.enum(['cloudflare-kv-binding', 'fs-lite']),
      default: 'cloudflare-kv-binding',
      env: 'STORAGE_DRIVER',
    },
    driverConfig: {
      cloudflareKVBinding: {
        bindingName: {
          doc: '(only for cloudflare-kv-binding driver) The name of the Cloudflare KV binding to use',
          schema: z.string(),
          default: 'notes',
          env: 'STORAGE_DRIVER_CLOUDFLARE_KV_BINDING',
        },
      },
      fsLite: {
        path: {
          doc: '(only for fs-lite driver) The path to the directory where the data will be stored',
          schema: z.string(),
          default: './.data',
          env: 'STORAGE_DRIVER_FS_LITE_PATH',
        },
      },
    },
  },
} as const satisfies ConfigDefinition;

export function getConfig({ env }: { env: any }) {
  const { config } = defineConfig(
    configDefinition,
    { envSource: env },
  );

  return config;
}
