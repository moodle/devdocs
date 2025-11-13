---
title: Technical requirements
---

Moodle is a PHP Application, which is backed by a relational database.

Five database types are supported, and several versions of PHP.

## PHP

Moodle 4.0 supports the following PHP versions:

- 7.3
- 7.4
- 8.0

The following PHP extensions are required (most of which are installed and enabled by default in most PHP installations):

- [`iconv`](https://www.php.net/book.iconv)
- [`mbstring`](https://www.php.net/book.mbstring)
- [`curl`](https://www.php.net/book.curl)
- [`openssl`](https://www.php.net/book.openssl)
- [`ctype`](https://www.php.net/book.ctype)
- [`zip`](https://www.php.net/book.zip)
- [`zlib`](https://www.php.net/book.zlib)
- [`simplexml`](https://www.php.net/book.simplexml)
- [`spl`](https://www.php.net/book.spl)
- [`pcre`](https://www.php.net/book.pcre)
- [`dom`](https://www.php.net/book.dom)
- [`xml`](https://www.php.net/book.xml)
- [`xmlreader`](https://www.php.net/book.xmlreader)
- [`intl`](https://www.php.net/book.intl)
- [`json`](https://www.php.net/book.json)
- [`hash`](https://www.php.net/book.hash)
- [`fileinfo`](https://www.php.net/book.fileinfo)

## Relational Database

The following relational database servers are supported. The relevant PHP extension will also be required.

- [MariaDB](https://mariadb.org/) (version 10.2.29 or higher) with the [MySQLi PHP Extension](https://www.php.net/manual/en/book.mysqli.php)
- [MySQL](https://www.mysql.com/) (version 5.7 or higher) with the [MySQLi PHP Extension](https://www.php.net/manual/en/book.mysqli.php)
- [Postgresql](https://www.postgresql.org/) (version 10 or higher) with the [pgsql PHP Extension](https://www.php.net/manual/en/book.pgsql.php)
- [Microsoft SQL Server](https://www.microsoft.com/en-au/sql-server/sql-server-downloads) (version 14.0 or higher) with the [`SQLSRV` PHP Extension](https://www.php.net/manual/en/book.sqlsrv.php)
- [Oracle](https://docs.oracle.com/cd/B19306_01/server.102/b14220/intro.htm) (version 11.2 or higher) with the [OCI8 PHP Extension](https://www.php.net/manual/en/book.oci8.php)
