import { describe, expect, test } from 'vitest';
import { isApiClientErrorWithCode, isApiClientErrorWithStatusCode } from './api.models';

describe('api models', () => {
  describe('isApiClientErrorWithStatusCode', () => {
    test('permit to check if an error raised by the api client has a specific status code as response', () => {
      const error = Object.assign(new Error('Failed to fetch note'), {
        response: {
          status: 404,
        },
      });

      expect(isApiClientErrorWithStatusCode({ error, statusCode: 404 })).to.eql(true);
      expect(isApiClientErrorWithStatusCode({ error, statusCode: 500 })).to.eql(false);
    });

    test('the error must be an instance of Error and have a response object', () => {
      expect(isApiClientErrorWithStatusCode({ error: {}, statusCode: 404 })).to.eql(false);
      expect(isApiClientErrorWithStatusCode({ error: new Error('Failed to fetch note'), statusCode: 404 })).to.eql(false);
    });
  });

  describe('isApiClientErrorWithCode', () => {
    test('permit to check if an error raised by the api client has a specific code in the error body', () => {
      const error = Object.assign(new Error('Failed to fetch note'), {
        response: {
          body: {
            error: {
              code: 'NOT_FOUND',
            },
          },
        },
      });

      expect(isApiClientErrorWithCode({ error, code: 'NOT_FOUND' })).to.eql(true);
      expect(isApiClientErrorWithCode({ error, code: 'INTERNAL_ERROR' })).to.eql(false);
    });

    test('the error must be an instance of Error and have a response object with a body object', () => {
      expect(isApiClientErrorWithCode({ error: {}, code: 'NOT_FOUND' })).to.eql(false);
      expect(isApiClientErrorWithCode({ error: new Error('Failed to fetch note'), code: 'NOT_FOUND' })).to.eql(false);
      expect(isApiClientErrorWithCode({ error: { response: {} }, code: 'NOT_FOUND' })).to.eql(false);
      expect(isApiClientErrorWithCode({ error: { response: { body: {} } }, code: 'NOT_FOUND' })).to.eql(false);
    });
  });
});
