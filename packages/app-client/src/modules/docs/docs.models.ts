import { buildTimeConfig } from '../config/config.constants';
import { joinUrlParts } from '../shared/http/http-client.models';

export { buildDocUrl };

function buildDocUrl({
  path,
  baseUrl = buildTimeConfig.documentationBaseUrl,
}: {
  path: string;
  baseUrl?: string;
}): string {
  const url = joinUrlParts(baseUrl, path);

  return url;
}
