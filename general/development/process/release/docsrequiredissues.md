---
title: Documentation process
sidebar_position: 2
tags:
  - Documentation
  - Processes
---

## Issue labelling

Prior to each major release, add labels to closed issues as follows:

- `docs_required` - new features and improvements which need documenting, also changes which require the existing documentation to be updated.
- `ui_change` - significant changes to the student or teacher user interface.
- `upgrade_notes` - issues that may affect upgraded sites such as new site admin settings, user tours, major UI changes.

## Writing documentation

1. Go through the list of [closed MDL docs_required-labelled issues](https://tracker.moodle.org/issues/?jql=project%20%3D%20MDL%20AND%20status%20%3D%20Closed%20AND%20labels%20%3D%20docs_required) and write documentation based on the issue description or testing instructions. If it's unclear, comment in the issue asking for help.
2. Go through the list of ui_change-labelled issues for the version e.g. [ui_change-labelled issues with 4.3 fix version](https://tracker.moodle.org/issues/?jql=project%20%3D%20MDL%20AND%20resolution%20%3D%20Fixed%20AND%20fixVersion%20%3D%204.3%20AND%20labels%20%3D%20ui_change) and update existing documentation including screenshots.
3. Go through the list of upgrade_notes-labelled issues for the version e.g. [upgrade_notes-labelled issues with 4.3 fix version](https://tracker.moodle.org/issues/?jql=project%20%3D%20MDL%20AND%20resolution%20%3D%20Fixed%20AND%20fixVersion%20%3D%204.3%20AND%20labels%20%3D%20upgrade_notes) and add documentation to the docs page [Upgrading](https://docs.moodle.org/en/Upgrading) under 'Possible issues that may affect you in Moodle x'.
4. When saving the documentation wiki edit, mention the tracker issue number in the edit summary.
5. For a new feature or improvement with at least a paragraph of documentation, edit the tracker issue and add the documentation link. For an existing documentation update, there is no need to add a documentation link.
6. Optional: Add a comment to the tracker issue with the documentation link.
7. Remove the `docs_required` label from the tracker issue. Leave the `ui_change` and `upgrade_notes` labels on the issues.
