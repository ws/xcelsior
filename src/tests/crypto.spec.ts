import test from 'ava';

import { getLfdi } from '../lib/crypto';

import getFakeKeyAndCert from './utils/getFakeKeyAndCert';

test('getLfdi with valid cert', async (t) => {
  const { cert } = await getFakeKeyAndCert();

  const result = await getLfdi(cert);
  t.is(result, '4427E-F88A6-068F0-6D225-D64CC-4E23C-4D734-E848D');
});
