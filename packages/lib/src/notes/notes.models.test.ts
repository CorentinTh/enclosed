import { describe, expect, test } from 'vitest';
import { createNoteUrl } from './notes.models';

describe('note models', () => {
  describe('createNoteUrl', () => {
    test('a sharable note url contains the note id as path and the encryption key as hash', () => {
      expect(
        createNoteUrl({ noteId: '123', encryptionKey: 'abc', clientBaseUrl: 'https://example.com' }),
      ).to.eql({
        noteUrl: 'https://example.com/123#abc',
      });
    });

    test('trailing slash in the base url is handled', () => {
      expect(
        createNoteUrl({ noteId: '123', encryptionKey: 'abc', clientBaseUrl: 'https://example.com/' }),
      ).to.eql({
        noteUrl: 'https://example.com/123#abc',
      });
    });
  });
});
