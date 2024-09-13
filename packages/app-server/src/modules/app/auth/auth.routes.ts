import type { ServerInstance } from '../server.types';
import { z } from 'zod';
import { validateJsonBody } from '../../shared/validation/validation';
import { createUserRepository } from '../users/users.repository';
import { createUnauthorizedError } from './auth.errors';
import { arePasswordsMatching, createJwtToken } from './auth.services';

export { registerAuthRoutes };

function registerAuthRoutes({ app }: { app: ServerInstance }) {
  setupLoginRoute({ app });
}

function setupLoginRoute({ app }: { app: ServerInstance }) {
  app.post(
    '/api/auth/login',
    validateJsonBody(z.object({
      email: z.string().email(),
      password: z.string(),
    })),
    async (context) => {
      const config = context.get('config');
      const { email, password } = context.req.valid('json');

      const { getUserByEmail } = createUserRepository({ config });

      const { user } = getUserByEmail({ email });

      if (!user) {
        throw createUnauthorizedError();
      }

      const passwordsMatch = await arePasswordsMatching({ password, passwordHash: user.passwordHash });

      if (!passwordsMatch) {
        throw createUnauthorizedError();
      }

      const { token } = await createJwtToken({
        jwtSecret: config.authentication.jwtSecret,
        payload: {
          exp: Math.floor(Date.now() / 1000) + config.authentication.jwtDurationSeconds,
        },
      });

      return context.json({
        accessToken: token,
      });
    },
  );
}
