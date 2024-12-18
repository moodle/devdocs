---
title: Metadata
tags:
- apis.json
- components.json
- plugins.json
- subplugins.json
---

Moodle provides a variety of metadata which is used internally by Moodle, but which may also be useful in some developer tooling and integrations.

import {
    Since,
} from '@site/src/components';

## Plugin types and subsystems

The name and location on disk of every plugin type, and subsystem is described in [`lib/components.json`](https://github.com/moodle/moodle/blob/main/lib/components.json).

<details>
    <summary>Excerpt from `lib/components.json`</summary>

```json
{
    "plugintypes": {
        "antivirus": "lib/antivirus",
        "availability": "availability/condition",
        "qtype": "question/type",
        "mod": "mod",
        // ...
    },
    "subsystems": {
        "access": null,
        "admin": "admin",
        // ...
    }
}
```

</details>

## Subplugins

Any plugin which supports subplugins must describe its subplugin types by name and path in that plugins `db/subplugins.json` location.

This file requires that subplugins be specified as a set of key and value pairs where the key is the name of the subplugin type, and the value is the path to it.

- The name is the used as a prefix for all namespaces.
- The path is the path that the plugins exist within.

In the following example the subplugins used in `mod_quiz` are described.

The Quiz activity module is located in `mod/quiz`. It has two subplugin types, `quiz`, and `quizaccess` which are located in `mod/quiz/report`, and `mod/quiz/accessrule` respectively.

```json title="mod/quiz/db/subplugins.json"
{
    "subplugintypes": {
        "quiz": "report",
        "quizaccess": "accessrule"
    },
    "plugintypes": {
        "quiz": "mod/quiz/report",
        "quizaccess": "mod/quiz/accessrule"
    }
}
```

<Since version="5.0" issueNumber="MDL-83705" />

The list of subplugins should be detailed in the `subplugintypes` object which contains a list of the subplugins where the key is the component type, and the value is the path relative to the parent plugin.

For Moodle versions 4.5 and earlier the `plugintypes` object is used. The same keys must be used, but the values of `subplugintypes` are relative to the plugin's root directory, whilst the value of `plugintypes` are relative to the Moodle project root.

:::danger Plugins supporting Moodle 4.5 and earlier

If your plugin supports subplugins and is intended for use for both Moodle 5.0 and later, and Moodle 4.5 or earlier, you should specify both the `subplugintypes` and the `plugintypes` objects.

When both objects are specified the keys must match, and the paths relative to the plugin must also match.

:::

## APIs

<Since version="4.2" issueNumber="MDL-71096" />

As described in the [Namespacing section of the coding style](../../policies/codingstyle/index.md#rules-for-level2), all Level 2 namespaces must be a Core API, or the word `local`.

Only those APIs meeting the following criterion are supported for this purpose:

- defined in [`/lib/apis.json`](https://github.com/moodle/moodle/blob/main/lib/apis.json); and
- having the `allowedlevel2` flag set; and
- either:
  - having the same `component` as the API; or
  - having the `allowedspread` flag set.

<details>
    <summary>Excerpt from `lib/apis.json`</summary>

```json
{
    "access": {
        "component": "core_access",
        "allowedlevel2": true,
        "allowedspread": false
    },
    "admin": {
        "component": "core_admin",
        "allowedlevel2": false,
        "allowedspread": false
    },
    "adminpresets": {
        "component": "core_adminpresets",
        "allowedlevel2": true,
        "allowedspread": false
    },
    "analytics": {
        "component": "core_analytics",
        "allowedlevel2": true,
        "allowedspread": true
    },
    // ...
}
```

</details>

:::tip

A JSON schema for this file can be found at [`/lib/apis.schema.json`](https://github.com/moodle/moodle/blob/main/lib/apis.schema.json).

:::

## Standard Plugins

<Since version="4.4" issueNumber="MDL-81084" />

A list of the plugins which are shipped a standard Moodle installation, as well as the plugins which have recently been removed from this list is available in [`lib/plugins.json`](https://github.com/moodle/moodle/blob/main/lib/plugins.json).

This list is in categorised under the categories `standard`, and `deleted`, and then by the plugin type, and finally the plugin name.

<details>
    <summary>Excerpt from `lib/plugins.json`</summary>

```json
{
    "standard": {
        "antivirus": [
            "clamav"
        ],
        "assignfeedback": [
            "comments",
            "editpdf",
            "file",
            "offline"
        ],
        "assignsubmission": [
            "comments",
            "file",
            "onlinetext"
        ],
        // ...
    },
    "deleted": {
        "assignment": [
            "offline",
            "online",
            "upload",
            "uploadsingle"
        ],
        "auth": [
            "fc",
            "imap",
            "nntp",
            "pam",
            "pop3",
            "radius"
        ],
        // ...
    }
}
```

</details>

:::tip

A JSON schema for this file can be found at [`/lib/plugins.schema.json`](https://github.com/moodle/moodle/blob/main/lib/plugins.schema.json).

:::
