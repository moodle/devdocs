---
title: Moodle 4.4 developer update
tags:
- Core development
- Moodle 4.4
---

<!-- markdownlint-disable no-inline-html -->

import {
    Since,
    ValidExample,
    InvalidExample,
    Tabs,
    TabItem,
} from '@site/src/components';

This page highlights the important changes that are coming in Moodle 4.4 for developers.

## Core changes

### Dependency Injection

<Since version="4.4" issueNumber="MDL-80072" />

Support for PSR-11 compatible Containers has been introduced and can be accessed via the `\core\di` class. Read the [full documentation](./apis/core/di/index.md) for information on how to use Moodle's DI infrastructure.

### String formatting

#### Deprecation of format_* parameters

A number of legacy features and ways of calling `format_text`, and `format_string` now emit deprecation notices. These were all deprecated a long time ago but did not emit:

- Changes to `format_string`:
  - The `$options` array *must not* be a `\context` or `\core\context` object. This was never supported and behaviour was previously undetected
  - Unknown values passed to the `$options` parameter will now emit appropriate debugging notices
- Changes to `format_text`:
  - The fourth parameter, `$courseiddonotuse` now emits a deprecation notice if provided. This was deprecated for Moodle 2.0 in MDL-22001
  - The `smiley` option now emits a deprecation notice. This was deprecated for Moodle 2.0.
  - The `nocache` option now emits a deprecation notice. This was deprecated for Moodle 2.3 in MDL-34347
  - The use of `FORMAT_WIKI` as a source format now throws an exception. Previously it added debugging information to the rendered content. This was deprecated in Moodle 1.5.
  - Unknown values passed to the `$options` parameter will now emit appropriate debugging notices

#### New \core\formatting class

<Since version="4.4" issueNumber="MDL-80072" />

A new `\core\formatting` class has been introduced with new `format_string()`, and `format_text()` methods.

These methods no longer user the `array $options` style configuration, instead expanding options into method parameters.

:::note

The existing `\format_string()`, and `\format_text()` methods remain in place, and are _not currently deprecated_. At this time _you do_ not need to migrate to the APIs.

:::

```php title="New \core\formatting methods"
namespace core;

class formatting {
    public function format_string(
        ?string $string,
        bool $striplinks = true,
        ?context $context = null,
        bool $filter = true,
        bool $escape = true,
    ): string;

    public function format_text(
        ?string $text,
        string $format = FORMAT_MOODLE,
        ?context $context = null,
        bool $trusted = false,
        ?bool $clean = null,
        bool $filter = true,
        bool $para = true,
        bool $newlines = true,
        bool $overflowdiv = false,
        bool $blanktarget = false,
        bool $allowid = false,
    ): string;
}
```

If choosing to use these new methods you **must** use Dependency Injection either via injection into the class, or via the `\core\di` container. You **must not** instantiate the `\core\formatting` class directly.

<Tabs>

<TabItem value="di-usage" label="Usage via Dependency Injection" default>

```php title="Usage in an injected class"
namespace core;

class example {
    public function __construct(
        protected readonly \core\formatting $formatter,
    ) {
    }

    public function do_something(string $input): string {
        return $this->formatter->format_string($input, ...);
    }
}
```

</TabItem>

<TabItem value="container-usage" label="Usage via the \core\di container" default>

```php title="Usage via the \core\di container"
$formatter = \core\di::get(\core\formatting::class);
echo $formatter->format_string($input, ...);
```

</TabItem>

</Tabs>

:::info Named Parameters

<Tabs>

<TabItem value="named" label="Recommended usage" default>

It is _strongly recommended_ that you make use of named parameters for all but the first argument when calling them, rather than using positional arguments.

<ValidExample title="Named arguments">

```php
$formatter = \core\di::get(\core\formatting::class);

$formatter->format_string(
    "The content to be formatted",
    context: \core\context\course::instance($courseid),
    filter: false,
);

$formatter->format_text(
    "The content to be formatted",
    context: \core\context\course::instance($courseid),
    filter: false,
    blanktarget: true,
);
```

</ValidExample>

</TabItem>

<TabItem value="positional" label="Alternative approach">

The use of positional arguments to the format methods is strongly discouraged.

<InvalidExample title="Positional arguments">

```php
$formatter = \core\di::get(\core\formatting::class);

$formatter->format_string(
    "The content to be formatted",
    true,
    \core\context\course::instance($courseid),
    false,
);

$formatter->format_text(
    "The content to be formatted",
    FORMAT_MOODLE,
    \core\context\course::instance($courseid),
    false,
    null,
    false,
    true,
    true,
    false,
    true,
);
```

</InvalidExample>

</TabItem>

</Tabs>

:::

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

### Badges

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

### Media

The `.media` component has been replaced with utility classes.

<InvalidExample title="Don't">

```html
<div class="media">
    <div class="media-left">
        [...]
    </div>
    <div class="media-body">
        [...]
    </div>
</div>
```

</InvalidExample>

<ValidExample title="Do">

```html
<div class="d-flex">
    <div class="flex-shrink-0">
        [...]
    </div>
    <div class="flex-grow-1 ml-3">
        [...]
    </div>
</div>
```

</ValidExample>

## New course section page

<Since version="4.4" issueNumber="MDL-79986" />

The new course/section.php page is designed exclusively for displaying individual section content. It only requires `sectionid`, eliminating the need for the legacy sectionnumber.

Enhancements to this page:

- The General section will no longer appear above the selected section, ensuring a focused display of content for the specified section id.
- Regardless of the Course layout ("All sections on one page" vs "One section per page"), all section names in the main course page content will now link to the new page (excluding editing mode).
- The `$CFG->linkcoursesections` setting has been entirely removed. Initially used for the Classic theme to empower admins in deciding whether section names in the Navigation block should be linked, this setting is now obsolete. With the introduction of the course/section.php page, dedicated to displaying content for any single section, and a convenient link from the main course page, users can seamlessly focus on section content without the need for this setting.
- The methods `core_courseformat\base::set_section_number()` and `core_courseformat\base::get_section_number()` have been deprecated and replaced by `core_courseformat\base::set_sectionnum()` and `core_courseformat\base::get_sectionnum()`. The new methods use the null value when all the sections must be displayed (instead of 0). That way, section 0 (General), can be displayed on a single page too.

## Previous versions

- [Moodle 4.3 developer update](./4.3/devupdate)
- [Moodle 4.2 developer update](./4.2/devupdate)
- [Moodle 4.1&4.0 developer update](./4.1/devupdate)
