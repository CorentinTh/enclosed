import { describe, expect, test } from 'vitest';
import { createNoteUrl, createNoteUrlHashFragment, parseNoteUrl, parseNoteUrlHashFragment } from './notes.models';

describe('note models', () => {
  describe('createNoteUrl', () => {
    test('a sharable note url contains the note id as path and the encryption key as hash', () => {
      expect(
        createNoteUrl({ noteId: '123', encryptionKey: 'abc', clientBaseUrl: 'https://example.com' }),
      ).to.eql({
        noteUrl: 'https://example.com/123#abc',
      });
    });

    test('a note protected with a password is indicated in the hash fragment', () => {
      expect(
        createNoteUrl({ noteId: '123', encryptionKey: 'abc', clientBaseUrl: 'https://example.com', isPasswordProtected: true }),
      ).to.eql({
        noteUrl: 'https://example.com/123#pw:abc',
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
    test('retrieves the note id and encryption key from a sharable note url', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123#abc' }),
      ).to.eql({
        noteId: '123',
        encryptionKey: 'abc',
        isPasswordProtected: false,
        isDeletedAfterReading: false,
      });
    });

    test('a note protected with a password is indicated in the hash fragment', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123#pw:abc' }),
      ).to.eql({
        noteId: '123',
        encryptionKey: 'abc',
        isPasswordProtected: true,
        isDeletedAfterReading: false,
      });
    });

    test('a note that is deleted after reading is indicated in the hash fragment', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123#dar:abc' }),
      ).to.eql({
        noteId: '123',
        encryptionKey: 'abc',
        isPasswordProtected: false,
        isDeletedAfterReading: true,
      });
    });

    test('a note that is both password protected and deleted after reading is indicated in the hash fragment', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123#pw:dar:abc' }),
      ).to.eql({
        noteId: '123',
        encryptionKey: 'abc',
        isPasswordProtected: true,
        isDeletedAfterReading: true,
      });
    });

    test('trailing slash in the base url is handled', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123/#abc' }),
      ).to.eql({
        noteId: '123',
        encryptionKey: 'abc',
        isPasswordProtected: false,
        isDeletedAfterReading: false,
      });
    });

    test('in case of nested paths, the last path segment is considered the note id', () => {
      expect(
        parseNoteUrl({ noteUrl: 'https://example.com/123/456#abc' }),
      ).to.eql({
        noteId: '456',
        encryptionKey: 'abc',
        isPasswordProtected: false,
        isDeletedAfterReading: false,
      });
    });

    test('throws an error if their is no note id or encryption key', () => {
      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/#abc' });
      }).to.throw('Invalid note url');

      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/123#' });
      }).to.throw('Hash fragment is missing');

      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/123' });
      }).to.throw('Hash fragment is missing');

      expect(() => {
        parseNoteUrl({ noteUrl: 'https://example.com/' });
      }).to.throw('Invalid note url');
    });
  });

  describe('creation + parsing', () => {
    test('a note url can be parsed back to its original parts', () => {
      const { noteUrl } = createNoteUrl({ noteId: '123', encryptionKey: 'abc', clientBaseUrl: 'https://example.com', isPasswordProtected: true });
      const { noteId, encryptionKey, isPasswordProtected } = parseNoteUrl({ noteUrl });

      expect(noteId).to.equal('123');
      expect(encryptionKey).to.equal('abc');
      expect(isPasswordProtected).to.equal(true);
    });
  });

  describe('createNoteUrlHashFragment', () => {
    test('creates a hash fragment from an encryption key', () => {
      expect(
        createNoteUrlHashFragment({ encryptionKey: 'abc' }),
      ).to.equal('abc');
    });

    test('indicates that the note is password protected', () => {
      expect(
        createNoteUrlHashFragment({ encryptionKey: 'abc', isPasswordProtected: true }),
      ).to.equal('pw:abc');
    });

    test('when a note is deleted after reading, it is indicated in the hash fragment with a "dar" segment', () => {
      expect(
        createNoteUrlHashFragment({ encryptionKey: 'abc', isDeletedAfterReading: true }),
      ).to.equal('dar:abc');

      expect(
        createNoteUrlHashFragment({
          encryptionKey: 'abc',
          isPasswordProtected: true,
          isDeletedAfterReading: true,
        }),
      ).to.equal('pw:dar:abc');
    });
  });

  describe('parseNoteUrlHashFragment', () => {
    test('parses an encryption key from a hash fragment', () => {
      expect(
        parseNoteUrlHashFragment({ hashFragment: 'abc' }),
      ).to.eql({
        encryptionKey: 'abc',
        isPasswordProtected: false,
        isDeletedAfterReading: false,

      });
    });

    test('the fragment can indicate that the note is password protected', () => {
      expect(
        parseNoteUrlHashFragment({ hashFragment: 'pw:abc' }),
      ).to.eql({
        encryptionKey: 'abc',
        isPasswordProtected: true,
        isDeletedAfterReading: false,
      });

      expect(
        parseNoteUrlHashFragment({ hashFragment: 'pw:dar:abc' }),
      ).to.eql({
        encryptionKey: 'abc',
        isPasswordProtected: true,
        isDeletedAfterReading: true,
      });

      expect(
        parseNoteUrlHashFragment({ hashFragment: 'dar:abc' }),
      ).to.eql({
        encryptionKey: 'abc',
        isPasswordProtected: false,
        isDeletedAfterReading: true,
      });
    });

    test('the fragment can start with a #', () => {
      expect(
        parseNoteUrlHashFragment({ hashFragment: '#abc' }),
      ).to.eql({
        encryptionKey: 'abc',
        isPasswordProtected: false,
        isDeletedAfterReading: false,
      });

      expect(
        parseNoteUrlHashFragment({ hashFragment: '#pw:abc' }),
      ).to.eql({
        encryptionKey: 'abc',
        isPasswordProtected: true,
        isDeletedAfterReading: false,
      });

      expect(
        parseNoteUrlHashFragment({ hashFragment: '#pw:dar:abc' }),
      ).to.eql({
        encryptionKey: 'abc',
        isPasswordProtected: true,
        isDeletedAfterReading: true,
      });
    });

    test('throws an error if the hash fragment has more than two segments', () => {
      expect(() => {
        parseNoteUrlHashFragment({ hashFragment: 'pw:abc:123' });
      }).to.throw('Invalid hash fragment');
    });

    test('throws an error if the hash fragment is empty', () => {
      expect(() => {
        parseNoteUrlHashFragment({ hashFragment: '' });
      }).to.throw('Hash fragment is missing');
    });
  });
});
