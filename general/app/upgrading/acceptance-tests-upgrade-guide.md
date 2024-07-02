---
title: Moodle App Acceptance Tests Upgrade Guide
sidebar_label: Acceptance tests
sidebar_position: 3
tags:
  - Moodle App
  - Testing
---

In the following guide, you will learn how to upgrade your plugins' acceptance tests to support newer versions of the app.

Depending on which version of the app you're upgrading from, you'll need to go through multiple version upgrades. This guide is divided by version ranges, so you should be able to start with your current version and build up from there.

## 4.3 to 4.4

The application now needs to run in a secure context (https://). This change only affects your development environment, including acceptance tests, and it was necessary to [move on from the deprecated WebSQL API](https://tracker.moodle.org/browse/MOBILE-4304). Make sure to update the settings related to the app in the `config.php` of your Moodle's development environment.

If you were using [moodle-docker](https://github.com/moodlehq/moodle-docker), you no longer need to use the `MOODLE_DOCKER_APP_RUNTIME` env variable; but if you do, you'll also need to change it to `ionic7`.

## 4.2 to 4.3

There haven't been any relevant changes in this version, but make sure to run your tests against the latest version to check that they continue working properly.

## 4.1 to 4.2

The default dimensions in app tests have changed from 360x720 to 500x720. If you weren't running tests in headless mode, this change won't affect you because 500 was already the minimum width for a non-headless Chrome instance. This change was made to have consistent behaviours when the tests are run in both modes.

Additionally, core app tests started using the [local_behatsnapshots](https://github.com/NoelDeMartin/moodle-local_behatsnapshots/) to test against UI regressions. You can consider adopting it as well.

## 4.0 to 4.1

The only relevant change in this version is that the location of the custom Behat steps for the app have moved again. This time, they've been moved into the repository of the app itself. In order to make this usable by plugins as well, the Behat code is mirrored automatically into a plugin.

Your only required change should be to replace the old `local_moodlemobileapp` plugin with [`local_moodleappbehat`](https://github.com/moodlehq/moodle-local_moodleappbehat) and everything else should continue working as before.

:::info
If you were [using the browser console to debug tests](http://localhost:3000/devdocs/general/app/development/testing/acceptance-testing#debugging-tests), notice that some commands may have changed as well. We recommend heading to the documentation for writing Acceptance Tests for the Moodle App in order to learn about the new approach.
:::

## 3.9.5 to 4.0

There haven't been any relevant changes in this version, but make sure to run your tests against the latest version to check that they continue working properly. If you find something that stopped working, please [let us know](https://tracker.moodle.org/projects/MOBILE).

## 3.9.4 to 3.9.5

If you wrote tests before the app started using Ionic 5 (in version 3.9.5), it is possible that your tests are not working any longer. The [Acceptance Testing guide](../development/testing/acceptance-testing.md) has been rewritten with the latest information, so make sure to check it out to learn about the latest state of the art.

In general though, upgrading your current tests should be mostly straightforward.

The most relevant change is that Ionic 5 started using [the Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), and that's the source of many issues you may find upgrading your tests. Because of this, the standard Behat steps no longer work, so we have implemented their equivalent for the app (you can notice these steps because the end with `in the app`). Another important difference is that they look for content using accessibility rules.

In order to use these new steps, make sure that you have the [local_moodlemobileapp](https://github.com/moodlehq/moodle-local_moodlemobileapp/) plugin installed. Historically, Behat functionality for the mobile app was included with the LMS out of the box, but it has since been extracted to its own repository.

:::caution
If you're updating to version 4.1 or later, this changed again! Now, the functionality has been moved to the app repository itself, and it is automatically mirrored to the [`local_moodleappbehat`](https://github.com/moodlehq/moodle-local_moodleappbehat) plugin.

Read more about this in the section to [upgrade to 4.1](#40-to-41)
:::

Here's some tips to get you started with the migration:

- The standard `I press "..."` step has an equivalent called `I press "..." in the app"`. In general, most steps follow this pattern to make the migration easier. Keep in mind that the old steps may continue working in some situations, but we recommend updating all instances just in case.
- The standard `I should see "..."` step has an equivalent called `I should find "..." in the app`. These steps use accessibility rules to find content, so "find" is a more appropriate term than "see".
- Because of the Shadow DOM, some radio inputs and checkboxes that worked before are broken. You should be able to use the new `I select "..." in the app` steps instead.
- If you were relying in xpath or css selectors before, they will probably not work anymore. Even if you try to patch them, these selectors don't pierce through the Shadow DOM. In any case, it's always better to use accessible locators to test your plugin like a real user would, so you can use this opportunity to improve accessibility in your plugin.
- Pay special attention to any assertions such as `should not exist` that you have in your tests. These assertions will not fail, because the elements won't be found. But if you get an eventual bug when something is shown that shouldn't, those steps will probably not pick it up because the locators may have changed. So make sure to change those to their equivalent `should not exist in the app`.
- If you were running your tests in CI, make sure to install the plugin with the app steps as well.
