---
title: Deprecation of templates
tags:
  - deprecation
---

The Mustache Templating system does not formally support any deprecation process, therefore the deprecation _process_ is slightly different, while the principle and intent is the same.

For templates and the output component of them, the deprecation policy primarily applies to the context information used to render the template, and passed into child templates.

The deprecation of Templates follows the same general principle as the deprecation of other Moodle code. That is:

- Breaking changes to a template have the same impact as a deprecation and should be considered in the same way
- Deprecations should only be on the `main` branch, not on stables. Exceptions to this may be made in certain conditions, including:
  - where a feature is discovered to have been broken irreparably
  - to address security issues
- All deprecations should be noted with an [upgrade note](../../upgradenotes.md).
- Deprecations are split into three stages:
  1. Initial deprecation
  2. Final deprecation
  3. Removal
