---
title: Repeat elements
tags:
  - core_form
  - core
  - Forms API
  - Advanced
---

The Form API includes the ability to repeat a group of form elements. This is useful where you need to have an unknown quantity of item data, for example possible answers in a quiz question.

This is achieved by adding a button to the form to handle the creation of the additional buttons using a page reload, and a zero-indexed array added to the `elementname` data returned by `get_data()`.

## Overview

Most of the necessary information is in the phpdoc comment for the repeat_elements() method:

```php
/**
 * Method to add a repeating group of elements to a form.
 *
 * @param array $elementobjs Array of elements or groups of elements that are to be repeated
 * @param int $repeats no of times to repeat elements initially
 * @param array $options a nested array. The first array key is the element name.
 *    the second array key is the type of option to set, and depend on that option,
 *    the value takes different forms.
 *         'default'    - default value to set. Can include '{no}' which is replaced by the repeat number.
 *         'type'       - PARAM_* type.
 *         'helpbutton' - array containing the helpbutton params.
 *         'disabledif' - array containing the disabledIf() arguments after the element name.
 *         'rule'       - array containing the addRule arguments after the element name.
 *         'expanded'   - whether this section of the form should be expanded by default. (Name be a header element.)
 *         'advanced'   - whether this element is hidden by 'Show more ...'.
 * @param string $repeathiddenname name for hidden element storing no of repeats in this form
 * @param string $addfieldsname name for button to add more fields
 * @param int $addfieldsno how many fields to add at a time
 * @param string $addstring name of button, {no} is replaced by no of blanks that will be added.
 * @param bool $addbuttoninside if true, don't call closeHeaderBefore($addfieldsname). Default false.
 * @param string $deletebuttonname if specified, treats the no-submit button with this name as a "delete element" button in each of the elements.
 * @return int no of repeats of element in this page
 */
```

## Configuration

- The list of elements you wish to repeat is set in the `$elementobjs` array, with any options passed into the `$options` array.
A `{no}` placeholder can be placed into strings, such as the element label or default values, to represent the item number.

:::note

While the elements are zero-indexed, the `{no}` label is one-indexed.

:::

- The number of repeats to show initially can be configured using the `$repeats` parameter.
- The number of elements to add when adding more options is configured using the `$addfieldsno` parameter.
- The label used for the 'Add more' button can be set using the `$addstring` parameter. A `{no}` placeholder can be used in the string to indicate how many repeats will be added.
- The number of element repeats currently shown is stored in a hidden element, whose name can be specified using the `$repeathiddenname` parameter.

The following example shows how `repeat_elements()` can be used within a form definition with a delete button for each repeated field :

```php title="definition() function"
$repeatarray = [
    $mform->createElement('text', 'option', get_string('optionno', 'choice')),
    $mform->createElement('text', 'limit', get_string('limitno', 'choice')),
    $mform->createElement('hidden', 'optionid', 0),
    $mform->createElement('submit', 'delete', get_string('deletestr', 'choice'), [], false),
];


if ($this->_instance){
    $repeatno = $DB->count_records('choice_options', ['choiceid' => $this->_instance]);
    $repeatno += 2;
} else {
    $repeatno = 5;
}

$repeateloptions = [
    'limit' => [
        'default' => 0,
        'disabledif' => array('limitanswers', 'eq', 0),
        'rule' => 'numeric',
        'type' => PARAM_INT,
    ],
    'option' => [
        'helpbutton' => [
            'choiceoptions',
            'choce',
        ]
    ]
];

$mform->setType('option', PARAM_CLEANHTML);
$mform->setType('optionid', PARAM_INT);

$this->repeat_elements(
    $repeatarray,
    $repeatno,
    $repeateloptions,
    'option_repeats',
    'option_add_fields',
    3,
    null,
    true,
    'delete',
);
```

For other examples, have a look at the question type editing forms. They make extensive use of repeat_elements().
