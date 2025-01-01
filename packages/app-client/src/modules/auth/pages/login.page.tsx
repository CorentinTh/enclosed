import type { Component } from 'solid-js';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { isHttpErrorWithCode, isHttpErrorWithStatusCode } from '@/modules/shared/http/http-errors';
import { Button } from '@/modules/ui/components/button';
import { safely } from '@corentinth/chisels';
import { A } from '@solidjs/router';
import { login } from '../auth.services';
import { authStore } from '../auth.store';
import { GenericAuthPage } from '../components/generic-auth-page.component';

export const LoginPage: Component = () => {
  const { t } = useI18n();

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    const [loginResponse, error] = await safely(login({
      email,
      password,
    }));

    if (isHttpErrorWithStatusCode({ error, statusCode: 401 })) {
      return { error: { message: t('login.errors.invalid-credentials') } };
    }

    if (isHttpErrorWithCode({ error, code: 'server.invalid_request.body' })) {
      return { error: { message: t('login.errors.invalid-request') } };
    }

    if (error) {
      return { error: { message: t('login.errors.unknown') } };
    }

    const { accessToken } = loginResponse;

    authStore.setAccessToken({ accessToken });
    window.location.href = authStore.getRedirectUrl() ?? '/';

    return {};
  };

  return (
    <GenericAuthPage
      title={t('login.title')}
      description={t('login.description')}
      submitText={t('login.submit')}
      onSubmit={onSubmit}
      footer={(
        <>
          {t('login.footer.no-account')}
          <Button as={A} href="/register" variant="link">
            {t('login.footer.register')}
          </Button>
        </>
      )}
    />
  );
};
