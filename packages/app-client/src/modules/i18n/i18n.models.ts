import type { Locale } from './i18n.provider';

// This tries to get the most preferred language compatible with the supported languages
// It tries to find a supported language by comparing both region and language, if not, then just language
// For example:
// en-GB -> en
// pt-BR -> pt-BR
export function findMatchingLocale({ preferredLocales, supportedLocales }: { preferredLocales: Intl.Locale[]; supportedLocales: Intl.Locale[] }) {
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
