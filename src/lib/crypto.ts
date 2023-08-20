import { createSecureContext } from 'node:tls';

import { Crypto } from '@peculiar/webcrypto';
import * as x509 from '@peculiar/x509';

// WebCrypto shim since node crypto doesn't support everything we need
const crypto = new Crypto();
x509.cryptoProvider.set(crypto);

type CertPem = string;
type KeyPem = string;

export type Credentials = {
  readonly cert: CertPem;
  readonly key: KeyPem;
};

export const isValidCredentials = (
  creds: Credentials,
): creds is Credentials => {
  try {
    createSecureContext({ cert: creds.cert, key: creds.key });
    return true;
  } catch {
    return false;
  }
};

export const getLfdi = async (cert: CertPem): Promise<string> => {
  const certificate = new x509.X509Certificate(cert);

  const thumbprint = await certificate.getThumbprint('SHA-256');
  const hexThumbprint = Buffer.from(thumbprint as ArrayBuffer)
    .toString('hex')
    .slice(0, 40);

  const lfdi =
    hexThumbprint
      .match(/.{1,5}/g)
      ?.join('-')
      .toUpperCase() || '';

  return lfdi;
};
