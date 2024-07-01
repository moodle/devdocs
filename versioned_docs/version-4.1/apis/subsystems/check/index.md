---
title: Check API
tags:
  - API
---

A _Check_ is a runtime test to make sure that something is working well. You can think of Checks as similar and complimentary to the [PHPUnit](/general/development/tools/phpunit) and [Acceptance testing](/general/development/tools/behat) but the next layer around them, and performed at run time rather than development, or build time.

Like other forms of testing the tests themselves should be easy to read, to reason about, and to confirm as valid.

:::note

Many types of runtime checks cannot be unit tested, and often the checks **are** the test.

:::

Checks can be used for a variety of purposes including:

- configuration checks
- security checks
- status checks
- performance checks
- health checks

Moodle has had various types of checks and reports for a long time but they were inconsistent and not machine readable. In Moodle 3.9 they were unified under a single Check API which also enabled plugins to cleanly define their own additional checks. Some examples include:

- a password policy plugin could add a security check
- a custom authentication plugin can add a check that the upstream identity system can be connected to
- a MUC store plugin could add a performance check
Having these centralized and with a consistent contract makes it much easier to ensure the whole system is running smoothly. This makes it possible for an external integration with monitoring systems such as Nagios / Icinga. The Check API is expose as an NPRE compliance cli script:

```console
php admin/cli/checks.php
```

## Result states of a check

| Status | Meaning | Example |
| --- | --- | --- |
| N/A | This check doesn't apply - but we may still want to expose the check | secure cookies setting is disabled because site is not https |
| Ok | A component is configured, working and fast. | ldap can bind and return value with low latency |
| Info | A component is OK, and we may want to alert the admin to something non urgent such as a deprecation, or something which needs to be checked manually. |  |
| Unknown | We don't yet know the state. eg it may be very expensive so it is run using the Task API and we are waiting for the answer. NOTE: unknown is generally a bad thing and is semantically treated as an error. It is better to have a result of Unknown until the first result happens, and from then on it is Ok, or perhaps Warning or Error if the last known result is getting stale. If you are caching or showing a stale result you should expose the time of this in the result summary text. | A complex user security report is still running for the first time. |
| Warning | Something is not ideal and should be addressed, eg usability or the speed of the site may be affected, but it may self heal (eg a load spike) | auth_ldap could bind but was slower than normal |
| Error | Something is wrong with a component and a feature is not working | auth_ldap could not connect, so users cannot start new sessions |
| Critical | An error which is affecting everyone in a major way | Cannot read site data or the database, the whole site is down |

How the various states are then leveraged is a local decision. A typical policy might be that health checks with a status of 'Error' or 'Critical' will page a system administrator 24/7, while 'Warning' only pages during business hours.

## Check types and reports

Checks are broken down into types, which roughly map to a step life cycle of your Moodle System

### Environmental checks

Available from _/admin/environment.php_, environmental checks make sure that a Moodle instance is fully configured.

This page is a potential candidate to move to the new Check API but it slightly more complex than the other checks so hasn't been tackled yet. It would be a deeper change and this is intrinsically part of the install and upgrade system. It is not as critical to refactor as it is already possible for a plugin to declare its own checks, via either declarative [Environment checking](https://docs.moodle.org/dev/Environment_checking) or programmatically with a custom check:

### Configuration checks

Available from _/admin/index.php?cache=1_, the Admin notifications page performs a mixture of checks, including security, status, and performance checks.

None of these checks are as exhaustive as the checks in the reports below. It also does additional checks including whether the web services for the Moodle Mobile App are enabled, and whether the site has been registered.

### Security checks (security)

Available from _/report/security/index.php_, these checks make sure that a Moodle instance is hardened correctly for you needs.

For more information see [MDL-67776](https://tracker.moodle.org/browse/MDL-67776).

### Status checks (status)

Available from _/report/status/index.php_, a status check is an 'in the moment' test and covers operational tests such as 'can moodle connect to ldap'. The main core status checks are that cron is running regularly and there has been no failed tasks.

:::danger Important

It is critical to understand that Status checks are conceptually defined at the level off the application and not at a lower host level such as a docker container or node in a cluster. Checks should be defined so that whichever instance you ask you should get a consistent answer. DO NOT use the Status Checks to detect containers which need reaped and restarted. If you do, any status error will mean all containers will simultaneously be marked for reaping.

An additional status check is likely the most common type of check a plugin would define. Especially a plugin that connects to a 3rd party service. If the concept of 'OK' requires some sort of threshold, eg network response within 500ms, then that threshold should be managed by the plugin and optionally exposed as a admin setting. The plugin may choose to have different thresholds for Warning / Error / Critical. When designing a new Status Check be mindful that it needs to be actionable, for instance if you are asserting that a remote domain is available and it goes down, which then alerts your infrastructure team, there isn't much they can do about it if it isn't their domain. If it is borderline then make things like this configurable so that each site has to option of tune their own policies of what should be considered an issue or not.

:::

For more information see [MDL-47271](https://tracker.moodle.org/browse/MDL-47271).

### Performance checks (performance)

Available from _/report/performance/index.php_, each check might simply check for certain settings which are known to slow things down, or it might actually do some sort of test like multiple reads and writes to the db or filesystem to get a performance metric.

## Implementing a new check

### A check class

And make a new check class in `mod/myplugin/classes/check/foobar.php` and the only mandatory method is `get_result()`. By default it will use a set language string but you can override the `get_name()` method to reuse an existing string.

```php title="mod/myplugin/lang/en/myplugin.php"
$string['checkfoobar'] = 'Check the foos to make sure they are barred';
```

```php title="mod/myplugin/classes/check/foobar"
<?php
namespace mod_myplugin\check;
use core\check\check;

class foobar extends check {

    public function get_action_link(): ?\action_link {
        $url = new \moodle_url('/mod/myplugin/dosomething.php'),
        return new \action_link($url, get_string('sitepolicies', 'admin'));
    }

    public function get_result(): result {
        if (some_check()) {
            $status = result::ERROR;
            $summary = get_string('check_foobar_error', 'mod_myplugin');
        } else {
            $status = result::OK;
            $summary = get_string('check_foobar_ok', 'mod_myplugin');
        }
        $details = get_string('check_details', 'mod_myplugin');
        return new result($status, $summary, $details);
    }
}
```

### The result summary

The summary could change depending on the result of the check but for a simple check might be a fixed string, not html. Try to keep the summary to 1 line as this might typically be the thing which gets passed through to a paging system and could be truncated.

### The details

Unlike the summary the details is allowed and encouraged to be html. Often it will be a bullet list of a table of the things that it asserted which make up the check.

### The action link

The action link is the place to go to help fix the issue. It should be as specific as possibly, such as a deep link into an admin settings page, and can include hash anchors.

### lib.php callback

First decide if and when your new check(s) should be shown. Should it be present if your plugin is disabled? If you do not want it show if disabled then do not return it in callback below. If you do want it to show when disabled, but the check doesn't much sense then you can return a value of NA.

Next decide on what type of check it should be which determines what report it will be included in. Some checks might make sense to be reused with more than one report, eg it could be in both Status and Performance.

Implement the right callback in lib.php for the report you want to add it to, and return an array (usually with only 1 item) of check objects:

```php title="/mod/myplugin/lib.php"
function mod_myplugin_security_checks(): array {
    return [new \mod_myplugin\check\foobar()];
}
```

### Multiple instances of checks

Checks have been designed to be dynamic so you can return different checks depending on configuration, so auth_ldap would not return a check if the plugin is not enabled. Hypothetically if auth_ldap could be configured with 5 ldap servers then you could return 5 independent checks for each remote connection, each with different labels and information.

If you plan to return multiple instances of a check class, make sure that each instance has a unique id.

```php
function mod_myplugin_security_checks(): array {
    return [
        new \mod_myplugin\check\foobar('one'),
        new \mod_myplugin\check\foobar('two'),
    ];
}
```

Set the internal id in a way which is unique across all instances in your components namespace:

```php
namespace mod_myplugin\check;

class foobar extends \core\check\check {
    protected $id = '';

    public function __construct($id) {
        $this->id = "foobar{$id}";
    }

    public function get_id(): string {
        return $this->id;
    }
    ...
}
```

### Make checks as fast as practical

As many checks will be run and compiled into a report we want the checks themselves to be simple and as fast as possible. For instance an auth_ldap check while authenticating an end user could have a timeout of 60 seconds, and the check could warn if it takes more than 2 seconds. But the check could have a hard timeout of say 5 seconds and have a result status of ERROR for 5 or more seconds.

### Lazy loading expensive result details

Checks can provide details on a check, such as the complete list of bad records. Generally this type of information might be expensive to produce so you can defer this lookup until get_details() is called specifically rather than setting this in the constructor. It will only be loaded on demand and shown when you drill down into the check details page.

```php
<?php

namespace mod_myplugin\check;

class foobar extends \core\check\check {
    public function get_result(): result {
        return new foobar_result();
    }
}
```

```php
class foobar_result extends \core\check\result {
    ...
    public function get_details(): string {
        // Do expensive lookups in here.
    }
}
```

For a real example see:

https://github.com/moodle/moodle/blob/main/lib/classes/check/access/riskxss_result.php

### Asynchronous checks

Some checks are by their nature asynchronous. For instance having moodle send an email to itself and then having it processed by the inbound mail handler to make it's properly configured (see [MDL-48800](https://tracker.moodle.org/browse/MDL-48800)). In cases like these please make sure the age or staleness of the check is shown in the summary, and you should also consider turning the result status into a warning if the result is too old. If appropriate make the threshold a configurable admin setting.

## See also

- [Performance overview](https://docs.moodle.org/en/Performance_overview) user docs
