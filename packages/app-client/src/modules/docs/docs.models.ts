import { buildTimeConfig } from '../config/config.constants';

export { buildDocUrl, joinUrlParts };

function joinUrlParts(...parts: string[]): string {
  return parts.map(part => part.replace(/(^\/|\/$)/g, '')).join('/');
}

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
