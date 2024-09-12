import type { NoteAsset } from '../notes/notes.types';
import { get } from 'lodash-es';

export { filesToNoteAssets, fileToNoteAsset, noteAssetsToFiles, noteAssetToFile };

async function fileToNoteAsset({ file }: { file: File }): Promise<NoteAsset> {
  const content = new Uint8Array(await file.arrayBuffer());

  return {
    metadata: {
      type: 'file',
      fileType: file.type,
      name: file.name,
      size: file.size,
    },
    content,
  };
}

async function filesToNoteAssets({ files }: { files: File[] }): Promise<NoteAsset[]> {
  return Promise.all(files.map(file => fileToNoteAsset({ file })));
}

async function noteAssetToFile({ noteAsset }: { noteAsset: NoteAsset }): Promise<File> {
  if (noteAsset.metadata.type !== 'file') {
    throw new Error('Asset is not a file');
  }

  const fileName = get(noteAsset, 'metadata.name', 'file') as string;
  const fileType = get(noteAsset, 'metadata.fileType', 'application/octet-stream') as string;
  return new File([noteAsset.content], fileName, { type: fileType });
}

async function noteAssetsToFiles({ noteAssets }: { noteAssets: NoteAsset[] }): Promise<File[]> {
  return Promise.all(noteAssets.map(noteAsset => noteAssetToFile({ noteAsset })));
}
