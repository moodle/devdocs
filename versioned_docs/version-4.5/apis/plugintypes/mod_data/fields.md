---
title: Database fields
tags:
  - mod_data
  - datafield
  - plugintype
  - subplugin
documentationDraft: true
---

The [Database activity](https://docs.moodle.org/en/Database_module) included with Moodle includes support for several predefined [field types](./fields.md), including text, date, and URL. It is also possible to create new field types. For example, you might like to create:

- Discipline-specific field types - For example "Protein PDB code": users can enter the PDB code for a protein, and then the display 3D viewer for the protein structure, or link out to molecular databases.
- Institution-specific field types -  For example "library reference number": Allow users to enter a reference number which can be automatically turned into a direct link for local library services.
- Module-specific field types - For example "wiki page": users see a drop-down list containing the names of pages in your wiki, and can choose which page this particular entry refers to.

import { ComponentFileSummary } from '../../../_utils';

## File structure

Database field sub-plugins are located in the `/mod/data/field` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `datafield_number` subplugin.</summary>

```console
mod/data/field/number
├── classes
│   └── privacy
│       └── provider.php
├── field.class.php
├── lang
│   └── en
│       └── datafield_number.php
├── mod.html
└── version.php
```

</details>

Some of the important files for the database field plugintype are described below. See the [common plugin files](../../commonfiles/index.mdx) documentation for details of other files which may be useful in your plugin.

### Field class

<ComponentFileSummary
    filepath="/field.class.php"
    required
    summary="Definition of the field type"
/>

The field, its behaviours, and its properties, are defined in a class named `data_field_[pluginname]` located in `field.class.php`. This class must extend the `data_field_base` base class.

:::danger Class locations

The field definition is currently located in the `field.class.php` file and is not yet autoloaded by Moodle.

:::

The base class defines some simple behaviours which you can override in your plugin. The following functions are of particular interest:

- `display_add_field($recordid = 0)` - Return some HTML for use when a user is adding/editing a record
- `display_browse_field($recordid, $template)` - Return some HTML for displaying a record
- `update_content($recordid, $value, $name = '')` - Store the data entered by a user for a record
- `get_sort_sql($fieldname)` - Specify SQL for how this field should be sorted
- `get_content_value($value)` - Useful if the info stored in the database if different from the info that ends up being presented to the user

### Field configuration form

<ComponentFileSummary
    filepath="/mod.html"
    required
    summary="Form definition for adding and editing the field configuration"
/>

:::danger

The field definition is one of the older parts of Moodle and does not use best practice.

:::
