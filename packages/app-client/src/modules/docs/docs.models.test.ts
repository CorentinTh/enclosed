import { describe, expect, test } from 'vitest';
import { buildDocUrl, joinUrlParts } from './docs.models';

describe('docs models', () => {
  describe('buildDocUrl', () => {
    test('it creates a url to the documentation', () => {
      expect(
        buildDocUrl({
          path: '/test',

          baseUrl: 'https://docs.enclosed.cc',
        }),
      ).to.eql('https://docs.enclosed.cc/test');
    });

    test('it uses the default base url', () => {
      expect(buildDocUrl({ path: '/test' })).to.eql('https://docs.enclosed.cc/test');
    });

    test('it handles clashing slashes', () => {
      expect(
        buildDocUrl({
          path: '/test',
          baseUrl: 'https://docs.enclosed.cc/',
        }),
      ).to.eql('https://docs.enclosed.cc/test');
    });
  });

  describe('joinUrlParts', () => {
    test('it merges url parts and trim slashes', () => {
      expect(joinUrlParts('/part1/', '/part2/', 'part3', 'part4/')).to.eql('part1/part2/part3/part4');
      expect(joinUrlParts('/part1/part2/', 'part3', 'part4/')).to.eql('part1/part2/part3/part4');
      expect(joinUrlParts('')).to.eql('');
    });

    test('multiple slashes inside a part are preserved', () => {
      expect(joinUrlParts('/part1//part2/', '/part3/')).to.eql('part1//part2/part3');
    });
  });
});
