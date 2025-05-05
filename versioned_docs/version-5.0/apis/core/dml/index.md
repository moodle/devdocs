---
title: Data manipulation API
tags:
  - DB
  - XMLDB
  - API
  - core
  - core_dml
---

This page describes the functions available to access data in the Moodle database. You should **exclusively** use these functions in order to retrieve or modify database content because these functions provide a high level of abstraction and guarantee that your database manipulation will work against different RDBMSes.

Where possible, tricks and examples will be documented here in order to make developers' lives a bit easier. Of course, feel free to clarify, complete and add more information to this documentation. It will be welcome, absolutely!

## General concepts

### DB object

- The data manipulation API is exposed via public methods of the <tt>$DB</tt> object.
- Moodle core takes care of setting up the connection to the database according to values specified in the main config.php file.
- The $DB global object is an instance of the <tt>moodle_database</tt> class. It is instantiated automatically during the bootstrap setup, i.e. as a part of including the main config.php file.
- The DB object is available in the global scope right after including the config.php file:

```php title="example.php"
<?php
require(__DIR__ . '/config.php');

// You can access the database via the $DB method calls here.
```

- To make the DB object available in your local scope, such as within a function:

```php title="example.php"
<?php

function my_function_making_use_of_database() {
    global $DB;

    // You can access the database via the $DB method calls here.
}
```

### Table prefix

- Most Moodle installations use a prefix for all the database tables, such as <tt>mdl_</tt>. This prefix is NOT to be used in the code itself.
- All the `$table` parameters in the functions are meant to be the table name without prefixes:

```php
$user = $DB->get_record('user', ['id' => '1']);
```

- In custom SQL queries, table names must be enclosed between curly braces. They will be then automatically converted to the real prefixed table name. There is no need to access <tt>$CFG->prefix</tt>

```php
$user = $DB->get_record_sql('SELECT COUNT(*) FROM {user} WHERE deleted = 1 OR suspended = 1;');
```

### Conditions

- All the `$conditions` parameters in the functions are arrays of `fieldname => fieldvalue` elements.
- They all must be fulfilled - that is the logical <tt>AND</tt> is used to populate the actual <tt>WHERE</tt> statement

```php
$user = $DB->get_record('user', ['firstname'  => 'Martin', 'lastname'  => 'Dougiamas']);
```

### Placeholders

- All the `$params` parameters in the functions are arrays of values used to fill placeholders in SQL statements.
- Placeholders help to avoid problems with SQL-injection and/or invalid quotes in SQL queries. They facilitate secure and cross-db compatible code.
- Two types of placeholders are supported - question marks (<tt>SQL_PARAMS_QM</tt>) and named placeholders (<tt>SQL_PARAMS_NAMED</tt>).
- Named params **must be unique** even if the value passed is the same. If you need to pass the same value multiple times, you need to have multiple distinct named parameters.

```php title="Example of using question-mark placeholders"
$DB->get_record_sql(
    'SELECT * FROM {user} WHERE firstname = ? AND lastname = ?',
    [
        'Martin',
        'Dougiamas',
    ]
);
```

```php title="Example of using named placeholders"
$DB->get_record_sql(
    'SELECT * FROM {user} WHERE firstname = :firstname AND lastname = :lastname',
    [
        'firstname'  => 'Martin',
        'lastname'  => 'Dougiamas',
    ]
);
```

### Strictness

Some methods accept the <tt>$strictness</tt> parameter affecting the method behaviour. Supported modes are specified using the constants:

- <tt>MUST_EXIST</tt> - In this mode, the requested record must exist and must be unique. An exception `dml_missing_record_exception` will be thrown if no record is found or `dml_multiple_records_exception` if multiple matching records are found.
- <tt>IGNORE_MISSING</tt> - In this mode, a missing record is not an error. False boolean is returned if the requested record is not found. If more records are found, a debugging message is displayed.
- <tt>IGNORE_MULTIPLE</tt> - This is not a recommended mode. The function will silently ignore multiple records found and will return just the first one of them.

## Getting a single record

### get_record

Return a single database record as an object where all the given conditions are met.

```php
public function get_record(
    $table,
    array $conditions,
    $fields = '*',
    $strictness = IGNORE_MISSING
);
```

### get_record_select

Return a single database record as an object where the given conditions are used in the WHERE clause.

```php
public function get_record_select(
    $table,
    $select,
    array $params = null,
    $fields = '*',
    $strictness = IGNORE_MISSING
);
```

### get_record_sql

Return a single database record as an object using a custom SELECT query.

```php
public function get_record_sql(
    $sql,
    array $params = null,
    $strictness = IGNORE_MISSING
);
```

## Getting a hashed array of records

Each of the following methods return an array of objects. The array is indexed by the first column of the fields returned by the query. To assure consistency, it is a good practice to ensure that your query include an "id column" as the first field. When designing custom tables, make <tt>id</tt> their first column and primary key.

### get_records

Return a list of records as an array of objects where all the given conditions are met.

```php
public function get_records(
    $table,
    array $conditions = null,
    $sort = '',
    $fields = '*',
    $limitfrom = 0,
    $limitnum = 0
);
```

### get_records_select

Return a list of records as an array of objects where the given conditions are used in the WHERE clause.

```php
public function get_records_select(
    $table,
    $select,
    array $params = null,
    $sort = '',
    $fields = '*',
    $limitfrom = 0,
    $limitnum = 0
);
```

The `$fields` parameter is a comma separated list of fields to return (optional, by default all fields are returned).

### get_records_sql

Return a list of records as an array of objects using a custom SELECT query.

```php
public function get_records_sql(
    $sql,
    array $params = null,
    $limitfrom = 0,
    $limitnum = 0
);
```

### get_records_list

Return a list of records as an array of objects where the given field matches one of the possible values.

```php
public function get_records_list(
    $table,
    $field,
    array $values,
    $sort = *,
    $fields = '*',
    $limitfrom = *,
    $limitnum = ''
)
```

## Getting data as key/value pairs in an associative array

### get_records_menu

Return the first two columns from a list of records as an associative array where all the given conditions are met.

```php
public function get_records_menu(
    $table,
    array $conditions = null,
    $sort = '',
    $fields = '*',
    $limitfrom = 0,
    $limitnum = 0
);
```

### get_records_select_menu

Return the first two columns from a list of records as an associative array where the given conditions are used in the WHERE clause.

```php
public function get_records_select_menu(
    $table,
    $select,
    array $params = null,
    $sort = '',
    $fields = '*',
    $limitfrom = 0,
    $limitnum = 0
);
```

### get_records_sql_menu

Return the first two columns from a number of records as an associative array using a custom SELECT query.

```php
public function get_records_sql_menu(
    $sql,
    array $params = null,
    $limitfrom = 0,
    $limitnum = 0
);
```

## Counting records that match the given criteria

### count_records

Count the records in a table where all the given conditions are met.

```php
public function count_records(
    $table,
    array $conditions = null
);
```

### count_records_select

Count the records in a table where the given conditions are used in the WHERE clause.

```php
public function count_records_select(
    $table,
    $select,
    array $params = null,
    $countitem = "COUNT('x')"
);
```

### count_records_sql

Counting the records using a custom SELECT COUNT(...) query.

```php
public function count_records_sql(
    $sql,
    array $params = null
);
```

## Checking if a given record exists

### record_exists

Test whether a record exists in a table where all the given conditions are met.

```php
public function record_exists(
    $table,
    array $conditions = null
);
```

### record_exists_select

Test whether any records exists in a table where the given conditions are used in the WHERE clause.

```php
public function record_exists_select(
    $table,
    $select,
    array $params = null
);
```

### record_exists_sql

Test whether the given SELECT query would return any record.

```php
public function record_exists_sql(
    $sql,
    array $params = null
);
```

## Getting a particular field value from one record

### get_field

Get a single field value from a table record where all the given conditions are met.

```php
public function get_field(
    $table,
    $return,
    array $conditions,
    $strictness = IGNORE_MISSING
);
```

### get_field_select

Get a single field value from a table record where the given conditions are used in the WHERE clause.

```php
public function get_field_select(
    $table,
    $return,
    $select,
    array $params = null,
    $strictness = IGNORE_MISSING
);
```

### get_field_sql

Get a single field value (first field) using a custom SELECT query.

```php
public function get_field_sql(
    $sql,
    array $params = null,
    $strictness = IGNORE_MISSING
);
```

## Getting field values from multiple records

### get_fieldset

Return values of the given field from a table record as an array where all the given conditions are met.

```php
public function get_fieldset(
    string $table,
    string $return,
    ?array $conditions = null
);
```

### get_fieldset_select

Return values of the given field as an array where the given conditions are used in the WHERE clause.

```php
public function get_fieldset_select(
    $table,
    $return,
    $select,
    array $params = null
);
```

### get_fieldset_sql

Return values of the first column as an array using a custom SELECT field FROM ... query.

```php
public function get_fieldset_sql(
    $sql,
    array $params = null
);
```

## Setting a field value

### set_field

Set a single field in every record where all the given conditions are met.

```php
public function set_field(
    $table,
    $newfield,
    $newvalue,
    array $conditions = null
);
```

### set_field_select

Set a single field in every table record where the given conditions are used in the WHERE clause.

```php
public function set_field_select(
    $table,
    $newfield,
    $newvalue,
    $select,
    array $params = null
);
```

## Deleting records

### delete_records

Delete records from the table where all the given conditions are met.

```php
public function delete_records(
    $table,
    array $conditions = null
);
```

### delete_records_select

Delete records from the table where the given conditions are used in the WHERE clause.

```php
public function delete_records_select(
    $table,
    $select,
    array $params = null
);
```

## Inserting records

### insert_record

Insert the given data object into the table and return the "id" of the newly created record.

```php
public function insert_record(
    $table,
    $dataobject,
    $returnid = true,
    $bulk = false
);
```

### insert_records

Insert multiple records into the table as fast as possible. Records are inserted in the given order, but the operation is not atomic. Use transactions if necessary.

```php
public function insert_records(
    $table,
    $dataobjects
);
```

### insert_record_raw

For rare cases when you also need to specify the ID of the record to be inserted.

## Updating records

### update_record

Update a record in the table. The data object must have the property "id" set.

```php
public function update_record(
    $table,
    $dataobject,
    $bulk = false
);
```

## Executing a custom query

### execute

- If you need to perform a complex update using arbitrary SQL, you can use the low level "execute" method. Only use this when no specialised method exists.

```php
public function execute(
    $sql,
    array $params = null
);
```

:::danger

Do NOT use this to make changes in database structure, use the `database_manager` methods instead.

:::

## Using recordsets

If the number of records to be retrieved from DB is high, the 'get_records_xxx() functions above are far from optimal, because they load all the records into the memory via the returned array. Under those circumstances, it is highly recommended to use these `get_recordset_xxx()` functions instead. They return an iterator to iterate over all the found records and save a lot of memory.

It is **absolutely important** to not forget to close the returned recordset iterator after using it. This is to free up a lot of resources in the RDBMS.

A general way to iterate over records using the `get_recordset_xxx()` functions:

```php
$rs = $DB->get_recordset(....);
foreach ($rs as $record) {
    // Do whatever you want with this record
}
$rs->close();
```

Unlike get_record functions, you cannot check if <tt>$rs  = = true</tt> or <tt>!empty($rs)</tt> to determine if any records were found. Instead, if you need to, you can use:

```php
if ($rs->valid()) {
    // The recordset contains some records.
}
```

### get_recordset

Return a list of records as a moodle_recordset where all the given conditions are met.

```php
public function get_recordset(
    $table,
    array $conditions = null,
    $sort = '',
    $fields = '*',
    $limitfrom = 0,
    $limitnum = 0
);
```

### get_recordset_select

Return a list of records as a moodle_recordset where the given conditions are used in the WHERE clause.

```php
public function get_recordset_select(
    $table,
    $select,
    array $params = null,
    $sort = '',
    $fields = '*',
    $limitfrom = 0,
    $limitnum = 0
);
```

### get_recordset_sql

Return a list of records as a moodle_recordset using a custom SELECT query.

```php
public function get_recordset_sql(
    $sql,
    array $params = null,
    $limitfrom = 0,
    $limitnum = 0
);
```

### get_recordset_list

Return a list of records as a moodle_recordset where the given field matches one of the possible values.

```php
public function get_recordset_list(
    $table,
    $field,
    array $values,
    $sort = *,
    $fields = '*',
    $limitfrom = *,
    $limitnum = ''
);
```

## Delegated transactions

- Please note some databases do not support transactions (such as the MyISAM MySQL database engine), however all server administrators are strongly encouraged to migrate to databases that support transactions (such as the InnoDB MySQL database engine).
- Previous versions supported only one level of transaction. Since Moodle 2.0, the DML layer emulates delegated transactions that allow nesting of transactions.
- Some subsystems (such as messaging) do not support transactions because it is not possible to rollback in external systems.
A transaction is started by:

```php
$transaction = $DB->start_delegated_transaction();
```

and finished by:

```php
$transaction->allow_commit();
```

Usually a transaction is rolled back when an exception is thrown:

```php
$transaction->rollback($ex);
```

which must be used very carefully because it might break compatibility with databases that do not support transactions. Transactions cannot be used as part of expected code flow; they can be used only as an emergency protection of data consistency.

::: More information

For more information see [DB layer 2.0 delegated transactions](https://docs.moodle.org/dev/DB_layer_2.0_delegated_transactions) or [MDL-20625](https://tracker.moodle.org/browse/MDL-20625).

:::

### Example

```php
global $DB;
try {
     $transaction = $DB->start_delegated_transaction();
     $DB->insert_record('foo', $object);
     $DB->insert_record('bar', $otherobject);

     // Assuming the both inserts work, we get to the following line.
     $transaction->allow_commit();

} catch (Exception $e) {
     $transaction->rollback($e);
}
```

## Cross-DB compatibility

Moodle supports several SQL servers, including MySQL, MariaDB, PostgreSQL, MS-SQL and Oracle. These may have specific syntax in certain cases. In order to achieve cross-db compatibility of the code, the following functions must be used to generate the fragments of the query valid for the actual SQL server.

### sql_bitand

Return the SQL text to be used in order to perform a bitwise AND operation between 2 integers.

```php
public function sql_bitand(
    $int1,
    $int2
);
```

### sql_bitnot

Return the SQL text to be used in order to perform a bitwise NOT operation on the given integer.

```php
public function sql_bitnot(
    $int1
);
```

### sql_bitor

Return the SQL text to be used in order to perform a bitwise OR operation between 2 integers.

```php
public function sql_bitor(
    $int1,
    $int2
);
```

### sql_bitxor

Return the SQL text to be used in order to perform a bitwise XOR operation between 2 integers.

```php
public function sql_bitxor(
    $int1,
    $int2
);
```

### sql_null_from_clause

Return an empty FROM clause required by some DBs in all SELECT statements.

```php
public function sql_null_from_clause()
```

### sql_ceil

Return the correct CEIL expression applied to the given fieldname.

```php
public function sql_ceil(
    $fieldname
);
```

### sql_equal

<Since version="3.2" />

Return the query fragment to perform cross-db varchar comparisons when case-sensitiveness is important.

```php
public function sql_equal(
    $fieldname,
    $param,
    $casesensitive = true,
    $accentsensitive = true,
    $notequal = false
);
```

### sql_like

Return the query fragment to perform the LIKE comparison.

```php
$DB->sql_like(
    $fieldname,
    $param,
    $casesensitive = true,
    $accentsensitive = true,
    $notlike = false,
    $escapechar = ' \\ '
);
```

```php title='Example: Searching for records partially matching the given hard-coded literal'
$likeidnumber = $DB->sql_like('idnumber', ':idnum');
$DB->get_records_sql(
    "SELECT id, fullname FROM {course} WHERE {$likeidnumber}",
    [
        'idnum' => 'DEMO-%',
    ]
);
```

See below if you need to compare with a value submitted by the user.

### sql_like_escape

Escape the value submitted by the user so that it can be used for partial comparison and the special characters like '_' or '%' behave as literal characters, not wildcards.

```php
$DB->sql_like_escape(
    $text,
    $escapechar = '\\'
);
```

```php title="Example: If you need to perform a partial comparison with a value that has been submitted by the user"
$search = required_param('search', PARAM_RAW);

$likefullname = $DB->sql_like('fullname', ':fullname');
$DB->get_records_sql(
    "SELECT id, fullname FROM {course} WHERE {$likefullname}",
    [
        'fullname'  => '%' . $DB->sql_like_escape($search) . '%',
    ]
);
```

### sql_length

Return the query fragment to be used to calculate the length of the expression in characters.

```php
public function sql_length(
    $fieldname
);
```

### sql_modulo

Return the query fragment to be used to calculate the remainder after division.

```php
public function sql_modulo(
    $int1,
    $int2
);
```

### sql_position

Return the query fragment for searching a string for the location of a substring. If both needle and haystack use placeholders, you must use named placeholders.

```php
public function sql_position(
    $needle,
    $haystack
);
```

### sql_substr

Return the query fragment for extracting a substring from the given expression.

```php
public function sql_substr(
    $expr,
    $start,
    $length = false
);
```

### sql_cast_char2int

Return the query fragment to cast a CHAR column to INTEGER

```php
public function sql_cast_char2int(
    $fieldname,
    $text = false
);
```

### sql_cast_char2real

Return the query fragment to cast a CHAR column to REAL (float) number

```php
public function sql_cast_char2real(
    $fieldname,
    $text = false
);
```

### sql_cast_to_char

<Since version="4.1" />

Return SQL for casting to char of given field/expression.

```php
public function sql_cast_to_char(string $field);
```

### sql_compare_text

Return the query fragment to be used when comparing a TEXT (clob) column with a given string or a VARCHAR field (some RDBMs do not allow for direct comparison).

```php
public function sql_compare_text(
    $fieldname,
    $numchars = 32
);
```

```php title="Example"
$comparedescription = $DB->sql_compare_text('description');
$comparedescriptionplaceholder = $DB->sql_compare_text(':description');
$todogroups = $DB->get_records_sql(
    "SELECT id FROM {group} WHERE {$comparedescription} = {$comparedescriptionplaceholder}",
    [
        'description' => 'TODO',
    ]
);
```

### sql_order_by_text

Return the query fragment to be used to get records ordered by a TEXT (clob) column. Note this affects the performance badly and should be avoided if possible.

```php
public function sql_order_by_text(
    $fieldname,
    $numchars = 32
);
```

### sql_order_by_null

<Since version="4.1" />

Return the query fragment to be used to get records with a standardised return pattern of null values across database types to sort nulls first when ascending and last when descending.

```php
public function sql_order_by_null(
    string $fieldname,
    int $sort = SORT_ASC
);
```

### sql_concat

Return the query fragment to concatenate all given parameters into one string.

```php
public function sql_concat(...)
```

There is a gotcha if you are trying to concat fields which may be null which result in the entire result being null:

<InvalidExample>

```php
public function sql_concat('requiredfield', 'optionalfield');
```

</InvalidExample>

You must cast or coalesce every nullable argument, for example:

<ValidExample>

```php
public function sql_concat('requiredfield', "COALESCE(optionalfield, '')");
```

</ValidExample>

### sql_group_concat

<Since version="3.11" />

Return SQL for performing group concatenation on given field/expression.

```php
public function sql_group_concat(string $field, string $separator = ', ', string $sort = '')
```

### sql_concat_join

Return the query fragment to concatenate all given elements into one string using the given separator.

```php
public function sql_concat_join(
    $separator = "' '",
    $elements = []]
);
```

### sql_fullname

Return the query fragment to concatenate the given $firstname and $lastname

```php
public function sql_fullname(
    $first = 'firstname',
    $last = 'lastname'
);
```

### sql_isempty

Return the query fragment to check if the field is empty

```php
public function sql_isempty(
    $tablename,
    $fieldname,
    $nullablefield,
    $textfield
);
```

### sql_isnotempty

Return the query fragment to check if the field is not empty

```php
public function sql_isnotempty(
    $tablename,
    $fieldname,
    $nullablefield,
    $textfield
);
```

### get_in_or_equal

Return the query fragment to check if a value is IN the given list of items (with a fallback to plain equal comparison if there is just one item)

```php
public function get_in_or_equal(
    $items,
    $type = SQL_PARAMS_QM,
    $prefix = 'param',
    $equal = true,
    $onemptyitems = false
);
```

Example:

```php
$statuses = ['todo', 'open', 'inprogress', 'intesting'];
[$insql, $inparams] = $DB->get_in_or_equal($statuses);
$sql = "SELECT * FROM {bugtracker_issues} WHERE status $insql";
$bugs = $DB->get_records_sql($sql, $inparams);
```

An example using named params:

```php
[$insql, $params] = $DB->get_in_or_equal($contexts, SQL_PARAMS_NAMED, 'ctx');
$contextsql = "AND rc.contextid {$insql}";
```

### sql_regex_supported

Does the current database driver support regex syntax when searching?

```php
public function sql_regex_supported()
```

### sql_regex

Return the query fragment to perform a regex search.

```php
public function sql_regex(
    $positivematch = true,
    $casesensitive = false
);
```

Example: Searching for Page module instances containing links.

```php title="Example: Searching for Page module instances containing links."
if ($DB->sql_regex_supported()) {
    $select = 'content ' . $DB->sql_regex() . ' :pattern';
    $params = ['pattern'  => "(src|data)\ * = \ *[\\\"\']https?://"]
} else {
    $select = $DB->sql_like('content', ':pattern', false);
    $params = ['pattern'  => '% = %http%://%'];
}

$pages = $DB->get_records_select('page', $select, $params, 'course', 'id, course, name');
```

### sql_regex_get_word_beginning_boundary_marker

<Since versions={["3.11.11", "4.0.5", "4.1"]} issueNumber="MDL-74912" />

Return the word-beginning boundary marker if the current database driver supports regex syntax when searching.

Defaults to `[[:<:]]`. On MySQL `v8.0.4+`, it returns `\\b`.

```php
public function sql_regex_get_word_beginning_boundary_marker()
```

### sql_regex_get_word_end_boundary_marker

<Since versions={["3.11.11", "4.0.5", "4.1"]} issueNumber="MDL-74912" />

Return the word-end boundary marker if the current database driver supports regex syntax when searching.

Defaults to `[[:>:]]`. On MySQL `v8.0.4+`, it returns `\\b`.

```php
public function sql_regex_get_word_end_boundary_marker()
```

### sql_intersect

<Since version="2.8" />

Return the query fragment that allows to find intersection of two or more queries

```php
public function sql_intersect(
    $selects,
    $fields
);
```

## Debugging

### set_debug

You can enable a debugging mode to make $DB output the SQL of every executed query, along with some timing information. This can be useful when debugging your code. Obviously, all such calls should be removed before code is submitted for integration.

```php
public function set_debug(bool $state)
```

## Special cases

### get_course

From Moodle 2.5.1 onwards, you should use the `get_course` function instead of using `get_record('course', ...)` if you want to get a course record based on its ID, especially if there is a significant possibility that the course being retrieved is either the current course for the page, or the site course. Those two course records have probably already been loaded, and using this function will save a database query.

Additionally, the code is shorter and easier to read.

### get_courses

If you want to get all the current courses in your Moodle, use get_courses() without parameter:

```php
$courses = get_courses();
```

## See also

- [SQL coding style](/general/development/policies/codingstyle/sql)
- [Core APIs](../index.md)
- [DML exceptions](./exceptions.md): New DML code is throwing exceptions instead of returning false if anything goes wrong
- [DML drivers](./drivers.md): Database drivers for new DML layer
- [DDL functions](./ddl.md): Where all the functions used to handle DB objects ([DDL](https://en.wikipedia.org/wiki/Data_Definition_Language)) are defined.
