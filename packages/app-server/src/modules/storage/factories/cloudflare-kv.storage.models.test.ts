import { describe, expect, test } from 'vitest';
import { looksLikeCloudflare413Error } from './cloudflare-kv.storage.models';

describe('cloudflare-kv storage models', () => {
  describe('looksLikeCloudflare413Error', () => {
    test('a cloudflare 413 error starts with "KV PUT failed: 413 Value length of", everything else is not a cloudflare 413 error', () => {
      expect(looksLikeCloudflare413Error({
        error: new Error('KV PUT failed: 413 Value length of 41943339 exceeds limit of 26214400.'),
      })).to.eql(true);

      expect(looksLikeCloudflare413Error({
        error: new Error('KV PUT failed: 429 Too many requests.'),
      })).to.eql(false);

      expect(looksLikeCloudflare413Error({ error: undefined })).to.eql(false);
      expect(looksLikeCloudflare413Error({ error: 'foo' })).to.eql(false);
    });
  });
});
