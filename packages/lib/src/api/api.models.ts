import { get, isError } from 'lodash-es';

export { isApiClientErrorWithCode, isApiClientErrorWithStatusCode };

function isApiClientErrorWithStatusCode({ error, statusCode }: { error: unknown; statusCode: number }): boolean {
  if (!isError(error)) {
    return false;
  }

  return get(error, 'response.status') === statusCode;
}

function isApiClientErrorWithCode({ error, code }: { error: unknown; code: string }): boolean {
  if (!isError(error)) {
    return false;
  }

  return get(error, 'response.body.error.code') === code;
}
