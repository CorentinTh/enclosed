import { describe, expect, test } from 'vitest';
import { buildUrl, joinUrlParts } from './http-client.models';

describe('http-client models', () => {
  describe('buildUrl', () => {
    test('create an absolute URL for a path and base URL', () => {
      const path = '/api';
      const baseUrl = 'https://example.com';

      const result = buildUrl({ path, baseUrl });

      expect(result).toBe('https://example.com/api');
    });

    test('when the base url is just a path, it uses the window location origin', () => {
      const path = '/api';
      const baseUrl = '/base';

      const result = buildUrl({ path, baseUrl, origin: 'http://localhost' });

      expect(result).toBe('http://localhost/base/api');
    });

    test('it handles clashing and missing slashes', () => {
      expect(
        buildUrl({
          path: '/api',
          baseUrl: 'https://example.com/',
        }),
      ).toBe('https://example.com/api');

      expect(
        buildUrl({
          path: 'api',
          baseUrl: 'https://example.com',
        }),
      ).toBe('https://example.com/api');
    });

    test('paths can contain multiple slashes', () => {
      expect(
        buildUrl({
          path: '/api/v1',
          baseUrl: 'foo/bar',
          origin: 'https://example.com',
        }),
      ).toBe('https://example.com/foo/bar/api/v1');
    });
  });

  describe('joinUrlParts', () => {
    test('it merges url parts and trim slashes', () => {
      expect(joinUrlParts('/part1/', '/part2/', 'part3', 'part4/')).to.eql('part1/part2/part3/part4');
      expect(joinUrlParts('/part1/part2/', 'part3', 'part4/')).to.eql('part1/part2/part3/part4');
      expect(joinUrlParts('/part1/part2/', '/', '/part3/')).to.eql('part1/part2/part3');
      expect(joinUrlParts('')).to.eql('');
    });

    test('multiple slashes inside a part are preserved', () => {
      expect(joinUrlParts('/part1//part2/', '/part3/')).to.eql('part1//part2/part3');
    });
  });
});
