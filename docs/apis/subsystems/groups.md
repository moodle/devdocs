---
title: Groups API
documentationDraft: true
tags:
  - Groups
  - API
  - Groupings
---

The Groups and Groupings features of Moodle are defined as a course-level API.

A course may have any number of groups, which contain any number of group members, and which are placed into any number of groupings.

The main public API includes functions found in `lib/grouplib.php`.

:::warning

Please note that plugins should only use the APIs defined in `lib/grouplib.php`.

:::

Moodle core may use other functions defined in group/lib.php

![Database layout](_groups/groupsdb.png)
