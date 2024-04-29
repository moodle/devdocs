---
title: Exception Tracing
tags:
  - tools
  - debugging
  - exceptions
---

<Since versions={["4.4"]} issueNumber={"MDL-79974"} />

Exceptions, and errors are a fact of life as a developer, and dealing with them in development should be as easy and painless as possible.

From Moodle 4.4 onwards Moodle can use the [whoops library](https://github.com/filp/whoops) to display most Exceptions to developers.

The library is included with Composer, in the same way that other developer-only features are included, and is only enabled when debugging modes are enabled. It can also be disabled as a developer preference.

The whoops UI is only used when the following conditions are met:

- `$CFG->debugdisplay` is `true`;
- the script is not:
  - a CLI script using the `CLI_SCRIPT` constant
  - an AJAX script using the `AJAX_SCRIPT` constant
- the error is not accessed:
  - during a PHPUnit test; or
  - during a Behat run.
- the `$CFG->debug_developer_use_pretty_exceptions` value is not `false`
- the whoops library is available (using `composer install`)

## Debugging messages

Moodle typically show debugging messages created with the `debugging()` method inline, however this can be easy to miss.

If Whoops is configured then `debugging()` messages will instead trigger an error and be shown using the Whoops UI.

This can be controlled using the `$CFG->debug_developer_debugging_as_error` setting.

## Configuration

The use of whoops, and some features of it, are configurable to suit your personal preferences.

### Disabling the UI

If you do not wish to use the whoops interface you can disable it by setting the following:

```php title="config.php"
// Do not use Pretty Exception in the UI.
$CFG->debug_developer_use_pretty_exceptions = false;
```

### Configuring the "Open" links for your preferred editor

The whoops UI can be configured to allow you to easily open files in your preferred editor using the "Open file" link in the UI. This can be configured in Moodle using the `$CFG->debug_developer_editor` property.

The following editors are available as standard:

- emacs
- idea
- macvim
- phpstorm
- sublime
- textmate
- xdebug
- vscode
- atom
- espresso
- netbeans

For example:

```php title="config.php"
$CFG->debug_developer_editor = 'vscode';
```

:::tip Adding your own editor

If your editor is not included in this list, but does support opening files using a URI handler then you can specify a callable which returns the URI, for example:

```php title="config.php"
$CFG->debug_developer_editor = fn ($file, $line) => "whatever://open?file=$file&line=$line";
```

For full documentation on this feature, see the [whoops documentation](https://github.com/filp/whoops/blob/master/docs/Open%20Files%20In%20An%20Editor.md).

:::

### Treating debugging as an error

In normal circumstances Moodle will treat all calls to `debugging()` as an informational message which is shown inline in the page body.

You may wish to treat these as Errors instead, especially when updating code between Moodle versions.

The default behaviour for `debugging()` is:

- if the whoops UI is installed, and available, then treat `debugging()` as an Error;
- otherwise treat `debugging()` as an informational message only.

Thi scan be further configured by setting the `$CFG->debug_developer_debugging_as_error` property:

- `$CFG->debug_developer_debugging_as_error = true;` - always treat debugging calls as an error, whether whoops is available or not;
- `$CFG->debug_developer_debugging_as_error = false;` - never treat debugging calls as an Error, even when whoops is available.

<!-- cspell:ignore macvim,textmate -->
