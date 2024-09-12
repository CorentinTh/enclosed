import { createEnclosedLib } from './notes/notes.usecases';
import { deriveMasterKey, generateBaseKey } from './crypto/web/crypto.web.usecases';
import { fetchNote, storeNote } from './notes/notes.services';
import { createDecryptUsecase, createEncryptUsecase } from './crypto/crypto.usecases';
import { isApiClientErrorWithCode, isApiClientErrorWithStatusCode } from './api/api.models';
import { fileToNoteAsset, filesToNoteAssets, noteAssetToFile, noteAssetsToFiles } from './files/files.models';
import { encryptionAlgorithms, getDecryptionMethod, getEncryptionMethod } from './crypto/web/encryption-algorithms/encryption-algorithms.registry';
import { serializationFormats } from './crypto/serialization/serialization.registry';

const { encryptNote } = createEncryptUsecase({ generateBaseKey, deriveMasterKey, getEncryptionMethod });
const { decryptNote } = createDecryptUsecase({ deriveMasterKey, getDecryptionMethod });

const { createNote, createNoteUrl, parseNoteUrl } = createEnclosedLib({ encryptNote, storeNote });

export {
  fetchNote,
  storeNote,
  isApiClientErrorWithStatusCode,
  isApiClientErrorWithCode,
  fileToNoteAsset,
  filesToNoteAssets,
  noteAssetToFile,
  noteAssetsToFiles,
  encryptNote,
  decryptNote,
  createNote,
  createNoteUrl,
  parseNoteUrl,
  serializationFormats,
  encryptionAlgorithms,
};
