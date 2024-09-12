import { ofetch } from 'ofetch';
import { DEFAULT_API_BASE_URL } from './api.constants';

export { apiClient };

async function tryToGetBody({ response }: { response: Response }): Promise<unknown> {
  try {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (_error) {
    return {};
  }
}

async function apiClient<T>({
  path,
  method,
  body,
  baseUrl = DEFAULT_API_BASE_URL,
}: {
  path: string;
  method: string;
  body?: Record<string, unknown>;
  baseUrl?: string;
}): Promise<T> {
  const data = await ofetch<T>(
    path,
    {
      method,
      body,
      baseURL: baseUrl,
      onResponseError: async ({ response }) => {
        throw Object.assign(
          new Error('Failed to make API request'),
          {
            response: {
              status: response.status,
              body: tryToGetBody({ response }),
            },
          },
        );
      },
    },
  );

  return data;
}
