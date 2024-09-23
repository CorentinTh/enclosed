import type { Config } from './config.types';
import { get } from 'lodash-es';
import { buildTimeConfig } from './config.constants';

export {
  getConfig,
};

function getConfig(): Config {
  const runtimeConfig: Partial<Config> = get(window, '__CONFIG__', {});

  const config: Config = {
    ...buildTimeConfig,
    ...runtimeConfig,
  };

  return config;
}
