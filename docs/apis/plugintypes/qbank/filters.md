---
title: Question bank filters
tags:
  - Plugins
  - Question
  - qbank
description: Question bank plugins allow you to define new filters for the question bank view and random question sets.
documentationDraft: true
---

<Since
version="4.3"
issueNumber="MDL-72321"
/>

Question bank plugins allow you define additional filters. These can be used when viewing the question bank, and are included
in the URL so that a filtered view of the question bank can be shared. They are also used when defining the criteria for adding
random questions to a quiz.

## Creating a new filter condition

A filter condition consists of two parts - the backend "condition" PHP class, and the frontend "filter" JavaScript class.

The "condition" class defines the general properties of the filter - its name, various options, and how it is applied to the
question bank query.
The "filter" class defines how the filter is displayed in the UI, and how values selected in the UI are passed back to the condition.

Each new filter condition must define a new "condition" class in the qbank plugin based on `core_question\local\bank\condition`.
By default this will use the `core/datafilter/filtertype` "filter" class, although this can be overridden too if required.

### Basic example

This outlines the bare minimum required to implement a new filter condition. This will give you a field that allows you to
enter keywords and add them to a list of selected search terms, the filter the questions by that list of terms.
This assumes that you already have the basic framework of a qbank plugin in place. For real-world examples,
look for classes that extend `core_question\local\bank\condition`.

Create a `condition` class within your plugin's namespace. For a plugin called `qbank_myplugin` this would look something like:

```php title="question/bank/myplugin/classes/myfilter_condition.php"
namespace qbank_myplugin;

use core_question\local\bank\condition;

class myfilter_condition extends condition {

}
```

Modify your `plugin_feature` class to return an instance of your condition from the `get_question_filters()` method:

```php title="question/bank/myplugin/classes/plugin_feature.php"
namespace qbank_myplugin;

class plugin_feature extends core_question\local\bank\plugin_features_base {
    public function get_question_filters(?core_question\local\bank\view $qbank = null): array {
        return [
            new myfilter_condition($qbank),
        ];
    }
}
```

Back in your `condition` class, define the `get_name()` method, which returns the label displayed in the filter UI.

```php title="Define the condition name"
public function get_name(): string {
    return get_string('myfilter_name', 'myplugin');
}
```

Define `get_condition_key()`, which returns a unique machine-readable ID for this filter condition, used when passing the filter
as a parameter.

```php title="Define the condition key"
public function get_condition_key(): string {
    return 'myfilter';
}
```

To actually filter the results, define `build_query_from_filter()` which returns an SQL `WHERE` condition, and an array of parameters.
The `$filter` parameter receives an array with a `'values'` key, containing an array of the selected values, and a `'jointype'` key,
containing one of the `JOINTTYPE_ANY`, `JOINTYPE_ALL` or `JOINTYPE_NONE` constants. Use these to build your condition as required.

The conditions from each filter are combined with the query in
[`core_question\local\bank\view::build_query()`](https://github.com/moodle/moodle/blob/c741492c38b9945abbfc7e90dfe8f943279f8265/question/classes/local/bank/view.php#L733)
to select the filtered question list.

```php title="Filter questions"
public function build_query_from_filter(array $filter): array {
    $andor = ' AND ';
    $equal = '=';
    if ($filter['jointype'] === self::JOINTYPE_ANY) {
        $andor = ' OR ';
    } else if ($filter['jointype'] === self::JOINTYPE_NONE) {
        $equal = '!=';
    }
    $conditions = [];
    $params = [];
    // In real life we'd probably use $DB->get_in_or_equal here.
    foreach ($filter['values'] as $key => $value) {
        $conditions[] = 'q.fieldname ' . $equal . ' :myfilter' . $key;
        $params['myfilter' . $key] = $value;
    }
    return [
        '(' . implode($andor, $conditions) . ')',
        $params,
    ];
}
```

Following this pattern with your own fields and options will give you a basic functional filter. Most filters will require
more complex functionality, which can be achieved through additional methods.

### Additional options

#### Pre-defined values

To define the list of possible filter values, define `get_initial_values()`, which returns an array of `['value', 'title']` for each
option. These will then be searchable and selectable in the autocomplete field.

```php title="Define initial filter values"
public function get_initial_values(): string {
    return [
        [
            'value' => 0,
            'title' => 'Option 1',
        ],
        [
            'value' => 1,
            'title' => 'Option 2',
        ]
    ];
}
```

#### Restrict custom keywords

To restrict the possible filter terms to only those returned from `get_initial_values()`, define `allow_custom()` and have it return `false`.

```php title="Disable custom terms"
public function allow_custom(): bool {
    return false;
}
```

#### Restrict join types

Not all join types are relevant to all filters. If each question will only match one of the selected values, it does not make
sense to allow `JOINTYPE_ALL`. Define `get_join_list()` and return an array of the applicable join types.

```php title="Define a restricted list of join types"
public function get_join_list(): array {
    return [
        datafilter::JOINTYPE_ANY,
        datafilter::JOINTYPE_NONE,
    ];
}
```

#### Allow multiple values?

By default, conditions allow multiple values to be selected and use the selected join type to decide how they are applied.
If your condition should only allow a single value at a time, override `allow_multiple()` to return false.

```php title="Disable selection of multiple values"
public function allow_multiple(): bool {
    return false;
}
```

#### Allow empty values?

By default, conditions can be left empty, and therefore will not be included in the filter. To make it compulsory to select a
value for this condition when it is added, override `allow_empty()` to return false.

```php title="Disable empty values"
public function allow_empty(): bool {
    return false;
}
```

#### Is the condition required?

If it is compulsory that your condition is always displayed, override `is_required()` to return true.

```php title="Make the condition compulsory"
public function is_required(): bool {
    return true;
}
```

#### Custom filter class

By default, the filter will be displayed and processed using the `core/datafilter/filtertype` JavaScript class.
This will provide a single autocomplete field for selecting one or multiple numeric IDs with textual labels.
If this does not fit your filter's use case, you can tell your condition to use a different filter class.

You can either use a different core filter type from `/lib/amd/src/datafilter/filtertypes`, or define your own.

To tell your filter condition to use a different filter class, override the `get_filter_class()` method to return the namespaced
path to your JavaScript class.

```php title="Override the default filter class"
public function get_filter_class(): string {
    return 'qbank_myplugin/datafilter/filtertype/myfilter';
}
```

To create your own filter class, a new JavaScript file in your plugin under `amd/src/datafilter/filtertypes/myfilter.js`.
In this file, export a default class that extends `core/datafilter/filtertype`
(or another core filter type from `/lib/amd/src/datafilter/filtertypes`) and override the base methods as required.
For example, if your filter uses textual rather than numeric values, you can override `get values()` to return the raw values
without running `parseInt()` (see
[`qbank_viewquestiontype/datafilter/filtertypes/type`](https://github.com/moodle/moodle/blob/main/mod/quiz/tests/behat/editing_add_from_question_bank.feature)).

If you want a different UI for selecting your filter values instead of a single autocomplete, you can override `addValueSelector()`.
This also provides flexibility over how the values provided by `get_initial_values()` are used by the UI.

#### Filter options

If your condition supports additional options as to how the selected values are applied to the query, such as whether child
categories are included when parent categories are selected, you can define "Filter options".

In your condition class, define `get_filteroptions()` which returns an object containing the current filter options. You will
probably want to add some code to the constructor to read in the current filter options, and some code the `build_query_from_filter()`
to use the option. See
[`qbank_managecategories\category_condition`](https://github.com/moodle/moodle/blob/main/question/bank/managecategories/classes/category_condition.php)
as an example.

You JavaScript filter class will also need to support your filter options. Override the constructor an add additional code
for the UI required to set your filter options, and override `get filterOptions()` to return the current value for any options set
in this UI. See
[`qbank_managecategories/datafilter/filtertypes/categories`](https://github.com/moodle/moodle/blob/main/question/bank/managecategories/amd/src/datafilter/filtertypes/categories.js)
as an example.

#### Context-sensitive configuration

You may want your filter to behave differently depending on where it is being displayed. In this case you can override the
constructor which receives the current `$qbank` view object, and extract some data that is used later on by your other methods.

For example, the
[tag condition](https://github.com/moodle/moodle/blob/main/question/bank/tagquestion/classes/tag_condition.php)
will find the context of the current page, and use that to control which tags are available in the filter.
