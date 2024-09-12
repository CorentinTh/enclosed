import { getFileIcon } from '@/modules/files/files.models';
import { isHttpErrorWithCode, isRateLimitError } from '@/modules/shared/http/http-errors';
import { cn } from '@/modules/shared/style/cn';
import { CopyButton } from '@/modules/shared/utils/copy';
import { Alert, AlertDescription } from '@/modules/ui/components/alert';
import { Button } from '@/modules/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/modules/ui/components/card';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { formatBytes, safely } from '@corentinth/chisels';
import { decryptNote, noteAssetsToFiles, parseNoteUrlHashFragment } from '@enclosed/lib';
import { useLocation, useParams } from '@solidjs/router';
import JSZip from 'jszip';
import { type Component, createSignal, Match, onMount, Show, Switch } from 'solid-js';
import { fetchNoteById } from '../notes.services';

const RequestPasswordForm: Component<{ onPasswordEntered: (args: { password: string }) => void; getIsPasswordInvalid: () => boolean; setIsPasswordInvalid: (value: boolean) => void }> = (props) => {
  const [getPassword, setPassword] = createSignal('');

  function updatePassword(text: string) {
    setPassword(text);
    props.setIsPasswordInvalid(false);
  }

  return (
    <div class="sm:mt-6 p-6">
      <Card class="w-full max-w-sm mx-auto">
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
    </div>
  );
};

export const ViewNotePage: Component = () => {
  const params = useParams();
  const location = useLocation();
  const [isPasswordEntered, setIsPasswordEntered] = createSignal(false);
  const [getError, setError] = createSignal<{ title: string; description: string } | null>(null);
  const [getNote, setNote] = createSignal<{ payload: string; isPasswordProtected: boolean; encryptionAlgorithm: string; serializationFormat: string } | null>(null);
  const [getDecryptedNote, setDecryptedNote] = createSignal<string | null>(null);
  const [getIsPasswordInvalid, setIsPasswordInvalid] = createSignal(false);
  const [fileAssets, setFileAssets] = createSignal<File[]>([]);
  const [isDownloadingAllLoading, setIsDownloadingAllLoading] = createSignal(false);

  const parseHashFragment = () => parseNoteUrlHashFragment({ hashFragment: location.hash });
  const getEncryptionKey = () => parseHashFragment().encryptionKey;
  const getIsPasswordProtected = () => parseHashFragment().isPasswordProtected;

  onMount(async () => {
    const encryptionKey = getEncryptionKey();

    if (!encryptionKey) {
      setError({
        title: 'Invalid note URL',
        description: 'This note URL is invalid. Please make sure you are using the correct URL.',
      });
      return;
    }

    const [fetchedNote, fetchError] = await safely(fetchNoteById({ noteId: params.noteId }));

    if (isRateLimitError({ error: fetchError })) {
      setError({
        title: 'Rate limit exceeded',
        description: 'You have exceeded the rate limit for fetching notes. Please try again later.',
      });
      return;
    }

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

    if (getIsPasswordProtected()) {
      return;
    }

    const { payload, encryptionAlgorithm, serializationFormat } = note;

    const [decryptedNoteResult, decryptionError] = await safely(decryptNote({
      encryptedPayload: payload,
      encryptionKey,
      encryptionAlgorithm: encryptionAlgorithm as 'aes-256-gcm', // TODO: export type from lib
      serializationFormat: serializationFormat as 'cbor-array', // TODO: export type from lib
    }));

    if (decryptionError) {
      setError({
        title: 'An error occurred',
        description: 'An error occurred while decrypting the note. The url may be invalid.',
      });
      return;
    }

    const { note: decryptedNote } = decryptedNoteResult;

    const files = await noteAssetsToFiles({ noteAssets: decryptedNote.assets });
    setFileAssets(files);
    setDecryptedNote(decryptedNote.content);
  });

  const onPasswordEntered = async ({ password }: { password: string }) => {
    const { payload, encryptionAlgorithm, serializationFormat } = getNote()!;

    const [decryptionResult, decryptionError] = await safely(decryptNote({
      encryptedPayload: payload,
      encryptionKey: getEncryptionKey(),
      password,
      encryptionAlgorithm: encryptionAlgorithm as 'aes-256-gcm', // TODO: export type from lib
      serializationFormat: serializationFormat as 'cbor-array', // TODO: export type from lib
    }));

    if (decryptionError) {
      setIsPasswordInvalid(true);
      return;
    }

    const { note } = decryptionResult;

    setDecryptedNote(note.content);
    setIsPasswordEntered(true);
  };

  const downloadFile = async ({ file }: { file: File }) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = async () => {
    setIsDownloadingAllLoading(true);
    const zipFile = new JSZip();
    fileAssets().forEach((file) => {
      zipFile.file(file.name, file);
    });

    const blob = await zipFile.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note-files.zip';
    a.click();
    URL.revokeObjectURL(url);
    setIsDownloadingAllLoading(false);
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

        <Match when={getIsPasswordProtected() && !isPasswordEntered()}>
          <RequestPasswordForm onPasswordEntered={onPasswordEntered} getIsPasswordInvalid={getIsPasswordInvalid} setIsPasswordInvalid={setIsPasswordInvalid} />
        </Match>

        <Match when={getDecryptedNote() || fileAssets().length > 0}>

          <div class="mx-auto max-w-1200px px-6 mt-6 flex gap-4 md:flex-row-reverse flex-col justify-center min-w-0">
            {getDecryptedNote() && (
              <div class="flex-1 mb-4">
                <div class="flex items-center gap-2 mb-4 justify-between">
                  <div class="text-muted-foreground">
                    Note content
                  </div>
                  <CopyButton text={getDecryptedNote()!} variant="secondary" />
                </div>

                <Card class="w-full rounded-md shadow-sm mb-2">
                  <CardContent class="p-6">
                    <div class="break-all">{getDecryptedNote()}</div>
                  </CardContent>
                </Card>

              </div>
            )}

            {fileAssets().length > 0 && (
              <div class="flex flex-col gap-4">
                <div class="flex md:min-w-500px items-center h-9">
                  <div class="text-muted-foreground">
                    {`${fileAssets().length} file${fileAssets().length > 1 ? 's' : ''} attached to this note`}
                  </div>

                  {fileAssets().length > 1 && (
                    <Button
                      class="ml-auto"
                      variant="secondary"
                      onClick={downloadAllFiles}
                      disabled={isDownloadingAllLoading()}
                    >
                      {isDownloadingAllLoading()
                        ? <div class="i-tabler-loader-2 mr-2 text-lg animate-spin"></div>
                        : <div class="i-tabler-file-zip mr-2 text-lg"></div>}

                      Download all files
                    </Button>
                  )}
                </div>

                <div class="flex flex-col gap-2 md:min-w-500px">
                  {
                    fileAssets().map(file => (
                      <Card class="w-full rounded-md shadow-sm ">
                        <CardContent class="p-4 flex items-center gap-3">
                          <div class={cn('text-4xl text-muted-foreground op-50 flex-shrink-0', getFileIcon({ file }))} />
                          <div class="flex flex-col min-w-0">
                            <button class="p-0 h-auto cursor-pointer hover:underline truncate block" onClick={() => downloadFile({ file })} title={file.name}>
                              {file.name}
                            </button>
                            <div class="text-muted-foreground text-xs">
                              {formatBytes({ bytes: file.size })}
                            </div>
                          </div>
                          <div class="ml-auto">
                            <Button variant="secondary" onClick={() => downloadFile({ file })}>
                              <div class="i-tabler-download mr-2 text-lg"></div>
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }
                </div>

              </div>

            )}

          </div>
        </Match>
      </Switch>
    </div>
  );
};
