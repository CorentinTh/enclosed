export type Config = {
  baseApiUrl: string;
  documentationBaseUrl: string;
  isAuthenticationRequired: boolean;
  enclosedVersion: string;
  defaultDeleteNoteAfterReading: boolean;
  defaultNoteTtlSeconds: number;
  isSettingNoExpirationAllowed: boolean;
  isUserRegistrationAllowed: boolean;
  defaultNoteNoExpiration: boolean;
};
