import type { ConfigDefinition, ConfigDefinitionElement } from 'figue';
import { isArray, isEmpty, isNil } from 'lodash-es';
import { createMarkdownRenderer, type SiteConfig } from 'vitepress';

import { configDefinition } from '../../../app-server/src/modules/app/config/config';

const config = globalThis.VITEPRESS_CONFIG as SiteConfig;
const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger);

function walk(configDefinition: ConfigDefinition, path: string[] = []): (ConfigDefinitionElement & { path: string[] })[] {
  return Object
    .entries(configDefinition)
    .flatMap(([key, value]) => {
      if ('schema' in value) {
        return [{ ...value, path: [...path, key] }] as (ConfigDefinitionElement & { path: string[] })[];
      }

      return walk(value, [...path, key]);
    });
}

const configDetails = walk(configDefinition);

function formatDoc(doc: string | undefined): string {
  const coerced = (doc ?? '').trim();

  if (coerced.endsWith('.')) {
    return coerced;
  }

  return `${coerced}.`;
}

const rows = configDetails
  .filter(({ path }) => path[0] !== 'env')
  .map(({ doc, default: defaultValue, env }) => {
    const isEmptyDefaultValue = isNil(defaultValue) || (isArray(defaultValue) && isEmpty(defaultValue)) || defaultValue === '';

    const rawDocumentation = formatDoc(doc) + (isEmptyDefaultValue ? '' : ` Default value: \`${defaultValue}\`.`);

    return {
      env,
      documentation: rawDocumentation,
    };
  });

const mdRows = rows.map(({ documentation, env }) => `| \`${env}\` | ${documentation} |`);

const mdTable = [
  '| Environment variable | Documentation |',
  '| --- | --- |',
  ...mdRows,
].join('\n');

export default {
  watch: ['../../../app-server/src/modules/app/config/config.ts'],
  async load() {
    return md.render(mdTable);
  },
};
