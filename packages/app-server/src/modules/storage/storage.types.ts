import type { Storage } from 'unstorage';
import type { Config } from '../app/config/config.types';
import type { Context } from '../app/server.types';

export type { Storage };

export type BindableStorageFactoryArgs = { config: Config; context: Context };
export type BindableStorageFactory = (args: BindableStorageFactoryArgs) => { storage: Storage };
export type StorageFactory = () => { storage: Storage };
