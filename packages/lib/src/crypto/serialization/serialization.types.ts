import type { defineSerializationMethods } from './serialization.models';
import type { serializationMethodDefinitions } from './serialization.registry';

export type SerializationMethodsDefinition = ReturnType<typeof defineSerializationMethods>;
export type SerializationFormat = typeof serializationMethodDefinitions[number]['name'];
