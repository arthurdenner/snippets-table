const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const START_TAG =
  '<!-- SNIPPETS-TABLE:START - Do not remove or modify this line -->';
const END_TAG = '<!-- SNIPPETS-TABLE:END -->';
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

async function generateTable({ pathToREADME, pathToSnippets, headers }) {
  try {
    const readme = await readFile(pathToREADME);
    const regex = RegExp(`${START_TAG}([\\s\\S]*?)${END_TAG}`);

    if (!regex.test(readme)) {
      throw Error("Couldn't find start and end tags");
    }

    let snippets = await readFile(pathToSnippets);

    try {
      snippets = JSON.parse(snippets);
    } catch (err) {
      console.error(chalk.red(err.message));
      throw Error(`There was an error parsing ${pathToSnippets}`);
    }

    const snippetsLines = createTableLines(snippets, headers);
    const replace = START_TAG.concat('\n\n', snippetsLines, '\n\n', END_TAG);
    const newReadme = readme.replace(regex, replace);

    await fs.promises.writeFile(pathToREADME, newReadme, 'utf-8');

    console.log(chalk.green(`${pathToREADME} updated!`));
  } catch (err) {
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}

module.exports = generateTable;
