---
title: Atto
tags: []
---
{{Moodle 2.7}}

Atto is a JavaScript text editor built specifically for Moodle. Atto is the default text editor in Moodle from 2.7 onwards.

Atto is implemented as a standard Moodle text editor plugin ([Editors](https://docs.moodle.org/dev/Editors)). Most of the code is written in JavaScript as a standard Moodle YUI module.

Follow the development of ATTO here: https://tracker.moodle.org/browse/[MDL-43996](https://tracker.moodle.org/browse/MDL-43996)

## What does Atto mean?

[Atto](https://en.wikipedia.org/wiki/Atto-) means: really really small. (10^-18). Well... It used to be :)

The name still ties in with some of the design concepts for Atto which is to be a simple, fast editor  users.

## Where can I get Atto?

GIT - and you can check here: https://moodle.org/plugins/view.php?plugin=editor_atto

## Atto Plugins

All of the buttons/menus in Atto are implemented as true Moodle subplugins. This means that the subplugins can do anything a subplugin can do including, lang strings, db tables, yui modules.

There are a couple of extra functions/structure required for an Atto subplugin which are required in order to load a plugin on the toolbar.

## Structure of an Atto Plugin

/lib.php
Optional. Only required if your plugin needs to implement one of the component callbacks listed below.

/settings.php
Optional. Only required if your plugin wants to support custom admin settings. See: [Admin settings#Individual settings](../../subsystems/admin/index.md#individual-settings) for more info on settings.

/version.php
Required. Moodle plugin version. See:[version.php](../../commonfiles/version.php/index.md) for more info on version files.

/lang/en/atto_pluginname.php
Required. Language file. This file is required and must at least define the language string 'pluginname'.

/yui/src/button/
Required. The plugin must implement a YUI module that will be included by the editor when the page loads. That YUI module must be named 'button' and must insert itself a class into the Y.M.<plugin name> namespace, with constructor that will be called to initialise the editor. It is recommended that you extend the EditorPlugin class as described below.
See: [YUI/Modules](../../../guides/javascript/yui/modules.md) for more information about YUI modules.

## Atto subplugin Php API

Atto sub plugins can contain a lib.php file with 2 callbacks that will be looked for when the plugin is loaded.

The first is "XXX_strings_for_js" (example taken from atto_table plugin):

<pre>
/**
 * Initialise the js strings required for this module.
 */
function atto_table_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('createtable',
                                          'accessibilityhint',
                                          'headers',
                                          'caption',
                                          'columns',
                                          'rows',
                                          'numberofcolumns',
                                          'numberofrows',
                                          'both',
                                          'edittable',
                                          'addcolumnafter',
                                          'addrowafter',
                                          'movecolumnright',
                                          'movecolumnleft',
                                          'moverowdown',
                                          'moverowup',
                                          'deleterow',
                                          'deletecolumn'),
                                    'atto_table');
}

</pre>

The purpose of this callback is to allow the plugin to initialise the strings that it will use in it's user interface. Note: that the pluginname string for each plugin is automatically loaded, and if this is the only string your plugin requires, then it is not necessary to implement this callback in your plugin. See: [JavaScript guidelines#Getting Moodle to load your JavaScript files](https://docs.moodle.org/dev/JavaScript_guidelines#Getting_Moodle_to_load_your_JavaScript_files) for more information on strings_for_js.

The second php callback that can be implemented in lib.php is: "XXX_params_for_js" (fictional example, not used in core):

<pre>
/**
 * Return the js params required for this module.
 * @return array of additional params to pass to JavaScript init function for this module.
 */
function atto_gambling_params_for_js() {
    return array('bestodds' => '34 to 1', 'worstodds' => '5 to 1');
}

</pre>

If you are using this second callback, you need to specify these parameters in your JavaScript source file, passing it as an argument in the constructor:
<pre>
{
    ATTRS: {
        bestodds: {
            value: '<defaultvalue>'
        },
        worstodds: {
            value: '<defaultvalue>'
        }
    }
}
</pre>

## Atto subplugin JavaScript API

Atto subplugins must implement a yui module named "moodle-atto_pluginname-button".
This module will be automatically loaded when Atto is displayed on a page (and the subplugin is listed in the toolbar configuration).

The plugin:

- **must** register a class at Y.M.atto_PLUGINNAME.button;
- **must** provide a constructor; and
- ***should*** extend [Y.M.editor_atto.EditorPlugin](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin.js).

It is up to the plugin author to decide how best to write their plugin, but it is highly advisable to extend EditorPlugin class, which provides a number of useful functions for dealing with the Editor, Toolbars, Keyboard Navigation, and other related areas.

Of particular interest are:

- [addBasicButton](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-buttons.js#L293) - to add a basic button which directly uses document.execCommand with minimal effort;
- [addButton](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-buttons.js#L161) - to add a button giving you a greater degree of control via your own callback;
- [addToolbarMenu](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-buttons.js#L337) - to add a dropdown toolbar menu;
- [markUpdated](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin.js#L91) - should be called after making changes to the content area; and
- [getDialogue](https://github.com/moodle/moodle/blob/MOODLE_37_STABLE/lib/editor/atto/yui/src/editor/js/editor-plugin-dialogue.js#L54) - return a standard dialogue, creating one if it does not already exist.

### Examples

You may also wish to take a look at some of the existing plugins for examples on how to create the different types:

- [A basic plugin](https://github.com/moodle/moodle/tree/master/lib/editor/atto/plugins/strike/yui/src/button/js/button.js);
- [A basic plugin which has a keyboard shortcuts](https://github.com/moodle/moodle/tree/master/lib/editor/atto/plugins/bold/yui/src/button/js/button.js);
- [A plugin with two buttons (one basic, one slightly more complex)](https://github.com/moodle/moodle/tree/master/lib/editor/atto/plugins/indent/yui/src/button/js/button.js);
- [A plugin with multiple buttons which take arguments](https://github.com/moodle/moodle/tree/master/lib/editor/atto/plugins/rtl/yui/src/button/js/button.js);
- [A plugin which utilises a toolbar menu](https://github.com/moodle/moodle/tree/master/lib/editor/atto/plugins/title/yui/src/button/js/button.js);
- [A plugin with a dialogue](https://github.com/moodle/moodle/tree/master/lib/editor/atto/plugins/image/yui/src/button/js/button.js); and
- [A plugin which uses templates to build its dialogue](https://github.com/moodle/moodle/tree/master/lib/editor/atto/plugins/charmap/yui/src/button/js/button.js).

## See Also

Atto makes accessibility tools available to content authors. See https://docs.moodle.org/dev/Accessibility#Authoring_features

Atto makes use of contenteditable regions, and the rich text editing API supported by modern browsers. See https://developer.mozilla.org/en/docs/Rich-Text_Editing_in_Mozilla for further reading.

See the comparision (pros, cons, technical notes, missing features, etc) of Atto versus other candidate editors for Moodle 2.7 in [https://docs.moodle.org/dev/Editor_2.7](https://docs.moodle.org/dev/Editor_2.7)

For opening dialogues it is recommended to use M.core.dialogue : https://github.com/moodle/moodle/blob/master/lib/yui/src/notification/js/dialogue.js
