# Moodle Developer Resoruces

<p align="center">
  <!--<a href="CONTRIBUTING.md#pull-requests"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>-->
  <!--<a href="#license"><img src="https://img.shields.io/github/license/sourcerer-io/hall-of-fame.svg?colorB=ff0000"></a>-->
  <a href="https://gitpod.io/#https://github.com/moodle/devdocs"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"/></a>
  <a href="https://meercode.io/moodle/devdocs"><img src="https://meercode.io/badge/moodle/devdocs?type=ci-score" alt="CI Score"></a>
  <a href="https://github.com/moodle/devdocs/actions/workflows/markdown-lint.yml"><img src="https://github.com/moodle/devdocs/actions/workflows/markdown-lint.yml/badge.svg" alt="Lint status"></a>
  <a href="https://github.com/moodle/devdocs/actions/workflows/pages/pages-build-deployment"><img src="https://github.com/moodle/devdocs/actions/workflows/pages/pages-build-deployment/badge.svg" alt="Build status"></a>
  <a href="https://github.com/moodle/devdocs/actions/workflows/deploy.yml"><img src="https://github.com/moodle/devdocs/actions/workflows/deploy.yml/badge.svg" alt="Build status"></a>
</p>

## Introduction

This repository includes the source for the Moodle Developer Resources - a
collection of resources aimed at making your life as a Moodle Developer easier.

## Contributing

These resources are written by developers, for developers. We value your input
and your help in adding to them.

There are many ways that you can help, from reporting inaccuracies, and missing
documentation, to making small corrections and, of course, creating new
resources for others to make use of.

If you plan to contribute, then you may wish to setup a local development
environment to make it easier to do so.

## Local development environment

The Moodle Developer Resources are compiled using the
[Docusaurus](https://docusauris.io) tooling, which can be easily installed with
[Yarn](https://yarnpkg.com/getting-started/install).

Once installed, you should invoke yarn:

```
$ yarn
```

This will install all of the dependencies needed to run the development server.

Finally you can start the server with:

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

There are some other commands that you may find useful:

### Linting your content

One of the many powerful features of Markdown is its ability to be
programmatically checked for a range of bugs and stylistic errors.

Every time a commit is pushed to source repository it is passed through several
linting tools which it must pass before it can be merged.

You can lint your code before pushing it using yarn:

```
yarn lint
```

This will run the `markdownlint` CLI tool across all of the documentation
directories and report any issues it comes across.

Some examples of these issues include:

- header levels which do not increase incrementally
- multiple level 1 headers (`h1`)
- use of hard tabs instead of spaces
- the presence of trailing spaces at the end of a line

These are usually easy to solve and, in many cases, can be fixed automatically.

### Building your content

During development you will almost certainly want to use the yarn development
server, however you will sometimes need to build the content to use certain
features.

This is easily achieved with yarn:

```
yarn build
```

This command will compile all of the documentation into static HTML files
complete with all appropriate resources.

As part of this build, the validity of all internal links will be checked. For
this reason we strongly recommend building the content locally before submitting
a pull request as broken internal links will lead to a build failure
immediately.

You may also need to configure the build to view it locally. This can be
achieved using a `.env` file in the project root.
For more information on the format of the `.env` file, see the documentation in
the `.env.default` file.
