---
title: Moodle Versions
tags:
  - Processes
  - Core development
  - Versions
  - Dependencies
---

New versions of Moodle are released approximately every six months. Moodle supports upgrading from a previous version. This policy describes how the minimum version to upgrade from is calculated.

## Policy statement

When determining the requirements for a version of Moodle, the following rules apply to supported Moodle Versions to upgrade from:

1. A Long Term Support (LTS) release will always require the _previous_ LTS release (or later) for upgrading.
2. Other versions of Moodle will the higher of either:
    - the lowest version of Moodle supported by the minimum PHP version requirement; or
    - the minimum version required by the previous LTS.

:::tip Examples

- Moodle 4.5 LTS requires Moodle 4.1 LTS or higher because it is an LTS release.
- Moodle 5.0 has a minimum PHP version of 8.2, therefore it requires Moodle 4.2.3 which was the first version to support PHP 8.2.

:::

## See also

- [PHP Version Policy](./php.md)
