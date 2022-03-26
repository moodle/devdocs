---
title: NodeJS
---
(tools-nodejs)=

Moodle development tools require the installation and use of [NodeJS](https://nodejs.org/en/), which is a JavaScript runtime environment available for most operating systems.

```{include} ../_templates/node_version.md
```

Use of [NVM](tool-nodejs-nvm) for installation of NodeJS is highly recommended over direct installation.

(tool-nodejs-nvm)=

## Node Version Manager

[NVM](https://github.com/nvm-sh/nvm) is the Node Version Manager. Its purpose is to simplify the installation, and use different versions of NodeJS.

Moodle includes a `.nvmrc` which `nvm` can use to select the correct version of NodeJS.

To use the correct version of NodeJS for the current version of Moodle, you can use the `nvm install` and `nvm use` commands:

```bash
$ nvm install
Found '/Users/nicols/Sites/public_html/sm/.nvmrc' with version <lts/gallium>
v16.14.0 is already installed.
Now using node v16.14.0 (npm v8.3.1)
```

## Grunt

As part of it's build stack, Moodle uses the [Grunt](https://gruntjs.com) task runner.

Grunt is composed of a set of tasks, defined within the Moodle code repository in the `Gruntfile.js` file, and a grunt CLI tool which must also be installed.

To install the grunt CLI tool you can install it globally using npm:

```bash
$ npm install -g grunt-cli
$ grunt stylelint
```

You can also use the `npx` command to install it on demand:

```bash
$ npx grunt stylelint
```
