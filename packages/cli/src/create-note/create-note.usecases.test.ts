import { describe, expect, test } from 'vitest';
import { getNoteContent } from './create-note.usecases';

describe('create-note usecases', () => {
  describe('getNoteContent', () => {
    test('by default, returns the raw content', async () => {
      expect(await getNoteContent({ rawContent: 'content' })).toEqual('content');
    });

    test('when the user wants to read from stdin, reads from stdin, regardless of the content', async () => {
      const readFromStdin = async () => 'stdin content';
      expect(await getNoteContent({ rawContent: 'content', shouldReadFromStdin: true, readFromStdin })).toEqual('stdin content');
    });

    // Citty, the cli builder does not support single dash as positional argument, so this feature is not supported
    // test('to follow the Unix convention, reads from stdin when the raw content is "-"', async () => {
    //   const readFromStdin = async () => 'stdin content';
    //   expect(await getNoteContent({ rawContent: '-', readFromStdin })).toEqual('stdin content');
    //   expect(await getNoteContent({ rawContent: '-', readFromStdin, shouldReadFromStdin: true })).toEqual('stdin content');
    //   expect(await getNoteContent({ rawContent: '-', readFromStdin, shouldReadFromStdin: false })).toEqual('stdin content');
    // });
  });
});
