# snippets-table

![npm](https://img.shields.io/npm/v/snippets-table)

## Overview

Tool to easily manage a table of snippets on a README file.

## Installation

Install the package:

`npm i --dev snippets-table` or `yarn add -D snippets-table`

## Usage

- Run it with `npx`:

  - `npx snippets-table generate`

- Or add the following lines to the README where the table of snippets should be created...

  ```markdown
  <!-- SNIPPETS-TABLE:START - Do not remove or modify this line -->

  <!-- SNIPPETS-TABLE:END -->
  ```

- And run the command:
  `npm run snippets-table generate` or `yarn snippets-table generate`

## Example

Check the [`example`](./example) folder for more details.

After using this library, a table like below will be created:

| Prefix     | Name            | Description         |
| ---------- | --------------- | ------------------- |
| `abc`      | Sing ABC        | Song by Jackson 5   |
| `help`     | Sing Help       | Song by The Beatles |
| `takeOnMe` | Sing Take on Me | Song by a-ha        |

## Configuration

| Name             | Default                         |
| ---------------- | ------------------------------- |
| `pathToREADME`   | README.md                       |
| `pathToSnippets` | snippets/snippets.json          |
| `headers`        | ["Prefix","Name","Description"] |

Run `snippets-table --help` for more.

## License

MIT © [Arthur Denner](https://github.com/arthurdenner/)
