---
title: Admin tools
tags:
  - Plugins
  - Admin
---

import { ProjectSummary } from '@site/src';

<Since versions={["2.2"]} issueNumber="MDL-57898" />

<br/>

<ProjectSummary
    projectName="api/admin-tools"
/>

Admin tools are advanced plugins that are intended especially for site administrators, they are accessible via the admin site administration tree menu. Ideally most of the functionality in `/admin/` directory should be moved to separate plugins in the future.

## Previous problems

Before 2.2, tools for administrators were created as admin reports (because we did not have better pluggable place), placed directly into `/admin/` or `/local/ directory`.

- Confusing `/admin/report/` or `/local/ plugins`
- No way to disable or remove or add custom admin tools
- The official distribution should not include local plugins by definition (`/local/qeupgradehelper`).

## Benefits

- Major cleanup in `/admin/`
- No need to abuse admin reports
- Contrib admin tools can be distributed easier
- It is possible to remove or replace core admin tools (no hardcoded links)

## Upgrades

How to migrate existing admin reports:

1. Move all files to new `/admin/tool/yourplugin/` location
1. Update all links to admin tools `/admin/report/` to `/admin/tool/`
1. Rename/add language pack file with at least `pluginname` string
1. Update all language strings (use `tool_yourplugin` instead of `report_yourplugin`. Use [AMOS](https://docs.moodle.org/dev/Languages/AMOS) hints in commit message
1. Update all capability names
1. Create `db/install.php` migration script. Delete old settings and capabilities (see converted plugins for examples)
1. Grep the plugin codebase and look for any remaining `coursereport` occurrences
1. Update CSS selectors

## FAQs

- **Is it necessary to migrate existing admin reports?**<br/>
Yes. Old admin reports directory is completely ignored.

- **Is it difficult to migrate admin reports?**<br/>
No, it usually takes less than an hour to migrate and test one admin tool.

- **What is the difference between report and admin tool?**<br/>
Report is a view of live or historical data, it may also contain export feature, reports usually do not modify data. Admin tools are intended mostly for administrators, they usually work only in system context.

- **What is the difference between admin tool and local plugin?**<br/>
Local plugin is everything else, it may be intended for non-admin users. Examples of local plugins: event handlers, web service/function definitions, shared library hacks, new lang strings used in core hacks, etc.

## See also

- [General report plugins](https://docs.moodle.org/dev/General_report_plugins)
