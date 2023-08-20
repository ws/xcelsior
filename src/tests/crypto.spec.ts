import test from 'ava';

import { generateCertificate, getLfdi } from '../lib/crypto';

import getFakeKeyAndCert from './utils/getFakeKeyAndCert';

test('getLfdi with valid cert', async (t) => {
  const { cert } = await getFakeKeyAndCert();

  const result = await getLfdi(cert);
  t.is(result, '4427E-F88A6-068F0-6D225-D64CC-4E23C-4D734-E848D');
});

test.only('generate a cert', async (t) => {
  const { cert, key } = await generateCertificate();

  t.is(typeof cert, 'string');
  t.true(cert.startsWith('-----BEGIN CERTIFICATE-----'));
  t.true(cert.endsWith('-----END CERTIFICATE-----'));
  t.is(typeof key, 'string');
  t.true(key.startsWith('-----BEGIN PRIVATE KEY-----'));
  t.true(key.endsWith('-----END PRIVATE KEY-----'));

  // todo: actually validate the cert
});
