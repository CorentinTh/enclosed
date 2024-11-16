import { createNote, filesToNoteAssets } from '@enclosed/lib';
import { storeNote } from './notes.services';

export { encryptAndCreateNote };

async function encryptAndCreateNote(args: {
  content: string;
  password?: string;
  ttlInSeconds?: number;
  deleteAfterReading: boolean;
  fileAssets: File[];
  isPublic?: boolean;
}) {
  return createNote({
    ...args,
    storeNote,
    clientBaseUrl: window.location.origin,
    assets: [
      ...await filesToNoteAssets({ files: args.fileAssets }),
    ],
  });
}
