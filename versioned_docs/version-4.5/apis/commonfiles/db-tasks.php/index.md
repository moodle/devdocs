---
title: db/tasks.php
tags:
  - Plugins
  - Common files
  - Scheduled tasks
description: A description of the plugin scheduled task configuration file
---

import { LanguageProperty } from '@site/src/components';

If a plugin wants to configure scheduled task, two items are required:

- a class extending the `\core\task\scheduled_task` class; and
- the `db/tasks.php` file containing its initial configuration.

The general format of the file is as follows:

```php
$tasks = [
    // First task configuration.
    [ ... ],

    // Second task configuration.
    [ ... ],
];
```

Each task configuration entry has a number of possible properties, described below.

## Task configuration entries

### Classname

<LanguageProperty
    required
    types={["string"]}
/>

The `classname` contains the fully-qualified class name where the scheduled task is located.

```php
$tasks = [
    [
        'classname' => 'mod_example\task\do_something',
        // ...
    ]
]
```

### Blocking

<LanguageProperty
    types={["integer"]}
/>

Tasks can be configured to block the execution of all other tasks by setting the `blocking` property to a truthy value.

:::caution

Whilst this feature is available its use is _strongly_ discouraged and *will not* be accepted in Moodle core.

:::

```php
$tasks = [
    [
        'classname' => 'mod_example\task\do_something',
        'blocking' => 1,
        // ...
    ],
];
```

### Date and time fields

<LanguageProperty
    types={["string"]}
/>

The following date and time fields are available:

- month
- day
- dayofweek
- hour
- month

Each of these fields accepts one, or more values, and the format for each field is described as:

```
<fieldlist> := <range>(/<step>)(,<fieldlist>)
<step>      := int
<range>     := <any>|<int>|<min-max>|<random>
<any>       := *
<min-max>   := int-int
<random>    := R
```

:::info Random values

A fixed random value can be selected by using a value of `R`. By specifying this option, a random day or time is chosen when the task is installed or updated. The same value will be used each time the task is scheduled.

:::

If no value is specified then the following defaults are used:

- Month: `*` (Every month)
- Day: `*` (Every day)
- Day of the week: `*` (Every day of the week)
- Hour: `*` (Every hour)
- Minute: `*` (Every minute)

:::info Day and Day of the week

If either field is set to `*` then use the other field, otherwise the soonest value is used.

:::

#### Examples

```php title="Run at a fixed time each day, randomised during installation of the task"
$tasks = [
    [
        'classname' => 'mod_example\task\do_something',

        // Every month.
        'month' => '*',
        // Every day.
        'day' => '*',

        // A fixed random hour and minute.
        'hour' => 'R',
        'month' => 'R',
    ],
];
```

```php title="Specifying multiple times in an hour"
$tasks = [
    [
        'classname' => 'mod_example\task\do_something',

        // At two intervals in the hour.
        'minute' => '5, 35',
    ],
];
```

### Disabled tasks

You can create a task that defaults to disabled by setting the field **disabled** to 1. Unless the administrator manually enables your task, it will not run.

This is useful if a task is only required in certain situations and shouldn't run on every server that has your plugin installed.
