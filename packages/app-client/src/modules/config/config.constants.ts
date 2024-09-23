import type { Config } from './config.types';

export const buildTimeConfig: Config = {
  baseApiUrl: import.meta.env.VITE_BASE_API_URL ?? '/',
  documentationBaseUrl: import.meta.env.VITE_DOCUMENTATION_BASE_URL ?? 'https://docs.enclosed.cc',
  enclosedVersion: import.meta.env.VITE_ENCLOSED_VERSION ?? '0.0.0',
  isAuthenticationRequired: import.meta.env.VITE_IS_AUTHENTICATION_REQUIRED === 'true',
};
