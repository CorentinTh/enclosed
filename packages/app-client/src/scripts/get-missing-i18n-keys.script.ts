import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { flatten } from '@solid-primitives/i18n';
import { difference, keys, omitBy } from 'lodash-es';
import { locales } from '../locales/locales';

const localesContent = await Promise.all(locales.map(async (locale) => {
  const filePath = join('src', 'locales', `${locale.key}.json`);
  const fileContent = await readFile(filePath, 'utf-8');

  return {
    ...locale,
    content: JSON.parse(fileContent),
    flatContent: omitBy(flatten(JSON.parse(fileContent)), value => typeof value !== 'string' && !Array.isArray(value)),
  };
}));

const defaultLocale = localesContent.find(locale => locale.key === 'en')!;
const nonDefaultLocales = localesContent.filter(locale => locale.key !== 'en');

const localesWithMissingKeys = nonDefaultLocales.map((locale) => {
  const missingKeys = difference(keys(defaultLocale.flatContent), keys(locale.flatContent));

  return {
    ...locale,
    missingKeys,
  };
});

console.log(
  localesWithMissingKeys
    .filter(locale => locale.missingKeys.length > 0)
    .map(locale => [
      `Locale: ${locale.name} (${locale.key}) has ${locale.missingKeys.length} missing keys:`,
      ...locale.missingKeys.map(key => `  - ${key}`),
    ].join('\n'))
    .join('\n\n'),
);
