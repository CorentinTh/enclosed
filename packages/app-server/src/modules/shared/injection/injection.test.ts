import { describe, expect, test } from 'vitest';
import { injectArguments } from './injection';

describe('injection', () => {
  describe('injectArguments', () => {
    test('the injected dependencies are added to each function arguments', () => {
      const functions = injectArguments(
        {
          foo: ({ a, b }: { a: number; b: number }) => a + b,
          bar: ({ a, c }: { a: number; c: number }) => a + c,
          baz: ({ f }: { f: number }) => f,
        },
        { a: 1, b: 3 },
      );

      expect(Object.keys(functions)).toEqual(['foo', 'bar', 'baz']);

      const { foo, bar, baz } = functions;

      expect(foo()).toBe(4);
      expect(bar({ c: 2 })).toBe(3);
      expect(baz({ f: 5 })).toBe(5);
    });
  });
});
