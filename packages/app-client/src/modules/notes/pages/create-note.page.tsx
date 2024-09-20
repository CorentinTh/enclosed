import { authStore } from '@/modules/auth/auth.store';
import { useConfig } from '@/modules/config/config.provider';
import { getFileIcon } from '@/modules/files/files.models';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { isHttpErrorWithCode, isRateLimitError } from '@/modules/shared/http/http-errors';
import { cn } from '@/modules/shared/style/cn';
import { CopyButton } from '@/modules/shared/utils/copy';
import { Alert, AlertDescription } from '@/modules/ui/components/alert';
import { Button } from '@/modules/ui/components/button';
import { SwitchControl, SwitchLabel, SwitchThumb, Switch as SwitchUiComponent } from '@/modules/ui/components/switch';
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from '@/modules/ui/components/tabs';
import { TextArea } from '@/modules/ui/components/textarea';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { safely } from '@corentinth/chisels';
import { useNavigate } from '@solidjs/router';
import { type Component, createSignal, Match, onCleanup, onMount, Show, Switch } from 'solid-js';
import { FileUploaderButton } from '../components/file-uploader';
import { NotePasswordField } from '../components/note-password-field';
import { useNoteContext } from '../notes.context';
import { encryptAndCreateNote } from '../notes.usecases';

export const CreateNotePage: Component = () => {
  const [getContent, setContent] = createSignal('');
  const [getPassword, setPassword] = createSignal('');
  const [getNoteUrl, setNoteUrl] = createSignal('');
  const [getError, setError] = createSignal<{ message: string; details?: string } | null>(null);
  const [getIsNoteCreated, setIsNoteCreated] = createSignal(false);
  const [getIsPublic, setIsPublic] = createSignal(true);
  const [getTtlInSeconds, setTtlInSeconds] = createSignal(3600);
  const [getDeleteAfterReading, setDeleteAfterReading] = createSignal(false);
  const [getUploadedFiles, setUploadedFiles] = createSignal<File[]>([]);
  const [getIsNoteCreating, setIsNoteCreating] = createSignal(false);

  const { t } = useI18n();

  const { config } = useConfig();
  const navigate = useNavigate();

  const { onResetNoteForm, removeResetNoteFormHandler } = useNoteContext();

  function resetNoteForm() {
    setContent('');
    setPassword('');
    setNoteUrl('');
    setError(null);
    setIsPublic(true);
    setIsNoteCreated(false);
    setTtlInSeconds(3600);
    setDeleteAfterReading(false);
    setUploadedFiles([]);
    setIsNoteCreating(false);
  }

  onMount(() => {
    if (config.isAuthenticationRequired && !authStore.getIsAuthenticated()) {
      navigate('/login');
      return;
    }

    onResetNoteForm(resetNoteForm);
  });

  onCleanup(() => {
    removeResetNoteFormHandler(resetNoteForm);
  });

  const createNote = async () => {
    if (!getContent() && getUploadedFiles().length === 0) {
      setError({ message: t('create.errors.empty-note') });
      return;
    }

    setIsNoteCreating(true);

    const [createdNote, error] = await safely(encryptAndCreateNote({
      content: getContent(),
      password: getPassword(),
      ttlInSeconds: getTtlInSeconds(),
      deleteAfterReading: getDeleteAfterReading(),
      fileAssets: getUploadedFiles(),
      isPublic: getIsPublic(),
    }));

    setIsNoteCreating(false);

    if (!error) {
      const { noteUrl } = createdNote;

      setNoteUrl(noteUrl);
      setIsNoteCreated(true);
      return;
    }

    if (isRateLimitError({ error })) {
      setError({ message: t('create.errors.rate-limit') });
      return;
    }

    if (isHttpErrorWithCode({ error, code: 'note.payload_too_large' })) {
      setError({ message: t('create.errors.too-large') });
      return;
    }

    if (isHttpErrorWithCode({ error, code: 'auth.unauthorized' })) {
      setError({ message: t('create.errors.unauthorized') });
      return;
    }

    setError({ message: t('create.errors.unknown'), details: error.message });
  };

  function updateContent(text: string) {
    setContent(text);
    setError(null);
  }

  const getIsShareApiSupported = () => navigator.share !== undefined;

  const shareNote = async () => {
    if (!getIsShareApiSupported()) {
      return;
    }

    try {
      await navigator.share({
        title: t('create.share.title'),
        text: t('create.share.description'),
        url: getNoteUrl(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div class="mx-auto max-w-1200px px-6 mt-6 flex gap-4 flex-col sm:flex-row">
      <Switch>
        <Match when={!getIsNoteCreated()}>
          <TextFieldRoot class="w-full ">
            <TextArea
              placeholder={t('create.settings.placeholder')}
              class="flex-1 p-4 min-h-300px sm:min-h-700px"
              value={getContent()}
              onInput={e => updateContent(e.currentTarget.value)}
              data-test-id="note-content"
            />
          </TextFieldRoot>

          <div class="w-full sm:w-320px flex flex-col gap-4 flex-shrink-0">
            <TextFieldRoot class="w-full">
              <TextFieldLabel>
                {t('create.settings.password.label')}
              </TextFieldLabel>
              <NotePasswordField getPassword={getPassword} setPassword={setPassword} dataTestId="note-password" />
            </TextFieldRoot>

            <TextFieldRoot class="w-full">
              <TextFieldLabel>
                {t('create.settings.expiration')}
              </TextFieldLabel>
              <Tabs
                value={getTtlInSeconds().toString()}
                onChange={(value: string) => setTtlInSeconds(Number(value))}
              >
                <TabsList>
                  <TabsIndicator />
                  <TabsTrigger value="3600">{t('create.settings.delays.1h')}</TabsTrigger>
                  <TabsTrigger value="86400">{t('create.settings.delays.1d')}</TabsTrigger>
                  <TabsTrigger value="604800">{t('create.settings.delays.1w')}</TabsTrigger>
                  <TabsTrigger value="2592000">{t('create.settings.delays.1m')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </TextFieldRoot>
            {/*
            {config.isAuthenticationRequired && (
              <TextFieldRoot class="w-full">
                <TextFieldLabel>
                  Note visibility
                </TextFieldLabel>
                <Tabs
                  value={getIsPublic() ? 'true' : 'false'}
                  onChange={(value: string) => setIsPublic(value === 'true')}
                >
                  <TabsList>
                    <TabsIndicator />
                    <TabsTrigger value="true">Public</TabsTrigger>
                    <TabsTrigger value="false">Private</TabsTrigger>
                  </TabsList>
                </Tabs>
              </TextFieldRoot>
            )} */}

            <TextFieldRoot class="w-full">
              <TextFieldLabel>
                {t('create.settings.delete-after-reading.label')}
              </TextFieldLabel>
              <SwitchUiComponent class="flex items-center space-x-2" checked={getDeleteAfterReading()} onChange={setDeleteAfterReading}>
                <SwitchControl data-test-id="delete-after-reading">
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel class="text-sm text-muted-foreground">
                  {t('create.settings.delete-after-reading.description')}
                </SwitchLabel>
              </SwitchUiComponent>
            </TextFieldRoot>

            <div>
              <FileUploaderButton variant="secondary" class="mt-2 w-full" multiple onFilesUpload={({ files }) => setUploadedFiles(prevFiles => [...prevFiles, ...files])} data-test-id="create-note">
                <div class="i-tabler-upload mr-2 text-lg text-muted-foreground"></div>
                {t('create.settings.attach-files')}
              </FileUploaderButton>

              <Button class="mt-2 w-full" onClick={createNote} disabled={getIsNoteCreating()}>
                <div class={cn('mr-2 text-lg text-muted-foreground', getIsNoteCreating() ? 'i-tabler-loader-2 animate-spin' : 'i-tabler-plus')}></div>
                {getIsNoteCreating() ? t('create.settings.creating') : t('create.settings.create')}
              </Button>
            </div>

            <div class="flex flex-col gap-1">
              {getUploadedFiles().map(file => (
                <div class="flex items-center gap-2">
                  <div class={cn('text-lg text-muted-foreground flex-shrink-0', getFileIcon({ file }))} />
                  <div class="truncate" title={file.name}>
                    {file.name}
                  </div>

                  <Button class="size-9 ml-auto" variant="ghost" onClick={() => setUploadedFiles(prevFiles => prevFiles.filter(f => f !== file))}>
                    <div class="i-tabler-x text-lg text-muted-foreground cursor-pointer flex-shrink-0"></div>
                  </Button>
                </div>
              ))}
            </div>

            <Show when={getError()}>
              {error => (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error().message}
                  </AlertDescription>
                </Alert>
              )}
            </Show>

          </div>

        </Match>

        <Match when={getIsNoteCreated()}>
          <div class="flex flex-col justify-center items-center gap-2 w-full mt-12  mx-auto">
            <div class="i-tabler-circle-check text-primary text-5xl"></div>
            <div class="text-xl font-semibold">
              {t('create.success.title')}
            </div>

            <div class="text-muted-foreground text-center max-w-400px">
              {
                [
                  t('create.success.description'),
                  getDeleteAfterReading() && t('create.success.with-deletion'),
                ].filter(Boolean).join(' ')
              }

            </div>

            <TextFieldRoot class="w-full max-w-800px mt-4">
              <TextField value={getNoteUrl()} readonly class="w-full text-center" data-test-id="note-url" />
            </TextFieldRoot>

            <div class="flex items-center gap-2 w-full mx-auto mt-2 justify-center flex-col sm:flex-row">

              <CopyButton
                variant="secondary"
                class="flex-shrink-0 w-full sm:w-auto"
                autofocus
                text={getNoteUrl()}
                label={t('create.success.copy-link')}
                copiedLabel={t('create.success.copy-success')}
              />

              <Show when={getIsShareApiSupported()}>
                <Button variant="secondary" class="flex-shrink-0 w-full sm:w-auto" onClick={shareNote}>
                  <div class="i-tabler-share mr-2 text-lg"></div>
                  {t('create.share.button')}
                </Button>
              </Show>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
};
