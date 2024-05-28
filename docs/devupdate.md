---
title: Moodle 4.5 developer update
tags:
- Core development
- Moodle 4.5
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 4.5 for developers.

## Reset course page

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
