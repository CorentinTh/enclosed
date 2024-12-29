import { apiClient } from '../shared/http/http-client';

export { login, register };

async function login({ email, password }: { email: string; password: string }) {
  const { accessToken } = await apiClient<{ accessToken: string }>({
    path: 'api/auth/login',
    method: 'POST',
    body: {
      email,
      password,
    },
  });

  return { accessToken };
}

async function register({ email, password }: { email: string; password: string }) {
  const { accessToken } = await apiClient<{ accessToken: string }>({
    path: 'api/auth/register',
    method: 'POST',
    body: {
      email,
      password,
    },
  });

  return { accessToken };
}
