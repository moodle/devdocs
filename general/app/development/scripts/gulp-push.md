---
title: 'Moodle App Scripts: gulp push'
sidebar_label: 'gulp push'
tags:
 - Moodle App
 - Tools
---

The `gulp push` command automatically pushes a branch to a git remote and then updates the corresponding Moodle Tracker (Jira) issue with the diff URL or a patch file, similar to `mdk push -t`. This script was developed using [mdk](https://github.com/FMCorz/mdk) as an example. It's meant to be used for `MOBILE` issues, so it will only update the "master" fields in the tracker.

To run it, just go to the root of the project and run:

```bash
gulp push
```

By default, running `gulp push` without any parameter will push the **current branch** to the **origin** remote. Then it will guess the issue number based on the branch name and it will update the tracker issue to include the following fields:

- If it's a security issue, it will upload a patch file.
- Otherwise it will update the fields: "Pull from Repository", "Pull Master Branch", and "Pull Master Diff URL".

## Parameters

All the parameters must be passed preceded by `--`. For example:

```bash
gulp push --branch MOBILE-1234 --remote upstream --force
```

- `branch` — To specify the branch you want to push. By default: current branch.
- `remote` — To specify the remote where you want to push your branch. By default: origin.
- `force` — To force the push of changes to the git remote. By default: false.
- `patch` — To upload a patch file instead of a diff URL. If the issue you're pushing is a security issue, this setting will be forced to true. By default: false.

## Moodle Tracker data

The script needs the following data to be able to update the tracker: tracker URL, username, and password.

First the script will try to read the URL and password from the [config file](#config-file). If the file doesn't exist or it lacks any of those fields, it will check if `mdk` is installed and configured. If it is, then the script will use the same tracker URL and username as `mdk`.

If none of those conditions are fulfilled, then the script will ask the user to input the URL and username and it will store them in the config file.

We use the [`node-keytar`](https://github.com/atom/node-keytar) library to manage the password. This library uses `Keychain` on macOS, Secret Service API/`libsecret` on Linux, and Credential Vault on Windows. We use the same key as `mdk` to store and retrieve the tracker password, so if you already use `mdk` this script will automatically get the password (it will probably ask your root/admin password in the device to be able to access it).

## Config file

The script will use a file named `.moodleapp-dev-config` to store some configuration data in JSON format. You can also create or edit that file to configure the script's behaviour. These are the fields it accepts:

- `upstreamRemote` — The upstream where to push the branch if the remote param isn't supplied. By default: origin.
- `tracker.url` — URL of the tracker to update. By default: [https://tracker.moodle.org/](https://tracker.moodle.org/).
- `tracker.username` — Username to use in the tracker.
- `tracker.fieldnames.repositoryurl` — Name of the tracker field where to put the repository URL. By default: "Pull  from Repository".
- `tracker.fieldnames.branch` — Name of the tracker field where to put the branch name. By default: "Pull Master Branch".
- `tracker.fieldnames.diffurl` — Name of the tracker field where to put the diff URL. By default: "Pull Master Diff URL".
- `wording.branchRegex` — Regex to use to identify the issue number based on the branch name. By default: `(MOBILE)[-\_](\[0-9]+)`. If you want to use the script to handle issues that aren't `MOBILE` you'll need to update this field. For example, if you work on 2 projects: `(MOBILE|MYPROJECT)[-\_](\[0-9]+)`.
- `{PROJECTNAME}.repositoryUrl` — To specify the git URL where to push changes for a certain project (`{PROJECTNAME}` is the name of the project). This can be used if you work on different projects and you want to push changes to different remotes depending on the project. For example: `MOBILE.repositoryUrl: https://github.com/moodlehq/moodleapp`.
- `{PROJECTNAME}.diffUrlTemplate` — To specify the diff URL template to use for a certain project (`{PROJECTNAME}` is the name of the project). By default: `remoteUrl + '/compare/%headcommit%...%branch%'`.
