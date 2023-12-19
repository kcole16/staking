import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const packageJson = JSON.parse(
  fs.readFileSync(
    path.dirname(fileURLToPath(import.meta.url)) + '/../../package.json',
    'utf8'
  )
);

export const version = async (req, res) => {
  res.status(200).json({ version: packageJson.version });
};
