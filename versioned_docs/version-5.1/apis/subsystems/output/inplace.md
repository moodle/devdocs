---
title: Inplace editable
tags:
  - AJAX
  - Javascript
documentationDraft: true
---

The `inplace_editable` element is a mini-API which allows developers to easily support editing of a value on any page. The interface is used in places such as the course section and activity name editing.

![inplace editable example.png](./_inplace/inplace_editable_example.png)

## Implementing inplace_editable in a plugin

The best way is to explain the usage on a simple example. Imagine we have plugin `tool_mytest` that needs to implement in-place editing of a field 'name' from db table `tool_mytest_mytable`. We are going to call this itemtype `mytestname`. Each plugin (or core component) may use as many item types as it needs.

Define a callback in `/admin/tool/mytest/lib.php` that starts with the plugin name and ends with `_inplace_editable`:

```php title="admin/tool/mytest/lib.php"
function tool_mytest_inplace_editable($itemtype, $itemid, $newvalue) {
    global $DB;

    if ($itemtype === 'mytestname') {
        $record = $DB->get_record('tool_mytest_mytable', ['id' => $itemid], '*', MUST_EXIST);

        // Must call validate_context for either system, or course or course module context.
        // This will both check access and set current context.
        \external_api::validate_context(context_system::instance());

        // Check permission of the user to update this item.
        require_capability('tool/mytest:update', context_system::instance());

        // Clean input and update the record.
        $newvalue = clean_param($newvalue, PARAM_NOTAGS);

        $DB->update_record('tool_mytest_mytable', ['id' => $itemid, 'name' => $newvalue));

        // Prepare the element for the output:
        $record->name = $newvalue;

        return new \core\output\inplace_editable(
            'tool_mytest',
            'mytestname',
            $record->id,
            true,
            format_string($record->name),
            $record->name,
            get_string('editmytestnamefield', 'tool_mytest'),
            get_string('newvaluestring', 'tool_mytest', format_string($record->name))
        );
    }
}
```

In your renderer or wherever you actually display the name, use the same `inplace_editable` template:

```php
$tmpl = new \core\output\inplace_editable(
    'tool_mytest',
    'mytestname',
    $record->id,
    has_capability('tool/mytest:update', context_system::instance()),
    format_string($record->name),
    $record->name,
    new lang_string('editmytestnamefield', 'tool_mytest'),
    new lang_string('newvaluestring', 'tool_mytest', format_string($record->name))
);
echo $OUTPUT->render($tmpl);
```

This was a very simplified example, in the real life you will probably want to:

- Create a function (or class extending `core\output\inplace_editable`) to form the instance of templatable object so you don't need to duplicate code;
- Use an existing function to update a record (which hopefully also validates input value and triggers events)
- Add unit tests and behat tests

<details>
  <summary>View example</summary>
  <div>

```php title="admin/tool/mytest/classes/local/inplace_edit_text.php"

class inplace_edit_text extends \core\output\inplace_editable {
    /**
     * Constructor.
     *
     * @param object $record
     */
    public function __construct($record) {
        parent::__construct(
            component: 'tool_mytest',
            // The item type as managed your plugin.
            itemtype: 'mytesttext',
            // An ID that relates to this instance of this item type.
            itemid: $record->id,
            // Whether this user can makes changes.
            // Perhaps based upon a capability check.
            editable: has_capability(
                'capname',
                \context_system::instance(),
            ),
            // The display value of this item.
            displayvalue: format_string($record->name),
            // The machine-readable value.
            value: $record->name,
            // Hints and labels.
            edithint: get_string('edithint', 'tool_mytest'),
            editlabel: get_string('editlabel', 'tool_mytest'),
        );
        $this->set_type_select($answeroptionstemp);
    }

    /**
     * Updates the value in database and returns itself.
     *
     * Called from inplace_editable callback
     *
     * @param int $itemid
     * @param mixed $newvalue
     * @return \self
     */
    public static function update($itemid, $newvalue) {
        // Clean the new value.
        $newvalue = clean_param($newvalue, PARAM_INT);

        // {{ Do some mighty things here}}

        $record = $DB->get_record('xxx', ['id' => 'xxx']);

        // Finally return itself.
        return new self($record);
    }
}
```

</div>
</details>

## Toggles and dropdowns

You may choose to set the UI for your inplace editable element to be a string value (default), toggle or dropdown.

Examples of dropdown setup (see also [example by overriding class](https://github.com/moodle/moodle/blob/main/tag/classes/output/tagareacollection.php)):

```php
$tagcollections = \core_tag_collection::get_collections_menu(true);
$tmpl = new \core\output\inplace_editable(
    'core_tag',
    'tagareacollection',
    $tagarea->id,
    $editable,

    // Note that $displayvalue is not needed (null was passed in the example above).
    // It will be automatically taken from options.
    null,

    // $value must be an existing index from the $tagcollections array,
    // otherwise exception will be thrown.
    $value,
    $edithint,
    $editlabel
);
$tmpl->set_type_select($tagcollections);
```

Example of toggle setup (see also [example by overriding class](https://github.com/moodle/moodle/blob/main/tag/classes/output/tagareaenabled.php)):

```php
$tmpl = new \core\output\inplace_editable(
    'core_tag',

    'tagflag',

    $tag->id,

    $editable,

    // $displayvalue usually toggles an image, for example closed/open eye.
    // It is easier to implement by overriding the class.
    // In this case $displayvalue can be generated from $value during exporting.
    $displayvalue,

    // $value must be an existing element of the array
    // passed to set_type_toggle(), otherwise exception will be thrown.
    $value,

    $hint,
);
$tmpl->set_type_toggle([0, 1]);
```

<details>
  <summary>View example</summary>
  <div>

```php title="admin/tool/mytest/classes/local/inplace_edit_select.php"
class inplace_edit_select extends \core\output\inplace_editable {
    /**
     * Constructor.
     *
     * @param \stdClass $record
     */
    public function __construct($record) {
        // Get the options for inplace_edit select box.
        // The array needs the format:
        //     $options = [
        //         'value1' => 'text1',
        //         'value2' => 'text2',
        //     ];
        $options = \tool_mytest\classes\helper::get_options();

        parent::__construct(
            component: 'tool_mytest',
            // The item type as managed your plugin.
            itemtype: 'mytestselect',
            // An ID that relates to this instance of this item type.
            itemid: $record->id,
            // Whether this user can makes changes.
            // Perhaps based upon a capability check.
            editable: has_capability(
                'capname',
                \context_system::instance(),
            ),
            // The display value of this item.
            displayvalue: $options[$optionkey],
            // The machine-readable value.
            value: $optionkey,
            // Hints and labels.
            edithint: get_string('edithint', 'tool_mytest'),
            editlabel: get_string('editlabel', 'tool_mytest'),
        );
        $this->set_type_select($options);
    }

    /**
     * Updates the value in database and returns itself.
     *
     * Called from inplace_editable callback
     *
     * @param int $itemid
     * @param mixed $newvalue
     * @return \self
     */
    public static function update($itemid, $newvalue) {
        // Clean the new value.
        $newvalue = clean_param($newvalue, PARAM_INT);

        // {{ Do some mighty things here}}

        $record = $DB->get_record('xxx', ['id' => 'xxx']);

        // Finally return itself.
        return new self($record);
    }
}
```

  </div>
</details>

<details>
  <summary>View example rendering with PHP</summary>
  <div>

```php
$renderer = $PAGE->get_renderer('core');
$inplaceedit = new tool_mytest\local\inplace_edit_text($record);
$params = $inplaceedit->export_for_template($renderer);
echo $OUTPUT->render_from_template('core/inplace_editable', $params);
```

  </div>
</details>

<details>
  <summary>View example rendering with JavaScript</summary>
  <div>

```php title="Render inplace_edit with JavaScript"
$itemid = 153 // Id of the element to be modified inplace.
$renderer = $PAGE->get_renderer('core');
$inplaceedit = new tool_mytest\local\inplace_edit_text($record);
$params = $inplaceedit->export_for_template($renderer);
```

```js title="The params are transferred via webservice and are then processed by JavaScript"
Templates.renderForPromise('core/inplace_editable', params)
    .then(({html, js}) => {
        Templates.replaceNodeContents('nodeid', html, js);
        return true;
    })
    .catch((error) => displayException(error));
```

  </div>
</details>

:::note

In the examples above, `core/inplace_edit` can also be used as a partial in another template.

:::

## How does it work

`inplace_editable` consists of

- Templatable/renderable **class core\output\inplace_editable**
- Template **core/inplace_editable**
- JavaScript module **core/inplace_editable**
- Web service **core_update_inplace_editable** available from AJAX

All four call each other so it's hard to decide where we start explaining this circle of friends but let's start with web service.

1. **Web service** receives arguments (`$component`, `$itemtype`, `$itemid`, `$newvalue`) - it searches for the inplace_editable callback in the component. Then web service calls this callback as `{component}_inplace_editable($itemtype, $itemid, $newvalue)`, this must return templatable element which is sent back to the web service caller. Web service requires user to be logged in. **Any other `capability/access` checks must be performed inside the callback.**

2. **Templatable element** contains such properties as component, `itemtype`, `itemid`, `displayvalue`, `value`, `editlabel` and `edithint`. When used in a **template** It only renders the display value and the edit link (with `title=edithint`). All other properties are rendered as `data-xxx` attributes. Template also ensures that JavaScript module is loaded.

3. **JavaScript module** registers a listener to when the edit link is clicked and then it replaces the display value with the text input box that allows to edit value. When user presses "Enter" the AJAX request is called to the web service and code from the component is executed. If web service throws an exception it is displayed for user as a popup.

## Events

Plugin page can listen to JQuery events that are triggered on successful update or when update failed. Example of the listeners (as inline JS code):

```php
$PAGE->requires->js_amd_inline("
require(['jquery', 'core/local/inplace_editable/events'], function(\$, Events) {
    $('body').on(Events.eventTypes.elementUpdateFailed, '[data-inplaceeditable]', (e) => {
        // The exception object returned by the callback.
        const exception = e.exception;

        // The value that user tried to udpated the element to.
        const newvalue = e.newvalue;

        // This will prevent default error dialogue.
        e.preventDefault();

        // Do your own error processing here.
    });
    $('body').on(Events.eventTypes.elementUpdated, '[data-inplaceeditable]', (e) => {
        // Everything that web service returned.
        const ajaxreturn = e.ajaxreturn;

        // Element value before editing (note, this is raw value and not display value).
        const oldvalue = e.oldvalue;

        // Do your own stuff, for example update all other occurences of this element on the page.
    });
});
");
```

:::note

The above examples are not recommended and just give an example of how these APIs work.

:::
