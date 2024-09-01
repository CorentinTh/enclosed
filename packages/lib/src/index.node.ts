import { createEnclosedLib } from './notes/notes.usecases';
import { decryptNoteContent, deriveMasterKey, encryptNoteContent, generateBaseKey } from './crypto/node/crypto.node.usecases';
import { fetchNote, storeNote } from './notes/notes.services';
import { createDecryptUsecase, createEncryptUsecase } from './crypto/crypto.usecases';
import { isApiClientErrorWithCode, isApiClientErrorWithStatusCode } from './api/api.models';

export const { encryptNote } = createEncryptUsecase({ generateBaseKey, deriveMasterKey, encryptNoteContent });
export const { decryptNote } = createDecryptUsecase({ deriveMasterKey, decryptNoteContent });

export const { createNote, createNoteUrl, parseNoteUrl } = createEnclosedLib({ encryptNote, storeNote });

export { fetchNote, storeNote, isApiClientErrorWithStatusCode, isApiClientErrorWithCode };
