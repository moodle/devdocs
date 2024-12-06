---
title: Report builder API
tags:
  - Report builder
  - reports
---

## Overview

### Introduction

The report builder API is a way of providing reporting data, with paging, filtering, exporting standardized across them in both system and custom reports. Once the groundwork is done in defining the report elements in entities, it's possible to implement them with minimal code just by adding entities to the report, and defining which elements you want to use from them.

### Column

#### Column overview

Column instances define the data captured/displayed within a report column typically:

- How the data is retrieved, either a simple SQL table.field fragment or an expression that returns a value
- They type of data that is being retrieved (int, text, datetime, etc)
- How that data should be presented in a report (for instance calling userdate() on datetime types)

#### Column types

- `Text`
- `Integer` (Integer numbers)
- `Float` (Decimal numbers)
- `Timestamp` (Dates)
- `Boolean` (Yes / No values)
- `Longtext`

#### Creating columns

To create a new column, just create a new instance of [`reportbuilder/classes/local/report/column.php`]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/report/column.php) class with:

```php
* string $name
* ?lang_string $title
* string $entityname
```

And use:

- `add_joins()` to add any extra SQL joins the column might need
- `set_type()` to add the column type (All constant types are defined within the same column class)
- `set_is_sortable()` to define if column can be sorted (For example we don't want to sort if the column shows just a picture)
- `add_callback()` to format the output of the column
- `add_field()` to add any db fields format callback might need
- `set_is_deprecated()` used to mark a column as deprecated, indicating it will be removed in the future. This is required in core Moodle columns if you want delete or remove one from an entity because plugins may be using the fields.

```php title="Example of code for creating a column"
$columns[] = (new column(
            'starttime',
            new lang_string('task_starttime', 'admin'),
            $this->get_entity_name()
        ))
            ->add_joins($this->get_joins())
            ->set_type(column::TYPE_TIMESTAMP)
            ->add_field("{$tablealias}.timestart")
            ->set_is_sortable(true)
            ->add_callback([format::class, 'userdate']);
```

### Filter

#### Filter overview

Report filters can be defined for a report and allow users to narrow down (filter) the data that is displayed in a report:

- They define the data being filtered, either a simple SQL fragment or expression.
- The type of filtering being performed (int, text, datetime, etc).
Filter types are extendable, allowing for the addition of many more as suit each use case.
We have provided common ones that cover most use cases.

:::note

Filters & columns are entirely separate concepts in the report, and each can be used without a matching column/filter (that is to say, we can add a report filter for a user field without needing the column for the same field to be present in the report).

:::

#### Filter types

- **Text** ([reportbuilder/classes/local/filters/text.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/text.php))
- **Date** ([reportbuilder/classes/local/filters/date.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/date.php))
- **Number** ([reportbuilder/classes/local/filters/number.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/number.php))
- **Boolean Select** ([reportbuilder/classes/local/filters/boolean_select.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/boolean_select.php))
- **Select** ([reportbuilder/classes/local/filters/select.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/select.php))
- **Course selector** ([reportbuilder/classes/local/filters/course_selector.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/course_selector.php))
- **Duration** ([reportbuilder/classes/local/filters/duration.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/duration.php))
- **Tags** ([reportbuilder/classes/local/filters/tags.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/tags.php))
- **Autocomplete** ([reportbuilder/classes/local/filters/autocomplete.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/autocomplete.php))
- **Category** ([reportbuilder/classes/local/filters/category.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/filters/category.php))

#### Creating filters

To create a new filter, just create a new instance of **[reportbuilder/classes/local/report/filter.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/report/filter.php)** class with:

```php
* string $filterclass
* string $name
* lang_string $header
* string $entityname
* string $fieldsql = ''
* array $fieldparams = []
```

```php title="Example of code for creating a filter"
$filters[] = (new filter(
            course_selector::class,
            'courseselector',
            new lang_string('courses'),
            $this->get_entity_name(),
            "{$tablealias}.id"
        ))
            ->add_joins($this->get_joins());
```

### Entity

#### Entity overview

Entities are simply collections of report elements (currently columns and filters). They allow for common elements to be defined once, and then re-used in all reports - developers can choose to use as many or as few of the elements from each entity as required. We have provided user and course entities. They can be joined to reports using standard SQL query syntax.

All report elements can be defined within the reports themselves - but entities mean it's much easier to create re-usable components, and will also help in the long term with custom reports.

#### Create an entity

To create an entity, the new entity class must extend **[reportbuilder/classes/local/entities/base.php](https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/entities/base.php)** class and must include these methods:

```php
get_default_table_aliases()
get_default_entity_title()
initialise()
```

##### get_default_table_aliases()

Defines the SQL alias for the database tables the entity uses.

##### get_default_entity_title()

Defines the default title for this entity.

##### initialise()

This is where we **add** the entity columns and filters.

#### Tips

Always add all the entities joins to each of its columns and filters; also ensure you add them before any other joins.

If you do not do add these joins when the entity is not being used as the main one there will be SQL errors when they are used.

If you do not add them before other joins when the entity is not the main one in a report, you may find that any references to the primary table of the entity in your additional joins break.

```php title="Adding entity joins to a column"
$column->add_joins($this->get_joins())
```

When writing any SQL snippets you should always use the alias table aliases that are returned by the `get_table_alias()` method, this is because reports using the column can change the alias used by a table.

```php title="Example of getting the alias for a table"
$logalias = $this->get_table_alias('logstore_standard_log');
$useralias = $this->get_table_alias('user');
$fildname = "{$useralias).lastname";
$join = "JOIN {user} {$useralias} ON {$useralias}.id = {$logalias}.relateduser"
```

#### Examples

Check out these two entities as an example to start building reports:

- **User entity**: [reportbuilder/classes/local/entities/user.php](https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/entities/user.php)
- **Course entity**: [reportbuilder/classes/local/entities/course.php](https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/local/entities/course.php)

### Actions

![Example of actions on the tasks logs system report](./_index/Actions.jpg)

Report actions can be defined in system reports to provide CTA links for each row in the report. Using `:placeholder` elements in the action URLs allows them to be specific to the row content. For example, to always provide a link to the current user/course of the current row

```php
  $this->add_action((new action(
      new moodle_url('/admin/tasklogs.php', ['logid' => ':id']),
      new pix_icon('e/search', ''),
      [],
      true,
      new lang_string('viewtasklog', 'report_tasklogs')
  )));
```

## System reports

System reports are a consistent way of providing reporting data, with paging, filtering, exporting standardized across them. Once the groundwork is done in defining the report elements in entities, it's possible to implement them with minimal code just by adding entities to the report, and defining which elements you want to use from them

### Create a new system report using entities

To create a new system report just create a new class extending [reportbuilder/classes/system_report.php]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/system_report.php).

The first method that we need is ***initialise()*** :

```php
/**
* Initialise report, we need to set the main table, load our entities and set columns/filters
*/
protected function initialise(): void {
```

The initialise method needs to get the main entity, set the main table it needs to use and add the entity to the report:

```php
// Our main entity, it contains all of the column definitions that we need.
$entitymain = new task_log();
$entitymainalias = $entitymain->get_table_alias('task_log');

$this->set_main_table('task_log', $entitymainalias);
$this->add_entity($entitymain);
```

After that, if the report will have 'Actions', it needs to define the columns these actions will use:

```php
$this->add_base_fields("{$entitymainalias}.id");
```

Now, after adding our first entity, the report can use the columns and filters from it OR more entities can be added to the report using SQL joins:

```php
$entityuser = new user();
$entituseralias = $entityuser->get_table_alias('user');
$this->add_entity($entityuser->add_join(
    "LEFT JOIN {user} {$entituseralias} ON {$entituseralias}.id = {$entitymainalias}.userid"
));
```

Once all entities have been added it needs to define which columns it needs to show **in the order we need**:

```php
$columns = [
     'task_log:name',
     'task_log:type',
     'user:fullname',
     'task_log:starttime',
];

$this->add_columns_from_entities($columns);
```

After defining the columns, it needs to define all the filters (or empty array for no filters) that it will use:

```php
$filters = [
    'task_log:name',
    'task_log:result',
    'task_log:timestart',
];

$this->add_filters_from_entities($filters);
```

In case it needs actions for each report row, they can be defined like:

```php
// Action to download individual task log.
$this->add_action((new action(
    new moodle_url('/admin/tasklogs.php', ['logid' => ':id', 'download' => true]),
    new pix_icon('t/download', ''),
    [],
    new lang_string('downloadtasklog', 'report_tasklogs')
)));
```

:::info

Note that the placeholders used here (:id in this example) have been previously added using **add_base_fields**();

:::

Once the whole report has been defined, is possible to set if the report will be downloadable or not:

```php
$this->set_downloadable(true);
```

### Use an entity

### Override display name for a column

It's possible to override the display name of a column, if you don't want to use the value provided by the entity.

```php
if ($column = $this->get_column('user:fullname')) {
   $column->set_title(new lang_string('user', 'admin'));
}
```

### Set a default initial sort direction

It's possible to set a default initial sort direction for one column.

```php
$this->set_initial_sort_column('task_log:starttime', SORT_DESC);
```

### Examples

Check out these two system reports as an example:

- **Task logs**: [`admin/classes/reportbuilder/local/systemreports/task_logs.php`]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/admin/classes/reportbuilder/local/systemreports/task_logs.php)
- **Config changes**: [`report/configlog/classes/reportbuilder/local/systemreports/config_changes.php`]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/report/configlog/classes/reportbuilder/local/systemreports/config_changes.php)

## Custom reports

The custom reporting interface allows reports to be built with a custom view for users, Moodle and plugins can define data sources that provide the basis for the reports that users can make using the system.

### Create a new data source using entities

To create a data source you need to extend [`\core_reportbuilder\datasource`]( https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/reportbuilder/classes/datasource.php). Your class must be located in the `reportbuilder\datasource` namespace of your plugin or the Moodle subsystem it is for.

The first method you need to build is `initialise()`

```php
/**
* Initialise report, we need to set the main table, load our entities and set columns/filters
*/
protected function initialise(): void {
```

The initialise method needs to get the main entity, set the main table it needs to use and add the entity to the report:

```php
// Our main entity, it contains all of the column definitions that we need.
$entitymain = new task_log();
$entitymainalias = $entitymain->get_table_alias('task_log');

$this->set_main_table('task_log', $entitymainalias);
$this->add_entity($entitymain);
```

Now, after adding our first entity, the report can use the columns and filters from it OR more entities can be added to the report using SQL joins:

```php
$entityuser = new user();
$entityuseralias = $entityuser->get_table_alias('user');
$entityuser->add_join(
    "LEFT JOIN {user} {$entityuseralias} ON {$entityuseralias}.id = {$entitymainalias}.userid"
);
$this->add_entity($entityuser);
```

If you are adding an entity that does not directly join to the entity containing the main table you will need to add the joins to all the intermediate entities to it, without this if a user adds a column from the table to a custom report and has not also added a column from the intermediate table there will be an error.

```php
$entitycourse = new course();
$entitycoursealias = $entityuser->get_table_alias('course');
$entitycourse->add_join("JOIN {course} {$entitycoursealias} ON {$entitycoursealias}.id = {$entityactivity}.course");

$entitycategory = new course_category();
$entitycategoryalias = $entityuser->get_table_alias('course_category');
$entitycategory->add_joins($entitycourse->get_joins());
$entitycategory->add_join("JOIN {course_category} {$entitycategoryalias} ON {$entitycategoryalias}.id = {$entitycoursealias}.category");
```

If you are using the same sort of entity twice, or they happen to have clashing aliases in another entity, you can set the alias for a table in an entity:

```php
$entityuser2 = new user();
$entityuser2->set_table_alias('user', 'u2');
```

Next you need to add the columns, filters, and conditions that a user can add to the custom report. If you want everything you can use:

```php
$this->add_all_from_entities();
```

### Setup default columns

Once all entities have been added you need to define which columns it will show by default **they will be displayed in the order you define them**, by implementing the `get_default_columns()` method:

```php
/**
 * Return the columns that will be added to the report upon creation
 *
 * @return string[]
 */
public function get_default_columns(): array {
    return [
        'task_log:name',
        'task_log:starttime',
        'task_log:duration',
        'task_log:result',
    ];
}
```

You may also optionally define the sorting that will be applied to the default report, **it must only use default columns** by overriding the `get_default_column_sorting()` method:

```php
/**
 * Return the column sorting that will be added to the report upon creation
 *
 * @return int[]
 */
public function get_default_column_sorting(): array {
    return [
        'task_log:starttime' => SORT_DESC,
    ];
}
```

### Setup default filters

The filters allow the end user of the report to only see a subset of the data the report will normally show. We need to define the default setup for this using the `get_default_filters()` method.

```php
/**
 * Return the filters that will be added to the report upon creation
 *
 * @return string[]
 */
public function get_default_filters(): array {
    return [
        'task_log:timestart',
        'task_log:result',
    ];
}
```

### Setup conditions

The conditions allow the user creating the report to define which data it will return. You need to define the default setup for this using the `get_default_conditions()` method.

```php
/**
 * Return the conditions that will be added to the report upon creation
 *
 * @return string[]
 */
public function get_default_conditions(): array {
    return [
        'task_log:type',
        'task_log:timestart',
        'task_log:result',
    ];
}
```

You may also optionally define the [initial values for any of the default conditions](./filtering.md) by overriding the `get_default_condition_values()` method.

```php
/**
 * Return the condition values that will be set for the report upon creation
 *
 * @return array
 */
public function get_default_condition_values(): array {
    return [
        'task_log:type_operator' => select::EQUAL_TO,
        'task_log:type_value' => \core\task\database_logger::TYPE_SCHEDULED,
    ];
}
```

### Adding unit tests

Data sources have a specific type of testcase `\core_reportbuilder_testcase` that provides several useful utility methods that will help you ensure that the data source and it's entities are working correctly.

```php
defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once("{$CFG->dirroot}/reportbuilder/tests/helpers.php");

/**
 * Unit tests for course categories datasource
 *
 * @package     core_course
 * @covers      \core_course\reportbuilder\datasource\categories
 * @copyright   2023 Paul Holden <paulh@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class categories_test extends core_reportbuilder_testcase {
```

The `core_reportbuilder_testcase` will not autoload so we first ensure that it is loaded with the `require_once`. After this there are a few things you should look to test:

1. That the default report setup works properly
2. That you can add all the columns that are not defined in the default report
3. That the filters work
4. Add the stress tests

#### Testing the default report

For this you want a step that sets up will return enough data allows you test all the ordering you have configured for the report.

```php
    /**
     * Test default datasource
     */
    public function test_datasource_default(): void {
        $this->resetAfterTest();

        $category = $this->getDataGenerator()->create_category(['name' => 'Zoo', 'idnumber' => 'Z01']);
        $course = $this->getDataGenerator()->create_course(['category' => $category->id]);

        /** @var core_reportbuilder_generator $generator */
        $generator = $this->getDataGenerator()->get_plugin_generator('core_reportbuilder');
        $report = $generator->create_report(['name' => 'My report', 'source' => categories::class, 'default' => 1]);

        $content = $this->get_custom_report_content($report->get('id'));
        $this->assertCount(2, $content);

        // Default columns are name, idnumber, coursecount. Sorted by name ascending.
        $this->assertEquals([
            [get_string('defaultcategoryname'), '', 0],
            [$category->get_formatted_name(), $category->idnumber, 1],
        ], array_map('array_values', $content));
    }
```

In this example an additional category has been added to Moodle, the category has had a course added to it so that the count of courses in the category can also be tested.

It then creates a custom report and gets it's data before testing:

- It has the expected number of rows
- Testing after stripping out the array keys that the data returned is in the correct order and formatted correctly

#### Testing the non-default columns and filtering

You can create blank report can be created by passing `'default' => 0` to the `create_report()` method of the `core_reportbuilder` data generator:

```php
$report = $generator->create_report(['name' => 'My report', 'source' => categories::class, 'default' => 0]);
```

to add columns of data to the report you would use the `create_column()` method:

```php
$generator->create_column(['reportid' => $report->get('id'), 'uniqueidentifier' => 'course_category:path']);
```

it is possible to add sorting to the column by passing additional data in the array, for example:

```php
$generator->create_column(
    [
        'reportid' => $report->get('id'),
        'uniqueidentifier' => 'course_category:path'
        'sortenabled' => true,
        'sortdirection' => SORT_ASC,
        'sortorder' => 1,
    ]
);
```

This would cause the column to be sorted ascending. You need to use `sortorder` to decide on the priority it is given in the sorting, with lower numbers being given priority.

To add a filter to the report you would use the `create_filter()` method of the `core_reportbuilder` data generator:

```php
$generator->create_filter(['reportid' => $report->get('id'), 'uniqueidentifier' => 'user:firstname']);
```

This will add the filter for the user's firstname. When you generate the report you will need to pass an array of conditions as the third parameter:

```php
$filtervalues = [
    'user:firstname_operator' => text::IS_EQUAL_TO,
    'user:firstname_value' => 'Pedro',
];
$content = $this->get_custom_report_content($report->get('id'), 0, $filtervalues);
```

This would cause the report to return results for users with the first name of _Pedro_ only.

#### The stress test

The stress test uses helper methods which:

- Add and remove every colum individually from a report and ensures that is still returns data without error.
- Individually aggregates a report on each column
- Individually applies each filter

None of these tests checks that the data is what you want, but will ensure that all your joins are setup correctly for the `datasource` to work without errors when manipulating it via the custom report interface.

```php
    /**
     * Stress test datasource
     *
     * In order to execute this test PHPUNIT_LONGTEST should be defined as true in phpunit.xml or directly in config.php
     */
    public function test_stress_datasource(): void {
        if (!PHPUNIT_LONGTEST) {
            $this->markTestSkipped('PHPUNIT_LONGTEST is not defined');
        }

        $this->resetAfterTest();

        $category = $this->getDataGenerator()->create_category(['name' => 'My category']);

        $this->datasource_stress_test_columns(categories::class);
        $this->datasource_stress_test_columns_aggregation(categories::class);
        $this->datasource_stress_test_conditions(categories::class, 'course_category:idnumber');
    }
```

The test first sets up some data that the data source can return, it then uses three helper methods provided by `core_reportbuilder_testcase`

The first parameter for each method is the fully qualified class name of the `datasource` that should be tested. `datasource_stress_test_conditions()` has a second parameter that must be the name of a column from the `datasource`.

#### Unit test examples

- **Course categories** [`/course/tests/reportbuilder/datasource/categories_test.php`](https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/course/tests/reportbuilder/datasource/categories_test.php)
- **Badges** [`/badges/tests/reportbuilder/datasource/badges_test.php`](https://github.com/moodle/moodle/blob/MOODLE_403_STABLE/badges/tests/reportbuilder/datasource/badges_test.php)
