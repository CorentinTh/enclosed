import type { Context } from '../server.types';
import { createMiddleware } from 'hono/factory';
import { createUnauthorizedError } from './auth.errors';
import { extractAccessToken } from './auth.models';
import { isJwtValid } from './auth.services';

export const authenticationMiddleware = createMiddleware(async (context: Context, next) => {
  const {
    public: { isAuthenticationRequired },
    authentication: { jwtSecret },
  } = context.get('config');

  if (!isAuthenticationRequired) {
    return next();
  }

  const autorisationHeader = context.req.header('Authorization');
  const { accessToken } = extractAccessToken({ autorisationHeader });

  if (!accessToken) {
    context.set('isAuthenticated', false);
    return next();
  }

  const isTokenValid = await isJwtValid({ token: accessToken, jwtSecret });

  context.set('isAuthenticated', isTokenValid);
  return next();
});

export const protectedRouteMiddleware = createMiddleware(async (context: Context, next) => {
  const isAuthenticated = context.get('isAuthenticated');
  const {
    public: { isAuthenticationRequired },
  } = context.get('config');

  if (!isAuthenticated && isAuthenticationRequired) {
    throw createUnauthorizedError();
  }

  return next();
});
