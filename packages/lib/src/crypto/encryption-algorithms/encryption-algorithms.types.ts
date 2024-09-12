import type { defineEncryptionMethods } from './encryption-algorithms.models';

export type EncryptionMethodsDefinition = ReturnType<typeof defineEncryptionMethods>;
