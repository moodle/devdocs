---
title: Task API
tags:
  - API
  - Tasks
  - Subsystem
---

The Moodle Tasks API is a comprehensive API to support the scheduling and running of tasks. Tasks are individual activities which are to be performed, and come in two primary forms:

- Scheduled tasks - tasks which run regularly and according to a schedule set by the administrator, with the same configuration each time; and
- Adhoc tasks - tasks which are queued by developers, capable of having multiple concurrent executions, and with individual configuration.

Good uses for tasks include:

- running a slow operation in the background
- running a maintenance task on a regular schedule

In general any operation that takes more than a few seconds might be a candidate for a task.

## Benefits

- Better user experience (give the user feedback immediately, that their task has been queued)
- Prevent browser timeouts
- Better performance for clusters (tasks can be run on separate, non-user-facing cluster nodes, tasks can run in parallel)
- Failed tasks will be retried
- A better user interface will prevent users queuing multiple tasks, because they thought it had "got stuck".

:::note

Tasks will only run as often as cron is run in Moodle. It is recommended that cron be run at least once per minute to get the most benefit from the task scheduling.

:::

## Types of task

### Scheduled tasks

Scheduled tasks are tasks that will run on a regular schedule. A default schedule can be set, but administrators have the ability to change the default schedule if required.

See the [scheduled tasks](./scheduled.md) page for more information on creating scheduled tasks.

### Adhoc tasks

Adhoc tasks are typically used when you need to queue something to run in the background either immediately, where they would be executed as soon as possible, or as a one-off task at some future point in time.

Each adhoc task can be called multiple times, with each having its own custom data, and the ability to run as a different user.

Adhoc tasks are great for situations such as:

- perform a pre-configured backup
- migrate large quantities of data between different formats
- send forum posts as an e-mail

## Usage

### Failures and error handling

A task, either scheduled or adhoc, can sometimes fail. An example would be updating an RSS field when the network is temporarily down. This is handled by the task system automatically - all the failing task needs to do is throw an exception. The task will be retried after 1 minute. If the task keeps failing, the retry algorithm will add more time between each successive attempts up to a max of 24 hours.
Therefore, if the task fails, it is OK for your code to just throw an exception. The task system will catch it an log it for you, and schedule the retry.

However, sometimes it is a good idea to catch exceptions. For example, if your task loops over courses, doing some processing for each one,
then it is better if an exception triggered in one course does not block processing of other courses. This requires some manual exception handling.
If you catch an exception, then you become responsible for things that the task system normally handles.
For example, it is important to log all the details of the error, so problems can be investigated and fixed. The helper function
`mtrace_exception` makes this easier. Also, you need to consider: if something has gone wrong with part of the processing, but other parts succeeded,
should the overall state of the task run be success or failure? It will depend on how the task works, but you may need to ensure that the task
ends by throwing an exception if any part failed. There is a an example of all this in the [`\quiz_statistics\task\recalculate`](https://github.com/moodle/moodle/blob/main/mod/quiz/report/statistics/classes/task/recalculate.php).

### Caches

Historically many Moodle APIs have used static caches. Whilst many of these have been replaced by the [Moodle Universal Cache](../muc/index.md), which can be cleared between runs, it is not possible to guarantee that this is always the case.

When working with long-running tasks, you may need to consider caching - this applies to both scheduled, and adhoc, tasks. This is particularly true for tasks related to enrolment.

After a long-running task completes, the next task in the queue may suffer because various API's in moodle use static caching to speed up requests, but assume that the data will not change much between the start and end of the request. In this case, you can force the task runner to exit after completing a task that has performed many changes. The next task run will take place shortly after, and will have all static caches cleared because it takes place in a new process.

You can enable this behaviour by making a call to `\core\task\manager::clear_static_caches()` at the end of your task.

### Security

When scheduling a task to run in the background, or creating a scheduled task, the task will run as the cron user (see `cron_setup_user()`). If you need to perform access checks in your background task, you should do so as the user that the checks relate to.

In the case of an adhoc task, you can call the [`set_userid`](./adhoc.md#running-as-a-specific-user) function when queueing the task.

For scheduled tasks you should either pass the ID of the user to the `require_capability()` function, or use the `cron_setup_user()` function to switch to that user.

### Generating output

Since Moodle 3.5 it is safe to use the [Output API](../output/index.md) in cron tasks. Prior to this there may be cases where the Output API has not been initialised.

In order to improve debugging information, it is good practice to call `mtrace` to log what's going on within a task execution:

```php
class my_task extends \core\task\scheduled_task {
    public function execute() {
         mtrace("My task started");

         // Do some work.

         mtrace("My task finished");
    }
}
```

## For Administrators

Several tools exist for administrators:

- The task log viewer allows administrators to view logs from both adhoc and scheduled task runs
- The scheduled task manager allows administrators to configure the time schedule for tasks
- The 'Tasks running now' tool allows administrators to view key details of any task currently running

## Important notes

### Blocking tasks

<Since version="4.4" issueNumber="MDL-67667" />

Support for tasks which block all other tasks has been removed. The ability to configure a task as blocking is no longer supported and will not work.

This functionality had the ability to cause significant performance issues, and contained a number of serious bugs.

If you are using this functionality in older versions of Moodle you are advised to move away from it as soon as possible in all Moodle versions.

### Legacy cron

<Since version="4.3" issueNumber="MDL-61165" />

Support for an older syntax using `cron.php` or `modname_cron()` was removed in Moodle 4.3.

:::caution

All legacy cron features **must** be converted to Tasks.

:::
