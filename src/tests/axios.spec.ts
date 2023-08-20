import test from 'ava';
import { AxiosInstance } from 'axios';

import { createSession } from '../lib/axios';

import getFakeKeyAndCert from './utils/getFakeKeyAndCert';

test('createSession should return an AxiosInstance with correct baseURL', async (t) => {
  const { cert, key } = await getFakeKeyAndCert();
  const ipAddress = 'fakehost.local';
  const port = 8081;

  const session: AxiosInstance = createSession(ipAddress, port, { cert, key });

  t.is(session.defaults.baseURL, `https://${ipAddress}:${port}`);
});

// todo: test that correct crypto is being used
