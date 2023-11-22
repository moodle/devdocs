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
- Improvements or new features will only land in master.

## Process for requesting a non bug-fix backport

Improvements or new features can be requested to be backported to the stable branches. We urge developers to consider this request carefully. In recent years, Moodle has moved to a short and predictable time based release schedule and we use a very effective distributed source control system. Both of these process changes should ensure that a change not being backported to the stable branches is not as problematic as it may have used to be.

Should you feel that a new feature or improvement needs backporting, please follow this process:

1. File a new issue.
2. Set the issue title using our backport template guide. (i.e. "Fix forum alignment (backport of MDL-99999)").
3. Link the original issue using link type "Will help resolve".
4. You should include clear rationale for the request to backport

The integration team will process backport requests, with the following guidelines:

1. The integration team will together consider each request individually considering the needs of the community (influenced by forum posts, moodle partners, discussion with developers via tracker or private message, etc).
2. Backports will happen not earlier than 3 weeks and not later than 2 months after the request was performed.
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
- Also security, privacy, data-loss and regressions caused by any of the previous issue types are accepted to be fixed into security-only supported branches.

:::note

This doesn't include [`security_benefit` labelled issues](../tracker/labels.md).

::::

- Apart from the previous, issues required to keep the testing infrastructure working and passing (github actions, behat, phpunit, random failures, new steps availability...) will also be accepted when possible into security-only branches.
- Finally, backport to unsupported branches only will happen when the issue is a **direct regression caused by a bug fix** introduced by the very latest releases. This applies to both security-only and out-of-support branches.

A new weekly release will be performed including all the cases above, but [security issues that follow its own special process](../process.md#security-issues) and are released bi-monthly.

## See also...

- [Integration review process](../process/integration/index.md)
- [Process](../process.md)
