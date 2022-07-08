---
title: Linting and other checks
tags:
  - linting
  - contributing
  - documentation
sidebar_position: 5
---

In order to keep the quality of the documentation as high as possible, we perform a range of linting and spelling checks. These include:

- spelling checks using [CSpell](https://cspell.org/)
- markdown validity checks using [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
- JavaScript and TypeScript coding style using [eslint](https://eslint.org/)

Helper scripts are included to make this easier and, where possible, to automatically fix issues.

We also attempt to perform these as pre-commit checks which prevent your from commit invalid changes.

## Spelling

All documentation is checked using [CSpell](https://cspell.org) against the en-GB dictionary.

A number of additional dictionaries are also included:

- [Moodle contributors](#contributors)
- [Moodle component and plugin types](#component-and-plugin-types)
- [Plugin names](#plugin-names)
- [Project words](#project-words)

Where you encounter such a spelling and need it to be ignored, you should either:

- ignore the spelling within the current file; or
- add it as a valid spelling across the entire repository.

To ignore a spelling error within a single file, you can use an HTML comment:

```html title="Ignoring a single word"
<!-- cspell:ignore yourword -->
```

You can ignore multiple words in the same comment by separating them with a comma, for example:

```html title="Ignoring multiple words"
<!-- cspell:ignore yourword,goeshere -->
```

If the word you are using is a word which will be frequently used across the project, then you should add it to the relevant [spelling list](#spelling-lists).

### Spelling lists

#### Contributors

A list of [Moodle Contributors](https://github.com/moodle/devdocs/blob/main/data/moodle-contributors.txt) is compiled from the Moodle git repository. This allows you use the name of any contributor in the documentation without any errors being generated.

:::danger

This list is automatically updated once per week, after the [weekly release](../development/process/integration/index.md#in-normal-periods).

This list **should not** be updated manually.

:::

#### Component and plugin types

A list of all [Moodle Component types and plugin types](https://github.com/moodle/devdocs/blob/main/data/components-spelling.txt) is compiled from the Moodle git repository.

:::danger

This list is automatically updated once per week, after the [weekly release](../development/process/integration/index.md#in-normal-periods).

This list **should not** be updated manually.

:::

:::note

This list does not currently include the complete list of plugins. If you need to mention a plugin whose name is not a valid spelling, you will currently need to manually add this to the [plugin names](#plugin-names) list.

This will be included at a later date. See [#282](https://github.com/moodle/devdocs/issues/282) for more information.

:::

#### Plugin names

Plugin names are currently _not_ generated automatically (but will be in the future). As a result, if you need to specify a plugin which does not have a valid spelling then it should be added to the [manually-controlled list of spellings](https://github.com/moodle/devdocs/blob/main/data/plugin-names.txt).

:::note

Moodle core plugins will be automatically generated in future. See [#282](https://github.com/moodle/devdocs/issues/282).

This file will be kept for third-party plugins.

:::

#### Project words

In many situations we use words which are not 'real' words. This could be because they are concatenations of words, abbreviations, Moodle-isms, people's names, the names of organisations, or a host of other reasons.

For any words which does not fit into the above categories, you can place it into the [project-words.txt](https://github.com/moodle/devdocs/blob/main/project-words.txt) file.

## Markdown Checks

We make use of [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) to run a number of style and validation checks on all files with both the `.md` and `.mdx` file extensions.

These checks cover both standard rules, and several [custom rules](https://github.com/moodle/devdocs/tree/main/.markdownlint) with examples including:

- header levels which do not increase incrementally
- multiple level 1 headers (`h1`)
- use of hard tabs instead of spaces
- the presence of trailing spaces at the end of a line
- spaces around some markdown objects
- [conversion of directional quotation marks](https://github.com/moodle/devdocs/tree/main/.markdownlint/no-directional-quotation-marks.js)
- [checking for links to pages marked as obsolete in the legacy documentation](https://github.com/moodle/devdocs/tree/main/.markdownlint/find-obsolete-links.js)
- [checking and fixing of links to pages marked as migrated in the legacy documentation](https://github.com/moodle/devdocs/tree/main/.markdownlint/fix-migrated-links.js)
- [checking and fixing of links to pages which have been moved internally](https://github.com/moodle/devdocs/tree/main/.markdownlint/fix-renamed-links.js)
- [checking and fixing of several common trademarks](https://github.com/moodle/devdocs/tree/main/.markdownlint/cased-words.js)

Whenever you make changes to the documentation, we strongly recommend running yarn fix to check that all markdown files meet our standards, fix any issues (including updating links to migrated pages), and are free from spelling mistakes.

```console
yarn fix
```

This command will:

- Run our standard linting rules against all markdown and mdx files
- Automatically fix any warnings which can be automatically fixed
- Report any warnings which could not be fixed

This command should be extremely fast to run, but you may also wish to check just one file. You can do using the `yarn mdlint [path/to/file]` command, for example:

```console title="Lint just the general/documentation/linting.md file"
yarn lint general/documentation/linting.md
```

### Ignoring lint issues

Although it should rarely happen, you will occasinoally need to ignore markdownlint failures instead of fixing them.

See the [markdownlint documentation](https://github.com/DavidAnson/markdownlint#configuration) for examples of the different syntax available to do this.

## Broken link checks

When we build the documentation using Docusaurus, the build system checks for any broken internal links.

```console
yarn build
```

:::info

This test is slightly slower to run, and we recommend that you run it as the final check before you push.

:::
