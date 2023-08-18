import test from 'ava';
import DnsSd from 'node-dns-sd';
import sinon from 'sinon';

import { discoverMeter, discoverMeters } from '../lib/discovery';

const mockPacket = {
  header: {
    id: 0,
    qr: 1,
    op: 0,
    aa: 1,
    tc: 0,
    rd: 0,
    ra: 0,
    z: 0,
    ad: 0,
    cd: 0,
    rc: 0,
    questions: 0,
    answers: 1,
    authorities: 0,
    additionals: 3,
  },
  questions: [],
  answers: [
    {
      name: '_smartenergy._tcp.local',
      type: 'PTR',
      class: 'IN',
      flash: false,
      ttl: 120,
      rdata: 'itrondnsserver-000000000000._smartenergy._tcp.local',
    },
  ],
  authorities: [],
  additionals: [
    {
      name: 'itrondnsserver-000000000000._smartenergy._tcp.local',
      type: 'SRV',
      class: 'IN',
      flash: false,
      ttl: 120,
      rdata: {
        priority: 0,
        weight: 0,
        port: 8081,
        target: 'itrondnsserver-000000000000.local',
      },
    },
    {
      name: 'itrondnsserver-000000000000._smartenergy._tcp.local',
      type: 'TXT',
      class: 'IN',
      flash: false,
      ttl: 120,
      rdata: {
        txtvers: '1',
        dcap: '/dcap',
        level: '-S0',
        https: '8081',
      },
      rdata_buffer: {
        txtvers: {
          // removed
        },
        dcap: {
          // removed
        },
        level: {
          // removed
        },
        https: {
          // removed
        },
      },
    },
    {
      name: 'itrondnsserver-000000000000.local',
      type: 'A',
      class: 'IN',
      flash: false,
      ttl: 120,
      rdata: '192.168.1.23',
    },
  ],
  address: '192.168.1.23',
};

const mockResponse = [
  {
    address: '192.168.1.23',
    fqdn: 'itrondnsserver-000000000000._smartenergy._tcp.local',
    modelName: null,
    familyName: null,
    service: {
      port: 8081,
      protocol: 'tcp',
      type: 'smartenergy',
    },
    packet: mockPacket,
  },
  {
    modelName: null,
    familyName: null,
    address: '192.168.1.2',
    fqdn: 'taco-bell-tv.local',
    service: { port: 8019, protocol: 'tcp', type: 'tacobell-tv' },
    packet: mockPacket,
  },
];

sinon.stub(DnsSd, 'discover').resolves(mockResponse);

test('discoverMeters should filter out non-Itron meters', async (t) => {
  const results = await discoverMeters();

  t.deepEqual(results, [
    {
      ipAddress: '192.168.1.23',
      port: 8081,
    },
  ]);
});

test('discoverMeter should return the first Itron meter found', async (t) => {
  const result = await discoverMeter();

  t.deepEqual(result, {
    ipAddress: '192.168.1.23',
    port: 8081,
  });
});
