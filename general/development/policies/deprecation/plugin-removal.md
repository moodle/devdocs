---
title: Plugin Removal
tags:
  - Processes
  - Core development
  - Deprecation
  - Plugins
  - Removal
---

We regularly assess the standard plugins that are included in Moodle and will, from time-to-time, remove some of these.

When this happens we will announce to the community that this will be happening.

Typically plugin removal will be announced in the following places:

- The relevant forums on [moodle.org](https://moodle.org)
- Within the Moodle Tracker
- In the [Integration Exposed Posts](https://moodle.org/mod/forum/view.php?id=7966)
- One or more of the Moodle Matrix groups, possibly including:
  - [Moodle in English](https://matrix.to/#/#moodle-english:moodle.com)
  - [Moodle Developer Chat](https://matrix.to/#/#moodledev:moodle.com)
  - [Large scale installations](https://matrix.to/#/#bigmoodle:moodle.com)

:::warning Info

We will endeavour to make announcements as early as possible and to give appropriate time to update workflows, and dependencies, however this cannot be guaranteed in all situations.

:::

## Why plugins are removed from Moodle LMS

A plugin may be considered for removal from Moodle LMS for a range of reasons, including:

- we no longer feel that it is relevant to the community;
- it is no longer possible to maintain for some reason (for example it uses unsupported libraries); and
- it contains integrations which are no longer active.

## What happens when the plugin is removed

In most cases a plugin is removed because it is either no longer possible to support it, or because we do not believe it is widely used.

Typically the following takes places:

- the code for the plugin is extracted from Moodle LMS and placed into its own Git repository, usually under the https://github.com/moodlehq namespace;
- the GitHub repository is marked as archived; and
- the plugin is not placed into the Plugins Database.

## Why is the plugin not placed into the Plugins database?

If the plugin is no longer suited to Moodle LMS, in most cases it is unlikely to be useful in the plugins database either.

Where there are cases where the community feels that it should be moved to the plugins database instead, then we look for volunteers from the community to take over the maintenance of the plugin.

:::warning Plugins without a maintainer

Plugins without a maintainer will not be accepted into the plugins database.

:::

## I want to maintain a removed plugin

If you wish to volunteer to maintain a plugin which has been removed from core, you can [create an MDLSITE issue](https://tracker.moodle.org/secure/CreateIssue.jspa?issuetype=4&pid=10020) on the Moodle Tracker.

You will need to include:

- your Matrix username so that we can contact you;
- your GitHub username; and
- your username on moodle.org.

We will then assess whether the plugin can be transferred to you.

## If you do not have the ability to maintain a plugin

If you feel that an archived plugin should be in the plugins database but you do not have the ability to maintain it yourself then you may:

- look for support amongst the Moodle community; or
- pay a Moodle partner to maintain it for you.

## Useful notes for developers extract plugins

The following approach it typically used to extract a plugin, complete with its entire Git history into the plugins database.

:::danger

This *must* be performed on a clean and dedicated repository. Do *not* run `git filter-branch` or `git filter-repo` on a development repository.

:::

```sh title="Extracting the content"
git clone --no-local https://git.in.moodle.com/moodle/moodle.git moodle-plugin_name
cd moodle-plugin_name
git filter-repo --subdirectory-filter path/to/plugin/name
git remote add origin git@github.com:moodlehq/moodle-plugin_name.git
git push -u origin main
git push origin --tags
```
