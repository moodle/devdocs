---
title: Moodle 4.5 developer update
tags:
- Core development
- Moodle 4.5
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 4.5 for developers.

## Badges

### Deprecated `badges/newbadge.php`

<Since version="4.5" issueNumber="MDL-43938" />

The `badges/newbadge.php` and `badges/edit.php` pages have been combined to make things easier to maintain since both were pretty similar (`newbadge.php` for creating badges and `edit.php` for editing them).

As a result, `badges/newbadge.php` is now deprecated and will be removed in Moodle 6.0. Please update your code to use `badges/edit.php` instead.

:::info

Visiting

https://yourmoodlesite/badges/newbadge.php?id=x

will now automatically redirect to

https://yourmoodlesite/badges/edit.php?courseid=x&mode=new

:::

### Deprecated `badges/view.php`

<Since version="4.5" issueNumber="MDL-82503" />

The `badges/index.php` and `badges/view.php` pages have been combined to make things easier to maintain since both were pretty similar and the workflow for accessing badges from the course page was confusing in some cases.

As a result, `badges/view.php` is now deprecated and will be removed in Moodle 6.0. Please update your code to use `badges/index.php` instead.

Apart from that, the `course_badges` system report has been merged with `badges` system report. It has been deprecated too and will be removed in Moodle 6.0. Please update your code to use `badges` system report instead.

:::info

Visiting

https://yourmoodlesite/badges/view.php?type=x&id=x

will now automatically redirect to

https://yourmoodlesite/badges/index.php?type=x&id=x

:::

## Core changes

### Autoloader

#### `ABORT_AFTER_CONFIG`

<Since version="4.5" issueNumber="MDL-80275" />

Prior to Moodle 4.5 only a small number of classes were compatible with scripts using the `ABORT_AFTER_CONFIG` constant.

MDL-80275 modifies the location of the class Autoloader in the Moodle bootstrap to make it available to scripts using the `ABORT_AFTER_CONFIG` constant.

:::note

Please note that the same limitations regarding access to the Database, Session, and similar resources still exist.

:::

#### Autoloading legacy classes

<Since version="4.5" issueNumber="MDL-81919" />

The Moodle class autoloader is now able to load legacy classes defined in the relevant `db/legacyclasses.php`. Files should only contain a single class.

```php title="Example entry in lib/db/legacyclasses.php"
$legacyclasses = [
    // The legacy \moodle_exception class can be loaded from lib/classes/exception/moodle_exception.php.
    \moodle_exception::class => 'exception/moodle_exception.php',

    // The legacy \cache class can be loaded from cache/classes/cache.php.
    \cache::class => [
        'core_cache',
        'cache.php',
    ],
];
```

See MDL-81919 for further information on the rationale behind this change.

### SMS API

A new SMS API was introduced. See the [SMS API documentation](./apis/subsystems/sms/index.md) for more information.

## Course

### Reset course page

The reset course page has been improved. The words "Delete", and "Remove" have been removed from all options to make it easier to focus on the type of data to be removed and avoid inconsistencies and duplicated information.
Third party plugins implementing reset methods might need to:

- Add static element in the `_reset_course_form_definition` method before all the options with the `Delete` string:

    ```php
    $mform->addElement('static', 'assigndelete', get_string('delete'));
    ```

- Review all the strings used in the reset page to remove the `Delete` or `Remove` words from them.

:::caution

Starting from Moodle 4.5, the Reset course page form defined in the `_reset_course_form_definition` method should be reviewed because their options should not contain the `Delete` or `Remove` words.
Check changes in any of the core plugins that implement the reset course method.

:::

## Deprecations

### Icon deprecation

<Since version="4.5" issueNumber="MDL-82212" />

A new mechanism for deprecating icons has been introduced. More information can be found in the [icon deprecation documentation](/general/development/policies/deprecation/icon-deprecation).

## Filter Plugins

<Since version="4.5" issueNumber="MDL-82427" />

Filter plugins and the Filter API have been updated to use the standard Moodle Class Autoloading infrastructure.

To ensure that your plugin continues to work in Moodle 4.5, you should move the `filter_[pluginname]` class located in `filter/[pluginname]/filter.php` to `filter/[pluginname]/classes/text_filter.php`, setting the namespace to `filter_[pluginname]` and renaming the class to `text_filter`.

:::tip Codebases supporting multiple versions of Moodle

If your codebase also supports Moodle 4.4 and earlier then you will also need to create a file in the 'old' location (`filter/[pluginname]/filter.php`) with the following content:

```php title="filter/[pluginname]/filter.php"
class_alias(\filter_[pluginname]\text_filter::class, \filter_[pluginname]::class);
```

This will ensure that the plugin class is available at both the old and new locations.

:::

## TinyMCE plugins

The `helplinktext` language string is no longer required by editor plugins, instead the `pluginname` will be used in the help dialogue

## Theme

### Context header

<Since version="4.5" issueNumber="MDL-82160" />

The method `core_renderer::render_context_header($contextheader)` has been deprecated, `core_renderer::render($contextheader)` should be used instead.

Plugins can still modify the context header by:

- Overriding `core_renderer::context_header()` method in their class extending `core_renderer`
- Adding `core_renderer::render_context_header()` method to their class extending `core_renderer`
- Overriding the `core/context_header.mustache` template

<Tabs>

<TabItem value="context_header" label="context_header()">

```php title="theme/example/classes/output/core_renderer.php"
class core_renderer extends \core_renderer {
    [...]
    public function context_header($headerinfo = null, $headinglevel = 1): string {
        $output = parent::context_header($headerinfo, $headinglevel);
        return $output . '<div class="badge badge-info">Hi!</div>';
    }
    [...]
}
```

</TabItem>

<TabItem value="render_context_header" label="render_context_header()">

```php title="theme/example/classes/output/core_renderer.php"
class core_renderer extends \core_renderer {
    [...]
    protected function render_context_header(\context_header $contextheader) {
        $context = $contextheader->export_for_template($this);
        $output = $this->render_from_template('core/context_header', $context);
        return $output . '<div class="badge badge-info">Hi!</div>';
    }
    [...]
}
```

</TabItem>

<TabItem value="template" label="Template">

```mustache title="theme/example/templates/core/context_header.mustache"
{{!
    @template core/context_header

    Template context_header

    Example context (json):
    {
    }
}}
<div class="badge badge-info">Hi!</div>
```

</TabItem>

</Tabs>

### Refactoring BS4 features dropped in BS5 using a "bridge"

<Since version="4.5" issueNumber="MDL-79917" />

Some of the Bootstrap 4 classes will be deprecated or dropped in its version 5. To prepare for this, some of the current Bootstrap 4 classes usages have been replaced with version 5 compatible classes using a "bridge". This will help us to upgrade to Bootstrap 5 in the future.

See more information in [Bootstrap 5 migration](./guides/bs5migration/index.md).

### Support FontAwesome families

<Since version="4.5" issueNumber="MDL-82210" />

Upon upgrading Font Awesome (FA) from version 4 to 6, the solid family was selected by default. However, FA6 includes additional families such as regular and brands. Support for these families has now been integrated, allowing icons defined with `icon_system::FONTAWESOME` to use them.
Icons can add the FontAwesome family (`fa-regular`, `fa-brands`, `fa-solid`) near the icon name to display it using this styling:

```php title="Example of FA families from lib/classes/output/icon_system_fontawesome.php"
            'core:i/rss' => 'fa-rss',
            'core:i/rsssitelogo' => 'fa-graduation-cap',
            'core:i/scales' => 'fa-scale-balanced',
            'core:i/scheduled' => 'fa-regular fa-calendar-check',
            'core:i/search' => 'fa-magnifying-glass',
            'core:i/section' => 'fa-regular fa-rectangle-list',
            'core:i/sendmessage' => 'fa-regular fa-paper-plane',
            'core:i/settings' => 'fa-gear',
            'core:i/share' => 'fa-regular fa-share-from-square',
            'core:i/show' => 'fa-regular fa-eye-slash',
            'core:i/siteevent' => 'fa-solid fa-globe',

```

### FontAwesome icons updated

<Since version="4.5" issueNumber={"MDL-77537"} />

The icons in Moodle core have been updated according to the UX team's specifications in MDL-77754. The team reviewed and proposed updates to leverage the new icons in Font Awesome 6, ensuring greater consistency.

In addition to updating the icons, the following changes have been made:

- The SVG files have been updated to SVG FA6 for better alignment and improved appearance.
- PNG, JPG, and GIF files have been removed from the repository where possible, leaving only SVG files to simplify maintenance.

For third-party plugins utilizing their own icons via the callback `get_fontawesome_icon_map()`, it is advisable to review and align these icons with the core icons for consistency. Here are some guidelines followed by the UX team that may be useful:

- The pencil icon has been replaced by a pen.
- The cog icon is used exclusively for settings; otherwise, use the pen icon.
- Import/Upload actions should use the `fa-upload` icon, while Export/Download actions should use the `fa-download` icon.
- The eye icon is used for both visibility and preview actions.

:::tip Icons in Component library

On the Icons page of the [Component library](/general/development/tools/component-library), you can find a comprehensive list of all the icons available in Moodle core.

:::
