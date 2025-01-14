---
title: Writing PHPUnit tests
tags:
  - Unit testing
  - PHPUnit
  - Testing
  - Quality Assurance
---
<Since versions="2.3" />

Moodle PHPUnit integration is designed to allow easy adding of new tests. At the start of each test the state is automatically reset to fresh new installation (unless explicitly told not to reset).

## Namespaces

All the stuff under **/tests directories is [subject to some simple rules](../../policies/codingstyle/index.md#namespaces-within-.2a.2a.2ftests-directories) when using namespaces. They apply to test cases, fixtures, generators and, in general, any class within those directories. Take a look to them! (grand summary = 100% the same rules that are applied to **/classes directories).

## Testcase classes

There are three basic test class that are supposed to used in all Moodle unit tests - basic_testcase, advanced_testcase and provider_testcase. **Please note it is strongly recommended to put only one testcase into each class file.**
;basic_testcase : Very simple tests that do not modify database, dataroot or any PHP globals. It can be used for example when trying examples from the official PHPUnit tutorial.
;advanced_testcase : Enhanced testcase class enhanced for easy testing of Moodle code.
;provider_testcase: Enhanced testcase class, enhanced for easy testing of [Privacy Providers](/docs/apis/subsystems/privacy/).
There is a fourth testcase class that is specially designed for testing of our Moodle database layer, it should not be used for other purposes.

### Assertions

The complete list of assertions can be found in the links below.

| Moodle version | PHPUnit version | Links |
| --- | --- | --- |
| Moodle 3.11 | PHPUnit 9.5 | [Documentation](https://phpunit.readthedocs.io/en/9.5/assertions.html) |
| Moodle 3.10 | PHPUnit 8.5 | [Documentation](https://phpunit.readthedocs.io/en/8.5/assertions.html) |
| Moodle 3.7 - 3.9 | PHPUnit 7.5 | [Documentation](https://phpunit.readthedocs.io/en/7.5/assertions.html) |
| Moodle 3.4 - 3.6 | PHPUnit 6.5 | [Documentation](https://phpunit.de/manual/6.5/en/assertions.html) |

### Sample plugin testcase

PHPUnit tests are located in <tt>tests/*_test.php</tt> files in your plugin, for example <tt>mod/myplugin/tests/sample_test.php</tt>, the file should contain only one class that extends <tt>advanced_testcase</tt>:

```php
 namespace mod_myplugin;

 class sample_test extends \advanced_testcase {
     public function test_adding() {
         $this->assertEquals(2, 1+2);
     }
 }
```

See [PHPUnit integration#Class and file naming rules](https://docs.moodle.org/dev/PHPUnit_integration#Class_and_file_naming_rules) for more information.

### Inclusion of Moodle library files

If you want to include some Moodle library files you should always declare **global $CFG**. The reason is that testcase files may be included from non-moodle code, which does not make the global $CFG available automatically.

### Automatic state reset
By default, after each test, Moodle database and dataroot are automatically reset to the original state, which was present right after installation. Make sure to use $this->resetAfterTest() to indicate that the database or changes of standard global variables are expected.

If you received the error "Warning: unexpected database modification, resetting DB state" it is because the test is not using <tt>$this->resetAfterTest()</tt>.

```php
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

Tests that need to modify default installation may use generators to create new courses, users, etc. All examples on this page should be used from test methods of a test class derived from advanced_testcase.

Note if you are using PHPUnit [@dataProvider](https://phpunit.de/manual/current/en/writing-tests-for-phpunit.html#writing-tests-for-phpunit.data-providers) functions to provide parameters to unit tests, you can not use the data generator or change the user etc in the data provider function. Data providers **must not instantiate/create data**. Just define it. And then, the test body can proceed with the instantiation/creation.

### Creating users

At the start of each test there are only two users present - guest and administrator. If you need to add more test accounts use:

```php
 $user = $this->getDataGenerator()->create_user();
```

You may also specify properties of the user account, for example:

```php
 $user1 = $this->getDataGenerator()->create_user(array('email'=>'user1@example.com', 'username'=>'user1'));
```

By default no user is logged-in, use setUser() method to change current $USER value:

```php
 $this->setUser($user1);
```

Guest and admin accounts have a shortcut methods:

```php
 $this->setGuestUser();
 $this->setAdminUser();
```

Null can be used to set current user back to not-logged-in:

```php
 $this->setUser(null);
```

### Creating course categories

```php
 $category1 = $this->getDataGenerator()->create_category();
 $category2 = $this->getDataGenerator()->create_category(array('name'=>'Some subcategory', 'parent'=>$category1->id));
```

### Creating courses

```php
 $course1 = $this->getDataGenerator()->create_course();
 
 $category = $this->getDataGenerator()->create_category();
 $course2 = $this->getDataGenerator()->create_course(array('name'=>'Some course', 'category'=>$category->id));
```

### Creating activities

Some activity plugins include instance generators. The generator class are defined in plugindirectory/tests/generator/lib.php.

Example of creation of new course with one page resource:

```php
 $course = $this->getDataGenerator()->create_course();
 $generator = $this->getDataGenerator()->get_plugin_generator('mod_page');
 $generator->create_instance(array('course'=>$course->id));
```

The following is functionally the same, but a bit shorter:

```php
 $course = $this->getDataGenerator()->create_course();
 $page = $this->getDataGenerator()->create_module('page', array('course' => $course->id));
```

### Creating cohorts

<Since versions="2.4" />
Since 2.4 there the data generator supports creation of new cohorts.

```php
 $cohort = $this->getDataGenerator()->create_cohort();
```

### Simplified user enrolments

<Since versions="2.4" />
Instead of standard enrolment API it is possible to use simplified method in data generator. It is intended to be used with self and manual enrolment plugins.

```php
$this->getDataGenerator()->enrol_user($userid, $courseid);
$this->getDataGenerator()->enrol_user($userid, $courseid, $teacherroleid);
$this->getDataGenerator()->enrol_user($userid, $courseid, $teacherroleid, 'manual');
```

### Creating scales

```php
$this->getDataGenerator()->create_scale();
$this->getDataGenerator()->create_scale(array('name' => $name, 'scale' => $scale, 'courseid' => $courseid, 'userid' => $userid, 'description' => description, 'descriptionformat' => $descriptionformat));
```

### Creating roles

```php
$this->getDataGenerator()->create_role();
$this->getDataGenerator()->create_role(array('shortname' => $shortname, 'name' => $name, 'description' => description, 'archetype' => $archetype));
```

### Creating tags

```php
$this->getDataGenerator()->create_tag();
$this->getDataGenerator()->create_tag(array(
    'userid' => $userid, 
    'rawname' => $rawname,
    'name' => $name, 
    'description' => $description, 
    'descriptionformat' => $descriptionformat,
    'flag' => $flag
));
```

### Groups

#### Creating groups

```php
$this->getDataGenerator()->create_group(array('courseid' => $courseid));
$this->getDataGenerator()->create_group(array('courseid' => $courseid, 'name' => $name, 'description' => $description, 'descriptionformat' => $descriptionformat));
```

#### Adding users to groups

```php
$this->getDataGenerator()->create_group_member(array('userid' => $userid, 'groupid' => $groupid));
$this->getDataGenerator()->create_group_member(array('userid' => $userid, 'groupid' => $groupid, 'component' => $component, 'itemid' => $itemid));
```

#### Creating groupings

```php
$this->getDataGenerator()->create_grouping(array('courseid' => $courseid));
$this->getDataGenerator()->create_grouping(array('courseid' => $courseid, 'name' => $name, 'description' => $description, 'descriptionformat' => $descriptionformat));
```

#### Adding groups to groupings

```php
$this->getDataGenerator()->create_grouping_group(array('groupingid' => $groupingid, 'groupid' => $groupid));
```

### Repositories

#### Creating repository instances

<Since versions="2.5" />
Some respository plugins include instance generators. The generator class are defined in plugindirectory/tests/generator/lib.php..

```php
$this->getDataGenerator()->create_repository($type, $record, $options);
```

#### Creating repository types

<Since versions="2.5" />
Some respository plugins include type generators. The generator class are defined in plugindirectory/tests/generator/lib.php..

```php
$this->getDataGenerator()->create_repository_type($type, $record, $options);
```

### Creating grades

#### Grade categories

```php
$this->getDataGenerator()->create_grade_category(array('courseid' => $courseid));
$this->getDataGenerator()->create_grade_category(array('courseid' => $courseid, 'fullname' => $fullname));
```

#### Grade items

```php
$this->getDataGenerator()->create_grade_item();
$this->getDataGenerator()->create_grade_item(array('itemtype' => $itemtype, 'itemname' => $itemname, 'outcomeid' => $outcomeid, 'scaleid' => $scaleid, 'gradetype' => $gradetype));
```

#### Outcomes

```php
$this->getDataGenerator()->create_grade_outcome();
$this->getDataGenerator()->create_grade_item(array('fullname' => $fullname));
```

### Other types of plugin

<Since versions="2.5" />
Any other type of plugin can have a generator. The generator class should extend component_generator_base, and then you can get an instance using $mygenerator = $this->getDataGenerator()->get_plugin_generator($frankenstylecomponentname);

For some types of plugin, like mod documented above, there may be a more specific class than component_generator_base to extend, like testing_module_generator. That will give a consistent set of method names to use. Otherwise, you can create whatever methods you like on your generator, to create the different things you need to work whith.

## Long tests

All standard test should execute as fast as possible. Tests that take a longer time to execute (>10s) or are otherwise expensive (such as querying external servers that might be flooded by all dev machines) should be execute only when PHPUNIT_LONGTEST is true. This constant can be set in phpunit.xml or directly in config.php.

## Large test data

See advanced_testcase::createXMLDataSet() and advanced_testcase::createCsvDataSet() and related functions there for easier ways to manage large test data sets within files rather than arrays in code. See [PHPUnit integration#Extra methods](https://docs.moodle.org/dev/PHPUnit_integration#Extra_methods)

## Testing sending of messages

<Since versions="2.4" />
You can temporarily redirect all messages sent via message_send() to a message sink object. This allows developers to verify that the tested code is sending expected messages.

To test code using messaging first disable the use of transactions and then redirect the messaging into a new message sink, you can inspect the results later.

```php
$this->preventResetByRollback();
$sink = $this->redirectMessages();
//... code that is sending messages
$messages = $sink->get_messages();
$this->assertEquals(3, count($messages));
//.. test messages were generated in correct order with appropriate content
```

<Since versions="4.4" />
Since **4.4** there are two new methods that support getting the messages for specific **components** and **message types**.

```php
$sink = $this->redirectMessages();
//... code that is sending messages
$messages = $sink->get_messages_by_component('mod_forum');
$this->assertEquals(3, count($messages));
//.. test messages were generated in correct order with appropriate content
```

```php
$sink = $this->redirectMessages();
//... code that is sending messages
$messages = $sink->get_messages_by_component_and_type('core', 'messagecontactrequests');
$this->assertEquals(3, count($messages));
//.. test messages were generated in correct order with appropriate content
```

## Testing sending of emails

<Since versions="2.6" />
You can temporarily redirect emails sent via email_to_user() to a email message sink object. This allows developers to verify that the tested code is sending expected emails.

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

<Since versions="3.7" />
PHPUnit has the ability to generate code coverage information for your unit tests.

Prior to Moodle 3.7, this coverage would load all files and generate coverage for everything regardless of whether that file could be covered at all, or whether it was intentionally covered.

Since Moodle 3.7 the **phpunit.xml** configuration contains generated coverage include and exclude information for each component.

### Generating include and exclude configuration

{{Moodle 3.11}}
You can programatically describe which files will be checked for coverage by creating a <tt>coverage.php</tt> file alongside the tests that you are writing.

Since Moodle 4.0, a default configuration is applied for all plugins and it is not necessary to supply a coverage.php unless you wish to cover additional files.

The <tt>coverage.php</tt> file allows you to list include and exclude files and folders within the component being
tested. All paths specified are relative to the component being tested. For example, when working with **mod_forum** your
code will be in **mod/forum**, and its unit tests will be in **mod/forum/tests/example_test.php**. The coverage file
for this would be in **mod/forum/tests/coverage.php** and all paths specified would be relative to **mod/forum**.

It is possible to specify a combination of included files, included folders, excluded files, and excluded folders. This would allow you, for example, to include the entire **classes** directory, but exclude.a specific file or folder within it.

The following is an example <tt>coverage.php</tt> file from **mod_forum**:

Note: For Moodle versions 3.7 to 3.10, the [syntax used](https://docs.moodle.org/dev/index.php?title=Writing_PHPUnit_tests&oldid=58177#Check_your_coverage) was slightly different.

```php
return new class extends phpunit_coverage_info {
    /** @var array The list of folders relative to the plugin root to include in coverage generation. */
    protected $includelistfolders = [
        'classes',
        'externallib.php',
    ];

    /** @var array The list of files relative to the plugin root to include in coverage generation. */
    protected $includelistfiles = [];

    /** @var array The list of folders relative to the plugin root to exclude from coverage generation. */
    protected $excludelistfolders = [];

    /** @var array The list of files relative to the plugin root to exclude from coverage generation. */
    protected $excludelistfiles = [];
};
```

Also, note that you can better define which class or function each test is effectively covering by using the <tt>@covers</tt> annotation as [described in the documention](https://phpunit.readthedocs.io/en/9.5/code-coverage-analysis.html#specifying-covered-code-parts).

Since Moodle 4.0, the following default configuration is applied:
<Since versions="4.0" />

```php
return new class extends phpunit_coverage_info {
    /** @var array The list of folders relative to the plugin root to include in coverage generation. */
    protected $includelistfolders = [
        'classes',
        'tests/generator',
    ];

    /** @var array The list of files relative to the plugin root to include in coverage generation. */
    protected $includelistfiles = [
        'externallib.php',
        'lib.php',
        'locallib.php',
        'renderer.php',
        'rsslib.php',
    ];

    /** @var array The list of folders relative to the plugin root to exclude from coverage generation. */
    protected $excludelistfolders = [];

    /** @var array The list of files relative to the plugin root to exclude from coverage generation. */
    protected $excludelistfiles = [];
};
```

If a coverage.php file already exists, then the defaults will be added to the values already defined.

## Best practice

There are several best practices, suggestions, and things to avoid which you should consider when writing unit tests. Some of these are described below.

### Code coverage

PHPUnit has the ability to generate code coverage information for your unit tests and this is well supported since.Moodle 3.7. We recommend that you consider checking the coverage of your plugins when you write your code.

We recommend that you explicitly set the @covers annotation as described in the [PHPUnit documentation](https://phpunit.readthedocs.io/en/9.5/annotations.html#appendixes-annotations-covers-tables-annotations).

### Keep use of resetAfterTest to a minimum

Although many of the examples described above use the `resetAfterTest` nomenclature to reset the database and filesystem after your test completes, you should ideally not use this unless you have to.
Generally speaking you should aim to write code which is mockable, and does not require real fixtures.
Use of resetAfterTest will also slow your tests down.

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
public function foobar_provider(): array {
    return [
        'Same numbers' => [
            'foo' => 42,
            'bar' => 42,
        ],
        'Different numbers' => [
            'foo' => 21,
            'bar' => 84,
        ],
    ];
}
```

## Extra test settings

Usually the test should not interact with any external systems and it should work the same on all systems. But sometimes you need to specify some option for connection to external systems or system configuration. It is intentionally not possible to use $CFG settings from config.php.

There are several ways how to inject your custom settings:

- define test setting constants in your phpunit.xml file
- define test setting constants in your config.php
These constants may be then used in your test or plugin code.

## Upgrading unit tests to work with Moodle 4.4 and up (PHPUnit 9.6)

<Since versions="4.4" />

With Moodle 4.4, **PHPUnit was upgraded to 9.6** (from 9.5 being used in previous versions). This was done to **warn to developers in advance** about functionality that has been deprecated in the 9.5 series and will be removed so will stop working with the next major update to PHPUnit 10.x (see [MDL-81266](https://tracker.moodle.org/browse/MDL-81266) and linked issues for more details).

While everything should continue working without modification with PHPUnit 9.6, you will may get a **good number of deprecation warnings** ("W" in the tests output) that **should be analysed**, replacing or removing them as soon as possible, because all those warnings will become errors with next PHPUnit upgrade.

A good summary of all the **changes and replacements to perform** is available in the [lib/upgrade.txt](https://github.com/stronk7/moodle/commit/b2131ceff74da4c23928936f238d676a08e07d7f) file. With main points being:

- [MDL-81281](https://tracker.moodle.org/browse/MDL-81281). A number of attribute-related assertions have been deprecated, will be removed with PHPUnit 10. Alternatives for **some** of them are available:
  - assertClassHasAttribute()
  - assertClassNotHasAttribute()
  - assertClassHasStaticAttribute()
  - assertClassNotHasStaticAttribute()
  - assertObjectHasAttribute()         => assertObjectHasProperty()
  - assertObjectNotHasAttribute()      => assertObjectNotHasProperty()
- [MDL-81266](https://tracker.moodle.org/browse/MDL-81266). A number of deprecation, notice, warning and error expectations have been deprecated, will be removed with PHPUnit 10. No alternative exists. A working replacement is available in the linked issue, hopefully there aren't many cases.
  - expectDeprecation()
  - expectDeprecationMessage()
  - expectDeprecationMessageMatches()
  - expectError()
  - expectErrorMessage()
  - expectErrorMessageMatches()
  - expectNotice()
  - expectNoticeMessage()
  - expectNoticeMessageMatches()
  - expectWarning()
- expectWarningMessage()
- expectWarningMessageMatches()
- [MDL-81308](https://tracker.moodle.org/browse/MDL-81308). The <tt>->withConsecutive()</tt> functionality on PHPUnit mocks has been **silently** deprecated, will be removed with PHPUnit 10. Note that this won't affect PHPUnit 9.6 runs and an alternative path will be proposed in the linked issue, part of the PHPUnit 10 epic.
- <tt>PHPUnit\Framework\TestCase::getMockClass()</tt> has been deprecated, will be removed with PHPUnit 10. No clear alternative exists and won't be investigated, because there aren't cases in core.
- Cannot use the <tt>Test</tt> suffix on abstract test case classes. Proceed to rename them to end with <tt>TestCase</tt> instead.

## Upgrading unit tests to work with Moodle 3.11 and up (PHPUnit 9.5)

{{Moodle 3.11}}

With Moodle 3.11, **PHPUnit was upgraded to 9.5** (from 8.5 being used in previous versions). This was done to **better align** the testing environment with PHP versions supported by Moodle 3.11 (7.3, 7.4 and [8.0](../../policies/php.md)) (see [MDL-71036](https://tracker.moodle.org/browse/MDL-71036) and linked issues for more details).

While a lot of existing tests will work without modification with PHPUnit 9.5, you will get a **good number of deprecation warnings** ("W" in the tests output) that **should be replaced by their new counterparts as soon as possible**, because all those warnings will become errors with next PHPUnit upgrade.

To find more information about the changes coming with PHPUnit 9.5, it's recommended to read the following resources:

- [A good article](https://thephp.cc/news/2020/02/migrating-to-phpunit-9) explaining all the main changes in the release.
- [PHPUnit 9 release Announcement](https://phpunit.de/announcements/phpunit-9.html).
- These multiple detailed changelogs (because all them have included modifications requiring changes): [9.0](https://github.com/sebastianbergmann/phpunit/blob/9.0.0/ChangeLog-9.0.md), [9.1](https://github.com/sebastianbergmann/phpunit/blob/9.1.0/ChangeLog-9.1.md), [9.3](https://github.com/sebastianbergmann/phpunit/blob/9.3.0/ChangeLog-9.3.md), [9.5](https://github.com/sebastianbergmann/phpunit/blob/9.5.0/ChangeLog-9.5.md)
- [Official PHPUnit manual](https://phpunit.readthedocs.io/en/9.5/).
A good summary of all the **changes and replacements to perform** is available in the [lib/upgrade.txt](https://github.com/moodle/moodle/blob/e3a46964dc6d8ca1558c6e1e8dfdf3c1745eeaed/lib/upgrade.txt#L5-L65) file. With main points being:
- All the changes that were deprecated with PHPUnit 8.5 (see the section below) are now removed and will lead to errors.
- <tt>assertContains()</tt> now performs stricter comparison (like <tt>assertSame()</tt> does). New <tt>assertContainsEquals()</tt> has been created to provide the old behavior.
- Changes to the <tt>phpunit.xml</tt> schema, mostly internal. These only will impact if you are using custom <tt>phpunit.xml</tt> files:
  - The previous <tt><filter></tt> section is now (better) called <tt><coverage></tt>. And, within it:
    - <tt><whitelist></tt> has been replaced by <tt><include></tt>.
    - <tt><exclude></tt> is not a child of <tt><whitelist></tt> anymore, but of <tt><coverage></tt>.
  - But with implications when defining the [coverage information](https://docs.moodle.org/dev/#Check_your_coverage) because <tt>$whitelistxxx</tt> properties used by the <tt>coverage.php</tt> files have been deprecated, instead use <tt>includelistfolders</tt> and <tt>includelistfiles</tt> (to better map the elements in the xml).
- Warning: It's not possible to run individual test files any more. Use any of the alternative execution methods (filter, suite, config) to specify which tests you want to run. This will be hopefully fixed in [MDL-71049](https://tracker.moodle.org/browse/MDL-71049) once it has been agreed which the best way to proceed is.
- Deprecations, deprecations, deprecations. Lots of them in often used assertions: file assertions, regexp assertions, exception expectations... again, note that all them will become errors with the next PHPUnit update, so **the recommendation is to update them ASAP**.
Finally, it's also a good idea to [browse the changes associated with the issue](https://github.com/moodle/moodle/compare/fc335f5...713722c), hopefully with useful explanations in the commit messages.

## Upgrading unit tests to work with Moodle 3.10 and up (PHPUnit 8.5)

{{Moodle 3.10}}

With Moodle 3.10, **PHPUnit was upgraded to 8.5** (from 7.5 being used in older version). This was done to **better align** the testing environment with PHP versions supported by Moodle 3.10 (7.2, 7.3 and 7.4) and also to provide an **easier jump to PHPUnit 9.x** that will be needed for Moodle 3.11 (php versions 7.3, 7.4 and 8.0), removing a lot of deprecated stuff in advance. (see [MDL-67673](https://tracker.moodle.org/browse/MDL-67673) and [MDL-64600](https://tracker.moodle.org/browse/MDL-64600) for more details).

While 99% of existing tests will work without modification with PHPUnit 8.5, you will get a **good number of deprecation warnings** ("W" in the tests output) that **should be replaced by their new counterparts as soon as possible**, because all those warnings will become errors with next PHPUnit upgrade.

To find more information about the changes coming with PHPUnit 8.5, it's recommended to read the following resources:

- [A good article](https://thephp.cc/news/2019/02/help-my-tests-stopped-working) explaining all the main changes in the release.
- [PHPUnit 8 release Announcement](https://phpunit.de/announcements/phpunit-8.html).
- [Detailed changelog of the release](https://github.com/sebastianbergmann/phpunit/blob/130104cf796a88dd1547dc5beb8bd555c2deb55e/ChangeLog-8.0.md).
- [Official PHPUnit manual](https://phpunit.readthedocs.io/en/8.5/).
- A good summary of all the **changes and replacements to perform** is available in the [lib/upgrade.txt](https://github.com/moodle/moodle/blob/6594c54b2eef62499d304bfa0939999e3a14246e/lib/upgrade.txt#L5-L37) file. With main points being:
  - Support for PHP 7.0 dropped (because all template methods (<tt>setUp()</tt>, <tt>tearDown()</tt>..) now require to return void. This will mostly impact 3rd-part plugins that were still running the same tests against old branches of Moodle with PHP 7.0 support.
  - <tt>PHPUnit/DBUnit</tt> has been removed are replaced by a lightweight alternative.
  - Deprecations, deprecations, deprecations. Lots of them in often used assertions (<tt>assertContains()</tt>, <tt>assertEquals()</tt>...) and also <tt>@expectedExceptionXXX</tt> annotations. Again, note that all them will become errors with PHPUnit 9.
- Finally, it's also a good idea to [browse the changes associated with the issue](https://github.com/moodle/moodle/compare/5903054...b13ec3c), hopefully with useful enough explanations in the commit messages.

## Upgrading unit tests to work with Moodle 3.7 and up (PHPUnit 7.5)

<Since versions="3.7" />

With Moodle 3.7, **PHPUnit was upgraded to 7.5** (from 6.x being used in older version). This was done to better align the testing environment with PHP versions supported by Moodle 3.7 (7.1, 7.2 and 7.3). (see [MDL-65204](https://tracker.moodle.org/browse/MDL-65204) and linked issues for more details). While internally [a lot of things changed with PHPUnit 7](https://phpunit.de/announcements/phpunit-7.html) (PHP 7.1-isms, typed signatures, void returns, assertEquals() changes), thanks to our **wrapping layer** (basic and advanced testcases...) impact expected into old existing unit tests is expected to be reduced and upgrades, easy to achieve.

To find more information about the changes coming with PHPUnit 7, it's recommended to read the following resources:

- [PHPUnit 7 release Announcement](https://phpunit.de/announcements/phpunit-7.html).
- [Detailed changelog of the release](https://github.com/sebastianbergmann/phpunit/blob/520723129e2b3fc1dc4c0953e43c9d40e1ecb352/ChangeLog-7.5.md), paying special attention to the added, deprecated, changed and deleted sections.
- [Official PHPUnit manual](https://phpunit.readthedocs.io/en/7.5/).
- Changes performed into core, mainly: new, stricter, signatures ([26218b7](https://github.com/moodle/moodle/commit/26218b7)) and assertEquals() changes, specially important when comparing strings, now performed using strict (===) equals ([85f47ba](https://github.com/moodle/moodle/commit/85f47ba)).

## Upgrading unit tests to work with Moodle 3.4 and up (PHPUnit 6)

<Since versions="3.4" />

With Moodle 3.4, **PHPUnit was upgraded to 6.4** (from 5.5 being used in older version). This was done to better align the testing environment with PHP versions supported by Moodle 3.4 (7.0, 7.1 and 7.2). (see [MDL-60611](https://tracker.moodle.org/browse/MDL-60611) and linked issues for more details). While internally [a lot of things changed with PHPUnit 6](https://github.com/sebastianbergmann/phpunit/wiki/Release-Announcement-for-PHPUnit-6.0.0#backwards-compatibility-issues) (namespaced classes being the more noticeable), thanks to our **wrapping layer** (basic and advanced testcases...) impact expected into old existing unit tests is expected to be reduced and upgrades, easy to achieve.

Still, in **some cases, it will impossible to maintain compatibility** of tests between old (pre 3.4) tests and new ones, especially **when direct use of any phpunit class is performed**. Luckily, both GitHub Actions and CI tests will detect this situation and it shouldn't be hard to keep all supported branches in core passing ok. Plugins may be trickier, if the same branch is attempting to work against multiple core branches and they are using some phpunit class directly.

To find more information about the changes coming with PHPUnit 6, it's recommended to read the following resources:

- [A very good mini-guide](https://thephp.cc/news/2017/02/migrating-to-phpunit-6) showing all the important changes.
- [PHPUnit 6 release Announcement](https://github.com/sebastianbergmann/phpunit/wiki/Release-Announcement-for-PHPUnit-6.0.0#backwards-compatibility-issues).
- [Detailed changelog of the release](https://github.com/sebastianbergmann/phpunit/blob/9d0c024d2099531442d862b66b0ad7cf35ed8e78/ChangeLog-6.0.md), paying special attention to the changed and deleted sections.
- Changes performed into core, mainly: namespace class renaming ([801a372](https://github.com/moodle/moodle/commit/801a372dadb6e11c8781547603e3f0a59ce5638f)) and deprecated stuff ([796e48a](https://github.com/moodle/moodle/commit/796e48a58bf18533bdca423fff7949ab119101c4))

## See also

- [PHPUnit integration](https://docs.moodle.org/dev/PHPUnit_integration)
- [PHPUnit](../phpunit.md)
