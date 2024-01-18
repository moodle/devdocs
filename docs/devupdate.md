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

### Attributes

<Since version="4.4" issueNumber="MDL-81011" />

PHP 8.0 introduced support for the Attribute language feature and Moodle is beginning to make use of this in small but helpful ways.

To simplify this adoption, a new `\core\attribute_helper` class has been created with methods to quickly and easily fetch the `\ReflectionAttribute` for any relevant attributes.

The new methods can search for an attribute using a reference, which can be:

- a string, whose name represents a global function, a class, or a class combined with a method, property, constant, or enum
- an instantiated object
- an array whose first value is either a string or object, and whose optional second value is a child of the first value

```php title="Fetching attributes"
<?php

use core\attribute_helper;
use core\attribute\{label, tags};

// Get a label on the \some_function_name() method.
$label = attribute_helper::one_from('some_function_name', label::class)?->newInstance();

// Get an instance of a label on the \example class.
$label = attribute_helper::one_from(example::class, label::class)?->newInstance();

// Get an instance of a label on an instance of the \example class.
$example = new example();
$label = attribute_helper::one_from($example, label::class)?->newInstance();

// Get an instance of a label on a constant, property, or method of the \example class.
$label = attribute_helper::one_from([example::class, 'some_child'], label::class)?->newInstance();

// Get an instance of a label on a constant, property, or method of an instance of the \example class.
$example = new example();
$label = attribute_helper::one_from([$example, 'some_child'], label::class)?->newInstance();
```

Other variations of the above are also possible.

### Hooks

<Since version="4.4" issueNumber="MDL-81011" />

Attribute-based alternatives to the `\core\hook\described_hook`, and `\core\hook\deprecated_callback_replacement` interfaces are now supported.

- the `\core\attribute\label` attribute can be used to add a string-based description of the hook.
- the `\core\attribute\tags` attribute can be used to add one or more tags to describe the hook.
- the `\core\attribute\hook\replaces_callbacks` attribute can be used to add one or more replaced callbacks.

```php
<?php

namespace core\hook;

use core\attribute;

#[attribute\label('This is a description of the hook')]
#[attribute\tags('examples', 'navigation', 'authentication')]
#[attribute\hook\replaces_callbacks('an_old_callback_that_is_replaced_here')]
class before_navigation_render {
    public function __construct(
        public readonly \navigation_node $navigation,
    ) {
    }
}
```

:::tip

It is still possible to use the `\core\hook\described_hook` and `\core\hook\deprecated_callback_replacement` interfaces. The attribute approach is provided as a more light-weight alternative.

:::

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

## Parameters

### API Change

<Since version="4.4" issueNumber="MDL-80005" />

Parameter constants, and the cleaning of values using these parameters, has been moved to a new enum in `\core\param`.

The enum contains relevant associated methods for fetching, validating, and cleaning the content of values, for example:

```php title="Examples of enum-based parameters"
// Clean an existing variable.
$value = \core\param::ALPHANUMEXT->clean($value);
$value = \core\param::ALPHANUMEXT->validate_param($value);
$value = \core\param::ALPHANUMEXT->clean_param_array($value);

// Require a param (replaced required_param).
$value = \core\param::ALPHANUMEXT->required_param('someparamname');
$value = \core\param::ALPHANUMEXT->optional_param('someparamname', 'defaultvalue');
$value = \core\param::ALPHANUMEXT->required_param_array('someparamname');
$value = \core\param::ALPHANUMEXT->optional_param_array('someparamname', []);
```

:::note

The existing `PARAM_*` constants, and related methods (`required_param`, `optional_param()`, `clean_param()`, and so on) remain in place, and are _not currently deprecated_. At this time _you do_ not need to migrate to the APIs.

:::

### Deprecations

<Since version="4.4" issueNumber="MDL-80005" />

A number of deprecated parameter types have been deprecated, these include:

- `PARAM_CLEAN`
- `PARAM_INTEGER`
- `PARAM_NUMBER`
- `PARAM_ACTION`
- `PARAM_FORMAT`
- `PARAM_MULTILANG`
- `PARAM_CLEANFILE`

These param types have all been deprecated since Moodle 2.0.

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

## Refactoring BS4 features dropped in BS5

<Since version="4.4" issueNumber="MDL-71979" />

Some of the Bootstrap 4 classes will be deprecated or dropped in its version 5. To prepare for this, some of the current Bootstrap 4 classes usages have been replaced with version 5 compatible classes. This will help us to upgrade to Bootstrap 5 in the future.

See more information in [Bootstrap 5 migration](./guides/bs5migration/index.md).

## New course section page

<Since version="4.4" issueNumber="MDL-79986" />

The new course/section.php page is designed exclusively for displaying individual section content. It only requires `sectionid`, eliminating the need for the legacy sectionnumber.

Enhancements to this page:

- The General section will no longer appear above the selected section, ensuring a focused display of content for the specified section id.
- Regardless of the Course layout ("All sections on one page" vs "One section per page"), all section names in the main course page content will now link to the new page (excluding editing mode).
- The `$CFG->linkcoursesections` setting has been entirely removed. Initially used for the Classic theme to empower admins in deciding whether section names in the Navigation block should be linked, this setting is now obsolete. With the introduction of the course/section.php page, dedicated to displaying content for any single section, and a convenient link from the main course page, users can seamlessly focus on section content without the need for this setting.
- The methods `core_courseformat\base::set_section_number()` and `core_courseformat\base::get_section_number()` have been deprecated and replaced by `core_courseformat\base::set_sectionnum()` and `core_courseformat\base::get_sectionnum()`. The new methods use the null value when all the sections must be displayed (instead of 0). That way, section 0 (General), can be displayed on a single page too.

## Activity icons

<Since version="4.4" issueNumber="MDL-78284" />

### New designs

The activity icons have been updated to prioritize readability and transform the existing filled square shapes with white icons into outlined colored icons against a transparent background. This modification ensures that the icons are not only more accessible but also easily distinguishable for users.
When upgrading the SVG files, the .png files have been removed.

:::tip Considerations for creating/updating SVG icons

- Please make sure that the icons are filled with `#212529` and that the background is transparent.
- The icons should be 24x24px. It's recommended to define width and height into the SVG files to guarantee that the icons are displayed correctly.

:::

![New activity icons](./_devupdate/activity-icons.png)

### Activity purposes

Since Moodle 4.0, in places like the course page and the activity chooser icons have a more prominent role which is defined using the `FEATURE_MOD_PURPOSE` feature flag.

The available activity purposes for this feature are:

- Administration (`MOD_PURPOSE_ADMINISTRATION`)
- Assessment (`MOD_PURPOSE_ASSESSMENT`)
- Collaboration (`MOD_PURPOSE_COLLABORATION`)
- Communication (`MOD_PURPOSE_COMMUNICATION`)
- Interactive content (`MOD_PURPOSE_INTERACTIVECONTENT`)
- Resource (`MOD_PURPOSE_CONTENT`)
- Other (`MOD_PURPOSE_OTHER`)

:::danger Changes in purposes for Moodle 4.4

- `MOD_PURPOSE_INTERFACE` has been deprecated, so it's not recommended to use it.
- `MOD_PURPOSE_INTERACTIVECONTENT` has been added. In core, it's used for activities like H5P, Lesson, SCORM and IMS package.

:::

### Branded icons

A new callback, `<modname>_is_branded()` has been added to the modules. Branded icons are displayed with their original colours and they are not affected by the activity purpose colours. By default, none of the modules are branded.

```php
/**
 * Whether the activity is branded.
 * This information is used, for instance, to decide if a filter should be applied to the icon or not.
 *
 * @return bool True if the activity is branded, false otherwise.
 */
function h5pactivity_is_branded(): bool {
    return true;
}
```

## Previous versions

- [Moodle 4.3 developer update](./4.3/devupdate)
- [Moodle 4.2 developer update](./4.2/devupdate)
- [Moodle 4.1&4.0 developer update](./4.1/devupdate)
