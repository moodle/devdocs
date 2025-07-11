---
title: Moodle 5.1 developer update
tags:
- Core development
- Moodle 5.1
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 5.1 for developers.

## Badges API reorganisation

<Since version="5.1" issueNumber="MDL-82147" />

The Badges API is responsible for managing badges in Moodle, including their creation, management, and export to external platforms compliant with Open Badges standards. However, the current implementation has become complex and difficult to maintain, and can't be easily extended to support future versions of Open Badges.

To address these challenges, we're reorganising the API to significantly improve its structure and maintainability. Key changes include:

- Refactor JSON exporters to support multiple Open Badges schema versions (MDL-85621). This will allow for seamless integration with different schema requirements.
- Reorganising the Backpack API to support multiple Open Badges versions (MDL-85622). This ensures the API can consistently interact with various backpack standards.

More information about the Badges API can be found in the [Badges API documentation](./apis/subsystems/badges/index.md).

## Course format: max sections setting is now deprecated

<Since version="5.1" issueNumber="MDL-84291" />
The `maxsections` setting in course formats is now deprecated. Previously, this setting was used to limit the number of sections in a course. Starting with Moodle 5.1, courses can have an unlimited number of sections.

Although the `maxsections` setting remains available for now, it is marked as deprecated and will be removed in Moodle 6.0. Also, the `get_max_sections` from `core_courseformat\base` is also deprecated and will be removed in Moodle 6.0.

If your format plugin relies on `maxsections`, you should add a custom setting in your plugin to control section limits. For reference, see the week format plugin, which now uses its own setting for this functionality.
