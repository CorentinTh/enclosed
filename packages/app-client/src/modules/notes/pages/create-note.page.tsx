import { type Component, Show, createSignal } from 'solid-js';
import { encryptAndCreateNote } from '../notes.usecases';
import { TextArea } from '@/modules/ui/components/textarea';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { Button } from '@/modules/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/modules/ui/components/dialog';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '@/modules/ui/components/tabs';
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from '@/modules/ui/components/switch';
import { Alert, AlertDescription, AlertTitle } from '@/modules/ui/components/alert';

export const CreateNotePage: Component = () => {
  const [getContent, setContent] = createSignal('');
  const [getPassword, setPassword] = createSignal('');
  const [getNoteUrl, setNoteUrl] = createSignal('');
  const [getErrorMessage, setErrorMessage] = createSignal('');
  const [getIsNoteCreated, setIsNoteCreated] = createSignal(false);
  const [getTtlInSeconds, setTtlInSeconds] = createSignal(3600);
  const [getDeleteAfterReading, setDeleteAfterReading] = createSignal(false);

  const createNote = async () => {
    if (!getContent()) {
      setErrorMessage('Please enter a note content.');
      return;
    }

    try {
      const { noteUrl } = await encryptAndCreateNote({
        content: getContent(),
        password: getPassword(),
        ttlInSeconds: getTtlInSeconds(),
        deleteAfterReading: getDeleteAfterReading(),
      });

      setNoteUrl(noteUrl);
      setIsNoteCreated(true);
    } catch (_error) {
      setErrorMessage('An error occurred while creating the note, please try again.');
    }
  };

  function updateContent(text: string) {
    setContent(text);
    setErrorMessage('');
  }

  return (
    <div class="mx-auto max-w-1200px px-6 mt-6 flex gap-4 flex-col sm:flex-row">
      <TextFieldRoot class="w-full ">
        <TextArea placeholder="Type your note here." class="flex-1 p-4 min-h-300px sm:min-h-700px" value={getContent()} onInput={e => updateContent(e.currentTarget.value)} />
      </TextFieldRoot>

      <div class="min-w-300px flex flex-col gap-4">
        <TextFieldRoot class="w-full">
          <TextFieldLabel>Password</TextFieldLabel>
          <TextField type="password" placeholder="Password" value={getPassword()} onInput={e => setPassword(e.currentTarget.value)} />
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
          <Switch class="flex items-center space-x-2" checked={getDeleteAfterReading()} onChange={setDeleteAfterReading}>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchLabel class="text-sm text-muted-foreground">
              Delete the note after reading
            </SwitchLabel>
          </Switch>
        </TextFieldRoot>

        <Button class="w-full mt-2" onClick={createNote}>
          Create note
        </Button>

        <Show when={getErrorMessage()}>
          {getMessage => (
            <Alert variant="destructive">
              <AlertDescription>
                {getMessage()}
              </AlertDescription>
            </Alert>
          )}
        </Show>

        <Dialog open={getIsNoteCreated()} onOpenChange={setIsNoteCreated}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Note created</DialogTitle>
              <DialogDescription>
                Your note has been created. You can now share it using the following link:
              </DialogDescription>
            </DialogHeader>

            <div class="flex items-center gap-2 mt-4">
              <TextFieldRoot class="flex-1">
                <TextField value={getNoteUrl()} readonly autofocus />
              </TextFieldRoot>
              <Button onClick={() => navigator.clipboard.writeText(getNoteUrl())}>
                Copy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
