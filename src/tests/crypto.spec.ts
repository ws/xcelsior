/* eslint-disable functional/no-return-void */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

import test from 'ava';

import { getLfdi } from '../lib/crypto';

const certPath = path.join(process.cwd(), 'src/tests/resources/test_cert.pem');
const certPem = fs.readFileSync(certPath, 'utf8');

test('getLfdi with valid cert', (t) => {
  const result = getLfdi(certPem);
  t.is(result, '4427E-F88A6-068F0-6D225-D64CC-4E23C-4D734-E848D');
});
