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

const generateRandomBigInt = (bits: number): bigint => {
  const bytes = new Uint8Array(Math.ceil(bits / 8));
  crypto.getRandomValues(bytes);
  return (
    Array.from(bytes).reduce(
      (acc, byte) => (acc << BigInt(8)) | BigInt(byte),
      BigInt(0),
    ) &
    ((BigInt(1) << BigInt(bits)) - BigInt(1))
  );
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

export const generateCertificate = async (appName = 'xcelsior') => {
  const alg = {
    name: 'ECDSA',
    namedCurve: 'P-256',
    hash: 'SHA-256',
  };

  // Generate keys (making sure the private key is extractable)
  const keys = await crypto.subtle.generateKey(alg, true, ['sign', 'verify']);

  const randomHex = [...Array(6)]
    .map(() =>
      Math.floor(Math.random() * 0x1000000)
        .toString(16)
        .padStart(6, '0'),
    )
    .join('');

  // build name as instructed by example app
  // https://github.com/Xcel-Energy/energy-launchpadsdk-client/blob/f44c6ee63763af0b6d9a699ab4a9d80de8592196/src/Ieee2030dot5/Ieee20305dot5Authentication/CertificateUtility.cs#L53
  const name = `O=${appName},CN=${randomHex}`;

  // Create self-signed certificate
  const certificate = await x509.X509CertificateGenerator.createSelfSigned({
    serialNumber: `${generateRandomBigInt(64)}`,
    name,
    notBefore: new Date(),
    notAfter: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // expire in 3 years (max allowed)
    signingAlgorithm: alg,
    keys,
    extensions: [
      new x509.BasicConstraintsExtension(false, 0, true),
      new x509.KeyUsagesExtension(x509.KeyUsageFlags.digitalSignature, true), // https://github.com/Xcel-Energy/energy-launchpadsdk-client/blob/f44c6ee63763af0b6d9a699ab4a9d80de8592196/src/Ieee2030dot5/Ieee20305dot5Authentication/CertificateUtility.cs#L92
      new x509.CertificatePolicyExtension(['1.3.6.1.4.1.40732.2.2'], true), // https://github.com/Xcel-Energy/energy-launchpadsdk-client/blob/f44c6ee63763af0b6d9a699ab4a9d80de8592196/src/Ieee2030dot5/Ieee20305dot5Authentication/CertificateUtility.cs#L98
    ],
  });

  // Export the private key as PKCS#8
  const exportedPrivateKey = await crypto.subtle.exportKey(
    'pkcs8',
    keys.privateKey,
  );

  // Convert to PEM format
  const base64 = Buffer.from(exportedPrivateKey).toString('base64');
  const key = `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`;

  const cert = certificate.toString('pem');

  return { cert, key };
};
