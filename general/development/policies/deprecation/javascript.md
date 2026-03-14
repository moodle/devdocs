---
title: Deprecation of JavaScript
tags:
  - deprecation
---

The deprecation of JavaScript follows the same general principle as the deprecation of other Moodle code. That is:

- Deprecations should only be on the `main` branch, not on stables. Exceptions to this may be made in certain conditions, including:
  - for some external service integrations
  - where a feature is discovered to have been broken irreparably
  - to address security issues
- Deprecations apply to all public APIs, classes, and files.
- All deprecations should be noted with an [upgrade note](../../upgradenotes.md).
- Deprecations are split into three stages:
  1. Initial deprecation
  2. Final deprecation
  3. Removal
- All deprecations should emit debugging notices where possible

## JavaScript specifics {/* #JavaScript-specifics */}

<Since version="5.2" issueNumber="MDL-87867" />

From Moodle 5.2 a new deprecation utility is included in Moodle core for JavaScript. That can be found in the `core/deprecated` AMD module and is intended to function in a similar way to its PHP Attribute equivalent.

See the [JavaScript Guide to deprecation](/docs/guides/javascript/deprecation) for more information on how to use this feature.
