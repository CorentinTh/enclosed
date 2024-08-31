import { describe } from 'vitest';
import { runCommonCryptoUsecasesTests } from '../crypto.usecases.test';
import { createDecryptUsecase, createEncryptUsecase } from '../crypto.usecases';

import * as nodeCryptoLib from './crypto.node.usecases';

describe('crypto usecases', () => {
  describe('node', () => {
    runCommonCryptoUsecasesTests({
      ...createEncryptUsecase({ ...nodeCryptoLib }),
      ...createDecryptUsecase({ ...nodeCryptoLib }),
    });
  });
});
