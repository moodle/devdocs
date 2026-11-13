---
title: Moodle 6.0 developer update
tags:
- Core development
- Moodle 6.0
---

{/* <!-- markdownlint-disable no-inline-html --> */}

This page highlights the important changes that are coming in Moodle 6.0 for developers.

## $CFG->httpswwwroot property removal

<Since version="6.0" issueNumber="MDL-89722" />

The long-deprecated `$CFG->httpswwwroot` has been removed. It has been an alias for `$CFG->wwwroot` since Moodle 3.4, and any remaining usage in third-party code should be replaced with `$CFG->wwwroot`
