---
title: Scheduled tasks
tags:
  - API
  - Tasks
  - Subsystem
  - Scheduled
---

Scheduled tasks are tasks that will run on a regular schedule. A default schedule can be set, but administrators have the ability to change the default schedule if required.

:::note

Tasks will only run as often as cron is run in Moodle. It is recommended that cron be run at least once per minute to get the most benefit from the task scheduling.

:::

## Creating scheduled tasks

To create a new scheduled task and set its default configuration you should:

1. create a new class which extends the `\core\task\scheduled_task` class;
2. create an entry for your scheduled task in the `db/tasks.php` file within your plugin; and
3. increment the version number for your plugin.

### Task class

The class for your scheduled task, which extends the `\core\task\scheduled_task` class, should be in the `classes/task` directory of your plugin.

<details>

<summary>View example scheduled task</summary>

```php
namespace mod_example\task;

/**
 * An example of a scheduled task.
 */
class do_something extends \core\task\scheduled_task {

    /**
     * Return the task's name as shown in admin screens.
     *
     * @return string
     */
    public function get_name() {
        return get_string('dosomething', 'mod_example');
    }

    /**
     * Execute the task.
     */
    public function execute() {
        // Call your own api
    }
}
```

</details>

### db/tasks.php

<!-- markdownlint-disable no-inline-html -->
import { DbTasksPHP } from '../../_files';

<DbTasksPHP />

## Running tasks for disabled plugins

In rare cases, you may want the scheduled tasks for a plugin to run, even when the plugin is disabled. One example use-case is in Enrolment plugins where a disabled plugin must still clear up data.

To support this, your scheduled task must override the `get_run_if_component_disabled()` method to return `true`.

## Debugging

When called from the command line for testing purposes errors can be hidden and a misleading error about locks can be displayed. You can view more information of the error using the [`--showdebugging`](https://docs.moodle.org/en/Administration_via_command_line#Scheduled_tasks) parameter when calling the scheduled task from the CLI.
