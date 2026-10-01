---
title: Linear navigation support
tags:
  - Plugins
  - Format
  - Activity
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

## Next and previous activity navigation

<Since version="5.2" issueNumber="MDL-87467" />

The "Previous" and "Next" controls displayed on an activity page do not link to the target activity directly. Instead, they link to two routes handled by the `\core_course\route\controller\course_navigation` controller (`/cms/{cm}/previous` and `/cms/{cm}/next`), which calculate the destination when the link is followed and then redirect the user.

This means the destination is always calculated with the current user's access rules, and it also means that these links require the [routing system](../../subsystems/routing/index.md) to be configured.

If you need to build these links yourself, obtain them from the routing subsystem instead of hard-coding any path:

```php
$nexturl = \core\router\util::get_path_for_callable(
    [\core_course\route\controller\course_navigation::class, 'cm_next_element'],
    ['cm' => $cm->id],
);
```

### Activities skipped by the navigation

When resolving the destination, the controller walks through the ordered list of activities of the current section (activities inside subsections are included, in the position where the subsection appears) and redirects to the first one considered navigable. An activity is skipped when:

- it has no navigation URL, either because it has no view page (such as Label), or because the activity has explicitly suppressed it (see [Overriding the navigation URL](#overriding-the-navigation-url-of-an-activity));
- it is not visible on the course page for the current user (`cm_info::is_visible_on_course_page()`);
- it is a stealth activity and the user does not have the `moodle/course:viewhiddenactivities` capability;
- its module type does not support `FEATURE_CAN_DISPLAY`, checked via `\core_course\modinfo::is_mod_type_visible_on_course()` ([MDL-88003](https://moodle.atlassian.net/browse/MDL-88003)). This is the case, for instance, of the Question bank activity.

When no navigable activity is left in the section, the user is redirected to the next or previous available section page, and finally to the course page when there is nothing else to navigate to.

### Overriding the navigation URL of an activity

<Since version="5.2" issueNumber="MDL-87984" />

Activity modules can define a navigation URL which is different from the URL used to link the activity on the course page. This is useful when the standard activity link takes the user out of the course, but the linear navigation should keep them inside it.

The following `\core_course\cm_info` methods are available:

| Method | Description |
| --- | --- |
| `get_navigation_url(): ?url` | Returns the navigation URL of the activity. When no override has been set, it falls back to `get_url()`. |
| `set_navigation_url(?url $navigationurl): void` | Sets the navigation URL. Passing `null` removes the activity from the linear navigation flow. |
| `reset_navigation_url(): void` | Discards any override, so `get_navigation_url()` falls back to `get_url()` again. |

The value is also available through the read-only `navigationurl` magic property, in the same way as the existing `url` property:

```php
$modinfo = get_fast_modinfo($course);
$cm = $modinfo->get_cm($cmid);
$navigationurl = $cm->navigationurl;
```

Overrides are normally defined in the `MODNAME_cm_info_dynamic()` callback of your plugin's `lib.php`. For example, both `mod_resource` and `mod_url` append the `forceview` parameter so that, when the activity is configured to open in a new window or in a popup, the linear navigation still renders the activity view page in the current window:

```php title="mod/mymodule/lib.php"
/**
 * Sets dynamic information about a course module.
 *
 * @param cm_info $cm
 */
function mod_mymodule_cm_info_dynamic(cm_info $cm) {
    // Update the navigation URL to guarantee the user will see the content even if the module
    // is set to open in a new window or popup.
    $cm->set_navigation_url(
        new \core\url($cm->get_navigation_url(), ['forceview' => 1])
    );
}
```

:::caution

`set_navigation_url()` and `reset_navigation_url()` cannot be called from the `MODNAME_cm_info_view()` callback, because the navigation URL is also used on pages other than the course page. Doing so throws a `coding_exception`. Use `MODNAME_cm_info_dynamic()` instead.

Bear in mind that `MODNAME_cm_info_dynamic()` runs on every page of the course, so it must not perform database queries or any other slow operation.

:::

### Excluding an activity from the linear navigation

To keep an activity out of the linear navigation flow entirely, set its navigation URL to `null`:

```php title="mod/mymodule/lib.php"
function mod_mymodule_cm_info_dynamic(cm_info $cm) {
    // This activity should never be a "Previous" or "Next" destination.
    $cm->set_navigation_url(null);
}
```

The "Previous" and "Next" controls then skip the activity and move to the closest navigable one. This only affects the linear navigation: the activity is still displayed on the course page, in the course index, and in other navigation elements, and its own `url` remains unchanged.

Users viewing such an activity directly still get working "Previous" and "Next" controls, as the exclusion only applies when the activity is evaluated as a possible destination.

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
