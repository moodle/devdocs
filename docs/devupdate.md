---
title: Moodle 5.3 developer update
tags:
- Core development
- Moodle 5.3
---

{/* <!-- markdownlint-disable no-inline-html --> */}

This page highlights the important changes that are coming in Moodle 5.3 for developers.

## Linear navigation support

<Since version="5.3" issueNumber="MDL-84921" />

Moodle 5.3 introduces support for sequential linear navigation controls within course views. By default, third-party course formats do not display linear navigation elements. To explicitly opt in and declare support for this feature, course formats must override the `uses_linear_navigation()` method.

Activity modules can also take part in this navigation: the `\core_course\cm_info` class provides `get_navigation_url()`, `set_navigation_url()`, and `reset_navigation_url()` methods so a module can override the URL the "Previous" and "Next" controls lead to, or remove itself from the navigation flow altogether.

For a comprehensive integration guide, structural configuration examples, and page-state API controls, see the [Linear navigation support guide](./apis/plugintypes/format/linear_navigation.md).

## Supplementary content in the sticky footer

<Since version="5.3" issueNumber="MDL-88601" />

The `moodle_page` class now includes `set_supplementary_content()` and `get_supplementary_content()` methods, allowing any part of Moodle to inject an `action_link` as supplementary content into the sticky footer, regardless of whether the current course format supports linear navigation.

For instance, `mod_forum` uses this new mechanism to display a "Go to all discussions" link in the sticky footer when viewing an individual discussion.

For more information, see the [Adding supplementary content to the sticky footer](./apis/plugintypes/format/linear_navigation.md#adding-supplementary-content-to-the-sticky-footer) section.

## Light and dark colour modes in Boost

<Since version="5.3" issueNumber="MDL-68037" />

The Boost theme can now render a site in either a light or a dark colour mode, built on the Bootstrap 5.3 colour modes API. The mode in use is written to the `data-bs-theme` attribute of the `html` tag, and `theme_boost\colour_mode` is the entry point for reading or rendering it. People choose their own mode from a switcher in the navbar, offering Light, Dark and System.

The feature is experimental, so it is off until a site turns on **Enable colour modes** on the new **Experimental settings** tab of the Boost settings, which is also where the site default mode is chosen. Nothing about an existing site changes on upgrade.

Boost and the core interface follow the mode, but **a plugin only follows it if its own styles take their colours from the theme**. A colour written as a literal in a plugin's `styles.css` keeps that value in both modes, which usually means a light island on a dark page, or text which cannot be read against the surface behind it. Styles work in both modes if they take their colours from the Bootstrap custom properties, the Moodle Design System tokens, or the equivalent utility classes, all of which change with the mode.

The Behat CLI tools also take a `--colourmode` option, so that a whole run can be exercised in a given mode.

For what to check in your plugin, the properties and tokens to use, and how to test in both modes, see the [Colour modes guide](./guides/colourmodes/index.md).
