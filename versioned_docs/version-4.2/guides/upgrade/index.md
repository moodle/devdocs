---
title: Plugin Upgrades
tags:
  - XMLDB
  - Plugins
  - API
---

The Upgrade API is a core API which allows your plugin to manage features of its own installation, and upgrade. Every plugin includes a [version](../../apis/commonfiles/version.php/index.md) which allows the Upgrade API to apply only the required changes.

<!-- cspell:ignore myqtype, newcol, upgradelib, oldversion, savepoint -->

Correct use of this API allows Moodle to automatically create, and handle upgrades for, your database tables and other core features during an upgrade.

## Key files

This process is controlled by three primary files within your plugin, and a number of additional optional files for optional features:

- [version.php](../../apis/commonfiles/version.php/index.md): This records the version of the plugin code. You must increase version in version.php after any change in the `/db/` folder, any change in JavaScript code, any new auto-loaded class, any new setting and also after any change in language pack, because a new version triggers the upgrade procedure and resets all caches.
- db/install.xml: This file describes the database tables that will be created during installation. It is only used during the initial installation of the plugin.
- db/upgrade.php: This file is used during the upgrade process when upgrading from an older version of the plugin installed upgrades to the latest version.

### version.php

The version.php file describes the current version of the plugin, and additional features such as its maturity, any dependencies or requirements, and a release name.

See the documentation on [version.php](../../apis/commonfiles/version.php/index.md) for further information on the features of this file.

### db/install.xml

The install.xml file describes the database tables that will be created when the plugin is installed.

:::important

The content of the `install.xml` file **must** be created and maintained using the [XMLDB Editor](/general/development/tools/xmldb).

:::

### db/upgrade.php

The upgrade.php file describes the steps used to migrate the plugin from one version to a newer version. Moodle only supports the upgrade of plugins. **Plugins can not be downgraded**.

:::important

The content of the `upgrade.php` file **must** be created and maintained using the [XMLDB Editor](/general/development/tools/xmldb).

:::

The following example shows the structure of the upgrade.php file:

```php title="Example upgrade.php file"
<?php

function xmldb_[plugintype]_[pluginname]_upgrade($oldversion): bool {
    global $CFG, $DB;

    $dbman = $DB->get_manager(); // Loads ddl manager and xmldb classes.

    if ($oldversion < 2019031200) {
        // Perform the upgrade from version 2019031200 to the next version.

        // The content of this section should be generated using the XMLDB Editor.
    }

    if ($oldversion < 2019031201) {
        // Perform the upgrade from version 2019031201 to the next version.

        // The content of this section should be generated using the XMLDB Editor.
    }

    // Everything has succeeded to here. Return true.
    return true;
}
```

## Upgrade code restrictions

During an upgrade, restrictions are placed on the functions that your upgrade code may call. This is because Moodle has not been fully update and some APIs may have code in place relating to a future database or data format.

- All upgrade code may use the [basic database API](../../apis/core/dml/index.md).
- In a **plugin**, upgrade code should not call **any plugin functions**. For example, if your plugin has a function that changes frog settings to 'green', and you need to do this during upgrade, then you **must not** call this function; instead, manually update the database rows so that the frog settings become green). However, **you _may_ call core functions** rather than making core changes in database.
- In **core**, upgrade code should not even call **any core functions**. For example, if you need to add a calendar event, this should be done by inserting into a database table rather than calling a function to add the event. Certain functions marked with a comment such as `set_config` and `get_config` are excepted.

:::info Rationale for these rules

During core upgrade the state is as follows:

- Core data: **Old**.
- Plugin data: **Old**.

Core functions expect core data to be in the Current state, so it is not safe to call them, unless the following is present in the function's docblock: "NOTE: this function is called from lib/db/upgrade.php".

During plugin upgrade the state is as follows:

- Core data: **Current**. (Because core upgrade runs before plugin upgrade.)
- Plugin data: **Old**.

Core functions are now safe to call because the core data is in Current state. But plugin functions, which expect data to be in the Current state, are not safe.

:::

## Summary

The first time a user installs any version of your plugin, the install.xml file will be used to create all the required database tables. Therefore install.xml should always contain the definition of the up-to-date database structure. Moodle recognises this situation because there is a version.php file on disc, but there is no (*plugintype*_*pluginname*, version) value in the config_plugins table.

If the user already had a version of your plugin installed, and then upgrades to a newer version, Moodle will detect this because the version.php file will contain a newer version number than the (*plugintype*_*pluginname*, version) value in the mdl_config_plugins table. In this case, Moodle will run the code in the upgrade.php file, passing in the old version number, so that the correct bits of upgrade can be run, as controlled by the if ($oldversion < XXXXXXXXXX) blocks of code.

The contents of the install.xml and upgrade.php files should be generated using the XMLDB editor.

## Other things that can be in the db folder

See the documentation on other [common files](../../apis/commonfiles/index.mdx) that may be of use to you, in particular the following may be useful:

- [install.php](../../apis/commonfiles/index.mdx#dbinstallphp)
- [uninstall.php](../../apis/commonfiles/index.mdx#dbuninstallphp)
- [access.php](../../apis/commonfiles/index.mdx#dbaccessphp)
- [events.php](../../apis/commonfiles/index.mdx#dbeventsphp)
- [messages.php](../../apis/commonfiles/index.mdx#dbmessagesphp)
- [services.php](../../apis/commonfiles/index.mdx#dbservicesphp)
- [subplugins.json](https://docs.moodle.org/dev/Subplugins#db.2Fsubplugins.json)
- [Language files](../../apis/commonfiles/index.mdx#langenplugintype_pluginnamephp)

## Upgrade API Cheat-sheet

The Upgrade API is related to _a lot_ of different files and APIs (including access, event, log, webservice, and so on) as it's the API used to install and upgrade all of those areas in the context of a specific Moodle component. The previous sections have tried to list all those dependencies when possible.

The Upgrade API makes _very intensive use_ of other APIs, including [DDL](../../apis/core/dml/ddl.md), [DML](../../apis/core/dml/index.md), and a range of tools in order to proceed with the required changes for the upgrade.

In addition to the relevant files located in the db folder, a number of functions can also be defined:

- **xmldb_(main|[frankenstyle](/general/development/policies/codingstyle/frankenstyle))_install()**: to be used in install.php files.
- **xmldb_(main|frankenstyle)_uninstall()**: to be used in uninstall.php files.
- **xmldb_(main|frankenstyle)_upgrade()**: to be used in upgrade.php files.

:::info

Some of these functions have variants depending on whether they are being called from core code, or a plugin.

When called from core, the `main` variant should be used, otherwise the frankenstyle name of teh component should be used.

For example, if you are defining an installation behaviour in the install.php script of a block named `block_exampke`, you would have an install.php similar to the following:

```php title="blocks/example/db/install.php"
<?php
// ...

function xmldb_block_example_install() {
    // ...
}
```

:::

We highly recommend looking at existing uses of these files within plugins included with Moodle core to understand some fo the more complex examples.

### Upgrade helpers

Several functions are also available to call from within the upgrade.php script:

- **upgrade_set_timeout()**: Used to increase timeouts before performing a long-running upgrade step
- **upgrade_(main|mod|block|plugin)_savepoint()**: Used to mark an upgrade step as completed, and to  reset timeouts. This ensures that an upgrade step is only executed once.

## Moodle core database upgrades within stable branches

In Moodle core, one of the standard simple rules is not to make any database changes on a stable branch. You only need to read this section in the rare situations where a database change on the stable branch is unavoidable.

:::warning Advanced

Suppose, in order to fix a bug, you need to make a database change in the Moodle 4.0 stable branch (and the main branch targetting Moodle 4.1). The root of the problem is that people may upgrade their Moodle in three different ways, which

- Upgrade from \<=4.0.2 to 4.0.3 - this executes the upgrade script on the 4.0 branch.
- Upgrade from \<=4.0.2 directly to >=4.1 - this executes the upgrade script on the main branch.
- Upgrade from 4.0.3 to >=4.1 - in this case, you must ensure that the upgrade on main is not executed.

The normal way to do this is ensure that your database upgrade is idempotent. That is, it does not matter if you do it twice. So for example, instead of doing

<InvalidExample>

```php title="Creating a table without checks"
$dbman->create_table($table);
```

</InvalidExample>

you should do

<ValidExample>

```php title="Ensure that the table does not exist before creating it"
if (!$dbman->table_exists($table)) {
    $dbman->create_table($table);
}
```

</ValidExample>

You should also think about what version numbers to put in your version.php file on each branch. Above all, test carefully.

:::

## See also

- [Core APIs](../../apis.md)
- [XMLDB Documentation](https://docs.moodle.org/dev/XMLDB_Documentation)
- [Coding guidelines](/general/development/policies)
- [DDL functions](../../apis/core/dml/ddl.md)
- [install.xml file documentation](https://docs.moodle.org/dev/XMLDB_defining_an_XML_structure)
