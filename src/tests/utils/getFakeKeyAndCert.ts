import { promises as fs } from 'node:fs';
import { join as pathJoin } from 'node:path';

const getFakeKeyAndCert = async () => {
  const base = pathJoin(process.cwd(), 'src/tests/resources');
  const fakeCertPath = pathJoin(base, 'test_cert.pem');
  const fakeKeyPath = pathJoin(base, 'test_key.pem');

  const cert = await fs.readFile(fakeCertPath, 'utf8');
  const key = await fs.readFile(fakeKeyPath, 'utf8');

  return { cert, key };
};

export default getFakeKeyAndCert;
