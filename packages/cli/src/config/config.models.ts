import Conf from 'conf';
import picocolors from 'picocolors';
import { configDefinition } from './config.constants';

export { createConfigBindings, setConfig, getConfig, deleteConfig, resetConfig };

type ConfigKey = keyof typeof configDefinition | (string & {});
const config = new Conf<Record<ConfigKey, string>>({ projectName: 'enclosed' });

function setConfig({ key, value }: { key: ConfigKey ; value: string }) {
  const definition = configDefinition[key as keyof typeof configDefinition];

  if (!definition) {
    console.error(picocolors.red(`Invalid configuration key: ${key}`));
    return;
  }

  const { schema } = definition;

  const parsedValue = schema.safeParse(value);

  if (!parsedValue.success) {
    const errorMessage = parsedValue.error.errors.map(({ message }) => message).join('\n');
    console.error(picocolors.red(`Invalid value for ${key}: ${errorMessage}`));
    return;
  }

  config.set(key, value);
}

function getConfig({ key }: { key: ConfigKey }) {
  const definition = configDefinition[key as keyof typeof configDefinition];

  if (!definition) {
    throw new Error(`Invalid configuration key: ${key}`);
  }

  const value = config.get(key);

  if (!value) {
    return;
  }

  const { schema } = definition;

  const parsedValue = schema.safeParse(value);

  if (!parsedValue.success) {
    const errorMessage = parsedValue.error.errors.map(({ message }) => message).join('\n');
    console.error(picocolors.red(`Invalid value for ${key}: ${errorMessage}`));
    return;
  }

  return parsedValue.data;
}

function deleteConfig({ key }: { key: ConfigKey }) {
  config.delete(key);
}

function resetConfig() {
  config.clear();
}

function createConfigBindings({ key }: { key: ConfigKey }) {
  return {
    get: () => {
      return getConfig({ key });
    },
    set: (value: string) => {
      setConfig({ key, value });
    },
  };
}
