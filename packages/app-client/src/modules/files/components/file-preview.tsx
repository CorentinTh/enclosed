import type { Component } from 'solid-js';
import { Match, onCleanup, Switch } from 'solid-js';
import { getFilePreviewType } from '../files.models';

export const FilePreview: Component<{ file: File }> = (props) => {
  // The component is mounted only while the preview is displayed, so the object url lives as long as the preview
  const objectUrl = URL.createObjectURL(props.file);

  onCleanup(() => URL.revokeObjectURL(objectUrl));

  return (
    <Switch>
      <Match when={getFilePreviewType({ file: props.file }) === 'image'}>
        <img
          src={objectUrl}
          alt={props.file.name}
          class="max-w-full max-h-600px mx-auto rounded-md"
          data-test-id="file-preview-image"
        />
      </Match>

      <Match when={getFilePreviewType({ file: props.file }) === 'pdf'}>
        <iframe
          src={objectUrl}
          title={props.file.name}
          class="w-full h-600px rounded-md border"
          data-test-id="file-preview-pdf"
        />
      </Match>
    </Switch>
  );
};
