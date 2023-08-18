import { constants } from 'node:crypto';
import { Agent } from 'node:https';
import { createSecureContext } from 'node:tls';

import * as forge from 'node-forge';

type CertPem = string;
type KeyPem = string;

export type Credentials = {
  readonly cert: CertPem;
  readonly key: KeyPem;
};

const isValidCredentials = (creds: Credentials): creds is Credentials => {
  try {
    createSecureContext({ cert: creds.cert, key: creds.key });
    return true;
  } catch {
    return false;
  }
};

export const createAgent = (creds: Credentials): Agent | Error => {
  if (!creds.cert || !creds.key) {
    return new Error('SSL certificate and/or key not provided');
  }

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

export const getLfdi = (cert: CertPem): string => {
  // Convert the PEM certificate to a DER format
  const certDer = forge.util.decode64(
    cert.replace(/(-----(BEGIN|END) CERTIFICATE-----|\s)/g, ''),
  );

  // Create a SHA-256 hash object
  const md = forge.md.sha256.create();

  // Update the hash object with the DER data
  md.update(certDer);

  // Get the digest in hex format and take the first 40 characters
  const hexFingerprint = md.digest().toHex().substring(0, 40);

  // Format the fingerprint into groups of 5 characters (like it displays on the Xcel site)
  const lfdi =
    hexFingerprint
      .match(/.{1,5}/g)
      ?.join('-')
      .toUpperCase() || '';

  return lfdi;
};
