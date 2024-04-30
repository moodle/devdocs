---
title: Automated code review
tags:
  - Coding guidelines
  - Tools
---
Moodle issues submitted for review and inclusion into core are examined by our continuous integration (ci) system and checked against various automated tests. We use the automated checks to help improve the code quality in Moodle.

## What is CiBot?

CiBot is our automated code checker and it will run checks against any issues waiting for peer review, sent for integration or requested to be checked by the developer. It will report problems discovered in lines of your patch which you are changing.

## Will an issue be automatically rejected if CiBot checks fail?

No. Developers should strive to have CiBot approve every patch submitted, but the integration team will take a pragmatic approach to things like:

- Occasions where CiBot will detect issues present in existing code
- Variations from commit message style which make the commit message more understandable overall

## Should coding style issues in existing code be fixed?

In short, please only update lines relating to your own change.

There are some conventions that are not uniformly followed in the code base, many of these are conventions put in place after code was written. Our long term goal is for the entire codebase to follow the conventions, but in general, we don't want large-scale reformatting of existing code. See [Coding style#Policy about coding-style only fixes](../policies/codingstyle/index.md#policy-about-coding-style-only-fixes).

### Example "Should I fix coding style" situations

**a) Spacing of if statements is incorrect on the line being changed**

This can be corrected without affecting existing code, so should be fixed.

**b) The line being changed contains an invalid variable name**

If correcting this variable would affect other parts of the code not covered by the patch then it's not reasonable to fix it.

## Requesting CiBot checks an issue

At any time a developer can add the label `cime` to an issue to request it runs it checks against it. The bot [checks for issues with the cime label](https://github.com/moodlehq/moodle-local_ci/blob/main/tracker_automations/bulk_precheck_issues/criteria/developer_request/query.sh) every 20mins and runs the checks then remove the cime label. (Note that because it removes the label, it is normal to 'create' the label).

Any issue [submitted for peer review](https://github.com/moodlehq/moodle-local_ci/blob/main/tracker_automations/bulk_precheck_issues/criteria/awaiting_peer_review/query.sh) or [integration review](https://github.com/moodlehq/moodle-local_ci/blob/main/tracker_automations/bulk_precheck_issues/criteria/awaiting_integration/query.sh) will be checked automatically as long as it does not already have the 'ci'  label.

## Are additional CiBot checks possible?

Yes. It is planned to add more checks - (see [MDLSITE-3267](https://tracker.moodle.org/browse/MDLSITE-3267)) and developers are encouraged to suggest new checks in that issue. Note that some limitations exist:

- The checks should be consistent and completely reproducible
- The check should complete in minutes not hours (other solutions are in planning for longer term tests)

## How do I report bugs in the CiBot report?

Please [file an issue](https://tracker.moodle.org/secure/CreateIssueDetails!init.jspa?pid=10020&issuetype=1&components=12431&summary=Problem%20with%20CiBot%20results%20on%20MDL-XXXXX) in the MDLSITE project, Integration component.

## The git commit summary  limit is too small

When you overrun the length limit many git tools do not display commits well. See how [github truncates ea6f548081](https://github.com/moodle/moodle/commits/ea6f5480818c31763f91a90a0cafb6a63ca18117) - it ruins the message and makes it harder for you to communicate your change to other developers.

It is acknowledged that its often tricky to get a useful message in such a short space on the first line. However, the coding guidelines for git summary line length were established on the basis of [industry](https://github.com/blog/926-shiny-new-commit-styles) [best](http://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/Documentation/SubmittingPatches?id=aad7fb916a10f1065ad23de0c80a4a04bcba8437#n594) [practice](http://stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting). As the [Coding style](../policies/codingstyle/index.md#git-commits) mentions, do not be afraid to go into much more detail in your commit body.

Try `git log --oneline --no-merges` if you want to see how other developers have tried to adapt to this situation.

## Branches based off integration.git

The integration.git repository exists separately from moodle.git intentionally to indicate that its the place that **history rewrites will happen**. If a branch is based on outdated history which has been rewritten and is later attempted to merge it will result in a  mess (repeated history, attempt to re-introduce previously reverted changes). It is for this reason that we strongly recommend against any branches being created based on the integration.git branches due its changing nature. This problem is emphasised because history rewrites will commonly happen at the end of a weekly cycle, immediately before releasing the changes to moodle.git.

There are some rare cases where basing a branch off integration.git might be sensible:

- Where the change would have non-trivial conflicts with integration.git changes (e.g. two commits changing the same function)
- Could not be branched from moodle.git with these conflicts resolved
If this case applies:
- CiBot will warn about the branch being based off integration.git
- The developer is expected to rebase once integration.git changes have been introduced to moodle.git to ensure that history-rewrites will not cause a merge mess

If these case do not apply, we expect that you **do not** produce your branches based on integration.git.

## Why are issues held up by trivial issues reported which don't affect the functionality of the change?

Moodle is a large software project, it is common that 50 different developers will change the same file. Some may produce one fix and never be seen again, others will produce hundreds of fixes. The purpose of our coding conventions is to help all developers communicate with a consistent style so that we can look at all changes and understand their purpose with out getting distracted by changes in style.

While the issues reported might be trivial compared to benefit of the fix, over the long term, communicating your change well through coding and commit conventions might be far more important.

>" programs must be written for people to read, and only incidentally for machines to execute"

― Hal Abelson, Structure and Interpretation of Computer Programs

## See also

- [Coding style](../policies/codingstyle/index.md) and other links in the [coding guidelines category](https://docs.moodle.org/Category/Coding_guidelines)
