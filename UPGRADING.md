# Upgrading Docusaurus

The Moodle Developer resources is generated using an Open Source project, [Docusaurus](https://docusaurus.io/).

Docusaurus periodically releases new versions which are announced on their website, and in the console when starting the Docusaurus development server.

When new versions are released, we aim to update as soon as possible.

## Process

Prior to upgrading you should check the release notes for any potential issues. The full [changelog](https://docusaurus.io/changelog) links to the release notes for each version of Docusaurus.

When starting the Docusaurus server, Yarn will provide instructions if there is a new version, for example:

```
╭──────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                      │
│                    Update available 2.0.0-beta.18 → 2.0.0-beta.21                    │
│                                                                                      │
│      To upgrade Docusaurus packages with the latest version, run the following       │
│                                      command:                                        │
│         `yarn upgrade @docusaurus/core@latest @docusaurus/plugin-pwa@latest          │
│      @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest`       │
│                                                                                      │
╰──────────────────────────────────────────────────────────────────────────────────────╯
```

To upgrade the software, the provided command should be run:

```
yarn upgrade @docusaurus/core@latest @docusaurus/plugin-pwa@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest
```

After running the `yarn upgrade` you should check for any issues (especially those highlighted in the releases notes).

Finally, you should run a `yarn clear && yarn build` to completely rebuild the documentation and check for errors.

You should also look out specifically for infrastructure changes, such as a bump
in the required NodeJS version (found in `.nvmrc` and `netlify.toml` files).
