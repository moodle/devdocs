---
title: Assign feedback plugins
tags:
  - Assign
  - Assignment
  - Feedback
  - Subplugin
toc_max_heading_level: 4
description: Assign feedback plugins allow you to define different ways that a teacher can provide feedback to their students.
---

import {
    SettingsPHP,
    LocalLib,
} from '../../_files';
export const plugintype = 'assignfeedback';

An assignment feedback plugin can do many things including providing feedback to students about a submission. The grading interface for the assignment module provides many hooks that allow plugins to add their own entries and participate in the grading workflow.

:::tip

For a good reference implementation, see the [file](https://github.com/moodle/moodle/tree/main/mod/assign/feedback/file) feedback plugin included with core because it uses most of the features of feedback plugins.

:::

## File structure

Assignment Feedback plugins are located in the `/mod/assign/feedback` directory. A plugin should not include any custom files outside of it's own plugin folder.

:::important Plugin naming

The plugin name should be no longer than 38 (13 before Moodle 4.3) characters - this is because the database tables for a submission plugin must be prefixed with `assignfeedback_[pluginname]` (15 chars + X) and the table names can be no longer than 53 (28 before Moodle 4.3) chars due to a limitation with PostgreSQL.

If a plugin requires multiple database tables, the plugin name will need to be shorter to allow different table names to fit under the 53 character limit (28 before Moodle 4.3).

Note: If your plugin is intended to work with versions of Moodle older than 4.3, then the plugin name must be 13 characters or shorter, and table names must be 28 characters or shorter.
:::

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

:::important

Some of the important files are described below. See the [common plugin files](../../commonfiles/index.mdx) documentation for details of other files which may be useful in your plugin.

:::

<details>
  <summary>View an example directory layout for the `assignfeedback_file` plugin.</summary>

```console
mod/assign/feedback/file
├── backup
│   └── moodle2
│       ├── backup_assignfeedback_file_subplugin.class.php
│       └── restore_assignfeedback_file_subplugin.class.php
├── classes
│   └── privacy
│       └── provider.php
├── db
│   ├── access.php
│   ├── install.php
│   ├── install.xml
│   └── upgrade.php
├── importzipform.php
├── importziplib.php
├── lang
│   └── en
│       └── assignfeedback_file.php
├── lib.php
├── locallib.php
├── settings.php
├── uploadzipform.php
└── version.php
```

</details>

### settings.php

<!-- markdownlint-capture -->
<!-- markdownlint-disable no-space-in-code -->

export const settingsExample = `
$settings->add(
    new admin_setting_configcheckbox(
        'assignfeedback_file/default',
        new lang_string('default', 'assignfeedback_file'),
        new lang_string('default_help', 'assignfeedback_file'),
        0
    )
);
`;

export const settingsExtra = `
All feedback plugins should include one setting named 'default' to indicate if the plugin should be enabled by default when creating a new assignment.
`;

<SettingsPHP
    plugintype={plugintype}
    pluginname="file"
    example={settingsExample}
    extraDescription={settingsExtra}
/>

<!-- markdownlint-restore -->

### locallib.php

<!-- markdownlint-save -->
<!-- markdownlint-disable code-block-style -->

<LocalLib
    required
    legacy={false}
    defaultDescription={false}
/>

<!-- markdownlint-disable first-line-heading -->
This is where all the functionality for this plugin is defined. We will step through this file and describe each part as we go.

```php
class assign_feedback_file extends assign_feedback_plugin {
```

#### get_name()

All feedback plugins MUST define a class with the component name of the plugin that extends assign_feedback_plugin.

```php
public function get_name() {
    return get_string('file', 'assignfeedback_file');
}
```

This function is abstract in the parent class (feedback_plugin) and must be defined in your new plugin. Use the language strings to make your plugin translatable.

#### get_settings()

```php
public function get_settings(MoodleQuickForm $mform) {
    $mform->addElement(
        'assignfeedback_file_fileextensions',
        get_string('allowedfileextensions', 'assignfeedback_file')
    );
    $mform->setType('assignfeedback_file_fileextensions', PARAM_FILE);
}
```

This function is called when building the settings page for the assignment. It allows this plugin to add a list of settings to the form. Notice that the settings should be prefixed by the plugin name which is good practice to avoid conflicts with other plugins. (None of the core feedback plugins have any instance settings, so this example is fictional).

#### save_settings()

```php
public function save_settings(stdClass $data) {
    $this->set_config('allowedfileextensions', $data->allowedfileextensions);
    return true;
}
```

This function is called when the assignment settings page is submitted, either for a new assignment or when editing an existing one. For settings specific to a single instance of the assignment you can use the assign_plugin::set_config function shown here to save key/value pairs against this assignment instance for this plugin.

#### get_form_elements_for_user()

```php
public function get_form_elements_for_user(
    $grade,
    MoodleQuickForm $mform,
    stdClass $data,
    $userid
) {
    $fileoptions = $this->get_file_options();
    $gradeid = $grade ? $grade->id : 0;
    $elementname = "files_{$userid}";

    $data = file_prepare_standard_filemanager(
        $data,
        $elementname,
        $fileoptions,
        $this->assignment->get_context(),
        'assignfeedback_file',
        ASSIGNFEEDBACK_FILE_FILEAREA,
        $gradeid
    );
    $mform->addElement(
        'filemanager',
        "{$elementname}_filemanager",
        html_writer::tag(
            'span',
            $this->get_name(),
            ['class' => 'accesshide']
        ),
        null,
        $fileoptions
    );

    return true;
}
```

This function is called when building the feedback form. It functions identically to the get_settings function except that the grade object is available (if there is a grade) to associate the settings with a single grade attempt. This example also shows how to use a filemanager within a feedback plugin. The function must return true if it has modified the form otherwise the assignment will not include a header for this plugin. Notice there is an older version of this function "get_form_elements" which does not accept a userid as a parameter - this version is less useful - not recommended.

#### is_feedback_modified()

```php
public function is_feedback_modified(stdClass $grade, stdClass $data) {
    $commenttext = '';
    if ($grade) {
        $feedbackcomments = $this->get_feedback_comments($grade->id);
        if ($feedbackcomments) {
            $commenttext = $feedbackcomments->commenttext;
        }
    }

    if ($commenttext == $data->assignfeedbackcomments_editor[]('text')) {
        return false;
    } else {
        return true;
    }
}
```

This function is called before feedback is saved. If feedback has not been modified then the save() method is not called. This function takes the grade object and submitted data from the grading form. In this example we are comparing the existing text comments made with the new ones. This function must return a boolean; True if the feedback has been modified; False if there has been no modification made. If this method is not overwritten then it will default to returning True.

#### save()

```php
public function save(stdClass $grade, stdClass $data) {
    global $DB;

    $fileoptions = $this->get_file_options();

    $userid = $grade->userid;
    $elementname = 'files_' . $userid;

    $data = file_postupdate_standard_filemanager(
        $data,
        $elementname,
        $fileoptions,
        $this->assignment->get_context(),
        'assignfeedback_file',
        ASSIGNFEEDBACK_FILE_FILEAREA,
        $grade->id
    );

    $filefeedback = $this->get_file_feedback($grade->id);
    if ($filefeedback) {
        $filefeedback->numfiles = $this->count_files($grade->id, ASSIGNFEEDBACK_FILE_FILEAREA);
        return $DB->update_record('assignfeedback_file', $filefeedback);
    } else {
        $filefeedback = new stdClass();
        $filefeedback->numfiles = $this->count_files($grade->id, ASSIGNFEEDBACK_FILE_FILEAREA);
        $filefeedback->grade = $grade->id;
        $filefeedback->assignment = $this->assignment->get_instance()->id;
        return $DB->insert_record('assignfeedback_file', $filefeedback) > 0;
    }
}
```

This function is called to save a graders feedback. The parameters are the grade object and the data from the feedback form. This example calls `file_postupdate_standard_filemanager` to copy the files from the draft file area to the filearea for this feedback. It then records the number of files in the plugin specific `assignfeedback_file` table.

#### view_summary()

```php
public function view_summary(stdClass $grade, & $showviewlink) {
    $count = $this->count_files($grade->id, ASSIGNFEEDBACK_FILE_FILEAREA);
    // show a view all link if the number of files is over this limit
    $showviewlink = $count > ASSIGNFEEDBACK_FILE_MAXSUMMARYFILES;

    if ($count <= ASSIGNFEEDBACK_FILE_MAXSUMMARYFILES) {
        return $this->assignment->render_area_files(
            'assignfeedback_file',
            ASSIGNFEEDBACK_FILE_FILEAREA,
            $grade->id
        );
    } else {
        return get_string('countfiles', 'assignfeedback_file', $count);
    }
}
```

This function is called to display a summary of the feedback to both markers and students. It counts the number of files and if it is more that a set number, it only displays a count of how many files are in the feedback - otherwise it uses a helper function to write the entire list of files. This is because we want to keep the summaries really short so they can be displayed in a table. There will be a link to view the full feedback on the submission status page.

#### view()

```php
public function view(stdClass $grade) {
    return $this->assignment->render_area_files(
        'assignfeedback_file',
        ASSIGNFEEDBACK_FILE_FILEAREA,
        $grade->id
    );
}
```

This function is called to display the entire feedback to both markers and students. In this case it uses the helper function in the assignment class to write the list of files.

#### can_upgrade()

```php
public function can_upgrade($type, $version) {

    if (($type == 'upload' || $type == 'uploadsingle') && $version >= 2011112900) {
        return true;
    }
    return false;
}
```

This function is used to identify old "Assignment 2.2" subtypes that can be upgraded by this plugin. This plugin supports upgrades from the old "upload" and "uploadsingle" assignment subtypes.

```php
public function upgrade_settings(context $oldcontext, stdClass $oldassignment, &$log) {
    // first upgrade settings (nothing to do)
    return true;
}
```

This function is called once per assignment instance to upgrade the settings from the old assignment to the new mod_assign. In this case it returns true as there are no settings to upgrade.

```php
public function upgrade(
    context $oldcontext,
    stdClass $oldassignment,
    stdClass $oldsubmission,
    stdClass $grade,
    &$log
) {
    global $DB;

    // now copy the area files
    $this->assignment->copy_area_files_for_upgrade(
        $oldcontext->id,
        'mod_assignment',
        'response',
        $oldsubmission->id,
        // New file area
        $this->assignment->get_context()->id,
        'assignfeedback_file',
        ASSIGNFEEDBACK_FILE_FILEAREA,
        $grade->id
    );

    // now count them!
    $filefeedback = new stdClass();
    $filefeedback->numfiles = $this->count_files($grade->id, ASSIGNFEEDBACK_FILE_FILEAREA);
    $filefeedback->grade = $grade->id;
    $filefeedback->assignment = $this->assignment->get_instance()->id;
    if (!$DB->insert_record('assignfeedback_file', $filefeedback) > 0) {
        $log .= get_string('couldnotconvertgrade', 'mod_assign', $grade->userid);
        return false;
    }
    return true;
}
```

This function upgrades a single submission from the old assignment type to the new one. In this case it involves copying all the files from the old filearea to the new one. There is a helper function available in the assignment class for this (Note: the copy will be fast as it is just adding rows to the files table). If this function returns false, the upgrade will be aborted and rolled back.

#### is_empty()

```php
public function is_empty(stdClass $submission) {
    return $this->count_files($submission->id, ASSIGNSUBMISSION_FILE_FILEAREA) == 0;
}
```

If a plugin has no data to show then this function should return true from the `is_empty()` function. This prevents a table row from being added to the feedback summary for this plugin. It is also used to check if a grader has tried to save feedback with no data.

#### get_file_areas()

```php
public function get_file_areas() {
    return [ASSIGNFEEDBACK_FILE_FILEAREA => $this->get_name()];
}
```

A plugin should implement `get_file_areas` if it supports saving of any files to moodle - this allows the file areas to be browsed by the moodle file manager.

#### delete_instance()

```php
public function delete_instance() {
    global $DB;
    // will throw exception on failure
    $DB->delete_records('assignfeedback_file', [
        'assignment' => $this->assignment->get_instance()->id,
    ]);

    return true;
}
```

This function is called when a plugin is deleted. Note only database records need to be cleaned up - files belonging to fileareas for this assignment will be automatically cleaned up.

#### Gradebook features

```php
public function format_for_gradebook(stdClass $grade) {
    return FORMAT_MOODLE;
}

public function text_for_gradebook(stdClass $grade) {
    return '';
}
```

Only one feedback plugin can push comments to the gradebook. Usually this is the feedback_comments plugin - but it can be configured to be any feedback plugin. If the current plugin is the plugin chosen to generate comments for the gradebook, the comment text and format will be taken from these two functions.

```php
/**
 * Override to indicate a plugin supports quickgrading
 *
 * @return boolean - True if the plugin supports quickgrading
 */
public function supports_quickgrading() {
    return false;
}

/**
 * Get quickgrading form elements as html
 *
 * @param int $userid The user id in the table this quickgrading element relates to
 * @param mixed $grade grade or null - The grade data. May be null if there are no grades for this user (yet)
 * @return mixed - A html string containing the html form elements required for quickgrading or false to indicate this plugin does not support quickgrading
 */
public function get_quickgrading_html($userid, $grade) {
    return false;
}

/**
 * Has the plugin quickgrading form element been modified in the current form submission?
 *
 * @param int $userid The user id in the table this quickgrading element relates to
 * @param stdClass $grade The grade
 * @return boolean - true if the quickgrading form element has been modified
 */
public function is_quickgrading_modified($userid, $grade) {
    return false;
}

/**
 * Save quickgrading changes
 *
 * @param int $userid The user id in the table this quickgrading element relates to
 * @param stdClass $grade The grade
 * @return boolean - true if the grade changes were saved correctly
 */
public function save_quickgrading_changes($userid, $grade) {
    return false;
}
```

These 4 functions can be implemented to allow a plugin to support quick-grading. The feedback comments plugin is the only example of this in core.

```php
/**
 * Run cron for this plugin
 */
public static function cron() {
}
```

A plugin can run code when cron runs by implementing this method.

```php
/**
 * Return a list of the grading actions supported by this plugin.
 *
 * A grading action is a page that is not specific to a user but to the whole assignment.
 * @return array - An array of action and description strings.
 *                 The action will be passed to grading_action.
 */
public function get_grading_actions() {
    return [];
}

/**
 * Show a grading action form
 *
 * @param string $gradingaction The action chosen from the grading actions menu
 * @return string The page containing the form
 */
public function grading_action($gradingaction) {
    return '';
}
```

Grading actions appear in the select menu above the grading table and apply to the whole assignment. An example is "Upload grading worksheet". When a grading action is selected, the grading_action will be called with the action that was chosen (so plugins can have multiple entries in the list).

```php
/**
 * Return a list of the batch grading operations supported by this plugin.
 *
 * @return array - An array of action and description strings.
 *                 The action will be passed to grading_batch_operation.
 */
public function get_grading_batch_operations() {
    return [];
}

/**
 * Show a batch operations form
 *
 * @param string $action The action chosen from the batch operations menu
 * @param array $users The list of selected userids
 * @return string The page containing the form
 */
public function grading_batch_operation($action, $users) {
    return '';
}
```

These two callbacks allow adding entries to the batch grading operations list (where you select multiple users in the table and choose e.g. "Lock submissions" for every user). The action is passed to "grading_batch_operation" so that multiple entries can be supported by a plugin.

## Other features

### Add calendar events

<Since
  version="3.1"
  issueNumber="MDL-50886"
/>

From Moodle 3.1 onwards, feedback plugins can add events to the Moodle calendar without side effects. These will be hidden and deleted in line with the assignment module. For example:

```php
// Add release date to calendar
$calendarevent = new stdClass();
$calendarevent->name         = get_string('calendareventname', 'assignsubmission_something');
$calendarevent->description  = get_string('calendareventdesc', 'assignsubmission_something');
$calendarevent->courseid     = $courseid;
$calendarevent->groupid      = 0;
$calendarevent->userid       = $userid;
$calendarevent->modulename   = 'assign';
$calendarevent->instance     = $instanceid;
$calendarevent->eventtype    = 'something_release'; // For activity module's events, this can be used to set the alternative text of the event icon. Set it to 'pluginname' unless you have a better string.
$calendarevent->timestart    = $releasedate;
$calendarevent->visible      = true;
$calendarevent->timeduration = 0;

calendar_event::create($calendarevent);
```
