---
title: Moodle 4.4 developer update
tags:
- Core development
- Moodle 4.4
---

<!-- markdownlint-disable no-inline-html -->

import { Since } from '@site/src/components';

This page highlights the important changes that are coming in Moodle 4.4 for developers.

## Enrolment

### Support for multiple instances in csv course upload

<Since version="4.4" issueNumber="MDL-43820" />

It is now possible to upload a CSV file with multiple enrol instances of the same type in same course. This is useful for example when you want to enrol users in a course using two different cohorts.

To support this, a new method has been added to allow the UI to locate existing enrolment instances:

```php
/**
 * Finds matching instances for a given course.
 *
 * @param array $enrolmentdata enrolment data.
 * @param int $courseid Course ID.
 * @return stdClass|null Matching instance
 */
public function find_instance(
    array $enrolmentdata,
    int $courseid,
) : ?stdClass;
```

If your enrolment plugins supports multiple instances within the same course, you should implement [this method](./apis/plugintypes/enrol#enrol_pluginfind_instance-stdclass).

<details>

<summary>Format of the CSV file</summary>

Each line of the CSV should only have data for _one_ enrolment instance.

```csv title="best-example.csv"
shortname,fullname,category_idnumber,enrolment_1,enrolment_1_role,enrolment_1_cohortidnumber
C1,Course 1,CAT1,cohort,student,CV1
C1,Course 1,CAT1,cohort,teacher,CV4
```

:::warning

If a single line format is used, only the _final_ enrolment instance will be updated. For example in the following example only the second enrolment instance will be updated:

```csv title="not-recommended-example.csv"
shortname,fullname,category,summary,enrolment_1,enrolment_1_role,enrolment_2,enrolment_2_role
shortname,fullname,category,summary,cohort,student,cohort,teacher
```

:::

</details>

## Bootstrap preparations for version 5

<Since version="4.4" issueNumber="MDL-71979" />

Some of the Bootstrap 4 classes will be deprecated or dropped in its version 5. To prepare for this, some of the current Bootstrap 4 classes usages have been replaced with version 5 compatible classes. This will help us to upgrade to Bootstrap 5 in the future.

- The `.form-group` helper class has been replaced with margins.
- The `.form-inline` helper class has been replaced with utility classes.

:::info Form refactor example

The following code:

```html
<form class="form-inline">
    <div class="form-group">
        [...]
    </div>
</form>
```

could be replaced with:

```html
<form class="d-flex flex-wrap align-items-center">
    <div class="mb-3">
        [...]
    </div>
</form>
```

:::

## Previous versions

- [Moodle 4.3 developer update](./4.3/devupdate)
- [Moodle 4.2 developer update](./4.2/devupdate)
- [Moodle 4.1&4.0 developer update](./4.1/devupdate)
