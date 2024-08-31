import { describe } from 'vitest';
import { runCommonCryptoUsecasesTests } from '../crypto.usecases.test';
import { createDecryptUsecase, createEncryptUsecase } from '../crypto.usecases';

import * as webCryptoLib from './crypto.web.usecases';

describe('crypto usecases', () => {
  describe('web', () => {
    runCommonCryptoUsecasesTests({
      ...createEncryptUsecase({ ...webCryptoLib }),
      ...createDecryptUsecase({ ...webCryptoLib }),
    });
  });
});
