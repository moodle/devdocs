---
title: Contributing
description: Information on how to contribute to this documentation
tags:
  - contributing
  - documentation
  - guide
---

The [Moodle](https://moodle.org) Developer Resources is the (un)official source for all Moodle documentation. It's here to make your life as a Moodle Developer easier. To serve that purpose it has to be up-to-date, and as accurate and complete as possible. Every contribution is important in achieving that goal and we hope that you are able to be a part of that mission.

If you are new to Open Source contributions, or you are interested in learning how to run or contribute to an open source project, then these resources from the [Open Source Guides](https://opensource.guide/) website may give you some help and insight into common practices. It has a collection of resources for individuals, communities, and companies who are interested in open source contributions. The following guides may be especially useful to you:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Building Welcoming Communities](https://opensource.guide/building-community/)

## Code of Conduct

Moodle is in the process of updating and modernising its [Code of Conduct](./code-of-conduct.md). If you would like to be a part of this process, please see the [GitHub issue](https://github.com/moodle/devdocs/issues/47) and give us your thoughts.

## Get Involved

Anyone can get involved with, and add to, these resources - you don't have to be a developer or documentation aficionado. Here are a few ideas to get started:

- Look at our list of [good first issues](https://github.com/moodle/devdocs/labels/good%20first%20issue)
- Fix typos and grammatical errors
- Document new Moodle features
- Mark a deprecated feature as deprecated
- Raise issues in GitHub for [features which need to be documented](https://github.com/moodle/devdocs/issues/new?assignees=&labels=documentation%2C+help+wanted%2C+enhancement&template=documentation-request.yml&title=%5Bdocs%5D+Create+documentation+for+%5BFeature%5D)
- [Triage existing issues](#triaging-issues-and-pull-requests)

If you need help, please reach out to us and we will do our best to advise you.

### Triaging Issues and Pull Requests

One of the many ways that you can contribute is to help triage the [list of pending issues](https://github.com/moodle/devdocs/issues?q=is%3Aissue+is%3Aopen+label%3Aneeds-triage).

When doing so you should may want to:

- Ask for more information if you believe the issue does not provide all the details required to solve it.
- Suggest [labels](https://github.com/moodle/devdocs/labels) to can help categorise issues.
- Flag issues that are stale or that should be closed.
- Review code.

## Our Development Process

While our development of Moodle is managed in the [Moodle Tracker](https://tracker.moodle.org/), all development of these Developer Resources takes place in this [GitHub repository](https://github.com/moodle/devdocs). All work takes place in public, in this repository.

We make use of GitHub actions for our continuous integration and have a range of unit tests, end-to-end tests, style and lint tests, and build tests.

## Issues

When [creating a new issue](https://github.com/moodle/devdocs/issues/new/choose), always make sure to fill out the issue template.

### Bugs

We use [GitHub Issues](https://github.com/moodle/devdocs/issues) for our documentation bugs. If you would like to report a problem, take a look around and see if someone already opened an issue about it. If you are certain this is a new, unreported bug, you can submit a [bug report](https://github.com/moodle/devdocs/issues/new?template=documentation-bug.yml).

Please provide as much information as possible and, if you are able to, provide screenshots. Fixes are always welcomed.

### Documentation requests

If you would like to request documentation for new features, or the migration of documentation from the [legacy devdocs](https://docs.moodle.org/dev) you can use the appropriate issue templates.

- [Request to migrate legacy documentation](https://github.com/moodle/devdocs/issues/new?template=documentation-migration-request.yml)
- [Request to create new documentation](https://github.com/moodle/devdocs/issues/new?template=documentation-request.yml)

For migrated documentation, if you can provide updated code examples, then this will make it easier to prioritise your issue.

### Contributing

We welcome contributions to these developer resources. If you've not contributed before and would like to do so, then you may like to look at our list of [good first issues](https://github.com/moodle/devdocs/labels/good%20first%20issue) to get you started.

If you have domain-specific knowledge in an area which has outstanding documentation then the [`help wanted`](https://github.com/moodle/devdocs/labels/help%20wanted) search may give you some inspiration.

## Development

Our documentation is built using [Docusaurus](https://docusarus.io), a powerful open source documentation project written in JavaScript.

It's easy to get your development environment set up using [Yarn](https://yarnpkg.com/), and we we recommend that you use [NVM](https://github.com/nvm-sh/nvm) for your NodeJS version management. You can check our [.nvmrc](https://github.com/moodle/devdocs/blob/main/.nvmrc) for the best version of NodeJS to use.

We also have a [Gitpod](#Quick-start-with-Gitpod) configuration if you want to jump straight in and have a go

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

### Installation

To install a local development environment:

1. Ensure you have:
   1. [NVM](https://github.com/nvm-sh/nvm)
   1. The most appropriate version of NodeJS by running `nvm install`
   1. [Yarn](https://yarnpkg.com/)
1. After cloning the repository, run `yarn install` in the root of the repository. This will install all dependencies as well as build all local packages.
1. To start a development server, run `yarn start`.

### Style guidelines

A set of writing and coding style guidelines for this documentation will be documented in more detail in the [style guides](./style-guides.md).

## Pull Requests

All pull requests should be opened against the `main` branch, and pushed to your own GitHub fork of the repository.

When you open your pull request we will automatically run a number of continuous integration jobs against your branch to check for errors and you'll be notified if any of these fail. We recommend looking out for any failures and fixing them as soon as you can.

The project maintainers will review your code and may provide feedback before it's merged into the project.

### Commit Messages

Every commit tells a story, and the commit message is the key narration of that story. It can be extremely useful to have a bit more information about your changes so try to provide any extra information that might be useful. For example:

- If you remove some old documentation, or part of a file, it may be useful to explain why it is no longer necessary.
- When you add a new documentation for a new feature, it may be useful to include the Moodle Tracker issue in your commit message to tie everything together.
- When noting the deprecation of a Moodle feature, it may be useful to include a link to the Moodle Tracker issue.

The first line of your commit should meet the following format:

```
[<type>] <area>: <subject>
```

We currently use the following types:

- `repo` - For anything related to the repository, or documentation system
- `docs` - For changes to the developer resource documentation itself

The `<area>` tag is primarily used for `docs` changes to describe the section of documentation you have made changes to.

### Versioned Docs

Some of this documentation related to a specific version of Moodle:

- `general` - This section is not documented at all
- `docs` - Relates to the current Moodle development branch, known as `master`
- `versioned_docs/version-X.Y` - Related to a specific major version of Moodle

If you are documenting a feature which should be documented across older versions, we request that you backport it to the relevant stable versions.

### Licensing

By contributing to the Moodle Developer Resources, you agree that your contributions will be licensed under the GPLv3 license.

The following header should be present in all non-documentation code files:

```js
/**
 * Copyright (c) Moodle Pty Ltd.
 *
 * Moodle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Moodle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
 */
```
