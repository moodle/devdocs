---
title: Activity modules
toc_max_heading_level: 4
tags:
  - API
  - Plugin-type
  - Activity
  - Module
---

## Introduction

Activity modules are a fundamental course feature and are usually the primary delivery method for learning content in Moodle.

The plugintype of an Activity module is `mod`, and the frankenstyle name of a plugin is therefore `mod_[modname]`.

All activity module plugins are located in the `/mod/` folder of Moodle.

:::note

The term `[modname]` is used as a placeholder in this documentation and should be replaced with the name of your activty module.

:::

## Folder layout

Activity modules reside in the `/mod` directory.

Each module is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

Below is an example of the file structure for the `folder` plugin.

<details>
  <summary>View an example directory layout for the `folder` plugin.</summary>
  <div>

```console
.
├── backup
│   ├── moodle1
│   │   └── lib.php
│   └── moodle2
│       ├── backup_folder_activity_task.class.php
│       ├── backup_folder_stepslib.php
│       ├── restore_folder_activity_task.class.php
│       └── restore_folder_stepslib.php
├── classes
│   ├── analytics
│   │   └── indicator
│   │       ├── activity_base.php
│   │       ├── cognitive_depth.php
│   │       └── social_breadth.php
│   ├── content
│   │   └── exporter.php
│   ├── event
│   │   ├── all_files_downloaded.php
│   │   ├── course_module_instance_list_viewed.php
│   │   ├── course_module_viewed.php
│   │   └── folder_updated.php
│   ├── external.php
│   ├── privacy
│   │   └── provider.php
│   └── search
│       └── activity.php
├── db
│   ├── access.php
│   ├── install.php
│   ├── install.xml
│   ├── log.php
│   ├── services.php
│   └── upgrade.php
├── download_folder.php
├── edit.php
├── edit_form.php
├── index.php
├── lang
│   └── en
│       └── folder.php
├── lib.php
├── locallib.php
├── mod_form.php
├── module.js
├── phpunit.xml
├── pix
│   ├── icon.png
│   └── icon.svg
├── readme.txt
├── renderer.php
├── settings.php
├── styles.css
├── tests
│   ├── backup
│   │   └── restore_date_test.php
│   ├── behat
│   │   └── folder_activity_completion.feature
│   ├── event
│   │   └── events_test.php
│   ├── externallib_test.php
│   ├── generator
│   │   └── lib.php
│   ├── generator_test.php
│   ├── lib_test.php
│   ├── phpunit.xml
│   └── search
│       └── search_test.php
├── version.php
└── view.php
```

  </div>
</details>

## Standard Files and their Functions

There are several files that are crucial to Moodle. These files are used to install your module and then integrate it into Moodle. Each file has a particular function, some of the files are optional, and are only created if you want to use the functionality it offers. Below are the list of most commonly used files.

### Backup Folder

If your activity stores data then you should implement the Backup feature which allows the activity to backed up, restored, and duplicated.

For more information on Backup and restore, see the following:

- [[Backup_2.0_for_developers]]
- [[Restore_2.0_for_developers]]

### DB Folder

The `db` folder is used to store files related to the lifecycle of your plugin - that is it's initial installation, and upgrade between versions.

It includes configuration relating to areas such as:

- authorisation
- event generation and handling
- database tables
- scheduled tasks
- web services
- mobile application features
- installation
- upgrade

#### `access.php` - Capability defaults

Authorisation is handled in Moodle by the use of Roles, and Capabilities. You can read more about these in the [Access API](../access.md) documentation.

For activities the following capabilities are _required_:

- `mod/[modname]:addinstance`: Controls whether a user may create a new instance of the activity
- `mod/[modname]:view`: Controls whether a user may view an instance of the activity

##### Suggested defaults for the `mod/[modname]:addinstance` capability

The following is an example with recommended configuration for the `addinstance` capability.

It will allow editing teachers and managers to create new instances, but not non-editing teachers.

```php title="mod/[modname]/db/access.php"
$capabilities = [
    'mod/[modname]:addinstance' => [
        'riskbitmask' => RISK_XSS,
        'captype' => 'write',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ],
        'clonepermissionsfrom' => 'moodle/course:manageactivities',
    ],
];

```

##### Suggested defaults for the `mod/[modname]:view` capability

The view capability was added in {tracker}`MDL-40854`.

The following is an example with recommended configuration for the `view` capability.

It allows all archetypes to view the activity.

```php title="mod/[modname]/db/access.php"
'mod/[modname]:view' => [
    'captype' => 'read',
    'contextlevel' => CONTEXT_MODULE,
    'archetypes' => [
        'guest' => CAP_ALLOW,
        'student' => CAP_ALLOW,
        'teacher' => CAP_ALLOW,
        'editingteacher' => CAP_ALLOW,
        'manager' => CAP_ALLOW,
    ],
],
```

:::important

Granting the view capability to archetypes like `guest` does not allow any user to view all activities. Users are still subject to standard access controls like course enrolment.

:::

For further information on what each attribute in that capabilities array means visit [[NEWMODULE_Adding_capabilities]].

#### `events.php` - Event observers

Moodle supports a feature known as _ [[Events_API#Event_observers|Event observers]] _ to allow components to make changes when certain events take place.

```php title="mod/[modname]/db/events.php"
$observers = [
    [
        'eventname' => '\mod_quiz\event\attempt_submitted',
        'includefile' => '/mod/quiz/locallib.php',
        'callback' => 'quiz_attempt_submitted_handler',
        'internal' => false,
    ],
];
```

For further details on Event observers and the Events API see [[Events API]].

#### `install.xml` - Database installation

The `install.xml` file defines the list of database tables that will be created for your plugin.

Rather than creating, or editing, this file directly you should always use the [[XMLDB_editor]]. You should never modify this file directly.

Moodle requires that you create a table for your plugin whose name exactly matches the plugin name. For example, the `certificate` activity module _must_ have a database table named `certificate`. Certain fields within this table are
also _required_:

| Field name   | Properties              | Keys / Indexes                    | Notes                                                                                     |
| ---          | ---                     | ---                               | ---                                                                                       |
| id           | `INT(10), auto sequence | primary key for the table         |                                                                                           |
| course       | `INT(10)`               | foreign key to the `course` table |                                                                                           |
| name         | `CHAR(255)`             |                                   | Holds the user-specified name of the activity instance                                    |
| timemodified | `INT(10)`               |                                   | The timestamp of when the activity was last modified                                      |
| intro        | `TEXT`                  |                                   | A standard field to hold the user-defined activity description (see `FEAUTURE_MOD_INTRO`) |
| introformat  | `INT(4)`                |                                   | A standard field to hold the format of the field                                          |

#### `upgrade.php` - Upgrade steps

This file handles upgrading the module to match the latest version. After creating a module and using it extensively on your site (and others) you may want to extend the functionality of your module. Using the certificate example, a suggestion was made that a unique code could be generated for each certificate issued and displayed if a setting was selected. This requires two new database fields, one to store whether the creator of the certificate has chosen to display the code on the certificate and another to store the actual code for each student. This is where the upgrade.php script becomes used.

The `install.xml` file is only executed once, that is when your module is first installed, so adding these two extra columns to this file does not change the database structure for users who have already installed the module.

To perform this upgrade you need to do three things:

1. Use the [[XMLDB_editor]] to create the definition of the new fields
1. Update the `install.xml` from the XMLDB editor
1. Generate the PHP upgrade steps from within the XMLDB Editor
1. Update the version number in your `version.php`

In many cases you will be able to combine multiple upgrade steps into a single version change.

An example of the upgrade.php file is as follows -

```php
function xmldb_certificate_upgrade($oldversion = 0) {
    if ($oldversion < 2012091800) {
        // Add new fields to certificate table.
        $table = new xmldb_table('certificate');
        $field = new xmldb_field('showcode');
        $field->set_attributes(XMLDB_TYPE_INTEGER, '1', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0', 'savecert');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        // Add new fields to certificate_issues table.
        $table = new xmldb_table('certificate_issues');
        $field = new xmldb_field('code');
        $field->set_attributes(XMLDB_TYPE_CHAR, '50', null, null, null, null, 'certificateid');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Certificate savepoint reached.
        upgrade_mod_savepoint(true, 2012091800, 'certificate');
    }
}
```

When a version number increment is detected during an upgrade, the `xmldb_[modname]_upgrade` function is called with the old version number as the first argument.

See the [[Upgrade API]] documentation for more information on the upgrade process.

#### `mobile.php` - Moodle Mobile Remote Add-ons

The Moodle Mobile remote add-on is the mobile app version of the plugin that will be loaded when a user accesses the plugin on the app.

A plugin can include several Mobile add-ons. Each add-on must indicate a unique name.

See the [[Moodle App Plugins Development Guide]] for more information on configuring your plugin for the Moodle MobileApp.

### `/lang/en/mod_[modname].php` - Language string definitions

Every plugin must define a language string definition file, which contains the name of the plugin as a minimum requirement.

:::info

See the [[String API#Adding_language_file_to_plugin|String API]] documentation for more information on the format of this file.

:::

```php title="mod/[modname]/lang/en/mod_[modname].php"
$string['pluginname'] = 'The name of your activity';
```

The `get_string` API can be used to translate a string identifier into a translated string.

```php title="mod/[modname]/example.php
get_string('pluginname', '[modname]');
```

### `lib.php` - Library functions

See the [[NEWMODULE Documentation#lib.php]] for details on the list of the functions which can be specified in `lib.php`.

As a minimum you _must_ define the following three functions, which are described below:

```php title="mod/[modname]/lib.php"
function [modname]_add_instance($instancedata, $mform = null): int;
function [modname]_update_instance($instancedata, $mform): bool;
function [modname]_delete_instance($id): bool;
```

- The `[modname]_add_instance()` function is called when the activity creation form is submitted. This function is only called when adding an activity and should contain any logic required to add the activity.
- The `[modname]_update_instance()` function is called when the activity editing form is submitted.
- The `[modname]_delete_instance()` function is called when the activity deletion is confirmed. It is responsible for removing all data associated with the instance.

:::note

The `lib.php` file is one of the older parts of Moodle and functionality is gradually being migrated to class-based function calls.

:::

### `mod_form.php` - Instance create/edit form

This file is used when adding/editing a module to a course. It contains the elements that will be displayed on the form responsible for creating/installing an instance of your module. The class in the file should be called `mod_[modname]_mod_form`.

:::warning

The `mod_[modname]_mod_form` is a current exception to the class autoloading rules.

This will be addressed in {tracker}`MDL-74472`.

:::

```php title="mod/[modname]/mod_form.php"
<?php
if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');    //  It must be included from a Moodle page
}

require_once($CFG->dirroot.'/course/moodleform_mod.php');
require_once($CFG->dirroot.'/mod/certificate/lib.php');

class mod_certificate_mod_form extends moodleform_mod {

    function definition() {
        global $CFG, $DB, $OUTPUT;

        $mform =& $this->_form;

        $mform->addElement('text', 'name', get_string('certificatename', 'certificate'), ['size'=>'64']);
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');

        $ynoptions = [
            0 => get_string('no'),
            1 => get_string('yes'),
        ];
        $mform->addElement('select', 'usecode', get_string('usecode', 'certificate'), $ynoptions);
        $mform->setDefault('usecode', 0);
        $mform->addHelpButton('usecode', 'usecode', 'certificate');

        $this->standard_coursemodule_elements();

        $this->add_action_buttons();
    }
}
```

The above example does not contain the full file, just enough to provide you with an idea. First we create a text element called 'name' that is required, this is obviously the name of the instance. I then created another element that stores whether a user wishes to display the unique code issued to a user when they receive the certificate or not with a default value of 0 and a help button explaining what this setting does. The function standard_coursemodule_elements adds the elements common to all modules, such as the conditional fields. The add_action_buttons function adds the submit and cancel buttons to the form. This data will be passed to either `[modname]_add_instance` or `[modname]_update_instance` depending on whether you are adding a new instance or updating a current one. You can also add validation to this form, just like any other form in Moodle. For more information on how to create forms in Moodle see [[Form_API]].

### `index.php` - Instance list

The `index.php` should be used to list all instances of an activity that the current user has access to in the specified course.

```php title="mod/[modname]/index.php"
<?php
require_once('../../config.php');

// The `id` parameter is the course id.
$id = required_param('id', PARAM_INT);

// Fetch the requested course.
$course = $DB->get_record('course', ['id'=> $id], '*', MUST_EXIST);

// Require that the user is logged into the course.
require_course_login($course);

$modinfo = get_fast_modinfo($course);

foreach ($modinfo->get_instances_of('[modinfo]') as $instanceid => $cm) {
    // Display information about your activity.
}
```

### `view.php` - View an activity

Moodle will automatically generate links to view the activity using the `/view.php` page and passing in an `id` value. The `id` passed is the course module ID, which can be used to fetch all remaining data for the activity instance.

```php title="mod/[modname]/view.php"
<?php

require('../../config.php');

$id = required_param('id', PARAM_INT);
[$course, $cm] = get_course_and_cm_from_cmid($id, '[modname]');
$instance = $DB->get_record('[modname]', ['id'=> $cm->instance], '*', MUST_EXIST);
```

### `version.php`

The `version.php` file keeps track of the version of your module, and other attributes, such as what version of Moodle it requires. For a full list of the attributes please see [[version.php]].

## See also

- [[NEWMODULE_Documentation]]
