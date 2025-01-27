import { useI18n } from '@/modules/i18n/i18n.provider';
import { Button } from '@/modules/ui/components/button';
import { TextField } from '@/modules/ui/components/textfield';
import { type Component, createSignal } from 'solid-js';
import { createRandomPassword } from '../notes.models';

export const NotePasswordField: Component<{ getPassword: () => string; setPassword: (value: string) => void; dataTestId?: string } > = (props) => {
  const [getShowPassword, setShowPassword] = createSignal(false);
  const { t } = useI18n();

  const generateRandomPassword = () => {
    const password = createRandomPassword({ length: 16 });

    setShowPassword(true);
    props.setPassword(password);
  };

  return (
    <div class="border border-input rounded-md flex items-center pr-1">
      <TextField placeholder={t('create.settings.password.placeholder')} value={props.getPassword()} onInput={e => props.setPassword(e.currentTarget.value)} class="border-none shadow-none focus-visible:ring-none" type={getShowPassword() ? 'text' : 'password'} autocomplete="new-password" data-test-id={props.dataTestId} />

      <Button variant="link" onClick={() => setShowPassword(!getShowPassword())} class="text-base size-9 p-0 text-muted-foreground hover:text-primary transition" aria-label={getShowPassword() ? t('create.settings.password.hide-password') : t('create.settings.password.show-password')}>
        <div classList={{ 'i-tabler-eye': !getShowPassword(), 'i-tabler-eye-off': getShowPassword() }}></div>
      </Button>

      <Button variant="link" onClick={generateRandomPassword} class="text-base size-9 p-0 text-muted-foreground hover:text-primary transition" aria-label={t('create.settings.password.generate-random-password')}>
        <div class="i-tabler-refresh"></div>
      </Button>
    </div>
  );
};
