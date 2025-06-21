import { access, constants } from 'node:fs/promises';
import { flatten } from '@solid-primitives/i18n';
import { chain, difference, get, keys } from 'lodash-es';
import { describe, expect, test } from 'vitest';
import defaultLocale from './en.json';
import { locales } from './locales';

function fileExists(relativePath: string) {
  const path = new URL(relativePath, import.meta.url).pathname;

  return access(path, constants.F_OK).then(() => true).catch(() => false);
}

const localesFiles = import.meta.glob('./*.json', { eager: true });
const localesKeys = chain(localesFiles)
  .map((value, key) => ({
    key: key.replace('./', '').replace('.json', ''),
    value: get(value, 'default') as any,
  }))
  .reject(({ key }) => key === 'en')
  .value() as { key: string; value: Record<string, unknown> }[];

const flattenedDefault = flatten(defaultLocale);

describe('locales', () => {
  test('locales should not have extra keys compared to default locale', () => {
    localesKeys.forEach(({ key, value }) => {
      const flattened = flatten(value);
      const extraKeys = difference(keys(flattened), keys(flattenedDefault));

      expect(extraKeys).to.eql([], `Extra keys found in ${key}.json`);
    });
  });

  test('ensure all defined locales have a file in the locales folder', async () => {
    for (const { key } of locales) {
      expect(await fileExists(`./${key}.json`)).to.eql(true, `Missing file for locale ${key}`);
    }
  });

  test('make sure locales are sorted by the native language name', () => {
    const sortedLocales = [...locales].sort((a, b) => a.name.localeCompare(b.name));
    expect(locales).to.eql(sortedLocales);
  });
});
