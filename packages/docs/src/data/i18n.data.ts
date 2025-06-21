import type { SiteConfig } from 'vitepress';
import { orderBy } from 'lodash-es';
import { createMarkdownRenderer } from 'vitepress';
import { locales } from '../../../app-client/src/locales/locales';

const config = globalThis.VITEPRESS_CONFIG as SiteConfig;
const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger);

function countKeysDeep(obj: Record<string, unknown>): number {
  let count = 0;

  for (const key in obj) {
    count++;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeysDeep(obj[key] as Record<string, unknown>);
    }
  }

  return count;
}

const defaultLocaleKeyCount = countKeysDeep(await import(`../../../app-client/src/locales/en.json`).then(({ default: fileContent }) => fileContent));

const localeConfigs = orderBy(
  await Promise.all(locales.map(async ({ key, name }) => {
    const { default: fileContent } = await import(`../../../app-client/src/locales/${key}.json`);
    const keyCount = countKeysDeep(fileContent);
    const ratio = keyCount / defaultLocaleKeyCount;
    const isComplete = keyCount === defaultLocaleKeyCount;

    return {
      key,
      name,
      content: fileContent,
      keyCount,
      ratio,
      isComplete,
    };
  })),

  // 'en' first, then by ratio, then by key
  [({ key }) => key === 'en', 'ratio', 'key'],
  ['desc', 'desc', 'asc'],
);

const mdTable = [
  '| Locale | Key | Translation completion | Actions |',
  '| --- | --- | --- | --- |',
  ...localeConfigs.map(({ key, name, keyCount, ratio, isComplete }) => `| ${[
    name,
    key,
    `${isComplete ? '✅' : '🚧'} ${(ratio * 100).toFixed(0)}% - ${keyCount} / ${defaultLocaleKeyCount}`,
    `[See translation file](https://github.com/CorentinTh/enclosed/blob/main/packages/app-client/src/locales/${key}.json)`,
  ].join(' | ')} |`),

].join('\n');

export default {
  watch: ['../../../app-client/src/locales/*'],
  async load() {
    return {
      localeConfigs,
      table: md.render(mdTable),
    };
  },
};
