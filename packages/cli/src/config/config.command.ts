import { defineCommand } from 'citty';
import picocolors from 'picocolors';
import { keys, map } from 'lodash-es';
import { configDefinition } from './config.constants';
import { deleteConfig, getConfig, resetConfig, setConfig } from './config.models';

const keysList = keys(configDefinition).join(', ');

export const configCommand = defineCommand({
  meta: {
    name: 'config',
    description: 'Manage cli configuration',
  },
  subCommands: {
    set: defineCommand({
      meta: {
        name: 'set',
        description: `Set a configuration value`,
      },
      args: {
        key: {
          description: `Configuration key (${keysList})`,
          type: 'positional',
        },
        value: {
          description: 'Configuration value',
          type: 'positional',
        },
      },
      run: async ({ args }) => {
        const { key, value } = args;

        setConfig({
          key: String(key),
          value: String(value),
        });
      },
    }),

    get: defineCommand({
      meta: {
        name: 'get',
        description: `Get a configuration value`,
      },
      args: {
        key: {
          description: `Configuration key (${keysList})`,
          type: 'positional',

        },
      },
      run: async ({ args }) => {
        const { key } = args;

        const value = getConfig({ key: String(key) });

        if (value) {
          // eslint-disable-next-line no-console
          console.log(value ?? '');
        }
      },
    }),

    delete: defineCommand({
      meta: {
        name: 'delete',
        description: `Delete a configuration value`,
      },
      args: {
        key: {
          description: `Configuration key (${keysList})`,
          type: 'positional',
        },
      },
      run: async ({ args }) => {
        const { key } = args;

        deleteConfig({ key: String(key) });
      },
    }),

    reset: defineCommand({
      meta: {
        name: 'reset',
        description: `Reset the whole configuration`,
      },
      run: async () => {
        resetConfig();
      },
    }),

  },
});
