---
title: Linear navigation support
tags:
  - Plugins
  - Format
  - Linear navigation
---

<Since version="5.3" issueNumber="MDL-84921" />

The linear course navigation feature provides an intuitive, forward-and-backward navigation footer within courses. It allows users to cycle through sections or activities sequentially without returning to the main page.

By default, third-party course formats do not display the linear navigation elements. To enable and support this feature within a custom course format, your plugin's format class must explicitly opt in.

## Opting into linear navigation

To support linear navigation, your course format must override the `uses_linear_navigation()` method in its format class (extending `\core_courseformat\base`).

```php title="course/format/mycustomformat/lib.php"
/**
 * Custom course format class.
 */
class format_mycustomformat extends \core_courseformat\base {
    /**
     * Determines whether the course format supports linear navigation.
     *
     * @return bool True if linear navigation is supported, false otherwise.
     */
    public static function uses_linear_navigation(): bool {
        // Return true to unconditionally enable it.
        return true;
    }
}
```

## Adding format-level configuration

If your course format requires configuration at the course settings level (similar to how `format_topics` and `format_weeks` handle it), you should integrate it into your format's native settings framework (`course_format_options`).

```php title="course/format/mycustomformat/lib.php"
    /**
     * Define the format options for a course.
     *
     * @param bool $foreditform True if it's being requested for the course edit form.
     * @return array Array of options.
     */
    public function course_format_options($foreditform = false) {
        static $courseformatoptions = false;
        // Initialise the course format options array if it hasn't been done yet with the default values.
        if ($courseformatoptions === false) {
            // Get course format's settings.
            $courseformatoptions = [];

            // Add linear navigation settings if enabled for the format.
            $courseformatoptions = array_merge(
                \core_courseformat\local\linearnavigationsettings::get_course_format_options_default(self::get_format()),
                $courseformatoptions,
            );

        }

        if ($foreditform) {
            // Get the edit form options for the format.
            $courseformatoptionsedit = [];

            // Add course format settings.

            // Append your format's explicit linear navigation setting override if desired,
            // or rely on the core 'enablelinearnav' setting configuration.
            $courseformatoptions = array_merge_recursive(
                $courseformatoptionsedit,
                \core_courseformat\local\linearnavigationsettings::get_course_format_options_edit_form(self::get_format()),
            );
        }
        return $courseformatoptions;
    }
```

:::info[Adding site-wide administration settings]

To allow administrators to enable, disable, or define the default state for linear navigation within your custom format, add the configuration option to your plugin's settings.php file.

```php title="course/format/mycustomformat/settings.php"
    $options = [
        1 => get_string('yes'),
        0 => get_string('no'),
    ];

    $settings->add(new admin_setting_configselect(
        'format_mycustomformat/enablelinearnav',
        new lang_string('linearnavigationsettings', 'core_courseformat'),
        new lang_string('linearnavigationsettings_help', 'core_courseformat'),
        1,
        $options
    ));
```

:::

## Controlling the page state rendering

The core output requirements verify format capabilities during execution. If you need to programmatically suppress or alter the navigation footer layout from specific views or custom renderers inside your format, utilise the page output control methods:

```php title="course/format/mycustomformat/mypluginpage.php"
// Explicitly suppress the navigation footer on a specific layout template
$PAGE->set_show_navigation_footer(false);
```

The following methods can be used to check the state of linear navigation and control the rendering of the navigation footer on a per-page basis:

```php title="course/format/mycustomformat/mypluginpage.php"

// Query if the navigation footer should be shown on the page.
if (\core_courseformat\local\linearnavigationsettings::show_navigation_footer($PAGE)) {
    // Custom structural adjustments
}

// Check if linear navigation is enabled for the course.
// It only checks the course format and the linear navigation format option, regardless of any
// page-level state. It is useful for activities that need to adapt their output (for example,
// hiding navigation controls of their own) when linear navigation is enabled.
$linearnavigationenabled = \core_courseformat\local\linearnavigationsettings::is_linear_navigation_enabled($course);
if ($linearnavigationenabled) {
    // Custom structural adjustments
}
```

## Behat integration

The navigation feature includes dedicated steps to validate the execution layer within your functional test suites:

```gherkin
And the course linear navigation should be visible
# Or to verify the disabled state:
And the course linear navigation should not be visible
```

## Adding supplementary content to the sticky footer

<Since version="5.3" issueNumber="MDL-88601" />

Independently of whether the current course format supports linear navigation, any part of Moodle can request additional content to be displayed in the sticky footer by calling `moodle_page->set_supplementary_content()` with an `action_link` instance:

```php
$PAGE->set_supplementary_content(
    new action_link(
        new moodle_url('/mod/forum/view.php', ['id' => $cm->id]),
        get_string('gotoalldiscussions', 'mod_forum'),
    )
);
```

When supplementary content is set, the sticky footer is displayed even if the course format does not support linear navigation, or the setting is disabled, showing only the supplementary content. If linear navigation is also enabled, both the navigation controls and the supplementary content are rendered together in the footer, separated by a border.

Use `moodle_page->get_supplementary_content()` to retrieve the current value, which returns `null` if none has been set. The value is automatically reset whenever `moodle_page->reset_theme_and_output()` is called.

This feature is used, for example, by `mod_forum` to add a "Go to all discussions" link when viewing an individual discussion.
