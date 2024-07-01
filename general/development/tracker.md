---
title: Tracker introduction
description: A summary of the most common actions in Moodle tracker.
tags:
  - Processes
  - Quality Assurance
  - Core development
  - Git
  - Tracker
---

The [Moodle Tracker](http://tracker.moodle.org/) is our database for recording and managing all Moodle development issues: bugs (problems with the software), improvements and feature requests.

## Creating a tracker account

You don't need an account to browse and search for issues in the tracker. However, to add a comment or create a new issue, you'll need to create a tracker account and then login.

:::note

Your tracker account is different to your Moodle.org account.

:::

## Searching for an issue

Before creating a new issue, please try searching to check whether it has been reported previously.

1. Enter a phrase, such as an error message in the 'Quick Search' box at the top right of the page.
2. If the search returns lots of results, click the 'Updated' column heading so that the most recent issues are displayed first.
3. To refine your search, select 'Moodle' as the project and perhaps add Component as another criteria and enter one or more. You can also click the Updated column heading to show most recently updated issues at the top of the search results.

See also [Tracker tips](./tracker/tips).

## Reporting an issue

*First check whether the issue has already been reported by searching (see above).*

- If you find an issue which appears to relate to your issue, feel free to add a comment providing further information.
- Otherwise, please report the issue by clicking the 'Create Issue' link at the top right of the page.

:::important

If you see a message that you can not create an issue unless you vote for or watch an existing open issue, search a tracker for [Unresolved issues](https://tracker.moodle.org/issues/?jql=project%20%3D%20MDL%20AND%20resolution%20%3D%20Unresolved), select one that is interesting to you and click either "Watch" or "Vote" link. This is a protection against spam and also encourages reporters to search tracker first.

:::

Language string problems can be corrected using [AMOS](http://docs.moodle.org/en/AMOS). In non-English languages, the relevant language pack needs to be edited. For English string changes, edit the [en_fix](http://docs.moodle.org/en/AMOS#Suggesting_improvements_to_English_language_strings) language pack.

For new Moodle issues...

1. Select 'Moodle' as the project and an appropriate issue type then click the 'Create' button.
2. Complete the form, making sure you include FULL STEPS that developers should take to reproduce the problem, as well as information about WHAT YOU EXPECTED and WHAT ACTUALLY HAPPENS for you. It's a good idea to check whether you can reproduce the bug on https://sandbox.moodledemo.net/ and if so, you can write in the bug report 'Bug reproduced on sandbox.moodledemo.net'.
3. Click the 'Create' button.

## Receiving email notification of issue updates

To receive email notification of updates to any issue, you can add yourself as a watcher.

- Click the 'Watch' link on the right of the issue page.

:::note

If you report an issue, you will automatically receive email notification of updates, so there is no need to add yourself as a watcher.

:::

## Assigning an issue

When working on an issue it is important that it be assigned to yourself. If you are not working on the issue, please _do not_ assign it to yourself, and do not assign it to anyone else.

Only existing developers may assign an issue to themselves.

:::important New developers

If you are working on your first issue, please **do not** assign it to anyone. Leave it unassigned and add the `patch` label to the issue when it is ready. If you are not the reporter of the issue, you won't have the necessary permissions to add the label. You may need to ask the reporter to add it for you or ask in the [public developers' chat](https://matrix.to/#/%23moodledev:moodle.com).

After your issue has been integrated, a member of the integration team will update your capabilities within the Moodle Tracker and assign the issue to you.

If the issue is assigned to another developer then it is not possible to identify new developers.

:::

## Helping determine development priorities

You can help determine Moodle development priorities by voting for issues that you'd most like to see fixed.

- Click the 'Vote' link on the right of the issue page.

## What makes a good tracker issue?

When you create a tracker issue, you are effectively asking someone to change Moodle for you. The easier you can make it for that someone to understand your problem, the more likely it is they will be able to fix it. Here are some things that can help:

- Give step-by-step instructions, so someone else can follow along on their Moodle site and see exactly what you are talking about:
  - include full steps to reproduce the problem, starting with login as (student/teacher etc)...
  - include what you expected to happen.
  - include what actually happens for you.
- If there is an error message (can you turn on [Debugging](http://docs.moodle.org/en/Debugging)?) copy and paste the full text of the error message.
- Clearly separate fact from speculation in what you write.
- A picture can be worth a thousand words. Consider taking a screen-grab of the problem.
- One report one bug / feature request per issue.
- Remember to search to see if the issue you are reporting is already there. If it is, vote or comment instead.

:::tip

Here are good examples of bug reports: [MDL-5688](https://tracker.moodle.org/browse/MDL-5688), [MDL-33532](https://tracker.moodle.org/browse/MDL-33532), [MDL-34440](https://tracker.moodle.org/browse/MDL-34440), [MDL-33514](https://tracker.moodle.org/browse/MDL-33514), [MDL-34475](https://tracker.moodle.org/browse/MDL-34475) - notice how quickly all of these got fixed!

:::

## What can I do if a problem remains?

If you find that a bug is still affecting a stable version of Moodle, despite the tracker issue being closed as fixed, please do as follows:

1. Create a new issue for the bug
2. Go back to the closed issue, then in the More menu select 'Link'. Enter the number of the issue you've just created and a comment. This will generate an email notification to all watchers, so they know to watch, vote or comment on the new issue from then on.

## Always add a comment

Remember that the Tracker is a low-bandwidth communication medium based mostly on text (like old-fashioned email lists). I am sure you know what you are doing when you edit an issue, but other people cannot read your mind (probably!). It is strongly encouraged that you always add at least a short comment when changing an issue, so it is clear to all watchers what is happening.

## See also

- [Tracker tips](./tracker/tips)
- [New feature ideas](../community/contribute.md)
