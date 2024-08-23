import { useLocation, useParams } from '@solidjs/router';
import { type Component, Show, createResource, createSignal, onMount } from 'solid-js';
import { fetchNoteById } from '../notes.services';
import { decryptNote } from '../notes.usecases';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/modules/ui/components/card';
import { Button } from '@/modules/ui/components/button';

const RequestPasswordForm: Component<{ onPasswordEntered: (args: { password: string }) => void }> = (props) => {
  const [getPassword, setPassword] = createSignal('');

  return (
    <Card class="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardDescription>
          This note is password protected. Please enter the password to unlock it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <TextFieldRoot>
            <TextFieldLabel>Password</TextFieldLabel>
            <TextField type="password" placeholder="Note password..." value={getPassword()} onInput={e => setPassword(e.currentTarget.value)} autofocus />
          </TextFieldRoot>
        </div>
        <Button
          class="w-full mt-4"
          onClick={() => props.onPasswordEntered({ password: getPassword() })}
        >
          <div class="i-tabler-lock-open mr-2 text-lg"></div>
          Unlock note
        </Button>
      </CardContent>
    </Card>
  );
};

export const ViewNotePage: Component = () => {
  const params = useParams();
  const location = useLocation();
  const [isPasswordEntered, setIsPasswordEntered] = createSignal(false);

  const getEncryptionKey = () => location.hash.slice(1);

  const [getNote] = createResource(async () => {
    const { note } = await fetchNoteById({ noteId: params.noteId });

    return note;
  });

  const [getDecryptedNote, { mutate: setDecryptedNote }] = createResource(() => getNote(), async ({ isPasswordProtected, content }) => {
    if (isPasswordProtected) {
      return null;
    }

    const { decryptedContent } = await decryptNote({
      encryptedContent: content,
      encryptionKey: getEncryptionKey(),
    });

    return decryptedContent;
  });

  const onPasswordEntered = async ({ password }: { password: string }) => {
    const { content } = getNote()!;

    const { decryptedContent } = await decryptNote({
      encryptedContent: content,
      encryptionKey: getEncryptionKey(),
      password,
    });

    setDecryptedNote(decryptedContent);
    setIsPasswordEntered(true);
  };

  return (
    <div class="mx-auto max-w-1200px px-6 mt-6 flex gap-4 flex-col sm:flex-row">
      {/* {JSON.stringify(params)} */}

      <Show when={getNote()?.isPasswordProtected && !isPasswordEntered()}>
        <RequestPasswordForm onPasswordEntered={onPasswordEntered} />
      </Show>

      {getDecryptedNote() && (
        <Card class="mx-auto min-w-sm">
          <CardContent class="p-6">
            <div class="whitespace-pre-wrap">{getDecryptedNote()}</div>
          </CardContent>
          <CardFooter>
            <Button variant="secondary">
              <div class="i-tabler-copy mr-2 text-lg"></div>
              Copy to clipboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
