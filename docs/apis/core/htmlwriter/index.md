---
title: HTML Writer API
tags:
  - API
  - HTML
  - DOM
---

Moodle has a class called _HTML writer_ which allows you to output basic HTML tags. This is typically used within renderer functions, for example `question/type/*pluginname*/renderer.php`.

:::tip

Please consider using [templates](../../../guides/templates/index.md) as an alternative to the _HTML writer_.

:::

:::note

There is no documentation for most of this class. Please read [HTML Writer Class Reference](https://phpdoc.moodledev.io/main/d4/d78/classhtml__writer.html) for further information.

:::

## Methods {/* #methods */}

### div {/* #div */}

```php
html_writer::div(content, class="", attributes="");
```

Example usage:

```php
html_writer::div('anonymous');  // <div>anonymous</div>
html_writer::div('kermit', 'frog'); // <div class="frog">kermit</div>
```

Attributes can be set by an array with key-value pairs.

```php
html_writer::div('Mr', 'toad', array('id' => 'tophat'));
// <div class="toad" id="tophat">Mr/div>
```

### span {/* #span */}

```php
html_writer::start_span('zombie') . 'BRAINS' . html_writer::end_span();
// <span class="zombie">BRAINS</span>
```

### react_component {/* #react-component */}

<Since issueNumber="MDL-89296" version="5.3" />

```php
html_writer::react_component(
    string $modulename,
    array|string|\stdClass|\JsonSerializable $props,
);
```

Render a placeholder `<div>` for a React component mount point.

The method writes:

- `data-react-component` with the module name;
- `data-react-props` containing JSON-encoded props.

:::caution[A note on React properties]

For React components we **strongly** encourage you to limit the properties to only the initial configuration and preferences.

React properties **should not** contain any data.

Historically it was often necessary to include a range of additional properties when writing Mustache template context properties because of limitations in the way that Mustache works. For example it was often necessary to provide certain strings, as well as some hard-to-fetch data. These limitations are not present in React.

:::

Example usage:

```php
html_writer::react_component(
    '@moodle/lms/core/example',
    (object) [
        'filter' => get_user_preference('tool_demo/widget_filter', 'all'),
        'limit' => get_user_preference('tool_demo/widget_result_limit', 25),
    ],
);
// <div data-react-component="@moodle/lms/core/example" data-react-props="{\"filter\":\"latest\",\"limit\":\"25\"}"></div>
```

:::note

If you are rendering a `\core\output\react_component_renderable` via `renderer_base::render()`, Moodle calls this method for you.

:::

### Generic tags {/* #generic-tags */}

```php
html_writer::tag(tag_name, contents, attributes=null);
html_writer::start_tag(tag_name, attributes=null;);
html_writer::end_tag(tag_name);
html_writer::empty_tag(tag_name, attributes=null);
html_writer::nonempty_tag(tag_name, content, attributes=null);
html_writer::attribute(name, value);
html_writer::attributes(attributes_array);
```
