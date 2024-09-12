import { isApiClientErrorWithCode, isApiClientErrorWithStatusCode } from './api/api.models';
import { createDecryptUsecase, createEncryptUsecase } from './crypto/crypto.usecases';
import { deriveMasterKey, generateBaseKey } from './crypto/node/crypto.node.usecases';
import { encryptionAlgorithms, getDecryptionMethod, getEncryptionMethod } from './crypto/node/encryption-algorithms/encryption-algorithms.registry';
import { serializationFormats } from './crypto/serialization/serialization.registry';
import { filesToNoteAssets, fileToNoteAsset, noteAssetsToFiles, noteAssetToFile } from './files/files.models';
import { createNoteUrlHashFragment, parseNoteUrlHashFragment } from './notes/notes.models';
import { fetchNote, storeNote } from './notes/notes.services';
import { createEnclosedLib } from './notes/notes.usecases';

const { encryptNote } = createEncryptUsecase({ generateBaseKey, deriveMasterKey, getEncryptionMethod });
const { decryptNote } = createDecryptUsecase({ deriveMasterKey, getDecryptionMethod });

const { createNote, createNoteUrl, parseNoteUrl } = createEnclosedLib({ encryptNote, storeNote });

export {
  createNote,
  createNoteUrl,
  createNoteUrlHashFragment,
  decryptNote,
  encryptionAlgorithms,
  encryptNote,
  fetchNote,
  filesToNoteAssets,
  fileToNoteAsset,
  isApiClientErrorWithCode,
  isApiClientErrorWithStatusCode,
  noteAssetsToFiles,
  noteAssetToFile,
  parseNoteUrl,
  parseNoteUrlHashFragment,
  serializationFormats,
  storeNote,
};
