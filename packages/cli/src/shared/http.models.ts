import { get } from 'lodash-es';

export { looksLikeRateLimitError };

function looksLikeRateLimitError({ error }: { error: unknown }): boolean {
  const status = get(error, 'response.status');

  return status === 429;
}
