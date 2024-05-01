---
title: Penetration testing
tags:
  - Security
  - Processes
  - Testing
---
This is information for people who want to performing a penetration test of their Moodle instance as well as information for pen testers.

## Preparing for a penetration test

### Set debugging to normal

Either turn off all debugging which can disclose stacktraces etc, or show the pen testers how this can be toggled.

### Setup the environment like production

Sometimes a dedicated penetration test environment is setup and it is setup more like a dev / uat / stage environment which might have things like debugging on (see above). Generally a penetration test env should mirror a production configuration to avoid wasting pen testers time.

## Common non-issues

There are a number of things which pen testers often flag as issues which are more just the way Moodle works and are often misunderstood.

### XSS risks and capabilities

Moodle has a fine grained capabilities and roles system for providing access control to the whole system. Various capabilities inherently have an XSS risk, for instance an admin setting which allows an admin to inject arbitrary html and js into the sites header or footer. This is both known, and should be considered a feature and not a bug. So the presence of an XSS risk in itself is not a new or unknown issue.

However if a penetration test finds that actions can be taken which expose an XSS risk, **AND** that the test user has **NOT** been granted capabilities that grant them an explicit XSS risk, then there is a real issue and either the XSS risk should be closed, or it should be disclosed in the definition of that capability.

The most trivial example would be the ability to [edit `site:config`](https://github.com/moodle/moodle/blob/main/lib/db/access.php#L58-L60) which has the RISK_XSS:

```php
    'moodle/site:config' => [
        'riskbitmask' => RISK_SPAM | RISK_PERSONAL | RISK_XSS | RISK_CONFIG | RISK_DATALOSS,
        'captype' => 'write',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes' => []
    ]
```

:::info

See the [Roles and permissions](https://docs.moodle.org/en/Roles_and_permissions) page to learn how they work.

:::

### The sesskey param is a CSRF token

Many penetration tests highlight the use of the `?sesskey=xxx` HTTP parameter as a security issue, claiming that it leaks the session ID. This should generally be considered a false positive as Moodle's `sesskey` is not actually a session key, but a poorly-named CSRF token. The Moodle session ID is stored separately in a normal cookie.

Unfortunately it is not easy to rename this token at this time.

:::info

Learn more about how the sesskey works in Moodle in the [Cross-site request forgery](../../policies/security/crosssite-request-forgery.md#session-key) page.

:::
