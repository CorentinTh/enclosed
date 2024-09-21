import { flatten } from '@solid-primitives/i18n';
import { chain, difference, get, keys } from 'lodash-es';
import { describe, expect, test } from 'vitest';
import defaultLocale from './en.json';

const localesFiles = import.meta.glob('./*.json', { eager: true });
const locales = chain(localesFiles)
  .map((value, key) => ({
    key: key.replace('./', '').replace('.json', ''),
    value: get(value, 'default') as any,
  }))
  .reject(({ key }) => key === 'en')
  .value() as { key: string; value: Record<string, unknown> }[];

const flattenedDefault = flatten(defaultLocale);

describe('locales', () => {
  test('locales should not have extra keys compared to default locale', () => {
    locales.forEach(({ key, value }) => {
      const flattened = flatten(value);
      const extraKeys = difference(keys(flattened), keys(flattenedDefault));

      expect(extraKeys).to.eql([], `Extra keys found in ${key}.json`);
    });
  });
});
