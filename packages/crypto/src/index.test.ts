import { keys, times } from 'lodash-es';
import { describe, expect, test } from 'vitest';
import * as nodeLib from './index.node';
import * as webLib from './index.web';

describe('lib api', () => {
  test('the web lib exports the same functions as the node lib', () => {
    expect(
      keys(nodeLib),
    ).to.eql(
      keys(webLib),
    );
  });

  test('both lib have the same encryption algorithm implementations', () => {
    expect(
      nodeLib.encryptionAlgorithms,
    ).to.eql(
      webLib.encryptionAlgorithms,
    );
  });

  [
    { lib: nodeLib, name: 'node api' },
    { lib: webLib, name: 'web api' },
  ].forEach(({ lib, name }) => {
    describe(name, () => {
      describe('generateBaseKey', () => {
        const { generateBaseKey } = lib;

        test('the base key is a random 32 bytes buffer', () => {
          const { baseKey } = generateBaseKey();

          expect(baseKey.length).toBe(32);
        });
      });

      describe('deriveMasterKey', () => {
        const { deriveMasterKey } = lib;

        test('the master key is a random 32 bytes buffer', async () => {
          const { masterKey } = await deriveMasterKey({
            baseKey: new Uint8Array(32),
            password: 'password',
          });

          expect(masterKey.length).toBe(32);
        });

        test('the derivation is deterministic, the same password and base key will always generate the same master key', async () => {
          const password = 'password';
          const baseKey = new Uint8Array(times(32, i => i));

          const { masterKey: masterKey1 } = await deriveMasterKey({ baseKey, password });
          const { masterKey: masterKey2 } = await deriveMasterKey({ baseKey, password });

          expect(masterKey1).to.eql(masterKey2);
        });
      });
    });
  });
});
