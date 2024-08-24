import { env as getEnv } from 'hono/adapter';
import { createMiddleware } from 'hono/factory';
import _ from 'lodash';
import { getConfig } from '../config/config';
import type { Config } from '../config/config.types';

export function createConfigMiddleware({ config: initialConfig }: { config?: Config } = {}) {
  return createMiddleware(async (c, next) => {
    if (initialConfig) {
      c.set('config', initialConfig);
      await next();
      return;
    }

    const env = getEnv(c);
    const config = getConfig({ env });

    c.set('config', config);

    await next();
  });
}
