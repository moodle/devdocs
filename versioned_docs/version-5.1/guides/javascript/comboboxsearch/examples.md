---
title: Example usages
tags:
  - Javascript
  - AJAX
  - Searching
  - Navigation
  - UI
  - UX
  - Frontend
---

## Core Search Dropdown Migration

Several grade report modules have been migrated to use the new core search dropdown component. This migration provides a more consistent user experience across different grade report modules and allows for easier maintenance and updates.

The following grade reports were migrated within MDL-77991:

- Grade report user
- Grade report single view
- Grade report grader

## Third party usage

Whilst working on MDL-77991, the Moodle development team also migrated the following third party plugin to use the new core search dropdown component as a proof of concept:

- [Block stash](https://moodle.org/plugins/block_stash)

## Quick start

To use the core components in your own Moodle module, you can follow these steps:

- Import the core component(s) you want to use:

```php
use core\output\comboboxsearch;
```

- Instantiate the component with the appropriate options in PHP:

```php
$searchdropdows = new comboboxsearch(
    true,
    'Trigger button content',
    null,
    'parent-class',
    'trigger-button-class',
    'search-dropdown-class',
    null,
    false,
);
$data['templatevalue'] = $searchdropdown->export_for_template(\renderer_base);
```

- Instantiate the component JS within PHP:

```php
$PAGE->requires->js_call_amd('<yourplugin>/<yourjsfile>', 'init');
```

This will output the HTML for the search dropdown component with the specified options. You can customize the options to fit your specific use case.
