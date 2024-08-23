import { useLocation, useParams } from '@solidjs/router';
import { type Component, Match, Show, Switch, createSignal, onMount } from 'solid-js';
import { fetchNoteById } from '../notes.services';
import { decryptNote } from '../notes.usecases';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { Card, CardContent, CardDescription, CardHeader } from '@/modules/ui/components/card';
import { Button } from '@/modules/ui/components/button';
import { isHttpErrorWithCode } from '@/modules/shared/http/http-errors';
import { promiseAttempt } from '@/modules/shared/utils/attempt';
import { Alert, AlertDescription } from '@/modules/ui/components/alert';
import { CopyButton } from '@/modules/shared/utils/copy';

const RequestPasswordForm: Component<{ onPasswordEntered: (args: { password: string }) => void; getIsPasswordInvalid: () => boolean; setIsPasswordInvalid: (value: boolean) => void }> = (props) => {
  const [getPassword, setPassword] = createSignal('');

  function updatePassword(text: string) {
    setPassword(text);
    props.setIsPasswordInvalid(false);
  }

  return (
    <Card class="w-full max-w-sm mx-auto mt-6">
      <CardHeader>
        <CardDescription>
          This note is password protected. Please enter the password to unlock it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          props.onPasswordEntered({ password: getPassword() });
        }}
        >
          <div>
            <TextFieldRoot>
              <TextFieldLabel>Password</TextFieldLabel>
              <TextField type="password" placeholder="Note password..." value={getPassword()} onInput={e => updatePassword(e.currentTarget.value)} autofocus />
            </TextFieldRoot>
          </div>
          <Button
            class="w-full mt-4"
            type="submit"
          >
            <div class="i-tabler-lock-open mr-2 text-lg"></div>
            Unlock note
          </Button>

        </form>
        <Show when={props.getIsPasswordInvalid()}>
          <Alert class="mt-4" variant="destructive">
            <AlertDescription>
              The password you entered is invalid or the note URL is incorrect.
            </AlertDescription>
          </Alert>
        </Show>
      </CardContent>
    </Card>
  );
};

export const ViewNotePage: Component = () => {
  const params = useParams();
  const location = useLocation();
  const [isPasswordEntered, setIsPasswordEntered] = createSignal(false);
  const [getError, setError] = createSignal<{ title: string; description: string } | null>(null);
  const [getNote, setNote] = createSignal<{ content: string; isPasswordProtected: boolean } | null>(null);
  const [getDecryptedNote, setDecryptedNote] = createSignal<string | null>(null);
  const [getIsPasswordInvalid, setIsPasswordInvalid] = createSignal(false);

  const getEncryptionKey = () => location.hash.slice(1);

  onMount(async () => {
    if (!getEncryptionKey()) {
      setError({
        title: 'Invalid note URL',
        description: 'This note URL is invalid. Please make sure you are using the correct URL.',
      });
    }

    const [fetchedNote, fetchError] = await promiseAttempt(fetchNoteById({ noteId: params.noteId }));

    if (isHttpErrorWithCode({ error: fetchError, code: 'note.not_found' })) {
      setError({
        title: 'Note not found',
        description: 'This note does not exist, has expired, or has been deleted.',
      });
      return;
    }

    if (fetchError) {
      setError({
        title: 'An error occurred',
        description: 'An error occurred while fetching the note. Please try again later.',
      });
      return;
    }

    const { note } = fetchedNote;

    setNote(note);

    if (note.isPasswordProtected) {
      return;
    }

    const [decryptedNote, decryptionError] = await promiseAttempt(decryptNote({
      encryptedContent: note.content,
      encryptionKey: getEncryptionKey(),
    }));

    if (decryptionError) {
      setError({
        title: 'An error occurred',
        description: 'An error occurred while decrypting the note. The url may be invalid.',
      });
      return;
    }

    setDecryptedNote(decryptedNote.decryptedContent);
  });

  const onPasswordEntered = async ({ password }: { password: string }) => {
    const { content } = getNote()!;

    const [decryptionResult, decryptionError] = await promiseAttempt(decryptNote({
      encryptedContent: content,
      encryptionKey: getEncryptionKey(),
      password,
    }));

    if (decryptionError) {
      setIsPasswordInvalid(true);
      return;
    }

    const { decryptedContent } = decryptionResult;

    setDecryptedNote(decryptedContent);
    setIsPasswordEntered(true);
  };

  return (
    <div>

      <Switch>

        <Match when={getError()}>
          {error => (
            <div class="mx-auto max-w-300px text-center mt-6 flex flex-col justify-center items-center">
              <div class="i-tabler-alert-triangle text-4xl text-muted-foreground op-60"></div>
              <div class="text-lg font-bold mt-2">
                {error().title}
              </div>
              <div class="mt-2 text-muted-foreground">
                {error().description}
              </div>
            </div>
          )}
        </Match>

        <Match when={getNote()?.isPasswordProtected && !isPasswordEntered()}>
          <RequestPasswordForm onPasswordEntered={onPasswordEntered} getIsPasswordInvalid={getIsPasswordInvalid} setIsPasswordInvalid={setIsPasswordInvalid} />
        </Match>

        <Match when={getDecryptedNote()}>
          {getNoteContent => (
            <div class="mx-auto max-w-1200px px-6 mt-6 flex gap-4 flex-col ">
              <Card class="w-full rounded-md shadow-sm">
                <CardContent class="p-6">
                  <div class="whitespace-pre-wrap">{getNoteContent()}</div>
                </CardContent>
              </Card>

              <div class="min-w-300px">

                <CopyButton text={getNoteContent()} variant="secondary" />
              </div>
            </div>
          )}
        </Match>
      </Switch>

    </div>
  );
};
