---
title: Installation
description: Information on how to install dependencies to start your development
tags:
  - contributing
  - documentation
  - guide
  - installation
  - getting started
  - quick start
sidebar_position: 3
---

Our documentation is built using [Docusaurus](https://docusaurus.io), a powerful open source documentation project written in JavaScript.

It's easy to get your development environment set up and if you plan to contribute regularly to our documentation, then we recommend you setup a [local development environment](#local-development) for the best results. If you're only planning to contribute as a once-off then you may want to consider trying [Gitpod](#quick-start-with-gitpod).

## Installation

### Local development

To set up a local development environment we recommend install [NVM](https://github.com/nvm-sh/nvm), and then running:

```console
nvm install
corepack enable
yarn
```

:::note

From time to time you may need to repeat this process as we update the NodeJS version requirements or add dependencies.

:::

### Quick start with Gitpod

Gitpod is a free, cloud-based, development environment providing VS Code and a suitable development environment right in your browser.

By [launching your workspace](https://gitpod.io/#https://github.com/moodle/devdocs) you can automatically:

- clone our devdocs repo
- install all dependencies
- run `yarn start`

You can write and preview your contributions from right within your browser, and
even commit them and create a pull request.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/moodle/devdocs)

GitHub has also launched their own lightweight online editor which integrates tightly with GitHub. Take a look at [github.dev](https://github.dev/moodle/devdocs).

:::info

Gitpod is an alternative to local development and completely optional. We recommend [setting up a local development environment](#installation) if you plan to contribute regularly.

:::

## Useful commands

### Starting the development server

The development server is the best way to edit docs locally. Once the development server has started, the docs will open in your browser. You can then make changes to the source markdown files (`*.md` and `*.mdx`), which should be automatically live reloaded in your browser.

```console
yarn start
```

### Building the docs and serving them locally

This is probably only something you would do if you were developing or testing the build process.

```console
yarn build
yarn serve
```

### Migrating a document

For full documentation on document migration see the [notes on contributing](./contributing.md#migrating-legacy-docs)

```console
yarn migrate [https://docs.moodle.org/dev/Old_doc_location] [newLocation]
```

### Linting documents

```console
yarn mdlint-all
```
