import { describe, expect, test } from 'vitest';
import { createMemoryStorage } from '../../../storage/factories/memory.storage';
import { overrideConfig } from '../../config/config.test-utils';
import { createServer } from '../../server';

describe('e2e', () => {
  describe('auth login', () => {
    describe('when authentication is enabled, a user can log in', async () => {
      const config = overrideConfig({
        public: {
          isAuthenticationRequired: true,
        },
        authentication: {
          authUsers: [{
            email: 'foo@example.com',
            passwordHash: '$2a$10$rdGlTDCu0pAFx43nOw3bterqyIMIjj3WHekKe6Uo6aBby8sDum7Q.', // bcrypt hash of 'super-secure-pwd'
          }],
        },
      });

      test('when the user exists and the password is correct, a token is returned', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config,
        });

        const response = await app.request(
          '/api/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({
              email: 'foo@example.com',
              password: 'super-secure-pwd',
            }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
          },
        );

        expect(response.status).to.eql(200);

        const { accessToken } = await response.json<any>();
        expect(accessToken).toBeDefined();
        expect(accessToken).to.be.a('string');
      });

      test('when the user does not exist, a 401 is returned', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config,
        });

        const response = await app.request(
          '/api/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({
              email: 'unknown@example.com',
              password: 'super-secure-pwd',
            }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
          },
        );

        expect(response.status).to.eql(401);
        expect(await response.json()).to.eql({
          error: {
            code: 'auth.unauthorized',
            message: 'Unauthorized',
          },
        });
      });

      test('when the password is incorrect, a 401 is returned', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config,
        });

        const response = await app.request(
          '/api/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({
              email: 'unknown@example.com',
              password: 'wrong-password',
            }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
          },
        );

        expect(response.status).to.eql(401);
        expect(await response.json()).to.eql({
          error: {
            code: 'auth.unauthorized',
            message: 'Unauthorized',
          },
        });
      });
    });
  });
});
