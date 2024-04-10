---
title: Frankenstyle component names
sidebar_label: Frankenstyle
tags:
  - Plugins
---
The term 'Frankenstyle component names' refers to the naming convention that is used to uniquely identify a Moodle plugin based on the type of plugin and its name.  They are used throughout the Moodle code (with a notable exception being the css class names in the themes).

## Format

Frankenstyle component names have a prefix and then a folder name, separated by an underscore.

1. The prefix is determined by the type of plugin. For example, the prefix for an activity module is **mod**.
1. The name is the folder name of the plugin, always lower case.  For example, the name for Quiz is **quiz**.

So the frankenstyle component name for the quiz module is **mod_quiz**.

## Plugin types

See [Plugin types](/docs/apis/plugintypes/) page for the list of all supported plugin types in Moodle and their frankenstyle prefix.

To get a definitive list in your version of Moodle 2.x, use a small Moodle script with <tt>print_object(get_plugin_types());</tt>.

## Core subsystems

Subsystems in Moodle are not plugins themselves but can be referred to using **core_[subsystem.]** where the subsystem defined in get_core_subsystems().

Other places that you may see these being used include:

- the PHP Namespace used to autoload classes
- the prefix used in JavaScript module names
- the prefix used in template names
- the `@package` parameter in phpdocs
- the [webservice function names](https://docs.moodle.org/dev/Web_services_Roadmap)

Core subsystems can provide own strings via a file stored in `lang/en/{subsystemname}.php`. Some of them have a dedicated location with libraries, autoloaded classes and other resources.

| Core subsystem | Frankenstyle component name | Location |
| --- | --- | --- |
| Access | core_access |  |
| Administration | core_admin | /admin |
| Antivirus | core_antivirus | /lib/antivirus |
| Authentication | core_auth | /auth |
| Conditional availability | core_availability | /availability |
| Backup and restore | core_backup | /backup/util/ui |
| Badges | core_badges | /badges |
| Blocks | core_block | /blocks |
| Blogging | core_blog | /blog |
| Bulk users operations | core_bulkusers |  |
| Caching | core_cache | /cache |
| Calendar | core_calendar | /calendar |
| Cohorts | core_cohort | /cohort |
| Comment | core_comment | /comment |
| Competency based education | core_competency | /competency |
| Completion | core_completion | /completion |
| Countries | core_countries |  |
| Course | core_course | /course |
| Currencies | core_currencies |  |
| Database transfer | core_dbtransfer |  |
| Debugging | core_debug |  |
| Text editors | core_editor | /lib/editor |
| Education fields | core_edufields |  |
| Enrol | core_enrol | /enrol |
| Error reporting | core_error |  |
| Favourites | core_favourites | /favourites |
| File picker | core_filepicker |  |
| Files management | core_files | /files |
| User filtering | core_filters |  |
| Forms | core_form | /lib/form |
| Grades | core_grades | /grade |
| Advanced grading | core_grading | /grade/grading |
| Groups | core_group | /group |
| Help | core_help |  |
| Hub | core_hub |  |
| IMS CC | core_imscc |  |
| Installer | core_install |  |
| ISO 6392 | core_iso6392 |  |
| Language pack configuration | core_langconfig |  |
| License | core_license |  |
| Maths library | core_mathslib |  |
| Media | core_media |  |
| Messaging | core_message | /message |
| MIME types | core_mimetypes | |
| MNet | core_mnet | /mnet |
| Dashboard | core_my | /my |
| User notes | core_notes | /notes |
| Page types | core_pagetype |  |
| Pictures and icons | core_pix |  |
| Plagiarism | core_plagiarism | /plagiarism |
| Plugins management | core_plugin |  |
| Portfolio | core_portfolio | /portfolio |
| Privacy | core_privacy | /privacy |
| Course publishing | core_publish | /course/publish |
| Question bank engine | core_question | /question |
| Ratings | core_rating | /rating |
| Site registration | core_register | /admin/registration |
| Repository | core_repository | /repository |
| RSS | core_rss | /rss |
| Roles | core_role | /admin/roles |
| Global search | core_search | /search |
| Tabular data display/download (deprecated) | core_table |  |
| Tagging | core_tag | /tag |
| Timezones | core_timezones |  |
| User | core_user | /user |
| User key | core_userkey |  |
| Web service | core_webservice | /webservice |

## Usage

Frankenstyle component names are used in:

### Function names

All plugin functions must start with full frankenstyle prefix.

:::note Activity modules

For backwards compatibility modules may also use `modulename_` as prefix.

:::

:::warning

Something about global functions not being recommended. Please use an autoloaded class.

:::

### Class names

All the component classes must be placed under the classes directory, which allows them to be ([auto-loaded](https://docs.moodle.org/dev/Automatic_class_loading)). These should be placed in a namespace according to their frankenstyle component name, and having a natural name, for example a discussion class in the forum activity should be in the `mod_forum` namespace and may have a class name of `dicussion` - `\mod_forum\discussion`.

:::warning Non-namespaced classes

The use of non-namespaced classes using only the frankenstyle prefix is now deprecated.

See [Coding style](./index.md#namespaces) for more information.

For example, the class. name `mod_forum_example` should be written as `mod_forum\example`.

:::

### Constants

All plugin constants must start with uppercase frankenstyle prefix, for example `MOD_FORUM_XXXX`.

:::note

The use of constants is not recommended and, where possible, a class constant on an autoloaded class should be used.

This allows uses of the constant to autoload the content without needing to manually require any files.

:::

### Table names

All table names for a plugin must begin with its frankenstyle name (after the standard Moodle table prefix).

:::warning

The exception to this rule is Moodle activities which (for historical reasons) do not have plugin type `mod_` as a prefix to the plugin name.

:::

Examples:

- `local_coolreport`
- `local_coolreport_users`
- `forum` - for the mod_forum component

### Plugin configuration table

In the **config_plugins** table, column **plugin**, the frankenstyle name is used.

### Capabilities

All capabilities for a plugin use the frankenstyle name, except with a / instead of a _.

For example:

- `mod/quiz:viewattempt`
- `block/library:readbook`

### Language files

The main language file for each plugin (with the notable exception of activity modules) is the frankenstyle component name.

For example:

- `/blocks/participants/lang/en/block_participants.php`
- `/mod/quiz/lang/en/quiz.php`

### Renderers

### Module Subplugins

It is possible to extend modules without having to change the basic module's code. See [Subplugins](https://docs.moodle.org/dev/Subplugins) for details.

### Other places (TODO)

- @package declarations in phpdocs, see [Coding style#PHPDoc](./index.md#phpdoc)
- [web service function names](https://docs.moodle.org/dev/Web_services_Roadmap)
- [Moodle Plugins database](http://moodle.org)
- JS module names
- Template names

Please add more as they come up.

## Theme name variants

Themes are typically a derivatives of some other theme. Where this is the case, you should _avoid_ including the parent theme name in your theme's name.

## See also

- [Plugins](https://docs.moodle.org/dev/Plugins)
- [Subplugins](https://docs.moodle.org/dev/Subplugins)
- [Core APIs](/docs/apis)
- [Automatic class loading](https://docs.moodle.org/dev/Automatic_class_loading)
