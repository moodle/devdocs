---
title: Testing
tags:
 - editor_tiny
 - tiny
 - Editor
 - Behat
 - Testing
---

Testing is an important part of development and we strongly encourage you to write appropriate tests for your plugins.

:::note

When writing tests which only _use_ a text editor, and are not either tests specifically for that editor, or one of its plugins, you should attempt not to use editor-specific tests.

:::

## Behat

### Tags

If you are writing a test for the TinyMCE editor, please note that your test **must** have one or more of the following Behat tags:

- `@editor_tiny`
- `@tiny_[pluginname]`

By using these tags appropriately, Moodle will ensure that TinyMCE is set as the default editor for the site for the duration of your test, regardless of any other editors installed.

### Useful steps

A number of useful Behat steps have been defined in [TinyMCE Behat context](https://github.com/moodle/moodle/blob/main/lib/editor/tiny/tests/behat/behat_editor_tiny.php).

:::caution Use generic steps where possible

Typically, when interacting with an Editor, you should use the _generic_ step definitions rather than writing specific steps, or writing sequences of steps to do so.

:::

#### Generic steps to interact with editors

Most of these steps are defined in the [Behat Forms context](https://github.com/moodle/moodle/blob/main/lib/tests/behat/behat_forms.php) and this documentation should not be treated as a complete list, rather an indication of approaches that you may consider taking.

##### Setting content of a field

```gherkin title="Set the content of the field with the label 'Description'"
Given I set the field "Description" to "<p>Some value which includes valid HTML</p>"
Given I set the field "Description" to multiline:
"""
<p>Some value which includes valid HTML</p>
"""
```

```gherkin title="Set the content of the field with the label 'Description' within the 'Create event' modal"
Given I set the field "Description" in the "Create event" "dialogue" to "<p>Some value which includes valid HTML</p>"
```

```gherkin title="Set the content of the field with the label 'Description' along side some other fields"
Given I set the following fields to these values:
  | Name        | Some name here                              |
  | Description | <p>Some value which includes valid HTML</p> |
```

```gherkin title="Set the content of the field with the label 'Description' along side some other fields within the 'Create event' modal"
Given I set the following fields in the "Create event" "dialogue" to these values:
  | Name        | Some name here                              |
  | Description | <p>Some value which includes valid HTML</p> |
```

##### Checking the content of a field

```gherkin title="Check that the content of the field with the label 'Description' matches a value"
Then the field "Description" matches value "<p>Some value which includes valid HTML</p>"
Then the field "Description" matches multiline:
"""
<p>Some value which includes valid HTML</p>
"""
```

```gherkin title="Check that the content of the field with the label 'Description' does not match a value"
Then the field "Description" does not match value "<p>Some value which includes valid HTML</p>"
```

```gherkin title="Check that the content of the field with the label 'Description' within the 'Create event' modal matches a value"
Then the field "Description" in the "Create event" "dialogue" matches value "<p>Some value which includes valid HTML</p>"
```

```gherkin title="Check that the content of a set of fields match values"
Then the following fields match these values:
  | Name        | Some name here                              |
  | Description | <p>Some value which includes valid HTML</p> |
```

```gherkin title="Check that the content of a set of fields within the 'Create event' modal match values"
Then the following fields in the "Create event" "dialogue" match these values:
  | Name        | Some name here                              |
  | Description | <p>Some value which includes valid HTML</p> |
```

#### TinyMCE specific steps

If you are writing a TinyMCE plugin or feature, then you may need to interact with the editor interface, or to check and set the current value of the editor.

:::note iFrames

Behat makes use of WebDriver to control browsers. The WebDriver specification limits the scope of a command to the current _context_ where a context is a browser Window, Frame, or iFrame.

TinyMCE places the Editor UI within its own iFrame. To control any of its interface, you _may_ need to switch to the iFrame for your editor first.

Most of the steps written for TinyMCE are already aware of the iFrame.

:::

##### Working with toolbar buttons

```gherkin title="Expanding all toolbar buttons"
Given I expand all toolbars for the "Description" TinyMCE editor
```

:::caution

The default TinyMCE configuration will automatically collapse the toolbar to show as many elements as will fit on the page.

You should always use the "I expand all toolbars" step before interacting with a button on the toolbar as it may not be visible in all cases.

This step is safe to call if the toolbar is already expanded, or does not need to be expanded.

:::

```gherkin title="Clicking on a button for your editor"
When I click on the "Bold" button for the "Description" TinyMCE editor
```

```gherkin title="Checking the state of a button in your editor"
Then the "Bold" button of the "Description" TinyMCE editor has state "true"
```

##### Working with the menu bar

```gherkin title="Clicking on a menu bar button"
I click on the "Insert" menu item for the "Description" TinyMCE editor
```

```gherkin title="Clicking on a nested menu bar button"
I click on the "Insert > Image" menu item for the "Description" TinyMCE editor
```

##### Selecting content

```gherkin title="Selecting content by tag name and index"
I select the "p" element in position "2" of the "Description" TinyMCE editor
```

```gherkin title="Selecting content using a selector and type"
I select the ".example_placeholder" "css_element" in the "Description" TinyMCE editor
```

:::note

All content selection is performed within the context of the editor's own iframe. Please note that some of the standard Behat locators will not work as they expect certain elements to be present within the page body.

:::

### Writing your own steps

If you are writing your own steps, then we recommend that you:

- include the name of your plugin, or "TinyMCE editor" in the wording of the step so that it is not mis-used for another purpose
- check that the Feature, or Scenario, includes the frankenstyle component name for your plugin

```php title="Checking for a tag on your Feature or Scenario"
if (!$this->has_tag('tiny_myplugin')) {
    throw new DriverException(
        'This step must have the @tiny_myplugin tag on either the Feature, or the Scenario.'
    );
}
```

### Important notes

Some of these steps will be improved in coming changes. See MDL-75926 and MDL-76853 for more information.
