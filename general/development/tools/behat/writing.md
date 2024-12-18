---
title: Writing acceptance tests
sidebar_position: 2
tags:
  - Quality Assurance
  - Testing
  - Behaviour testing
  - Behat
---
This documentation gives some hints on writing behat tests for Moodle core, and for plugins. The focus of the documentation is on behat tests for plugins. Behat Features and Scenarios are written in a natural language, and should
describe how a user would interact with Moodle.

Each test consists of several stages which are categorised by the terms **Given**, **When**, and **Then**:

- **Given**: These steps allow you to perform a test set-up. Typically Given steps are used to set configuration, create users, courses and plugin instances, and generally prepare the site for testing
- **When**: When steps are used to get the test environment to the point at which you wish to test the conditions. This may include logging in, and then performing a range of actions like submitting an assignment and grading it for example
- **Then**: Then steps are used to check that your plugin behaved as expected. They typically check very simple things like if certain elements or text are visible or not. For example after submitting an assignment in the When stage, you may have a step which checks that a notice was shown to state that the submission was successful.
These three stages match the standard [Four-phase test pattern](http://xunitpatterns.com/Four%20Phase%20Test.html). The fourth phase is 'tear-down' which is performed by Moodle between each test and does not need to be explicitly defined in your test.

:::warning

Each test should have only one use of **Given**, **When**, and **Then**.
See [MDLSITE-3778](https://tracker.moodle.org/browse/MDLSITE-3778) for information and the policy decision on why you should not have multiple Given, When, and Then steps.

:::

Where you have several Given, When, and Then steps you should use the words **And**, and **But**, for example:

```gherkin
Given the following user exists:
  | username   | ccolon             |
  | First name | Colin              |
  | Last name  | Colon              |
  | email      | ccolon@example.com |
And the following course exists:
  | Name      | Jump Judging (Level 1) |
  | Shortname | sjea1                  |
When I log in as "ccolon"
And I navigate to "Site home > Jump Judging (Level 1)"
Then I should see "You are not enrolled in this course"
But I should see "Enrol now"
```

:::tip

To initialize and run your tests, please follow the instructions of [Running acceptance test](./running.md).

:::

## Create your own tests

Behat tests are located within the directory tests/behat of your plugin.
The different tests are defined in files with the ending `*.feature`.
First, you have to define the header of your test:

```gherkin
@mod @mod_yourplugin @javascript
Feature: Here comes a description of your user story.
```

The tags on top of the feature description can be used to select specific test cases when running the tests.
The `@javascript` tag should only be used, if JavaScript is needed to execute your test. This is dependent on the step you will use in your definition.
JavaScript tests are usually much slower than tests executed without JavaScript.

Afterwards you can specify a scenario:

```gherkin
Scenario: Description of your scenario, which you want to test.
    When I log in as "student1"
    And I am on "Course 1" course homepage
```

Again you can define specific tags. Afterwards you write the steps, which should be executed during your test.

:::tip

Tags that are specified in your feature's header automatically apply to all scenarios defined in that feature, so it is not necessary to repeat them. In the above example, the scenario will use JavaScript, although it does not have the `@javascript` tag.

:::

### Multiple Scenarios

You can have an arbitrary amount of scenarios within a test. Please make sure they all belong to the same feature.
If you have certain steps, which should be executed for every scenario of a feature, you can define them using a background:

```gherkin
Background:
    Given the following "courses" exist:
      | fullname | shortname | category | groupmode |
      | Course 1 | C1        | 0        | 1         |
    And the following "users" exist:
      | username | firstname | lastname | email |
      | teacher1 | Theo | Teacher | teacher1@example.com |
```

This is usually used, to define the different `Given` steps.

### Use existing steps

There are different ways how to effectively browse the available existing steps:

#### Moodle Administration

Moodle offers within its administration menu under Site Administration > Development > Acceptance Testing a complete and searchable list of all available step definitions.
However, make sure you installed the behat test site first!

#### IDE integration

<!-- cspell:ignore IntelliJ, textareas,  -->
In PhpStorm or IntelliJ you can install the behat extension. Then you get auto completions within feature files, which helps a lot during behat test development.

### Providing values to steps

Most of the steps requires values, there are methods to provide values to steps, the method depends on the step specification.

- **A string/text** is the most common case, the texts are wrapped between double quotes (`"` character) you have to replace the info about the expected value for your value; for example something like **I press "BUTTON_STRING"** should become **I press "Save and return to course"**. If you want to add a string which contains a " character, you can escape it with a backslash `\"`, for example **I fill the "Name" field with "Alan alias \\"the legend\\""**. You can identify this steps because they ends with **_STRING**
- **A number** some steps requires numbers as values, to be more specific an undetermined number of digits from 0 to 9 (Natural numbers + 0) you can identify them because the expected value info string ends with **_NUMBER**
- **A table**; is a relation between values, the most common use of it is to fill forms. The steps which requires tables are easily identifiable because they finish with **:** The steps description gives info about what the table columns must contain, for example **Fills a moodle form with field/value data**. Here you don't need to escape the double quotes if you want to include them as part of the value.
- **A PyString** is a multiline string, most commonly used to fill out forms when a newline is required. Like steps with tables, steps which require PyStrings will end with ":"
- **A field value** There are many different field types, if an argument requires a field value the expected value will depend on the field type:
  - Text-based fields: It expects the text. This includes textareas, input type text, input type password...
  - Checkbox: It expects 1 to check and for checked and "" to uncheck or for unchecked
  - Select: It expects the option text or the option value. In case you interact with a multi-select you should specify the options separating them with commas. For example: **option1, option2, option3**
  - Radio: The text of the radio option
- **A selector** there are steps that can be used with different kinds of elements, for example **I click on "User Name" "link"** or **I click on "User Name" "button"** this is a closed list of elements, they always works together with another argument, where you specify the locator (eg. the link text in a link) In the 'Acceptance testing' interface you can see a drop-down menu to select one of these options:
  - field - for searching a field by its id, name, value or label
  - link - for searching a link by its href, id, title, img alt or value
  - button - for searching a button by its name, id, value, img alt or title
  - link_or_button - for searching for both, links and buttons
  - select - for searching a select field by its id, name or label
  - checkbox - for searching a checkbox by its id, name, or label
  - radio - for searching a radio button by its id, name, or label
  - file - for searching a file input by its id, name, or label
  - optgroup - for searching optgroup by its label
  - option - for searching an option by its content
  - dialogue - for searching a dialogue with the specified header text
  - filemanager - for searching a filemanager by it's id or label
  - block - for searching a Moodle block by it's English name or it's frankenstyle name
  - section - for searching for a section on a course page by it's title or its written out date (e.g. "1 January - 7 January"). Use "frontpage" "section" for the frontpage section if it has no title (default)
  - activity - for searching for an activity module in a course list by it's title
  - region - for searching a Moodle page region with that id, in fact it works with all ids for <tt>div</tt>, <tt>section</tt>, <tt>aside</tt>, <tt>header</tt> or <tt>footer</tt> elements.
  - table_row - for searching a table row which contains the specified text
  - table - for searching a table by its id or caption
  - icon - for searching an icon by its title
  - fieldset - for searching a fieldset by it's id or legend
  - css_element - for searching an element by its CSS selector
  - xpath_element - for searching an element by its XPath
- **A text selector** similar to a selector but those are the elements that returns an area of the DOM, they are useful in steps following the format **... in the "Community finder" "block"** where you are clicking or looking for some text inside a specific area. In the 'Acceptance testing' interface you can see a drop-down menu to select one of these options:
  - dialogue - for searching a dialogue with the specified header text
  - block - for searching a Moodle block by it's English name or it's frankenstyle name
  - section - for searching for a section on a course page by it's title or its written out date (e.g. "1 January - 7 January"). Use "frontpage" "section" for the frontpage section if it has no title (default)
  - activity - for searching for an activity module in a course list by it's title
  - region - for searching a Moodle page region with that id, in fact it works with all ids for <tt>div</tt>, <tt>section</tt>, <tt>aside</tt>, <tt>header</tt> or <tt>footer</tt> elements.
  - table_row - for searching a table row which contains the specified text
  - table - for searching a table by its id or caption
  - fieldset - for searching a fieldset by it's id or legend
  - list_item - for searching a list item which contains the specified text
  - css_element - for searching an element by its CSS selector
  - xpath_element - for searching an element by its XPath

#### Checking table values

You can check if specific value exists or not in a table row/column by using:

```gherkin
Then "STRING_IN_ROW" row "COLUMN_HEADER" column of "TABLE_ID" table should contain "VALUE_TO_CHECK"
```

or

```gherkin
Then the following should exist in the "TABLE_ID" table:
    | COLUMN_HEADER1 | COLUMN_HEADER2 |
    | VALUE_IN_ROW_1 | VALUE_IN_ROW_1 |
    | VALUE_IN_ROW_2 | VALUE_IN_ROW_2 |
```

### Advanced use cases

Most of the time the usage of existing step definitions is straight forward. However, there are some exceptions were it might get complicated. Some of them are listed here:

#### Uploading files

Note than some tests requires files to be uploaded, in this case

- The **I upload "FILEPATH_STRING" file to "FILEPICKER_FIELD_STRING" filepicker** step can be used when located in the form page
- The file to upload should be included along with the Moodle codebase in `COMPONENTNAME/tests/fixtures/*`
- The file to upload is specified by it's path, which should be relative to the codebase root (`lib/tests/fixtures/users.csv` for example)
- **/** should be used as directory separator and the file names can not include this **/** character as all of them would be converted to the OS-dependant directory separator to maintain the compatibility with Windows systems.
- The scenarios that includes files uploading should be tagged using the **@_file_upload** tag

```gherkin
@editor @editor_atto @atto @atto_media @_file_upload
Feature: Add media to Atto
  To write rich text - I need to add media.

  Background:
    Given I log in as "admin"
    And I follow "Manage private files..."
    And I upload "lib/editor/atto/tests/fixtures/moodle-logo.webm" file to "Files" filemanager
    And I upload "lib/editor/atto/tests/fixtures/moodle-logo.mp4" file to "Files" filemanager
    And I upload "lib/editor/atto/tests/fixtures/moodle-logo.png" file to "Files" filemanager
    And I upload "lib/editor/atto/tests/fixtures/pretty-good-en.vtt" file to "Files" filemanager
    And I upload "lib/editor/atto/tests/fixtures/pretty-good-sv.vtt" file to "Files" filemanager
    And I click on "Save changes" "button"
...
```

#### Field groups

This section describes how you can use the step definitions

```gherkin
When I set the following fields to these values:
...
When I set the field "([^"]|\"*)" to "([^"]|\"*)"
```

for field groups. Examples for such field groups are the duration field or the date_time_selector. These are not displayed as one single input field within the front-end but consist of multiple input fields within one row.
You can access each single input field of a group using

```gherkin
identifierOfYourField[keyOfTheSpecificInput]
```

Examples would be:

```gherkin
When I set the following fields to these values:
  | myDate[day]             |   21   |
  | myDate[month]           |   12   |
  | myDate[hour]            |   14   |
  | myDuration[number]      |   10   |
  | myDuration[unit]        | days   |
```

#### Human-readable and relative dates

When testing plugins with deadlines, for instance for submissions, it is often necessary to set certain time values to dates relative to today.
You can specify a relative time enclosed within two ## blocks. For example:

- `## yesterday ##`
- `## 2 days ago ##`
You can use everything according to http://php.net/manual/en/datetime.formats.php.

Especially useful are the relative formats from: http://php.net/manual/en/datetime.formats.relative.php

Additionally, you can specify a format you want the date to be returned into:

- `## yesterday ## myformat ##`
These formats can be used as outlined in http://php.net/manual/en/function.date.php.
This can be combined with the field groups:

```gherkin
When I set the following fields to these values:
  | myDate[day]   | ##yesterday##d## |
  | myDate[month] | ##yesterday##F## |
  | myDate[year]  | ##yesterday##Y## |
```

### Writing your own steps

Sometimes, you will need to set up data that is specific to your plugin, or perform steps that are specific to your plugin's UI. In this case it may be necessary to [write new step definitions](./writing.md#writing-new-acceptance-test-step-definitions), but the short version is that you define new steps as PHP methods with a special annotation inside a class called `behat_plugintype_plugingname` inside `tests/behat/behat_plugintype_plugingname.php` in your plugin.

As well as creating completely new steps, you can also extend some of the standard steps:

#### Custom selectors (<tt>... in the "..." "..."</tt>)

There are a load of different steps which can refer to specific items on-screen, for example

```gherkin
And I click on "Submit all and finish" "button" in the "Confirmation" "dialogue"
```

Here, 'button' and 'dialogue' are examples of selectors, and 'Submit all and finish' and 'Confirmation' are the locators which say which button or dialogue it is. When the test runs, this gets converted to an XPath expression, which is what the Behat system actually uses to locate the right element on the page.

You can define new types of selector (for example `core_message > Message`) by implementing functions like `behat_component_named_selector` in your plugin's `behat_plugintype_plugingname` class. The detailed instructions for how to do this are in [the PHPdoc comments on the base class](https://github.com/moodle/moodle/blob/33da028c27607354981cd8e62ecabb7b973c6637/lib/behat/behat_base.php#L1111).

The reasons you might want to do this are:

- It makes your tests easier to read, which makes it easier to be sure that the test is testing the right thing, and being able to read the tests helps people understand your features.
- If the HTML structure you output changes, then you only need to update the selector definition in one place.

#### Custom navigation targets (<tt>And I am on the "..." "..." page</tt>)

There are two related steps:

```gherkin
Given I am on the "Quiz 1" "mod_quiz > View" page logged in as "manager"
Given I am on the "C1" "Course" page
```

To make this work, in your plugin's `behat_plugintype_plugingname` class, you need to implement the functions `resolve_page_url` and `resolve_page_instance_url` methods. Once again, the detailed instructions about how this works are given in [the PHPdoc comments on the base class](https://github.com/moodle/moodle/blob/a0fc902eb184cd4097c8ab453ddc57964cd2dbd4/lib/behat/behat_base.php#L1093).

There are two reasons why it is good to use these steps:

- You are trying to test that your feature works, not Moodle navigation. In the pase we have had many occasions when Moodle navigation changed, and lots of tests failed and had to be fixed. It is better for your tests to start on your feature. (Except, perhaps, it might be appropriate to have one test for the expected method for users to navigate to your feature.)
- It is much faster because you load fewer irrelevant pages, and in particular the normal log in step leaves you on the Dashboard page, which is **very** slow to load.

#### Custom entity generators (<tt>And the following "..." exist:</tt>)

It is possible to extend the `Given the following "entities" exist` step to support your plugin's data generators. This avoids having to write new whole
new behat step definitions for your plugin, and allows you to re-use data generators between PHPUnit and Behat tests.

Full documentation of this process and all available options can be found in the [PHPDoc for behat_generator_base](https://github.com/moodle/moodle/blob/1d4fdb0d1c60448104bc9eac79b5123863c67cbd/lib/behat/classes/behat_generator_base.php#L33). A core example of this can be found in [/mod/quiz/tests/generator](https://github.com/moodle/moodle/tree/main/mod/quiz/tests/generator) and [quiz_reset.feature](https://github.com/moodle/moodle/blob/1d4fdb0d1c60448104bc9eac79b5123863c67cbd/mod/quiz/tests/behat/quiz_reset.feature#L51). What follows is a simple example.

To begin, you need a [generator](https://docs.moodle.org/dev/Writing_PHPUnit_tests#Generators) in `/*your*/*plugin*/tests/generator/lib.php`. If you are generating a type of entity called "thing", your generator will need a method called create_thing, which accepts an object:

```php
class local_myplugin_generator extends component_generator_base {
    public function create_thing($thing) {
        global $DB;
        $DB->insert_record('local_myplugin_things', $thing);
    }
}
```

Next, you will need to define your behat generator in `/*your*/*plugin*/tests/generator/behat_*your_plugin*_generator.php`, with the `method get_createable_entitites()` method:

```php
class behat_local_myplugin_generator extends behat_generator_base {

    protected function get_creatable_entities(): array {
        return [
            'things' => [
                'datagenerator' => 'thing',
                'required' => ['name']
            ],
        ];
    }
}
```

The `datagenerator` value refers to the method in the generator class that we are calling, in this case `create_thing()`. The outer array key is the entity name we will use in the behat step, in this case `Given the following "local_myplugin > things" exist`.

Now, in your behat test, you can have a step like this, which will generate **2 things**, the first with the name "thing1" and the second with the name "thing2".

```gherkin
Given the following "local_myplugin > things" exist:
  | name   |
  | thing1 |
  | thing2 |
```

### Writing new acceptance test step definitions

As well as using the already existing steps , you can also define new steps.

This is most easily learned by looking at the examples that are already in the code. In any plugin, for example `qtype_ddwtos`, look at the file `tests/behat/behat_qtype_ddwtos.php` inside that plugin. Steps are defined by a function that has a special `@Given`, `@When` or `@Then` annotation in the PHPdoc comment. This gives a regular expression. Any step in a `*.feature` file which matches that regular expression will be translated into a call to that function.

In terms of making the Behat test work, it does not matter whether you use `@Given`, `@When` or `@Then`. However, to make your step understandable to people using your step, it is important to use the right word. Use `@Given` for steps that set things up, `@When` for steps that perform actions, and `@Then` for steps that verify what happened.

When defining new Step definitions in your plugin, try to make sure the step name identifies it as belonging to your plugin. So, don't make a step called `I disable UI plugins`. Call it something like `I disable UI plugins in the CodeRunner question type`.

### Deprecating a step definition

Sometimes it may be desirable to remove a step definition, when it is no longer relevant due to interface changes, or when it is replaced by another step or named selector. As it is possible for other parts of the system to use any defined step, it is necessary to mark a step as deprecated before it is completely removed.

To deprecate a step, create a new deprecated steps file in `tests/behat/behat_plugin_name_deprecated.php` with a class extending `behat_deprecated_base`. For example, from `qbank_comments`:

```php title="tests/behat/qbank_comment_behat_deprecated.php"
<?php
require_once(__DIR__ . '/../../../../../lib/behat/behat_deprecated_base.php');

class behat_qbank_comment_deprecated extends behat_deprecated_base {
    /**
     * Looks for the appropriate hyperlink comment count in the column.
     *
     * @Then I should see :arg1 on the comments column
     * @param string $linkdata
     * @deprecated Since Moodle 5.0 MDL-79122 in favour of the "qbank_comment > Comment count link" named selector.
     * @todo Final removal in Moodle 6.0 MDL-82413.
     */
    public function i_should_see_on_the_column(string $linkdata): void {
        $this->deprecated_message("Use '\"{$linkdata}\" \"qbank_comment > Comment count link\" should exist'");
        $this->execute('behat_general::should_exist', [$linkdata, 'qbank_comment > Comment count link']);
    }
}
```

The deprecated step should call `$this->deprecated_message()` with a human readable example of what to do instead of using the deprecated step. It should then continue to perform its original behaviour (either using its original code, or by calling the step that replaces it) until it is completely removed.

If a deprecated step is called in a test, it will fail and output the deprecation message. As a temporary measure, it is possible to run tests using deprecated steps by setting `$CFG->behat_usedeprecated` in config.php.

A deprecated step should be documented and removed in accordance with the normal [deprecation process](../../policies/deprecation/index.md).

### Override behat core context for theme suite

To override behat step definitions so as to run behat with specified theme, you should create a contexts within `/theme/{MYTHEME}/tests/behat/` with prefix `behat_theme_{MYTHEME}_` and suffixed with the context being overridden. For example, if you want to override `behat_mod_forum` context, then you should create a class `/theme/{MYTHEME}/tests/behat/mod_forum/behat_theme_{MYTHEME}_behat_mod_forum.php`

### Disable behat context or features to run in theme suite

To disable specific contexts and features from being executed by a specific theme/suite you can create a `/theme/{MYTHEME}/tests/behat/blacklist.json` file with following format.

```php
{
  "contexts": [
    "behat_grade",
    "behat_navigation",
  ],
  "features": [
    "auth/tests/behat/login.feature",
    "grade/tests/behat/grade_hidden_items.feature",
   ]
}
```

The above will:

1. disable the use of step_definitions from `behat_grade` and `behat_navigation` while running theme suite
1. disable running of scenarios in `auth/tests/behat/login.feature` and `grade/tests/behat/grade_hidden_items.feature`.

### Override core behat selectors

To override behat selectors in specific theme, you should create a class `behat_theme_{MYTHEME}_behat_selectors` in `/theme/{MYTHEME}/tests/behat/behat_theme_{MYTHEME}_behat_selectors.php` extending behat_selectors.

## Good practice

### Test one thing per scenario

The ideal that you should strive for, is that each scenario tests just one specific bit of functionality. Therefore, if one test fails, the scenario name should tell you exactly what the bug is. Also, any bug should cause just one scenario to fail, not lots of unrelated ones. If you can achieve this, then the idea is that it minimises the time from seeing a test fail to having fixed the bug that was detected. Of course, this ideal is not always achievable, but in my experience it is worth striving for.

:::tip

Note that this also implies that the Given, When and Then keywords should be used only once per scenario.

:::

### Set-up (Given) should not use the UI

The setup is not what you are really testing here. Therefore, it should be as quick and reliable as possible. The way to achieve this is with steps like `And the following "Thing" exist:` which directly insert the data into the database. If necessary, write extra steps for your plugin to setup the things you need.

### Don't use XPath or CSS selectors - fix your Accessibility bugs

If, the only way you can identify something in the page that you want to manipulate is with a step like `I set the field with xpath "//textarea['answer')](contains(@name,)" to "frog"`, then this is probably the sign that you have an Accessibility bug, because Behat accesses the page very like a screen-reader user would.

You should be able to refer to things with steps like `I set the field "Answer" to "frog"'` or `I click on "True" "radio" in the "First question" "question"`. If not, you should probably think about fixing the accessibility bug, rather than resorting to unreadable selectors in your Behat test.

### When you define more steps in your plugin, make it clear they come from your plugin

When defining new Step definitions in your plugin, try to make sure the step name identifies it as belonging to your plugin. So, don't make a step called `I disable UI plugins`. Call it something like `I disable UI plugins in the CodeRunner question type`.

### PHPDoc comments to map scenario steps

PHPDoc style comments before functions can be used to map to your .scenario files. Read more about this here https://behat.org/en/latest/user_guide/context/definitions.html
