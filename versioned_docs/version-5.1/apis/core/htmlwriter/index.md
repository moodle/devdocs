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

## Methods

### div

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

### span

```php
html_writer::start_span('zombie') . 'BRAINS' . html_writer::end_span();
// <span class="zombie">BRAINS</span>
```

### Generic tags

```php
html_writer::tag(tag_name, contents, attributes=null);
html_writer::start_tag(tag_name, attributes=null;);
html_writer::end_tag(tag_name);
html_writer::empty_tag(tag_name, attributes=null);
html_writer::nonempty_tag(tag_name, content, attributes=null);
html_writer::attribute(name, value);
html_writer::attributes(attributes_array);
```
