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

## Modal dialogue titles are now `<h2>` elements

<Since version="5.3" issueNumber="MDL-75699" />

The title rendered by the `core/modal` template is now an `<h2 class="modal-title fs-5">` instead of an `<h5>`, so that opening a dialogue no longer breaks the page's heading hierarchy for assistive technology users. The title's appearance is unchanged, because its size is now set by the `fs-5` utility class rather than by the element.

If your plugin renders headings inside dialogue content, they must be nested beneath this `<h2>`, so the first level available to you is `<h3>`. Headings that previously nested beneath the old `<h5>` will now skip levels. This includes content that is rendered into a dialogue without being authored as part of one -- for example, the Markdown headings in an activity module's `modulename_help` string, which core has lowered from `######` to `####` for this reason.

If your plugin renders its own modal header markup, or overrides the `header` block of the `core/modal` template, apply the same `<h2 class="modal-title fs-5">` pattern.

:::note[Backported]

This change has also been backported to Moodle 4.5, 5.1, and 5.2. On Moodle 4.5 the title carries the Bootstrap 4 `h5` utility class rather than `fs-5`.

:::

For more information, see [Heading structure](./guides/javascript/modal/index.md#heading-structure) in the Modal Dialogues guide.
