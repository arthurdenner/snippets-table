#!/usr/bin/env node

const inquirer = require('inquirer');
const yargs = require('yargs');
const generate = require('./generate');

const yargv = yargs
  .help('help')
  .alias('h', 'help')
  .alias('v', 'version')
  .version()
  .recommendCommands()
  .command('generate', 'Generate the table of snippets')
  .usage('Usage: $0 generate')
  .default('pathToREADME', 'README.md')
  .default('pathToSnippets', 'snippets/snippets.json')
  .default('headers', ['Prefix', 'Name', 'Description']);

function promptForCommand({ argv }) {
  const questions = [
    {
      type: 'list',
      name: 'command',
      message: 'What do you want to do?',
      choices: [
        {
          name: 'Generate the table of snippets',
          value: 'generate',
        },
      ],
      when: !argv._[0],
      default: 0,
    },
  ];

  return inquirer.prompt(questions).then((answers) => {
    return answers.command || argv._[0];
  });
}

promptForCommand(yargv).then((command) => {
  switch (command) {
    case 'generate':
      return generate(yargv.parsed.argv);
    default:
      throw new Error(`Unknown command ${command}`);
  }
});
