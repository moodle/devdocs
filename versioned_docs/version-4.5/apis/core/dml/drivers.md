---
title: DML drivers
tags:
  - core_dml
  - DML
  - core
  - API
  - RDBM
---

A number of native drivers are included with Moodle, including those with support for:

- MySQLi
- MariaDB
- PostgreSQL
- Oracle
- Microsoft SQL Server

These drivers are supported using DML Database Driver layer, which has a number of discreet benefits:

- more optimised and probably faster
- consume less memory
- better possibility to improve logging, debugging, profiling, etc.
- less code, easier to fix and maintain
- and more

## Query logging

The native DML drivers support logging of database queries to database table, which can be enabled in config.php:

```php title="config.php"
$CFG->dboptions = [
    'dbpersist' => 0,
    //'logall'   => true,
    'logslow'  => 5,
    'logerrors'  => true,
];
```

- `logall` - log all queries - suitable only for developers, causes high server loads
- `logslow` - log queries that take longer than specified number of seconds (float values are accepted)
- `logerrors` - log all error queries

## See also

- [DML functions](./index.md): Where all the functions used to handle DB data ([DML](https://en.wikipedia.org/wiki/Data_Manipulation_Language)) are defined.
- [DML exceptions](./exceptions.md): New DML code is throwing exceptions instead of returning false if anything goes wrong
