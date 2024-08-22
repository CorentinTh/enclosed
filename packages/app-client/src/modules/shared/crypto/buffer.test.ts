import { describe, expect, test } from 'vitest';
import { base64UrlToBuffer, bufferToBase64Url } from './buffer';

describe('buffer', () => {
  describe('bufferToBase64Url', () => {
    test('an 8-bit buffer is converted to a base64url string (no "+", "/", or "=")', () => {
      const buffer = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const base64Url = bufferToBase64Url({ buffer });

      expect(base64Url).toBe('AAECAwQFBgcICQ');
    });
  });

  describe('base64UrlToBuffer', () => {
    test('a base64url string is converted to an 8-bit buffer', () => {
      const base64Url = 'AAECAwQFBgcICQ';
      const buffer = base64UrlToBuffer({ base64Url });

      expect(buffer).toEqual(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
    });
  });
});
