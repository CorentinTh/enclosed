export { getBody, isFetchResponseJson };

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
