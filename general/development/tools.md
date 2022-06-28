---
title: Development tools
tags:
  - tools
  - coding style
  - workflow
---

A range of tools are available to make your life as a Moodle developer easier, and your development faster. These range from editor and IDE integrations, to linting tools which helps your code meet Moodle's [Coding style](./policies/codingstyle/index.md), to build tools essential to the build process.

These tools are discussed and summarised here.

## PHP

Moodle's primary development language is PHP, and all code should pass basic PHP linting checks as a minimum, however all new PHP code must also meet the Moodle [Coding style rules](./policies/codingstyle/index.md). To make this task easier tools such as the [PHPCodeSniffer](./tools/phpcs.md) are available.

## JavaScript and CSS

Moodle's JavaScript development relies upon a set of build tools written in JavaScript, and controlled using a task runner called `grunt`. In addition to building JavaScript files, grunt also controls building of theme CSS from SCSS, and stylistic linting checks of CSS.

See the [NodeJS and Grunt](./tools/nodejs.md) for more information on these build tools.

## Development workflow

Along with language-specific tools, several tools have been created to make your day-to-date life as a developer easier. Perhaps the most widely used of these amongst those regularly contributing to the core Moodle project is the [Moodle Development Kit](./tools/mdk.md), or MDK as it is typically known.
