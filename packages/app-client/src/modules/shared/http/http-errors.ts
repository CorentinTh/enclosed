import { get } from 'lodash-es';

export { isHttpErrorWithCode, isRateLimitError };

function isHttpErrorWithCode({ error, code }: { error: unknown; code: string }) {
  return get(error, 'body.error.code') === code;
}

function isRateLimitError({ error }: { error: unknown }) {
  return get(error, 'status') === 429;
}
