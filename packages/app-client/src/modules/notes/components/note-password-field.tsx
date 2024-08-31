import { type Component, createSignal } from 'solid-js';
import { createRandomPassword } from '../notes.models';
import { TextField } from '@/modules/ui/components/textfield';
import { Button } from '@/modules/ui/components/button';

export const NotePasswordField: Component<{ getPassword: () => string; setPassword: (value: string) => void }> = (props) => {
  const [getShowPassword, setShowPassword] = createSignal(false);

  const generateRandomPassword = () => {
    const password = createRandomPassword({ length: 16 });

    setShowPassword(true);
    props.setPassword(password);
  };

  return (
    <div class="border border-input rounded-md flex items-center pr-1">
      <TextField placeholder="Password..." value={props.getPassword()} onInput={e => props.setPassword(e.currentTarget.value)} class="border-none shadow-none focus-visible:ring-none" type={getShowPassword() ? 'text' : 'password'} />

      <Button variant="link" onClick={() => setShowPassword(!getShowPassword())} class="text-base size-9 p-0 text-muted-foreground hover:text-primary transition" aria-label={getShowPassword() ? 'Hide password' : 'Show password'}>
        <div classList={{ 'i-tabler-eye': !getShowPassword(), 'i-tabler-eye-off': getShowPassword() }}></div>
      </Button>

      <Button variant="link" onClick={generateRandomPassword} class="text-base size-9 p-0 text-muted-foreground hover:text-primary transition" aria-label="Generate random password">
        <div class="i-tabler-refresh"></div>
      </Button>
    </div>
  );
};
