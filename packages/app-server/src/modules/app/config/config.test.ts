import { describe, expect, test } from 'vitest';
import { getConfig } from './config';

describe('getConfig', () => {
  test('defaults are validated and transformed', () => {
    expect(getConfig()).toMatchObject({
      env: 'development',
      server: { port: 8787, useHttps: false, corsOrigins: [] },
      tasks: { deleteExpiredNotes: { isEnabled: true, runOnStartup: true } },
      public: { isAuthenticationRequired: false, defaultNoteTtlSeconds: 3600 },
      authentication: { authUsers: [] },
    });
  });

  test('environment overrides are validated and transformed', () => {
    const config = getConfig({
      env: {
        PORT: '3000',
        SERVER_USE_HTTPS: ' TRUE ',
        SERVER_CORS_ORIGINS: 'https://enclosed.cc,https://example.com',
        PUBLIC_IS_AUTHENTICATION_REQUIRED: 'true',
        AUTHENTICATION_USERS: 'user@example.com:password-hash',
      },
    });

    expect(config).toMatchObject({
      server: {
        port: 3000,
        useHttps: true,
        corsOrigins: ['https://enclosed.cc', 'https://example.com'],
      },
      public: { isAuthenticationRequired: true },
      authentication: { authUsers: [{ email: 'user@example.com', passwordHash: 'password-hash' }] },
    });
  });

  test.each([
    { env: { PORT: 'invalid' }, path: 'server.port' },
    { env: { PUBLIC_DEFAULT_NOTE_TTL_SECONDS: '42' }, path: 'public.defaultNoteTtlSeconds' },
    { env: { AUTHENTICATION_USERS: 'invalid-email:password-hash' }, path: 'authentication.authUsers' },
  ])('invalid environment configuration is rejected: $path', ({ env, path }) => {
    expect(() => getConfig({ env })).toThrow(path);
  });
});
