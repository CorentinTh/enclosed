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
    corsOrigins: {
      doc: 'The CORS origin for the api server',
      schema: z.union([
        z.string(),
        z.array(z.string()),
      ]).transform(value => (typeof value === 'string' ? value.split(',') : value)),
      default: [],
      env: 'SERVER_CORS_ORIGINS',
    },
  },
  notes: {
    maxEncryptedContentLength: {
      doc: 'The maximum length of the encrypted content of a note allowed by the api',
      schema: z.number().min(1),
      default: 1024 * 1024 * 5, // 5MB
      env: 'NOTES_MAX_ENCRYPTED_CONTENT_LENGTH',
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
    driverConfig: {
      fsLite: {
        path: {
          doc: '(only in node env) The path to the directory where the data will be stored',
          schema: z.string(),
          default: './.data',
          env: 'STORAGE_DRIVER_FS_LITE_PATH',
        },
      },
      cloudflareKVBinding: {
        bindingName: {
          doc: '(only in cloudflare env) The name of the Cloudflare KV binding to use',
          schema: z.string(),
          default: 'notes',
          env: 'STORAGE_DRIVER_CLOUDFLARE_KV_BINDING',
        },
      },
    },
  },
} as const satisfies ConfigDefinition;

export function getConfig({ env }: { env?: Record<string, string | undefined> } = {}) {
  const { config } = defineConfig(
    configDefinition,
    { envSource: env },
  );

  return config;
}
