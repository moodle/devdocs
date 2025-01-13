---
title: NodeJS
sidebar_label: NodeJS versions
description: Information about how NodeJS supported versions correlate with Moodle releases and the policy controlling it.
tags:
  - Requirements
  - Support
  - Releases
  - NodeJS
---

New LTS NodeJS versions are [released every 12 months](https://github.com/nodejs/release#release-schedule) and supported for three years. Moodle tries to ensure a compromise between support and churn by ensuring that the version of NodeJS in use is supported at all times.

## Policy statement

### NodeJS

<Since versions={["3.1"]} issueNumber="MDL-63346" />

1. This policy will be applied to _all_ supported branches, including stable and security-only releases.
1. This policy does not require that any tool be updated, unless strictly needed by nodejs/npm or its own dependencies/changes
1. It won't include npm audit changes either. Those are handled separately.
1. Normally, only changes to `.nvmrc` and `package.json` will happen.
1. Changes to project dependencies should be handled in a separate issue.

### Project Dependencies

<Since versions={["5.0"]} issueNumber="IDEA-168" />

  1. To avoid impact to the community, dependency updates which impact built output should be kept to a minimum.
  1. Dependency updates should be backported to the first Major release in a Series, for example Moodle 5.0.

## Upgrade guidelines

### NodeJS

To update the NodeJS version required, the following approach is typically recommended:

1. Update the `.nvmrc` file to reflect the `lts/[name]` of the new LTS version
1. Update the `package.json` to set the `engines` for the new restiction in the format: `>= [new version] < [next version]`, for example:

    ```json
    "engines": {
       "node": ">=20.11.0 <21"
    }
    ```

1. Install the new NodeJS version:

    ```sh
    nvm install && nvm use
    ```

1. Update the NodeJS dependencies with the new version of NodeJS:

    ```sh
    rm -rf node_modules
    npm install
    ```

1. Verify the update:

    ```sh
    npx grunt
    npx grunt jsdoc
    ```

In most situations there will be no issues here and changes can be committed and backported to all stable and security-supported branches.

#### Troubleshooting

Where a project dependency is no longer supported due to the new version of NodeJS, it may be necessary to upgrade the dependency.

### Project dependencies

The following tooling may be useful for the purposes of updating the project dependencies:

- `npm outdated`
- `npm audit`
