import { describe, expect, test } from 'vitest';
import { base64UrlToBuffer, bufferToBase64Url } from './crypto.web.usecases';

describe('crypto models', () => {
  describe('bufferToBase64Url', () => {
    test('an 8-bit buffer is converted to a base64url string (no "+", "/", or "=")', () => {
      const buffer = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const base64Url = bufferToBase64Url({ buffer });

      expect(base64Url).toBe('AAECAwQFBgcICQ');
    });

    test('the trailing "=" characters are removed from the base64url string', () => {
      // "a" char is encoded as "YQ==" in regular base64
      const buffer = new Uint8Array([97]);
      const base64Url = bufferToBase64Url({ buffer });

      expect(base64Url).toBe('YQ');
    });

    test('the "+" characters are replaced with "-" in the base64url string and the "/" characters are replaced with "_"', () => {
      // this buffer translate to An1aThIn/OeGWQUn+e4o2nEXvdtEagY2lJxCQN1SgKc= in regular base64
      const buffer = new Uint8Array([2, 125, 90, 78, 18, 39, 252, 231, 134, 89, 5, 39, 249, 238, 40, 218, 113, 23, 189, 219, 68, 106, 6, 54, 148, 156, 66, 64, 221, 82, 128, 167]);

      const base64Url = bufferToBase64Url({ buffer });

      expect(base64Url).toBe('An1aThIn_OeGWQUn-e4o2nEXvdtEagY2lJxCQN1SgKc');
    });

    test('it can stringify a large buffer', () => {
      const length = 10_000_000;
      const buffer = new Uint8Array(length);

      for (let i = 0; i < length; i++) {
        buffer[i] = i % 256;
      }

      const base64Url = bufferToBase64Url({ buffer });

      expect(base64Url).toBeDefined();
    });
  });

  describe('base64UrlToBuffer', () => {
    test('a base64url string is converted to an 8-bit buffer', () => {
      expect(base64UrlToBuffer({ base64Url: 'AAECAwQFBgcICQ' })).to.eql(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
      expect(base64UrlToBuffer({ base64Url: 'An1aThIn_OeGWQUn-e4o2nEXvdtEagY2lJxCQN1SgKc' })).to.eql(new Uint8Array([2, 125, 90, 78, 18, 39, 252, 231, 134, 89, 5, 39, 249, 238, 40, 218, 113, 23, 189, 219, 68, 106, 6, 54, 148, 156, 66, 64, 221, 82, 128, 167]));
    });
  });
});
