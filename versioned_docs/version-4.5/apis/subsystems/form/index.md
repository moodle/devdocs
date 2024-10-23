---
title: Forms API
tags:
  - API
  - core_form
  - form
  - core
---

Form are created using the Form API. The Form API supports most standard HTML elements, including checkboxes, radio buttons, text boxes, and so on, adding additional accessibility and security features to them.

## Highlights

- Tested and optimised for use on major screen-readers like Dragon and JAWS.
- Table-less layout.
- Processes form data securely, with `required_param`, `optional_param`, and session key.
- Supports client-side validation.
- Facility to add Moodle help buttons to forms.
- Support for file repository using the [File API](../files/index.md) .
- Support for many custom Moodle specific and non-specific form elements.
- Facility for [repeated elements](./advanced/repeat-elements.md).
- Facility for form elements in advanced groups

## Usage

The Moodle forms API separates forms into different areas:

1. a form definition, which extends the `moodleform` class; and
2. uses of that form.

To create a form in Moodle, you create a class that defines the form, including every form element. Your class must extend the `moodleform` class and overrides the [definition](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#definition.28.29) member function to describe the form elements.

<details>
<summary>An example of a form definition</summary>

```php title="[path/to/plugin]/classes/form/myform.php"
// moodleform is defined in formslib.php
require_once("$CFG->libdir/formslib.php");

class simplehtml_form extends moodleform {
    // Add elements to form.
    public function definition() {
        // A reference to the form is stored in $this->form.
        // A common convention is to store it in a variable, such as `$mform`.
        $mform = $this->_form; // Don't forget the underscore!

        // Add elements to your form.
        $mform->addElement('text', 'email', get_string('email'));

        // Set type of element.
        $mform->setType('email', PARAM_NOTAGS);

        // Default value.
        $mform->setDefault('email', 'Please enter email');
    }

    // Custom validation should be added here.
    function validation($data, $files) {
        return [];
    }
}
```

</details>

Once the form has been defined it can be instantiated elsewhere in Moodle, for example:

```php title="[path/to/plugin]/myform.php

// Instantiate the myform form from within the plugin.
$mform = new \plugintype_pluginname\form\myform();

// Form processing and displaying is done here.
if ($mform->is_cancelled()) {
    // If there is a cancel element on the form, and it was pressed,
    // then the `is_cancelled()` function will return true.
    // You can handle the cancel operation here.
} else if ($fromform = $mform->get_data()) {
    // When the form is submitted, and the data is successfully validated,
    // the `get_data()` function will return the data posted in the form.
} else {
    // This branch is executed if the form is submitted but the data doesn't
    // validate and the form should be redisplayed or on the first display of the form.

    // Set anydefault data (if any).
    $mform->set_data($toform);

    // Display the form.
    $mform->display();
}
```

If you wish to use the form within a block then you should consider using the render method, as demonstrated below:

Note that the render method does the same as the display method, except returning the HTML rather than outputting it to the browser, as with above make sure you've included the file which contains the class for your Moodle form.

```php
class block_yourblock extends block_base {
    public function init(){
        $this->title = 'Your Block';
    }

    public function get_content(){
        $this->content = (object) [
            'text' => '',
        ];

        $mform = new \plugintype_pluginname\form\myform();

        if ($mform->is_cancelled()) {
            // If there is a cancel element on the form, and it was pressed,
            // then the `is_cancelled()` function will return true.
            // You can handle the cancel operation here.
        } else if ($fromform = $mform->get_data()) {
            // When the form is submitted, and the data is successfully validated,
            // the `get_data()` function will return the data posted in the form.
        } else {
            // This branch is executed if the form is submitted but the data doesn't
            // validate and the form should be redisplayed or on the first display of the form.

            // Set anydefault data (if any).
            $mform->set_data($toform);

            // Display the form.
            $this->content->text = $mform->render();
        }

        return $this->content;
    }
}
```

## Form elements

Moodle provides a number of basic, and advanced, form elements. These are described in more detail below.

### Basic form elements

1. [button](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#button)
1. [checkbox](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#checkbox)
1. [radio](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#radio)
1. [select](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#select)
1. [multi-select](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#multi-select)
1. [password](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#password)
1. [hidden](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#hidden)
1. [html](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#html) - div element
1. [static](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#static) - Display a static text.
1. [text](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#text)
1. [textarea](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#textarea)
1. [header](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#Use_Fieldsets_to_group_Form_Elements)

### Advanced form elements

<!-- cspell:ignore choosecoursefile -->
<!-- cspell:ignore modgrade -->
<!-- cspell:ignore questioncategory -->
<!-- cspell:ignore choicedropdown -->

1. [Autocomplete](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#autocomplete) - A select box that allows you to start typing to narrow the list of options, or search for results.
1. [advcheckbox](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#advcheckbox) - Advance checkbox
1. [choicedropdown](./form/fields/choicedropdown) - A dropdown menu where custom information is displayed on each option.
1. [float](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#float)
1. [passwordunmask](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#passwordunmask) - A password element with option to show the password in plaintext.
1. [recaptcha](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#recaptcha)
1. [selectyesno](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#selectyesno)
1. [selectwithlink](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#selectwithlink)
1. [date_selector](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#date_selector)
1. [date_time_selector](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#date_time_selector)
1. [duration](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#duration)
1. [editor](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#editor)
1. [filepicker](./usage/files.md#file-picker) - upload single file
1. [filemanager](./usage/files.md#file-manager) - upload multiple files
1. [tags](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#tags)
1. [addGroup](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#addGroup)
1. [modgrade](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#modgrade)
1. [modvisible](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#modvisible)
1. [choosecoursefile](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#choosecoursefile)
1. [grading](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#grading)
1. [questioncategory](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#questioncategory)

### Custom form elements

In addition to the standard form elements, you can register your own custom form elements, for example:

```php
// Register a custom form element.
MoodleQuickForm::registerElementType(
    // The custom element is named `course_competency_rule`.
    // This is the element name used in the `addElement()` function.
    'course_competency_rule',

    // This is where it's definition is defined.
    // This does not currently support class auto-loading.
    "$CFG->dirroot/$CFG->admin/tool/lp/classes/course_competency_rule_form_element.php",

    // The class name of the element.
    'tool_lp_course_competency_rule_form_element'
);

// Add an instance of the custom form element to your form.
$mform->addElement(
    // The name of the custome lement.
    'course_competency_rule',
    'competency_rule',
    get_string('uponcoursemodulecompletion', 'tool_lp'),
    $options
);
```

For a real-life example, see:

- [Custom element definition](https://github.com/moodle/moodle/blob/main/admin/tool/lp/classes/course_competency_rule_form_element.php)
- [Custom element usage](https://github.com/moodle/moodle/blob/main/admin/tool/lp/lib.php#L157-L161)

## Commonly used functions

### add_action_buttons()

Add the standard 'action' buttons to the form - these are the standard Submit, and Cancel buttons on the form.

```php
public function add_action_buttons(
    bool $cancel = true,
    ?string $submitlabel = null
);
```

- The `$cancel` parameter can be used to control whether a cancel button is shown.
- The `$submitlabel` parameter can be used to set the label for the submit button. The default value comes from the `savechanges` string.

:::important

The `add_action_buttons` function is defined on `moodlform` class, and not a part of `$this->_form`, for example:

```php
    public function definition() {
        // Add your form elements here.
        $this->_form->addElement(...);

        // When ready, add your action buttons.
        $this->add_action_buttons();
    }
```

:::

### add_sticky_action_buttons()

<Since version="4.3" />

This method calls `add_action_buttons()` internally and makes 'action' buttons sticky.

```php
public function add_sticky_action_buttons(
    bool $cancel = true,
    ?string $submitlabel = null
);
```

### setDefault()

The [setDefault()](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#setDefault_2) function can be used to set the default value for an element.

### disabledIf()

The [disabledIf()](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#disabledIf) function can be used to conditionally _disable_ a group of elements, or and individual element depending on the state of other form elements.

### hideIf()

<Since version="3.4" />

The [hideif()](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#hideIf) function can be used to conditionally _hide_ a group of elements, or and individual element depending on the state of other form elements.

### addRule()

The [addRule()](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#addRule) function can be used to define both client-side, and server-side validation rules. For example, this can be used to validate that a text-field is required, and has a type of email.

### addHelpButton()

The [addHelpButton()](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#addHelpButton) function can be used to add a pop-up help button to a form element.

### setType()

The [setType()](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#setType) function can be used to specify how submitted values are cleaned. The `PARAM_*` constants are used to specify the type of data that will be submitted.

### disable_form_change_checker()

Normally, if a user navigate away from any form and changes have been made, a popup will be shown to the user asking them to confirm that they wish to leave the page and that they may lose data.

In some cases this is not the desired behaviour, in which case the [disable_form_change_checker()](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#disable_form_change_checker) function can be used to disable the form change checker.

For example:

```php
public function definition() {
    // Your definition goes here.

    // Disable the form change checker for this form.
    $this->_form->disable_form_change_checker();
}
```

### filter_shown_headers()

<Since version="4.3"  issueNumber="MDL-78288" />

This method adds values to `_shownonlyelements` array to decide whether a header should be shown or hidden.
Only header names would be accepted and added to `_shownonlyelements` array.
Headers included in `_shownonlyelements` will be shown expanded in the form. The rest of the headers will be hidden.

```php
public function filter_shown_headers(array $shownonly): void {
    $this->_shownonlyelements = [];
    if (empty($shownonly)) {
        return;
    }
    foreach ($shownonly as $headername) {
        $element = $this->getElement($headername);
        if ($element->getType() == 'header') {
            $this->_shownonlyelements[] = $headername;
            $this->setExpanded($headername);
        }
    }
}
```

Empty `_shownonlyelements` array doesn't affect header's status or visibility.

```php title="/course/editsection.php"
$showonly = optional_param('showonly', 0, PARAM_TAGLIST);

[...]

$mform = $courseformat->editsection_form($PAGE->url, $customdata);

$initialdata = convert_to_array($sectioninfo);
if (!empty($CFG->enableavailability)) {
    $initialdata['availabilityconditionsjson'] = $sectioninfo->availability;
}
$mform->set_data($initialdata);
if (!empty($showonly)) {
    $mform->filter_shown_headers(explode(',', $showonly));
}
```

### Other features

In some cases you may want to [group elements](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition#Use_Fieldsets_to_group_Form_Elements) into collections.

## Unit testing

In order to test the processing of submitted form contents in unit tests, the Forms API has a `mock_submit()` function.

This method makes the form behave as if the data supplied to it was submitted by the user via the web interface. The data still passes through all form validation, which means that `get_data() will return all of the parsed values, along with any defaults.

<details>
<summary>Example usage</summary>

```php
// Instantiate a form to submit.
$form = new qtype_multichoice_edit_form(...);

// Fetch the data and then mock the submission of that data.
$questiondata = test_question_maker::get_question_data('multichoice', 'single');
$form->mock_submit($questiondata);

// The `get_data()` function will return the validated data, plus any defaults.
$actualfromform = $form->get_data();

// The resultant data can now be tested against the expected values.
$expectedfromform = test_question_maker::get_question_form_data('multichoice', 'single');
$this->assertEquals($expectedfromform, $actualfromform);

// The data can also be saved and tested in the context of the API.
save_question($actualfromform);
$actualquestiondata = question_load_questions(array($actualfromform->id));
$this->assertEquals($questiondata, $actualquestiondata);
```

</details>

## See also

- [Core APIs](../../../apis.md)
- [lib/formslib.php Usage](./usage/index.md)
- [lib/formslib.php Form Definition](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition)
- [Designing usable forms](/general/development/policies/designing-usable-forms)
- [Fragment](https://docs.moodle.org/dev/Fragment)
- [MForm Modal](https://docs.moodle.org/dev/MForm_Modal)
