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

Any plugin which implements a subplugin must describe its subplugins by name and path in that plugins `db/subplugins.json` location.

<details>
    <summary>Example of a `db/subplugins.json`</summary>

```json title="mod/quiz/db/subplugins.json"
{
    "plugintypes": {
        "quiz": "mod/quiz/report",
        "quizaccess": "mod/quiz/accessrule"
    }
}
```

</details>

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
