import { describe } from 'vitest';
import { runCommonSerializationTests } from '../serialization.test-utils';
import { cborArraySerializationDefinition } from './cbor-array.serialization';

describe('cbor-array serialization', () => {
  describe('cborArraySerializationDefinition', () => {
    runCommonSerializationTests(cborArraySerializationDefinition);
  });
});
