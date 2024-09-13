import type { Context as BaseContext, Hono } from 'hono';
import type { Storage } from '../storage/storage.types';
import type { Config } from './config/config.types';

export type ServerInstanceGenerics = {
  Variables: {
    config: Config;
    storage: Storage;
    isAuthenticated: boolean;
  };
};

export type Context = BaseContext<ServerInstanceGenerics>;

export type ServerInstance = Hono<ServerInstanceGenerics>;
