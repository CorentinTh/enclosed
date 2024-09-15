import { useConfig } from '@/modules/config/config.provider';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { isHttpErrorWithStatusCode } from '@/modules/shared/http/http-errors';
import { Alert, AlertDescription } from '@/modules/ui/components/alert';
import { Button } from '@/modules/ui/components/button';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { safely } from '@corentinth/chisels';
import { useNavigate } from '@solidjs/router';
import { castArray, sample } from 'lodash-es';
import { type Component, createSignal, onMount, Show } from 'solid-js';
import { login } from '../auth.services';
import { authStore } from '../auth.store';

const quotations = [
  {
    text: 'It\'s so secret, even I forgot what I wrote.',
    author: 'Anonymous',
  },
  {
    text: 'If this note self-destructs, you probably typed something important.',
    author: 'The Server, probably',
  },
  {
    text: 'Why write a love letter when you can send an encrypted one?',
    author: 'Cupid',
  },
  {
    text: 'Your secrets are safe. Seriously, I’m not even able to peek.',
    author: 'The Database',
  },
  {
    text: 'Even Sherlock can’t crack this code.',
    author: 'Dr. Watson, probably',
  },
  {
    text: 'Writing something you’ll regret? At least it’ll disappear.',
    author: 'The Note Timer',
  },
];

export const LoginPage: Component = () => {
  const randomQuotation = sample(quotations)!;
  const [getError, setError] = createSignal<{ message: string; details?: string } | null>(null);
  const [getEmail, setEmail] = createSignal('');
  const [getPassword, setPassword] = createSignal('');
  const { t } = useI18n();

  const { config } = useConfig();
  const navigate = useNavigate();

  onMount(() => {
    if (!config.isAuthenticationRequired || authStore.getIsAuthenticated()) {
      navigate('/');
    }
  });

  const onSubmit = async () => {
    const [loginResponse, error] = await safely(login({
      email: getEmail(),
      password: getPassword(),
    }));

    if (isHttpErrorWithStatusCode({ error, statusCode: 401 })) {
      setError({ message: t('login.errors.invalid-credentials') });
      return;
    }

    if (error) {
      setError({ message: t('login.errors.unknown') });
      return;
    }

    const { accessToken } = loginResponse;

    authStore.setAccessToken({ accessToken });
    window.location.href = authStore.getRedirectUrl() ?? '/';
  };

  return (
    <div class="flex h-screen w-full">

      <div class="h-full hidden xl:flex flex-1 max-w-36% text-white p-6 flex-col justify-between  bg-zinc-900">
        <div>
          <Button variant="link" class="text-white text-lg border-b border-transparent hover:(no-underline !border-border) h-auto py-0 px-0 rounded-none !transition-border-color-250">
            {t('app.title')}
          </Button>

          <span class="text-muted-foreground hidden sm:block">
            {t('app.description')}
          </span>
        </div>

        <div>
          <div class="text-lg text-pretty">
            <span class="i-tabler-quote inline-block scale-x-[-1] text-2xl mr-2 text-muted-foreground"></span>
            {randomQuotation.text}
          </div>
          <div class="text-sm text-muted-foreground">
            -
            {' '}
            {randomQuotation.author}
          </div>
        </div>

      </div>

      <div class="px-6 mt-12 lg:mt-200px flex-1">
        <div class="md:max-w-sm mx-auto">
          <h1 class="text-lg font-semibold">
            {t('login.title')}
          </h1>
          <div class="text-muted-foreground text-pretty">
            {t('login.description')}
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          >
            <TextFieldRoot class="my-4">
              <TextFieldLabel class="sr-only">
                {t('login.email')}
              </TextFieldLabel>
              <TextField
                type="email"
                placeholder={t('login.email')}
                onInput={(e) => {
                  setEmail(e.currentTarget.value);
                  setError(null);
                }}
                value={getEmail()}
              />
            </TextFieldRoot>

            <TextFieldRoot class="mt-4">
              <TextFieldLabel class="sr-only">
                {t('login.password')}
              </TextFieldLabel>
              <TextField
                type="password"
                placeholder={t('login.password')}
                onInput={(e) => {
                  setPassword(e.currentTarget.value);
                  setError(null);
                }}
                value={getPassword()}
              />
            </TextFieldRoot>

            <Button class="mt-4 w-full" variant="default" type="submit">
              {t('login.submit')}
            </Button>

            <p class="text-center text-muted-foreground text-sm mt-4">
              {castArray(t('login.footer')).map(text => (<div>{text}</div>))}
            </p>

            <Show when={getError()}>
              {error => (
                <Alert variant="destructive" class="mt-4">
                  <AlertDescription>
                    {error().message}
                  </AlertDescription>
                </Alert>
              )}
            </Show>

          </form>
        </div>
      </div>
    </div>
  );
};
