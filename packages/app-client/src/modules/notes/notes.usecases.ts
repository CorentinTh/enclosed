import { createNote } from '@enclosed/lib';
import { storeNote } from './notes.services';

export { encryptAndCreateNote };

async function encryptAndCreateNote(args: {
  content: string;
  password?: string;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
}) {
  return createNote({
    ...args,
    storeNote,
    clientBaseUrl: window.location.origin,
  });
}
