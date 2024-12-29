import type { Config } from '../config/config.types';
import { describe, expect, test } from 'vitest';
import { extractAccessToken, getIsRegistrationAllowed } from './auth.models';

describe('auth models', () => {
  describe('extractAccessToken', () => {
    test('the access token is extracted from the Authorization header, after the Bearer type', () => {
      expect(extractAccessToken({
        autorisationHeader: 'Bearer ES2MO59aoAksPqoSfghx0kP83sXRAZj4alGBmmp3ZeX2q9dfa4d5CuPBcg4FH9Yc',
      })).to.eql({
        accessToken: 'ES2MO59aoAksPqoSfghx0kP83sXRAZj4alGBmmp3ZeX2q9dfa4d5CuPBcg4FH9Yc',
      });
    });

    test('no access token is extracted if the Authorization header is missing', () => {
      expect(extractAccessToken({
        autorisationHeader: undefined,
      })).to.eql({
        accessToken: undefined,
      });
    });

    test('no access token is extracted if the Authorization header is not a Bearer token', () => {
      expect(extractAccessToken({
        autorisationHeader: 'Basic ES2MO59aoAksPqoSfghx0kP83sXRAZj4alGBmmp3ZeX2q9dfa4d5CuPBcg4FH9Yc',
      })).to.eql({
        accessToken: undefined,
      });
    });

    test('no access token is extracted if the bearer token is missing', () => {
      expect(extractAccessToken({
        autorisationHeader: 'Bearer',
      })).to.eql({
        accessToken: undefined,
      });
    });
  });

  describe('getIsRegistrationAllowed', () => {
    test('user registration is allowed if the app requires authentication and user registration is allowed in the config', () => {
      expect(getIsRegistrationAllowed({
        config: {
          public: {
            isUserRegistrationAllowed: true,
            isAuthenticationRequired: true,
          },
        } as Config,
      })).to.eql(true);

      expect(getIsRegistrationAllowed({
        config: {
          public: {
            isUserRegistrationAllowed: false,
            isAuthenticationRequired: true,
          },
        } as Config,
      })).to.eql(false);

      // Make no sense, but it's a valid configuration
      expect(getIsRegistrationAllowed({
        config: {
          public: {
            isUserRegistrationAllowed: true,
            isAuthenticationRequired: false,
          },
        } as Config,
      })).to.eql(false);

      expect(getIsRegistrationAllowed({
        config: {
          public: {
            isUserRegistrationAllowed: false,
            isAuthenticationRequired: false,
          },
        } as Config,
      })).to.eql(false);
    });
  });
});
