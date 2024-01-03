---
title: Tracker guide
sidebar_label: Guide
tags:
  - Tracker
---
The [Moodle Tracker](http://tracker.moodle.org/) is our database for recording and managing all Moodle development issues - bugs, improvements and feature requests.

:::tip

For an intro guide to the tracker, see [Tracker introduction](./).

:::

To do anything more than browsing and searching in the tracker, you'll need to [create an account](http://tracker.moodle.org/secure/Signup%21default.jspa) and then login.

## Tracker groups and permissions

There are a number of groups used to define the potential of users in Tracker. Here are some important ones.

| Name  | Jira group  | Potential   | How to become one   |
|---|---|---|---|
| **Users**  | jira-users  | Users can create new issues, comment on issues, vote for issues, link issues, attach files, create sub-tasks and watch issues.  | Anyone who creates a tracker account becomes a member of the Users group.   |
| **Moodle Security**  | moodle-security  | Trusted developers and administrators who need to work on security issues that are hidden from normal users. See [Moodle security procedures](../process/security/index.md).  | This is generally limited to developers at Moodle HQ and Partner organisations. People wishing join the Moodle Security group should email [security@moodle.org](mailto:security@moodle.org) with the reasons for your request.  |
| **Developers**  | jira-developers   | Developers can edit issues and assign issues to themselves. They are also able to request peer reviews. They cannot submit code directly for integration review, but an HQ staff member or component lead can do this after a satisfactory peer review. See [Process](../process). | People wishing to join the Developers group should be able to demonstrate a history of contributing patches to issues.<br/><br/>When a developer's first patch is integrated, tested and the issue is closed, they are added to the group and set as issue assignee.<br/><br/>If that doesn't happen automatically, please send an email to [integration@moodle.com](mailto:integration@moodle.com) with your tracker username and links to issues where you have contributed patches.  |
| **Integration requesters**  | pull-requesters  | Developers can send issues for integration review. See [Process](../process).  | This role is reserved for Moodle HQ developers and component leads.  |
| **Integration testers**  | pull-testers  | Users that can tests issues under integration and pass/fail them. See [Process](../process).  | Usually reserved for HQ developers and external testers.  |

:::note

You can browse a project without being logged in to Tracker, however you will be to unable edit or comment on bugs.

:::

## Tracker fields

### When creating an issue

| Field  | Values  | Notes  |
|---|---|---|
| **Project** | <ul><li>**Moodle**<br/>For an issue relating to the Moodle codebase.</li><li>**Moodle Community Sites**<br/>For an issue on tracker.moodle.org, docs.moodle.org, demo.moodle.org, download.moodle.org, moodle.org, etc.</li><li>**Non-core contributed modules**<br/>For an issue with a contributed plugin.</li></ul><br/>There are a few more projects, but these are the main ones. | Tracker is used for multiple projects. |
| **Issue Type**  | <ul><li>**Bug**<br/>A problem which impairs or prevents Moodle from functioning correctly.</li><li>**Improvement**<br/>An enhancement to an existing Moodle feature.</li><li>**New Feature**<br/>A new Moodle feature which has yet to be developed.</li><li>**Task**<br/>A task that needs to be completed, usually apart from coding.</li><li>**Sub-Task**<br/>Part of a greater task</li></ul> |  |
| **Summary** | A brief, concise description of the problem. | When the issue is about applying an existing solution to another, usually older, branch (namely "[backport](../policies/backporting.md)"), please use the summary of the existing solution plus its issue number (i.e. "Fix forum alignment (backport of [MDL-99999](https://tracker.moodle.org/browse/MDL-99999))"). |
| **Description**  | A full and complete description of the issue including:<br/><ul><li>replication steps,</li><li>the expected result,</li><li>the actual result,</li><li>any error messages shown with [debugging](https://docs.moodle.org//en/Debugging) turned on, and</li><li>any other relevant information.</li></ul> |  |
| **Affects Version/s** | <ul><li>For bugs: the latest released version in which the bug is found</li><li>For improvements: the latest released version</li><li>For new features: Use 'Future dev'</li></ul> |  |
| **Component/s** | The area(s) in Moodle which is affected by the issue. | Select `Unknown` if you are unsure. |
| **Security Level** | <ul><li>**None**<br/>Viewable by everyone, including non-logged-in users</li><li>**Could be a security issue**<br/>Viewable by members of the jira-developers group</li><li>**Minor security issue**<br/>Viewable by members of the security team only</li><li>**Serious security issue**<br/>Viewable by members of the security team only</li></ul> | <ul><li>The reporter can view the issue they reported, regardless of the security level set.</li><li>The higher the security level, the fewer people who can view the issue.</li><li>The `Could be a security issue` should only be used temporarily when the issue is reported. A decision should be made as soon as possible to set another level.</li></ul> |

### When editing an issue

Once an issue has been created, the following additional fields are able to be changed/set by editing the issue. Not all users can edit all fields.

| Field  | Values  | Notes  |
|---|---|---|
| **Fixed Version/s**  | <ul><li>Prior to integration, this will be blank or set to a backlog (a queue of development work), for example `Must fix for X`.</li><li>After integration, this will be set to the Moodle version(s) the issue was fixed in, for example `4.0.1`.</li><li>For more detailed information, look to the **Resolution** field below.</li></ul>  | <ul><li>This is usually set by an integrator.</li><li>Not to be confused with `Affected version`, which is used to define the Moodle version where the issue can be reproduced.</li><li>If you resolve the bug as anything but `Fixed` and, sometimes, `Done` (like `Cannot Reproduce`, `Won't Fix`, etc.) leave **Fix Version/s** blank.</li><li>**Fix version/s** are used to automatically build release notes (see the tabs on [http://tracker.moodle.org/browse/MDL](http://tracker.moodle.org/browse/MDL))</li></ul>  |
| **Priority**  | <ul><li>**Blocker**<br/>Blocks development or testing, prevents Moodle from running. Applicable to bugs only.</li><li>**Critical**<br/>Crashes server, loss of data, severe memory leak</li><li>**Major**<br/>Major loss of function, incorrect output</li><li>**Minor**<br/>Minor loss of function where workaround is possible</li><li>**Trivial**<br/>Cosmetic problem like misspelt words or misaligned text</li></ul>  | <ul><li>When it is reported, the priority level represents the severity of a bug.</li><li>After being reported, the priority may be promoted by HQ developers and component leads as an issue escalates.</li><li>Other users wishing to influence the priority of issues should do so by voting for the issue.</li><li>The priority of new features and improvements should generally remain at the default (Minor) level.</li></ul>  |
| **Reporter**  | The person who logs the bug.<br/>This field is automatically filled by Tracker.  |   |
| **Assignee**  | The person who will fix the issue. The assignee should be set when there is a definite intention to complete the issue.  | <ul><li>Developers or QA Testers can reassign issues.</li><li>Please note that even though a person may be assigned to an issue, this does not mean they are currently working on the issue, although they are likely to in future.</li></ul>  |
| **Peer reviewer**  | The person who will check the fix at the code level. See [Peer-review](../process/peer-review/index.md). |   |
| **Integrator**  | The person who will integrate the code into the Moodle codebase. See [Integration-review](../process/integration/index.md). |   |
| **Tester**  | The person who will test the solution at a functional level, according to the test instructions provided. See [Testing](../process/testing/index.md). |   |
| **Environment**  | The operating system, server and/or browser specifications if applicable to this bug.  | Note that the database is specified separately in the database field below.  |
| **Database**  | If applicable to the bug, identify the database type.  |   |
| **Testing instructions**  | The steps that a tester should follow to achieve the expected behaviour after the issue has been resolved.  | <ul><li>This may be different to the replication steps reported in the description.</li><li>These instructions are written by the developer working on the issue.</li></ul>  |
| **Workaround**  | A way to achieve the desired functionality by other means.  | <ul><li>This will be very useful to other Moodle users who have the same problem, until the issue is resolved.</li><li>If the issue can be resolved by a simple code change, say one line, then you can give that as a workaround, although patches and Git branches are preferred.</li></ul>  |
| **Attachment**  | Patch files, Screenshots, example backups and other related files  | <ul><li>Attaching a file will help developers and testers better understand the bug.</li><li>Maximum attachment size is 512Kb.</li></ul>  |
| **URL**  | If possible, provide a URL address that demonstrates an example of this bug.  |   |
| **Epic Name**  | A short name given to an issue of type Epic so that linked issues can be grouped by this name. It should only be a few words at most.  | Only applies to issues of type Epic.  |
| **Epic Link**  | A link to an Epic issue. This can be added by providing the issue ID or Epic name. It is a way of organising related issues as part of a project.  | Only applies to issues that need to be collected together for a project.  |
| **Labels**  | See [Tracker issue labels](./labels.md).  | <ul><li>Labels should be specific values used in filters and searches.</li><li>This is not a field for including generic keywords.</li></ul>  |
| **Pull...**  | Links to a code solution in a Git repository.  | <ul><li>These fields are used by developers.</li><li>There may be multiple solutions if the problem affects multiple Moodle versions.</li></ul>  |
| **Documentation link**  | URL of related documentation.  | When changes require documentation to be updated, this field should be filled.  |
| **Comment**  | <ul><li>Notes made by all interested parties.</li><li>A detailed register of all changes that relate to this bug.</li></ul>  |   |

### When closing an issue

| Field  | Values  | Notes  |
|---|---|---|
| **Resolution**  | Issues that may/must have the **Fixed versions** field filled:<ul><li>**Fixed**<br/>Issue has been fixed; a code change has been integrated into Moodle code. It's **mandatory** to set the *Fixed versions* field for these issues.</li><li>**Done**<br/>Normally used for tasks, epics... issues that don't "own" code changes in Moodle, but still have required actions (planning, review, adjust some related system...). When relevant or clearly related with any release it's **recommended** to set the *Fixed versions* to them.</li></ul>Issues that must not have the **Fixed versions** field filled:<ul><li>**Won't Fix**<br/>The problem described is an issue which will never be fixed. Specific reasons should be given.</li><li>**Not a bug**<br/>This issue is not a bug. The issue may have been logged in error. Use this code if the bug was fixed by another bug report or in some earlier Moodle version.</li><li>**Duplicate**<br/>The problem is a duplicate of an existing issue</li><li>**Incomplete**<br/>More information was needed to understand this bug, but it was not provided.</li><li>**Can't Reproduce**<br/>Attempts at reproduce the issue failed. If more information appears later, please open a new issue.</li><li>**Deferred**<br/>The resolution to this bug will be deferred to a later release or to a fix in a third-party plugin used in Moodle.</li></ul>  | This field is only displayed when resolving or closing a bug.  |

## See also

- [Tracker introduction](./) - less scary version of this page for new users.
- [Process](../process)
- [Bug triage](../process/triage.md)
- [Tracker issue labels](./labels.md)
- [Testing of integrated issues](../process/testing/integrated-issues.md)
- Using Moodle [How to manipulate Moodle developers](http://moodle.org/mod/forum/discuss.php?d=43952) forum discussion
- Wikipedia [Definition of a bug](http://en.wikipedia.org/wiki/Software_bug)
