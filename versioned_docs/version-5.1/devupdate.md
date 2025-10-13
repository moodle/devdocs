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

## Course: activity chooser footer has been changed

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
