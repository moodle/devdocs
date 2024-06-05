---
title: Moodle 4.5 developer update
tags:
- Core development
- Moodle 4.5
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 4.5 for developers.

## Core changes

### Autoloader

#### `ABORT_AFTER_CONFIG`

<Since version="4.4" issueNumber="MDL-80275" />

Prior to Moodle 4.5 only a small number of classes were compatible with scripts using the `ABORT_AFTER_CONFIG` constant.

MDL-80275 modifies the location of the class Autoloader in the Moodle bootstrap to make it available to scripts using the `ABORT_AFTER_CONFIG` constant.

:::note

Please note that the same limitations regarding access to the Database, Session, and similar resources still exist.

:::

## Course

### Reset course page

The reset course page has been improved. The words "Delete", and "Remove" have been removed from all options to make it easier to focus on the type of data to be removed and avoid inconsistencies and duplicated information.
Third party plugins implementing reset methods might need to:

- Add static element in the `_reset_course_form_definition` method before all the options with the `Delete` string:

    ```php
    $mform->addElement('static', 'assigndelete', get_string('delete'));
    ```

- Review all the strings used in the reset page to remove the `Delete` or `Remove` words from them.

:::caution

Starting from Moodle 4.5, the Reset course page form defined in the `_reset_course_form_definition` method should be reviewed because their options should not contain the `Delete` or `Remove` words.
Check changes in any of the core plugins that implement the reset course method.

:::

## TinyMCE plugins

The `helplinktext` language string is no longer required by editor plugins, instead the `pluginname` will be used in the help dialogue
