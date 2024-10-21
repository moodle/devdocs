---
title: Checkbox controller
tags:
  - core_form
  - core
  - Forms API
  - Advanced
---

The checkbox controller allows developers to group checkboxes together and add a link or button to check, or uncheck, all of the checkboxes at once.

You can add as many groups of checkboxes as you like, as long as they are uniquely named, where the name is an integer.

## Checkbox groups

When adding checkboxes, you can add them in _groups_. Each group of checkboxes must have a unique integer name, for example:

```php title="classes/form/example_form.php"
public function definition(): void {
    // These two elements are part of group 1.
    $mform->addElement('advcheckbox', 'test1', 'Test 1', null, ['group' => 1]);
    $mform->addElement('advcheckbox', 'test2', 'Test 2', null, ['group' => 1]);

    // Add a checkbox controller for all checkboxes in `group => 1`:
    $this->add_checkbox_controller(1);

    // These two elements are part of group 3.
    $mform->addElement('advcheckbox', 'test3', 'Test 3', null, ['group' => 3]);
    $mform->addElement('advcheckbox', 'test4', 'Test 4', null, ['group' => 3]);

    // Add a checkbox controller for all checkboxes in `group => 3`.
    // This example uses a different wording isntead of Select all/none by passing the second parameter:
    $this->add_checkbox_controller(
        3,
        get_string("checkall", "plugintype_pluginname")
    );
}
```

## API

The checkbox controller is described by the following mform function:

```php
moodleform::add_checkbox_controller(
    $groupid = null,
    string $text = null,
    mixed $attributes = null,
    int $originalvalue
): void;
```

- int *$groupid* This also serves as the checkbox group name. It must be a unique integer per collection of checkboxes.
- string *$text* (optional) Link display text. Defaults to `get_string('selectallornone', 'form')`.
- mixed  *$attributes* (optional) Either a typical HTML attribute string or an associative array.
- int *$originalValue* (optional) Defaults to 0; The general original value of the checkboxes being controlled by this element.

:::info An explanation of `$originalvalue`

Imagine that you have 50 checkboxes in your form, which are all unchecked when the form first loads, except 5 or 6 of them.

The logical choice here would be for the standard behaviour to check all of the checkboxes upon first click, then to uncheck them all upon the next click and so on.

If the situation was reversed, with most of the checkboxes already checked by default, then it would make more sense to have the first action uncheck all the checkboxes.

The `$originalvalue` parameter allows you to configure the initial value and therefore the initial behaviour.

:::

### Description of functionality

The first role of the `add_checkbox_controller` method is to add a form element. Depending on whether JavaScript is supported by the browser or not, it will either output a link with onclick behaviour for instant action, or a `nosubmit` button which will reload the page and change the state of the checkboxes, but retain the rest of the data already filled in the form by the user.

The second role is to change the state of the checkboxes. The JavaScript version simply switches all checkboxes to checked or unchecked. The state applied when the link is first clicked depends on the `$originalvalue` parameter as noted above. The non-JavaScript version behaves in exactly the same way, although a page reload is necessary.
