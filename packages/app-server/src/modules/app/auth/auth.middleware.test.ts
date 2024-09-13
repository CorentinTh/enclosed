import { Hono } from 'hono';
import { describe, expect, test } from 'vitest';
import { registerErrorMiddleware } from '../middlewares/errors.middleware';
import { authenticationMiddleware, protectedRouteMiddleware } from './auth.middleware';

describe('auth middleware', () => {
  describe('authenticationMiddleware', () => {
    function createApp({ isAuthenticationRequired, jwtSecret }: { isAuthenticationRequired: boolean; jwtSecret: string }) {
      const app = new Hono<{ Variables: {
        isAuthenticated?: boolean;
        config: {
          public: { isAuthenticationRequired: boolean };
          authentication: { jwtSecret: string };
        };
      }; }>({ strict: true });

      app.use((context, next) => {
        context.set('config', {
          public: { isAuthenticationRequired },
          authentication: { jwtSecret },
        });

        return next();
      });

      app.use(authenticationMiddleware);

      app.get('/api/test', (context) => {
        return context.json({
          isAuthenticated: context.get('isAuthenticated'),
        });
      });

      return { app };
    }

    describe('this middleware populates the context with an isAuthenticated flag based on the presence of a valid JWT token when auth is activated', () => {
      test('when the authentication is not required, no isAuthenticated flag is set', async () => {
        const { app } = createApp({ isAuthenticationRequired: false, jwtSecret: 'secret-key' });

        const response = await app.request('/api/test');

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ });
      });

      test('when the authentication is required and no token is provided, isAuthenticated is set to false', async () => {
        const { app } = createApp({ isAuthenticationRequired: true, jwtSecret: 'secret-key' });

        const response = await app.request('/api/test');

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ isAuthenticated: false });
      });

      test('when the authentication is required and an invalid token is provided, isAuthenticated is set to false', async () => {
        const { app } = createApp({ isAuthenticationRequired: true, jwtSecret: 'secret-key' });

        const response = await app.request('/api/test', {
          headers: {
            Authorization: 'Bearer invalid-token',
          },
        });

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ isAuthenticated: false });
      });

      test('when the authentication is required and a valid token is provided, isAuthenticated is set to true', async () => {
        const { app } = createApp({ isAuthenticationRequired: true, jwtSecret: 'secret-key' });

        const response = await app.request('/api/test', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sSmY3kpYwtAY4wEJLXCWZVKZCYRW5cH4UGkw9RMEBrk', // valid token for key 'secret-key'
          },
        });

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ isAuthenticated: true });
      });
    });
  });

  describe('protectedRouteMiddleware', () => {
    function createApp({ isAuthenticationRequired, jwtSecret }: { isAuthenticationRequired: boolean; jwtSecret: string }) {
      const app = new Hono<{ Variables: {
        isAuthenticated?: boolean;
        config: {
          public: { isAuthenticationRequired: boolean };
          authentication: { jwtSecret: string };
        };
      }; }>({ strict: true });

      app.use((context, next) => {
        context.set('config', {
          public: { isAuthenticationRequired },
          authentication: { jwtSecret },
        });

        return next();
      });

      registerErrorMiddleware({ app: app as any });

      app.use(authenticationMiddleware);

      app.get('/api/protected', protectedRouteMiddleware, (context) => {
        return context.json({ foo: 'bar' });
      });

      app.get('/api/unprotected', (context) => {
        return context.json({ biz: 'baz' });
      });

      return { app };
    }

    describe(`this middleware throws an unauthorized error when
      - the user is not authenticated 
      - the route is protected
      - the authentication is globally required`, () => {
      test('when the user is not authenticated and the route is protected, an unauthorized error is thrown', async () => {
        const { app } = createApp({ isAuthenticationRequired: true, jwtSecret: 'secret-key' });

        const response = await app.request('/api/protected');

        expect(response.status).to.eql(401);
        expect(await response.json()).to.eql({
          error: {
            code: 'auth.unauthorized',
            message: 'Unauthorized',
          },
        });
      });

      test('when the user is not authenticated and the route is not protected, the request is successful', async () => {
        const { app } = createApp({ isAuthenticationRequired: true, jwtSecret: 'secret-key' });

        const response = await app.request('/api/unprotected');

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ biz: 'baz' });
      });

      test('when the user is authenticated and the route is protected, the request is successful', async () => {
        const { app } = createApp({ isAuthenticationRequired: true, jwtSecret: 'secret-key' });

        const response = await app.request('/api/protected', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sSmY3kpYwtAY4wEJLXCWZVKZCYRW5cH4UGkw9RMEBrk', // valid token for key 'secret-key'
          },
        });

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ foo: 'bar' });
      });

      test('when authentication is not required, a protected route is publicly accessible', async () => {
        const { app } = createApp({ isAuthenticationRequired: false, jwtSecret: 'secret-key' });

        const response = await app.request('/api/protected');

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ foo: 'bar' });
      });

      test('when authentication is not required, an unprotected route is publicly accessible', async () => {
        const { app } = createApp({ isAuthenticationRequired: false, jwtSecret: 'secret-key' });

        const response = await app.request('/api/unprotected');

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ biz: 'baz' });
      });

      test('when the user is authenticated and the route is not protected, the route is accessible', async () => {
        const { app } = createApp({ isAuthenticationRequired: true, jwtSecret: 'secret-key' });

        const response = await app.request('/api/unprotected', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sSmY3kpYwtAY4wEJLXCWZVKZCYRW5cH4UGkw9RMEBrk', // valid token for key
          },
        });

        expect(response.status).to.eql(200);
        expect(await response.json()).to.eql({ biz: 'baz' });
      });
    });
  });
});
