import { env as getEnv } from 'hono/adapter';
import { createMiddleware } from 'hono/factory';
import _ from 'lodash';
import { getConfig } from '../config/config';

export const configMiddleware = createMiddleware(async (c, next) => {
  const env = getEnv(c);
  const baseConfig = getConfig({ env });
  const overrideConfig = baseConfig.env === 'test' ? c.env.CONFIG_OVERRIDE : {};

  const config = _.merge({}, baseConfig, overrideConfig);

  c.set('config', config);

  await next();
});
