import type { Config } from '../config/config.types';

export { extractAccessToken, getIsRegistrationAllowed };

function extractAccessToken({ autorisationHeader }: { autorisationHeader: string | undefined }) {
  if (!autorisationHeader) {
    return { accessToken: undefined };
  }

  const [type, accessToken] = autorisationHeader.split(' ').map(part => part.trim());

  if (type !== 'Bearer') {
    return { accessToken: undefined };
  }

  return { accessToken };
}

function getIsRegistrationAllowed({ config }: { config: Config }) {
  return config.public.isUserRegistrationAllowed && config.public.isAuthenticationRequired;
}
