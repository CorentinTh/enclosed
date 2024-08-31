import { createConfigBindings } from './config.models';

export const {
  get: getInstanceUrl,
  set: setInstanceUrl,
} = createConfigBindings({ key: 'instance-url' });
