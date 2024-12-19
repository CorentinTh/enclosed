import type { ConfigDefinition } from 'figue';
import { defineConfig } from 'figue';
import { z } from 'zod';

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
    routeTimeoutMs: {
      doc: 'The maximum time in milliseconds for a route to complete before timing out',
      schema: z.coerce.number().int().positive(),
      default: 5_000,
      env: 'SERVER_API_ROUTES_TIMEOUT_MS',
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
    useHttps: {
      doc: 'Whether to enable HTTPS for the server (only in node env)',
      schema: z
        .string()
        .trim()
        .toLowerCase()
        .transform(x => x === 'true')
        .pipe(z.boolean()),
      default: 'false',
      env: 'SERVER_USE_HTTPS',
    },
    https: {
      key: {
        doc: 'The key for HTTPS (only in node env)',
        schema: z.string().optional(),
        default: undefined,
        env: 'SERVER_HTTPS_KEY',
      },
      cert: {
        doc: 'The cert for HTTPS (only in node env)',
        schema: z.string().optional(),
        default: undefined,
        env: 'SERVER_HTTPS_CERT',
      },
      ca: {
        doc: 'The CA for HTTPS (only in node env)',
        schema: z.string().optional(),
        default: undefined,
        env: 'SERVER_HTTPS_CA',
      },
      pfx: {
        doc: 'The pfx for HTTPS (only in node env)',
        schema: z.string().optional(),
        default: undefined,
        env: 'SERVER_HTTPS_PFX',
      },
      passphrase: {
        doc: 'The passphrase of the PFX cert (only in node env)',
        schema: z.string().optional(),
        default: undefined,
        env: 'SERVER_HTTPS_PASSPHRASE',
      },
    },
  },
  notes: {
    maxEncryptedPayloadLength: {
      doc: 'The maximum length of the encrypted payload of a note allowed by the api',
      schema: z.coerce.number().int().positive().min(1),
      default: 1024 * 1024 * 50, // 50MB
      env: 'NOTES_MAX_ENCRYPTED_PAYLOAD_LENGTH',
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
          doc: 'The path to the directory where the data will be stored (only in node env)',
          schema: z.string(),
          default: './.data',
          env: 'STORAGE_DRIVER_FS_LITE_PATH',
        },
      },
      cloudflareKVBinding: {
        bindingName: {
          doc: 'The name of the Cloudflare KV binding to use (only in cloudflare env)',
          schema: z.string(),
          default: 'notes',
          env: 'STORAGE_DRIVER_CLOUDFLARE_KV_BINDING',
        },
      },
    },
  },
  public: {
    baseApiUrl: {
      doc: 'The base URL of the public api, can be an absolute URL (like `https://example.com/enclosed`) or a path (like `/enclosed`)',
      schema: z.string(),
      default: '/',
      env: 'PUBLIC_BASE_API_URL',
    },
    isAuthenticationRequired: {
      doc: 'Whether to require authentication to access the public api',
      schema: z
        .string()
        .trim()
        .toLowerCase()
        .transform(x => x === 'true')
        .pipe(z.boolean()),
      default: 'false',
      env: 'PUBLIC_IS_AUTHENTICATION_REQUIRED',
    },
    defaultDeleteNoteAfterReading: {
      doc: 'The default value for the `Delete note after reading` checkbox in the note creation form',
      schema: z
        .string()
        .trim()
        .toLowerCase()
        .transform(x => x === 'true')
        .pipe(z.boolean()),
      default: 'false',
      env: 'PUBLIC_DEFAULT_DELETE_NOTE_AFTER_READING',
    },
    defaultNoteTtlSeconds: {
      doc: 'The default value for the expiration time of a note in seconds, the value must be one of: `3600` (1 hour), `86400` (1 day), `604800` (1 week), `2592000` (1 month)',
      schema: z
        .coerce
        .number()
        .refine(
          value => [3600, 86400, 604800, 2592000].includes(value),
          {
            message: 'PUBLIC_DEFAULT_NOTE_TTL_SECONDS: Invalid value. Must be one of: 3600, 86400, 604800, 2592000',
          },
        ),
      default: 3600,
      env: 'PUBLIC_DEFAULT_NOTE_TTL_SECONDS',
    },
    isSettingNoExpirationAllowed: {
      doc: 'Whether to allow the user to set the note to never expire',
      schema: z
        .string()
        .trim()
        .toLowerCase()
        .transform(x => x === 'true')
        .pipe(z.boolean()),
      default: 'true',
      env: 'PUBLIC_IS_SETTING_NO_EXPIRATION_ALLOWED',
    },
    defaultNoteNoExpiration: {
      doc: 'The default value for the `No expiration` checkbox in the note creation form (only used if setting no expiration is allowed)',
      schema: z
        .string()
        .trim()
        .toLowerCase()
        .transform(x => x === 'true')
        .pipe(z.boolean()),
      default: 'false',
      env: 'PUBLIC_DEFAULT_NOTE_NO_EXPIRATION',
    },
  },
  authentication: {
    jwtSecret: {
      doc: 'The secret used to sign the JWT tokens',
      schema: z.string(),
      default: 'change-me',
      env: 'AUTHENTICATION_JWT_SECRET',
    },
    jwtDurationSeconds: {
      doc: 'The duration in seconds for which the JWT token is valid',
      schema: z.coerce.number().int().positive(),
      default: 60 * 60 * 24 * 7, // 1 week
      env: 'AUTHENTICATION_JWT_DURATION_SECONDS',
    },
    authUsers: {
      doc: 'The list of users allowed to authenticate. Comma-separated list of email and bcrypt password hash, like: `email1:passwordHash1,email2:passwordHash2`. Easily generate the value for this env variable here: https://docs.enclosed.cc/self-hosting/users-authentication-key-generator',
      schema: z
        .string()
        .transform((value) => {
          if (!value) {
            return [];
          }

          return value
            .split(',')
            .map((user) => {
              const [email, passwordHash] = user.split(':');
              return { email, passwordHash };
            });
        })
        .refine(
          (value) => {
            const result = z.array(z.object({
              email: z.string().email(),
              passwordHash: z.string(),
            })).safeParse(value);

            return result.success;
          },
          {
            message: 'AUTHENTICATION_USERS: Invalid format. Must be a comma-separated list of email:passwordHash',
          },
        ),
      default: '',
      env: 'AUTHENTICATION_USERS',
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
