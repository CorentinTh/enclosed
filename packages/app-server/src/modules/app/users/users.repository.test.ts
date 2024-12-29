import type { Config } from '../config/config.types';
import { describe, expect, test } from 'vitest';
import { createMemoryStorage } from '../../storage/factories/memory.storage';
import { createUserRepository } from './users.repository';
import { createUsersStorage } from './users.storage';

describe('users repository', () => {
  describe('getUserByEmail', () => {
    test('for retro-compatibility and ease of use, a user can be configured either from the config or in the storage', async () => {
      const { storage } = createMemoryStorage();

      const { usersStorage } = createUsersStorage({ storage });

      const configUsers = [
        { email: 'aaaa@example.com', passwordHash: 'hash1' },
      ];

      await usersStorage.setItem('bbbb@example.com', {
        email: 'bbbb@example.com',
        passwordHash: 'hash2',
      });

      const usersRepository = createUserRepository({
        config: { authentication: { authUsers: configUsers } } as Config,
        usersStorage,
      });

      expect(
        await usersRepository.getUserByEmail({ email: 'aaaa@example.com' }),
      ).to.eql({
        user: { email: 'aaaa@example.com', passwordHash: 'hash1' },
      });

      expect(
        await usersRepository.getUserByEmail({ email: 'bbbb@example.com' }),
      ).to.eql({
        user: { email: 'bbbb@example.com', passwordHash: 'hash2' },
      });

      expect(
        await usersRepository.getUserByEmail({ email: 'cccc@example.com' }),
      ).to.eql({
        user: undefined,
      });
    });
  });
});
