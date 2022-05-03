---
title: DevDocs Migration
tags:
  - Project
  - Documentation
---

import { ProjectSummary } from '@site/src';

<ProjectSummary
    projectName="docs/migration"
/>

The Moodle Developer documentation has been a key resource for all Moodle developers for over fifteen years. The current developer documentation has over 2,000 pages, and is written and updated using the MediaWiki platform. Documentation can be updated after logging in with standard credentials for moodle.org.

Anecdotal feedback from a range of sources, including in-person discussions, forum posts, and online discussions suggests that there are a number of limitations with the current approach, including:

- lack of version-specific information
- large quantities of stale or irrelevant information, including:
  - from legacy Moodle versions
  - outdated information
  - abandoned projects
  - docs created in the wrong place
  - docs created for private installations
- the ease with which information can be found, including both:
  - discoverability - finding relevant information using the interface; and
  - searchability - the quality of the search tools
- the ease of editing when most _developers_ are used to GitHub Formatted Markdown (GFM)
- slow interface
- lack of offline availability

## Candidate selection

As part of an internal process, several sessions were held to identify the key features required to improve the Moodle developer documentation, these included:

- offline availability
- the ability to link content to specific versions of Moodle
- the ability to easily remove legacy content
- markdown compatible
- the ability to link issues to Moodle tracker issues and hold new features from being integrated until appropriate documentation exists for them
- improved searching
- clear landing page to allow relevant information to be found quickly

Different options were assessed, including the option to introduce new features and changes to the existing Wikimedia-based documentation, and migrating to a new documentation system.

As part of the process the working group assessed several other solutions, including:

<!-- cspell:ignore yari -->
<!-- cspell:ignore mkdocs -->

- MDN's Yari tool, used to create the MDN Documentation
  - Discarded as it is heavily tied to MDN at this time
- mkdocs
  - Discarded as being too immature, in particular due to the number of very immature plugins with no support
- Sphinx both natively, and using ReadTheDocs
- Docusaurus

A number of other tools were also assessed and discarded as they were seen to be immediately unsuitable.

Several key documents were migrated to Sphinx, using both ReStructured Text, and Markdown but it was ultimately discarded as the versioning support for Sphinx is restrictive. After migrating a number of key documents we found that some documents needed to be versioned, but many do not.

Ultimately the project team selected Docusaurus as the best candidate for migration and more documents were migrated to determine whether it would be fit-for-purpose.

## New features

[Docusaurus](https://docusaurus.io) is a tool written and managed by Facebook. It is used to document a number of major projects including [React Native](https://reactnative.dev), [Algolia Docsearch](https://docsearch.algolia.com), [Jest](https://jestjs.io), [WebdriverIO](https://webdriver.io), [Redis Labs](https://developer.redis.com), [Flux](https://facebook.github.io/flux), [Gulp](https://gulpjs.com), [Home Assistant](https://developers.home-assistant.io/), and [many many more](https://docusaurus.io/showcase).

Out-of-the-box Docusaurus includes support for:

- Markdown
- Versioned documentation
- Versioned and unversioned documentation in the same repository
- Offline Progressive Web Apps to provide docs as an app, and offline
- static pages and resources
- use of standard, and custom React components

In addition, through the use of plugins it is possible to easily add further integrations, including:

- [Mermaid diagrams](https://mermaid-js.github.io/mermaid/#/)
- Integrated with the [Moodle Academy](https://moodle.academy) to allow for easier cross-linking to relevant training resources [[#60](https://github.com/moodle/devdocs/issues/60)]

As we are essentially starting from a fresh slate and migrating documents over to the new system, we have a perfect opportunity to introduce new tooling. The intention is to include, amongst others:

- [CSpell](http://cspell.org/)
- [Markdownlint](https://github.com/markdownlint/markdownlint)
- Writing style guides using [Vale](https://github.com/errata-ai/vale) [[#49](https://github.com/moodle/devdocs/issues/49)]
- Checks for links to legacy and obsolete documentation [[#61](https://github.com/moodle/devdocs/issues/61)]

By developing the documentation within a Git repository and workflow it is possible to:

- develop documentation for new Moodle features alongside the feature, and delay the issues integration until documentation is ready
- download local copies for offline viewing

By hosting that repository in GitHub we can make use of GitHub actions to enable automatic documentation of certain features, including:

- Web Service documentation
- Lists of components, plugins, contributors, and more
- Third-party libraries
- upgrade.txt files distributed around Moodle

## Migration plan

Migration from the [Legacy DevDocs](https://docs.moodle.org/dev) comes in three main parts:

- Sunrise: Initial data migration with the Legacy DevDocs being the authoritative source of information
- Maturity: The new Documentation becomes authoritative
- Sunset: The legacy documentation is removed from service

In all cases, migration is a non-trivial affair. While tooling is available to help with migration of individual documents, the process can be time-intensive as each page should be:

- assessed to determine whether it is still relevant, or marked as obsolete
- migrated to the new platform - some automated tooling is available to assist with this
- updated to remove stale, incorrect, out-of-date, or irrelevant information
- updated to meet the style of surrounding documentation

### Initial data migration

During the initial stage, the legacy wiki will remain open for changes by all contributors.

A number of key documents will be migrated to the new platform, including most documents linked from the front page of the legacy docs, that is _most_ of:

- Overview, including Mission, Roadmap, Releases, Processes, Meetings, Research, and Testing.
- Plugin development, including documentation for all plugin types
- Core APIs, including documentation for all core sub-systems
- Guidelines, including coding styles, guidelines, accessibility, tests, and other related policies
- Developer tools
- Moodle App
- Release notes

In some cases documentation may be marked as obsolete, or the migration may be deferred where it is more time-intensive.

### Maturity and growth

Once the initial phase is largely complete, banners will be added to the legacy documentation:

- to note that the site is now considered legacy
- to explain where a page has been migrated, that the page has been moved, providing a link to the new page(s)
- to explain where a page has been marked as obsolete, giving an opportunity to raise an issue to dispute this and/or provide a patch
- to encourage authors to try the new system, and migrate a document, or request that a page be marked as obsolete

During this phase the aim is that all remaining documentation is assessed to either:

- mark it as obsolete
- mark it as migrated

### Sunset

Once all of the following criteria are met, and additional time has been allowed, the legacy documentation will be removed from service:

- all documentation has migrated over or marked as obsolete
- all versions of Moodle which were covered by the legacy documentation and which are not covered by the new site have been moved _out_ of _security_ support

If possible, a static copy of this documentation will be preserved for reference, history, and posterity.

## Timeline

The initial migration of documentation is already in progress and it is hoped that this migration will be complete by the 31st May 2022.

The new documentation series only covers Moodle 4.0 onwards. The legacy documentation must remain until security support for older versions of Moodle ends. For Moodle versions 3.9, and 3.11 that is the 13th November 2023. At this time we expect to keep the legacy documentation for a 12 month period following this date.

## Contributing

We actively welcome community engagement on this project.

Development for the new documentation is entirely within the new [devdocs Github Repository](https://github.com/moodle/devdocs).

See the [contributing](/general/documentation/contributing) guide for more information.
