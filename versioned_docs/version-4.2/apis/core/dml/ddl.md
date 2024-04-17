---
title: Data definition API
tags:
  - DB
  - XMLDB
  - API
  - core_dml
  - ddl
  - core
---

<Since version="2.0" />

In this page you'll access to the available functions under Moodle to be able to handle DB structures (tables, fields, indexes...).

The objective is to have a well-defined group of functions able to handle all the DB structure (DDL statements) using one neutral description, being able to execute the correct SQL statements required by each RDBMS. All these functions are used **[exclusively by the installation and upgrade processes](https://docs.moodle.org/dev/Installing_and_upgrading_plugin_database_tables)**.

In this page you'll see a complete list of such functions, with some explanations, tricks and examples of their use. If you are interested, it's also highly recommendable to take a look to the [DML functions page](./ddl.md) where everything about how to handle DB data (select, insert, update, delete i.e. DML statements) is defined.

Of course, feel free to clarify, complete and add more info to all this documentation. It will be welcome, absolutely!

## Main info

- All the function calls in this page are public methods of the **database manager**, accessible from the $DB global object. You will need to "import" it within the upgrade function of your **upgrade.php** main function using the `global` keyword, for example:

```php
function xmldb_xxxx_upgrade {
    global $DB;

    // Load the DDL manager and xmldb API.
    $dbman = $DB->get_manager();

    // Your upgrade code goes here
}
```

- All of the `$table`, `$field`, and `$index` parameters are XMLDB objects. Don't forget to read carefully the complete documentation about [creating new DDL functions](https://docs.moodle.org/dev/XMLDB_creating_new_DDL_functions) before playing with these functions. Everything is explained there, with one general example and some really useful tricks to improve the use of all the functions detailed below.
- If you want real examples of the usage of these functions we recommend examining the various core **upgrade.php** scripts.

:::tip

Always use the [XMLDB Editor](/general/development/tools/xmldb) to modify your tables. It is capable of generating the PHP code required to make your definition changes.

:::

:::danger

The use of these functions is **restricted** to the upgrade processes and it should not be used in any other parts of Moodle.

:::

## The functions

### Handling tables

```php
// Detect if a table exists.
$dbman->table_exists($table)

// Create a table.
$dbman->create_table($table, $continue = true, $feedback = true)

// Drop a table.
$dbman->drop_table($table, $continue = true, $feedback = true)

// Rename a table.
$dbman->rename_table($table, $newname, $continue = true, $feedback = true)
```

### Handling fields

```php
// Detect if a field exists.
$dbman->field_exists($table, $field)

// Create a field.
$dbman->add_field($table, $field, $continue = true, $feedback = true)

// Drop a field.
$dbman->drop_field($table, $field, $continue = true, $feedback = true)

// Change the type of a field.
$dbman->change_field_type($table, $field, $continue = true, $feedback = true)

// Change the precision of a field.
$dbman->change_field_precision($table, $field, $continue = true, $feedback = true)

// Change the signed/unsigned status of a field.
$dbman->change_field_unsigned($table, $field, $continue = true, $feedback = true)

// Make a field nullable or not.
$dbman->change_field_notnull($table, $field, $continue = true, $feedback = true)

// Change the default value of a field.
$dbman->change_field_default($table, $field, $continue = true, $feedback = true)

// Rename a field.
$dbman->rename_field($table, $field, $newname, $continue = true, $feedback = true)
```

### Handling indexes

```php
// Detect if an index exists.
$dbman->index_exists($table, $index)

// Return the name of an index in DB.
$dbman->find_index_name($table, $index)

// Add an index.
$dbman->add_index($table, $index, $continue = true, $feedback = true)

// Drop an index.
$dbman->drop_index($table, $index, $continue = true, $feedback = true)
```

## Some considerations

1. The `$table`, `$field`, and `$index` parameters are, always, XMLDB objects.
1. The `$newtablename`, and `$newfieldname` parameters are, always, simple strings.
1. All the `*_exists()` functions always return a boolean value.
1. If any issue is encountered during execution of these functions, an Exception will be thrown and the upgrade process will stop.
1. Always use the [XMLDB Editor](/general/development/tools/xmldb) to generate the PHP code automatically.

## See also

- [Core APIs](../../../apis.md)
- [XMLDB Documentation](https://docs.moodle.org/dev/XMLDB_Documentation): Main page of the whole XMLDB documentation, where all the process is defined and all the related information resides.
- [XMLDB Defining one XML structure](https://docs.moodle.org/dev/XMLDB_Defining_one_XML_structure): Where you will know a bit more about the underlying XML structure used to define the DB objects, that is used continuously by the functions described in this page.
- [Installing and upgrading plugin DB tables](https://docs.moodle.org/dev/Installing_and_upgrading_plugin_database_tables)
- [DML functions](./index.md): Where all the functions used to handle DB data ([DML](https://docs.moodle.org/wikipedia/Data_Manipulation_Language)) are defined.
