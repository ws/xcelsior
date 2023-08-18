import { createSecureContext } from 'node:tls';

import { md, util } from 'node-forge';

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

export const getLfdi = (cert: CertPem): string => {
  // Convert the PEM certificate to a DER format
  const certDer = util.decode64(
    cert.replace(/(-----(BEGIN|END) CERTIFICATE-----|\s)/g, ''),
  );

  // Create a SHA-256 hash object
  const hash = md.sha256.create();

  // Update the hash object with the DER data
  hash.update(certDer);

  // Get the digest in hex format and take the first 40 characters
  const hexFingerprint = hash.digest().toHex().substring(0, 40);

  // Format the fingerprint into groups of 5 characters (like it displays on the Xcel site)
  const lfdi =
    hexFingerprint
      .match(/.{1,5}/g)
      ?.join('-')
      .toUpperCase() || '';

  return lfdi;
};
