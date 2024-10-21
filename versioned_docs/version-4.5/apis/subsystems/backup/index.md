---
title: Backup API
tags:
  - Subsystem
  - API
  - Backup
---
The Backup API provides a way to include your plugin's in the course backup. See [Restore API](./restore.md) for the part that takes care of restoring data.

## Overview

This page provides just a quick reference to the backup machinery in Moodle 2.0 and higher. There is a detailed documentation available at [Backup 2.0](https://docs.moodle.org/dev/Backup_2.0) page - see especially the tutorial for plugin authors at [Backup 2.0 for developers](https://docs.moodle.org/dev/Backup_2.0_for_developers) page.

Moodle creates backups of courses or their parts by executing so called *backup plan*. The backup plan consists of a set of *backup tasks* and finally each backup task consists of one or more *backup steps*. You as the developer of a plugin will have to implement one backup task that deals with your plugin data. Most plugins have their backup tasks consisting of a single backup step - the one that creates the XML file with data from your plugin's tables. Some activities may need two or more steps to finish their backup task though (for example the backup task of the Quiz module consists of three steps as it needs to write not just the Quiz setting itself but also the questions used by that particular quiz).

There are subtle differences in how the backup code is organised in various supported plugin types (activity modules, blocks, themes, course reports).

## API for activity modules

### Files

The files that implement the backup support in your activity module must be located in the subdirectory backup/moodle2/ in your plugin's folder. So, if you are developing the activity module called *foobar* then the backup files will be located in mod/foobar/backup/moodle2/ folder.

The following two files are supposed to exist in that location (replace *foobar* with the name of your module):

- **backup_foobar_activity_task.class.php** <br />
Provides the activity task class
- **backup_foobar_stepslib.php** <br />
Provides all the backup steps classes

If your module declares its own backup setting (apart from the ones common for all activity modules provided by the core), you will also want to create the backup_foobar_settingslib.php file to provide the setting classes. However most modules do not need this feature.

### Backup task class

The file backup_foobar_activity_task.class.php must provide a single class called **backup_foobar_activity_task**. All activity tasks extend the backup_activity_task class.

There are three methods that your class must define.

- **protected function define_my_settings()** <br />
If your module declares own backup settings defined in the file backup_foobar_settingslib.php, add them here. Most modules just leave the method body empty.
- **protected function define_my_steps()** <br />
This method typically consists of one or more `$this->add_step()` calls. This is the place where you define the task as a sequence of steps to execute.
- **static public function encode_content_links($content)** <br />
The current instance of the activity may be referenced from other places in the course by URLs like `http://my.moodle.site/mod/foobar/view.php?id=42` Obviously, such URLs are not valid any more once the course is restored elsewhere. For this reason the backup file does not store the original URLs but encodes them into a transportable form. During the restore, the reverse process is applied and the encoded URLs are replaced with the new ones valid for the target site.

### Backup structure step class

The classes that represent the backup steps added in define_my_steps() are implemented in the file backup_foobar_stepslib.php. Most plugins define just a single step in the class called **backup_foobar_activity_structure_step** that extends the backup_activity_structure_step class. This class defines the structure step - that is the step where the structure of your plugin's instance data is described and linked with the data sources.

You have to implement a single method `protected function define_structure()` in this class class. There are three main things that the method must do.

- Create a set of backup_nested_element instances that describe the required data of your plugin
- Connect these instances into a hierarchy using their `add_child()` method
- Set data sources for the elements, using their methods like `set_source_table()` or `set_source_sql()`

The method must return the root backup_nested_element instance processed by the `prepare_activity_structure()` method (which just wraps your structures with a common envelope).

## API for blocks

### Files

The files that implement the backup support in your block must be located in the subdirectory backup/moodle2/ in your plugin's folder. So, if you are developing the block called *foobar* then the backup files will be located in blocks/foobar/backup/moodle2/ folder.

At least the file backup_foobar_block_task.class.php is supposed to exist in that location (replace *foobar* with the name of your block).

If your block defines its own database tables, data from which must be included in the backup, you will want to create a file backup_foobar_stepslib.php, too. Additionally, if your block declares its own backup setting, you will also want to create the backup_foobar_settingslib.php file to provide the setting classes. However most blocks do not need this feature.

### Backup task class

The file backup_foobar_block_task.class.php must provide a single class called **backup_foobar_block_task**. All block tasks extend the backup_block_task class.

There are five methods that your class must define.

- **protected function define_my_settings()** <br />
If your block declares own backup settings defined in the file backup_foobar_settingslib.php, add them here. Most blocks just leave the method body empty.
- **protected function define_my_steps()** <br />
Blocks that do not have their own database tables usually leave this method empty. Otherwise this method consists of one or more `$this->add_step()` calls where you define the task as a sequence of steps to execute.
- **public function get_fileareas()** <br />
Returns the array of file area names within the block context.
- **public function get_configdata_encoded_attributes()** <br />
Instead of using their own tables, blocks usually use the configuration tables to hold their data (see the instance_config_save() of the block class). This method returns the array of all config elements that must be processed before they are stored in the backup. This is typically used when the stored config elements holds links to embedded media. Most blocks just return empty array here.
- **static public function encode_content_links($content)** <br />
If the current instance of the block may be referenced from other places in the course by URLs, it must be encoded into a transportable form. Most blocks just return unmodified $content parameter.

## API for admin tools

The files that implement the backup support in your plugin must be located in the subdirectory *backup/moodle2/* in your plugin's folder. So, if you are developing *tool_foobar* then the backup files will be located in *admin/tool/foobar/backup/moodle2/*.

### Task class

The file  backup_tool_foobar_plugin.class.php must provide a single class called *backup_tool_foobar_task* extending *backup_tool_plugin*.

Here is a minimalistic task:

```php
require_once($CFG->dirroot . '/backup/moodle2/backup_tool_plugin.class.php');

class backup_tool_foobar_plugin extends backup_tool_plugin {

    protected function define_course_plugin_structure() {
        $this->step->log('Yay, backup!', backup::LOG_DEBUG);
        return $plugin;
    }

}
```

## API for themes

See [Backup 2.0 theme data](https://docs.moodle.org/dev/Backup_2.0_theme_data)

## API for reports

See [Backup 2.0 course report data](https://docs.moodle.org/dev/Backup_2.0_course_report_data)

## See also

- [Restore API](./restore.md)
- [Core APIs](../../../apis.md)
