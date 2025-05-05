---
title: Custom fields API
tags:
  - customfield
  - Custom field
---

<Since versions={["3.7"]} issueNumber="MDL-57898" />

## Custom fields API overview

Custom fields API allows to configure custom fields that can be added to various contexts. Each **component** (or plugin) that wants to use custom fields can define several **areas**.

:::info Example
The `core_course` component defines an area `course` that allows to add custom fields to the courses. The same component can define another area `coursecat` that will allow to add custom fields to the course categories.
:::

Inside each area, the component/plugin can decide whether to use or not to use **itemid**.

:::info Example
Course custom fields are the same throughout the system and they don't use `itemid` (it is always 0). But there could be an activity module that would want to configure different custom fields for each individual instance of module. Then this module would use the module id as the `itemid`, as in ([example](https://github.com/marinaglancy/moodle-mod_surveybuilder)). This would allow to create modules similar to `mod_data` and `mod_feedback` where each instance has its own set of fields.
:::

New plugin type `customfield` was also added as part of the Custom fields API. Additional types of custom fields can be installed into `/customfield/field/`.

## How to use custom fields

Component/plugin that uses custom fields must define a **handler class** for each area and a **configuration page**. Handler class must be called `<PLUGINNAME>/customfield/<AREA>_handler` and be placed in autoloaded location  `<PLUGINDIR>/classes/customfield/<AREA>_handler.php`. This class must extend **\core_customfield\handler** . Configuration page may be located anywhere. For course custom fields configuration the admin settings page is used [/course/customfield.php](https://github.com/moodle/moodle/blob/main/course/customfield.php). If the area uses `itemid` this page should take `itemid` as a parameter.

Handler has protected constructor, to get a handler call `create()` method. Some areas may choose to return a singleton here:

```php
$handler = HANDLERCLASS::create($itemid);
```

Configuration page contents will be:

```php
$output = $PAGE->get_renderer('core_customfield');
$outputpage = new \core_customfield\output\management($handler);
echo $output->render($outputpage);
```

Handler must implement all abstract methods (calculate configuration or instance context, check permissions to configure, view or edit) and also may choose to overwrite:

```php
handler::uses_categories()
handler::generate_category_name()
handler::config_form_definition() // For example, the course_handler adds "locked" and "visibility" settings that control who can edit or view the particular field.
handler::setup_edit_page() // Sets page context/url/breadcrumb for the customfield/edit.php page, in some cases it must be overridden.
```

### Add custom fields to the instance edit form

Custom fields are added to the **instances**. For example, course custom fields are added to the courses, so `courseid` is the `instanceid`. In the example of [`mod_surveybuilder`](https://github.com/marinaglancy/moodle-mod_surveybuilder) we use `$USER->id` as the `instanceid` (which means that in this example one user can fill the survey in one module only once). In each case of using custom fields there should be a clear concept of an **instance**. `Instanceid` is required to save the data but it may be empty when we render the instance edit form (for example, the course is not yet created).

Developer must add custom field callbacks to the instance edit form. If the instance is "made up" (like in `mod_surveybuilder`), a new form has to be created with `id` field in it that will refer to the `instanceid`.

The following callbacks should be used in `form definition`, `definition_after_data`, `validation` and `after form submission`:

```php
$handler->instance_form_definition($mform)
$handler->instance_form_before_set_data()
$handler->instance_form_definition_after_data()
$handler->instance_form_validation()
$handler->instance_form_save($data)
```

The `instance_form_save()` method must be called after the form was saved as the `$data` parameter must have the `id` attribute.

On deletion of an instance or on deletion of the whole item call:

```php
$handler->delete_instance()
$handler->delete_all()
```

### Retrieving instances custom fields

How custom fields are used depends entirely on the situation.

```php title="Handler methods to retrieve custom fields values for the given instance(s)"
$handler->export_instance_data()
$handler->export_instance_data_object()
$handler->display_custom_fields_data()
```

Additional methods for advanced usage:

```php
$handler->get_instance_data()
$handler->get_instances_data()
$handler->get_instance_data_for_backup()
```

Method `restore_instance_data_from_backup()` exists in the handler class but is not implemented.

```php title="To retrieve the list of custom fields used in the given component/area/itemid"
$handler->get_categories_with_fields()
$handler->get_fields()
```

:::note
The list of fields is cached in the handler and these two functions can be called multiple times.
:::

```php title="Example code for course custom fields. This function will return all the custom fields for a given courseid"
function get_course_metadata($courseid) {
    $handler = \core_customfield\handler::get_handler('core_course', 'course');
    // This is equivalent to the line above.
    //$handler = \core_course\customfield\course_handler::create();
    $datas = $handler->get_instance_data($courseid);
    $metadata = [];
    foreach ($datas as $data) {
        if (empty($data->get_value())) {
            continue;
        }
        $cat = $data->get_field()->get_category()->get('name');
        $metadata[$data->get_field()->get('shortname')] = $cat . ': ' . $data->get_value();
    }
    return $metadata;
}
```

### Privacy API

Custom fields API does not export or delete any data because it does not know how custom fields are used, what data is considered user data and if it is considered private or shared data.

```php title="Plugins that store user information in custom fields should link subsystem in their get_metadata"
$collection->link_subsystem('core_customfield', 'privacy:metadata:customfieldpurpose');
```

```php title="They can use the following methods in the export/delete functions"
use core_customfield\privacy\provider as customfield_provider;

customfield_provider::get_customfields_data_contexts()
customfield_provider::export_customfields_data()
customfield_provider::delete_customfields_data()
customfield_provider::delete_customfields_data_for_context()
```

In case when custom fields configuration is considered to be user data (configuration means the definition of the fields, not the instance data), there are also couple of methods to help with privacy API implementations:

```php
customfield_provider::get_customfields_configuration_contexts()
customfield_provider::delete_customfields_configuration()
customfield_provider::delete_customfields_configuration_for_context()
```

:::info
Export of configuration was not yet implemented at the time of writing this because of difficult implementation and very unclear use case. If it is needed please feel free to contribute to Moodle.
:::

## Custom fields plugins

Custom fields plugin type was added to allow implement different types of custom fields (somehow similar to user profile fields plugin type). Plugins are located in `/customfield/field/` and the full frankenstyle name of the plugins start with `customfield_`.

Except for common [Plugin files](../../commonfiles/index.mdx) and tests the following classes must be present in `customfield` plugins (in respective autoloaded locations):

```php
namespace customfield_<PLUGINNAME>;
class field_controller extends \core_customfield\field_controller;
class data_controller extends \core_customfield\data_controller;

namespace customfield_<PLUGINNAME>\privacy;
class provider implements \core_privacy\local\metadata\null_provider, \core_customfield\privacy\customfield_provider;
```

## See also

- [MDL-64626](https://tracker.moodle.org/browse/MDL-64626) - Custom fields API (Moodle 3.7+) implementations and improvements
- [MDL-57898](https://tracker.moodle.org/browse/MDL-57898) - Add custom field types plugin and course custom fields functionality
