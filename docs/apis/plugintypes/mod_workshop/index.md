---
title: Workshop
tags: []
---
:::info
Work in progress
:::

import { Since } from '@site/src/components';

<Since versions={["2.0"]} />

This page describes the current implementation of the [Workshop module](https://docs.moodle.org/dev/Workshop_module). See also [Workshop 2.0 specification](https://docs.moodle.org/dev/Workshop_2.0_specification) and [Workshop 2.0 testing](https://docs.moodle.org/dev/Workshop_2.0_testing).

## Overview of Workshop architecture

Rewriting Workshop from scratch for Moodle 2.0 was a great opportunity to use new APIs and approaches to activity module development. In some areas, Workshop was a pioneering component adopting new frameworks - like `File API`, HTML rendering or subplugins support.

Many of Workshop features are implemented as subplugins (see `mod/workshop/db/subplugins.php`). That allows to extend current functionality without hacking Workshop core system.

### Workshop core

Workshop core consists of common module functions in `lib.php` (required by Moodle itself) and methods of class workshop defined in `locallib.php`.

### Grading strategies

Grading strategies are defined as workshopform subplugins in `mod/workshop/form/` subdirectories. At any given time, just one type of the subplugin is used by workshop. But the data are kept so teachers can switch strategies as they need.

### Allocators

Allocation subplugins are used to allocate submissions to the students for peer-review. They are defined as workshopallocation subplugins in `mod/workshop/allocation/` subdirectories. Teacher can use any installed allocator to distribute submission. Allocators are responsible for creating records in `workshop_assessment` table.

### Grading evaluators

Grading evaluators calculate grades for assessments (aka grading grades). They are defined workshopeval subplugins in `mod/workshop/eval/` subdirectories.

## Diagrams and schemas

### Database structure

[400px](https://docs.moodle.org/Image/workshop_erd.png)
<br clear="all"/>

### XML structure

For the purpose of backup/moodle2, the following XML schema is used.
[400px](https://docs.moodle.org/Image/workshop_xml.png)
<br clear="all"/>

### Classes

The following UML diagram explains the structure of classes defined in workshop subplugins.
[400px](https://docs.moodle.org/Image/workshop_classes.png)
<br clear="all"/>

### Gradebook integration

[400px](https://docs.moodle.org/Image/workshop_grades_calculation.png)
<br clear="all"/>

## Debugging and testing

- [Workshop/fakesubmissions.php](https://docs.moodle.org/dev/Workshop/fakesubmissions.php)
