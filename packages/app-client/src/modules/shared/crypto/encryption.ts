import { base64UrlToBuffer, bufferToBase64Url, createBuffer, createRandomBuffer } from './buffer';

export { aesEncrypt, aesDecrypt };

async function aesEncrypt({ data, key: rawKey }: { data: Uint8Array; key: Uint8Array }): Promise<string> {
  const iv = createRandomBuffer({ length: 12 });

  const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  const ivString = bufferToBase64Url({ buffer: iv });
  const encryptedString = bufferToBase64Url({ buffer: new Uint8Array(encrypted) });

  return `${ivString}:${encryptedString}`;
}

async function aesDecrypt({ data, key: rawKey }: { data: string; key: Uint8Array }): Promise<string> {
  const [ivString, encryptedString] = data.split(':').map(part => part.trim());

  if (!ivString || !encryptedString) {
    throw new Error('Invalid data');
  }

  const iv = base64UrlToBuffer({ base64Url: ivString });
  const encrypted = base64UrlToBuffer({ base64Url: encryptedString });

  const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

  return new TextDecoder().decode(decrypted);
}
