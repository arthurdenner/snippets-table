#!/usr/bin/env node
/* eslint-disable no-console */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const TAG = '<!-- SNIPPETS-TABLE - Do not remove or modify this line -->';
const readFile = path => fs.promises.readFile(path, 'utf8');
const getPrefix = p => (Array.isArray(p) ? p.join(', ') : p);

function createTableLines(snippets, headers) {
  const separatorLine = headers.reduce(acc => acc.concat(`--- | `), '\n| ');
  const headersLine = headers.reduce((acc, h) => acc.concat(`${h} | `), '| ');
  const bodyLines = Object.keys(snippets).reduce((acc, key) => {
    const { description = '---', prefix } = snippets[key];
    const newLine = `\n| \`${getPrefix(prefix)}\` | ${key} | ${description} |`;

    return acc.concat(newLine);
  }, '');
  const table = headersLine.concat(separatorLine, bodyLines);

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

    const newReadme = readme.replace(TAG, TAG.concat('\n\n', snippetsLines));

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
  'Prefix',
  'Name',
  'Description',
]);

module.exports = generateTable;
