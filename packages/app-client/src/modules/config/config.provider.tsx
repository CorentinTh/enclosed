import type { ParentComponent } from 'solid-js';
import type { Config } from './config.types';
import { createContext, createResource, Show, useContext } from 'solid-js';
import { buildTimeConfig } from './config.constants';
import { fetchPublicConfig } from './config.services';

export {
  useConfig,
};

const ConfigContext = createContext<{ config: Config }>();

function useConfig() {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error('Config context not found');
  }

  return context;
}

export const ConfigProvider: ParentComponent = (props) => {
  const [getConfig] = createResource<Config>(async () => {
    const { config: runtimeConfig } = await fetchPublicConfig();

    return {
      ...runtimeConfig,
      ...buildTimeConfig,
    };
  });

  return (
    <Show when={getConfig()}>
      {config => (
        <ConfigContext.Provider value={{ config: config() }}>
          {props.children}
        </ConfigContext.Provider>
      )}
    </Show>
  );
};
