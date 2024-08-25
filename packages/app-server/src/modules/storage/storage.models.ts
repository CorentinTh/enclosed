import type { BindableStorageFactory, Storage } from './storage.types';

export { defineStorage, defineBindableStorageFactory };

function defineStorage<InitialsArgs = void>(fn: (args: InitialsArgs) => { storage: Storage }) {
  return fn;
}

function defineBindableStorageFactory<InitialsArgs = void >(fn: (args: InitialsArgs) => { storageFactory: BindableStorageFactory }) {
  return fn;
}
