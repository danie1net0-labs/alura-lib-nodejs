import fs from 'fs';
import chalk from 'chalk';

import { readFile, extractLinks } from './read-file.js';
import { validateLinks } from './http-validation.js';

async function processFile() {
  const path = process.argv[2];

  try {
    fs.lstatSync(path)
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw Error('Directory or file does not exist.')
    }
  }

  if (fs.lstatSync(path).isFile()) {
    return extractLinks(await readFile(path));
  }

  if (fs.lstatSync(path).isDirectory()) {
    const files = await fs.promises.readdir(path)

    const links = files.map(async (file) => extractLinks(await readFile(`${path}/${file}`)))

    return Promise.all(links)
  }
}

try {
  const links = await processFile();
  const validate = process.argv[3] === '--validate';

  if (validate) {
    console.log(chalk.blue('Found links:'), await validateLinks(links));
  } else {
    console.log(chalk.blue('Found links:'), links);
  }
} catch (error) {
  console.log(chalk.red(error));
}
