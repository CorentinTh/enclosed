import { merge } from 'lodash-es';
import type { DeepPartial } from '@corentinth/chisels';
import { getConfig } from './config';
import type { Config } from './config.types';

export { overrideConfig };

function overrideConfig(config: DeepPartial<Config>) {
  const defaultConfig = getConfig();

  return merge({}, defaultConfig, config);
}
