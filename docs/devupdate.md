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
