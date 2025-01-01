import type { Storage } from '../../storage/storage.types';
import type { StoredUser } from './users.types';
import { prefixStorage } from 'unstorage';

export type UsersStorage = Storage<StoredUser>;

export function createUsersStorage({ storage }: { storage: Storage }) {
  const usersStorage = prefixStorage<StoredUser>(storage as Storage<any>, 'users');

  return { usersStorage };
}
