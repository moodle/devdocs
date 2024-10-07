---
title: New user docs version process
sidebar_label: New user docs
sidebar_position: 1
tags:
  - Documentation
  - Processes
  - User docs
---

:::info

This page describes the procedures for creating a new Moodle user docs version wiki.

:::

## 4 weeks prior

Tidying up in current latest version wiki:

1. Delete https://docs.moodle.org/en/Special:BrokenRedirects
1. Edit https://docs.moodle.org/en/Special:DoubleRedirects (ignoring redirects to dev docs)
1. Check and delete as necessary https://docs.moodle.org/en/Special:NewFiles
1. Check and delete as necessary https://docs.moodle.org/en/Special:ListDuplicatedFiles
1. Check and delete as necessary https://docs.moodle.org/en/Special:UnusedFiles

Create a tracker issue for creating new en and de version wikis similar to [MDLSITE-7357](https://tracker.moodle.org/browse/MDLSITE-7357).

<!-- cspell:ignore Sitenotice -->

## 3 weeks prior

In new version wiki:

1. Edit MediaWiki:MoodleDocsVersionLinks
1. Edit Main_page
1. Add message to MediaWiki:Sitenotice
1. Remove new features template from all pages in Category:New_features
1. Edit Template:New_features and Category:New_features
1. Follow the [Documentation process](./docsrequiredissues) for adding documentation about new features and improvements
1. Create Upgrading_to_Moodle_x.y and redirect to Upgrading
1. Update version number in Template:Version and Template:Version2 and Git for Administrators
1. Review Special:WantedPages
1. Review Special:LonelyPages
1. Review instances of "(new in x.y)" text (not always necessary to remove them)
1. Add link to new version wiki to https://docs.moodle.org/en/MoodleDocs:Overview
1. Post on moodle.org in the Moodle community sites forum about the new version wikis, for example, [Moodle Docs 4.5 English wiki now available](https://moodle.org/mod/forum/discuss.php?d=461965)

## 1 week prior

In new wiki:

1. Remove message in MediaWiki:Sitenotice
1. Check (and update if needed) Upgrading and Upgrade overview pages

In all older version wikis:

- Edit https://docs.moodle.org/en/MediaWiki:MoodleDocsVersionLinks to add the new version and remove older versions (though keeping [LTS releases](../../../releases.md))

## Day of release

Request for the new version wiki to be made default and email notification of watched pages to be enabled.

In previous latest version wiki:

1. Edit https://docs.moodle.org/en/MediaWiki:Noarticletext to make it like https://docs.moodle.org/2x-1/en/MediaWiki:Noarticletext
1. Edit https://docs.moodle.org/en/Creating_SCORM_Content to make it like https://docs.moodle.org/2x-1/en/Creating_SCORM_Content
1. Go through Special:RecentChanges in the previous most recent version wiki and add relevant changes to the new version wiki
1. Edit https://docs.moodle.org/en/Awards and add `#REDIRECT [[:en:Awards]]` so it redirects to the latest version of the page
1. Edit https://docs.moodle.org/en/MoodleDocs:Overview and add `#REDIRECT [[:en:MoodleDocs:Overview]]` so it redirects to the latest version of the page
1. For no longer supported versions, create MediaWiki:Sitenotice by copying content from https://docs.moodle.org/37/en/MediaWiki:Sitenotice

## Final checks

1. Email notification of watched pages enabled
1. Links without version number, for example https://docs.moodle.org/en/Main_page , redirect to the new version wiki
1. Docs links from a dev site, such as the QA testing site, redirect to the correct page in the new version wiki
1. New version wiki listed in https://docs.moodle.org/overview/
