---
title: Rector
tags:
  - tools
  - PHP
---

<Since version="6.0" issueNumber="MDL-84204" />

[Rector](https://getrector.com/) is a tool for automating PHP code refactoring. Moodle includes a Rector configuration to apply a selected set of refactoring rules to the codebase.

## Installation {/* #installation */}

From the root directory of your Moodle checkout, install the Composer dependencies:

```console
composer install
```

This also installs Rector and its dependencies.

## Running Rector {/* #running-rector */}

Run Rector from the root directory of your Moodle checkout:

```console
composer rector
```

By default, Rector uses Moodle's `rector.php` configuration and applies changes to the codebase. Review the changes before committing them.

### Passing arguments {/* #passing-arguments */}

To pass arguments to Rector, separate them from the Composer command with `--`:

```console
composer rector -- [args]
```

Replace `[args]` with Rector's command-line arguments. For example, to preview changes without modifying any files:

```console
composer rector -- --dry-run
```

To limit processing to a specific directory:

```console
composer rector -- public/mod/forum
```

To see the available options:

```console
composer rector -- --help
```
