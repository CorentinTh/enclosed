import { Buffer } from 'node:buffer';

export { bufferToBase64Url, base64UrlToBuffer };

function bufferToBase64Url({ buffer }: { buffer: Uint8Array }): string {
  const base64Url = Buffer.from(buffer).toString('base64url');

  return base64Url;
}

function base64UrlToBuffer({ base64Url }: { base64Url: string }): Uint8Array {
  const buffer = Buffer.from(base64Url, 'base64url');

  return new Uint8Array(buffer);
}
