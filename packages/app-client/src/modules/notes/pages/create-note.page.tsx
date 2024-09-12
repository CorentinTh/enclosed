import { getFileIcon } from '@/modules/files/files.models';
import { isHttpErrorWithCode, isRateLimitError } from '@/modules/shared/http/http-errors';
import { cn } from '@/modules/shared/style/cn';
import { CopyButton } from '@/modules/shared/utils/copy';
import { Alert, AlertDescription } from '@/modules/ui/components/alert';
import { Button } from '@/modules/ui/components/button';
import { SwitchControl, SwitchLabel, SwitchThumb, Switch as SwitchUiComponent } from '@/modules/ui/components/switch';
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from '@/modules/ui/components/tabs';
import { TextArea } from '@/modules/ui/components/textarea';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { type Component, createSignal, Match, onCleanup, onMount, Show, Switch } from 'solid-js';
import { FileUploaderButton } from '../components/file-uploader';
import { NotePasswordField } from '../components/note-password-field';
import { useNoteContext } from '../notes.context';
import { encryptAndCreateNote } from '../notes.usecases';

export const CreateNotePage: Component = () => {
  const [getContent, setContent] = createSignal('');
  const [getPassword, setPassword] = createSignal('');
  const [getNoteUrl, setNoteUrl] = createSignal('');
  const [getErrorMessage, setErrorMessage] = createSignal('');
  const [getIsNoteCreated, setIsNoteCreated] = createSignal(false);
  const [getTtlInSeconds, setTtlInSeconds] = createSignal(3600);
  const [getDeleteAfterReading, setDeleteAfterReading] = createSignal(false);
  const [getUploadedFiles, setUploadedFiles] = createSignal<File[]>([]);

  const { onResetNoteForm, removeResetNoteFormHandler } = useNoteContext();

  function resetNoteForm() {
    setContent('');
    setPassword('');
    setNoteUrl('');
    setErrorMessage('');
    setIsNoteCreated(false);
    setTtlInSeconds(3600);
    setDeleteAfterReading(false);
    setUploadedFiles([]);
  }

  onMount(() => {
    onResetNoteForm(resetNoteForm);
  });

  onCleanup(() => {
    removeResetNoteFormHandler(resetNoteForm);
  });

  const createNote = async () => {
    if (!getContent() && getUploadedFiles().length === 0) {
      setErrorMessage('Please enter a note content or attach a file.');
      return;
    }

    try {
      const { noteUrl } = await encryptAndCreateNote({
        content: getContent(),
        password: getPassword(),
        ttlInSeconds: getTtlInSeconds(),
        deleteAfterReading: getDeleteAfterReading(),
        fileAssets: getUploadedFiles(),
      });

      setNoteUrl(noteUrl);
      setIsNoteCreated(true);
    } catch (error) {
      if (isRateLimitError({ error })) {
        setErrorMessage('You have exceeded the rate limit for creating notes. Please try again later.');
        return;
      }

      if (isHttpErrorWithCode({ error, code: 'note.payload_too_large' })) {
        setErrorMessage('The note content and attachments are too large. Please reduce the size and try again.');
        return;
      }

      setErrorMessage('An error occurred while creating the note, please try again.');
    }
  };

  function updateContent(text: string) {
    setContent(text);
    setErrorMessage('');
  }

  const getIsShareApiSupported = () => navigator.share !== undefined;

  const shareNote = async () => {
    if (!getIsShareApiSupported()) {
      return;
    }

    try {
      await navigator.share({
        title: 'Shared note',
        text: 'Here is a note for you',
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
            <TextArea placeholder="Type your note here." class="flex-1 p-4 min-h-300px sm:min-h-700px" value={getContent()} onInput={e => updateContent(e.currentTarget.value)} />
          </TextFieldRoot>

          <div class="w-full sm:w-320px flex flex-col gap-4 flex-shrink-0">
            <TextFieldRoot class="w-full">
              <TextFieldLabel>Note password</TextFieldLabel>
              <NotePasswordField getPassword={getPassword} setPassword={setPassword} />

            </TextFieldRoot>

            <TextFieldRoot class="w-full">
              <TextFieldLabel>Expiration delay</TextFieldLabel>
              <Tabs
                value={getTtlInSeconds().toString()}
                onChange={(value: string) => setTtlInSeconds(Number(value))}
              >
                <TabsList>
                  <TabsIndicator />
                  <TabsTrigger value="3600">1 hour</TabsTrigger>
                  <TabsTrigger value="86400">1 day</TabsTrigger>
                  <TabsTrigger value="604800">1 week</TabsTrigger>
                  <TabsTrigger value="2592000">1 month</TabsTrigger>
                </TabsList>
              </Tabs>
            </TextFieldRoot>

            <TextFieldRoot class="w-full">
              <TextFieldLabel>Delete after reading</TextFieldLabel>
              <SwitchUiComponent class="flex items-center space-x-2" checked={getDeleteAfterReading()} onChange={setDeleteAfterReading}>
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel class="text-sm text-muted-foreground">
                  Delete the note after reading
                </SwitchLabel>
              </SwitchUiComponent>
            </TextFieldRoot>

            <div>
              <FileUploaderButton variant="secondary" class="mt-2 w-full" multiple onFilesUpload={({ files }) => setUploadedFiles(prevFiles => [...prevFiles, ...files])}>
                <div class="i-tabler-upload mr-2 text-lg text-muted-foreground"></div>
                Attach files
              </FileUploaderButton>

              <Button class="mt-2 w-full" onClick={createNote}>
                <div class="i-tabler-plus mr-2 text-lg text-muted-foreground"></div>
                Create note
              </Button>
            </div>

            <div class="flex flex-col gap-1">
              {getUploadedFiles().map(file => (
                <div class="flex items-center gap-2">
                  <div class={cn('text-lg text-muted-foreground flex-shrink-0', getFileIcon({ file }))} />
                  <div class="truncate" title={file.name}>
                    {file.name}
                  </div>
                  {/* <div class="text-muted-foreground text-sm">{(file.size)}</div> */}

                  <Button class="size-9 ml-auto" variant="ghost" onClick={() => setUploadedFiles(prevFiles => prevFiles.filter(f => f !== file))}>
                    <div class="i-tabler-x text-lg text-muted-foreground cursor-pointer flex-shrink-0"></div>
                  </Button>
                </div>
              ))}
            </div>

            <Show when={getErrorMessage()}>
              {getMessage => (
                <Alert variant="destructive">
                  <AlertDescription>
                    {getMessage()}
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
              Note created successfully
            </div>

            <div class="text-muted-foreground text-center max-w-400px">
              Your note has been created. You can now share it using the following link.
              {getDeleteAfterReading() && (' This note will be deleted after reading.')}

            </div>

            <TextFieldRoot class="w-full max-w-800px mt-4">
              <TextField value={getNoteUrl()} readonly class="w-full text-center" />
            </TextFieldRoot>

            <div class="flex items-center gap-2 w-full mx-auto mt-2 justify-center flex-col sm:flex-row">

              <CopyButton
                variant="secondary"
                class="flex-shrink-0 w-full sm:w-auto"
                autofocus
                text={getNoteUrl()}
                label="Copy link"
                copiedLabel="Link copied"
              />

              <Show when={getIsShareApiSupported()}>
                <Button variant="secondary" class="flex-shrink-0 w-full sm:w-auto" onClick={shareNote}>
                  <div class="i-tabler-share mr-2 text-lg"></div>
                  Share
                </Button>
              </Show>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
};
