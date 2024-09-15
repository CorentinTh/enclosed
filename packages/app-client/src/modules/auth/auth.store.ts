import { makePersisted } from '@solid-primitives/storage';
import { createRoot, createSignal } from 'solid-js';
import { createHook } from '../shared/hooks/hooks';
import { isAccessTokenExpired } from './auth.models';

export const authStore = createRoot(() => {
  const [getAccessToken, setAccessTokenValue] = makePersisted(createSignal<string | null>(null), { name: 'enclosed_access_token', storage: localStorage });
  const onAuthChangeHook = createHook<{ isAuthenticated: boolean }>();
  const [getRedirectUrl, setRedirectUrl] = makePersisted(createSignal<string | null>(null), { name: 'enclosed_redirect_url', storage: localStorage });

  const getIsAuthenticated = () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return false;
    }

    const isExpired = isAccessTokenExpired({ accessToken });

    return !isExpired;
  };

  const setAccessToken = async ({ accessToken }: { accessToken: string }) => {
    setAccessTokenValue(accessToken);
    await onAuthChangeHook.trigger({ isAuthenticated: true });
  };

  const clearAccessToken = async () => {
    setAccessTokenValue(null);
    await onAuthChangeHook.trigger({ isAuthenticated: false });
  };

  return {
    setAccessToken,
    getAccessToken,
    clearAccessToken,
    getIsAuthenticated,
    getRedirectUrl,
    setRedirectUrl,

    async logout() {
      await clearAccessToken();
      window.location.href = '/login';
    },

    onAuthChange: onAuthChangeHook.on,
  };
});
