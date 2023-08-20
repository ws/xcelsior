/* eslint-disable functional/no-return-void */
import { Agent } from 'node:https';

import test from 'ava';

import { createAgent } from '../lib/httpsAgent';

import getFakeKeyAndCert from './utils/getFakeKeyAndCert';

test('createAgent with valid cert and key', async (t) => {
  const { cert, key } = await getFakeKeyAndCert();

  const result = createAgent({ cert, key });
  t.true(result instanceof Agent, 'Expected result to be an instance of Agent');
});

test('createAgent with missing cert and key', (t) => {
  const result = createAgent({ cert: '', key: '' });
  t.true(result instanceof Error, 'Expected result to be an instance of Error');
  t.is((result as Error).message, 'SSL certificate and/or key not provided');
});

test('createAgent with invalid cert (but a valid key)', async (t) => {
  const { key } = await getFakeKeyAndCert();

  const result = createAgent({ cert: 'iamafakecert', key });
  t.true(result instanceof Error, 'Expected result to be an instance of Error');
  t.is((result as Error).message, 'Invalid SSL cert/key');
});
