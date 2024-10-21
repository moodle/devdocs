---
title: Atto
tags: []
---

<Since versions={["2.7"]} issueNumber="MDL-43841" />

Atto is a JavaScript text editor built specifically for Moodle. It is the default text editor in Moodle from 2.7 onwards, and is implemented as a standard Moodle [text editor plugin](https://docs.moodle.org/dev/Editors). Most of the code is written in JavaScript using YUI modules.

All of the buttons in Atto are implemented as Moodle subplugins. This means that the subplugins can do anything a subplugin can do including, using language strings, database tables, other JavaScript, and more.

:::caution Sunset of Atto

A new Editor was created for Moodle 4.1 and later using the latest version of TinyMCE.

It is likely that Atto will be removed in Moodle 4.6.

:::

## File structure

import {
    Lang,
    Lib,
    VersionPHP,
} from '../../_files';
import Button from './_examples/button';

Atto plugins are located in the `/lib/editor/atto/plugins` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `atto_media` plugin.</summary>

```console
 lib/editor/atto/plugins/media
 |-- db
 |   └-- upgrade.php
 |-- lang
 |   └-- en
 |       └-- atto_media.php
 |-- yui
 |   └-- src
 |        └-- button
 |           └-- atto_media.php
 |           ├── build.json
 |           ├── js
 |           │   └── button.js
 |           └── meta
 |               └── button.json
 |-- settings.php
 └-- version.php
```

</details>

Some of the important files for the Atto plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### version.php

<!-- markdownlint-disable no-inline-html -->

<VersionPHP
    plugintype="atto"
/>

### lib.php

import LibExample from '!!raw-loader!./_examples/lib.php';
import LibDescription from './_examples/lib.md';

<Lib
    plugintype="atto"
    pluginname="media"
    description={LibDescription}
    example={LibExample}
    legacy={false}
    optional
/>

### yui/src/button/*

<Button
    pluginname="media"
    modulename="button"
/>

:::note

It is recommended that you extend the `EditorPlugin` class as described below.
See: [YUI/Modules](../../../guides/javascript/yui/modules.md) for more information about YUI modules.

:::

The plugin:

- **must** register a class at `Y.M.atto_PLUGINNAME.button`;
- **must** provide a constructor; and
- ***should*** extend [Y.M.editor_atto.EditorPlugin](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin.js).

#### EditorPlugin

It is up to the plugin author to decide how best to write their plugin, but it is highly advisable to extend `EditorPlugin` class, which provides a number of useful functions for dealing with the Editor, Toolbars, Keyboard Navigation, and other related areas.

Of particular interest are:

- [addBasicButton](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-buttons.js#L293) - to add a basic button which directly uses document.execCommand with minimal effort;
- [addButton](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-buttons.js#L161) - to add a button giving you a greater degree of control via your own callback;
- [addToolbarMenu](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-buttons.js#L337) - to add a dropdown toolbar menu;
- [markUpdated](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin.js#L91) - should be called after making changes to the content area; and
- [getDialogue](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-dialogue.js#L54) - return a standard dialogue, creating one if it does not already exist.
