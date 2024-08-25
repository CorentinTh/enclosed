import { describe, expect, test } from 'vitest';
import { safely, safelySync } from './safely';

describe('safely', () => {
  describe('safelySync', () => {
    test('when the provided function does not throw an error, it returns a tuple with the result and a null error', () => {
      expect(safelySync(() => 1)).to.eql([1, null]);
    });

    test('when the provided function throws an error, it returns a tuple with a null result and the error', () => {
      expect(
        safelySync(() => {
          throw new Error('An error occurred');
        }),
      ).to.eql([null, new Error('An error occurred')]);
    });

    test('if the thrown error is not an instance of Error, it is serialized and cast to an Error instance', () => {
      expect(
        safelySync(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'An error occurred';
        }),
      ).to.eql([null, new Error('An error occurred')]);

      expect(
        safelySync(() => {
          // eslint-disable-next-line no-throw-literal
          throw 1;
        }),
      ).to.eql([null, new Error('1')]);
    });
  });

  describe('safely', () => {
    describe('when provided a synchronous function', () => {
      test('when the provided function does not throw an error, it returns a tuple with the result and a null error', async () => {
        expect(await safely(() => 1)).to.eql([1, null]);
      });

      test('when the provided function throws an error, it returns a tuple with a null result and the error', async () => {
        expect(
          await safely(() => {
            throw new Error('An error occurred');
          }),
        ).to.eql([null, new Error('An error occurred')]);
      });

      test('if the thrown error is not an instance of Error, it is serialized and cast to an Error instance', async () => {
        expect(
          await safely(() => {
            // eslint-disable-next-line no-throw-literal
            throw 'An error occurred';
          }),
        ).to.eql([null, new Error('An error occurred')]);

        expect(
          await safely(() => {
            // eslint-disable-next-line no-throw-literal
            throw 1;
          }),
        ).to.eql([null, new Error('1')]);
      });
    });

    describe('when provided an asynchronous function', () => {
      test('when the provided function does not throw an error, it returns a tuple with the result and a null error', async () => {
        expect(await safely(async () => 1)).to.eql([1, null]);
      });

      test('when the provided function throws an error, it returns a tuple with a null result and the error', async () => {
        expect(
          await safely(async () => {
            throw new Error('An error occurred');
          }),
        ).to.eql([null, new Error('An error occurred')]);
      });

      test('if the thrown error is not an instance of Error, it is serialized and cast to an Error instance', async () => {
        expect(
          await safely(async () => {
            // eslint-disable-next-line no-throw-literal
            throw 'An error occurred';
          }),
        ).to.eql([null, new Error('An error occurred')]);

        expect(
          await safely(async () => {
            // eslint-disable-next-line no-throw-literal
            throw 1;
          }),
        ).to.eql([null, new Error('1')]);
      });
    });

    describe('when provided a promise', () => {
      test('when the promise resolves, it returns a tuple with the result and a null error', async () => {
        expect(await safely(Promise.resolve(1))).to.eql([1, null]);
      });

      test('when the promise rejects, it returns a tuple with a null result and the error', async () => {
        expect(
          await safely(
            new Promise((_, reject) => {
              reject(new Error('An error occurred'));
            }),
          ),
        ).to.eql([null, new Error('An error occurred')]);
      });

      test('if the rejected error is not an instance of Error, it is serialized and cast to an Error instance', async () => {
        expect(
          await safely(
            new Promise((_, reject) => {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('An error occurred');
            }),
          ),
        ).to.eql([null, new Error('An error occurred')]);

        expect(
          await safely(
            new Promise((_, reject) => {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(1);
            }),
          ),
        ).to.eql([null, new Error('1')]);
      });
    });
  });
});
