import { config } from '../config/config';

export { buildDocUrl, joinUrlParts };

function joinUrlParts(...parts: string[]): string {
  return parts.map(part => part.replace(/(^\/|\/$)/g, '')).join('/');
}

function buildDocUrl({
  path,
  baseUrl = config.documentationBaseUrl,
}: {
  path: string;
  baseUrl?: string;
}): string {
  const url = joinUrlParts(baseUrl, path);

  return url;
}
