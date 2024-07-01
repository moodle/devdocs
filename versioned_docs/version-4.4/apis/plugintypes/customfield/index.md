---
title: Custom fields
tags:
  - customfield
  - Course
  - Custom field
---

Custom fields allow you to create field types to be used for custom fields. Instances of these field types can be added to the respective areas that implement [Custom fields API](../../core/customfields/index.md). Currently in Moodle core only courses implement this API, however custom fields are also used in addon plugins for other areas. For example, if you want to display radio buttons on the course edit page, then you can add an instance of a radio custom field plugin to the Course custom fields configuration.

import {
    Lang,
} from '../../_files';
import FieldController from './_files/field_controller';
import DataController from './_files/data_controller';

## File structure

Custom field plugins are located in the `/customfield/field` directory. A plugin should not include any custom files outside of it's own plugin folder.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

:::important

Some of the important files are described below. See the [common plugin files](../../commonfiles/index.mdx) documentation for details of other files which may be useful in your plugin.

:::

<details>
  <summary>View an example directory layout for the `customfield_checkbox` plugin.</summary>

```console
customfield/field/checkbox
├── classes
│   ├── data_controller.php
│   ├── field_controller.php
│   └── privacy
│       └── provider.php
├── lang
│   └── en
│       └── customfield_checkbox.php
└── version.php
```

</details>

A custom field plugin requires two _controller_ classes:

- a _field_ controller, which describes the field itself; and
- a _data_ controller, which describes with interface within the context of the instance (i.e. course).

### Field Controller

The field controller defines the available configuration options that an administrator can select within the user interface to configure the field.

Examples might include the prompt to show alongside the custom field element, and whether the element is required.

:::note Class naming

The class must be named `field_controller` within your plugin's namespace (for example `customfield_myfield`) and must extend the `\core_customfield\field_controller` class.

:::

<!-- markdownlint-save -->
<!-- markdownlint-disable no-inline-html -->

import fieldExample from '!!raw-loader!./_files/field_controller.php';

<FieldController example={fieldExample} />

<!-- markdownlint-restore -->

The `\core_customfield\field_controller` class is an abstract class and defines a number of functions which you can choose to override. At a minimum, the following two items are required:

- the `TYPE` constant to match the name of the plugin; and
- the `config_form_definition()` function.

:::danger Element names

All element names must be in the format `$configdata[configname]` for values to be saved, for example `configdata[cfgdefault]`.

:::

In addition to these requried a functions a number of other functions exist and can be overridden, with the following being particularly useful:

- `config_form_validation($formdata, $formfiles)` - control the form validation

Details of all available functions can be found in the `\core_customfield\field_controller` class defined in `/customfield/classes/field_controller.php`.

### Data Controller

The data controller defines the user interface that teachers use within the course edit form.

:::note Class naming

The class must be named `data_controller` within your plugin's namespace (for example `customfield_myfield`) and must extend the `\core_customfield\data_controller` class.

:::

<!-- markdownlint-save -->
<!-- markdownlint-disable no-inline-html -->

import dataExample from '!!raw-loader!./_files/data_controller.php';

<DataController example={dataExample} />

<!-- markdownlint-restore -->

The `\core_customfield\data_controller` class is an abstract class and defines a number of functions which you can choose to override. At a minimum, the following two items are required:

- the `datafield(): string` function; and
- the `instance_form_definition()` function.

#### datafield()

The `datafield()` function returns an enumerated string and describes which database field the data for the custom field is stored in. The possible options are:

- `intvalue` - can store integer values, this field is indexed
- `decvalue` - can store decimal values
- `shortcharvalue` - can store character values up to 255 characters long, this field is indexed
- `charvalue` - can store character values up to 1333 characters long, this field is not indexed
- `value` - can store character values of unlimited length ("text" field in the db)

#### instance_form_definition()

The `instance_form_definition()` function adds any required field elements that are displayed on the instance editing page (i.e. on the course settings page).

## See Also

- [Custom files API](../../core/customfields/index.md)
- [User Profile Fields](https://docs.moodle.org/dev/User_profile_fields)
