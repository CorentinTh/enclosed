import type { Context as BaseContext, Hono } from 'hono';
import type { Storage } from 'unstorage';
import type { Config } from './config/config.types';

export type ServerInstanceGenerics = {
  Bindings: {
    notes: KVNamespace;
  };
  Variables: {
    config: Config;
    storage: Storage;
  };
};

export type Context = BaseContext<ServerInstanceGenerics>;

export type ServerInstance = Hono<ServerInstanceGenerics>;
