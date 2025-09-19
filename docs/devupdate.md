---
title: Moodle 5.1 developer update
tags:
- Core development
- Moodle 5.1
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 5.1 for developers.

## Code Structure

<Since version="5.1" issueNumber="MDL-83424" />

Most of the Moodle codebase, including all plugins, has been moved into a new `public` directory within the Moodle web root.

Most Moodle tooling has already been updated to support this, but minor web server reconfiguration will be required to support this.

See the [Restructure documentation](./guides/restructure/index.md) for further information on some of the changes required.

## Course format: activity chooser is now in core_courseformat

<Since version="5.1" issueNumber="MDL-85597" />
The activity chooser logic and templates have been relocated from `core_course` to `core_courseformat`. This change may impact themes that override the activity chooser rendering, but it also enables format plugins to provide custom outputs and templates for activity chooser elements, similar to other course content components. For details on how format can override outputs, see the [overriding output classes from course format plugin page](http://localhost:3000/docs/5.1/apis/plugintypes/format#override-output-classes).s

**How to check if your plugin is affected:**

For theme plugins, review whether any of the following templates are overridden:

- `core_course/activitychooser` (now in `core_courseformat/activitychooser`)
- `core_course/activitychooserbutton` (now in `core_courseformat/local/content/activitychooserbutton`)
- Any template in `core_course/local/activitychooser` (now in `core_courseformat/local/activitychooser`)

Additionally, renderer methods for loading the activity chooser have changed. Check if your format or theme overrides the following method:

- `core_course_renderer::course_activitychooser` (no longer used)

**What you need to do:**

- Move any overridden templates or AMD modules to their new locations in `core_courseformat`.
- Follow any deprecation notices for the activity chooser.

## Course format: activity chooser footer has been changed

<Since version="5.1" issueNumber="MDL-85597" />

The activity chooser UI now features a dedicated footer button for adding the selected activity to the course. The logic for managing the activity chooser footer has moved to `course/amd/src/local/activitychooser/dialogue.js`, which now controls the visibility of the back and add buttons based on the modal's content. This update may impact plugins that implement custom activity chooser footers.

**How to determine if your plugin is affected:**

- Check if your plugin provides a `custom_chooser_footer` implementation. You can do this by searching your plugin's `lib.php` for a function named `PLUGINTYPE_PLUGINNAME_custom_chooser_footer`.
- If your plugin implements this function, review your footer AMD module to see if it calls `modal.setFooter(...)`. To identify the AMD module, look at the first parameter passed when creating a new `core_course\local\entity\activity_chooser_footer` instance in your `custom_chooser_footer` function—this is the `$footerjspath`.

**What you need to do:**

- In most cases, simply remove the `modal.setFooter(...)` call from your AMD module, as the new activity chooser footer now manages this logic for you.
- For more advanced customizations, ensure you use the `course/templates/local/activitychooser/footer.mustache` template to render your custom footer content.

## Course format: max sections setting is now deprecated

<Since version="5.1" issueNumber="MDL-84291" />

The `maxsections` setting in course formats is now deprecated. Previously, this setting was used to limit the number of sections in a course. Starting with Moodle 5.1, courses can have an unlimited number of sections.

Although the `maxsections` setting remains available for now, it is marked as deprecated and will be removed in Moodle 6.0. Also, the `get_max_sections` from `core_courseformat\base` is also deprecated and will be removed in Moodle 6.0.

If your format plugin relies on `maxsections`, you should add a custom setting in your plugin to control section limits. For reference, see the week format plugin, which now uses its own setting for this functionality.

## Course format: new activity chooser rendering

<Since version="5.1" issueNumber="MDL-80295" />

The activity chooser in course formats has been refactored to use a new rendering approach. It now includes additional attributes such as `data-section-id` and `data-returnsectionid`, and the course renderer method for the activity chooser has changed.

This update primarily affects format plugins that customize section or activity card rendering. If your plugin calls `course_section_add_cm_control`, you should update it to use the new `section_add_cm_controls` method.

For themes that override activity chooser templates, ensure that the activity chooser button includes the required `data-section-id` and the `data-returnsectionid` attributes.
