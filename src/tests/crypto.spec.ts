/* eslint-disable functional/no-return-void */
import * as fs from 'node:fs';
import { Agent } from 'node:https';
import * as path from 'node:path';
import * as process from 'node:process';

import test from 'ava';

import { createAgent, getLfdi } from '../lib/crypto';

const base = path.join(process.cwd(), 'src/tests/resources');
const validCertPath = path.join(base, 'test_cert.pem');
const validKeyPath = path.join(base, 'test_key.pem');

const validCert = fs.readFileSync(validCertPath, 'utf8');
const validKey = fs.readFileSync(validKeyPath, 'utf8');

test('createAgent with valid cert and key', (t) => {
  const result = createAgent({ cert: validCert, key: validKey });
  t.true(result instanceof Agent, 'Expected result to be an instance of Agent');
});

test('createAgent with missing cert and key', (t) => {
  const result = createAgent({ cert: '', key: '' });
  t.true(result instanceof Error, 'Expected result to be an instance of Error');
  t.is((result as Error).message, 'SSL certificate and/or key not provided');
});

test('createAgent with invalid cert', (t) => {
  const result = createAgent({ cert: 'iamafakecert', key: validKey });
  t.true(result instanceof Error, 'Expected result to be an instance of Error');
  t.is((result as Error).message, 'Invalid SSL cert/key');
});

test('getLfdi with valid cert', (t) => {
  const result = getLfdi(validCert);
  t.is(result, '4427E-F88A6-068F0-6D225-D64CC-4E23C-4D734-E848D');
});
