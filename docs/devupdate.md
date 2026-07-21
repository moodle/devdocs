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

For a comprehensive integration guide, structural configuration examples, and page-state API controls, see the [Linear navigation support guide](./apis/plugintypes/format/linear_navigation.md).

## Supplementary content in the sticky footer

<Since version="5.3" issueNumber="MDL-88601" />

The `moodle_page` class now includes `set_supplementary_content()` and `get_supplementary_content()` methods, allowing any part of Moodle to inject an `action_link` as supplementary content into the sticky footer, regardless of whether the current course format supports linear navigation.

For instance, `mod_forum` uses this new mechanism to display a "Go to all discussions" link in the sticky footer when viewing an individual discussion.

For more information, see the [Adding supplementary content to the sticky footer](./apis/plugintypes/format/linear_navigation.md#adding-supplementary-content-to-the-sticky-footer) section.
