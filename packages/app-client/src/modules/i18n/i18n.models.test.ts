import { describe, expect, test } from 'vitest';
import { findMatchingLocale } from './i18n.models';

describe('i18n models', () => {
  describe('findMatchingLocale', () => {
    test('preferred regional language to regional language', () => {
      const preferredLocales = ['pt-BR'].map(x => new Intl.Locale(x));
      const supportedLocales = ['en', 'pt-BR'].map(x => new Intl.Locale(x));
      const locale = findMatchingLocale({ preferredLocales, supportedLocales });

      expect(locale).toEqual('pt-BR');
    });

    test('preferred non-regional language to non-regional language', () => {
      const preferredLocales = ['pt'].map(x => new Intl.Locale(x));
      const supportedLocales = ['pt-BR', 'pt'].map(x => new Intl.Locale(x));
      const locale = findMatchingLocale({ preferredLocales, supportedLocales });

      expect(locale).toEqual('pt');
    });

    test('preferred regional language to non-regional language', () => {
      const preferredLocales = ['en-GB'].map(x => new Intl.Locale(x));
      const supportedLocales = ['pt-BR', 'en'].map(x => new Intl.Locale(x));
      const locale = findMatchingLocale({ preferredLocales, supportedLocales });

      expect(locale).toEqual('en');
    });

    test('preferred language with different region to supported language', () => {
      const preferredLocales = ['en-CA'].map(x => new Intl.Locale(x));
      const supportedLocales = ['fr-FR', 'en-US'].map(x => new Intl.Locale(x));
      const locale = findMatchingLocale({ preferredLocales, supportedLocales });

      expect(locale).toEqual('en-US');
    });

    test('preferred language not in supported locales', () => {
      const preferredLocales = ['it-IT'].map(x => new Intl.Locale(x));
      const supportedLocales = ['es-ES', 'de-DE'].map(x => new Intl.Locale(x));
      const locale = findMatchingLocale({ preferredLocales, supportedLocales });

      expect(locale).toEqual('en');
    });

    test('empty preferred locales', () => {
      const preferredLocales: Intl.Locale[] = [];
      const supportedLocales = ['en', 'pt-BR'].map(x => new Intl.Locale(x));
      const locale = findMatchingLocale({ preferredLocales, supportedLocales });

      expect(locale).toEqual('en');
    });

    test('empty supported locales', () => {
      const preferredLocales = ['en-GB', 'pt-BR'].map(x => new Intl.Locale(x));
      const supportedLocales: Intl.Locale[] = [];
      const locale = findMatchingLocale({ preferredLocales, supportedLocales });

      expect(locale).toEqual('en');
    });
  });
});
