import { get } from 'lodash-es';

export { isHttpErrorWithCode };

function isHttpErrorWithCode({ error, code }: { error: unknown; code: string }) {
  return get(error, 'body.error.code') === code;
}
