import { authStore } from '@/modules/auth/auth.store';
import { buildTimeConfig } from '@/modules/config/config.constants';
import { getBody } from './http-client.models';

export { apiClient };

async function apiClient<T>({ path, method, body }: { path: string; method: string; body?: unknown }): Promise<T> {
  const url = new URL(path, buildTimeConfig.baseApiUrl).toString();

  const accessToken = authStore.getAccessToken();

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },

    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = new Error(response.statusText);
    Object.assign(error, {
      status: response.status,
      body: await getBody({ response }),
    });

    throw error;
  }

  return response.json();
}
