import type { ParentComponent } from 'solid-js';
import { locales } from '@/locales/locales';
import * as i18n from '@solid-primitives/i18n';
import { makePersisted } from '@solid-primitives/storage';
import { merge } from 'lodash-es';
import { createContext, createEffect, createResource, createSignal, Show, useContext } from 'solid-js';
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

// This tries to get the user's most preferred language compatible with the site's supported languages
// It tries to find a supported language by comparing both region and language, if not, then just language
// For example:
// en-GB -> en
// pt-BR -> pt-BR
function getBrowserLocale(): Locale {
  const preferredLocales = navigator.languages.map(x => new Intl.Locale(x));
  const supportedLocales = locales.map(x => new Intl.Locale(x.key));

  for (const locale of preferredLocales) {
    const localeMatchRegion = supportedLocales.find(x => x.baseName === locale.baseName);

    if (localeMatchRegion) {
      return localeMatchRegion.baseName as Locale;
    }

    const localeMatchLanguage = supportedLocales.find(x => x.language === locale.language);
    if (localeMatchLanguage) {
      return localeMatchLanguage.baseName as Locale;
    }
  }
  return 'en';
}

export const I18nProvider: ParentComponent = (props) => {
  const browserLocale = getBrowserLocale();
  const [getLocale, setLocale] = makePersisted(createSignal<Locale>(browserLocale), { name: 'enclosed_locale', storage: localStorage });

  const [dict] = createResource(getLocale, fetchDictionary);

  createEffect(() => {
    document.documentElement.lang = getLocale();
  });

  return (
    <Show when={dict.latest}>
      {dictLatest => (
        <I18nContext.Provider
          value={{
            t: i18n.translator(dictLatest, i18n.resolveTemplate),
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
