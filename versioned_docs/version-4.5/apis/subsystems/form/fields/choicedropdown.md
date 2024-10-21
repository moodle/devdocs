---
title: Choice Dropdown
tags:
- core_form
- form
---

The `choicedropdown` form field creates a dropdown list with multiple options. It is different from a standard select dropdown in that each option can have extra icons and descriptions. This field is often used in forms to facilitate the selection of a non-trivial option that demands additional information.

## Using the `choicedropdown` Form Field

While most form API fields use primitive data types, the `choicedropdown` form field uses a particular data definition called `choicelist`. This data definition is an abstraction that represents a user choice list and is used in other UI components like `core\output\local\dropdown\status` or `core\output\local\action_menu\subpanel`.

The `choicelist` class provides a way to define a list of options with additional information such as icons, descriptions, the currently selected option, or the ability to disable specific options.

## Example Usage

To create a `choicedropdown` form field, you need to:

1. Create a new instance of the `choicelist` class.
1. Add options and any extra information to the `choicelist` instance.
1. Add the `choicedropdown` form field to the form, passing the `choicelist` instance.

```php
// Define the options for the dropdown list.
$options = new core\output\choicelist();
$options->add_option(
    'option1',
    "Text option 1",
    [
        'description' => 'Option 1 description',
        'icon' => new pix_icon('t/hide', 'Eye icon 1'),
    ]
);
$options->add_option(
    'option2',
    "Text option 2",
    [
        'description' => 'Option 2 description',
        'icon' => new pix_icon('t/stealth', 'Eye icon 2'),
    ]
);
$options->add_option(
    'option3',
    "Text option 3",
    [
        'description' => 'Option 3 description',
        'icon' => new pix_icon('t/show', 'Eye icon 3'),
    ]
);

// Add the choicedropdown field to the form.
$mform->addElement(
    'choicedropdown',
    'FIELDNAME',
    get_string('FIELDNAME', 'PLUGINNAME'),
    $options,
);
$mform->setDefault('FIELDNAME', $defaultvalue);
```
