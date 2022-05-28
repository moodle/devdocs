---
title: Docs required issues
sidebar_position: 2
tags:
  - Documentation
  - Processes
---

According to the [Release process](/general/development/process/release#3-weeks-prior), 3 weeks prior to release we need to check [docs_required-labelled issues](https://tracker.moodle.org/issues/?jql=labels%20%3D%20docs_required%20AND%20status%20%3D%20Closed) and write new documentation, removing the label and commenting in the issue when the work is done.

Ideally, shortly after release, say within 4 weeks, the number of `docs_required` labelled issues for the versions being released should be zero.

## Comments templates

### Improvement documented

 ```
Removing the docs_required label as this improvement is now documented: https://docs.moodle.org/en/Groups
If you notice that the documentation can be improved, please feel free to log in to the wiki and edit the page.
Help in keeping Moodle documentation accurate and up-to-date is much appreciated.
```

When adding documentation about improvements or new features to Moodle Docs, it can be helpful to mention the tracker issue number in the wiki page edit summary.

### Request for information

```
This issue is labelled docs_required; however, it seems it's a bug fix rather than a new feature or improvement.
Please can anyone specify what needs documenting; otherwise the docs_required label can be removed.
```

### Nothing found needing documenting

```
Removing the docs_required label as there doesn't seem to be anything needing documenting, nor any screenshots needing updating.
If not, please describe what needs doing in a comment and re-add the docs_required label.
```
