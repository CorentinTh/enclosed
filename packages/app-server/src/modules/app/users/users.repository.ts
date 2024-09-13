import type { Config } from '../config/config.types';
import { injectArguments } from '@corentinth/chisels';

export { createUserRepository };

function createUserRepository({ config }: { config: Config }) {
  return injectArguments(
    {
      getUserByEmail,
    },
    {
      authUsers: config.authentication.authUsers,
    },
  );
}

function getUserByEmail({ email, authUsers }: { email: string; authUsers: { email: string; passwordHash: string }[] }): { user: { email: string; passwordHash: string } | undefined } {
  const user = authUsers.find(user => user.email === email);

  return { user };
}
