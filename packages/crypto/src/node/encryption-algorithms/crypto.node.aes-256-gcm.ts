import { createCipheriv, createDecipheriv } from 'node:crypto';
import { defineEncryptionMethods } from '../../encryption-algorithms/encryption-algorithms.models';
import { base64UrlToBuffer, bufferToBase64Url, createRandomBuffer } from '../crypto.node.usecases';

export const aes256GcmEncryptionAlgorithmDefinition = defineEncryptionMethods({

  encryptBuffer: async ({ buffer, encryptionKey }) => {
    const iv = createRandomBuffer({ length: 12 });

    const cipher = createCipheriv('aes-256-gcm', encryptionKey, iv);

    const encryptedBuffer = new Uint8Array([...cipher.update(buffer), ...cipher.final(), ...cipher.getAuthTag()]);
    const encrypted = bufferToBase64Url({ buffer: encryptedBuffer });

    return {
      encryptedString: `${bufferToBase64Url({ buffer: iv })}:${encrypted}`,
    };
  },

  decryptString: async ({ encryptedString, encryptionKey }) => {
    const [ivString, encryptedStringWithAuthTag] = encryptedString.split(':').map(part => part.trim());

    if (!ivString || !encryptedStringWithAuthTag) {
      throw new Error('Invalid encrypted content');
    }

    const iv = base64UrlToBuffer({ base64Url: ivString });
    const encryptedContentAndTagBuffer = base64UrlToBuffer({ base64Url: encryptedStringWithAuthTag });

    const encryptedBuffer = encryptedContentAndTagBuffer.slice(0, -16);
    const authTag = encryptedContentAndTagBuffer.slice(-16);

    const decipher = createDecipheriv('aes-256-gcm', encryptionKey, iv);
    decipher.setAuthTag(authTag);

    const decryptedBuffer = new Uint8Array([...decipher.update(encryptedBuffer), ...decipher.final()]);

    return { decryptedBuffer };
  },
});
