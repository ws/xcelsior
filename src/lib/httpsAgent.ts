import { constants } from 'node:crypto';
import { Agent } from 'node:https';

import { Credentials, isValidCredentials } from './crypto';

export const createAgent = (creds: Credentials): Agent | Error => {
  if (!creds.cert || !creds.key) {
    return new Error('SSL certificate and/or key not provided');
  }

  // runtime check
  if (!isValidCredentials(creds)) {
    return new Error('Invalid SSL cert/key');
  }

  return new Agent({
    keepAlive: true,
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined, // bypass hostname verification
    secureProtocol: 'TLSv1_2_method',
    ciphers: 'ECDHE-ECDSA-AES128-CCM8',
    cert: creds.cert,
    key: creds.key,
    secureOptions:
      constants.SSL_OP_NO_TLSv1 |
      constants.SSL_OP_NO_TLSv1_1 |
      constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
  });
};
