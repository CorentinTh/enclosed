import type { Config } from '../config/config.types';
import type { UsersStorage } from './users.storage';
import type { StoredUser } from './users.types';
import { injectArguments } from '@corentinth/chisels';

export { createUserRepository };

export type UserRepository = ReturnType<typeof createUserRepository>;

function createUserRepository({ config, usersStorage }: { config: Config; usersStorage: UsersStorage }) {
  return injectArguments(
    {
      getUserByEmail,
      saveUser,
    },
    {
      configUsers: config.authentication.authUsers,
      usersStorage,
    },
  );
}

async function getUserByEmail({
  email,
  configUsers,
  usersStorage,
}: {
  email: string;
  configUsers: { email: string; passwordHash: string }[];
  usersStorage: UsersStorage;
}): Promise<{ user: StoredUser | undefined }> {
  const userFromConfig = configUsers.find(user => user.email === email);

  if (userFromConfig) {
    return { user: userFromConfig };
  }

  const userFromStorage = await usersStorage.getItem<StoredUser>(email);

  return {
    user: userFromStorage ?? undefined,
  };
}

async function saveUser({
  email,
  passwordHash,
  usersStorage,
  now = new Date(),
}: {
  email: string;
  passwordHash: string;
  usersStorage: UsersStorage;
  now?: Date;
}): Promise<void> {
  await usersStorage.setItem(email, {
    email,
    passwordHash,
    createdAt: now,
  });
}
