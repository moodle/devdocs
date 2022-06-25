---
title: Add a block cleanup
tags:
  - Code
  - Project
  - Blocks
  - Cleanup
description: A project to reduce the size of the 'Add a block' menu.
---

import { ProjectSummary } from '@site/src';

<ProjectSummary
    projectName="code/block-cleanup"
/>

In the Add a block menu, the list of blocks is really long. This project is about figuring out how to reduce the list.

## Disabling blocks if the feature is disabled

Blocks such as the blog menu, blog tags and recent blog entries will be disabled if blogs are disabled in advanced features.

Blocks this applies to:

- Accessibility review
- Blog menu
- Blog tags
- Recent blog entries
- Comments
- Course completion status
- Global search
- Latest badges
- Learning plans
- Network servers
- Random glossary entry
- Tags

## Disabling less useful blocks

Some blocks that we have disabled by default are:

- Course summary
- Feedback - as the block only works if a Feedback activity is added to the site home page
- Remote RSS feeds - as RSS feeds are not used as much these days
- Self completion - as the block is only needed if self completion is enabled in the course completion settings (as mentioned in the setting).

For new installs, the above blocks will disabled by default.

For upgraded sites, we check if there are any instances of the block and if not, disable it.

## Letting themes define "unneeded" blocks

The Administration and Navigation blocks are only needed if the Classic theme is used.

A new theme setting has been added to let themes mark blocks as "unneeded" (to avoid them being displayed in the "Add a block" list). This will allow Boost to mark the following blocks as unneeded:

- Navigation
- Administration
- Courses - as we have My courses in 4.0
- Section links - as the course index in 4.0 provides access to sections

As it's a theme setting, admins can still remove them from this "unneeded" blocks list, if, for any reason, they want the block to be available in the "Add a block" list.
