---
title: Moodle 5.0 developer update
tags:
- Core development
- Moodle 5.0
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 5.0 for developers.

## Course formats

<Since version="5.0" issueNumber="MDL-83527" />

All course formats created for Moodle versions prior to 4.0, which still depend on the 3.11 libraries, will be deprecated starting from Moodle 5.0 and will no longer function in Moodle 6.0. We are discontinuing the use of YUI for course editing and transitioning the course display logic to output classes.

You can determine if your course format is impacted by this change by examining the `lib.php` file within your plugin directory. If the format class does not override the `supports_components` method, or if the method returns `false`, it indicates that the course format relies on the deprecated YUI libraries and requires updating.

To ensure a smooth transition, we have documented the migration process in detail. Please refer to the [migration guide](./apis/plugintypes/format/migration.md) for comprehensive instructions on updating your course formats to be compatible with the latest Moodle standards.

### Course action menu outputs classes

<Since version="5.0" issueNumber="MDL-83527" />

The section and activity action menus now utilize output classes instead of global functions. The new classes are:

- `core_courseformat\output\local\content\cm\controlmenu`: the class now fully replaces the old `course_get_cm_edit_actions` function. Extend this class in your format plugin to add more options to the activity menu.
- `core_courseformat\output\local\content\section\controlmenu`: the existing class has been refactored and now uses `action_menu_link` objects instead. If your format add more options to the section menu, you should update your code to use the new class instead of using arrays.
- `core_courseformat\output\local\content\cm\delegatedcontrolmenu`: like the section control menu, the existing class has been refactored to use `action_menu_link` objects instead of arrays.

## Subplugins

<Since version="5.0" issueNumber="MDL-83705" />

The `subplugins.json` file now requires a new `subplugintypes` object to define the subplugins available within a plugin.

The format of this is identical to the existing `plugintypes` object, but the value should be a path which is relative to the plugin's root directory.

:::tip Example of the new `subplugintypes` values

The Quiz Activity located in `mod/quiz` defines the `quizaccess` subplugin type.

The legacy `plugintype` entry for this is as follows:

```json title="mod/quiz/db/subplugins.json demonstrating the legacy plugintypes object"
{
    "plugintypes": {
        "quizaccess": "mod/quiz/accessrule"
    }
}
```

The new `subplugintypes` value is relative to the plugin root as follows:

```json title="mod/quiz/db/subplugins.json demonstrating the new subplugintypes object"
{
    "subplugintypes": {
        "quizaccess": "accessrule"
    }
}
```

Both of these values may be combined for plugins supporting both Moodle 4.5 and earlier, and Moodle 5.0 onwards.

```json title="mod/quiz/db/subplugins.json demonstrating both the legacy plugintypes and the new subplugintypes values"
{
    "plugintypes": {
        "quizaccess": "mod/quiz/accessrule"
    },
    "subplugintypes": {
        "quizaccess": "accessrule"
    }
}
```

:::

## Themes

<Since version="5.0" issueNumber="MDL-83725" />

Themes can now customize activity icon colors using simple CSS variables. The new variables introduced are:

- `$activity-icon-administration-bg`
- `$activity-icon-assessment-bg`
- `$activity-icon-collaboration-bg`
- `$activity-icon-communication-bg`
- `$activity-icon-content-bg`
- `$activity-icon-interactivecontent-bg`

All previous `$activity-icon-*-filter` elements can be removed, as they are no longer in use.

:::tip Example of customizing activity icon colors

Themes can customize the activity icon colors by overriding the following variables before loading the Boost scss:

```scss
$activity-icon-administration-bg: #5915b1;
$activity-icon-assessment-bg: #17857f;
$activity-icon-collaboration-bg: #cf7a34;
$activity-icon-communication-bg: #c70827;
$activity-icon-content-bg: #5915b1;
$activity-icon-interactivecontent-bg: #c70827;
```

:::

## Unit Tests

<Since version="5.0" issueNumber="MDL-83468" />

Moodle has updated the version of PHPUnit used in core to version 11.4. Some tests may encounter issues as a result.

Please see the [PHPUnit 11 Upgrade Guide](/general/development/tools/phpunit/upgrading-11) for assistance in updating any broken tests.
