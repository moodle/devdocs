---
title: Moodle 4.2 developer update
tags:
- Core development
---

<!-- markdownlint-disable no-inline-html -->

import { CodeBlock, CodeExample, InvalidExample, ValidExample } from '@site/src/components';

This page highlights the important changes that are coming in Moodle 4.2 for developers.

## External API

The `external_api` class, and all related classes have been moved from `lib/externallib.php` to namespaced classes within the [`core_external` subsystem](./apis/subsystems/external/index.md).

:::note Delayed deprecation

The old class locations have been aliased for backwards compatibility and will emit a deprecation notice in a _future_ release.

If you are writing a Moodle plugin which has a single codebase shared with older versions of Moodle, you should continue to use the old API locations at this time.

:::

The following parts of the external API have been moved to the `core_external` subsystem.

### Renamed External API classes

| Old class name                 | New class name                               |
| ---                            | ---                                          |
| `external_api`                 | `core_external\external_api`                 |
| `external_description`         | `core_external\external_description`         |
| `external_files`               | `core_external\files`                        |
| `external_format_value`        | `core_external\external_format_value`        |
| `external_function_parameters` | `core_external\external_function_parameters` |
| `external_multiple_structure`  | `core_external\external_multiple_structure`  |
| `external_settings`            | `core_external\external_settings`            |
| `external_single_structure`    | `core_external\external_single_structure`    |
| `external_util`                | `core_external\util`                         |
| `external_value`               | `core_external\external_value`               |
| `external_warnings`            | `core_external\external_warnings`            |
| `restricted_context_exception` | `core_external\restricted_context_exception` |

### Renamed External API functions

| Old function name                            | New function name                                       |
| ---                                          | ---                                                     |
| `external_format_string()`                   | `core_external\util::format_string()`                   |
| `external_format_text()`                     | `core_external\util::format_text()`                     |
| `external_create_service_token()`            | `core_external\util::generate_token()`                  |
| `external_generate_token()`                  | `core_external\util::generate_token()`                  |
| `external_generate_token_for_current_user()` | `core_external\util::generate_token_for_current_user()` |
| `external_log_token_request()`               | `core_external\util::log_token_request()`               |

### Validation of `$required` parameter

The `$required` parameter in `\core_external\external_description` is now being validated. This is in order to prevent accidentally passing incorrect parameters to the `external_description`'s and its subclasses' constructors.

<InvalidExample>

```php
'contentformat' => new external_format_value('content', 'Content format'),
```

In this example, the field description has been accidentally passed for the `$required` parameter in `external_format_value`'s constructor. A debugging notice will be shown about the value `Content format` as an invalid value for the `$required` parameter.

</InvalidExample>

<ValidExample>

```php
'contentformat' => new external_format_value('content', VALUE_REQUIRED, 'Content format'),
```

The value for the `$required` parameter must either be set to either one of the `VALUE_DEFAULT`, `VALUE_REQUIRED`, or `VALUE_OPTIONAL` constants.

</ValidExample>

## Quiz activity

At the moment, this is just a placeholder to say that there are significant changes in the Quiz activity (`mod_quiz`) in Moodle 4.2.
A lot of the quiz code is being updated to modern Moodle coding standards while we add features in Epic MDL-74607.
Therefore, if you have made customisations to the core quiz code, you will have work to do, and if you have made quiz sub-plugins
(reports or access rules) you may have a small amount of work to do.

I will write a more coherent summary once the changes are complete, but
[mod/quiz/upgrade.txt](https://github.com/moodle/moodle/blob/master/mod/quiz/upgrade.txt) lists all the changes so far.

### Developer tip - handling changes to base class names, while supporting multiple Moodle versions

Thanks to Luca Bösch for working this out. If you want a single version of your plugin to support multiple version of Moodle
without developer debug warnings, you can do it like this:

<CodeExample type="warning" title="Work-around to support multiple base class names">

```php

// This work-around is required until Moodle 4.2 is the lowest version we support.
if (class_exists('quiz_default_report')) {
    class_alias('quiz_default_report', 'quiz_archive_parent_class_alias');
} else {
    class_alias('mod_quiz\local\reports\report_base', 'quiz_archive_parent_class_alias');
}

class quiz_archive_report extends quiz_archive_parent_class_alias {
    // Contents of your class unchanged.
}
```

</CodeExample>
