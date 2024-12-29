import type { ServerInstance } from '../server.types';
import { z } from 'zod';
import { validateJsonBody } from '../../shared/validation/validation';
import { createUserRepository } from '../users/users.repository';
import { createUsersStorage } from '../users/users.storage';
import { registerUser } from '../users/users.usecases';
import { createUnauthorizedError } from './auth.errors';
import { getIsRegistrationAllowed } from './auth.models';
import { arePasswordsMatching, createJwtToken } from './auth.services';

export { registerAuthRoutes };

function registerAuthRoutes({ app }: { app: ServerInstance }) {
  setupLoginRoute({ app });
  setupRegisterUserRoute({ app });
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
      const storage = context.get('storage');

      const { usersStorage } = createUsersStorage({ storage });

      const { getUserByEmail } = createUserRepository({ config, usersStorage });

      const { user } = await getUserByEmail({ email });

      if (!user) {
        // This is a security measure to prevent timing attacks and don't leak the existence of the user
        await arePasswordsMatching({ password, passwordHash: 'dummy' });

        throw createUnauthorizedError();
      }

      const passwordsMatch = await arePasswordsMatching({ password, passwordHash: user.passwordHash });

      if (!passwordsMatch) {
        throw createUnauthorizedError();
      }

      const { token } = await createJwtToken({
        jwtSecret: config.authentication.jwtSecret,
        durationSec: config.authentication.jwtDurationSeconds,
      });

      return context.json({
        accessToken: token,
      });
    },
  );
}

function setupRegisterUserRoute({ app }: { app: ServerInstance }) {
  app.post(
    '/api/auth/register',
    (context, next) => {
      const config = context.get('config');
      const isUserRegistrationAllowed = getIsRegistrationAllowed({ config });

      if (!isUserRegistrationAllowed) {
        throw createUnauthorizedError();
      }

      return next();
    },
    validateJsonBody(z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })),
    async (context) => {
      const config = context.get('config');
      const { email, password } = context.req.valid('json');
      const storage = context.get('storage');
      const { usersStorage } = createUsersStorage({ storage });

      const userRepository = createUserRepository({ config, usersStorage });

      await registerUser({ email, password, userRepository });

      const { token } = await createJwtToken({
        jwtSecret: config.authentication.jwtSecret,
        durationSec: config.authentication.jwtDurationSeconds,
      });

      return context.json({
        accessToken: token,
      });
    },
  );
}
