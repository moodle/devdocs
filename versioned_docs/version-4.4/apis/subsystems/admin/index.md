---
title: Admin settings
tags: []
---
<!-- cspell:ignore hassiteconfig -->
<!-- cspell:ignore settingpage -->
<!-- cspell:ignore fulltree -->
<!-- cspell:ignore configtext -->
<!-- cspell:ignore mediawidth -->
<!-- cspell:ignore visiblename -->
<!-- cspell:ignore defaultsetting -->
<!-- cspell:ignore paramtype -->
<!-- cspell:ignore settingstree -->
<!-- cspell:ignore mymodule -->
<!-- cspell:ignore externalpages -->
<!-- cspell:ignore externalpage -->
<!-- cspell:ignore pagename -->
<!-- cspell:ignore managemods -->
<!-- cspell:ignore preventexecpath -->
<!-- cspell:ignore configexecutable -->

Moodle's configuration is stored in a mixture of the config, config_plugins, and a few other tables. These settings are edited through the administration screens, which can be accessed by going to the `.../admin/index.php` URL on your moodle site, or using the Administration block that appears to administrators of the Moodle front page. This page explains how the code for displaying and editing of these settings works.

## Where to find the code

This is explained further below, but in summary:

- The library code is all in `lib/adminlib.php`.
- The definition of all the parts of the admin tree is in admin/settings/* some of which call out to plugins to see if they have settings they want to add.
- The editing and saving of settings is managed by `admin/settings.php`, `admin/upgradesettings.php`, and `admin/search.php`.
- The administration blocks that appear on the front page and on most of the admin screens is in `blocks/admin_tree` and `blocks/admin_bookmarks`.

For further details refer the code.

## The building blocks

All the settings are arranged into a tree structure. This tree structure is represented in memory as a tree of PHP objects.

At the root of the tree is an **admin_root** object.

That has children that are **admin_category**s.

Admin categories contain other categories, **admin_settingpage**s, and **admin_externalpage**s.

Settings pages contain individual **admin_setting**s.

admin_setting is a base class with lots of subclasses like **admin_setting_configtext**, **admin_setting_configcheckbox**, and so on. If you need to, you can create new subclasses.

External pages are for things that do not fit into the normal settings structure. For example the global assign roles page, or the page for managing activity modules.

## How the tree is built

When Moodle needs the admin tree, it calls admin_get_root in `lib/adminlib.php`, which

1. Creates a global $ADMIN object which is an instance of admin_root.
2. Does `require_once admin/settings/top.php`, which adds the top level categories to $ADMIN.
3. Does `require_once` on all the other files in `admin/settings` to add more specific settings pages and the settings themselves. Some of these settings files additionally make calls out to various types of plugins. For example:
   - `admin/settings/plugins.php` gives activity modules, blocks, question types, ... a chance to add admin settings.
4. Adds the admin reports to the tree.

As an optimisation, before building each bit of the tree, some capability checks are performed, and bits of the tree are skipped if the current user does not have permission to access them.

## Settings file example

This is an example of a settings.php file provided by a <tt>local_helloworld</tt> plugin. The file declares a single checkbox configuration variable called "showinnavigation".

```php
<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Adds admin settings for the plugin.
 *
 * @package     local_helloworld
 * @category    admin
 * @copyright   2020 Your Name <email@example.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $ADMIN->add('localplugins', new admin_category('local_helloworld_settings', new lang_string('pluginname', 'local_helloworld')));
    $settingspage = new admin_settingpage('managelocalhelloworld', new lang_string('manage', 'local_helloworld'));

    if ($ADMIN->fulltree) {
        $settingspage->add(new admin_setting_configcheckbox(
            'local_helloworld/showinnavigation',
            new lang_string('showinnavigation', 'local_helloworld'),
            new lang_string('showinnavigation_desc', 'local_helloworld'),
            1
        ));
    }

    $ADMIN->add('localplugins', $settingspage);
}
```

Few things to highlight:

- Note the variable <tt>$hassiteconfig</tt> which can be used as a quick way to check for the <tt>moodle/site:config</tt> permission. This variable is set by the top-level admin tree population scripts.
- We always add the custom <tt>admin_settingpage</tt> to the tree, but the actual settings are added to that page only when <tt>$ADMIN->fulltree</tt> is set. This is to improve performance when the caller does not need the actual settings but only the administration pages structure.
- The <tt>lang_string</tt> class instances are used as proxy objects to represent strings. This has performance benefits as there is no need to evaluate all strings in the admin settings tree unless they are actually displayed.

## Individual settings

Let us look at a simple example: [mod/lesson/settings.php](https://github.com/moodle/moodle/blob/main/mod/lesson/settings.php). This is included by admin/settings/plugins.php, which has already created $settings, which is an admin_settingpage that we can add to. The file contains lots of lines that look a bit like:

```php
$settings->add(new admin_setting_configtext('mod_lesson/mediawidth', get_string('mediawidth', 'lesson'),
    get_string('configmediawidth', 'lesson'), 640, PARAM_INT));
```

What this means is that to our settings page, we are adding a text setting. To understand this in more detail, we need to know what arguments the constructor for this admin_setting_configtext takes. The signature of the constructor is:

```php
public function __construct($name, $visiblename, $description, $defaultsetting, $paramtype=PARAM_RAW, $size=null)
```

- <tt>$name</tt> here is 'mod_lesson/mediawidth'. The slash is important here. It indicates that this setting is owned by the <tt>mod_lesson</tt> plugin and should be stored in the <tt>config_plugins</tt> table. Settings that do not have this slash would be stored in the global <tt>config</tt> table and also exposes them via <tt>$CFG</tt> properties. Plugin-scope settings can be obtained only via <tt>get_config()</tt> call. You may notice some older plugins such as the Forum module or many blocks, still store their settings in the global config table. That is strongly discouraged for new plugins.
- <tt>$visiblename</tt> is set to a string <tt>get_string('mediawidth', 'lesson')</tt>, this is the label that is put in front of setting on the admin screen.
- <tt>$description</tt> is set to another string, this is a short bit of text displayed underneath the setting to explain it further. Older plugins used strings prefixed with "config" for this purpose. The current best practice is to use "_desc" prefix for them - see [String API#Help strings](https://docs.moodle.org/dev/String_API#Help_strings)
- <tt>$defaultsetting</tt> is the default value for this setting. This value is used when Moodle is installed. For simple settings like checkboxes and text fields, this is a simple value. For some more complicated settings, this is an array.
- <tt>$paramtype</tt> is one of the constants describing the type of the input text. The inserted value will be sanitised according to the declared type.
- <tt>$size</tt> allows to specify custom size of the field in the user interface

Let us now look at a more complicated example, from mod/quiz/settingstree.php:

```php
 $quizsettings->add(new admin_setting_text_with_advanced('quiz/timelimit', get_string('timelimit', 'quiz'), get_string('timelimit_desc', 'quiz'),
         ['value' => '0', 'fix' => false], PARAM_INT));
```

*Note:* the naming convention used here is slightly outdated; new activity modules should use 'mod_mymodule/setting' instead of 'mymodule/setting' as identifier.

This example shows a $defaultsetting that is an array.

Normally, if you want a particular sort of setting, the easiest way is to look around the admin screens of your Moodle site, and find a setting like the one you want. Then go and copy the code and edit it. Therefore, we do not include a complete list of setting types here.

## Locked and advanced settings for activity modules

Admin settings are often used to define the defaults for activity settings. There is a simple way to enable admins make activity settings as "locked" (cannot be changed from the default) or "advanced" (deprecated, used before the change to "short forms").

When creating the admin setting (e.g. in mod/assign/settings.php), create the setting like this:

```php
$name = new lang_string('teamsubmission', 'mod_assign');
$description = new lang_string('teamsubmission_help', 'mod_assign');
$setting = new admin_setting_configcheckbox('assign/teamsubmission',
                                                    $name,
                                                    $description,
                                                    1);
$setting->set_advanced_flag_options(admin_setting_flag::ENABLED, false);
$setting->set_locked_flag_options(admin_setting_flag::ENABLED, false);
$settings->add($setting);
```

To add "locked" and "advanced" check boxes to the admin setting.

And finally, when creating the activity form (e.g. in mod/assign/mod_form.php), call this:

```php
$this->apply_admin_defaults();
```

at the end of the constructor to automatically set the default and lock the form element if required.

Note: Locking an admin setting **will not force the value on existing settings*. Activity settings that are locked will need to be manually updated if they differ from the locked default value.

## Callbacks after a setting has been updated

A typical example is purging a cache after a setting has changed:

```php
$setting = new admin_setting_configcheckbox(......);
$setting->set_updatedcallback('theme_reset_all_caches');
```

## External pages

admin_externalpages represent screens of settings that do not fall into the standard pattern of admin_settings. The admin_externalpage object in the settings tree holds the URL of a PHP page that controls various settings.

In that PHP page, near the start you need to call the function admin_externalpage_setup($pagename). Although earlier versions of Moodle required you to then use admin_externalpage_print_header() and admin_externalpage_print_footer() functions instead of the usual print_header and print_footer functions, this is no longer necessary as of Moodle 2.0 - just use $OUTPUT->header() and $OUTPUT->footer() as per usual (don't forget to echo them). This ensures that your page appears with the administration blocks and appropriate navigation.

Note that if your external page relies on additional optional or required params, you may need to use the optional arguments to admin_externalpage_print_header to ensure that the Blocks editing on/off button works.

Note that there are some subclasses of admin_externalpage, for example admin_page_managemods. In a lot of cases, these subclasses only exist to override the search method so this page can be found by appropriate searches.

Once again, to understand this in more depth, your best approach is to look at how some of the external pages in Moodle work.

### When to use an admin_settings vs admin_externalpages

The short answer is wherever possible always try to use admin settings rather than a custom page which uses formslib for anything related to admin settings. If you need something custom investigate a custom admin_setting class before a custom external page. There are a number of reasons, some around usability but mostly related to security:

- **Searching** - Admin settings can be searched for using the admin search, while only the page title of the external page is searchable. In particular it is very useful to search directly for the key name of a config item, but also the settings current value and it's help text. Also the admin settings tree is a public API and there are 3rd party plugins which leverage this for various purposes, so your settings will be invisible.
- **Manage from CLI** - All admin settings in core and plugins can be managed via admin/cli/cfg.php, you don't get this for free if you store settings manually in a custom table.
- **Caching** - All admin settings in core and plugins are cached in the MUC and you don't get this for free if you store settings manually in a custom table.
- **Forced settings** - Normal admin settings can be forced in config.php and this is shown as forced in the GUI. Unless you re-implement this forced logic admins will get the false impression they are saving a setting when they are won't and it will cause a lot of confusion.
- **Forced passwords** - Password admin settings can be forced in config.php and these are not only locked but hidden from the admin (since Moodle 3.9). You would have to, and should, re-implement this logic on top of the 'forced' logic above.
- **Executable paths** - A special case of forced settings is paths to executables which should ideally be set in config.php with $CFG->preventexecpath = true; so they cannot be set in the GUI, even if they aren't in config.php. The admin_setting_configexecutable class handles all this logic for you.
- **Config log** - When an admin setting is changed, the before and after values are appended to the config log and visible in the config changes report. If you ever called set_config on directly on behalf of a human you should call add_to_config_log as well. It is really important to have a strong audit trail of who did what. For normal actions by anyone this should be in the moodle log, for admin settings it should be in the config log.

An OK rule of thumb is: You can use an external page, which might use formslib, when the settings you are changing are in a custom table and not in the config tables via set_config. But you should seriously consider if and why you need a custom table first. If you are writing custom formslib elements it is usually just as easy to write a custom admin_setting instead.

## See also

- [adding settings for activity modules](https://docs.moodle.org/dev/Modules)
- [adding admin reports to the tree](https://docs.moodle.org/dev/Admin_reports#How_your_report_gets_included_in_the_admin_tree)
- configuration of repository plugins
- [configuration for filter](../../plugintypes/filter/index.md)
- [Other developer documentation](https://docs.moodle.org/dev/Developer_documentation)
