/* eslint-disable no-console */
import _ from 'lodash-es';
import type { ConfigDefinition, ConfigDefinitionElement } from 'figue';
import { fs } from 'zx';
import { configDefinition } from '../modules/app/config/config';

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

function escapeForRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const configDetails = walk(configDefinition);

const rows = configDetails
  .filter(({ path }) => path[0] !== 'env')
  .map(({ doc, default: defaultValue, env }) => {
    const defaultValueString = _.isNil(defaultValue) ? 'No default value' : `\`${defaultValue}\``;

    return `| \`${env}\` | ${doc} | ${defaultValueString} |`;
  });

const markdownTable = [
  '| Environment Variable | Description | Default Value |',
  '| -------------------- | ----------- | ------------- |',
  ...rows,
].join('\n');

console.log('Generated the following config table:\n');

console.log(markdownTable);

const readmePath = '../../README.md';
const readme = await fs.readFile(readmePath, 'utf8');

const configTableStart = '<!-- env-table-start -->';
const configTableEnd = '<!-- env-table-end -->';

const oldTableRegExp = new RegExp(`${escapeForRegExp(configTableStart)}.*?${escapeForRegExp(configTableEnd)}`, 's');

const newReadme = readme.replace(
  oldTableRegExp,
  `${configTableStart}\n\n${markdownTable}\n\n${configTableEnd}`,
);

await fs.writeFile(readmePath, newReadme);

console.log('\n-> Updated README.md with the new config table');
