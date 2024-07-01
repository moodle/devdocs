---
title: Form Usage
tags:
  - core_form
  - form
  - core
  - API
documentationDraft: true
---

Moodle's Form API is an extension of the Pear HTML_QuickForm API, which is no longer supported. Some documentation for the upstream library is [available in the PEAR package page](http://pear.php.net/package/HTML_QuickForm), including a [short tutorial](http://pear.php.net/manual/en/package.html.html-quickform.tutorial.php). A [longer tutorial is also available](http://web.archive.org/web/20130630141100/http://www.midnighthax.com/quickform.php), courtesy of the Internet Archive.

Moodle will attempt to provide a more complete tutorial in this documentation where possible.

:::tip

Some good examples of usage of the Forms API can be found at the following locations:

- [Course edit form - definition](https://github.com/moodle/moodle/blob/main/course/edit_form.php)
- [Course edit form - usage](https://github.com/moodle/moodle/blob/main/course/edit.php)

:::

Whilst much of the API originates in the PEAR package, all interaction with the library should be via the `moodleform` class, which acts as a controlling wrapper to HTML_QuickForm.

## Basic Usage in A Normal Page

Generally the structure of a page with a form on it looks like this:

```php
// You will process some page parameters at the top here and get the info about
// what instance of your module and what course you're in etc. Make sure you
// include hidden variable in your forms which have their defaults set in set_data
// which pass these variables from page to page.

// Setup $PAGE here.

// Instantiate the form that you defined.
$mform = new \plugintype_pluginname\form\myform();
// Default 'action' for form is strip_querystring(qualified_me()).

// Set the initial values, for example the existing data loaded from the database.
// This is typically an array of name/value pairs that match the
// names of data elements in the form.
// You can also use an object.
$mform->set_data($toform);

if ($mform->is_cancelled()) {
    // You need this section if you have a cancel button on your form.
    // You use this section to handle what to do if your user presses the cancel button.
    // This is often a redirect back to an older page.
    // NOTE: is_cancelled() should be called before get_data().
    redirect($returnurl);

} else if ($fromform = $mform->get_data()) {
    // This branch is where you process validated data.

    // Typically you finish up by redirecting to somewhere where the user
    // can see what they did.
    redirect($nexturl);
}

// If the formw as not cancelled, and data was not submitted, then display the form.
echo $OUTPUT->header();
$mform->display();
echo $OUTPUT->footer();
```

You are encouraged to look at `lib/formslib.php` to see what additional functions and parameters are available. Available functions are well commented.

## Defining Your Form Class

The form class tells us about the structure of the form.

In most cases you can place this in an auto-loadable class, in which case it should be placed in a folder named `form`, for example:

```php title="mod/forum/classes/form/myform.php
<?php

namespace mod_forum\form;

class myform extends \moodleform {
    // ...
}
```

:::info

Historically it was not possible to auto-load classes. As a result, there are many parts of the core codebase which will manually require a file and expect a non-namespaced class name.

One example of this is in the activity edit form, which must be named `mod_[modname]_mod_form` and can either be located in `mod/[modname]/classes/mod_form.php` or in `mod/[modname]/mod_form.php`.

:::

The name you give the class is used as the `id` attribute of your form in html. Any trailing '_form' is removed. Your form class name should be unique in order for it to be selectable in CSS by theme designers who may want to adjust the css just for that form.

### definition()

Form definition is defined in further detail in the [Form definition](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition) documentation.

## Use in Activity Modules Add / Update Forms

The same form is used to create or edit an activity, but some legacy constraints still apply:

- The form _must_ be named `mod_[modname]_mod_form`
- The class _must_ be located in either:
  - `mod/[modname]/mod_form.php`; or
  - `mod/[modname]/classes/mod_form.php`
- The form _must_ extend the `moodleform_mod` class.

### defaults_preprocessing

Since the data for the activity editing form is automatically filled from the database, you may need to pre-process this data to set values for some form fields. For example, in the Forum activity, in some situations a Unix Time Stamp is used to set a boolean checkbox.

This can be achieved using the `defaults_preprocessing` method.

### Post Processing

Whilst the pre-processing stage is performed in the `defaults_preprocessing` function, all post-processing is perform in the `[modname]_add_instance` and `[modname]_update_instance` functions in the activities `lib.php`.

These are called _after_ data bas been validated by the Forms API.

### Standard activity form elements

Moodle has a set of standard form elements used by all Activity modules. These allow for consistent control over activity visibility, group modes, and other common APIs.

The `standard_coursemodule_elements()` function is used to add these common elements, and it should be called _before_ the standard action elements are added, for example:

```php
class mod_example_mod_form extends \moodleform_mod {
    public function definition() {
        // Add the various form elements.
        $this->_form->addElement( ... );

        // Add the standard elements.
        $this->standard_coursemodule_elements();

        // Add the form actions.
        $this->add_action_buttons();
    }
}
```
