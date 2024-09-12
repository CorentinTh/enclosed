export { base64UrlToBuffer, bufferToBase64Url };

function bufferToBase64Url({ buffer }: { buffer: Uint8Array }): string {
  let binaryString = '';
  const chunkSize = 0x8000; // 32KB chunks to avoid stack overflow
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.subarray(i, i + chunkSize);
    binaryString += String.fromCharCode(...chunk);
  }

  const base64 = btoa(binaryString);
  const base64Url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return base64Url;
}

function base64UrlToBuffer({ base64Url }: { base64Url: string }): Uint8Array {
  const base64 = base64Url
    .padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const buffer = new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));

  return buffer;
}
