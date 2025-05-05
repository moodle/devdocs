---
title: Managing Moodle version documentation
sidebar_label: Moodle versions
tags:
  - documentation
  - forking
  - versions
---

We generate version-specific documentation and maintain this for each supported version of Moodle.

When a new version of Moodle is released, the documentation is 'forked'.

When a version of Moodle goes out of support, its developer documentation is archived.

Further information about this functionality is available in the [Docusaurus documentation on the topic](https://docusaurus.io/docs/versioning).

## Creating a new version of the docs

Typically this task is performed by the Integration team using the following steps:

1. Ensure that all pending appropriate merge requests have been merged
1. Ensure that your local branch is up-to-date
1. Run the docusaurus version command:

    ```bash
    yarn docusaurus docs:version [version]
    ```

1. Commit the initial changes ([Example from Moodle 4.4](https://github.com/moodle/devdocs/commit/e9e7fa0074753487c315d2f91ad64a8503f32054))
1. Update non-automated version mentions:
    1. Open `versioned_docs/version-[version]/intro.md` in your editor
        1. Uncomment and update the link to the release notes for this version
    1. Open `docs/devupdate.md` in your editor
        1. Clear the content of this file and update the version numbers
    1. Open `docs/intro.md` in your editor
        1. Update the occurrences of the version number for the recent release with the version number for the next major version of Moodle
    1. Open `nextVersion.js` in your editor
        1. Update the values for `nextVersion` (and `nextLTSVersion` after the release of an LTS version)
    1. Open `general/releases/[version].md`
        1. Update links to the release notes in User Docs to point to the actual version
    1. Open `/static/_redirects`
        1. Update the `nextVersion` redirect
1. Commit these changes ([Example from Moodle 4.4](https://github.com/moodle/devdocs/commit/aeb6385209caed38d757d53bc47f9bd66fdcfa0c))
1. Create a pull request ([Example from Moodle 4.4](https://github.com/moodle/devdocs/pull/1006))

## Archiving a version of the docs

The archival of a set of documentation usually happens immediately after the forking of documentation for the latest version.

1. After the Pull Request for this new version has been accepted, navigate to the Deploy Logs, and locate its "Permalink".
1. Remove the entire folder from `versioned_docs` and `versioned_sidebars`:

    ```bash
    rm -rf versioned_docs/version-4.3 versioned_sidebars/version-4.3-*
    ```

1. Commit the changes
1. Update any remaining references to the version:
    1. Open the `versionsArchived.json` file and add the full link to the Netlify build.
    1. Open the `versions.json` file and remove the version from the list
    1. Search for any remaining occurrences as a path, for example:

        ```bash
        ag '/4\.3/'
        ```

1. Commit these changes
1. Create a pull request
