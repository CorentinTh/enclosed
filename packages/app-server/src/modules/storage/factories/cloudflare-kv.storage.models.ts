import { isError } from 'lodash-es';

export { looksLikeCloudflare413Error };

function looksLikeCloudflare413Error({ error }: { error: unknown }) {
  if (isError(error)) {
    return error?.message?.startsWith('KV PUT failed: 413 Value length of') ?? false;
  }

  return false;
}
