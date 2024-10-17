import type { ParentComponent } from 'solid-js';
import { locales } from '@/locales/locales';
import * as i18n from '@solid-primitives/i18n';
import { makePersisted } from '@solid-primitives/storage';
import { merge } from 'lodash-es';
import { createContext, createResource, createSignal, Show, useContext } from 'solid-js';
import defaultDict from '../../locales/en.json';

export {
  useI18n,
};

type Locale = typeof locales[number]['key'];
type RawDictionary = typeof defaultDict;
type Dictionary = i18n.Flatten<RawDictionary>;

const I18nContext = createContext<{
  t: i18n.Translator<Dictionary>;
  getLocale: () => Locale;
  setLocale: (locale: Locale) => void;
  locales: typeof locales;
} | undefined>(undefined);

function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('I18n context not found');
  }

  return context;
}

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`../../locales/${locale}.json`));
  const mergedDict = merge({}, defaultDict, dict);
  const flattened = i18n.flatten(mergedDict);

  return flattened;
}

function getBrowserLocale(): Locale {
  const browserLocale = navigator.language?.split('-')[0];

  if (!browserLocale) {
    return 'en';
  }

  return locales.find(locale => locale.key === browserLocale)?.key ?? 'en';
}

export const I18nProvider: ParentComponent = (props) => {
  const browserLocale = getBrowserLocale();
  const [getLocale, setLocale] = makePersisted(createSignal<Locale>(browserLocale), { name: 'enclosed_locale', storage: localStorage });

  const [dict] = createResource(getLocale, fetchDictionary);

  return (
    <Show when={dict()}>
      {dict => (
        <I18nContext.Provider
          value={{
            t: i18n.translator(dict, i18n.resolveTemplate),
            getLocale,
            setLocale,
            locales,
          }}
        >
          {props.children}
        </I18nContext.Provider>
      )}
    </Show>
  );
};
