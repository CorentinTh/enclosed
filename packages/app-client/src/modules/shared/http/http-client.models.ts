export { buildUrl, getBody, isFetchResponseJson, joinUrlParts };

function isFetchResponseJson({ response }: { response: Response }): boolean {
  return Boolean(response.headers.get('content-type')?.includes('application/json'));
}

function getBody({ response }: { response: Response }): Promise<unknown> {
  try {
    return isFetchResponseJson({ response }) ? response.json() : response.text();
  } catch (_error) {
    return Promise.resolve({});
  }
}

function joinUrlParts(...parts: string[]): string {
  return parts.map(part => part.replace(/(^\/|\/$)/g, '')).filter(Boolean).join('/');
}

function buildUrl({
  path,
  baseUrl,
  origin = window.location.origin,
}: {
  path: string;
  baseUrl: string;
  origin?: string;
}): string {
  const isAbsoluteBaseUrl = baseUrl.startsWith('http');

  if (isAbsoluteBaseUrl) {
    return new URL(path, baseUrl).toString();
  }

  const joinedPath = joinUrlParts(baseUrl, path);

  return new URL(joinedPath, origin).toString();
}
