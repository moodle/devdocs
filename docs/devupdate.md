---
title: Moodle 5.1 developer update
tags:
- Core development
- Moodle 5.1
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 5.1 for developers.

## Code Structure

<Since version="5.1" issueNumber="MDL-83424" />

Most of the Moodle codebase, including all plugins, has been moved into a new `public` directory within the Moodle web root.

Most Moodle tooling has already been updated to support this, but minor web server reconfiguration will be required to support this.

See the [Restructure documentation](./guides/restructure/index.md) for further information on some of the changes required.

## Course format: max sections setting is now deprecated

<Since version="5.1" issueNumber="MDL-84291" />

The `maxsections` setting in course formats is now deprecated. Previously, this setting was used to limit the number of sections in a course. Starting with Moodle 5.1, courses can have an unlimited number of sections.

Although the `maxsections` setting remains available for now, it is marked as deprecated and will be removed in Moodle 6.0. Also, the `get_max_sections` from `core_courseformat\base` is also deprecated and will be removed in Moodle 6.0.

If your format plugin relies on `maxsections`, you should add a custom setting in your plugin to control section limits. For reference, see the week format plugin, which now uses its own setting for this functionality.

## Unit Testing

### Testing External Service classes

<Since versions={["5.1", "5.0.7", "4.5.11", "4.4.21"]} issueNumber="MDL-86301" />

A new `\core_external\tests\externallib_testcase` has been introduced to replace the `\externallib_advanced_testcase` class. The new class can be autoloaded, and is available from Moodle 4.4 onwards.
