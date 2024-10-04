---
title: QA testing
sidebar_label: Quality Assurance (QA)
description: All the information related to the Qualify Assurance tests during the Moodle development.
tags:
  - Processes
  - Core development
  - Testing
  - Quality assurance
---

**Quality Assurance** tests look at the functionality of Moodle from a user's point of view.

Real users systematically try each feature in Moodle and ensure that it works in the current version of the Moodle code. These tests are repeated in a series of cycles, around 4 - 6 weeks before each major release, once all major features have landed.

## Getting involved

Would you like to help with QA testing? If so, please make sure you have created an account in the [Moodle tracker](../../tracker.md) and you're subscribed to the [Testing and QA forum](https://moodle.org/mod/forum/view.php?id=56) in order to receive QA testing news updates.

## Running tests

1. Go to the [Moodle QA testing dashboard](https://tracker.moodle.org/secure/Dashboard.jspa?selectPageId=11454) and choose a test from the list of current QA cycle open issues. When viewing a test, if you wish, you can click the 'Assign to me' link on the right, so that nobody else chooses the same test to run. (If you then find you are unable to run the test, you can click the Assign button and set the assignee as 'Unassigned'.) Please note:
   - Only assign an issue to yourself which no one else is testing (Assignee = Unassigned).
   - Only assign one issue at a time unless you plan to test a number of related issues within the next 24 hours. In other words, don't assign several issues to yourself then do nothing for several days. ;-)
   - The label `test_server_required` indicates issues that can't be tested on the QA testing site. The label `credentials_required` indicates that credentials such as an OAuth 2 service client ID and secret are required.
2. Using either the [Moodle QA Testing Site](https://qa.moodledemo.net/) or your own test site running the latest Moodle 4.2dev (available from Git on the integration/main branch git://git.moodle.org/integration.git) with [debugging](https://docs.moodle.org/dev/debugging) set to developer, perform each of the steps listed in the test.
3. Please *attach screenshots of the steps where you verify or check something*.
4. If it makes sense, please test using the currently supported themes, Boost and Classic.
5. Choose an appropriate workflow action:
   - `Pass` - Test runs perfectly. Add comment such as feedback about a new feature, browsers used for testing (if applicable; example: "This test passes on Q&A site with Teacher role using Boost theme"), or simply "This test passes - yippee!"
   - `Fail` - Something doesn't work, or you obtain debugging messages. Add comment describing the step that doesn't work. If in doubt whether to pass a test, give it a fail and add a comment describing your doubts.
   - `Obsolete` - Test is no longer relevant in the current Moodle version. Add comment explaining why.

:::info Out of date tests

If you notice that the test description is out-of-date, add a comment mentioning that it needs updating. Alternatively, if you'd like to help with updating the test yourself, see below.

:::

## Any questions?

If there is anything you are unsure of, such as whether to mark a test as failed, or you have any other questions, please ask in one of the following places:

- Moodle QA Matrix chat room - Come and join us as in the [#qa:moodle.com](https://matrix.to/#/#qa:moodle.com) room on Matrix.

:::info

This chat was previously hosted on Telegram. All message history has been migrated to Matrix, and our Matrix Bot keeps the two rooms in sync. If you'd prefer to stay with Telegram during the migration process, you can do so by joining the [#moodleqa](https://t.me/moodleqa) channel. To join the room for the first time, please use the [Moodle QA Telegram invite link](https://t.me/+cXneE_ZeZ_A4ODRk)

<details>
  <summary>The Telegram <em>Matrix bot</em> user</summary>
  <div>

If you are using Telegram to access the Moodle QA chat, you will notice the _Matrix bot_ posts on behalf of many users.

Telegram prevents the bot from posting as another user, so all messages will come from _Matrix bot_ with the name of the actual sender as part of the message.

  </div>
</details>

At this time we still support taking part in the discussion in either channel.

:::

- [Testing and QA forum](https://moodle.org/mod/forum/view.php?id=56)

## Moodle QA Testing Site

The [Moodle QA Testing Site](https://qa.moodledemo.net/) is updated daily at around 13:00 UTC with the latest bug fixes to enable you to re-run QA tests.

Credentials for Teacher and student accounts are provided on the login page.

:::info E-mail on the QA site

No e-mail will be sent from the QA server. Tests involving e-mail **cannot** be performed on the Moodle QA Testing Site.

If you perform any test which tries to send e-mail, a debugging message will be displayed.

:::

:::tip Admin access

If you require admin access to the Moodle QA Testing Site for running certain tests, please ask in the [Moodle QA Telegram chat room](https://t.me/moodleqa) or the [Testing and QA forum](https://moodle.org/mod/forum/view.php?id=56) for someone to send you the account credentials via private message.

:::

## Failed tests

So you ran a test and it failed? Congratulations on finding a bug! Please do the following.

1. Click the `Fail` button at the top of the page.
2. Add a comment to the QA test stating that there was a problem and that you will report it as a Moodle bug.
3. Note the MDLQA number; it will be something like [MDLQA-448](https://tracker.moodle.org/browse/MDLQA-448).
4. Try searching for whether the bug has been reported previously, and if not create a new issue for it (as described in [Tracker introduction](../../tracker.md)).
5. In the new Moodle (MDL) issue select 'Link' from the 'More actions' dropdown menu.
Linking to the QA issue in the tracker
6. Link to the QA test by selecting 'blocks' as the link type, entering the MDLQA number that you noted earlier, and optionally adding a comment.
Adding details for a link to the QA issue
7. Give the issue the label `mdlqa`.
8. (Optional) Add yourself as a watcher to the MDL issue so that you receive email notification when the issue is fixed.
9. When the MDL issue is fixed, hopefully within a day or two, the QA test can be reset and can then be run again.

## Resetting tests

:::info Note for integrators

After integrating a fix:

1. `Reset` the MDLQA test, adding a comment.
2. Remove the `mdlqa` label from the MDL issue.
3. If the issue doesn't have testing instructions, pass it with message "Will be tested by MDLQA-XXXX".

:::

The tester will then receive email notification that the bug is fixed and will hopefully decide to run the test again soon.

## Fixing existing bugs

At the beginning of the QA cycle, all bugs identified (both new and existing) are investigated promptly and hopefully fixed.

When we are close to the scheduled release date (1-2 weeks prior), developers must focus on fixing new bugs (which affect the upcoming release version) only.

Thus, at this point in the QA cycle, any bugs which also affect existing versions of Moodle are labelled `qa_identified` (and the label `mdlqa` removed) for investigation after the release.

## Testing tips

When entering text into a form, try things like:

- `&` (ampersand), `>` (greater than) or `<` (less than)
- `0` (the single digit 0)
- `'` (single quote)
- special characters
- very long strings
- different languages, such as a RTL language

:::tip For example:

```
x < 1 && x > 0
```

```
Fergal.O'Brien@example.com
```

```
café
```

```
囲碁
```

:::

## New QA tests required

:::info Note for developers

If an issue fix cannot be covered by automated tests,

1. Add the label `qa_test_required` to the issue.
2. Add a comment explaining why it can't be covered by automated tests and suggesting which steps of the testing instructions should be included in a QA test e.g. steps 6-10 or all steps.

:::

QA tests will then be written and included in the next QA cycle. For issues with long testing instructions, several QA tests will be written to cover the issue. If appropriate, activities etc. will be set up on the [Moodle QA Testing Site](https://qa.moodledemo.net/) to enable the issue to be easily tested in future.

### New features, and improvements

Where a new features or improvements would benefit from exploratory testing, you should:

1. Add the label `qa_test_required` to the issue.
2. Add a comment mentioning that exploratory testing is required.

:::note

When the next QA cycle is prepared, any issue with the `qa_test_required` label will be reviewed and appropriate **exploratory QA tests** written, before the label is then removed.

:::

## Updating tests

QA tests may become out-of-date due to User Interface changes, feature changes, and new features. If you would like to help with updating tests, you'll need to be a member of the test writers group in the Tracker.

To update a QA test original:

1. Search for the test in [MDLQA-1](https://tracker.moodle.org/browse/MDLQA-1).
2. Edit the test description.

:::note

If a test in the current QA cycle is marked as failed because it is out-of-date, the description should be updated (as well as the test original) before resetting the test. If the test in the current QA cycle is marked as passed, then only the test original needs to be updated.

:::

## Writing new tests

Would you like to help with writing new QA tests? To write new QA tests you will need to be a member of the test writers group in the Tracker.

QA tests are needed for any features which can't be tested with automated testing, such as connecting to an external system, drag and drop functionality or a CLI script. Also if it requires a person to detect if something is 'correct' vs. present/absent on the page.

In addition, new features can benefit from exploratory testing by community volunteers.

To create a new QA test:

1. If appropriate, do a quick search of [MDLQA-1](https://tracker.moodle.org/browse/MDLQA-1) to check if there is an existing test which can be updated.
2. If not, in [MDLQA-1](https://tracker.moodle.org/browse/MDLQA-1) from the More menu select 'Create sub-task'.
3. Enter a summary such as 'A teacher can ...'.
4. Select 'Original' as affected version and select appropriate components.
5. In the description field add the test steps (usually between 3 and 10), similar to the issue's [testing instructions](./guide), starting with 'Log in as a teacher...' or similar. It's a good idea to try doing the steps yourself as you write the test.
6. Start some steps with 'Verify that ...' or similar.
7. Click the Create button.
8. Go to the MDL issue and create a 'has a QA test' link to the new QA test, adding a comment "This feature is now covered by the QA test MDLQA....".

:::note

- Add the label `new`
- For tests which can't be run on the QA testing site, such as ones where you need to check an email, label `test_server_required`.
- For OAuth 2 tests and any other tests which require a client ID or secret to be entered, label `credentials_required`.
- For issues which specifically mention in the testing instructions to test in different browsers, use the phrase:

> Test in as many browsers as possible and mention in a comment which ones you've used.

- For an exploratory test, begin the test description with:

> This is an exploratory test of a new feature or improvement, so please feel free to try anything you like and not just the test steps!

- For a test requiring admin access which can be run on the QA site, add:

> This test requires admin access. If you would like to use the [QA testing site|https://qa.moodledemo.net/] for running it, please see the [QA testing guide|https://docs.moodle.org/dev/QA_testing] for details of how to request admin access. Begin just after the hourly reset to give yourself plenty of time to complete the test!

:::

## Automating a test

1. Choose a test from the list [MDLQA tests with label mdlqa_conversion](https://tracker.moodle.org/issues/?jql=project%20%3D%20MDLQA%20AND%20labels%20%3D%20mdlqa_conversion%20and%20status%20%3D%20Open).
1. Create a new MDL issue with summary `Automate MDLQA-wxyz` and component `Automated functional tests` and any MDLQA component such as `Forum` which is also an MDL component.
1. Add the `mdlqa_conversion` label to the new MDL issue
1. Link to the MDLQA test by selecting `Will help resolve` as the link type.
1. Follow the instructions provided in the guide Writing acceptance tests.
1. Include `MDLQA-wxyz` and a short description of what is being automated to the commit message/s where the .feature files are added/edited.

:::info

When a test is automated, it needs to be moved from MDLQA-1 to MDLQA-5249.

:::

## Feedback

Feedback on all aspects of our QA testing process is welcome.

:::tip

If you have any questions or comments, please post in the [Testing and QA forum](https://moodle.org/mod/forum/view.php?id=56).

:::

## Previous QA cycles

Comments on tests from previous QA cycles:

- [Moodle 4.5 QA](https://tracker.moodle.org/browse/MDLQA-18925)
- [Moodle 4.4 QA](https://tracker.moodle.org/browse/MDLQA-18443)
- [Moodle 4.3 QA](https://tracker.moodle.org/browse/MDLQA-17933)
- [Moodle 4.2 QA](https://tracker.moodle.org/browse/MDLQA-17385)
- [Moodle 4.1 QA](https://tracker.moodle.org/browse/MDLQA-16759)
- [Moodle 4.0 QA](https://tracker.moodle.org/browse/MDLQA-16122)
- [Moodle 3.11 QA](https://tracker.moodle.org/browse/MDLQA-15457)
- [Moodle 3.10 QA](https://tracker.moodle.org/browse/MDLQA-14813)
- [Moodle 3.9 QA](https://tracker.moodle.org/browse/MDLQA-14131)
- [Moodle 3.8 QA](https://tracker.moodle.org/browse/MDLQA-13517)
- [Moodle 3.7 QA](https://tracker.moodle.org/browse/MDLQA-12911)
- [Moodle 3.6 QA](https://tracker.moodle.org/browse/MDLQA-12282)
- [Moodle 3.5 QA](https://tracker.moodle.org/browse/MDLQA-11698)
- [Moodle 3.4 QA](https://tracker.moodle.org/browse/MDLQA-10999)
- [Moodle 3.3 QA](https://tracker.moodle.org/browse/MDLQA-10403)
- [Moodle 3.2 QA](https://tracker.moodle.org/browse/MDLQA-9827)
- [Moodle 3.1 QA](https://tracker.moodle.org/browse/MDLQA-9267)
- [Moodle 3.0 QA](https://tracker.moodle.org/browse/MDLQA-8205)
- [Moodle 2.9 QA](https://tracker.moodle.org/browse/MDLQA-7660)
- [Moodle 2.8 QA](https://tracker.moodle.org/browse/MDLQA-7170)
- [Moodle 2.7 QA](https://tracker.moodle.org/browse/MDLQA-6693)
- [Moodle 2.6 QA](https://tracker.moodle.org/browse/MDLQA-5740)
- [Moodle 2.5 QA](https://tracker.moodle.org/browse/MDLQA-5267)
- [Moodle 2.4 QA](https://tracker.moodle.org/browse/MDLQA-4602)
- [Moodle 2.3 QA](https://tracker.moodle.org/browse/MDLQA-1814)
- [Moodle 2.2 QA](https://tracker.moodle.org/browse/MDLQA-1190)
- [Moodle 2.1 QA](https://tracker.moodle.org/browse/MDLQA-944)
- [Moodle 2.0.2 QA](https://tracker.moodle.org/browse/MDLQA-540)
- [Moodle 2.0 QA Cycle 2](https://tracker.moodle.org/browse/MDLQA-328)
- [Moodle 2.0 QA Cycle 1](https://tracker.moodle.org/browse/MDLQA-150)

## See also

- [QA testing dashboard](https://tracker.moodle.org/secure/Dashboard.jspa?selectPageId=11454)
- [Testing credits](../../../community/credits/testing.md)
- [Useful tips for QA testing](https://moodle.org/mod/forum/discuss.php?d=351302)
