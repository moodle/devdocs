---
title: Moodle 5.1 developer update
tags:
- Core development
- Moodle 5.1
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 5.1 for developers.

## Course format: max sections setting is now deprecated

<Since version="5.1" issueNumber="MDL-84291" />
The `maxsections` setting in course formats is now deprecated. Previously, this setting was used to limit the number of sections in a course. Starting with Moodle 5.1, courses can have an unlimited number of sections.

Although the `maxsections` setting remains available for now, it is marked as deprecated and will be removed in Moodle 6.0. Also, the `get_max_sections` from `core_courseformat\base` is also deprecated and will be removed in Moodle 6.0.

If your format plugin relies on `maxsections`, you should add a custom setting in your plugin to control section limits. For reference, see the week format plugin, which now uses its own setting for this functionality.
