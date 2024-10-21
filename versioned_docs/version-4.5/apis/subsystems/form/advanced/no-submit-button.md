---
title: No submit button
tags:
  - core_form
  - core
  - Forms API
  - Advanced
---

The moodleform 'no_submit_button_pressed()' method allows you to detect if a button on your form has been pressed that is a submit button but that has been defined as a button that doesn't result in a processing of all the form data but will result in some form 'sub action' and then having the form redisplayed. This is useful for example to have an 'Add' button to add some option to a select box in the form etc. You define a button as a no submit button as in the example below (in `definition()`). This example adds a text box and a submit button in a group.

## Form definition

When defining your form, you will need to call the `registerNoSubmitButton()` function with the name of the submit button mark as a non-submission button, for example:

```php
$mform->registerNoSubmitButton('addtags');
$tags = [
    $mform->createElement('text', 'tagsadd', get_string('addtags', 'blog')),
    $mform->createElement('submit', 'addtags', get_string('add')),
];
$mform->addGroup($tags, 'tagsgroup', get_string('addtags','blog'), [' '], false);
$mform->setType('tagsadd', PARAM_NOTAGS);
```

## Form handling

When handling a no-submit button press you will need to check whether any no-submit button as pressed _before_ checking for submitted data. For example:

```php
$mform = new \plugintype_pluginname\form\my_form();
$mform->set_data($toform);

if ($mform->is_cancelled()){
    // If you have a cancel button on your form then you will need
    // to handle the cancel action here according to the
    // requirements of your plugin
} else if ($mform->no_submit_button_pressed()) {
    // If you have a no-submit button on your form, then you can handle that action here.
    $data = $mform->get_submitted_data();
} else if ($fromform = $mform->data_submitted()){
    // This branch is where you process validated data.
} else {
    // The form has not been submitted, or was unsuccessfully submitted.
}
```

:::important Modifying your form in a no-submit action

Because the check for a no-submit button press takes place on the defined form, the form is already defined at the point that it is checked.

If you wish to add or modify elements or options in your form, then may need to use methods on MoodleQuickForm to redefine your form elements.

:::
