/* eslint-disable functional/no-return-void */
import * as fs from 'node:fs';
import * as path from 'node:path';

import test from 'ava';
import { AxiosInstance } from 'axios';

import { createSession } from '../lib/axios';
import { Credentials } from '../lib/crypto';

const base = path.join(process.cwd(), 'src/tests/resources');
const validCertPath = path.join(base, 'test_cert.pem');
const validKeyPath = path.join(base, 'test_key.pem');

const validCert = fs.readFileSync(validCertPath, 'utf8');
const validKey = fs.readFileSync(validKeyPath, 'utf8');

test('createSession should return an AxiosInstance with correct baseURL', (t) => {
  const ipAddress = 'fakehost.local';
  const port = 8081;

  const creds: Credentials = { cert: validCert, key: validKey };
  const session: AxiosInstance = createSession(ipAddress, port, creds);

  t.is(session.defaults.baseURL, `https://${ipAddress}:${port}`);
});

// todo: test that correct crypto is being used
