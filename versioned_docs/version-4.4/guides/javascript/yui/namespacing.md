---
title: YUI Namespacing
tags:
  - Javascript
  - YUI
---

<DeprecatedSince versions={["2.9"]} />

:::caution

As of Moodle 2.9 we are transitioning away from YUI to AMD modules. This transition will take a long time, but it is important because the YUI team have [stopped all new development on the YUI library](http://yahooeng.tumblr.com/post/96098168666/important-announcement-regarding-yui). See [JavaScript Modules](https://docs.moodle.org/dev/_Javascript_Modules_) for more information.

:::

## Introduction and Rationale

One of the many fantastic features of YUI is that it supports sandboxing of individual modules. This means that a third-party plugin cannot interfere with core plugins in such a way that will have undesired consequences to anything using the core code.

As an example, a plugin could modify Y.Node to add a new function, or overwrite an existing function. This may be desirable for one instance of that Node, but undesirable for all others. For anyone wishing to use the additional function, they should depend upon the plugin instead which adds this functionality.

To benefit from this sandboxing fully however, we must write our YUI modules under the Y namespace.

To keep things consistent and clear, all Moodle-specific modules should be under a single Namespace. Ideally this namespace should be short, but still clear that it relates to Moodle.

## Proposed namespace

The proposed namespace fits into:

```
Y.M.<plugin_or_system_type>[_<component>].<YUI_modulename>[.<YUI_submodule>]
```

The **plugin_or_system_type** should match the list defined in lib/classes/component.php in fetch_subsystems, with the additional 'core' subsytem used to for items within lib.

The *optional* **component** will be the plugin name where relevant

The ** YUI_modulename** should match module name

The *optional* **YUI_submodule** should match the submodule if relevant

## Examples

| YUI Module | Namespace |
| --- | --- |
| `moodle-core-dock` | `Y.M.core.dock` |
| `moodle-core-dock-loader` | `Y.M.core.dock.loader` |
| `moodle-course-toolboxes` | `Y.M.course.toolboxes` |
| `moodle-mod_forum-inlinereply` | `Y.M.mod_forum.inlinereply` |
| `moodle-block_navigation-navigation` | `Y.M.block_navigation.navigation` |
| `moodle-mod_assign-history` | `Y.M.mod_assign.history` |
| `moodle-form-dateselector` | `Y.M.form.dateselector` |
| `moodle-form-listing` | `Y.M.form.listing` |
