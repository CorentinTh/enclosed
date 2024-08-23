import { config } from '@/modules/config/config';

export { apiClient };

async function apiClient<T>({ path, method, body }: { path: string; method: string; body?: unknown }): Promise<T> {
  const url = new URL(path, config.baseApiUrl).toString();

  const response = await fetch(url, {
    method,
    ...(body
      ? {
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      : {}),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
