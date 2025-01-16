---
title: PHPUnit
tags:
  - Quality Assurance
  - Testing
  - Unit testing
  - PHPUnit
---
PHPUnit by Sebastian Bergmann is an advanced unit testing framework for PHP. It is installed as Composer dependency and is not part of Moodle installation. To run PHPUnit tests, you have to manually install it on your development computer or test server.

Read the excellent guide at

- [PHPUnit Manual](https://phpunit.de/documentation.html)

## Installation of PHPUnit via Composer

- Install Composer
Instructions for installing composer on all platforms are here: https://getcomposer.org/download/

Install the `composer.phar` file to your moodle folder.

- Execute Composer installer

```
cd /your/moodle/dirroot
php composer.phar install
```

If that gives you connection problems try

```
php composer.phar install --prefer-source
```

Troubleshooting:

- On Windows if you are behind a proxy you will need to setup an environment variable called `HTTP_PROXY` with a value detailing your HTTP Proxy address and port before composer will correctly download files.
- You may be prompted for github credentials when installing composer dependencies.
  - This is used to generate an personal access token to avoid being rate limited by github.
  - If you have Two Factor Authentication enabled on your github account, or do not wish to supply your own credentials you will need to generate a token manually:
    - Visit https://github.com/settings/applications and request personal access token
    - Copy this token and add it to your [~/.composer/config.json](https://gist.github.com/andrewnicols/c5377ed25a9df1006ce1)
  - ( See [composer issue #2280](https://github.com/composer/composer/issues/2280) for further details of this bug.)

Detailed instructions:

- [Composer documentation](http://getcomposer.org/doc/00-intro.md)
Detailed instructions:
- [PHPUnit installation in Windows](https://docs.moodle.org/dev/PHPUnit_installation_in_Windows)
- [PHPUnit installation in OS X](https://docs.moodle.org/dev/PHPUnit_installation_in_OS_X)

## PHPUnit versions

The following table shows what PHPUnit version is installed in which Moodle version when using the default composer setup.

| Moodle version | PHPUnit version | Links                                                   |
| --- | --- |---------------------------------------------------------|
| Moodle 4.4 - 4.5 | PHPUnit 9.6 | [Documentation](https://docs.phpunit.de/en/9.6/) |
| Moodle 3.11 - 4.3 | PHPUnit 9.5 | [Documentation](https://docs.phpunit.de/en/9.6/) |
| Moodle 3.10 | PHPUnit 8.5 | [Documentation](https://docs.phpunit.de/en/8.5/) |
| Moodle 3.7 - 3.9 | PHPUnit 7.5 | [Documentation](https://docs.phpunit.de/en/7.5/) |
| Moodle 3.4 - 3.6 | PHPUnit 6.5 | [Documentation](https://phpunit.de/manual/6.5/en/)      |
| Moodle 3.2 - 3.3 | PHPUnit 5.5 | [Documentation](https://phpunit.de/manual/5.5/en/)      |
| Moodle 3.1 | PHPUnit 4.8.27 | [Documentation 4.8](https://phpunit.de/manual/4.8/en/)  |

## Initialisation of test environment

<!-- cspell:ignore testsuite, testsuites -->

Our PHPUnit integration requires a dedicated database and data root folder. First, add a new data root directory and prefix into your config.php, you can find examples in config-dist.php.

```php
 $CFG->phpunit_prefix = 'phpu_';
 $CFG->phpunit_dataroot = '/home/example/phpu_moodledata';
```

Some PHPUnit tests require a live internet connection. If your system does not have a direct connection to the Internet, you also need to specify your proxy in `config.php` - even though you normally specify it by using the admin settings user interface. (If you do not use a proxy, you can skip this step.) Check the settings on the relevant admin settings page, or from the `mdl_config` table in your database, if you are unsure of the correct values.

```php
 // Normal proxy settings
 $CFG->proxyhost = 'wwwcache.example.org';
 $CFG->proxyport = 80;
 $CFG->proxytype = 'HTTP';
 $CFG->proxybypass = 'localhost, 127.0.0.1, .example.org';
 // Omit the next lines if your proxy doesn't need a username/password:
 $CFG->proxyuser = 'systemusername';
 $CFG->proxypassword = 'systempassword';
```

You can also provide specific database settings for unit testing (if these are not provided, the standard database settings will be used):

```php
$CFG->phpunit_dbtype    = 'pgsql';      // 'pgsql', 'mariadb', 'mysqli', 'mssql', 'sqlsrv' or 'oci'
$CFG->phpunit_dblibrary = 'native';     // 'native' only at the moment
$CFG->phpunit_dbhost    = '127.0.0.1';  // eg 'localhost' or 'db.isp.com' or IP
$CFG->phpunit_dbname    = 'mytestdb';     // database name, eg moodle
$CFG->phpunit_dbuser    = 'postgres';   // your database username
$CFG->phpunit_dbpass    = 'some_password';   // your database password
```

Then you need to initialise the test environment using following command.

```
 cd /home/example/moodle
 php admin/tool/phpunit/cli/init.php
```

This command has to be repeated after any upgrade, plugin (un)installation or if you have added tests to a plugin you are developing:

**NOTE:** make sure that your php cli executable (or the one you want to use) is correctly on your path as the individual init scripts will call it repeatedly. Also, ensure en_AU locale is installed on your server.

### LDAP

If you want to run LDAP unit tests you must have a working, configured LDAP environment on your test server. There must be a basic LDAP tree structure in place or tests will fail with "Search: No such object". Build an LDAP tree structure in a new shell prompt:

```
ldapadd -H ldap://127.0.0.1 -D "cn=admin,dc=yourcomputer,dc=local" -W
dn:dc=yourcomputer,dc=local
objectClass:dcObject
objectClass:organizationalUnit
dc:yourcomputer
ou:YOURCOMPUTER
```

In `config.php` tell Moodle where to look for your test LDAP environment:

```php
// Constants for auth/ldap tests.
define('TEST_AUTH_LDAP_HOST_URL', 'ldap://127.0.0.1');
define('TEST_AUTH_LDAP_BIND_DN', 'cn=admin,dc=yourcomputer,dc=local');
define('TEST_AUTH_LDAP_BIND_PW', '*');
define('TEST_AUTH_LDAP_DOMAIN', 'dc=yourcomputer,dc=local');

// Constants for enrol/ldap tests.
define('TEST_ENROL_LDAP_HOST_URL', 'ldap://127.0.0.1');
define('TEST_ENROL_LDAP_BIND_DN', 'cn=admin,dc=yourcomputer,dc=local');
define('TEST_ENROL_LDAP_BIND_PW', '*');
define('TEST_ENROL_LDAP_DOMAIN', 'dc=yourcomputer,dc=local');

// Constants for lib/ldap tests.
define('TEST_LDAPLIB_HOST_URL', 'ldap://127.0.0.1');
define('TEST_LDAPLIB_BIND_DN', 'cn=admin,dc=yourcomputer,dc=local');
define('TEST_LDAPLIB_BIND_PW', '*');
define('TEST_LDAPLIB_DOMAIN', 'dc=yourcomputer,dc=local');
```

## Test execution

To execute all test suites from main configuration file execute the `vendor/bin/phpunit` script from your `$CFG->dirroot` directory.

```
 cd /home/example/moodle
 vendor/bin/phpunit
```

The rest of examples uses `phpunit`, please substitute it with `vendor/bin/phpunit` or create a shortcut in your `$CFG->dirroot`.
In IDEs, you may need to specify the path to the PHPUnit configuration file. Use the absolute path to `phpunit.xml` from your `$CFG->dirroot`.

### How to run only some tests

#### Running a single test quickly (PHPUnit 9)

The fastest way to run a single test in PHPUnit 9.5 and higher (Moodle 3.11 and higher) is to use the filter argument:

```bash
vendor/bin/phpunit --filter tool_dataprivacy_metadata_registry_testcase
```

To run all tests provided by the single component, use suite and the name it has in the phpunit.xml file. Example:

```bash
vendor/bin/phpunit --testsuite workshopform_accumulative_testsuite
```

Alternatively if you have config files built for each component:

```bash
vendor/bin/phpunit -c mod/workshop/form/accumulative/
```

You can also run a single test by using test file path:

```bash
vendor/bin/phpunit my/tests/filename.php
```

so, run this command in the CLI to see a real test in action:

```bash
vendor/bin/phpunit cohort/tests/lib_test.php
```

You can also run a single test method inside a class:

```bash
vendor/bin/phpunit --filter test_function_name path/to/file.php
```

**Note:** You should be careful because it may be possible to run tests this way which are not included in the normal run if, for example, the file is not placed in the correct location. If you use this method, do at least one full test run (or --group run, as below) to ensure the test can be found.

Filters can also be applied to capture a group of similar tests across all testsuites:

```bash
vendor/bin/phpunit --filter test_flag_user
```

It is also possible to run all tests in a component (subsystem or plugin) by using the testsuite option:

```bash
vendor/bin/phpunit --testsuite mod_forum_testsuite
vendor/bin/phpunit --testsuite core_privacy_testsuite
vendor/bin/phpunit --testsuite core_privacy_testsuite --filter test_component_is_compliant
```

#### Using the @group annotation

If you add annotations like

```php
namespace qtype_stack;
/**
 * Unit tests for {@link stack_cas_keyval} @ qtype/stack/tests/cas_keyval_test.php.
 * @group qtype_stack
 */
class cas_keyval_test extends \basic_testcase {
```

to all the classes in your plugin, then you can run just the tests for your plugin by doing

```
 phpunit --group qtype_stack
```

Therefore, it is suggested that you annotate all your tests with the Frankenstyle name of your plugin.

#### Using multiple phpunit.xml files

It's easy to create alternative `phpunit.xml` files defining which tests must be run together. For reference, take a look to the default `phpunit.xml` available in your base directory once the testing environment has been initialised. After creating the custom file you will be able to run those tests with

```
 vendor/bin/phpunit -c path/to/your/alternative/phpunit/file.xml
```

Also, for commodity, you can use this command:

```
 php admin/tool/phpunit/cli/util.php --buildcomponentconfigs
```

It will, automatically, create one valid `phpunit.xml` file within each component (plugin or subsystem) and other important directories, so later you will be able to execute tests like

```
 vendor/bin/phpunit -c mod/forum[](/phpunit.xml)  // Note that it's not needed to specify the name of the file (if it is 'phpunit.xml').
 vendor/bin/phpunit -c question
 vendor/bin/phpunit -c question/type/calculated
 vendor/bin/phpunit -c backup
 vendor/bin/phpunit -c lib/dml
```

or, also

```
 cd directory/with/phpunit.xml
 phpunit
```

## External test resources

By default Moodle phpunit tests contact http://download.moodle.org server when testing curl related functionality. Optionally you may checkout a local copy of the test scripts and access it instead:

1. clone https://github.com/moodlehq/moodle-exttests to web directory
2. add to your config.php or modify phpunit.xml file

```php
define('TEST_EXTERNAL_FILES_HTTP_URL', 'http://localhost/moodle-exttests');
```

## Writing new tests

- read [official PHPUnit online documentation](https://docs.phpunit.de/en/9.6/)
- see [Writing PHPUnit tests](https://docs.moodle.org/dev/Writing_PHPUnit_tests)

## PHPUnit support in IDEs

- [Setting up PhpStorm](https://docs.moodle.org/dev/Setting_up_PhpStorm)

## Common Unit Test Problems

[Common unit test problems](https://docs.moodle.org/dev/Common_unit_test_problems)

## Command line tips

- Display each test name before running it (useful e.g. if it crashes before the end and you want to know which test it was running at that point)

```
vendor/bin/phpunit --debug
```

(you will probably want to redirect this to a file as it gets very long).

[PHPUnit](https://docs.moodle.org/ja/PHPUnit)
