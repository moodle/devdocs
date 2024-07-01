---
title: Structure
description: Information on the structure of the documentation repository
tags:
  - contributing
  - documentation
sidebar_position: 4
---

Moodle's Developer Resource system is built using [Docusaurus](https://docusaurus.io). Docusaurus is a static page generator aimed at technical documentation and maintained by Facebook. It is written in JavaScript, and uses React.

## General structure

The documentation is broken down into two key areas:

- Versioned documentation used for version-specific items such as API guides; and
- General documentation covering a wide range of versions.

:::tip

Sometimes it isn't immediately clear which of the two areas you should use - unless you are writing an API guide then your documentation probably belongs in the unversioned area.

:::

### Unversioned documentation

The unversioned documentation can be found in the [general](https://github.com/moodle/devdocs/tree/main/general) folder and is further broken down into several categories:

- [Community information](https://github.com/moodle/devdocs/tree/main/general/community) such as our roadmap, mission statement, support channel information, developer meeting information and more
- [Credits](https://github.com/moodle/devdocs/tree/main/general/credits), including lists of contributors to the developer and user documentation, a list of the third-party libraries we use, and similar credits
- [Release notes](https://github.com/moodle/devdocs/tree/main/general/releases) for all versions of Moodle
- [Release notes for the Mobile app](https://github.com/moodle/devdocs/tree/main/general/app_releases)
- [Project](https://github.com/moodle/devdocs/tree/main/general/projects) documentation, plans, and similar items
- Information about [this documentation](https://github.com/moodle/devdocs/tree/main/general/documentation)
- General information relating to [development of Moodle](https://github.com/moodle/devdocs/tree/main/general/developmenet) which is further broken down into:
  - [Policy information](https://github.com/moodle/devdocs/tree/main/general/development/policies) such as coding style guides
  - Information on our [development processes](https://github.com/moodle/devdocs/tree/main/general/development/process)
  - Summary documentation for [development tools](https://github.com/moodle/devdocs/tree/main/general/development/tools)
  - Useful information about the [Moodle Tracker](https://github.com/moodle/devdocs/tree/main/general/development/tracker)

If you are creating a page which does not fit into one of these categories, we suggest you jump into the [Developer documentation chat](../community/channels.md#developer-documentation-chat) and asking there; or [creating a new issue](https://github.com/moodle/devdocs/issues/new) in the GitHub repository to discuss the best location.

### Versioned documentation

The versioned documentation has two locations you will need to look at:

- For the Moodle main branch, see the [docs](https://github.com/moodle/devdocs/tree/main/docs) folder
- For older versions of Moodle which are documented here, see the [versioned_docs](https://github.com/moodle/devdocs/tree/main/versioned_docs) folder

:::note

The versioned documentation has not yet been created and will happen soon.

:::

Examples of the content documented in the versioned documentation includes:

- Language and feature guides correct for the relevant version of Moodle, for example:
  - our [JavaScript guides](https://github.com/moodle/devdocs/tree/main/docs/guides/javascript); and
  - our [Mustache template guide](https://github.com/moodle/devdocs/tree/main/docs/guides/templates).
- API guides for:
  - the [Moodle core subsystems](https://github.com/moodle/devdocs/tree/main/docs/apis/subsystems);
  - the [Plugin types](https://github.com/moodle/devdocs/tree/main/docs/apis/plugintypes) shipped with Moodle core; and
  - [Common files](https://github.com/moodle/devdocs/tree/main/docs/apis/subsystems) that are used in Plugins.
- Key [upgrade notes](https://github.com/moodle/devdocs/tree/main/docs/devupdate.md) for developers.

:::note

The Moodle App developer documentation is currently in the `docs` location but will be moved in the near future.

:::

## Other key files and folders

A number of other files are also used to form the documentation, some of these are described below.

### Sidebar configuration

All pages _should_ include contextually relevant navigation in the form of a _sidebar_. The content of these sidebars is controlled from the [sidebar configuration](https://github.com/moodle/devdocs/tree/main/sidebars) with configuration for:

- [the unversioned documentation](https://github.com/moodle/devdocs/tree/main/sidebars/general.js)
- [the versioned documentation](https://github.com/moodle/devdocs/tree/main/sidebars/docs.js)

Additional sidebar configuration for older versions of Moodle will also be created in future.

Documentation for the sidebars feature can be found on the [Docusaurus site](https://docusaurus.io/docs/next/sidebar).

### Data

Rather than storing machine-readable data within the documentation, we store some key information in the [data](https://github.com/moodle/devdocs/tree/main/data) folder. This includes:

- a list of [migrated pages](https://github.com/moodle/devdocs/tree/main/data/migratedPages.yml)
- a list of [Moodle components](https://github.com/moodle/devdocs/tree/main/data/component-spelling.txt) used by the spell checker
- a list of [Moodle contributors](https://github.com/moodle/devdocs/tree/main/data/moodle-contributors.txt) used by the spell checker
- [Project metadata](https://github.com/moodle/devdocs/tree/main/data/projects.json) used to generate project summary data, and sidebar information
- Information about [Moodle versions](https://github.com/moodle/devdocs/tree/main/data/versions.json) used to generate the Release notes pages

### Static content

Docusaurus generates most of the content, converting markdown files, JavaScript, TypeScript, and React component into static files. Sometimes it is still necessary to include static content too.

The [`static`](https://github.com/moodle/devdocs/tree/main/static) folder contains all of the static resources into the build, including:

- images
- fonts
- a [manifest.json](https://github.com/moodle/devdocs/tree/main/static/manifest.json) file used for the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- a set of [JSON Schemas](https://github.com/moodle/devdocs/tree/main/schema) used to formally describe some of the [data](#data) files

## See also

- [Contributing](./contributing.md)
