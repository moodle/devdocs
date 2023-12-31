---
title: Master to main
sidebar_position: 7
tags:
  - FAQ
  - Developers
  - Getting started
  - Main branch
---

This page tries to, briefly, show all the changes required to rename any branch from `master` to `main` in general. Aimed for the Moodle Community, to facilitate the transitions of all their awesome patches, plugins and integration, although, generic enough for anybody needing to rename any branch.

### Moving from `master` to `main` for canonical/origin github based repositories

Note that these steps are valid for all the repositories @ GitHub. That includes both the "canonical/origin/upstream" ones and, also, all the clones of them that any developer/contributor may have.

1. Go to your repo, click on "Settings"
2. In the "General" settings page, near "Default branch" click on the pencil icon.
3. Rename `master` to `main` (all associated pull requests will be migrated, also any protection rules and other bits. See https://github.com/github/renaming for more information.
4. Time to hack (see the section)

### Moving from `master` to `main` for other canonical/origin (gitlab, bitbucket, sourceforge, ...) repositories

1. Check if the repo supports renaming branches (similar to GitHub) or no. And verify if the utility allows the old `master` to continue working and if associated pull/merge requests and other settings are automatically moved or no.
2. If the rename utility exists and suits your needs, use it (and skip next point).
3. In general, if there isn't any rename tool, the way to proceed manually is to:
    1. Fetch all changes from remote and ensure that `master` is up to date.

        ```
        git fetch --all --prune && git fetch origin master:master
        ```

    2. Create locally the `main` branch from `master`.

        ```
        git branch main master
        ```

    3. Push the new branch upstream.

        ```
        git push origin main
        ```

    4. In the canonical repo, configure everything to point to the new `main` branch (rules, default branch...). Don't forget to analyse what happens with ongoing pull/merge requests that may be pointing to `master`.
    5. Once 100% sure that `main` is ok, remove the, now old, `master` branch.

        ```
        git push origin :master
        ```

    6. It's recommended to create a new issue in the repository ([link to example](https://github.com/moodlehq/moodle-local_codechecker/issues/225)), explaining the move from `master` to `main`, so everybody that is subscribed or involved gets notified. Feel free to point to this document for details.
4. [Time to hack](#time-to-hack) (see the section).

### Time to hack

Let's move any `master` occurrence/dependency in the codebase to `main` ([link to example](https://github.com/moodlehq/moodle-local_codechecker/commit/a67caf8054451a6f5f69c53b1ce268eddd255aaa)).

1. For sure that includes any Travis/GHA... CI integrations. And any other external tool (`codecov`, `packagist`...) that is being used.
2. If your codebase has any other hard-coded `master` dependency (not the best idea, but) ... it will need to be analysed and fixed too.
3. Apply changes (push, PR/MR, whatever...) ASAP.

### Moving from `master` to `main` in your local clones

1. Fetch all changes from remote (that has been just renamed upstream).

   ```
   git fetch --all --prune
   ```

2. Rename the local branch from `master` to `main`.

   ```
   git branch -m master main
   ```

3. Point the local `main` branch to the remote `main` one (assuming that the canonical remote is named `origin` in your clone).

   ```
   git branch -u origin/main main
   ```

4. Adjust your local current HEAD, that still is pointing to the, now gone, `master` branch.

   ```
   git remote set-head origin -a
   ```

5. Verify that your local clone looks ok (so you can check your actual local branches and which remote/branch they are tracking now).

   ```
   git branch -vvv
   ```
