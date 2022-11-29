---
title: Developer FAQ
tags:
  - FAQ
  - Developers
  - Getting started
---

<!-- cspell:ignore HRDNZ -->

## Help for new coders

### Where can I download Moodle?

There are various ways you can download and install Moodle on your system.

- Visit our [download page](https://download.moodle.org/)
- Clone from [Moodle's Git repository](https://github.com/moodle/moodle) or find out more about using [Git for developers](https://docs.moodle.org/dev/Git_for_developers)

### Where can I start?

This very website is a great place to find out more how you can be a Moodle developer. Navigate the various sections to find out more.

- [Guides](/docs/) for Developer Documentation
- [Community](../../community/contribute.md) for more information on how you can contribute
- [Coding](../gettingstarted.md) for Moodle coding standards
- [Process](../process.md) to learn how the development cycle works

#### Extend your learning

- [Moodle Academy](https://moodle.academy/) online courses
- MoodleBites for Developers online courses [Level 1](https://www.moodlebites.com/mod/page/view.php?id=24546) and [Level 2](https://www.moodlebites.com/mod/page/view.php?id=19542)

### Who can I ask for help?

The Moodle community is an active group of teachers and developers that have most likely encountered many of the same questions you might have. We encourage you to reach out and get involved in the available ways provided on our [Support channels](../../channels) page.

### How do I create a patch?

If you have made some changes to the code that you would like to share with the community, learn how to [create a patch](https://docs.moodle.org/dev/Git_for_developers#Preparing_a_patch).

### How do I create a module or plugin?

Use the following resources to help get you started with modules and plugins.

- [Plugin tutorial](https://docs.moodle.org/dev/Tutorial)
- [Plugin types](/docs/apis/plugintypes)

### Is there any information on backup and restore?

Learn how to use Moodle's [backup](/docs/apis/subsystems/backup) and [restore](/docs/apis/subsystems/backup/restore) APIs.

### How can I customise Moodle with my own plugin?

[Local plugins](/docs/apis/plugintypes/local) are a great way to customise Moodle when no standard plugin fits.

## Moodle's database

### Where can I see a schema for the structure of the Moodle database?

[Database schema introduction](https://docs.moodle.org/dev/Database_Schema) gives a high level overview of the database schema.

Because of Moodle's modular nature, there is no single, detailed representation of the full database schema. Instead, the tables for each part of Moodle are defined in a database-neutral XML format in each part of Moodle (see [XMLDB](https://docs.moodle.org/dev/XMLDB_editor)). Look for files called `install.xml` located in folders called `db` throughout your Moodle installation.

Alternatively, log in as an administrator on your Moodle site and go to _Site administration -> Development -> XMLDB editor_. Use the _Doc_ link to see automatically generated documentation built from `install.xml` files.

See also [XMLDB documentation](https://docs.moodle.org/dev/XMLDB).

### How do I find out the currently-logged-on user?

The global object `$USER` contains various properties pertaining to the currently logged in user. Here are just a few examples.

- First name `$USER->firstname`
- Last name `$USER->lastname`
- User ID `$USER->id`

### How do I find out the current course?

Just like the global object `$USER`, there is a global object called `$COURSE` which contains details about a course.

- Course ID `$COURSE->id`
- Course name `$COURSE->fullname`

### How do I insert/retrieve records in the database?

Use the global `$DB` object, as described in the [Data manipulation API](/docs/apis/core/dml) documentation, to insert and retrieve data without having to create your own database connection.

### How do I get/set configuration settings?

#### config table

To get config values you would typically access the global `$CFG` object directly, which is automatically created by the core Moodle scripts. To set these **main** config values use `set_config($name, $value)`. The values are stored in the Moodle _config_ database table, but these functions take care of cacheing on your behalf, so you should always use these rather than fetching the records directly.

#### config_plugin table

There is also a second table of config settings specifically for plugins called _config_plugin_. These are not automatically loaded into the `$CFG` object. To get these you would use `get_config($plugin, $name)`. To set them use `set_config($name, $value, $plugin)`.

On top of those global configuration values, individual blocks may also have a configuration object associated with it (the data is serialised and stored in the _block_instance_ table). Within blocks, this data is automatically loaded into the _config_ attribute of the block.

### How do I migrate my Moodle site?

There may be times when you need to move your Moodle site from one server to another. Find out all about [migrating your Moodle site](https://docs.moodle.org/en/Moodle_migration).

## Learn more

For a comprehensive introduction to developing with Moodle, complete the [Developer pathway course](https://moodle.academy/course/index.php?categoryid=4) over at [Moodle Academy](https://moodle.academy/) where you will learn:

- How to set up your Moodle development environment
- Understand Moodle's modular architecture
- How to update Moodle plugins
- Moodle security essentials
- Implement accessibility features
- How to unit test your Moodle site
