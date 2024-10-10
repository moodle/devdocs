---
title: Combobox searching
tags:
  - Javascript
  - AJAX
  - Searching
  - Navigation
  - UI
  - UX
  - Frontend
---

<Since versions={["4.3"]} issueNumber={"MDL-77991"} />

A combobox search component has been added to the core Moodle system. This component provides an additional layer of search functionality, allowing users to easily navigate and filter search results. The combobox search component is designed to be reusable and can be integrated into various areas of the Moodle platform.

To implement the combobox search component, follow these steps:

1. Add the necessary HTML structure for the dropdown in your template file
2. Initialize the component via PHP
3. Initialize the component using JavaScript

## Benefits

By moving the tertiary search dropdown component to the core, the Moodle development team aimed to achieve the following benefits:

- Improved consistency: Using a single, core component for the search dropdown ensures that the look and feel of this UI element remains consistent across different parts of Moodle.
- Improved code maintainability: Having the component in the core makes it easier for the development team to manage the codebase and ensure that any updates to the component are applied consistently across the entire application.
- Reduced code duplication: By making the component available to all Moodle modules, there is no need to duplicate the code in different parts of the application.

## Structure of the component

### Extending the search_combobox

If you want to get started quickly, you can extend the `search_combobox` class. This class provides a lot of the boilerplate code that you would otherwise need to write yourself. You'll also need to implement the functions that throw errors if undefined however as we need some information from you about what and how you are searching.

<details>
  <summary>View example</summary>
  <div>

```js title="path/to/plugin/amd/src/yourcomponent.js"
import search_combobox from 'core/comboboxsearch/search_combobox';

export default class extends search_combobox {
    (...)
}
```

  </div>
</details>

### Instantiate a Component

If you'll be using JS for other functionality, you can do the following:

<Tabs>
  <TabItem value="init-js-module" label="AMD module" default>

```js title="path/to/plugin/amd/src/main.js"
import YourComponent from 'YOUR_PLUGIN/yourcomponent;

(...)

export const init = () => {
    return new YourComponent({});
};

```

  </TabItem>
  <TabItem value="init-php-module" label="PHP code">

```php title="path/to/plugin/index.php"
$PAGE->requires->js_call_amd('YOUR_PLUGIN/main', 'init');
```

  </TabItem>
</Tabs>

### Initialize a component from a mustache template

Components are easy to embed in mustache files. To do so your class must have a static "init" method that could be called inside the `{{#js}}`.

<Tabs>
  <TabItem value="component-view" label="Component class" default>

```js title="path/to/plugin/amd/src/childcomponent.js"
import YourComponent from 'YOUR_PLUGIN/yourcomponent;

export default class extends YourComponent {

    constructor() {
        super();
    }

    static init() {
        return new this();
    }
}

```

  </TabItem>
  <TabItem value="mustache-view" label="Mustache file">

```handlebars title="path/to/plugin/templates/yourthing/childcomponent.mustache"
{{#js}}
    require(['YOUR_PLUGIN/local/yourthing/childcomponent'], function(component) {
        component.init();
    });
{{/js}}
```

:::tip Generating unique id attributes

You can use the `{{uniqid}}` Mustache helper within your code to help you generate a unique id for your HTML attributes and target them in your React component.

Please note that the `{{uniqid}}` helper generates a single value each time it is rendered, and you will need to combine it with other data to create a truly unique value. In this example the name of the plugin, and a static element `id` is used to generate a unique value.

:::

  </TabItem>
</Tabs>

### search_combobox helpers

The search_combobox class offers some helpers to standardize the components' code and make them more maintainable.

#### getDataset()

Calls the implemented `fetchDataset` method and returns the dataset.

#### getDatasetSize()

Returns the size of the dataset without having to call `getDataset` first.

#### getMatchedResults()

Once a result set has been filtered, this method returns the matched results based on the users search input.

#### setMatchedResults()

By default, returns the dataset but can be overridden to show how exactly a result set matched upon the data.

#### getSearchTerm()

Provide the current search term that the user entered without manually accessing the DOM.

#### getPreppedSearchTerm()

Return the parsed (lowercase) search term.

#### setSearchTerms()

When a user changes the value of the input, after we debounce, we update the search term in memory.

#### getHTMLElements()

Update and return some of the typical HTML elements that are used in the component.

#### closeSearch()

Close the associated dropdown manually since we control the dropdown rather than purely relying on Bootstrap.
We can optionally clear the users' search term.

#### searchResultsVisible()

Shorthand for confirming if the search results are currently visible.

#### toggleDropdown()

Manually open and close the dropdown rather than purely relying on Bootstrap.

#### updateNodes()

Ensure that nodes that are susceptible to change are up-to-date when we need them.

#### registerClickHandlers() {#registerClickHandlers}

Handle our base case of click handlers i.e. opening and closing the dropdown. This can be further extended in callers for any special handling.

#### registerKeyHandlers() {#registerKeyHandlers}

Handle our base case of keyboard handlers i.e. opening and closing the dropdown, accessibility handling. This can be further extended in callers for any special handling.

#### registerInputHandlers() {#registerInputHandlers}

Register the text input handlers for the search input and debounce the input so that we don't need to fire a bunch of calls as the user is still typing.
<!-- cspell:ignore filterrenderpipe -->
#### filterrenderpipe()

Combine the filter and render methods into a single method to be called by the input handlers as a QoL shorthand call.

#### renderAndShow() {#renderAndShow}

Given we need to update the display, ensure we have the latest dataset and render it.

#### keyUpDown() {#keyUpDown}

Given the user is navigating the dropdown with the keyboard, handle the common up and down arrow key cases.

#### clickHandler() {#clickHandler}

Used within [registerClickHandlers](#registerClickHandlers) to handle the common click cases like selecting results, closing the dropdown, etc.

#### keyHandler() {#keyHandler}

Used within [registerKeyHandlers](#registerKeyHandlers) to handle the common keyboard cases like navigating nodes, closing the dropdown, etc.

#### selectNode()

When used in conjunction with [keyUpDown](#keyUpDown) and other similar functions, this function will select the node that the user has navigated to.

#### moveToFirstNode()

When used in conjunction with [keyUpDown](#keyUpDown) and other similar functions, this function will move the user to the first node in the dropdown.

#### moveToLastNode()

When used in conjunction with [keyUpDown](#keyUpDown) and other similar functions, this function will move the user to the last node in the dropdown.

#### moveToNode()

When used in conjunction with [keyUpDown](#keyUpDown) and other similar functions, this function will move the user to the node that is passed in.

### Required functions to implement

We bootstrap a lot of the functionality within the component but there are some functions that you will need to implement yourself.
This is because we don't know what your data looks like, how you want to filter it, etc.

#### fetchDataset()

Implementors should return a dataset that will be used to filter and render the results, this can be provided as a promise or a synchronous call.

#### filterDataset(dataset)

Implementors should return a filtered dataset based on the search term that the user has entered, this is entirely up to your as long as you set the results.

#### filterMatchDataset()

This can either just return the base dataset or you can use it to mutate the dataset to show how the results matched the search term i.e. adding links and whatnot.

#### renderDropdown()

Where and how do you want the data to be rendered? This is entirely up to you.

#### componentSelector()

We need to know where to find the component in the DOM, this is the selector that will be used to find the component.

#### dropdownSelector()

We need to know where to find the dropdown in the DOM, this is the selector that will be used to find the dropdown.

#### triggerSelector()

We need to know where to find the trigger in the DOM, this is the selector that will be used to find the trigger.

For example usages view the [examples](comboboxsearch/examples) page.
