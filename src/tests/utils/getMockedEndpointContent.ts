import { promises as fs } from 'node:fs';
import { join as pathJoin } from 'node:path';

// todo: make endpoint a distinct type instead of string (since there are limited passable values)
const getMockedEndpointContent = async (
  endpoint: string,
  file: string = 'response.xml',
) => {
  const base = pathJoin(
    process.cwd(),
    'src/tests/resources/endpoint-responses/',
  );

  const responsePath = pathJoin(base, `${endpoint}/${file}`);
  const fileContents = await fs.readFile(responsePath, 'utf-8');

  return fileContents;
};

export default getMockedEndpointContent;
