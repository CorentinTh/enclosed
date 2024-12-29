import type { UserRepository } from './users.repository';
import { hashPassword } from '../auth/auth.services';
import { createUserAlreadyExistsError } from './users.errors';

export async function registerUser({ email, password, userRepository, now = new Date() }: { email: string; password: string; userRepository: UserRepository; now?: Date }): Promise<void> {
  const { user } = await userRepository.getUserByEmail({ email });

  if (user) {
    throw createUserAlreadyExistsError();
  }

  const passwordHash = await hashPassword({ password });

  await userRepository.saveUser({ email, passwordHash, now });
}
