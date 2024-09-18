export { base64UrlToBuffer, bufferToBase64Url, createRandomBuffer, deriveMasterKey, generateBaseKey };

function bufferToBase64Url({ buffer }: { buffer: Uint8Array }): string {
  const chunkSize = 0x8000; // 32KB chunks to avoid stack overflow
  let binaryString = '';
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.subarray(i, i + chunkSize);
    binaryString += String.fromCharCode.apply(null, chunk);
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

function createRandomBuffer({ length = 16 }: { length?: number } = {}): Uint8Array {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  return randomValues;
}

function generateBaseKey(): { baseKey: Uint8Array } {
  return { baseKey: createRandomBuffer({ length: 32 }) };
}

async function deriveMasterKey({ baseKey, password = '' }: { baseKey: Uint8Array; password?: string }) {
  const passwordBuffer = new TextEncoder().encode(password);
  const mergedBuffers = new Uint8Array([...baseKey, ...passwordBuffer]);

  const key = await crypto.subtle.importKey('raw', mergedBuffers, 'PBKDF2', false, ['deriveKey']);

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: baseKey,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    key,
    { name: 'AES-GCM', length: 256 },
    true, // Extractable
    ['encrypt', 'decrypt'],
  );

  const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);

  return {
    masterKey: new Uint8Array(exportedKey),
  };
}
