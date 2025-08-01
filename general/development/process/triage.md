---
title: Bug triage
tags:
  - Processes
  - Tracker
sidebar_position: 1
sidebar_label: Triage
---

Triage is a medical term referring to the process of prioritising patients based on the severity of their condition so as to maximise benefit (help as many as possible) when resources are limited.

Bug triage is a similar process where tracker issues are screened and prioritised. The triage process should help ensure that we appropriately manage all reported issues - bugs as well as improvements and feature requests.

Triage initially happens shortly after the issue was reported but it can be repeated later if the initial assumptions were wrong, the issue was resolved in another way, the affected versions need updating, or there are other reasons to review the issue.

## Get involved

Anyone can do triage in the form of correcting the components and/or affected versions, linking to related issues, and of course commenting asking for clarification, confirming bug, redirecting to the forums, and more. Users in **jira-developers** and **moodle-triage** groups can edit any issue, **jira-users** can comment on any issue or edit issues they reported. Please see [MDLSITE-3592](https://moodle.atlassian.net/browse/MDLSITE-3592) if you are not a developer but would like to help with the triage process.

Adding the `triaged` label and placing the issue on the backlog should only be done by the component lead, or an HQ developer. Any user can remove the `triaged` label from the an issue, or replace it with `triaging_in_progress` if they want to request an additional triage.

## The triage process

### Initial screening

First of all, identify the issues that should be closed or placed under investigation. Ask the following questions:

- **Is the issue a request for support/help?** If so, the reporter should be directed to the forums to seek help and the issue should be closed as `Not a bug`. Sometimes improvement requests can be phrased as a question, though; if this is the case, ask the reporter to reword the description to describe an improvement.
- **Has the reporter mistaken the Moodle Tracker with their own support desk?** Sometimes people mistake the Moodle Tracker as a place to request help about their own Moodle instance, often about logging in. We need to refer the user to their instance administrators and close the issue as `Not a bug`.
- **Has the issue been reported previously?** If so, link to a duplicate issue and close the newly reported issue as a `Duplicate` with no fix version set. Encourage the reporter to search before reporting. If a newer issue has a patch or more voters/watchers, consider closing the older issue. Checking for duplicates first will save you having to check the rest of the issue. See [Tracker tips](../tracker/tips) for help with effective search of tracker.
- **Does the problem only affect unsupported versions?** If so, the issue should be closed using `Fixed` (preferred as it sounds better) when the issue is resolved in current versions, or `Not a bug` when the issue has disappeared due to changes leading to current versions. See the [Releases](../../releases.md) page to for the list of currently supported versions
- **Did the problem arise because of a mistake or lack of documentation?** If it appears that the reporter does not understand a particular feature in Moodle and the documentation is lacking, ask the reporter where would they expect to find documentation about it. Then simply edit the relevant pages in the documentation wiki and close the issue. If the required change is significant, add the `Documentation` component and the `docs_required` label.
- **Is the problem a language string change?** Language string problems can be corrected by [contributing a translation](https://docs.moodle.org/dev/Contributing_a_translation) or by contacting the language pack maintainer as listed in the [Translation credits](https://lang.moodle.org/local/amos/credits.php). English language string typo fixes and suggested improvements can be [contributed to the English (fixes) (en fix) language pack](https://docs.moodle.org/dev/Improving_English_language_strings) or given the component `Language` for fixing by the Language component lead. Such issues should be closed in the Tracker using `Deferred`.
- **Is it a usability issue?** If so, add the component `Usability` in addition to the component(s) specifying the area of Moodle.
- **Was the problem caused by additional code or 3rd party plugins?** If you can identify the plugin, move the issue to the respective component of the CONTRIB project. Otherwise comment and close as `Not a bug`.
- **Can this be implemented as a plugin?** And maybe the plugin already exists in the plugins directory. An explanation should be given to the reporter that Moodle provides the framework but does not work on any possible plugin. Add the  `addon_candidate` label but do not close the issue. This approach can also apply to the requests to significantly redesign existing plugins and where it would be more preferable to create an alternative plugin.
- **Does the problem seem rational?** If not, then the problem may simply be a misunderstanding on the part of the reporter. It might be a problem exclusive to the reporter's server set-up. If you can replicate the problem quickly, do so. If you can't replicate the problem, ask the reporter to attempt to replicate the problem on [https://sandbox.moodledemo.net/](https://sandbox.moodledemo.net/). If the problem seems persistent but strange, consider asking a developer with experience working in the area to consider the problem and determine if it could be a real problem.
- **Can the problem be replicated?** If not, or information on the issue is insufficient, ask the reporter to add error messages, screenshots, environment information (OS, web server, browser) and exact replication instructions

As a result of this initial screening, up to 20% of new issues may be closed. When closing the issues make sure to set the correct resolution and write a polite comment with explanation, refer to the templates below. If you have doubts, ask the questions and always add the [`triaging_in_progress`](https://moodle.atlassian.net/issues/?jql=labels%20in%20%28triaging_in_progress%29) label. Subscribe to the [My old issues in triage](https://moodle.atlassian.net/issues/?jql=labels%20in%20%28triaging_in_progress%29%20AND%20project%20%3D%20MDL%20AND%20resolution%20%3D%20Unresolved%20AND%20Participants%20%3D%20currentUser%28%29%20AND%20updatedDate%20%3C%20-30d) filter and you will receive notifications after 30 days of inactivity on such issues. See [Tracker tips](../tracker/tips) about how to subscribe to filters. Often reporters never follow up on their own issues and this is a good way to find such issues. Ping the reporter again or make a final decision about closing.

### Confirming the issue

When you confirm that the issue is indeed a bug or a reasonable improvement request that was not reported previously, make sure that the following is accurate:

- **Security level**. The security level must be set as soon as possible if the reported bug discloses any vulnerability in Moodle that can be exploited to access information without appropriate level, create an attack on the site, embed XSS or forge a request. In some rare cases Improvements may be also marked as security issues.
- **Summary**. The summary of the issue should clearly describe the problem or improvement area. Update or rephrase summaries like "Some improvements in xxx" or "Error in Moodle", etc.
- **Issue Type**. The following issue types are used in Moodle:
  - **Bug** - represents an actual bug which should be fixed in all supported versions. Often a reporter expects something to be better than it actually is and they call it a bug when it's in fact an improvement.
  - **Improvement** - improvement to existing functionality. If addressed, this will be integrated into the next major release only
  - **New feature** - completely new feature, also will not be applied to the released versions (unless implemented as a plugin and submitted to plugins directory)
  - **Task** - usually created by developers themselves and can not be classified as Bug or Improvement, for example, adding automated tests, improving documentation, etc.
  - **Epic** - created by HQ developers or component leads to collect issues together that represents parts of one project. **META** issues and **sub-tasks** should not be used any more
- **Priority**. Some reporters over-state an issue's priority. Some reporters don't know they can set a priority. Priority is used as one of the criteria when sorting issues in the backlog, so it should reflect the position of this issue comparing to the others. Usually **Improvements** have `minor` or `major` priority and **Bugs** can have any priority up to `blocker`. Priority levels have specific criteria. Please see [the Tracker guide](https://docs.moodle.org/dev/Tracker_Guide#When_editing_an_issue)
- **Component/s**. Listing components correctly is important as they are the primary variable used for searching for issues. In addition the component leads will be added as watchers automatically when. Issues may have several components when needed
- **Affects version**. This field should include one or more released **and supported** versions of Moodle that are affected by the issue, with the following exceptions:
  - The issue is a bug in code that is present in the `main` branch only, in which case the next major version should be used. (The next major version should not be used in conjunction with previous released versions, this won't make sense later.)
  - The issue is a new feature and is unrelated to any existing code in Moodle, in which case the `Future dev` version should be used.
- **Labels**
  - Remove functionality tags that some reporters add as labels, only  [standard labels or partner-specific labels](../tracker/labels.md) are used in Moodle
  - Issues with proposed fixes should be labelled with `patch` so that they can be found easily and given attention. When this is the case, consider whether moving the issue to the `Waiting for peer review` state in the workflow might be more appropriate
  - Add the `addon_candidate` label if the functionality can be implemented as a plugin;
  - If you are the component lead or an HQ developer you may also add `triaged` label to indicate that the triage process is completed. Use it only when the issue has actually been added to the backlog

:::info

Note that `Fix version` is no longer used during triage. If you are in the `moodle-triage` Jira group, you can use the **Triage and sprint** screen to edit only the aforementioned fields, see [MDLSITE-3592](https://moodle.atlassian.net/browse/MDLSITE-3592).

:::

When commenting on the issue give more details on replication, environment or testing. Ask questions, request screenshots, add watchers, modify the description if needed. Link to as many related issues as possible. Do everything that will make the issues scope more clear and attract opinions, discussions and patches.

:::tip Be grateful

Don't forget to show **Gratitude and encouragement**.  After triaging many issues, it's easy to lose sight of the fact that the reporter has contributed their time and energy to report an issue for the benefit of the community.

It is easy to become defensive of Moodle if reports are seen as criticism (and sometimes reporters may use phrasing that suggests this), however the triagers response must always be one of sincere gratitude.

:::

It is also important to encourage reporters to continue being involved with the issue after it is triaged. We must not give the sense that we are taking the issue ownership away from the reporter. Instead the reporter should be encouraged to discover the cause of the problem and present a solution; this is appropriate in an open-source project. It is amazing that such a challenge can lead to a sense of purpose for the reporters.

### Following up on issues

The Moodle Tracker is set up so that when you comment on, or edit an issue, you become an automatic watcher and any later changes to the issue will be emailed to you. This is a user preference and you can disable it if you prefer.

If you have encouraged the reporter well, they may **submit a patch** or somebody else may do it. Make sure that the `patch` label is added or the issue is sent to `Peer review`. If the `patch` label was added by somebody else but you clearly see that patch is far from ready, remove the label and leave a comment explaining it.

Users may also comment with additional details, screenshots, replicating instructions. It may happen that the issue gets re-evaluated and priority or summary changed.

### Revisiting old issues

While searching the tracker you may come over issues that were reported a long time ago but still remain open. Again, ask the following questions:

- **Is this still an issue?** If it is not applicable any more either close it or comment about it on the issue and recommend to close. Very few tracker users actually have permission to close issues but the component lead or watchers will see your comment and revisit the issue. Another good practice is to replace the `triaged` label with `triaging_in_progress` and add a comment asking if the issue can be closed.

:::warning Closing issues

If users confirm that the problem was resolved, or if nobody replies in 30 days, you should close the issue.

:::

- **Do affected versions need correction?** If the issue is still applicable, make sure to add missing current affected versions or comment about it on the issue if you can't edit it.
- **Does the issue have a patch and if yes, is it still applicable?** If the issue has a patch that still works but the
`patch` label is missing, look through comments or history to see if the `patch` label was removed after reviewing the current patch. If you find that label was never added, do it yourself. If the issue has the `patch` label but the patch is no longer applicable or not sufficient, remove the label and comment explaining why.
- **Are there any duplicating issues?** When finding duplicates among the old issues it might not be obvious which issue to close as a duplicate. Usually we should leave the first reported issue but if the later issues have more watchers, better description, more votes, useful comments, attached patch, etc. you may decide to close the earlier issue and leave the later. Sometimes both issues have lots of watchers and they both remain open.

:::tip

Always create links between duplicates or related issues, whether you close an issue or not.

:::

- **Does the issue have an assignee who forgot about it or a misleading status (for example `Development in progress` for a long time)?** Due to some process changes in 2013 some issues still have a real user in the **Assignee** field but this user does not actually work on the issue. Sometimes the **Assignee** remains filled after failing `Peer review`, sometimes developers simply forget that the issue was assigned to them. If you suspect that the **Assignee** is not actually working on the issue, comment asking they about it and in some cases remove the **Assignee** completely. Allow somebody else to work on the issue without feeling that the issue is "taken". Please also note that for some time the tracker had a restriction that **Assignee** could not be empty so you can find lots of issues assigned to **moodle.com** or **Nobody**. Do not modify such issues as this creates unnecessary activity, emails to watchers and irrelevant change in the "Last update date".

### Comments templates

In the tracker, you'll find a few **Canned responses** in the **Project templates** section with some of the most typical messages you can re-use and adapt to deal with the previous scenarios. For instance:

- **Closing: affects unsupported versions**, when the issue can only be reproduced in unsupported versions.
- **Closing: already possible**, to redirect someone making a 'feature request' that already exists.
- **Closing: contact your administrator**, to refer the user to their instance administrator.
- **Closing: contributed plugin (insert plugin name!)**, when it's a bug in a contributed plugin.
- **Closing: duplicate (insert issue number!)**, to close duplicated issues.
- **Closing: en_fix**, when it's a correction to English language strings.
- **Closing: support request**, to redirect someone with a support request.
- **Closing: translation request**, when it's a request to correct a translation.
- **Triaged: bug request**, when triaging a bug report.
- **Triaged: improvement**, if an improvement or a new feature is triaged.
- **Triaged: security bug**, when a security bug is triaged.
- **Triaging in progress: request more info**, if more information is required to decide whether to triage the issue or not.

:::tip Use canned responses

You can search, re-use and adapt any of the messages in the **Canned response** selector, placed in the tracker editor:
![Canned responses in Tracker](./_files/cannedresponses.png)

:::

## Triaging priorities and the Triaging Dashboard

The following are the priorities for ordering issues to be triaged that are reflected on the [Triaging dashboard](http://moodle.atlassian.net/secure/Dashboard.jspa?selectPageId=11153).

1. Security issues - should always be reduced to 0
2. High-priority issue - aim for blockers and critical issues to be reduced to 0
3. Partner issues - aim for partner issues to be reduced to 0
4. Patched issues - aim to triage as soon as possible
5. Developer-reported issues (HQ and non-HQ) - should be quick to triage
6. Recent community bugs - should be triaged last-in-first-out

:::info Triaging dashboard

These priorities are displayed in the same order on the [Triaging dashboard](http://moodle.atlassian.net/secure/Dashboard.jspa?selectPageId=11153)

:::

## Creating a filter and gadget for triaging

If you are a component lead you are responsible for triaging issues that involve your component. A good way to monitor newly created issues is to create a filter in the Tracker and add a gadget on your dashboard to show the results of the filter.

:::tip How to add filters in the tracker

In the [Tracker tips and tricks](../tracker/tips#creating-a-filter) page you'll find how to create a filter and add it to a dashboard.

:::

## See also

- [Tracker guide](../tracker/guide.md)
- [Process](./)
- [Tracker tips](../tracker/tips/index.md)
