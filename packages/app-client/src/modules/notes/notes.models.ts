import { joinUrlPaths } from '@corentinth/chisels';
import { sample, times } from 'lodash-es';

export { createRandomPassword };

function createRandomPassword({ length = 16 }: { length?: number } = {}): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+';

  const corpus = alphabet + alphabet.toUpperCase() + numbers + specialChars;

  return times(length, () => sample(corpus)).join('');
}

export function buildViewNotePagePath({ prefix }: { prefix?: string | null }): string {
  const noteIdParam = '/:noteId';

  if (!prefix || prefix === '' || prefix === '/') {
    return noteIdParam;
  }

  return `/${joinUrlPaths(prefix, noteIdParam)}`;
}
