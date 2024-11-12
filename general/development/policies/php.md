---
title: PHP
sidebar_label: PHP versions
description: Information about how PHP supported versions correlate with Moodle releases and the policy controlling it.
tags:
  - Requirements
  - Support
  - Releases
  - PHP
---

New PHP versions are [released every year](https://www.php.net/supported-versions.php) and come with important improvements and changes compared with previous versions. Moodle tries to support them as soon as possible, always matching them with our own [scheduled release plans](../../releases.md).

## Policy statement

<Since versions={["3.5"]} issueNumber="MDL-59159" />

We always follow this agreed policy regarding PHP and Moodle supported versions:

1. A LTS will always **require the previous LTS** (or later) for upgrading.
2. The **maximum PHP version** supported for a branch will be the max one achieved along the life of the branch. Usually with .0 releases but may happen later (we added support for php80 with 3.11.8, or support for php81 with 4.1.2, for example).
3. The **minimum PHP** version supported for a branch will be **the lower of**:
    - The [minimum version supported in any way by php](https://www.php.net/supported-versions.php) that is under support for at least 12 more months when the new Moodle version gets released (so we provide slow, progressive increments).
    - The maximum PHP version supported by the previous LTS branch (so we guarantee jumping between LTS is possible without upgrading PHP at the same time).

<details>

<summary>PHP and Moodle policy in Jira wiki markup format.</summary>

```txt
{panel:title=Policy: PHP & Moodle supported versions|borderStyle=dashed|borderColor=#cccccc|titleBGColor=#f7d6c1|bgColor=#ffffce}
Since Moodle 3.5 (MDL-59159), these rules apply to decide Minimum PHP and Moodle versions supported:
 # A LTS will always require the previous LTS (or later) for upgrading.
 # The maximum PHP version supported for a branch will be the max one achieved along the life of the branch. Usually with .0 releases but may happen later (we added support for php80 with 3.11.8, or support for php81 with 4.1.2, for example).
 # The minimum PHP version supported for a branch will be *the lower of*:
 -- The [minimum version supported in any way by php|http://php.net/supported-versions.php] that is under support for at least 12 more months when the new Moodle version gets released (so we provide slow, progressive increments).
 -- The maximum PHP version supported by the previous LTS branch (so we guarantee jumping between LTS is possible without upgrading PHP at the same time).{panel}
```

</details>

This page contains the current status of support for every PHP version and Moodle versions. For details, follow also the epic links below that combine all the changes that were made in Moodle to ensure PHP compatibility.

:::note

You must be logged in to tracker to see issues in Epics.

:::

## PHP supported versions

### PHP 8.3

<Since versions={["4.4"]} issueNumber="MDL-76426" />

PHP 8.3 **can be used with** Moodle 4.4 and later releases. See MDL-76426 for details.

### PHP 8.2

<Since versions={["4.2.3", "4.3"]} issueNumber="MDL-76405" />

PHP 8.2 **can be used with** Moodle 4.2.3, Moodle 4.3 and later releases. See MDL-76405 for details.

### PHP 8.1

<Since versions={["4.1.2", "4.2"]} issueNumber="MDL-73016" />

PHP 8.1 **can be used with** Moodle 4.1.2, Moodle 4.2 and later releases. It is also the **minimum** supported version for Moodle 4.4. See [MDL-73016](https://tracker.moodle.org/browse/MDL-73016) for details.

### PHP 8.0

<Since versions={["3.11.8", "4.0.2"]} issueNumber="MDL-70745" />

PHP 8.0 **can be used with** Moodle 3.11.8, Moodle 4.0.2 and later releases. It is also the **minimum** supported version for Moodle 4.2. See [MDL-70745](https://tracker.moodle.org/browse/MDL-70745) for details.

### PHP 7.4

<Since versions={["3.8.3", "3.9"]} issueNumber="MDL-66260" />

PHP 7.4 **can be used with** Moodle 3.8.3, Moodle 3.9 and later releases. It is also the **minimum** supported version for Moodle 4.1. See [MDL-66260](https://tracker.moodle.org/browse/MDL-66260) for details.

### PHP 7.3

<Since versions={["3.6.4", "3.7"]} issueNumber="MDL-63420" />

PHP 7.3 **can be used with** Moodle 3.6.4, Moodle 3.7 and later releases. It is also the **minimum** supported version for Moodle 3.11. See [MDL-63420](https://tracker.moodle.org/browse/MDL-63420) for details.

### PHP 7.2

<Since versions={["3.4"]} issueNumber="MDL-60279" />

PHP 7.2 **can be used with** Moodle 3.4 and later releases. It is also the **minimum** supported version for Moodle 3.9. See [MDL-60279](https://tracker.moodle.org/browse/MDL-60279) for details.

### PHP 7.1

<Since versions={["3.2"]} issueNumber="MDL-55120" />

PHP 7.1 **can be used with** Moodle 3.2 and later releases. It is also the **minimum** supported version for Moodle 3.7. See [MDL-55120](https://tracker.moodle.org/browse/MDL-55120) for details.

### PHP 7.0

<Since versions={["3.0.1", "3.1"]} issueNumber="MDL-50565" />

PHP 7.0 **can be used with** Moodle 3.0.1, Moodle 3.1 and later releases. It is also the **minimum** supported version for Moodle 3.4. See [Moodle and PHP 7.0 details](https://docs.moodle.org/dev/Moodle_and_PHP_7.0_details) and [MDL-50565](https://tracker.moodle.org/browse/MDL-50565) for details.

## PHP versions under development

### PHP 8.4

PHP 8.4 support **is currently being implemented** for Moodle 5.0 and later releases. Hence it's still **incomplete and only for development purposes**. See MDL-80117 for details.

## See also

- [Releases](../../releases.md) - For details about all the Moodle releases.
