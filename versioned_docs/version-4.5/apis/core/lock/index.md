---
title: Lock API
tags:
  - API
  - Lock
---

Locking is required whenever you need to prevent two, or more, processes accessing the same resource at the same time. The prime candidate for locking in Moodle is cron. Locking allows multiple cron processes to work on different parts of cron at the same time with no risk that they will conflict (work on the same job at the same time).

## When to use locking

When you want to prevent multiple requests from accessing the same resource at the same time. Accessing a resource is a vague description, but it could be for example running a slow running task in the background, running different parts of cron etc.

## Performance

Locking is not meant to be fast. Do not use it in code that will be triggered many times in a single request (for example MUC). It is meant to be always correct - even for multiple nodes in a cluster. This implies that the locks are communicated among all the nodes in the cluster, and hence it will never be super quick.

## Usage

The locking API is used by getting an instance of a lock_factory, and then using it to retrieve locks, and eventually releasing them. You are required to release all your locks, even on the event of failures.

```php
$timeout = 5;

// A namespace for the locks. Must be prefixed with the component name to prevent conflicts.
$locktype = 'mod_assign_download_submissions';

// Resource key - needs to uniquely identify the resource that is to be locked. E.g. If you
// want to prevent a user from running multiple course backups - include the userid in the key.
$resource = 'user:' . $USER->id;

// Get an instance of the currently configured lock_factory.
$lockfactory = \core\lock\lock_config::get_lock_factory($locktype);

// Get a new lock for the resource, wait for it if needed.
if ($lock = $lockfactory->get_lock($resource, $timeout)) {
    // We have exclusive access to the resource, do the slow zip file generation...

    if ($someerror) {
        // Always release locks on failure.
        $lock->release();
        print_error('blah');
    }

    // Release the lock once finished.
    $lock->release();

} else {
    // We did not get access to the resource in time, give up.
    throw new moodle_exception('locktimeout');
}
```

## Use a different lock type from the default

Change the $CFG->lock_factory setting to one of the other lock types included with core. These are all documented in config-dist.php.

## Implementing new lock types

If you really want to do this you can. I probably wouldn't recommend it - because the core lock types should be very reliable - and the performance is not really a concern.

Add a new local_XXX plugin with an autoloaded class that implements \core\lock\lock_factory.
Set the site configuration variable "lock_factory" to the full namespaced path to your class in the config.php for example

```php
$CFG->lock_factory = '\local_redis\lock\redis_lock_factory';
```

:::note

See `lib/tests/lock_test.php` for an example of unit tests which can be run on a custom lock instance to verify it for correctness (run_on_lock_factory).

:::
