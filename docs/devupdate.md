---
title: Moodle 4.2 developer update
tags:
- Core development
---

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
