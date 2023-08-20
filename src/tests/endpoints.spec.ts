import anyTest, { TestFn } from 'ava';
import type { AxiosInstance } from 'axios';
import nock from 'nock';

import { createSession } from '../lib/axios';
import {
  getDeviceInformation,
  getDeviceTime,
  getInstantaneousDemand,
} from '../lib/endpoints';

import getFakeKeyAndCert from './utils/getFakeKeyAndCert';
import getMockedEndpointContent from './utils/getMockedEndpointContent';

const IP_ADDRESS = 'fakehost.local';
const PORT = 8081;
const BASE_URL = `https://${IP_ADDRESS}:${PORT}`;

// store mutable data here instead of a let variable
const test = anyTest as TestFn<{ session: AxiosInstance }>;

test.before(async (t) => {
  const creds = await getFakeKeyAndCert();
  // eslint-disable-next-line functional/immutable-data
  t.context.session = createSession(IP_ADDRESS, PORT, creds);
});

test('getDeviceInformation should return a valid object', async (t) => {
  const mockedResponseBody = await getMockedEndpointContent('/dev/sdi');

  nock(BASE_URL)
    .get('/sdev/sdi')
    .reply(200, mockedResponseBody, { 'Content-Type': 'application/xml' });

  const { session } = t.context;

  const response = await getDeviceInformation(session);

  t.is(response.lFDI, '0000000000000000000000000000000000000000');
  t.is(response.swVer, '10.2.544.2');
});

test('getDeviceTime should return a valid object', async (t) => {
  const mockedResponseBody = await getMockedEndpointContent('/tm');

  nock(BASE_URL)
    .get('/tm')
    .reply(200, mockedResponseBody, { 'Content-Type': 'application/xml' });

  const { session } = t.context;

  const response = await getDeviceTime(session);

  t.is(response.currentTime, 1692501549);
});

test.only('getInstantaneousDemand should return a valid object', async (t) => {
  const mockedResponseBody = await getMockedEndpointContent('/upt/1/mr/1/r');

  nock(BASE_URL)
    .get('/upt/1/mr/1/r')
    .reply(200, mockedResponseBody, { 'Content-Type': 'application/xml' });

  const { session } = t.context;

  const response = await getInstantaneousDemand(session);

  t.is(response.value, 100);
  t.is(response.timePeriod.duration, 1);
  t.is(response.timePeriod.start, 1692501718);
});
