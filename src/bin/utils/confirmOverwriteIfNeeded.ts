import * as path from 'node:path';

import confirm from '@inquirer/confirm';
import fs from 'fs-extra';

// takes a filePath as a param
// gets the absolute path
// if that file already exists, prompt the user
// if it doesn't, or if the user doesn't care, return the absolute path
const confirmOverwriteIfNeeded = async (filePath: string) => {
  const absolutePath = path.resolve(filePath);
  const fileExists = await fs.pathExists(absolutePath);

  if (fileExists) {
    const shouldOverwrite = await confirm({
      message: `⚠️\t${filePath} already exists, are you sure you want to overwrite it? This cannot be undone`,
      default: false,
    });

    if (!shouldOverwrite) {
      console.log('Exiting without overwrites');
      process.exit(0);
    }
  }

  return absolutePath;
};

export default confirmOverwriteIfNeeded;
