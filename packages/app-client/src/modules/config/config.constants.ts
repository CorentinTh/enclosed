import type { Config } from './config.types';

export const buildTimeConfig: Config = {
  baseApiUrl: import.meta.env.VITE_BASE_API_URL ?? '/',
  documentationBaseUrl: import.meta.env.VITE_DOCUMENTATION_BASE_URL ?? 'https://docs.enclosed.cc',
  enclosedVersion: import.meta.env.VITE_ENCLOSED_VERSION ?? '0.0.0',
  isAuthenticationRequired: import.meta.env.VITE_IS_AUTHENTICATION_REQUIRED === 'true',
  defaultDeleteNoteAfterReading: import.meta.env.VITE_DEFAULT_DELETE_NOTE_AFTER_READING === 'true',
  defaultNoteTtlSeconds: Number(import.meta.env.VITE_DEFAULT_NOTE_TTL_SECONDS ?? 3600),
  defaultNoteNoExpiration: import.meta.env.VITE_DEFAULT_NOTE_NO_EXPIRATION === 'true',
  isSettingNoExpirationAllowed: import.meta.env.VITE_IS_SETTING_NO_EXPIRATION_ALLOWED === 'true',
};
