---
title: Backporting
tags:
  - Processes
  - Core development
  - Integration
---

Whilst we'd all like all Moodle users to be using our latest and greatest code, there is a balance to strike between improving our software and maintaining stability (both in terms of regressions, but also training and documentation materials). Large amounts of change on the stable branches make the lives difficult for institutions to manage upgrades between point releases.

## General policy

Our general policy is as follows:

- Bug fixes will be backported to all (and only to) supported stable branches.
  - When fixing a bug, please provide a fix for all supported stable branches.
  - If a fix doesn't make sense to be backported to every branch, please make it clear in the issue.
- Improvements or new features will only land in `main`.

### Bug fixes for accessibility issues

As part of Moodle's commitment to accessibility, bug fixes for accessibility issues can be backported to the latest LTS branch whenever possible, in addition to the supported stable branches.

- This policy applies even when the LTS branch goes out of general support and into security support.
- Accessibility fixes will not be backported to non-LTS branches that are out of general support.
- If the LTS branch is out of general support and under security support, the Integration Team will exercise discretion in determining whether the accessibility fix is [safe enough](../process/integration/index.md#integration-principles) to be backported to the LTS branch.
- When the next LTS version is released, backporting of accessibility bug fixes will cease for the older LTS branch.
  - For example, accessibility bug fixes will be backported to the Moodle 4.1 LTS branch from its release up to Moodle 4.4's release. However, when Moodle 4.5 LTS is released, accessibility fixes will no longer be backported to the 4.1 LTS branch.

## Process for requesting a non bug-fix backport

Improvements or new features can be requested to be backported to the stable branches. We urge developers to consider this request carefully. In recent years, Moodle has moved to a short and predictable time based release schedule and we use a very effective distributed source control system. Both of these process changes should ensure that a change not being backported to the stable branches is not as problematic as it may have used to be.

Should you feel that a new feature or improvement needs backporting, please follow this process:

1. File a new issue.
2. Set the issue title using our backport template guide. (i.e. "Fix forum alignment (backport of MDL-99999)").
3. Link the original issue using link type "Will help resolve".
4. You should include clear rationale for the request to backport

The integration team will process backport requests, with the following guidelines:

1. The integration team will together consider each request individually considering the needs of the community (influenced by forum posts, moodle partners, discussion with developers via tracker or private message, etc).
2. Backport requests will be processed not earlier than 3 weeks and not later than 2 months after the original improvement/new feature has been integrated.
3. Rationale will be given for rejection

If the backport request is approved, please follow the usual development process to submit the feature or improvement on earlier branches. Just to be clear, this means using the new bug number. So, even if the fix you are back-porting cherry-picks cleanly, you will need to amend the commit comment to use the new MDL-XXXXX number.

:::tip

It would be good practice to also add a line like "This is a backport of MDL-YYYYY." in the amended commit comment.

:::

You can probably copy the testing instructions from the original issue. If so, make it clear you done this by saying something like "Copied from MDL-66327". Of course, if you can improve the instructions, feel free to edit. [MDL-66614](https://tracker.moodle.org/browse/MDL-66614) and [MDL-66327](https://tracker.moodle.org/browse/MDL-66327) are probably a reasonably good example fo what should be done.

## Polite note about bug classification

Many issues can be appropriately classified as borderline bug-fix/improvements. We politely request that developers do not try and 'game the system' by classifying their improvements as bugs intentionally. If your fix is in a grey area, please state your case for it being a bug fix clearly. The integration team will use their discretion where necessary.

## Backport fixes to unsupported branches

- Given the [general policy](#general-policy) above, only supported stable branches are candidates normally.
- In addition to this any security, privacy, data-loss, and regression, caused by any of the previous issue types are accepted to be fixed into security-only supported branches.
- In addition to the above, issues required to keep the testing infrastructure working and passing (GitHub Actions, Behat, PHPUnit, addressing random failures, including new Behat steps availability, and so on) will also be accepted when possible into security-only branches
- Backport to _unsupported_ branches will only be considered when the issue is a **direct regression caused by a bug fix** introduced by the very latest releases. This applies to both security-only and out-of-support branches.

A new weekly release will be performed including all the cases above, but [security issues that follow its own special process](../process.md#security-issues) and are released bi-monthly.

:::note Security issues and the `security_benefit` label

Issues labelled with the [`security_benefit` labelled issues](../tracker/labels.md) are not considered to be security issues and will not be backported automatically. These are typically _improvements_ to security rather than bugs or vulnerabilities.

:::

## See also

- [Integration review process](../process/integration/index.md)
- [Process](../process.md)
