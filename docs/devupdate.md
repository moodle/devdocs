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

:::

## Plugin type deprecation

<Since version="5.0" issueNumber="MDL-79843" />

A new process for plugin type and subplugin type deprecation has been introduced.

Using `components.json` or `subplugins.json` plugin types and subplugin types, respectively, can be marked as deprecated or deleted.

:::info
Plugin/subplugin type deprecation doesn't follow the same rules as code deprecation. Core considers deprecated plugins as end-of-life and will omit them from many core APIs. Things like hooks, callbacks and events will not include/call plugins of a deprecated type.
:::

Deprecation follows a 3 stage process:

1. The plugin/subplugin type is marked as deprecated (a core version bump is also required).
2. The plugin/subplugin type is marked as deleted (a core version bump is also required).
3. Final removal of the plugin/subplugin type from the respective config file.

:::info Limitations
Currently, only those plugin types _not_ supporting subplugins can be deprecated.
:::

During first stage deprecation, plugins of the respective type may remain installed, but are deemed end-of-life. This stage gives admins time to remove the affected plugins from the site, or migrate them to their replacement plugins.

In second stage deprecation (deletion), if any affected plugins are still present (i.e. have not been removed/uninstalled yet) site upgrade will be blocked. These plugins must be removed at this time to continue.

In final stage deprecation (final removal), the relevant config changes supporting first and second stage deprecation can be removed from the respective config files. This removes the last reference to these plugin/subplugin types.

:::tip Example of the new plugin/subplugin type deprecation config values

To mark a plugin type as deprecated in `components.json`, the plugin type should be removed from the `plugintypes` object, and added to a new `deprecatedplugintypes` object.

```json title="lib/components.json demonstrating first stage deprecation of a plugin type"
{
    "plugintypes": {
        ...
    },
    "subsystems": {
        ...
    },
    "deprecatedplugintypes": {
        "aiplacement": "ai/placement"
    }
}
```

To mark a subplugin type as deprecated in a component's `subplugins.json`, the subplugin type should be removed from the `subplugintypes` object, and added to a new `deprecatedsubplugintypes` object.

```json title="mod/lti/db/subplugins.json demonstrating first stage deprecation of a subplugin type"
{
    "subplugintypes": {
    },
    "deprecatedsubplugintypes": {
        "ltiservice": "service",
        "ltisource": "source"
    }
}
```

To mark a plugin type as deleted in `components.json`, the plugin type should be removed from the `deprecatedplugintypes` object, and added to a new `deletedplugintypes` object.

```json title="lib/components.json demonstrating second stage deprecation (deletion) of a plugin type"
{
    "plugintypes": {
        ...
    },
    "subsystems": {
        ...
    },
    "deprecatedplugintypes": {
    },
    "deletedplugintypes": {
        "aiplacement": "ai/placement"
    }
}
```

To mark a subplugin type as deleted in a component's `subplugins.json`, the subplugin type should be removed from the `deprecatedsubplugintypes` object, and added to a new `deletedsubplugintypes` object.

```json title="mod/lti/db/subplugins.json demonstrating second stage deprecation (deletion) of a subplugin type"
{
    "deprecatedsubplugintypes": {
    },
    "deletedsubplugintypes": {
        "ltiservice": "service",
        "ltisource": "source"
    }
}
```

Third stage deprecation just removes the plugin/subplugin type from the respective `deletedplugintypes` or `deletedsubplugintypes` objects. If these objects are empty, they may also be removed entirely.

```json title="lib/components.json demonstrating final stage deprecation of a plugin type. The process is the same for subplugin types."
{
    "plugintypes": {
        ...
    },
    "subsystems": {
        ...
    },
}
```

:::
