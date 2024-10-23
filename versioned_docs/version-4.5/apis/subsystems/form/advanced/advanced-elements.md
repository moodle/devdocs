---
title: Advanced elements
tags:
  - core_form
  - core
  - Forms API
  - Advanced
---

Form elements can be marked as 'advanced'. This has the effect that they are hidden initially.

To control whether an element is advanced, you can use the `setAdvanced` method on the MoodleQuickForm instance and set a specific element as being advanced, for example:

```php title="Marking an element as advanced"
$mform->addElement(
    'select',
    'display',
    get_string('displaymode', 'choice'),
    $CHOICE_DISPLAY
);
$mform->setAdvanced('display');
```

It is also possible to unset the advanced status of a field - the `setAdvanced` function takes a second, boolean, parameter which defaults to `true`. By passing a `false` value, the element's advanced flag will be removed, for example:

```php title="Marking an element as advanced"
// Mark a field as not advanced after it was previously marked as advanced.
$mform->setAdvanced('display', false);
```

:::warning

You should be careful about marking too many elements as advanced.

For more information on the risks of this, see the advice in [Designing usable forms](/general/development/policies/designing-usable-forms#use-show-moreless-advanced-settings-sparingly).

:::

:::info Location of Show and hide links

Whenever you mark a form element as advanced, then the _Show / hide advanced_  links are shown automatically at relevant points within the form.

The _Show advanced_ and _Hide advanced_ links are currently displayed at the top right of all fieldsets containing advanced controls.

:::

### Setting a name

When adding a header element, the second parameter to `addElement()` is a name field. You should pass a _unique_ name for each header.

If the name is not specified, or is not unique then this can have a range of unintended impacts, including marking multiple sections of the form as advanced. It is strongly encouraged to _always_ name headers.

<InvalidExample>

```php title="An empty name is passed to these headings"
$mform->addElement(
    'header',
    '',
    get_string('miscellaneoussettings', 'form')
);
$mform->addElement(
    'select',
    'display',
    get_string('displaymode', 'choice'),
    $CHOICE_DISPLAY
);
$mform->setAdvanced('display');

// Because this section has a non-unique name (an empty string),
// the advanced flag set for the display element in the previous
// section will also apply here.
$mform->addElement(
    'header',
    '',
    get_string('anothersection', 'form')
);
```

</InvalidExample>

## Marking an entire section as advanced

The `setAdvanced` function can mark an entire section as advanced by specifying the name of the header at the top of the section, for example:

```php title="Marking an entire section as advanced"
$mform->addElement(
    'header',
    'miscellaneoussettingshdr',
    get_string('miscellaneoussettings', 'form')
);
$mform->setAdvanced('miscellaneoussettingshdr');
```

In this example, all fields from this header until the next header will be marked as advanced.
