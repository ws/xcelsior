import axios, { AxiosInstance } from 'axios';

import { Credentials } from './crypto';
import { createAgent } from './httpsAgent';

export const createSession = (
  ipAddress: string, // can also be hostname
  port = 8081,
  creds: Credentials,
): AxiosInstance =>
  axios.create({
    baseURL: `https://${ipAddress}:${port}`,
    httpsAgent: createAgent(creds),
    headers: {
      Accept: 'application/sep+xml;level=-S1',
    },
  });
