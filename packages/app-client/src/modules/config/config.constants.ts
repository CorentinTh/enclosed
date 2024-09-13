import type { BuildTimeConfig } from './config.types';

export const buildTimeConfig: BuildTimeConfig = {
  baseApiUrl: import.meta.env.VITE_BASE_API_URL ?? window.location.origin,
  documentationBaseUrl: import.meta.env.VITE_DOCUMENTATION_BASE_URL ?? 'https://docs.enclosed.cc',
  enclosedVersion: import.meta.env.VITE_ENCLOSED_VERSION ?? '0.0.0',
};
