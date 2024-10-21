---
title: Restore API
tags:
  - Subsystem
  - API
  - Backup
---
The Restore API provides a way to restore your plugin's data from a backup file created in Moodle 2.0 or later. For the information on how backup files are created, see [Backup API](./index.md). For the information on how to support restoring data from backup files created in Moodle 1.x, see [Backup conversion API](https://docs.moodle.org/dev/Backup_conversion_API).

## Overview

This page provides just a quick reference to the restore machinery in Moodle 2.0 and higher. There is a detailed documentation available at [Backup 2.0](https://docs.moodle.org/dev/Backup_2.0) page - see especially the tutorial for plugin authors at [Restore 2.0 for developers](https://docs.moodle.org/dev/Restore_2.0_for_developers) page.

Moodle restores data from course backups by executing so called *restore plan*. The restore plan consists of a set of *restore tasks* and finally each restore task consists of one or more *restore steps*. You as the developer of a plugin will have to implement one restore task that deals with your plugin data. Most plugins have their restore tasks consisting of a single restore step - the one that parses the plugin XML file and puts the data into its tables.

## API for activity modules

### Files

The files that implement the restore support in your activity module must be located in the subdirectory `backup/moodle2/` in your plugin's folder (yes, it's the same folder where the backup related files are located). So, if you are developing the activity module called *foobar* then the restore files will be located in `mod/foobar/backup/moodle2/` folder.

The following two files are supposed to exist in that location (replace *foobar* with the name of your module):

- **restore_foobar_activity_task.class.php** <br />
Provides the activity task class
- **restore_foobar_stepslib.php** <br />
Provides all the restore steps classes

(to be continued)

## API for admin tools

The files that implement the backup support in your plugin must be located in the subdirectory `backup/moodle2/` in your plugin's folder. So, if you are developing `tool_foobar` then the backup files will be located in `admin/tool/foobar/backup/moodle2/`.

### Task class

The file `backup_tool_foobar_plugin.class.php` must provide a single class called `restore_tool_foobar_task` extending `restore_tool_plugin`.

Here is a minimalistic task:

```php
require_once($CFG->dirroot . '/backup/moodle2/restore_tool_plugin.class.php');

class restore_tool_foobar_plugin extends restore_tool_plugin {

    protected function define_course_plugin_structure() {
        $paths = array();
        $this->step->log('Yay, restore!', backup::LOG_DEBUG);
        return $paths;
    }

}
```

## See also

- [Core APIs](../../../apis.md)
- [Backup API](../backup)
