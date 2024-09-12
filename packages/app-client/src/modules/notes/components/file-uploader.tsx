import { cn } from '@/modules/shared/style/cn';
import { Button } from '@/modules/ui/components/button';
import { type Component, type ComponentProps, createSignal, onCleanup, type ParentComponent, splitProps } from 'solid-js';

const DropArea: Component<{ onFilesDrop?: (args: { files: File[] }) => void }> = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    if (e.relatedTarget === null) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer?.files ?? []);

    if (files.length === 0) {
      return;
    }

    props.onFilesDrop?.({ files });
  };

  // Adding global event listeners for drag and drop
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('dragleave', handleDragLeave);
  document.addEventListener('drop', handleDrop);

  // Cleanup listeners when component unmounts
  onCleanup(() => {
    document.removeEventListener('dragover', handleDragOver);
    document.removeEventListener('dragleave', handleDragLeave);
    document.removeEventListener('drop', handleDrop);
  });

  return (
    <div
      class={cn('fixed top-0 left-0 w-screen h-screen z-50 bg-background bg-opacity-50 backdrop-blur transition-colors', isDragging() ? 'block' : 'hidden')}
    >
      <div class="flex items-center justify-center h-full text-center flex-col">
        <div class="i-tabler-file-plus text-6xl text-muted-foreground mx-auto"></div>
        <div class="text-xl my-2 font-semibold text-muted-foreground">Drop files here</div>
        <div class="text-base text-muted-foreground">
          Drag and drop files here to attach them to the note
        </div>
      </div>
    </div>
  );
};

export const FileUploaderButton: ParentComponent<{
  onFileUpload?: (args: { file: File }) => void;
  onFilesUpload?: (args: { files: File[] }) => void;
  multiple?: boolean;
} & ComponentProps<typeof Button>> = (props) => {
  const [fileInputRef, setFileInputRef] = createSignal<HTMLInputElement | null>(null);
  const [local, rest] = splitProps(props, ['onFileUpload', 'multiple', 'onFilesUpload']);

  const uploadFiles = ({ files }: { files: File[] }) => {
    local.onFilesUpload?.({ files });

    for (const file of files) {
      local.onFileUpload?.({ file });
    }
  };

  const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) {
      return;
    }

    const files = Array.from(target.files);

    uploadFiles({ files });
  };

  const onButtonClick = () => {
    fileInputRef()?.click();
  };

  return (
    <>
      <input
        type="file"
        class="hidden"
        onChange={onFileChange}
        ref={setFileInputRef}
        multiple={local.multiple}
      />
      <DropArea onFilesDrop={uploadFiles} />
      <Button onClick={onButtonClick} {...rest}>
        {props.children ?? 'Upload File'}
      </Button>
    </>
  );
};
