#!/usr/bin/env node
import * as path from 'node:path';

import { Command, Option } from 'commander';
import fs from 'fs-extra';

import { generateCertificate, getLfdi } from '../lib/crypto';

import confirmOverwriteIfNeeded from './utils/confirmOverwriteIfNeeded';

const program = new Command();

program
  .name('xcelsior')
  .description('Interact with your smart meter')
  .version('0.0.1');

program
  .command('generate-cert')
  .description('Create a self-signed cert + LDFI')
  .addOption(
    new Option('-c, --certPath <path>', 'Output the cert.pem here')
      .default('certs/cert.pem')
      .env('CERT_PATH'),
  )
  .addOption(
    new Option('-k, --keyPath <path>', 'Output the key.pem here')
      .default('certs/key.pem')
      .env('KEY_PATH'),
  )
  .addOption(
    new Option(
      '-l, --lfdiPath <path>',
      'Output the lfdi.txt here (pass blank or false to disable writing this file)',
    )
      .default('certs/lfdi.txt')
      .env('LFDI_PATH'),
  )
  .action(async (values) => {
    const certPath = await confirmOverwriteIfNeeded(values.certPath);
    const keyPath = await confirmOverwriteIfNeeded(values.keyPath);

    const shouldWriteLfdi =
      values.lfdiPath !== 'false' && values.lfdiPath !== '';

    const lfdiPath =
      shouldWriteLfdi && (await confirmOverwriteIfNeeded(values.lfdiPath));

    const { cert, key } = await generateCertificate();
    console.log('📜\tGenerated self-signed certificate');

    const lfdi = await getLfdi(cert);
    console.log(`✍️\tYour LFDI is ${lfdi}`);

    await fs.outputFile(certPath, cert);
    console.log(`✅\tWrote ${certPath}`);

    await fs.outputFile(keyPath, key);
    console.log(`✅\tWrote ${keyPath}`);

    if (lfdiPath) {
      await fs.outputFile(lfdiPath, lfdi);
      console.log(`✅\tWrote ${lfdiPath}`);
    }
  });

program
  .command('get-lfdi')
  .description('Get LFDI from a cert')
  .addOption(
    new Option('-c, --certPath <path>', "Read this cert's LFDI")
      .default('certs/cert.pem')
      .env('CERT_PATH'),
  )
  .action(async ({ certPath }) => {
    console.log(`📖\tReading from ${certPath}...`);

    const absPath = path.resolve(certPath);
    const certContents = await fs.readFile(absPath, 'utf-8');
    const lfdi = await getLfdi(certContents);

    console.log(`✍️\tYour LFDI is ${lfdi}`);
  });

program.parse();
