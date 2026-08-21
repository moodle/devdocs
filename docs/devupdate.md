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

## Tagged, accessible PDF generation

<Since version="5.3" issueNumber="MDL-83411" />

Moodle 5.3 adds the [tc-lib-pdf](https://github.com/tecnickcom/tc-lib-pdf) library, and a new `\core\pdf\document` class that wraps it with the Moodle defaults for language, metadata, fonts and local file access. It emits tagged PDF/UA output by default, so documents generated through it are accessible to assistive technology.

`\core\pdf\document` is now the preferred way to generate a PDF. The `\pdf` class in `lib/pdflib.php`, which wraps TCPDF, is unchanged and still supported, so plugins that extend it keep working. It is, however, discouraged for new code, because TCPDF cannot produce tagged output. Whether TCPDF is eventually removed is being tracked separately.

`dataformat_pdf` is the first core output to be converted, so report exports are now tagged tables rather than grids of unrelated cells. The remaining core PDF output (PDF annotation, the Brickfield accessibility report, and QR code generation) is unchanged for now, and conversion of each is being tracked separately.

Note that sites which added their own fonts for PDF export have to convert them again from the original `.ttf` or `.otf` file, using the new `admin/cli/convert_pdf_font.php` script. The two libraries read different font metrics formats, so a font prepared for TCPDF is invisible to the new one and exports silently fall back to the default font.

For usage, the accessibility rules, font handling and a migration table, see the [PDF API guide](./apis/core/pdf/index.md).
