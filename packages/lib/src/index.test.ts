import { describe, expect, test } from 'vitest';
import * as nodeLib from './index.node';
import * as webLib from './index.web';

describe('lib api', () => {
  test('the web lib exports the same functions as the node lib', () => {
    expect(Object.keys(nodeLib)).to.eql(Object.keys(webLib));
  });
});
