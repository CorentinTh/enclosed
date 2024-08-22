export { createRandomBuffer, mergeBuffers, createBuffer, bufferToBase64Url, base64UrlToBuffer };

function createRandomBuffer({ length = 16 }: { length?: number } = {}): Uint8Array {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  return randomValues;
}

function mergeBuffers(...buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);
  const mergedBuffer = new Uint8Array(totalLength);

  let offset = 0;
  buffers.forEach((buffer) => {
    mergedBuffer.set(buffer, offset);
    offset += buffer.length;
  });

  return mergedBuffer;
}

function createBuffer({ value }: { value: string }): Uint8Array {
  return new TextEncoder().encode(value);
}

function bufferToBase64Url({ buffer }: { buffer: Uint8Array }): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return base64Url;
}

function base64UrlToBuffer({ base64Url }: { base64Url: string }): Uint8Array {
  const base64 = base64Url.padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=').replace(/-/g, '+').replace(/_/g, '/');
  const buffer = new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));

  return buffer;
}
