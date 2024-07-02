---
title: Continuous Integration for the Moodle App
sidebar_label: Continuous Integration
sidebar_position: 3
tags:
  - Quality Assurance
  - Testing
  - CI
  - Continuous Integration
  - Behat
  - Moodle App
---

Tests can be useful during development, but a good test suite really shines with CI processes in place. Running tests and other checks on a regular basis can be helpful to maintain good quality assurance, and catch regressions as early as possible.

In this page we'll discuss some of the techniques and tools you can use to test any code impacting the Moodle App.

## Plugin tests

For most use-cases, you should be able to use [moodle-plugin-ci](https://github.com/moodlehq/moodle-plugin-ci). There is already some extensive documentation in the official docs, and in particular you should take a look in the [Moodle App section](https://moodlehq.github.io/moodle-plugin-ci/MoodleApp.html).

In practice, you'll most likely be able to use it out of the box by setting `MOODLE_APP=true`, and using one of the templates for [Github Actions](https://moodlehq.github.io/moodle-plugin-ci/GHAFileExplained.html) or [Travis](https://moodlehq.github.io/moodle-plugin-ci/TravisFileExplained.html).

## Core tests

For any new feature going into Moodle, the entire suite of app tests is run to make sure that nothing is broken. You can find the suite used for these purposes in the `ci` branch of the [local_moodleappbehat](https://github.com/moodlehq/moodle-local_moodleappbehat) plugin repository. These tests will always be run against the `latest` version of the app, which is the most recent release and should help us catch any regressions before it's too late. This happens in the Jenkins instance hosted in `ci.moodle.org` (which uses [moodle-ci-runner](https://github.com/moodlehq/moodle-ci-runner) under the hood, but you probably won't need to interact with this in any way).

Even though the tests are mirrored into the `local_moodleappbehat` repository, their source is managed in the main Moodle App repository. These tests are also run every time anything changes in the app codebase, using Github Actions. The workflow configuration can be found in [acceptance.yml](https://github.com/moodlehq/moodleapp/blob/main/.github/workflows/acceptance.yml).

### What can I do if my changes in core are making the app tests fail?

You can look at the failure logs, and hopefully that will give you enough hints to understand what's happening. For more details, you can also check the Build Artifacts to find screenshots of the application when the tests failed.

If that's not clear enough, try to use the app against your local instance to see if you can reproduce the problem (you can use the [development webapps](../network-debug.md#using-a-browser) in your computer). You can also run the app tests in your development machine [following the documentation](./acceptance-testing) (make sure to use the `ci` branch of the `local_moodleappbehat` plugin to include the tests).

Also, make sure your moodle code is up to date with the latest changes. The application tests are working against the latest development version of the LMS, so if your fork is using an old version it's possible that the problem has been fixed upstream.

If you're still unable to find why the tests are failing, you can reach out for help in the [developer chat](../../../../general/community/channels.md#developer-chat) or ask anyone from the [mobile developers](https://tracker.moodle.org/issues/?jql=assignee%20in%20(membersOf(mobile-developers))).

Finally, if you've made sure that the application is working properly but the Behats tests need to change, also reach out the [mobile developers](https://tracker.moodle.org/issues/?jql=assignee%20in%20(membersOf(mobile-developers))). Tests can be skipped temporarily before an issue is integrated, and updated to conform with the new behaviour afterwards.
