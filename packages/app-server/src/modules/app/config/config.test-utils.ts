import type { DeepPartial } from '@corentinth/chisels';
import type { Config } from './config.types';
import { merge } from 'lodash-es';
import { getConfig } from './config';

export { overrideConfig };

function overrideConfig(config: DeepPartial<Config>) {
  const defaultConfig = getConfig();

  return merge({}, defaultConfig, config);
}
