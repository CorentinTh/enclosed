import { createEnclosedLib } from './notes/notes.usecases';
import { decryptNoteContent, deriveMasterKey, encryptNoteContent, generateBaseKey } from './crypto/node/crypto.node.usecases';
import { storeNote } from './notes/notes.services';
import { createDecryptUsecase, createEncryptUsecase } from './crypto/crypto.usecases';

export const { encryptNote } = createEncryptUsecase({ generateBaseKey, deriveMasterKey, encryptNoteContent });
export const { decryptNote } = createDecryptUsecase({ deriveMasterKey, decryptNoteContent });

export const { createNote } = createEnclosedLib({ encryptNote, storeNote });
