---
title: Tracker issue labels
sidebar_label: Issue labels
tags:
  - Tracker
---

The Moodle Tracker allows issues to be **labelled with tags**. This page lists common labels that we use to flag aspects about our MDL issues (bugs and feature requests about Moodle itself).

:::note

Labels can only be added by a user with permission to edit an issue, that is the issue reporter, members of the developers group, or members of certain other groups.

:::

## Labels

- `triaged`<br/>
This is set after a bug has been [triaged](../process/triage.md) by component lead or HQ developer. It indicates that the issue has been confirmed, with basic fields like "Priority" checked, and is now ready for a developer to look at.

- [`triaging_in_progress`](https://tracker.moodle.org/issues/?jql=labels%20in%20(triaging_in_progress))<br/>
Used to flag issues that are being triaged (sometimes an ongoing process for days or weeks). When the issue has been triaged the label should be removed and a `triaged` label should be added or when the issue is closed.

- `mdlqa`<br/>
Used to flag that an issue is a direct result of a [Moodle QA test](../process/testing/qa.md), conducted just before major releases. The bug should also be linked to the original MDLQA test, so that developers/integrators can reset the original MDLQA test (for re-testing) when the MDL issue is fixed. Once all the related MDLQA tests are passing the label can be deleted.

- `mdlqa_conversion`<br/>
Used to flag MDL issues that are converting MDLQA issues to behat features. The bug should also be linked to the MDLQA test being converted. Useful to know what's going and exclude some issues from manual QA. Once the MDL issue has been closed and the MDLQA has been moved to [MDLQA-5249](https://tracker.moodle.org/browse/MDLQA-5249), the label can be deleted.

- [`unit_test_required`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20unit_test_required)<br/>
Used to flag issues that should have their own unit tests.

- [`acceptance_test_required`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20acceptance_test_required)<br/>
Used to flag issues that should be regularly tested using the behat framework [Acceptance testing](../tools/behat/index.md). Before a major release these issues will be reviewed and new feature files will be added.

- [`qa_test_required`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20qa_test_required)<br/>
Used to flag issues that cannot be covered by automated tests. When adding the label, a comment should be also added advising exactly what needs covering in the QA test, for example "steps 6-10 in testing instructions".

- [`qa_identified`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20qa_identified)<br/>
Used to flag issues identified in QA testing which we were not able to fix before the release. Hopefully such issues can be worked on shortly after release, removing the label once the issue is fixed.

- [`docs_required`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20docs_required)<br/>
Used to flag a new feature or improvement which needs documenting, or a change which requires the existing documentation to be updated. The community team go through these issues prior to a release, update the documentation and then remove the label. For major new features, a link in the tracker issue to the specification doc or draft documentation is much appreciated. :-)

- `cl_docs_required` ([all](https://tracker.moodle.org/issues/?jql=labels%20in%20(cl_docs_required)) | [yours](https://tracker.moodle.org/issues/?jql=labels%20in%20(cl_docs_required)%20AND%20assignee%20%3D%20currentUser()))<br/>
Used to flag issues that contain features which need to be documented in the [Component Library](https://docs.moodle.org/dev/Component_Library). The responsibility of creating/updating Component Library documentation falls to the developer assigned to each relevant issue. Normally the relevant documentation should be included in the issue, but in some cases this will not be the case. When the issue is resolved and component library documentation was not included, a new issue should be created for the Component Library changes, linking using the **Documents** and **is documented by** issue links, and the `cl_docs_required` label should be removed from the issue.

- `dev_docs_required` ([all](https://tracker.moodle.org/issues/?jql=labels%20in%20(dev_docs_required)) | [yours](https://tracker.moodle.org/issues/?jql=labels%20in%20(dev_docs_required)%20AND%20assignee%20%3D%20currentUser()))<br/>
Used to flag issues that need to be noted in the dev docs. The responsibility of creating/updating Dev docs falls to the developer assigned to each relevant issue. When the issue is resolved, documentation should be created/updated, an appropriate URL should be added to the **Documentation link** field of the issue and the `dev_docs_required` label should be removed from the issue.

- `integration_held`<br/>
Used to flag issues already sent to integration that, for any cause, have been postponed to next cycles. Used only by integrators when there is some dependency or time-period causing one issue not being immediately integrable. Must be cleaned when the held is over.

- `unhold_requested`<br/>
Used to ask for an issue (having the `integration_held` label) to become unblocked, this flag must be coupled with a reasoned comment. Anybody can use it as far as repeated requests are avoided. Development managers will decide ASAP about giving the issue an integration opportunity or keeping it held. See [During continuous integration.2FFreeze.2FQA period](../process/integration/index.md#during-continuous-integrationfreezeqa-period).

- `security_held`<br/>
Used to flag security issues that have been reviewed by integrators already but held from integration repository. These issues must be cleared during point releases.

- `security_benefit`<br/>
Used to flag issues which help to improve the security of Moodle, but are not directly exploitable security bugs (and therefore do not have a security level assigned). For example, [MDL-66775](https://tracker.moodle.org/browse/MDL-66775) and [MDL-65443](https://tracker.moodle.org/browse/MDL-65443).

- `partner`<br/>
Moodle Partners apply this label to flag issues that are important to their clients. The Moodle HQ dev team takes this label into consideration when setting roadmap and bug fixing priorities.

- `patch`<br/>
This label indicates that a solution (patch) has been attached to the issue. However, if you can, it may be better to submit the issue for peer review, rather than using this label. This is useful to component leads and Moodle HQ when deciding what to work on next.

- `cime`<br/>
A developer can add the `cime` label to an issue to request that CiBot perform an [Automated code review](../tools/cibot.md).

- [`performance`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20performance%20AND%20project%20%3D%20MDL)<br/>
Used to flag any issues that developers think may affect Moodle's performance in some way (positively or negatively).

- [`ui_change`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20ui_change)<br/>
Used to identify issues that affect the interface presented to users. This label will usually be added together with the `docs_required` label, but the `ui_change` will remain permanently with the issue, while the `docs_required` label is removed after docs are created. This label is searched for during the preparation of release notes.

- [`ux_review_required`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20%22ux_review_required%22)<br/>
Used to identify issues that require review by Moodle HQ UX designers. This label will usually be added to issues that involve more than a trivial UI or workflow change, to ensure UX best practice is applied, with a consistent and human centered design approach. Adding this label will ensure the issue is placed on the UX backlog for review and input.

- `ux_writing`<br/>
For requesting help with naming and other wordings of new features and improvements. The issue will be added to the UX writing backlog for review and input.

- `api_change`<br/>
Used to identify API changes. This label will usually be added together with the `dev_docs_required` label, but the `api_change` will remain permanently with the issue, while the `dev_docs_required` label is removed after docs are created. This label is searched for during the preparation of release notes.

- [`release_notes`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20release_notes)<br/>
Used to identify all issues to be listed in the release notes (minor or major).

- [`upgrade_notes`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20upgrade_notes)<br/>
Issues that need to be mentioned in the user documentation [under 'Possible issues that may affect you in Moodle X.0' (major versions).

- [`developer_notes`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20developer_notes)<br/>
Issues that need to be mentioned in the [integration exposed forum](https://moodle.org/mod/forum/view.php?f=1153) and in the [Moodle developer update documentation](/docs/devupdate).

- `lost_functionality`<br/>
Used to identify issues describing functionality which was available in an earlier version but which is no longer available in the latest version.

- [`test_server_required`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20%20test_server_required)<br/>
Used to identify QA tests which can't be tested on the [QA testing site](http://qa.moodle.net) such as upgrade testing.

- [`credentials_required`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20credentials_required)<br/>
Used to identify QA tests which require the tester to enter credentials such as a client ID and secret for configuring OAuth 2.

- `new`<br/>
Used to identify new tests in the current QA cycle for volunteers from the community to use as a basis for exploratory testing.

- [`addon_candidate`](https://tracker.moodle.org/issues/?jql=labels%20%3D%20addon_candidate)<br/>
Used to identify suggestions for improvements/new features as possible candidates for add-on development. New and willing developers can be directed to these issues for projects.

- `affects_mobileapp`<br/>
Used to identify MDL issues that may affect the mobile app. It should be used when adding new features to functionalities supported by the app or when doing changes in existing ones. Examples are: [MDL-372](https://tracker.moodle.org/browse/MDL-372) and [MDL-38158](https://tracker.moodle.org/browse/MDL-38158).

- `affects_moodlecloud`<br/>
Used to identify MDL issues that may affect Moodlecloud.

- `affects_workplace`<br/>
Used to identify MDL issues that may affect Moodle Workplace.

- `needs_user_stories`<br/>
Used to identify issues that require further clarification of the requirements through adding user stories.

- [`ready_for_integration`](https://tracker.moodle.org/issues/?filter=21824)<br/>
Used to identify issues that already have been peer-reviewed but the user lacks permissions (pull-requester) to send the issue to integration. Any pull-requester can, on peer-reviewer's behalf, proceed with the transition. The label is removed once the issue has been transitioned.

- `contribfriendly`<br/>
Used to identify MOBILE issues that are a good starting point for developers that want to start contributing to the Moodle app.

## See also

- [Tracker](../tracker)
- [Bug triage](../process/triage)
