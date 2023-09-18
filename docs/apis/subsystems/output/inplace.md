---
title: Inplace editable
tags:
  - AJAX
  - Javascript
---
import { Since } from '@site/src/components';

<Since versions={["3.1"]} />

inplace_editable is a mini-API introduced under [MDL-51802](https://tracker.moodle.org/browse/MDL-51802) for Moodle 3.1. It allows developers easily add in-place editing of a value on any page. The interface is the same as sections and activity name editing. It is implemented as AMD module using JQuery and is re-usable.

![inplace editable example.png](./_inplace/inplace_editable_example.png)

## Implementing inplace_editable in a plugin

The best way is to explain the usage on a simple example. Imagine we have plugin `tool_mytest` that needs to implement in-place editing of a field 'name' from db table `tool_mytest_mytable`. We are going to call this itemtype "mytestname". Each plugin (or core component) may use as many itemtypes as it needs.

Define a callback in `/admin/tool/mytest/lib.php` that starts with the plugin name and ends with `_inplace_editable`:

```php
function tool_mytest_inplace_editable($itemtype, $itemid, $newvalue) {
    if ($itemtype === 'mytestname') {
        global $DB;
        $record = $DB->get_record('tool_mytest_mytable', array('id' => $itemid), '*', MUST_EXIST);
        // Must call validate_context for either system, or course or course module context. 
        // This will both check access and set current context.
        \external_api::validate_context(context_system::instance());
        // Check permission of the user to update this item. 
        require_capability('tool/mytest:update', context_system::instance());
        // Clean input and update the record.
        $newvalue = clean_param($newvalue, PARAM_NOTAGS);
        $DB->update_record('tool_mytest_mytable', array('id' => $itemid, 'name' => $newvalue));
        // Prepare the element for the output:
        $record->name = $newvalue;
        return new \core\output\inplace_editable('tool_mytest', 'mytestname', $record->id, true,
            format_string($record->name), $record->name, 'Edit mytest name',  'New value for ' . format_string($record->name));
    }
}
```

In your renderer or wherever you actually display the name, use the same `inplace_editable` template:

```php
$tmpl = new \core\output\inplace_editable('tool_mytest', 'mytestname', $record->id, 
    has_capability('tool/mytest:update', context_system::instance()),
    format_string($record->name), $record->name, 'Edit mytest name',  'New value for ' . format_string($record->name));
echo $OUTPUT->render($tmpl);
```

This was a very simplified example, in the real life you will probably want to:

- Create a function (or class extending `core\output\inplace_editable`) to form the instance of templateable object so you don't need to duplicate code;
- Use language strings for `edithint` and `editlabel`, best practice is to use `new lang_string` because these strings will not be needed if `editable=false`
- Use an existing function to update a record (which hopefully also validates input value and triggers events)
- Add unit tests and behat tests. There is a useful behat step **I press key "13" in the field "New value for myname"**

## Toggles and dropdowns

You may choose to set the UI for your inplace editable element to be a string value (default), toggle or dropdown.

Examples of dropdown setup (see also [example by overriding class](https://github.com/moodle/moodle/blob/master/tag/classes/output/tagareacollection.php)):

```php
$tagcollections = \core_tag_collection::get_collections_menu(true);
$tmpl = new \core\output\inplace_editable('core_tag', 'tagareacollection', $tagarea->id, $editable,
    null, $value, $edithint, $editlabel);
$tmpl->set_type_select($tagcollections);
// Note that $displayvalue is not needed (null was passed in the example above) - it will be automatically taken from options.
// $value in the example above must be an existing index from the $tagcollections array, otherwise exception will be thrown.
```

Example of toggle setup (see also [example by overriding class](https://github.com/moodle/moodle/blob/master/tag/classes/output/tagareaenabled.php)):

```php
$tmpl = new \core\output\inplace_editable('core_tag', 'tagflag', $tag->id, $editable, $displayvalue, $value, $hint);
$tmpl->set_type_toggle(array(0, 1));
// Note that $editlabel is not needed.
// $value must be an existing element of the array passed to set_type_toggle(), otherwise exception will be thrown.
// $displayvalue in toggles is usually an image, for example closed/open eye. It is easier to implement by 
// overriding the class. In this case $displayvalue can be generated from $value during exporting.
```

## How does it work

`inplace_editable` consists of

- Templateable/renderable **class core\output\inplace_editable**
- Template **core/inplace_editable**
- JavaScript module **core/inplace_editable**
- Web service **core_update_inplace_editable** available from AJAX

All four call each other so it's hard to decide where we start explaining this circle of friends but let's start with web service.

1. **Web service** receives arguments (`$component`, `$itemtype`, `$itemid`, `$newvalue`) - it searches for the inplace_editable callback in the component. Then web service calls this callback as `{component}_inplace_editable($itemtype, $itemid, $newvalue)`, this must return templateable element which is sent back to the web service caller. Web service requires user to be logged in. **Any other `capability/access` checks must be performed inside the callback.**

2. **Templateable element** contains such properties as component, `itemtype`, `itemid`, `displayvalue`, `value`, `editlabel` and `edithint`. When used in a **template** It only renders the displayvalue and the edit link (with `title=edithint`). All other properties are rendered as `data-xxx` attributes. Template also ensures that JavaScript module is loaded.

3. **JavaScript module** registers a listener to when the edit link is clicked and then it replaces the displayvalue with the text input box that allows to edit value. When user presses "Enter" the AJAX request is called to the web service and code from the component is executed. If web service throws an exception it is displayed for user as a popup.

## Events

Plugin page can listen to JQuery events that are triggered on successful update or when update failed. Example of the listeners (as inline JS code):

```php
$PAGE->requires->js_amd_inline("
require(['jquery'], function(\$) {
    $('body').on('updatefailed', '[data-inplaceeditable]', function(e) {
        var exception = e.exception; // The exception object returned by the callback.
        var newvalue = e.newvalue; // The value that user tried to udpated the element to.
        e.preventDefault(); // This will prevent default error dialogue.
        // Do your own error processing here.
    });
    $('body').on('updated', '[data-inplaceeditable]', function(e) {
        var ajaxreturn = e.ajaxreturn; // Everything that web service returned.
        var oldvalue = e.oldvalue; // Element value before editing (note, this is raw value and not display value).
        // Do your own stuff, for example update all other occurences of this element on the page.
    });
});
");
```

## See also
