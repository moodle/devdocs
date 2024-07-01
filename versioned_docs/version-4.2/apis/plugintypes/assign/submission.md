---
title: Assign submission plugins
tags:
  - Assign
  - Assignment
  - Submission
  - Subplugin
toc_max_heading_level: 4
description: Assign submission plugins allow you to define different ways for a student to submit their work
---

import {
    SettingsPHP,
    LocalLib,
} from '../../_files';
export const plugintype = 'assignsubmission';

An assignment submission plugin is used to display custom form fields to a student when they are editing their assignment submission. It also has full control over the display the submitted assignment to graders and students.

:::tip

For a good reference implementation, see the [onlinetext](https://github.com/moodle/moodle/tree/main/mod/assign/submission/onlinetext) submission plugin included with core because it uses most of the features of submission plugins.

:::

## File structure

Assignment Feedback plugins are located in the `/mod/assign/submission` directory. A plugin should not include any custom files outside of it's own plugin folder.

:::important Plugin naming

The plugin name should be no longer than 11 characters - this is because the database tables for a submission plugin must be prefixed with `assignsubmission_[pluginname]` (17 chars + X) and the table names can be no longer than 28 chars due to a limitation with Oracle.

If a plugin requires multiple database tables, the plugin name will need to be shorter to allow different table names to fit under the 28 character limit.

:::

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

:::important

Some of the important files are described below. See the [common plugin files](../../commonfiles/index.mdx) documentation for details of other files which may be useful in your plugin.

:::

<details>
  <summary>View an example directory layout for the `assignfeedback_file` plugin.</summary>

```console
mod/assign/submission/file
├── backup
│   └── moodle2
│       ├── backup_assignsubmission_file_subplugin.class.php
│       └── restore_assignsubmission_file_subplugin.class.php
├── classes
│   ├── event
│   │   ├── assessable_uploaded.php
│   │   ├── submission_created.php
│   │   └── submission_updated.php
│   └── privacy
│       └── provider.php
├── db
│   ├── access.php
│   └── install.xml
├── lang
│   └── en
│       └── assignsubmission_file.php
├── lib.php
├── locallib.php
├── settings.php
└── version.php
```

</details>

### settings.php

<!-- markdownlint-capture -->
<!-- markdownlint-disable no-space-in-code -->
<!-- markdownlint-disable blanks-around-fences -->
<!-- markdownlint-disable code-block-style -->

import settingsExample from '!!raw-loader!./_files/submission_settings.php';

export const settingsExtra = `
All submission plugins should include one setting named 'default' to indicate if the plugin should be enabled by default when creating a new assignment.
`;

<SettingsPHP
    plugintype={plugintype}
    pluginname="file"
    example={settingsExample}
    extraDescription={settingsExtra}
/>

<!-- markdownlint-restore -->

:::info

This example from the submission_file plugin also checks to see if there is a maxbytes setting for this moodle installation and, if found,  adds a new admin setting to the settings page.

:::

### locallib.php

<!-- markdownlint-save -->
<!-- markdownlint-disable code-block-style -->

<LocalLib
    required
    legacy={false}
    defaultDescription={false}
>
</LocalLib>

<!-- markdownlint-disable first-line-heading -->
This is where all the functionality for this plugin is defined. We will step through this file and describe each part as we go.

```php
class assign_submission_file extends assign_submission_plugin {
```

All submission plugins MUST define a class with the component name of the plugin that extends assign_submission_plugin.

#### get_name()

```php
public function get_name() {
    return get_string('file', 'assignsubmission_file');
}
```

Get name is abstract in submission_plugin and must be defined in your new plugin. Use the language strings to make your plugin translatable.

#### get_settings()

```php
public function get_settings(MoodleQuickForm $mform) {
    global $CFG, $COURSE;

    $defaultmaxfilesubmissions = $this->get_config('maxfilesubmissions');
    $defaultmaxsubmissionsizebytes = $this->get_config('maxsubmissionsizebytes');

    $settings = [];
    $options = [];
    for ($i = 1; $i <= ASSIGNSUBMISSION_FILE_MAXFILES; $i++) {
        $options[$i] = $i;
    }

    $name = get_string('maxfilessubmission', 'assignsubmission_file');
    $mform->addElement('select', 'assignsubmission_file_maxfiles', $name, $options);
    $mform->addHelpButton(
        'assignsubmission_file_maxfiles',
        'maxfilessubmission',
        'assignsubmission_file'
    );
    $mform->setDefault('assignsubmission_file_maxfiles', $defaultmaxfilesubmissions);
    $mform->disabledIf('assignsubmission_file_maxfiles', 'assignsubmission_file_enabled', 'notchecked');

    $choices = get_max_upload_sizes(
        $CFG->maxbytes,
        $COURSE->maxbytes,
        get_config('assignsubmission_file', 'maxbytes')
    );

    $settings[] = [
        'type' => 'select',
        'name' => 'maxsubmissionsizebytes',
        'description' => get_string('maximumsubmissionsize', 'assignsubmission_file'),
        'options'=> $choices,
        'default'=> $defaultmaxsubmissionsizebytes,
    ];

    $name = get_string('maximumsubmissionsize', 'assignsubmission_file');
    $mform->addElement('select', 'assignsubmission_file_maxsizebytes', $name, $choices);
    $mform->addHelpButton(
        'assignsubmission_file_maxsizebytes',
        'maximumsubmissionsize',
        'assignsubmission_file'
    );
    $mform->setDefault('assignsubmission_file_maxsizebytes', $defaultmaxsubmissionsizebytes);
    $mform->disabledIf(
        'assignsubmission_file_maxsizebytes',
        'assignsubmission_file_enabled',
        'notchecked'
    );
}
```

The "get_settings" function is called when building the settings page for the assignment. It allows this plugin to add a list of settings to the form. Notice that the settings are prefixed by the plugin name which is good practice to avoid conflicts with other plugins.

#### save_settings()

```php
public function save_settings(stdClass $data) {
    $this->set_config('maxfilesubmissions', $data->assignsubmission_file_maxfiles);
    $this->set_config('maxsubmissionsizebytes', $data->assignsubmission_file_maxsizebytes);
    return true;
}
```

The "save_settings" function is called when the assignment settings page is submitted, either for a new assignment or when editing an existing one. For settings specific to a single instance of the assignment you can use the assign_plugin::set_config function shown here to save key/value pairs against this assignment instance for this plugin.

#### get_form_elements()

```php
public function get_form_elements($submission, MoodleQuickForm $mform, stdClass $data) {
    if ($this->get_config('maxfilesubmissions') <= 0) {
        return false;
    }

    $fileoptions = $this->get_file_options();
    $submissionid = $submission ? $submission->id : 0;

    $data = file_prepare_standard_filemanager(
        $data,
        'files',
        $fileoptions,
        $this->assignment->get_context(),
        'assignsubmission_file',
        ASSIGNSUBMISSION_FILE_FILEAREA,
        $submissionid
    );

    $mform->addElement(
        'filemanager',
        'files_filemanager',
        html_writer::tag('span', $this->get_name(), ['class' => 'accesshide']),
        null,
        $fileoption
    );

    return true;
}
```

The get_form_elements function is called when building the submission form. It functions identically to the get_settings function except that the submission object is available (if there is a submission) to associate the settings with a single submission. This example also shows how to use a filemanager within a submission plugin. The function must return true if it has modified the form otherwise the assignment will not include a header for this plugin.

#### save()

```php
public function save(stdClass $submission, stdClass $data) {
    global $USER, $DB;

    $fileoptions = $this->get_file_options();

    $data = file_postupdate_standard_filemanager(
        $data,
        'files',
        $fileoptions,
        $this->assignment->get_context(),
        'assignsubmission_file',
        ASSIGNSUBMISSION_FILE_FILEAREA,
        $submission->id
    );

    $filesubmission = $this->get_file_submission($submission->id);

    // Plagiarism code event trigger when files are uploaded.

    $fs = get_file_storage();
    $files = $fs->get_area_files(
        $this->assignment->get_context()->id,
        'assignsubmission_file',
        ASSIGNSUBMISSION_FILE_FILEAREA,
        $submission->id,
        'id',
        false
    );

    $count = $this->count_files($submission->id, ASSIGNSUBMISSION_FILE_FILEAREA);

    // Send files to event system.
    // This lets Moodle know that an assessable file was uploaded (eg for plagiarism detection).
    $eventdata = new stdClass();
    $eventdata->modulename = 'assign';
    $eventdata->cmid = $this->assignment->get_course_module()->id;
    $eventdata->itemid = $submission->id;
    $eventdata->courseid = $this->assignment->get_course()->id;
    $eventdata->userid = $USER->id;
    if ($count > 1) {
        $eventdata->files = $files;
    }
    $eventdata->file = $files;
    $eventdata->pathnamehashes = array_keys($files);
    events_trigger('assessable_file_uploaded', $eventdata);

    if ($filesubmission) {
        $filesubmission->numfiles = $this->count_files($submission->id,
                                                        ASSIGNSUBMISSION_FILE_FILEAREA);
        return $DB->update_record('assignsubmission_file', $filesubmission);
    } else {
        $filesubmission = new stdClass();
        $filesubmission->numfiles = $this->count_files($submission->id,
                                                        ASSIGNSUBMISSION_FILE_FILEAREA);
        $filesubmission->submission = $submission->id;
        $filesubmission->assignment = $this->assignment->get_instance()->id;
        return $DB->insert_record('assignsubmission_file', $filesubmission) > 0;
    }
```

The "save" function is called to save a user submission. The parameters are the submission object and the data from the submission form. This example calls `file_postupdate_standard_filemanager` to copy the files from the draft file area to the filearea for this submission, it then uses the event api to trigger an assessable_file_uploaded event for the plagiarism api. It then records the number of files in the plugin specific "assignsubmission_file" table.

#### get_files()

```php
public function get_files($submission) {
    $result = [];
    $fs = get_file_storage();

    $files = $fs->get_area_files(
        $this->assignment->get_context()->id,
        'assignsubmission_file',
        ASSIGNSUBMISSION_FILE_FILEAREA,
        $submission->id,
        'timemodified',
        false
    );

    foreach ($files as $file) {
        $result[$file->get_filename()] = $file;
    }
    return $result;
}
```

If this submission plugin produces one or more files, it should implement "get_files" so that the portfolio API can export a list of all the files from all of the plugins for this assignment submission. This is also used by the offline grading feature in the assignment.

#### view_summary()

```php
public function view_summary(stdClass $submission, & $showviewlink) {
    $count = $this->count_files($submission->id, ASSIGNSUBMISSION_FILE_FILEAREA);

    // Show we show a link to view all files for this plugin.
    $showviewlink = $count > ASSIGNSUBMISSION_FILE_MAXSUMMARYFILES;
    if ($count <= ASSIGNSUBMISSION_FILE_MAXSUMMARYFILES) {
        return $this->assignment->render_area_files(
            'assignsubmission_file',
            ASSIGNSUBMISSION_FILE_FILEAREA,
            $submission->id
        );
    }

    return get_string('countfiles', 'assignsubmission_file', $count);
}
```

The view_summary function is called to display a summary of the submission to both markers and students. It counts the number of files submitted and if it is more that a set number, it only displays a count of how many files are in the submission - otherwise it uses a helper function to write the entire list of files. This is because we want to keep the summaries really short so they can be displayed in a table. There will be a link to view the full submission on the submission status page.

#### view()

```php
public function view($submission) {
    return $this->assignment->render_area_files(
        'assignsubmission_file',
        ASSIGNSUBMISSION_FILE_FILEAREA,
        $submission->id
    );
}
```

The view function is called to display the entire submission to both markers and students. In this case it uses the helper function in the assignment class to write the list of files.

#### can_upgrade()

```php
public function can_upgrade($type, $version) {
    $uploadsingle_type ='uploadsingle';
    $upload_type ='upload';

    if (($type == $uploadsingle_type || $type == $upload_type) && $version >= 2011112900) {
        return true;
    }
    return false;
}
```

The can_upgrade function is used to identify old "Assignment 2.2" subtypes that can be upgraded by this plugin. This plugin supports upgrades from the old "upload" and "uploadsingle" assignment subtypes.

#### upgrade_settings()

```php
public function upgrade_settings(context $oldcontext, stdClass $oldassignment, &$log) {
    global $DB;

    if ($oldassignment->assignmenttype == 'uploadsingle') {
        $this->set_config('maxfilesubmissions', 1);
        $this->set_config('maxsubmissionsizebytes', $oldassignment->maxbytes);
        return true;
    }

    if ($oldassignment->assignmenttype == 'upload') {
        $this->set_config('maxfilesubmissions', $oldassignment->var1);
        $this->set_config('maxsubmissionsizebytes', $oldassignment->maxbytes);

        // Advanced file upload uses a different setting to do the same thing.
        $DB->set_field(
            'assign',
            'submissiondrafts',
            $oldassignment->var4,
            ['id' => $this->assignment->get_instance()->id]
        );

        // Convert advanced file upload "hide description before due date" setting.
        $alwaysshow = 0;
        if (!$oldassignment->var3) {
            $alwaysshow = 1;
        }
        $DB->set_field(
            'assign',
            'alwaysshowdescription',
            $alwaysshow,
            ['id' => $this->assignment->get_instance()->id]
        );
        return true;
    }
}
```

This function is called once per assignment instance to upgrade the settings from the old assignment to the new mod_assign. In this case it sets the `maxbytes`, `maxfiles` and `alwaysshowdescription` configuration settings.

#### upgrade()

```php
public function upgrade($oldcontext, $oldassignment, $oldsubmission, $submission, &$log) {
    global $DB;

    $filesubmission = (object) [
        'numfiles' => $oldsubmission->numfiles,
        'submission' => $submission->id,
        'assignment' => $this->assignment->get_instance()->id,
    ];

    if (!$DB->insert_record('assign_submission_file', $filesubmission) > 0) {
        $log .= get_string('couldnotconvertsubmission', 'mod_assign', $submission->userid);
        return false;
    }

    // now copy the area files
    $this->assignment->copy_area_files_for_upgrade(
        $oldcontext->id,
        'mod_assignment',
        'submission',
        $oldsubmission->id,
        // New file area
        $this->assignment->get_context()->id,
        'mod_assign',
        ASSIGN_FILEAREA_SUBMISSION_FILES,
        $submission->id
    );

    return true;
}
```

The "upgrade" function upgrades a single submission from the old assignment type to the new one. In this case it involves copying all the files from the old filearea to the new one. There is a helper function available in the assignment class for this (Note: the copy will be fast as it is just adding rows to the files table). If this function returns false, the upgrade will be aborted and rolled back.

#### get_editor_fields()

```php
public function () {
    return [
        'onlinetext' => get_string('pluginname', 'assignsubmission_comments'),
    ];
}
```

This example is from assignsubmission_onlinetext. If the plugin uses a text-editor it is ideal if the plugin implements "get_editor_fields". This allows the portfolio to retrieve the text from the plugin when exporting the list of files for a submission. This is required because the text is stored in the plugin specific table that is only known to the plugin itself. If a plugin supports multiple text areas it can return the name of each of them here.

#### get_editor_text()

```php
public function get_editor_text($name, $submissionid) {
    if ($name == 'onlinetext') {
        $onlinetextsubmission = $this->get_onlinetext_submission($submissionid);
        if ($onlinetextsubmission) {
            return $onlinetextsubmission->onlinetext;
        }
    }

    return '';
}
```

This example is from assignsubmission_onlinetext. If the plugin uses a text-editor it is ideal if the plugin implements "get_editor_text". This allows the portfolio to retrieve the text from the plugin when exporting the list of files for a submission. This is required because the text is stored in the plugin specific table that is only known to the plugin itself. The name is used to distinguish between multiple text areas in the one plugin.

#### get_editor_format()

```php
public function get_editor_format($name, $submissionid) {
    if ($name == 'onlinetext') {
        $onlinetextsubmission = $this->get_onlinetext_submission($submissionid);
        if ($onlinetextsubmission) {
            return $onlinetextsubmission->onlineformat;
        }
    }

    return 0;
}
```

This example is from assignsubmission_onlinetext. For the same reason as the previous function, if the plugin uses a text editor, it is ideal if the plugin implements "get_editor_format". This allows the portfolio to retrieve the text from the plugin when exporting the list of files for a submission. This is required because the text is stored in the plugin specific table that is only known to the plugin itself. The name is used to distinguish between multiple text areas in the one plugin.

#### is_empty()

```php
public function is_empty(stdClass $submission) {
    return $this->count_files($submission->id, ASSIGNSUBMISSION_FILE_FILEAREA) == 0;
}
```

If a plugin has no submission data to show - it can return true from the is_empty function. This prevents a table row being added to the submission summary for this plugin. It is also used to check if a student has tried to save an assignment with no data.

#### submission_is_empty()

```php
public function submission_is_empty() {
    global $USER;
    $fs = get_file_storage();

    // Get a count of all the draft files, excluding any directories.
    $files = $fs->get_area_files(
        context_user::instance($USER->id)->id,
        'user',
        'draft',
        $data->files_filemanager,
        'id',
        false
    );

    return count($files) == 0;
}
```

Determine if a submission is empty. This is distinct from is_empty() in that it is intended to be used to determine if a submission made before saving is empty.

#### get_file_areas()

```php
public function get_file_areas() {
    return [ASSIGNSUBMISSION_FILE_FILEAREA=>$this->get_name()];
}
```

A plugin should implement get_file_areas if it supports saving of any files to moodle - this allows the file areas to be browsed by the moodle file manager.

#### copy_submission()

```php
public function copy_submission(stdClass $sourcesubmission, stdClass $destsubmission) {
    global $DB;

    // Copy the files across.
    $contextid = $this->assignment->get_context()->id;
    $fs = get_file_storage();
    $files = $fs->get_area_files(
        $contextid,
        'assignsubmission_file',
        ASSIGNSUBMISSION_FILE_FILEAREA,
        $sourcesubmission->id,
        'id',
        false
    );
    foreach ($files as $file) {
        $fieldupdates = ['itemid' => $destsubmission->id];
        $fs->create_file_from_storedfile($fieldupdates, $file);
    }

    // Copy the assignsubmission_file record.
    if ($filesubmission = $this->get_file_submission($sourcesubmission->id)) {
        unset($filesubmission->id);
        $filesubmission->submission = $destsubmission->id;
        $DB->insert_record('assignsubmission_file', $filesubmission);
    }
    return true;
}
```

Since Moodle 2.5 - a students submission can be copied to create a new submission attempt. Plugins should implement this function if they store data associated with the submission (most plugins).

#### format_for_log()

```php
public function format_for_log(stdClass $submission) {
    // Format the information for each submission plugin add_to_log
    $filecount = $this->count_files($submission->id, ASSIGNSUBMISSION_FILE_FILEAREA);
    return ' the number of file(s) : ' . $filecount . " file(s).<br>";
}
```

The format_for_log function lets a plugin produce a really short summary of a submission suitable for adding to a log message.

#### delete_instance()

```php
public function delete_instance() {
    global $DB;
    // Will throw exception on failure
    $DB->delete_records('assignsubmission_file', [
        'assignment'=>$this->assignment->get_instance()->id,
    ]);

    return true;
}
```

The delete_instance function is called when a plugin is deleted. Note only database records need to be cleaned up - files belonging to fileareas for this assignment will be automatically cleaned up.

## Useful classes

A submission plugin has access to a number of useful classes in the assignment module. See the phpdocs (or the code) for more information on these classes.

### assign_plugin

This abstract class is the base class for all assignment plugins (feedback or submission plugins).

It provides access to the assign class which represents the current assignment instance through "$this->assignment".

### assign_submission_plugin

This is the base class all assignment submission plugins must extend. It contains a small number of additional function that only apply to submission plugins.

### assign

This is the main class for interacting with the assignment module.

It contains public functions that are useful for listing users, loading and updating submissions, loading and updating grades, displaying users etc.

## Other features

### Add calendar events

<Since version="3.1" />

Submission plugins can add events to the Moodle calendar without side effects. These will be hidden and deleted in line with the assignment module. For example:

```php
// Add release date to calendar.
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

This code should be placed in the `save_settings()` method of your assign_submission_plugin class.
