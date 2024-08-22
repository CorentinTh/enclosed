import { type Component, Show, createSignal } from 'solid-js';
import { encryptAndCreateNote } from '../notes.usecases';
import { TextArea } from '@/modules/ui/components/textarea';
import { TextField, TextFieldLabel, TextFieldRoot } from '@/modules/ui/components/textfield';
import { Button } from '@/modules/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/modules/ui/components/dialog';

export const CreateNotePage: Component = () => {
  const [getContent, setContent] = createSignal('');
  const [getPassword, setPassword] = createSignal('');
  const [getNoteUrl, setNoteUrl] = createSignal('');
  const [getIsNoteCreated, setIsNoteCreated] = createSignal(false);

  const createNote = async () => {
    const { noteUrl } = await encryptAndCreateNote({
      content: getContent(),
      password: getPassword(),
    });

    setNoteUrl(noteUrl);
    setIsNoteCreated(true);
  };

  return (
    <div class="mx-auto max-w-1200px px-6 mt-6 flex gap-4 flex-col sm:flex-row">
      <TextFieldRoot class="w-full ">
        <TextArea placeholder="Type your note here." class="flex-1 p-4 min-h-300px sm:min-h-700px" value={getContent()} onInput={e => setContent(e.currentTarget.value)} />
      </TextFieldRoot>

      <div class="min-w-300px">
        <TextFieldRoot class="w-full max-w-xs">
          <TextFieldLabel>Password</TextFieldLabel>
          <TextField type="password" placeholder="Password" value={getPassword()} onInput={e => setPassword(e.currentTarget.value)} />
        </TextFieldRoot>

        <Button class="w-full mt-4" onClick={createNote}>
          Create note
        </Button>

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
