---
title: Moodle 4.4 developer update
tags:
- Core development
- Moodle 4.4
---

<!-- markdownlint-disable no-inline-html -->

import { Since, ValidExample, InvalidExample } from '@site/src/components';

This page highlights the important changes that are coming in Moodle 4.4 for developers.

## Multiple enrol instances of same type in csv course upload

<Since version="4.4" issueNumber="MDL-43820" />

It is now possible to upload a CSV file with multiple enrol instances of the same type in same course. This is useful for example when you want to enrol users in a course using two different cohorts.

:::caution Format of the CSV file

Please use **only** single line per enrol instance format:

```php
shortname,fullname,category_idnumber,enrolment_1,enrolment_1_role,enrolment_1_cohortidnumber
C1,Course 1,CAT1,cohort,student,CV1
C1,Course 1,CAT1,cohort,teacher,CV4
```

If a single line format is used, only last enrol instance will be updated. For example

```php
shortname,fullname,category,summary,enrolment_1,enrolment_1_role,enrolment_2,enrolment_2_role
shortname,fullname,category,summary,cohort,student,cohort,teacher
```

will only update the second enrol instance.

:::

A new method `enrol_plugin:find_instance()` is added to the enrol plugin interface to allow plugins to find an existing instance of the same type in the course. If you want your enrolment method to be supported in CSV course upload, you need to implement this [method](./apis/plugintypes/enrol#enrol_pluginfind_instance-stdclass)

## Bootstrap preparations for version 5

<Since version="4.4" issueNumber="MDL-71979" />

Some of the Bootstrap 4 classes will be deprecated or dropped in its version 5. To prepare for this, some of the current Bootstrap 4 classes usages have been replaced with version 5 compatible classes. This will help us to upgrade to Bootstrap 5 in the future.

- Badge colour class helpers `.badge-*` have been replaced with background utilities (use `.bg-primary` instead of `.badge-primary`) combined with the corresponding text colour classes (`.text-dark` or `.text-white`) to meet accessibility contrast.
- The `.badge-pill` class has been replaced with `.rounded-pill`

<InvalidExample title="Don't">

```html
<span class="badge badge-danger badge-pill">Error badge</span>
```

</InvalidExample>

<ValidExample title="Do">

```html
<span class="badge bg-danger text-white rounded-pill">Error badge</span>
```

</ValidExample>

## Previous versions

- [Moodle 4.3 developer update](./4.3/devupdate)
- [Moodle 4.2 developer update](./4.2/devupdate)
- [Moodle 4.1&4.0 developer update](./4.1/devupdate)
