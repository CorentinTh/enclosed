import { authStore } from '@/modules/auth/auth.store';
import { getFileIcon } from '@/modules/files/files.models';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { isHttpErrorWithCode, isRateLimitError } from '@/modules/shared/http/http-errors';
import { cn } from '@/modules/shared/style/cn';
import { CopyButton } from '@/modules/shared/utils/copy';
import { Alert, AlertDescription } from '@/modules/ui/components/alert';
import { Button } from '@/modules/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/modules/ui/components/card';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { formatBytes, safely, safelySync } from '@corentinth/chisels';
import { decryptNote, noteAssetsToFiles, parseNoteUrlHashFragment } from '@enclosed/lib';
import { useLocation, useNavigate, useParams } from '@solidjs/router';
import JSZip from 'jszip';
import { type Component, createSignal, type JSX, Match, onMount, Show, Switch } from 'solid-js';
import { fetchNoteById } from '../notes.services';

const RequestPasswordForm: Component<{ onPasswordEntered: (args: { password: string }) => void; getIsPasswordInvalid: () => boolean; setIsPasswordInvalid: (value: boolean) => void }> = (props) => {
  const [getPassword, setPassword] = createSignal('');
  const { t } = useI18n();

  function updatePassword(text: string) {
    setPassword(text);
    props.setIsPasswordInvalid(false);
  }

  return (
    <div class="sm:mt-6 p-6">
      <Card class="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardDescription>
            {t('view.request-password.description')}
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
                <TextFieldLabel>{t('view.request-password.form.label')}</TextFieldLabel>
                <TextField type="password" placeholder={t('view.request-password.form.placeholder')} value={getPassword()} onInput={e => updatePassword(e.currentTarget.value)} autofocus data-test-id="note-password-prompt" />
              </TextFieldRoot>
            </div>
            <Button class="w-full mt-4" type="submit" data-test-id="note-password-submit">
              <div class="i-tabler-lock-open mr-2 text-lg"></div>
              {t('view.request-password.form.unlock-button')}
            </Button>
          </form>
          <Show when={props.getIsPasswordInvalid()}>
            <Alert class="mt-4" variant="destructive">
              <AlertDescription>
                {t('view.request-password.form.invalid')}
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
  const [getError, setError] = createSignal<{ title: string; description: string; action?: JSX.Element } | null>(null);
  const [getNote, setNote] = createSignal<{ payload: string; isPasswordProtected: boolean; encryptionAlgorithm: string; serializationFormat: string } | null>(null);
  const [getDecryptedNote, setDecryptedNote] = createSignal<string | null>(null);
  const [getIsPasswordInvalid, setIsPasswordInvalid] = createSignal(false);
  const [fileAssets, setFileAssets] = createSignal<File[]>([]);
  const [isDownloadingAllLoading, setIsDownloadingAllLoading] = createSignal(false);

  const [getEncryptionKey, setEncryptionKey] = createSignal('');
  const [getIsPasswordProtected, setIsPasswordProtected] = createSignal(false);

  const { t } = useI18n();
  const navigate = useNavigate();

  onMount(async () => {
    const [parsedHashFragment, parsingError] = safelySync(() => parseNoteUrlHashFragment({ hashFragment: location.hash }));

    if (parsingError) {
      setError({
        title: t('view.error.invalid-url.title'),
        description: t('view.error.invalid-url.description'),
      });
      return;
    }

    const { encryptionKey, isPasswordProtected } = parsedHashFragment;

    setIsPasswordProtected(isPasswordProtected);
    setEncryptionKey(encryptionKey);

    if (!encryptionKey) {
      setError({
        title: t('view.error.invalid-url.title'),
        description: t('view.error.invalid-url.description'),
      });
      return;
    }

    const [fetchedNote, fetchError] = await safely(fetchNoteById({ noteId: params.noteId }));

    if (isRateLimitError({ error: fetchError })) {
      setError({
        title: t('view.error.rate-limit.title'),
        description: t('view.error.rate-limit.description'),
      });
      return;
    }

    if (isHttpErrorWithCode({ error: fetchError, code: 'auth.unauthorized' })) {
      setError({
        title: t('view.error.unauthorized.title'),
        description: t('view.error.unauthorized.description'),
        action: (
          <Button
            onClick={() => {
              authStore.setRedirectUrl(location.pathname + location.hash);
              navigate('/login');
            }}
            variant="secondary"
          >
            <div class="i-tabler-login-2 mr-2 text-lg"></div>
            {t('view.error.unauthorized.button')}
          </Button>
        ),
      });
      return;
    }

    if (isHttpErrorWithCode({ error: fetchError, code: 'note.not_found' })) {
      setError({
        title: t('view.error.note-not-found.title'),
        description: t('view.error.note-not-found.description'),
      });
      return;
    }

    if (fetchError) {
      setError({
        title: t('view.error.fetch-error.title'),
        description: t('view.error.fetch-error.description'),
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
        title: t('view.error.decryption.title'),
        description: t('view.error.decryption.description'),
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

    const files = await noteAssetsToFiles({ noteAssets: note.assets });
    setFileAssets(files);
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
              <div class="mt-2 mb-4 text-muted-foreground text-pretty">
                {error().description}
              </div>

              {error().action}
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
                  <div class="text-muted-foreground" data-test-id="note-content-display">
                    {t('view.note-content')}
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

                      {t('view.download-all')}
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
                              {t('view.download')}
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
