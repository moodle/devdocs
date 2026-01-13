---
title: Writing PHPUnit tests
tags:
  - Unit testing
  - phpunit
---

Moodle PHPUnit integration is designed to allow easy creation of new tests.
At the start of each test the state is automatically reset to fresh new installation (unless explicitly told not to reset).

## Namespaces

All the files under `**/tests` directories are [subject to some simple rules](/general/development/policies/codingstyle#namespaces-within-tests) when using namespaces.
They apply to test cases, fixtures, generators and, in general, any class within those directories.
These are the same rules that are applied to the standard `**/classes` directories.

## Testcase classes

There are two basic test case classes that should be used in all other Moodle unit tests:

- basic_testcase; and
- advanced_testcase.

:::note

Moodle's coding style mandates that only one testcase is placed into each file, and that the file name **must** match the class name.

:::

The `basic_testcase` is intended for very simple tests that do not modify the database, file system, or any PHP globals. It can be used for pure unit tests which do not modify data in any way.

The `advanced_testcase` is an enhanced testcase class which includes a number of test helpers for easier testing of Moodle code.

:::note Creating additional test case classes

Moodle supports the creation of custom testcase classes for more specific purposes.

These **must** be defined as abstract and **must not** contain any tests.

:::

## Assertions

Where possible the standard PHPUnit assertions should be used.

The complete list of assertions can be found in the links below.

| Moodle version | PHPUnit version | Links |
| --- | --- | --- |
| Moodle 5.0+ | PHPUnit 11 | [Documentation](https://phpunit.readthedocs.io/en/11.4/assertions.html) |
| Moodle 4.4 - 4.5 | PHPUnit 9.6 | [Documentation](https://phpunit.readthedocs.io/en/9.6/assertions.html) |
| Moodle 3.11 - 4.3 | PHPUnit 9.5 | [Documentation](https://phpunit.readthedocs.io/en/9.5/assertions.html) |
| Moodle 3.10 | PHPUnit 8.5 | [Documentation](https://phpunit.readthedocs.io/en/8.5/assertions.html) |
| Moodle 3.7 - 3.9 | PHPUnit 7.5 | [Documentation](https://phpunit.readthedocs.io/en/7.5/assertions.html) |
| Moodle 3.4 - 3.6 | PHPUnit 6.5 | [Documentation](https://phpunit.de/manual/6.5/en/assertions.html) |

## Writing new test files

PHPUnit tests are located in the `tests` directory of each component.

Test files:

- **MUST** be located in the `tests` directory of your component;
- **MUST** be named in lowercase characters;
- **MUST** have a filename ending in `_test.php`;
- **MUST** have a class:
  - whose name exactly matches the filename; and
  - which extends a `_testcase` class (for example `\advanced_testcase`);
- **MUST** only have one test class in each file; and
- _SHOULD_ use the same namespace as the unit under test.

For example:

```php title="mod/myplugin/tests/sample_test.php"
 namespace mod_myplugin;

 class sample_test extends \advanced_testcase {
     public function test_adding() {
         $this->assertEquals(2, 1+2);
     }
 }
```

## Inclusion of Moodle library files

Wherever possible, class autoloading _should_ be used.

Where autoloading of classes is not possible:

- classes which are _required_ to define the test class _may_ be included in the file; but
- fixtures and code under test _should_ be loaded in the `setUpBeforeClass()` method.

### Automatic state reset

Any test making use of the standard Moodle test cases (`advanced_testcase` and `basic_testcase`) will automatically reset the Moodle database and data root to their original state between tests, however you should make sure to call `$this->resetAfterTest()` to indicate that the database or changes of standard global variables are expected.

If you modify data and _do not_ call `$this->resetAfterTest()` then you will receive a warning such as:

> Warning: unexpected database modification, resetting DB state

```php title="Demonstration of database reset"
 namespace mod_myplugin;

 class test_something extends \advanced_testcase {
     public function test_deleting() {
         global $DB;

         $this->resetAfterTest(true);
         $DB->delete_records('user');
         $this->assertEmpty($DB->get_records('user'));
     }

     public function test_user_table_was_reset() {
         global $DB;

         $this->assertEquals(2, $DB->count_records('user', array()));
     }
 }
```

## Generators

Tests that need to modify default installation data may make use of data generators to create objects including courses, users, enrolments, and so on. All examples on this page should be used from test methods of a test class derived from `advanced_testcase`.

:::note Use of generators in data providers

If you are using PHPUnit [@dataProvider](https://phpunit.de/manual/current/en/writing-tests-for-phpunit.html#writing-tests-for-phpunit.data-providers) functions to provide parameters to unit tests, you **can not** use the data generator or change the user etc in the data provider function.

Data providers **must not instantiate or create data**. They may only _define_ it.

The data providers are called _before_ any test has been run and the database will be reset before the test is actually run.

:::

### Creating users

At the start of each test there are only two users present - `guest` and `admin. If you need to add more test accounts use:

```php
 $user = $this->getDataGenerator()->create_user();
```

You may also specify properties of the user account, for example:

```php
$user1 = $this->getDataGenerator()->create_user([
    'email' => 'user1@example.com',
    'username' => 'user1',
]);
```

By default no user is logged-in. You can use the `setUser()` method to simulate a user login:

```php
$this->setUser($user1);
```

Guest and admin accounts have a shortcut methods:

```php
$this->setGuestUser();
$this->setAdminUser();
```

To reset back to the original state where no user is logged in you can pass a `null` value to `setUser()`, for example:

```php
 $this->setUser(null);
```

### Creating course categories

```php
$category1 = $this->getDataGenerator()->create_category();
$category2 = $this->getDataGenerator()->create_category([
    'name' => 'Some subcategory',
    'parent' => $category1->id,
]);
```

### Creating courses

```php
$course1 = $this->getDataGenerator()->create_course();

$category = $this->getDataGenerator()->create_category();
$course2 = $this->getDataGenerator()->create_course([
    'name' => 'Some course',
    'category' => $category->id,
]);
```

### Creating activities

Some activity plugins include instance generators. The generator class are defined in plugindirectory/tests/generator/lib.php.

Example of creation of new course with one page resource:

```php
$course = $this->getDataGenerator()->create_course();
$generator = $this->getDataGenerator()->get_plugin_generator('mod_page');
$generator->create_instance([
    'course' => $course->id,
]);
```

The following is functionally the same, but a bit shorter:

```php
$course = $this->getDataGenerator()->create_course();
$page = $this->getDataGenerator()->create_module('page', ['course' => $course->id]);
```

### Creating cohorts

```php
$cohort = $this->getDataGenerator()->create_cohort();
```

### Simplified user enrolments

Instead of standard enrolment API it is possible to use simplified method in data generator. It is intended to be used with self and manual enrolment plugins.

```php
$this->getDataGenerator()->enrol_user($userid, $courseid);
$this->getDataGenerator()->enrol_user($userid, $courseid, $teacherroleid);
$this->getDataGenerator()->enrol_user(
    $userid,
    $courseid,
    $teacherroleid,
    'manual',
);
```

### Creating scales

```php
$this->getDataGenerator()->create_scale();
$this->getDataGenerator()->create_scale([
    'name' => $name,
    'scale' => $scale,
    'courseid' => $courseid,
    'userid' => $userid,
    'description' => description,
    'descriptionformat' => $descriptionformat,
]);
```

### Creating roles

```php
$this->getDataGenerator()->create_role();
$this->getDataGenerator()->create_role([
    'shortname' => $shortname,
    'name' => $name,
    'description' => description,
    'archetype' => $archetype,
]);
```

### Creating tags

```php
$this->getDataGenerator()->create_tag();
$this->getDataGenerator()->create_tag([
    'userid' => $userid,
    'rawname' => $rawname,
    'name' => $name,
    'description' => $description,
    'descriptionformat' => $descriptionformat,
    'flag' => $flag
]);
```

### Groups

#### Creating groups

```php
$this->getDataGenerator()->create_group(['courseid' => $courseid]);
$this->getDataGenerator()->create_group([
    'courseid' => $courseid,
    'name' => $name,
    'description' => $description,
    'descriptionformat' => $descriptionformat,
]);
```

#### Adding users to groups

```php
$this->getDataGenerator()->create_group_member([
    'userid' => $userid,
    'groupid' => $groupid,
]);
$this->getDataGenerator()->create_group_member([
    'userid' => $userid,
    'groupid' => $groupid,
    'component' => $component,
    'itemid' => $itemid,
]);
```

#### Creating groupings

```php
$this->getDataGenerator()->create_grouping(['courseid' => $courseid]);
$this->getDataGenerator()->create_grouping([
    'courseid' => $courseid,
    'name' => $name,
    'description' => $description,
    'descriptionformat' => $descriptionformat,
]);
```

#### Adding groups to groupings

```php
$this->getDataGenerator()->create_grouping_group([
    'groupingid' => $groupingid,
    'groupid' => $groupid,
]);
```

### Repositories

Some repository plugins include instance generators. Repositories which define a generator will have a generator defined in `path/to/repository/tests/generator/lib.php`.

#### Creating repository instances

```php
$this->getDataGenerator()->create_repository($type, $record, $options);
```

#### Creating repository types

```php
$this->getDataGenerator()->create_repository_type($type, $record, $options);
```

### Creating grades

#### Grade categories

```php
$this->getDataGenerator()->create_grade_category(['courseid' => $courseid]);
$this->getDataGenerator()->create_grade_category([
    'courseid' => $courseid,
    'fullname' => $fullname,
]);
```

#### Grade items

```php
$this->getDataGenerator()->create_grade_item();
$this->getDataGenerator()->create_grade_item([
    'itemtype' => $itemtype,
    'itemname' => $itemname,
    'outcomeid' => $outcomeid,
    'scaleid' => $scaleid,
    'gradetype' => $gradetype,
]);
```

#### Outcomes

```php
$this->getDataGenerator()->create_grade_outcome();
$this->getDataGenerator()->create_grade_item(['fullname' => $fullname]);
```

### Other types of plugin

Any other type of plugin may define their own generator.

The generator class **must** extend the `\component_generator_base` class, after which it can be fetched using:

```php
$mygenerator = $this->getDataGenerator()->get_plugin_generator("my_componentname");
```

:::note Alternatives to `\component_generator_base`

Some plugin types, such as Activity modules (`mod_` prefix) may be a more specific class to extend, for example `testing_module_generator`.

This should be used instead to give a consistent set of method names to use.

Otherwise, you can create whatever methods you like on your generator, to create the different things you need to work whith.

:::

## Long tests

All standard test should execute as fast as possible. Tests that take a longer time to execute (>10s) or are otherwise expensive (such as querying external servers that might be flooded by all dev machines) should be execute only when running long tests is enabled.

## Large test data

See `\advanced_testcase::createXMLDataSet()` and `\advanced_testcase::createCsvDataSet()` and related functions there for easier ways to manage large test data sets within files rather than arrays in code. See [PHPUnit integration#Extra methods](https://docs.moodle.org/dev/PHPUnit_integration#Extra_methods)

## Testing sending of messages

You can temporarily redirect all messages sent via `message_send()` to a message sink object. This allows developers to verify that the tested code is sending expected messages.

:::note

In several database implementations Moodle makes use of Database transactions during unit tests.

Because message sending is deferred until after the transaction has closed, you must disable the test-in-transaction for messaging to work.

:::

To test code using messaging first disable the use of transactions, and then redirect the messaging into a new message sink. You can inspect the results using the message sink:

```php
$this->preventResetByRollback();
$sink = $this->redirectMessages();

//... code that is sending messages

$messages = $sink->get_messages();
$this->assertEquals(3, count($messages));
//.. test messages were generated in correct order with appropriate content
```

<Since version="4.4" />

Since Moodle 4.4 there are two new methods that support getting the messages for specific **components** and **message types**.

```php title="Fetching all messages sent for a component"
$sink = $this->redirectMessages();

//... code that is sending messages

$messages = $sink->get_messages_by_component('mod_forum');
$this->assertEquals(3, count($messages));
//.. test messages were generated in correct order with appropriate content
```

```php title="Fetching all messages sent for a specific message type"
$sink = $this->redirectMessages();

//... code that is sending messages

$messages = $sink->get_messages_by_component_and_type(
    'core',
    'messagecontactrequests',
);
$this->assertEquals(3, count($messages));
//.. test messages were generated in correct order with appropriate content
```

## Testing sending of emails

You can temporarily redirect emails sent via `email_to_user()` to a email message sink object. This allows developers to verify that the tested code is sending expected emails.

To test code using messaging first unset 'noemailever' setting and then redirect the emails into a new message sink where you can inspect the results later.

```php
unset_config('noemailever');
$sink = $this->redirectEmails();

//... code that is sending email

$messages = $sink->get_messages();
$this->assertEquals(1, count($messages));
```

## Logstores

You can test events which were written to a logstore, but you must disable transactions, enable at least one valid logstore, and disable logstore buffering to ensure that the events are written to the database before the tests execute.

```php
$this->preventResetByRollback();
set_config('enabled_stores', 'logstore_standard', 'tool_log');
set_config('buffersize', 0, 'logstore_standard');
get_log_manager(true);
```

## Check your coverage

PHPUnit has the ability to generate code coverage information for your unit tests.

Prior to Moodle 3.7, this coverage would load all files and generate coverage for everything regardless of whether that file could be covered at all, or whether it was intentionally covered.

Since Moodle 3.7 the `phpunit.xml` configuration contains generated coverage include and exclude information for each component.

### Generating include and exclude configuration

<Since verison="3.11" />

You can programatically describe which files will be checked for coverage by creating a `coverage.php` file alongside the tests that you are writing.

<Since verison="4.0" />

From Moodle 4.0, a default configuration is applied for all plugins and it is not necessary to supply a `coverage.php` unless you wish to cover additional files.

The `coverage.php` file allows you to list include and exclude files and folders within the component being tested.

All paths specified are relative to the component being tested.
For example, when working with `mod_forum` your code will be in `mod/forum`, and its unit tests will be in `mod/forum/tests/`.
The coverage file for this would be in `mod/forum/tests/coverage.php` and all paths specified would be relative to `mod/forum`

It is possible to specify a combination of included files, included folders, excluded files, and excluded folders.
This would allow you, for example, to include the entire `classes` directory, but exclude a specific file or folder within it.

The following is an example `coverage.php` file from `mod_forum`:

```php
return new class extends phpunit_coverage_info {
    /** @var array The list of folders relative to the plugin root to include */
    protected $includelistfolders = [
        'classes',
        'externallib.php',
    ];

    /** @var array The list of files relative to the plugin root to include */
    protected $includelistfiles = [];

    /** @var array The list of folders relative to the plugin root to exclude */
    protected $excludelistfolders = [];

    /** @var array The list of files relative to the plugin root to exclude */
    protected $excludelistfiles = [];
};
```

<Since version="4.0" />

Since Moodle 4.0, the following default configuration is applied:

```php
return new class extends phpunit_coverage_info {
    /** @var array The list of folders relative to the plugin root to include */
    protected $includelistfolders = [
        'classes',
        'tests/generator',
    ];

    /** @var array The list of files relative to the plugin root to include */
    protected $includelistfiles = [
        'externallib.php',
        'lib.php',
        'locallib.php',
        'renderer.php',
        'rsslib.php',
    ];

    /** @var array The list of folders relative to the plugin root to exclude */
    protected $excludelistfolders = [];

    /** @var array The list of files relative to the plugin root to exclude */
    protected $excludelistfiles = [];
};
```

If a `coverage.php` file already exists, then the defaults will be added to the values already defined.

### Defining covered code

In addition to defining the files which should be considered in generating coverage reports, each test class **must** define what functions or classes it is _intended_ to cover.

For PHPUnit 9.6 and earlier this can be done using the [`@covers` annotation and related annotations](https://phpunit.readthedocs.io/en/9.6/code-coverage-analysis.html#specifying-covered-code-parts).

From Moodle 5.0 and PHPUnit 10 onwards, this can alternatively be done using PHP _Attributes_.

### Guidance on defining Coverage

The following guidance is based on recommendation from PHPUnit documentation.

- Coverage should be defined for an entire class rather than individual methods wherever possible
- Coverage should be defined at the class level, not for individual test methods

:::note Attributes

From PHPUnit 10, with the introduction of Attributes for coverage, the defined attributes are much more robust.

However, if you are writing a plugin and wish to test it on Moodle 4.5 or earlier _and_ Moodle 5.0 or later then you cannot use Attributes for testing.

:::

#### Common issues

#### Using the `@covers ::methodName` syntax

When defining coverage for a specific method under test, it must be either:

- defined with the class it relates to; or
- the `@coversDefaultClass` annotation must be used on the test class.

```php
/**
 * @coversDefaultClass \mod_myplugin\example
 */
class example_test extends \advanced_testcase {
    /**
     * This test will cover \mod_myplugin\example::some_method
     * @covers ::some_method
     */
    public function test_some_method(): void {}
}
```

#### Qualification of classes

When using the `@covers` annotations, all class names **must** be fully-qualified, for example:

```php
namespace mod_myplugin;

/**
 * Correct coverage definition:
 * @covers \mod_myplugin\example
 *
 * Incorrect coverage definition:
 * @covers example
 */
```

When using Attributes the standard rules of PHP namespace resolution apply:

```php

namespace mod_myplugin;

#[\PHPUnit\Framework\Attributes\CoversClass(example::class)]
```

## Best practice

There are several best practices, suggestions, and things to avoid which you should consider when writing unit tests. Some of these are described below.

### Using the magic `::class` constant

PHP supports the use of a magic `::class` constant to correctly and consistently define class names. This can be used in a range of situations, including:

- `$this->assertInstanceOf(\some\example::class, new \some\example());`
- `#[\PHPUnit\Framework\Attributes\CoversClass(\some\example::class)]`

One of the benefits of using the constant is that it supports class aliasing at runtime, meaning that a plugin's codebase can support multiple versions of Moodle where class aliasing has been used to move a class to a new location.

:::note Using on classes which do not exist

The class **does not** need to exist. You can use this constant on any arbitrary namespace.

:::

### Code coverage

PHPUnit has the ability to generate code coverage information for your unit tests and this is well supported since Moodle 3.7.
We _strongly_ recommend that you consider checking the coverage of your plugins when you write your code.

### Keep use of `resetAfterTest` to a minimum

Although many of the examples described above use the `resetAfterTest` nomenclature to reset the database and filesystem after your test completes, you should ideally not use this unless you have to.

Generally speaking you should aim to write code which is mockable, and does not require real fixtures.

Use of `resetAfterTest` will also slow your tests down.

### Be careful with shared setUp and instance variables

You should be careful of how you create and use instance variables in PHPUnit tests for two main reasons:

1. If you create any fixtures in the setUp, or call the resetAfterTest function, these fixtures and conditions will apply for _all_ tests in the testsuite. You will not be able to add another test to the suite which does not require these conditions without those conditions being fulfilled anyway. This can lead to slow tests.
1. PHPUnit creates an instance of each testcase during its bootstrap phase, and does not dispose of it for the lifetime of the test run. Anything which causes data to be stored as instance data within the testcase will be stored in memory until the _entire suite_ completes. This means that any fixture which is setup and not actively discarded will not be garbage collected and lead to memory bloat. In severe cases this can lead to memory exhaustion.

Existing testcases which contain setUp which either generate data, or set resetAfterTest should be phased out, and no new cases should be introduced.

### Make use of the dataProvider functionality

The dataProvider functionality of PHPUnit is an extremely powerful and useful feature which allows you to verify a function quickly and easily with a range of different conditions.
However, the following rules should be followed when using dataProviders:

- Keep addition of resettable data requiring resetAfterTest to a minimum - this will lead to many slow tests
- Data providers **must not instantiate/create data**. Just define it. And then, the test body can proceed with the instantiation/creation. The dataProvider is called after the testSuite is instantiated, but before any tests are run. Each test will run a full setUp and tearDown, which will destroy any data which was created.

```php
/**
 * Test function accepts parameters passed from the specified data provider.
 *
 * @dataProvider foobar_provider
 * @param int $foor
 * @param int $bar
 */
public function test_foobar(int $foo, int $bar) {
    // Perform the tests here.
}

/**
 * Data provider for {@see self::test_foobar()}.
 *
 * @return array List of data sets - (string) data set name => (array) data
 */
public function foobar_provider(): \Generator {
    yield 'Same numbers' => [
        'foo' => 42,
        'bar' => 42,
    ];
    yield 'Different numbers' => [
        'foo' => 21,
        'bar' => 84,
    ];
}
```

## Extra test settings

Usually the test should not interact with any external systems and it should work the same on all systems. But sometimes you need to specify some option for connection to external systems or system configuration. It is intentionally not possible to use `$CFG` settings from `config.php`.

There are several ways how to inject your custom settings:

- define test setting constants in your `phpunit.xml` file
- define test setting constants in your `config.php`

These constants may be then used in your test or plugin code.

## Upgrading unit tests to work with Moodle 4.4 and up (PHPUnit 9.6)

With Moodle 4.4, **PHPUnit was upgraded to 9.6** (from 9.5 being used in previous versions). This was done to **warn to developers in advance** about functionality that has been deprecated in the 9.5 series and will be removed so will stop working with the next major update to PHPUnit 10.x (see [MDL-81266](https://moodle.atlassian.net/browse/MDL-81266) and linked issues for more details).

While everything should continue working without modification with PHPUnit 9.6, you will may get a **good number of deprecation warnings** ("W" in the tests output) that **should be analysed**, replacing or removing them as soon as possible, because all those warnings will become errors with next PHPUnit upgrade.

A good summary of all the **changes and replacements to perform** is available in the [lib/upgrade.txt](https://github.com/stronk7/moodle/commit/b2131ceff74da4c23928936f238d676a08e07d7f) file. With main points being:

- [MDL-81281](https://moodle.atlassian.net/browse/MDL-81281). A number of attribute-related assertions have been deprecated, will be removed with PHPUnit 10. Alternatives for **some** of them are available:
  - `assertClassHasAttribute()`
  - `assertClassNotHasAttribute()`
  - `assertClassHasStaticAttribute()`
  - `assertClassNotHasStaticAttribute()`
  - `assertObjectHasAttribute()`         => `assertObjectHasProperty()`
  - `assertObjectNotHasAttribute()`      => `assertObjectNotHasProperty()`
- [MDL-81266](https://moodle.atlassian.net/browse/MDL-81266). A number of deprecation, notice, warning and error expectations have been deprecated, will be removed with PHPUnit 10. No alternative exists. A working replacement is available in the linked issue, hopefully there aren't many cases.
  - `expectDeprecation()`
  - `expectDeprecationMessage()`
  - `expectDeprecationMessageMatches()`
  - `expectError()`
  - `expectErrorMessage()`
  - `expectErrorMessageMatches()`
  - `expectNotice()`
  - `expectNoticeMessage()`
  - `expectNoticeMessageMatches()`
  - `expectWarning()`
  - `expectWarningMessage()`
  - `expectWarningMessageMatches()`
  - [MDL-81308](https://moodle.atlassian.net/browse/MDL-81308). The `->withConsecutive()` functionality on PHPUnit mocks has been deprecated, and will be removed with PHPUnit 10.
  - `\PHPUnit\Framework\TestCase::getMockClass()` has been deprecated, will be removed with PHPUnit 10. No clear alternative exists and won't be investigated, because there aren't cases in core.
  - You **MUST NOT** use the `_test` suffix on abstract test case classes. Test case classes **MUST** be named with the `__testcase` suffix.

## See also

- [PHPUnit integration](https://docs.moodle.org/dev/PHPUnit_integration)
- [PHPUnit](/general/development/tools/phpunit)
