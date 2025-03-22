import { describe, expect, test } from 'vitest';
import { buildViewNotePagePath } from './notes.models';

describe('notes models', () => {
  describe('buildViewNotePagePath', () => {
    describe('when self-hosting, user can configure a prefix for the view note page', () => {
      test('for nullish or empty prefix, the path is /:noteId', () => {
        expect(buildViewNotePagePath({ prefix: null })).toBe('/:noteId');
        expect(buildViewNotePagePath({ prefix: '' })).toBe('/:noteId');
        expect(buildViewNotePagePath({ prefix: '/' })).toBe('/:noteId');
        expect(buildViewNotePagePath({ prefix: undefined })).toBe('/:noteId');
        expect(buildViewNotePagePath({ })).toBe('/:noteId');
      });

      test('for a non-empty prefix, the prefix is prepended to the noteId param', () => {
        expect(buildViewNotePagePath({ prefix: 'test' })).toBe('/test/:noteId');
        expect(buildViewNotePagePath({ prefix: '/test' })).toBe('/test/:noteId');
        expect(buildViewNotePagePath({ prefix: 'test/' })).toBe('/test/:noteId');
        expect(buildViewNotePagePath({ prefix: '/test/' })).toBe('/test/:noteId');
        expect(buildViewNotePagePath({ prefix: 'test/prefix' })).toBe('/test/prefix/:noteId');
        expect(buildViewNotePagePath({ prefix: 'test/prefix/' })).toBe('/test/prefix/:noteId');
        expect(buildViewNotePagePath({ prefix: '/test/prefix' })).toBe('/test/prefix/:noteId');
        expect(buildViewNotePagePath({ prefix: '/test/prefix/' })).toBe('/test/prefix/:noteId');
      });
    });
  });
});
