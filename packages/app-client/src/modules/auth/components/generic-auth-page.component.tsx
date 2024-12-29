import { getConfig } from '@/modules/config/config.provider';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { Alert, AlertDescription } from '@/modules/ui/components/alert';
import { Button } from '@/modules/ui/components/button';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { useNavigate } from '@solidjs/router';
import { type Component, createSignal, type JSX, onMount, Show } from 'solid-js';
import { authStore } from '../auth.store';

export const GenericAuthPage: Component<{
  onSubmit: (args: { email: string; password: string }) => Promise<{ error?: { message: string; details?: string } }>;
  title: string;
  description: string;
  submitText: string;
  footer: JSX.Element;
  validatePassword?: boolean;
}> = (props) => {
  const [getEmail, setEmail] = createSignal('');
  const [getPassword, setPassword] = createSignal('');
  const [getError, setError] = createSignal<{ message: string; details?: string } | null>(null);
  const { t } = useI18n();

  const config = getConfig();
  const navigate = useNavigate();

  onMount(() => {
    if (!config.isAuthenticationRequired || authStore.getIsAuthenticated()) {
      navigate('/');
    }
  });

  const onSubmit = async () => {
    if (props.validatePassword && getPassword().length < 8) {
      setError({ message: t('register.errors.password-too-short') });
      return;
    }

    const { error } = await props.onSubmit({ email: getEmail(), password: getPassword() });

    if (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h1 class="text-lg font-semibold">
        {props.title}
      </h1>
      <div class="text-muted-foreground text-pretty">
        {props.description}
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
            required
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
            required
          />
        </TextFieldRoot>

        <Button class="mt-4 w-full" variant="default" type="submit">
          {props.submitText}
        </Button>

        <p class="text-center text-muted-foreground text-sm mt-4">
          {/* {castArray(t('login.footer')).map(text => (<div>{text}</div>))} */}
          {props.footer}
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
  );
};
