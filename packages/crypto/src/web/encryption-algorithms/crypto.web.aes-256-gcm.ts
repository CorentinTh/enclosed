import { defineEncryptionMethods } from '../../encryption-algorithms/encryption-algorithms.models';
import { base64UrlToBuffer, bufferToBase64Url, createRandomBuffer } from '../crypto.web.usecases';

export const aes256GcmEncryptionAlgorithmDefinition = defineEncryptionMethods({

  encryptBuffer: async ({ buffer, encryptionKey }) => {
    const iv = createRandomBuffer({ length: 12 });

    const key = await crypto.subtle.importKey('raw', encryptionKey, 'AES-GCM', false, ['encrypt']);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, buffer);
    const encryptedBuffer = new Uint8Array(encrypted);

    const ivString = bufferToBase64Url({ buffer: iv });
    const payloadString = bufferToBase64Url({ buffer: encryptedBuffer });
    const encryptedString = `${ivString}:${payloadString}`;

    return {
      encryptedString,
    };
  },

  decryptString: async ({ encryptedString, encryptionKey }) => {
    const [ivString, encryptedContentString] = encryptedString.split(':').map(part => part.trim());

    if (!ivString || !encryptedContentString) {
      throw new Error('Invalid encrypted content');
    }

    const iv = base64UrlToBuffer({ base64Url: ivString });
    const encrypted = base64UrlToBuffer({ base64Url: encryptedContentString });

    const key = await crypto.subtle.importKey('raw', encryptionKey, 'AES-GCM', false, ['decrypt']);
    const decryptedCryptoBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
    const decryptedBuffer = new Uint8Array(decryptedCryptoBuffer);

    return { decryptedBuffer };
  },
});
