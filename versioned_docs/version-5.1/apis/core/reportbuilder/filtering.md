---
title: Setting default conditions
tags:
  - Report builder
  - reports
---

When setting up a `datasource` it is possible to define the default condition values for it using the `get_default_condition_values()` method.

The method requires that you return an array where the keys are formed in a specific way so it will link to the correct filter and condition form field. The names and number of condition form fields varies depending on both the specific filter type and the operator used.

The keys used in the array all start with the name of the entity you are querying followed by a colon and the name of the filter, then an underscore followed by the form field you are defining; for example, assuming we are using default names, if you have a `course_category` entity and want to set a value for the `name` filter you would need to start the keys with `course_categotry:name`.

Most filter types use an `operator` for field to define which of their operators is used, they are defined as constants in each filter type, for example the text filter type has `EQUAL_TO` so you will end up with `'course_categotry:name_operator' => text::EQUAL_TO`

The operator you have defined will then determine which other form fields you will need to provide values for, in our example so far that would be `value` which would be defined as `'course_categotry:name_value' => 'The name of a category'` this would mean that only a category with that exact name would be returned by default.

[Core report builder filter types](https://github.com/moodle/moodle/tree/main/reportbuilder/classes/local/filters) you can find what a filter type needs by looking at their `get_sql_filter()` method.

## Text filters

### Operators with no additional data

- `ANY_VALUE`
- `IS_EMPTY`
- `IS_NOT_EMPTY`

## Filtering types with a single value

A string should be sent in `value` for:

- `CONTAINS`
- `DOES_NOT_CONTAIN`
- `IS_EQUAL_TO`
- `IS_NOT_EQUAL_TO`
- `STARTS_WITH`
- `ENDS_WITH`

```php title="Examples of array key and value pairs for single value text filters"
'my:text_operator' => text::CONTAINS,
'my:text_value1' => 'Bob Dylan',
'my:text2_operator' => text::IS_NOT_EQUAL_TO,
'my:text2_value1' => 'This exact thing',
```

## Number filter

### Operators with no additional data

- `ANY_VALUE`
- `IS_NOT_EMPTY`
- `IS_EMPTY`

### Operators with a single value

A number should be passed in `value1` for:

- `LESS_THAN`
- `GREATER_THAN`
- `EQUAL_TO`
- `EQUAL_OR_LESS_THAN`
- `EQUAL_OR_GREATER_THAN`

```php title="Examples of array key and value pairs for single value number filters"
'my:number_operator' => number::LESS_THAN,
'my:number_value1' => 42,
'my:number2_operator' => number::EQUAL_OR_GREATER_THAN,
'my:number2_value1' => 15.6,
```

### Operators with complex data

#### RANGE

- `value1` number for the lower bound
- `value2` number for the upper bound

```php title="Examples of array key and value pairs for range values text filters"
'my:number_operator' => number::RANGE,
'my:number_value1' => 60,
'my:number_value2' => 600,
```

## Date filter

The date filter has several constants used to define the amount of time:

- `DATE_UNIT_MINUTE`
- `DATE_UNIT_HOUR`
- `DATE_UNIT_DAY`
- `DATE_UNIT_WEEK`
- `DATE_UNIT_MONTH`
- `DATE_UNIT_YEAR`

### Operators with no additional data

- `DATE_ANY`
- `DATE_NOT_EMPTY`
- `DATE_EMPTY`
- `DATE_PAST`
- `DATE_FUTURE`

### Operators with one value

The `unit` should be sent defining the amount of time that should be considered.

- `DATE_CURRENT`

```php title="Examples of array key and value pairs for single value date filters"
'my:date_operator' => date::DATE_CURRENT,
'my:date_unit' => date::DATE_UNIT_DAY,
```

### Operators with two values

These operators can all accept two values:

1. `value` - A integer greater than 0
2. `unit` - The type of time unit

- `DATE_LAST`
- `DATE_NEXT`
- `DATE_BEFORE`
- `DATE_AFTER`

```php title="Examples of array key and value pairs for two value date filters"
'my:date_operator' => date::DATE_NEXT,
'my:date_value' => 5,
'my:date_unit' => date::DATE_UNIT_DAY,
'my:date2_operator' => date::DATE_BEFORE,
'my:date2_value' => 20,
'my:date2_unit' => date::DATE_UNIT_MINUTE,
```

### Operators with complex values

#### DATE_RANGE

The date range should have a unix timestamp in one or more of the following:

- `from`
- `to`

```php title="Examples of array key and value pairs for the range date filters"
'my:date_operator' => date::DATE_RANGE,
'my:date_from' => 1732593669,
'my:date_to' => 1732893669,
```

## Select filter

### Operators with no additional data

- `ANY_VALUE`

### Operators with one value

The value of the select should be sent in `value` to:

- `EQUAL_TO`
- `NOT_EQUAL_TO`

```php title="Examples of array key and value pairs for single value select filters"
'my:select_operator' => select::EQUAL_TO,
'my:select_value' => 10,
'my:select2_operator' => select::NOT_EQUAL_TO,
'my:select2_value' => 'textkey',
```

## Boolean select filter

### Operators with no additional data

- `ANY_VALUE`
- `CHECKED`
- `NOT_CHECKED`

## Duration filter

For units the filter uses the standard Moodle defines:

- `MINSECS`
- `HOURSECS`
- `DAYSECS`
- `WEEKSECS`

It also allows the integer value 1 to represent seconds.

### Operators with no additional data

- `DURATION_ANY`

### Operators with two values

These operators can all accept two values:

1. `value` - A integer greater than 0, this should be the number of the units that are included.
2. `unit` - The type of time unit.

- `DURATION_MAXIMUM`
- `DURATION_MINIMUM`

```php title="Examples of array key and value pairs for two value duration filters"
'my:duration_operator' => duration::DURATION_MAXIMUM,
'my:duration_value' => 10,
'my:duration_unit' => 1,
'my:duration2_operator' => duration::DURATION_MINIMUM,
'my:duration_value' => 42,
'my:duration_unit' => DAYSECS,
```

## Autocomplete filter

This filter type does not use `operator`, it requires that `values` contains an array of keys that the autocompletion element would return.

```php title="Examples of array key and value pairs for autocomplete filters"
'my:autocomplete_values' => [1, 4, 6],
'my:autocomplete2_values' => [42],
```

## Category filter

### Operators with complex values

Both the available operators for this have two values:

1. `value` The database id of a `course_category` record
2. `subcategories` A boolean to indicate if sub categories of the selected category should also be included.

- `EQUAL_TO`
- `NOT_EQUAL_TO`

```php title="Examples of array key and value pairs for category filters"
'my:category_operator' => category::EQUAL_TO,
'my:category_value' => [142, 4753],
'my:category_subcategories' => true,
'my:category2_operator' => category::NOT_EQUAL_TO,
'my:category2_value' => [1],
'my:category2_subcategories' => false,
```

## Course_select filter

This filter type does not use `operator`, it requires that `values` contains an array of database ids for courses.

```php title="Examples of array key and value pairs for course filters"
'my:course_values' => [1, 4, 6],
'my:course2_values' => [42],
```

## Cohort filter

This filter type does not use `operator`, it requires that `values` contains an array of database ids for cohorts.

```php title="Examples of array key and value pairs for cohort filters"
'my:cohort_values' => [1, 4, 6],
'my:cohort2_values' => [42],
```

## Filesize filter

The filter defines several units for filesize as constants:

- `SIZE_UNIT_KILOBYTE`
- `SIZE_UNIT_MEGABYTE`
- `SIZE_UNIT_GIGABYTE`

### Operators with no additional data

- `ANY_VALUE`

### Operators with two values

1. `value1` The size of the file in the unit
2. `unit` The type of unit (as defined by the filter constants)

- `LESS_THAN`
- `GREATER_THAN`

```php title="Examples of array key and value pairs for two value file size filters"
'my:filesize_operator' => filesize::LESS_THAN,
'my:filesize_value1' => 50,
'my:filesize_unit' => filesize::SIZE_UNIT_KILOBYTE,
'my:filesize2_operator' => filesize::GREATER_THAN,
'my:filesize2_value1' => 1,
'my:filesize2_unit' => filesize::SIZE_UNIT_GIGABYTE,
```

## Tags filter

### Operators with no additional data

- `ANY_VALUE`
- `NOT_EMPTY`
- `EMPTY`

### Operators with one value

An array of tag database ids should be sent in `value` to:

- `EQUAL_TO`
- `NOT_EQUAL_TO`

```php title="Examples of array key and value pairs for single value tag filters"
'my:tags_operator' => tags::EQUAL_TO,
'my:tags_value' => [142, 4753],
'my:tags2_operator' => tags::NOT_EQUAL_TO,
'my:tags2_value' => [1],
```

## User filter

### Operators with no additional data

- `USER_ANY`
- `USER_CURRENT`

### Operators with one value

An array of user database ids should be sent in `value` to:

- `USER_SELECT`

```php title="Examples of array key and value pairs for single value user filters"
'my:user_operator' => user::USER_SELECT,
'my:user_value' => [142, 4753],
'my:user2_operator' => user::USER_SELECT,
'my:user2_value' => [1],
```
