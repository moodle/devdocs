---
title: Quiz access rules
tags:
  - Quiz
  - Access
  - Rule
  - Subplugin
  - Plugintype
  - Override
---

import { ComponentFileSummary } from '../../../_utils';

Quiz access rules give the ability to add conditions a user must meet to attempt a given quiz.

The following rules are readily available as part of Moodle core:

- `quizaccess_delaybetweenattempts`
- `quizaccess_ipaddress`
- `quizaccess_numattempts`
- `quizaccess_offlineattempts`
- `quizaccess_openclosedate`
- `quizaccess_password`
- `quizaccess_seb`
- `quizaccess_securewindow`
- `quizaccess_timelimit`

## File structure

Quiz access rule sub-plugins are located in the `/mod/quiz/accessrule` directory. A plugin should not include any custom files outside of it's own plugin folder.

Each plugin is in a separate subdirectory and consists of a number of mandatory files and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `quizaccess_delaybetweenattempts` plugin.</summary>

```console
mod/quiz/accessrule/delaybetweenattempts
├── classes
│   └── privacy
│       └── provider.php
├── lang
│   └── en
│       └── quizaccess_delaybetweenattempts.php
├── tests
│   └── rule_test.php
├── rule.php
└── version.php
```

</details>

Some of the important files for the format plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### rule.php

import RuleFile from '!!raw-loader!./_examples/rule.php';
import RuleDescription from './_examples/rule.md';

<ComponentFileSummary
    required
    filepath="/rule.php"
    summary="Rule definition class"
    plugintype="quizaccessrule"
    pluginname="pluginname"
    example={RuleFile}
    description={RuleDescription}
/>

### classes/override_rule.php

import OverrideRuleFile from '!!raw-loader!./_examples/override_rule.php';
import OverrideRuleDescription from './_examples/override_rule.md';

<ComponentFileSummary
    filepath="/classes/override_rule.php"
    summary="Override rule definition class"
    plugintype="quizaccessrule"
    pluginname="pluginname"
    example={OverrideRuleFile}
    description={OverrideRuleDescription}
/>

:::info

Implementing `override_rule` is not required but can enhance the usability of the access rule.

:::
