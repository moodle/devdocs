---
title: Plugin code prechecks
sidebar_position: 3
tags:
  - Guidelines for contributors
  - Plugins
  - Plugin documentation
---
In the Moodle Plugins directory, uploaded plugins versions are automatically tested against a set of formal criteria. These tests typically do not check the actual plugin functionality, security or code correctness. They are more focused on formal aspects of the coding style. As such, they are most valuable for the plugin maintainers themselves.

## Labels

Plugin version with no detected errors or warnings has a label like this displayed:

![Plugin code prechecks success](_codeprechecks/plugin-codeprechecks-success.png)

If there are some formal errors or warnings detected, a label like this is displayed:

![Plugin code prechecks error](_codeprechecks/plugin-codeprechecks-error.png)

The first of the two numbers gives the total number of detected errors, the second number shows the number of warnings. If there are no errors but some warnings, the label is displayed in orange colour. In case of some errors, the label is displayed in red.

Clicking the code prechecks label takes you to a page with details on particular tests executed. Individual labels are displayed for each of the test, with the same formatting rules as described above.

![Plugin code prechecks details](_codeprechecks/plugin-codeprechecks-details.png)

Finally, clicking some of these individual test labels takes you to a page with detailed raw output of the test system.

## Test types

- **phplint**: Checks the plugin source code for correct PHP syntax.
- **phpcs**: Checks the plugin against the [Moodle coding style](../../development/policies/codingstyle).
- **js**: Checks the plugin against the [JavaScript coding style](/docs/guides/javascript/).
- **css**: Checks the plugin against the [CSS coding style](https://docs.moodle.org/dev/CSS_Coding_Style).
- **phpdoc**: Checks that the plugin files, classes and functions are documented in the source code.
- **savepoint**: Reports issues detected with the handling of [upgrade savepoints](/docs/guides/upgrade/).
- **thirdparty**: Reports issues with the [thirdpartylibs.xml](/docs/apis/commonfiles#thirdpartylibsxml) file.
- **grunt**: Reports issues with [Grunt](https://docs.moodle.org/dev/Grunt) builds.
- **mustache** : Reports issues with [Mustache templates](/docs/guides/templates/).
