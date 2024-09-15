import bcrypt from 'bcryptjs';
import { sign, verify } from 'hono/jwt';

export { arePasswordsMatching, createJwtToken, isJwtValid };

async function arePasswordsMatching({ password, passwordHash }: { password: string; passwordHash: string }) {
  return await bcrypt.compare(password, passwordHash);
}

async function createJwtToken({ jwtSecret, durationSec }: { jwtSecret: string; durationSec?: number }) {
  const token = await sign(
    {
      ...(durationSec ? { exp: Math.floor(Date.now() / 1000) + durationSec } : {}),
    },
    jwtSecret,
    'HS256',
  );

  return {
    token,
  };
}

async function isJwtValid({ token, jwtSecret }: { token: string; jwtSecret: string }) {
  try {
    await verify(token, jwtSecret, 'HS256');
    return true;
  } catch (_error) {
    return false;
  }
}
