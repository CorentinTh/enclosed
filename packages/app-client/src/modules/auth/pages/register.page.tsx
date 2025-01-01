import type { Component } from 'solid-js';
import { getConfig } from '@/modules/config/config.provider';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { isHttpErrorWithCode, isHttpErrorWithStatusCode } from '@/modules/shared/http/http-errors';
import { Button } from '@/modules/ui/components/button';
import { safely } from '@corentinth/chisels';
import { A } from '@solidjs/router';
import { register } from '../auth.services';
import { authStore } from '../auth.store';
import { GenericAuthPage } from '../components/generic-auth-page.component';

export const RegisterPage: Component = () => {
  const { t } = useI18n();
  const config = getConfig();

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    const [loginResponse, error] = await safely(register({
      email,
      password,
    }));

    if (isHttpErrorWithStatusCode({ error, statusCode: 401 })) {
      return { error: { message: t('login.errors.invalid-credentials') } };
    }

    if (isHttpErrorWithCode({ error, code: 'users.create.already_exists' })) {
      return { error: { message: t('register.errors.email-taken') } };
    }

    if (isHttpErrorWithCode({ error, code: 'server.invalid_request.body' })) {
      return { error: { message: t('register.errors.invalid-request') } };
    }

    if (error) {
      return { error: { message: t('register.errors.unknown') } };
    }

    const { accessToken } = loginResponse;

    authStore.setAccessToken({ accessToken });
    window.location.href = authStore.getRedirectUrl() ?? '/';

    return {};
  };

  return (
    <>
      {config.isUserRegistrationAllowed
        ? (
            <GenericAuthPage
              title={t('register.title')}
              description={t('register.description')}
              submitText={t('register.submit')}
              footer={(
                <>
                  {t('register.footer.have-account')}
                  <Button as={A} href="/login" variant="link">
                    {t('register.footer.login')}
                  </Button>
                </>
              )}
              onSubmit={onSubmit}
              validatePassword
            />
          )
        : (
            <div>
              <h1 class="text-lg font-semibold">
                {t('register.title')}
              </h1>
              <div class="text-muted-foreground text-pretty my-2">
                {t('register.registration-disabled')}
              </div>
              <Button as={A} href="/login" variant="secondary">
                {t('register.footer.login')}
              </Button>
            </div>
          )}
    </>
  );
};
