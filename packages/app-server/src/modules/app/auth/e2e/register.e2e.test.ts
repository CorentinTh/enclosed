import { describe, expect, test } from 'vitest';
import { createMemoryStorage } from '../../../storage/factories/memory.storage';
import { overrideConfig } from '../../config/config.test-utils';
import { createServer } from '../../server';

describe('e2e', () => {
  describe('auth register', () => {
    describe('when the user registration is allowed', () => {
      test('when a user already exists with the same email, a 409 is returned', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config: overrideConfig({
            public: {
              isAuthenticationRequired: true,
              isUserRegistrationAllowed: true,
            },
            authentication: {
              authUsers: [{
                email: 'foo@example.com',
                passwordHash: '$2a$10$rdGlTDCu0pAFx43nOw3bterqyIMIjj3WHekKe6Uo6aBby8sDum7Q.', // bcrypt hash of 'super-secure-pwd'
              }],
            },
          }),
        });

        const response = await app.request(
          '/api/auth/register',
          {
            method: 'POST',
            body: JSON.stringify({
              email: 'foo@example.com',
              password: 'super-secure-pwd',
            }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
          },
        );

        expect(response.status).to.eql(409);
        expect(await response.json()).to.eql({
          error: {
            code: 'users.create.already_exists',
            message: 'User already exists',
          },
        });
      });

      test('when the user does not exist, the user is created and a token is returned', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config: overrideConfig({
            public: {
              isAuthenticationRequired: true,
              isUserRegistrationAllowed: true,
            },

          }),
        });

        const response = await app.request(
          '/api/auth/register',
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

        const user = await storage.getItem<any>('users:foo@example.com');
        expect(user.email).to.eql('foo@example.com');
      });

      test('when the user registration is disabled, a 401 is returned', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config: overrideConfig({
            public: {
              isAuthenticationRequired: true,
              isUserRegistrationAllowed: false,
            },
          }),
        });

        const response = await app.request(
          '/api/auth/register',
          {
            method: 'POST',
            body: JSON.stringify({
              email: 'foo@example.com',
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

      test('when the authentication is not required, a 401 is returned', async () => {
        const { storage } = createMemoryStorage();

        const { app } = createServer({
          storageFactory: () => ({ storage }),
          config: overrideConfig({
            public: {
              isAuthenticationRequired: false,
              isUserRegistrationAllowed: true,
            },
          }),
        });

        const response = await app.request(
          '/api/auth/register',
          {
            method: 'POST',
            body: JSON.stringify({
              email: 'foo@example.com',
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
    });
  });
});
