---
title: Filter plugins
tags:
  - Filter
  - Plugins
---

<!-- cspell:ignore filtername -->
<!-- cspell:ignore strpos -->
<!-- cspell:ignore localconfig -->
<!-- cspell:ignore filterlocalsettings -->

import {
    DbAccessPHP,
    Lang,
    Lib,
    VersionPHP,
} from '../../_files';

import {
    ComponentFileSummary,
} from '../../../_utils';

Filters are a way to automatically transform content before it is output. Filters may be used to:

- Render embedded equations to images (the TeX filter).
- Automatically convert links to media files to embedded players.
- Automatically convert mentions of glossary terms to links.

Filters are one of the easiest types of plugin to create.

Filters are applied to content passed into the `format_string()` and `format_text()` functions, which are part of the [Output API](../subsystems/output).

## File structure

Filter plugins are located in the `/filter` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `filter_pluginname` plugin.</summary>

```console
 filter/pluginname/
 |-- lang
 |   `-- en
 |       `-- filter_pluginname.php
 |-- filter.php
 `-- version.php
```

</details>

Some of the important files for the filter plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### filter.php

import Filter from '!!raw-loader!./_examples/filter.php';

<ComponentFileSummary
    required
    filepath="/filter.php"
    summary="Filter main class"
    plugintype="filter"
    pluginname="pluginname"
    example={Filter}
    description="The filter file contains the code for the main filter class. Unlike more complex plugins like activities or repositories, filters only have one mandatory class extending the core moodle_text_filter class."
/>

### version.php

<VersionPHP
    plugintype="filter"
/>

### lang/en/filter_pluginname.php

<!-- markdownlint-disable-next-line MD038 -->
export const langExample = `
 $string['filtername'] = 'Activity names auto-linking';
`;

<Lang
    plugintype="filter"
    pluginname="pluginname"
    example={langExample}
/>

## Test a filter

To enable a filter, go to the [filters administration screen](./index.md) and set the filter active to "On".

Filters are applied to all text that is printed with the output functions `format_text()` and `format_string()`. To see a filter in action, add some content to a label resource. When you look at that course in the course listing, you should see that your filter has transformed the text accordingly.

## Filter performance

It is important to note that all active filters will be called to transform every bit of text output using `format_text()` (headers and content), and `format_string()` (headers only). As a result a filter plugin can cause big performance problems. It is extremely important to use cache if your filter must retrieve data from the database, or other similar sources.

If a filter uses a special syntax or it is based on an appearance of a substring in the text, it is recommend to perform a quick and cheap `strpos()` search first prior to executing the full regex-based search and replace.

<details>
  <summary>View example</summary>
  <div>

```php
/**
 * Example of a filter that uses <a> links in some way.
 */
public function filter($text, array $options = []) {

    if (!is_string($text) or empty($text)) {
        // Non-string data can not be filtered anyway.
        return $text;
    }

    if (stripos($text, '</a>') === false) {
        // Performance shortcut - if there is no </a> tag, nothing can match.
        return $text;
    }

    // Here we can perform some more complex operations with the <a>
    // links in the text.
}
```

  </div>
</details>

## Local configuration

Filters can use different configuration depending on the context in which they are called. For example, the glossary filter can be configured such that when displayed in Forum A it only links words from a particular glossary, while in Forum B it links words from a different glossary..

To support this behaviour, a filter plugin must provide a `filterlocalsettings.php` file which defines a Moodle form which subclasses the `filter_local_settings_form` class. In addition to the standard formslib methods, you must also define a `save_changes` method.

<details>
  <summary>View example</summary>
  <div>

```php title="filterlocalsettings.php"
class pluginfile_filter_local_settings_form extends filter_local_settings_form {
    protected function definition_inner(\MoodleQuickForm $mform) {
        $mform->addElement(
            'text',
            'word',
            get_string('word', 'filter_helloworld'),
            ['size' => 20]
        );
        $mform->setType('word', PARAM_NOTAGS);
    }
}
```

  </div>
</details>

All the local configurations can be accessed in the main filter class in the `$this->localconfig` property.

<details>
  <summary>View example</summary>
  <div>

```php title="filter.php"
<?php
class filter_helloworld extends moodle_text_filter {
    public function filter(string $text, array $options = []) {
        global $CFG;
        $search = $this->localconfig['word'] ?? 'default';
        return str_replace($search, "Hello $search!", $text);
    }
}
```

  </div>
</details>

## Filtering dynamic content

It is possible that page content is loaded by ajax after the page is loaded. In certain filter types (for example MathJax) JavaScript is required to be run on the output of the filter in order to do the final markup. For these types of filters, a JavaScript event is triggered when new content is added to the page (the content will have already been processed by the filter in php). The JavaScript for a filter can listen for these event notifications and reprocess the affected dom nodes.

The content updated event is registered in the `core_filters/events` module and can be imported as:

```js
import {eventTypes} from 'core_filters/events';

document.addEventListener(eventTypes.filterContentUpdated, eventHandler);
```

<details>
  <summary>View example</summary>
  <div>

import DynamicContent from '!!raw-loader!./_examples/dynamic.js';

<CodeBlock language="js">{DynamicContent}</CodeBlock>

  </div>
</details>
