import { apiClient } from '../shared/http/http-client';

export { login };

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
