---
title: Moodle 5.0 developer update
tags:
- Core development
- Moodle 5.0
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 5.0 for developers.

## Activity overview page integration

<Since version="5.0" issueNumber="MDL-83872" />

The course navigation has been updated to include a new link to the activity overview page. This page will replace the current `index.php` page in the activity modules. By default, the overview page displays a table that includes the name of each activity, its completion status, and the grade (if applicable). Additionally, plugins can enhance this information by implementing a `mod_PLUGINNAME\courseformat\overview` class.

See the [Activity overview page integration](./apis/plugintypes/mod/courseoverview) documentation for more information.

## Calendar: New human date renderers

<Since version="5.0" issueNumber="MDL-83873" />

To improve date readability and user experience, the Calendar subsystem is transitioning from deprecated date rendering methods, such as `calendar_format_event_time` or `calendar_time_representation`, to a new suite of human date renderers. It enhances date display by:

- Using relative terms like "Today," "Yesterday," and "Tomorrow" for nearby dates.
- Applying alert styling to dates nearing deadlines or events.

This update introduces two primary renderers:

- `humandate`: This renderer presents single dates and times in a user-friendly format, automatically adapting to the user's preferred 12-hour or 24-hour time display (`CALENDAR_TF_12`/`CALENDAR_TF_24`).
- `humantimeperiod`: Designed for displaying date/time ranges, this renderer optimizes information presentation. When the start and end dates fall on the same day, it shows the full start date and time, but only the end time, eliminating redundant date information. This logic mirrors the existing functionality of the deprecated functions, ensuring a consistent user experience.

See the [Date and Time Output Classes](./apis/subsystems/output/humandate.md) documentation for more information.

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

## Plugin type deprecation

<Since version="5.0" issueNumber="MDL-79843" />

A new process for plugin type and subplugin type deprecation has been introduced. See [the Plugin Type deprecation](./apis/plugintypes/index.md#deprecating-a-plugin-type) and [Subplugin deprecation](./apis/plugintypes/index.md#deprecating-a-subplugin-type) documentation for further information.

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

### Activity icon colors

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

### Bootstrap 5

<Since version="5.0" issueNumber="MDL-75669" />

Bootstrap has been upgraded to version 5, bringing new features and improvements.
As part of this transition, we have implemented a backwards-compatibility layer to ensure a smooth migration for third-party plugins and custom code.

For more details on the upgrade process and how to utilize the compatibility layer, please visit [Bootstrap 5 migration](./guides/bs5migration/index.md).
This will help you adapt your projects to the latest Bootstrap version.

## Unit Tests

<Since version="5.0" issueNumber="MDL-83468" />

Moodle has updated the version of PHPUnit used in core to version 11.4. Some tests may encounter issues as a result.

Please see the [PHPUnit 11 Upgrade Guide](/general/development/tools/phpunit/upgrading-11) for assistance in updating any broken tests.

:::
