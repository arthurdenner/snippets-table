#!/usr/bin/env node
/* eslint-disable no-console */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const TAG = '<!-- SNIPPETS-TABLE - Do not remove or modify this line -->';
const readFile = path => fs.promises.readFile(path, 'utf8');

function createTableLines(snippets, headers) {
  const separatorLine = headers.reduce(acc => acc.concat(`--- | `), '\n| ');
  const headersLines = headers
    .reduce((acc, header) => acc.concat(`${header} | `), '| ')
    .concat(separatorLine);
  const bodyLines = Object.keys(snippets).reduce((acc, key) => {
    const data = snippets[key];
    const newLine = `\n| \`${data.prefix}\`    | ${key} | ${data.description} |`;

    return acc.concat(newLine);
  }, '');
  const table = headersLines.concat(bodyLines);

  return prettier.format(table, { parser: 'markdown' }).trim();
}

async function generateTable(pathToREADME, pathToSnippets, headers) {
  try {
    const readme = await readFile(pathToREADME);
    const foundTag = readme.includes(TAG);
  
    if (!foundTag) {
      throw Error(`Couldn't find tag "${TAG}"`);
    }

    const snippets = JSON.parse(await readFile(pathToSnippets));
    const snippetsLines = createTableLines(snippets, headers);

    const newReadme = readme.replace(
      TAG,
      TAG.concat('\n\n', snippetsLines)
    );

    await fs.promises.writeFile('README_new.md', newReadme, {
      encoding: 'utf-8',
    });

    console.log(chalk.green('New README created!'));
  } catch (err) {
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}

generateTable('README.md', 'snippets/snippets.json', [
  'Shortcut',
  'Expanded',
  'Description',
]);

module.exports = generateTable;
