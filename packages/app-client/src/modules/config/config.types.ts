export type Config = {
  baseApiUrl: string;
  documentationBaseUrl: string;
  isAuthenticationRequired: boolean;
  enclosedVersion: string;
  defaultDeleteNoteAfterReading: boolean;
  defaultNoteTtlSeconds: number;
  defaultNoteResultFormat: 'raw' | 'code' | 'markdown';
  isSettingNoExpirationAllowed: boolean;
  defaultNoteNoExpiration: boolean;
};
