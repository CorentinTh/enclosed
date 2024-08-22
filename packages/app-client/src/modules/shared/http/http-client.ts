export { apiClient };

async function apiClient<T>({ path, method, body }: { path: string; method: string; body?: unknown }): Promise<T> {
  const baseUrl = 'http://localhost:8787'; // TODO: move to config

  const url = new URL(path, baseUrl).toString();

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
