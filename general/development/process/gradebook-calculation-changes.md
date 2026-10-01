---
title: Gradebook calculation changes
description: Requirements for fixes which may change existing grades.
tags:
  - Processes
  - Core development
  - Gradebook
sidebar_position: 6
---

Gradebook fixes must not change existing grades without the agreement of a teacher or administrator. When a fix may change calculated grades in an existing course, the gradebook must continue using the previous calculation until an authorised user accepts the change.

This process is only required when a change may affect existing grades. Other gradebook fixes follow the normal development process.

## Fixing a calculation issue {/* #fixing-a-calculation-issue */}

Choose an ordered freeze number for the calculation revision, conventionally using `YYYYMMDD`. Use the same number in the code and in the user documentation.

Keep the original calculation available while the affected course is frozen:

```php
$gradebookcalculationsfreeze = get_config('core', 'gradebook_calculations_freeze_' . $courseid);

if ($gradebookcalculationsfreeze && (int) $gradebookcalculationsfreeze <= $freezenumber) {
    // Use the original calculation.
} else {
    // Use the fixed calculation.
}
```

Apply the frozen behaviour to every affected calculation, display, and editing path. Avoid repeatedly retrieving the freeze value inside grade-processing loops.

During upgrade, identify affected courses and set `gradebook_calculations_freeze_[courseid]` to the freeze number only when a freeze is not already present. An existing earlier freeze must not be replaced by a later revision. Place reusable upgrade functions in `lib/db/upgradelib.php` so they can also be used when restoring courses.

New installations must not be marked as affected. Include the current freeze state in course backups and restore it where appropriate. When restoring a backup created before the fix, use the backup build number to determine whether the calculation needs to be updated. Prefer a solution which can be applied by regrading the gradebook; directly altering grades in the database makes restoration significantly more complex.

The freeze must only be removed when an authorised user accepts the change. Moodle will then regrade the course using the fixed calculation.

## Documentation {/* #documentation */}

Add details of the fix to [Gradebook calculation changes](https://docs.moodle.org/en/Gradebook_calculation_changes), including the freeze number, the possible effect on grades, and a link to the tracker issue.

## Tests {/* #tests */}

Add acceptance tests to confirm that grades remain unchanged while the gradebook is frozen and that the issue is fixed after the change is accepted. Add unit tests for any functions in `lib/db/upgradelib.php`. Cover affected and unaffected courses, preservation of an existing freeze, and backup and restore behaviour.
