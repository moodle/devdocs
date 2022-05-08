---
title: PHP CodeSniffer
tags:
  - coding style
  - policies
  - tools
---

## Overview

This document describes the various code sniffing tools that Moodle recommends, their purpose, and their usage.

Moodle has published a ruleset for the popular [PHPCodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer) project. The function of PHPCodeSniffer tool is to analyse PHP code, and to apply a set of rules. The rules distributed by Moodle is intended to meet the [Moodle Coding Style](../policies/codingstyle/index.md), and output a report showing which parts of the code do not conform to this style.

## Installation

This ruleset can either be installed separately as a globally available coding standard, or on a per-project basis as a Moodle plugin. _We recommend that you install the ruleset globally_ as this is easier to integrate with a wider range of editors and related tools.

If you use the globally installed standard, then you should use the global copy of phpcs, whilst if you use the Moodle plugin then you _must_ use the version of phpcs distributed with the plugin in {{local/codechecker/phpcs/bin/phpcs}}.

### Global installation

The easiest way to install the ruleset is by using [Composer](https://getcomposer.org/). By installing the [Moodle Code Sniffer rules](https://packagist.org/packages/moodlehq/moodle-cs) package using the global flag, Composer will install both the Moodle ruleset, and the CodeSniffer package.

```console
$ composer global require moodlehq/moodle-cs
```

If you primarily work with Moodle then you may wish to set the Moodle standard as your default PHPCodeSniffer standard. You can do so using the `--config-set` option to `phpcs`:

```php
$ phpcs --config-set default_standard moodle
```

### Moodle plugin

Moodle includes a copy of the PHPCodeSniffer package, and the Moodle ruleset, as part of the [`moodle-local_codechecker`](https://github.com/moodlehq/moodle-local_codechecker) Moodle plugin. This makes the code checker available via a web-based interface for checking the syntax of a given file or folder.

```console
$ git clone git://github.com/moodlehq/moodle-local_codechecker.git local/codechecker
```

It is recommended that you add the plugin to your _local_ git ignore:

```console
$ echo local/codechecker >> .git/info/exclude
```

:::info

The `.git/info/exclude` file is a per-repository version of the `.gitignore` file. Whilst `.gitignore` is tracked within the Moodle codebase and a version is shipped with Moodle, the `.git/info/exclude` file is local to your git clone.

See the [gitignore](https://git-scm.com/docs/gitignore) documentation for more information on the gitignore feature.

:::

Once installed a new codechecker option will appear in the Site administration -> Development page.

This page allows for the code in a specified directory to be checked, for example if you wanted to check the code for the `shortanswer` question type you would enter

```
/question/type/shortanswer
```

You would then be presented with a list of the count of files processed and any warnings or errors.

## Editor integrations

Many modern editors and IDEs will natively integrate with PHPCodeSniffer, and most will allow you to specify a per-project default standard rather than requiring the standard be set as a global default. For example, the [VS Code PHP_CodeSniffer extension](https://marketplace.visualstudio.com/items?itemName=obliviousharmony.vscode-php-codesniffer) can be configured to specify the standard to use.

## Advanced Usage

### Ignoring warnings

You can run the CodeSniffer with the -n flag to ignore warnings:

```console
$ phpcs -n index.php
--------------------------------------------------------------------------------
FOUND 139 ERROR(S) AFFECTING 125 LINE(S)
--------------------------------------------------------------------------------
  28 | ERROR | line indented incorrectly; expected 0 spaces, found 4
  50 | ERROR | line indented incorrectly; expected 0 spaces, found 4
...
```

### Recursive analysis

If you give the name of a folder instead of a file, it will search, analyse and report on all PHP files found in this folder and all its subfolders. This will produce a full report for each PHP file. Since this is likely to be too much information, you may want to print only a summary report, by using the following syntax (search the files/ folder as an example):

```console
$ phpcs --report=summary blocks/html
PHP CODE SNIFFER REPORT SUMMARY
-----------------------------------------------------------------------------------------------------------------------
FILE                                                                                                   ERRORS  WARNINGS
-----------------------------------------------------------------------------------------------------------------------
/var/www/html/moodle/blocks/html/block_html.php                                       24      0
/var/www/html/moodle/blocks/html/edit_form.php                                        16      0
/var/www/html/moodle/blocks/html/lib.php                                              11      0
/var/www/html/moodle/blocks/html/settings.php                                         6       0
/var/www/html/moodle/blocks/html/backup/moodle2/backup_html_block_task.class.php      2       0
/var/www/html/moodle/blocks/html/backup/moodle2/restore_html_block_task.class.php     3       0
/var/www/html/moodle/blocks/html/classes/privacy/provider.php                         13      0
/var/www/html/moodle/blocks/html/classes/search/content.php                           6       0
/var/www/html/moodle/blocks/html/tests/search_content_test.php                        6       0
-----------------------------------------------------------------------------------------------------------------------
A TOTAL OF 87 ERRORS AND 0 WARNINGS WERE FOUND IN 9 FILES
-----------------------------------------------------------------------------------------------------------------------
PHPCBF CAN FIX 75 OF THESE SNIFF VIOLATIONS AUTOMATICALLY
-----------------------------------------------------------------------------------------------------------------------

Time: 626ms; Memory: 16MB
```

### Other report formats

CodeSniffer can export its reports in the following formats:

1. `full`: default, shown first above
1. `summary`: also shown above
1. `xml`: Simple XML format
1. `csv`: Comma-separated list
1. `checkstyle`: XML format intended for use with CruiseControl

## See also

1. [Coding](https://docs.moodle.org/dev/Coding)
1. [Coding style](../policies/codingstyle/index.md)
