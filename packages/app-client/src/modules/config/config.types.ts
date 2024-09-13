export type RuntimeConfig = {
  isAuthenticationRequired: boolean;
};

export type BuildTimeConfig = {
  baseApiUrl: string;
  documentationBaseUrl: string;
  enclosedVersion: string;
};

export type Config = RuntimeConfig & BuildTimeConfig;
