import type { SerializationFormat, SerializationMethodsDefinition } from './serialization.types';
import { keyBy, map } from 'lodash-es';
import { cborArraySerializationDefinition } from './cbor-array/cbor-array.serialization';

export { getParsingMethod, getSerializationMethod };

export const serializationMethodDefinitions = [
  cborArraySerializationDefinition,
] as const;

export const serializationMethodDefinitionsByName: Record<string, SerializationMethodsDefinition> = keyBy(serializationMethodDefinitions, 'name');
export const serializationFormats = map(serializationMethodDefinitions, 'name');

function getSerializationMethod({ serializationFormat }: { serializationFormat: SerializationFormat }) {
  const serializationMethods = serializationMethodDefinitionsByName[serializationFormat];

  if (!serializationMethods) {
    throw new Error(`Serialization format "${serializationFormat}" not found`);
  }

  const { serializeNote } = serializationMethods;

  return { serializeNote };
}

function getParsingMethod({ serializationFormat }: { serializationFormat: SerializationFormat }) {
  const serializationMethods = serializationMethodDefinitionsByName[serializationFormat];

  if (!serializationMethods) {
    throw new Error(`Serialization format "${serializationFormat}" not found`);
  }

  const { parseNote } = serializationMethods;

  return { parseNote };
}
