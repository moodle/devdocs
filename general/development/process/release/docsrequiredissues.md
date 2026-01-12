---
title: Documentation process
sidebar_position: 2
tags:
  - Documentation
  - Processes
---

## Information required

Issue descriptions should include enough details to document the new feature or improvement, ideally answering the following questions:

- What problem does this feature solve?
- What is the goal of the user?
- Who is the target audience (e.g. admins, teachers)?
- How does the feature work from a user's perspective? What are the steps?
- Are there any dependencies / other features that this new feature relies on?
- Does the user interface change for existing users?
- Are there any differences in an upgraded site versus a new install?
- Is there anything a site administrator should know about before upgrading their site?
- Are error messages possible, and if so, how can each error be resolved?

## Identifying issues

A list of key features and improvements in the new version should be created for providing content for [New features](https://docs.moodle.org/en/New_features).

Issues should be labelled as follows:

- `docs_required` - new features and improvements which need documenting, also changes which require the existing documentation to be updated.
- `ui_change` - significant changes to the student or teacher user interface.
- `upgrade_notes` - issues that may affect upgraded sites such as new site admin settings, user tours, major UI changes.

## Adding documentation

1. Go through the list of [closed MDL docs_required-labelled issues](https://moodle.atlassian.net/issues/?jql=project%20%3D%20MDL%20AND%20status%20%3D%20Closed%20AND%20labels%20%3D%20docs_required) and add documentation to the appropriate place in the user documentation.
2. Go through the list of ui_change-labelled issues for the version e.g. [ui_change-labelled issues with 5.1 fix version](https://moodle.atlassian.net/issues/?jql=project%20%3D%20MDL%20AND%20resolution%20%3D%20Fixed%20AND%20fixVersion%20%3D%205.1%20AND%20labels%20%3D%20ui_change) and update existing documentation including screenshots.
3. Go through the list of upgrade_notes-labelled issues for the version e.g. [upgrade_notes-labelled issues with 5.1 fix version](https://moodle.atlassian.net/issues/?jql=project%20%3D%20MDL%20AND%20resolution%20%3D%20Fixed%20AND%20fixVersion%20%3D%205.1%20AND%20labels%20%3D%20upgrade_notes) and add documentation to the docs page [Upgrading](https://docs.moodle.org/en/Upgrading) under 'Possible issues that may affect you in Moodle x'.
4. When saving the documentation wiki edit, mention the tracker issue number in the edit summary.
5. For a new feature or improvement with at least a paragraph of documentation, edit the tracker issue and add the documentation link. For an existing documentation update, there is no need to add a documentation link.
6. Optional: Add a comment to the tracker issue with the documentation link.
7. Remove the `docs_required` label from the tracker issue. Leave the `ui_change` and `upgrade_notes` labels on the issues.
