import { describe, expect, test } from 'vitest';
import { createNoteUrl, parseNoteUrl } from './notes.models';

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

  describe('parseNoteUrl', () => {
    test('retreives the note id and encryption key from a sharable note url', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123#abc' }),
      ).to.eql({
        noteId: '123',
        encryptionKey: 'abc',
      });
    });

    test('trailing slash in the base url is handled', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123/#abc' }),
      ).to.eql({
        noteId: '123',
        encryptionKey: 'abc',
      });
    });

    test('in case of nested paths, the last path segment is considered the note id', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123/456#abc' }),
      ).to.eql({
        noteId: '456',
        encryptionKey: 'abc',
      });
    });

    test('throws an error if their is no note id or encryption key', () => {
      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/#abc' });
      }).to.throw('Invalid note url');

      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/123#' });
      }).to.throw('Invalid note url');

      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/123' });
      }).to.throw('Invalid note url');

      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/' });
      }).to.throw('Invalid note url');
    });
  });
});
