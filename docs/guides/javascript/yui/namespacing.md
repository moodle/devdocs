---
title: YUI/Namespacing
tags: []
---
{{draft}}
{{Work in progress}}
{{Moodle 2.7}}

## Introduction and Rationale

One of the many fabtastic features of YUI is that it supports sandboxing of individual modules. This means that a third-party plugin cannot interfere with core plugins in such a way that will have undesired consequences to anything using the core code.

As an example, a plugin could modify Y.Node to add a new function, or overwrite an existing function. This may be desirable for one instance of that Node, but undesirable for all others. For anyone wishing to use the additional function, they should depend upon the plugin instead which adds this functionality.

To benefit from this sandboxing fully however, we must write our YUI modules under the Y namespace.

To keep things consistent and clear, all Moodle-specific modules should be under a single Namespace. Ideally this namespace should be short, but still clear that it relates to Moodle.

## Proposed namespace

The proposed namespace fits into:

    Y.M.<plugin_or_system_type>[_<component>].<YUI_modulename>[.<YUI_submodule>]

The **plugin_or_system_type** should match the list defined in lib/classes/component.php in fetch_subsystems, with the additional 'core' subsytem used to for items within lib.

The *optional* **component** will be the plugin name where relevant

The ** YUI_modulename** should match module name

The *optional* **YUI_submodule** should match the submodule if relevant

## Examples

<!--
  Github Flavoured Markdown does not support tables without headers.
  We must use an HTML table here.
  Please note that Spacing in this table is important.
  Markdown must have empty newlines between it and HTML markup.
-->
<table><tbody>
<tr><td>

YUI Module

</td><td>

Namespace

</td></tr>
<tr><td>

moodle-core-dock

</td><td>

Y.M.core.dock

</td></tr>
<tr><td>

moodle-core-dock-loader

</td><td>

Y.M.core.dock.loader

</td></tr>
<tr><td>

moodle-course-toolboxes

</td><td>

Y.M.course.toolboxes

</td></tr>
<tr><td>

moodle-mod_forum-inlinereply

</td><td>

Y.M.mod_forum.inlinereply

</td></tr>
<tr><td>

moodle-block_navigation-navigation

</td><td>

Y.M.block_navigation.navigation

</td></tr>
<tr><td>

moodle-mod_assign-history

</td><td>

Y.M.mod_assign.history

</td></tr>
<tr><td>

moodle-form-dateselector

</td><td>

Y.M.form.dateselector

</td></tr>
<tr><td>

moodle-form-listing

</td><td>

Y.M.form.listing

</td></tr>
</tbody></table>
