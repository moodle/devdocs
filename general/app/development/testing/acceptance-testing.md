---
title: Acceptance testing for the Moodle App
sidebar_label: Acceptance testing
sidebar_position: 2
tags:
  - Quality Assurance
  - Testing
  - Behaviour testing
  - Behat
  - Moodle App
---

In order to run tests that carry out automated functionality testing for the Moodle App, you can write [Acceptance tests](../../../development/tools/behat/index.md). This can be useful if you want to test plugins that are compatible with the app, or you're contributing to the app core. Behat tests for the app work the same way as tests for Moodle core, but they are not run as part of a normal Behat execution and there are some differences that we'll go through in this page.

A key point is that these tests are run using the Moodle Behat infrastructure, and don't depend only on the app codebase. Therefore, you will need a Moodle development setup as described in [Setting up development environment](../../../development/gettingstarted.md).

The main advantages of this approach are:

- It is easy for third-party plugin authors to create tests for app features in exactly the same way that they create tests for website features.
- Where institutions run tests automatically, it should be relatively easy to include some app tests within the existing approach.
- This system does not require any mobile device hardware and should work on all common platforms.

## Installation

In order to run tests for the app, you will need to run both a Moodle site and the Moodle App.

You need to install the [`local_moodleappbehat`](https://github.com/moodlehq/moodle-local_moodleappbehat/) plugin, using the version that corresponds with the version of the Moodle App that you're testing on. If you have tests for an older version, you can read [How to upgrade tests from an older version](../../upgrading/acceptance-tests-upgrade-guide.md).

We recommend that you use [moodle-docker](https://github.com/moodlehq/moodle-docker#use-containers-for-running-behat-tests-for-the-mobile-app), because it's configured to run mobile tests and you can skip reading this entire section. You won't even need to clone the app repository.

Nevertheless, if you still have to run the projects in your local machine, you can read the following instructions.

### Configuring the Moodle site

You can learn how to run a Moodle site locally in [Setting up development environment](../../../development/gettingstarted.md).

Remember to install the [`local_moodleappbehat`](https://github.com/moodlehq/moodle-local_moodleappbehat/) plugin with the same version that you're using for the mobile app.

### Configuring the Moodle App

If you are going to modify the application code, you can learn how to run it locally in [Setting up your development environment for the Moodle App](../setup/index.md). You only need to run the application in a browser, so you can skip the instructions for Android/iOS. Make sure to launch the application on the testing environment, running `npm run serve:test`.

If you only intend to run the app with the goal of executing Behat tests, you can use [the Docker images for the Mobile App](../setup/docker-images.md). Again, make sure that you're running them on the testing environment using the `-test` suffix.

However you set up the environment, if you change the version of the app you'll need to re-run the Behat init command so that your Moodle site knows about it.

### Configuring Behat

In order to enable app testing, you need to add the following configuration to your site's `config.php` file:

```php
$CFG->behat_ionic_wwwroot = 'https://localhost:8100';
```

The url you use here must be reachable by your Moodle site, and the application needs to be served at this url when running tests and also when you initialise the Behat environment.

The Moodle App [only works in Chromium-based browsers](../setup/app-in-browser), so mobile tests will be ignored if you are using any other browser. You can learn how to configure the browser used in your tests in the [Running acceptance test](../../../development/tools/behat/running.md) page.

Additionally, the app must run in a secure context and will issue local certificates during development. This aren't usually trusted by browsers out of the box, so you'll need to disable some security capabilities to make it work:

```php
$CFG->behat_profiles = [
    'default' => [
        'browser' => 'chrome', // Make sure it's version 102 or newer.
        'wd_host' => 'http://localhost:4444/wd/hub',
        'capabilities' => [
            'extra_capabilities' => [
                'chromeOptions' => [
                    'args' => [
                        '--ignore-certificate-errors',
                        '--allow-running-insecure-content',
                    ],
                ],
            ],
        ],
    ],
];
```

If everything is configured properly, you should see "Configured app tests for version X.X.X" after running `admin/tool/behat/cli/init.php`.

## Running Behat

To run mobile tests in Behat, simply launch Behat in the usual way. The app tests all have the `@app` tag, so if you want to run all the mobile tests you can use `--tags=@app`.

It is OK to combine mobile and web tests in the same run.

If you're writing core tests or modifying the app's custom steps, you can run one of the following commands to generate the `local_moodleappbehat` plugin automatically.

```sh
# Generate local_moodleappbehat once.
npx gulp behat

# Regenerate local_moodleappbehat when a test or behat file changes.
npx gulp watch-behat
```

If you're using [moodle-docker](https://github.com/moodlehq/moodle-docker), this should guess your plugins path automatically. If you haven't or prefer to use another location, you can always set the `MOODLE_APP_BEHAT_PLUGIN_PATH` env variable.

## Writing tests

This page assumes you already know all about [Writing acceptance tests](../../../development/tools/behat/writing.md) in general.

### Test structure

Mobile app test scenarios should be marked `@app` and `@javascript` in addition to any other tags.

You are writing a normal Behat test and this is likely to require background steps, such as creating courses, users, groups, etc.

### Start the app

When you want to get started testing the application, you can use the following step to launch the application:

```gherkin
Given I enter the app
```

This will:

- Set up all the Moodle server settings to allow the Moodle App to connect.
- Restart the browser, this is needed to ensure that it doesn't use data from previous runs.
- Set the browser to a suitable phone size (you can change it with other steps if you want a tablet or a different size).
- Open the app in the test browser.
- Inject the necessary JavaScript code to support Behat testing.
- Skip the onboarding and enter the site url in the initial screens of the app, if necessary.

After this step completes, if it is the first time you ran the app inside this scenario, you will be at the login screen. If you logged in earlier, you will be at the start page.

You can also use this step if you are already using the app and it will restart it.

### Log in to the app

To log in, you can use the following step:

```gherkin
When I log in as "student"
```

This is the same step that's used to log into standard Moodle, and it works in the app as well. You should have created the user in background steps, and it will log in using the text as both username and password.

You will then be left at the start page.

### Standard steps

Technically, you can use any standard Behat action in the app. However, most of them will probably not work as you expect because the app runs on a different environment. It is still a website, but it's built using [Ionic Framework](https://ionicframework.com/docs/).

One important problem is that the app has a complex DOM, and previous pages that are "back" from your current page may still be present in the DOM. Which means that any steps that just look for the first matching element in the DOM are likely to look for elements on a page you're not even on.

Another issue is that Ionic relies heavily on [the Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), and most steps in standard Moodle are not prepared to handle that.

For these and other reasons, there are some steps that have been implemented specifically for the app. You can distinguish them from others because most of them end with "in the app".

Having said that, here's a list of steps that work and you can use reliably.

- Any step you normally need to set up information in Moodle — For example, creating courses, users, etc.
- `I change viewport size to "{width}x{height}"` — You can use this step to simulate switching between portrait and landscape formats.
- `I pause` — This step works and it is very useful to debug your scenario.

### Actions

```gherkin
When I press "Course 1" in the app
```

This will click an element found using accessibility rules, so it could be visible text, content inside `aria-label`, content described by `ara-labelledby`, etc. It should work for links, buttons and other clickable elements.

```gherkin
When I press "Course 1" near "Unique text" in the app
```

You can use this step to narrow matches if the text you're providing is duplicated throughout the page.

The second value, "Unique text" in this example, should be unique on the page. Otherwise, you may have issues finding the element that you seek. The system will press the element matching your text that is nearest to the one found using the unique text.

Nearest is defined in terms of the DOM rather than pixel position; it is based on the number of steps you would have to take up the tree from the candidate element before you get to a shared ancestor with the unique text.

```gherkin
When I select "Item 1" in the app
When I select "Item 1" near "Unique text" in the app
When I unselect "Item 1" in the app
When I unselect "Item 1" near "Unique text" in the app
```

You can use these steps to select or unselect radio buttons, check boxes, and such.

You could use the previous `I press` step as well, but in some cases you will notice that it doesn't work as you expect. This is due to some internal quirks of how Ionic renders these components, so prefer using this specific steps where possible.

```gherkin
When I set the field "field name" to "text value" in the app
When I set the field "field name" near "Unique text" to "text value" in the app
```

This sets a text field with the given value. The same rules will apply to find the input element as for clicking, so using the input name will not suffice. This is in order to encourage accessibility best practices. The only difference with the previous step is that this only matches fillable elements such as `<input>`, `<textarea>` and elements with `contenteditable="true"`.

```gherkin
When I press the back button in the app
When I press the more menu button in the app
When I press the page menu button in the app
When I press the user menu button in the app
```

These steps will press, respectively:

- The **back button** — This is the left pointing arrow at top left of the app.
- The **more menu** button — This is the icon with at bottom right of the app.
- The **page menu** button, if present — This is the icon with the three dots at top right of the app.
- The **user menu** button, if present — This is the avatar button at top right of the app present on navigation level 1.

```gherkin
When I switch to the browser tab opened by the app
When I close the browser tab opened by the app
```

These two steps are necessary if you want to test the transition between the app and a browser.

For example, after pressing "Open in browser" you can use the first step above, and you will be able to use normal Moodle Behat steps to work in the browser tab. Once you're finished, you can use the second step to go back to the app.

```gherkin
When I upload "stub1.txt" to "File" ".action-sheet-button" in the app
```

This step can be used to set files on a file input in the app. The stub file should be placed in a `fixtures/` folder at the same level than the `.feature` file.

### Assertions

Like actions, there are some Behat assertions that are specific to the app.

```gherkin
Then I should find "Course 1" in the app
Then I should find "Course 1" near "Unique text" in the app
Then I should not find "Course 1" in the app
Then I should not find "Course 1" near "Unique text" in the app
```

These steps can be used to assert that the specified text exists somewhere in the app.

Notice that the standard `I should see` step may not work in the app because of the Shadow DOM. This step will also search using accessibility rules, so text within `aria-label` or described with `aria-labelledby` will work as well.

```gherkin
Then the header should be "Course 1" in the app
```

This checks the text of the current page header. It must be an exact match for the specified text.

You could have used the `I should find` step described previously, but this allows you to specifically check the header as opposed to anything in the page.

```gherkin
Then "Item 1" should be selected in the app
Then "Item 1" near "Unique text" should be selected in the app
Then "Item 1" should not be selected in the app
Then "Item 1" near "Unique text" should not be selected in the app
```

You can use these steps to assert whether radio buttons, check boxes, and such are selected or not.

### Leaving the app

If you want to leave the app and go back to Moodle within a scenario, simply use a Moodle step that goes to a page. For example, use `I am on site homepage` or `I am on "Course 1" course homepage`.

You only need to do this if you want to carry out actions within Moodle after using the app, within the scenario. At the end of your scenario, there is no need to explicitly leave the app; Moodle will automatically start the next scenario on the Moodle start page as usual.

### A complete example

This example is a complete feature file that loads the app, opens a course, and asserts that the app is showing the course page:

```gherkin
@app @javascript
Feature: Test app (demo)
  In order to test something in the app
  As a developer
  I need for this test script to run the app

  Background:
    Given the following "courses" exist:
      | fullname | shortname |
      | Course 1 | C1        |
    And the following "users" exist:
      | username |
      | student  |
    And the following "course enrolments" exist:
      | user     | course | role    |
      | student  | C1     | student |

  Scenario: Try going into the course
    When I enter the app
    And I log in as "student"
    And I press "Course 1" near "Course overview" in the app
    Then the header should be "Course 1" in the app
```

You can find more complex examples looking at the [tests for the app core](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/login/tests/behat/signup.feature) (search for files ending with `*.feature`).

## Limitations

Using this approach, there are some limitations you should be aware of:

- Lack of native functionality — Fundamentally, it is not possible to test behaviour specific to native devices because tests are run in a browser.
- Missing functionality — There are some known limitations and unsupported features, for example there is currently no obvious way to attach files. Some of these are possible, but they haven't been implemented yet. If something is missing for your use-case, you can submit feature requests in [the tracker](https://tracker.moodle.org/browse/MOBILE) using the `Behat` component.

## Advanced

### Versioning

Behat tests can relate to particular versions of the mobile app. For these situations, there are two types of tags you can add to your scenario or feature:

- `@app_from{version}` — These will be included in every app matching the specified version and newer.
- `@app_upto{version}` — These will be included in every app matching the specified version and older.

You can use two-digit or three-digit version numbers. For example, you could use `@app_from4.0` or `@app_upto3.9.5`.

Keep in mind that these tags will only take effect after using the `I enter the app` step, so it won't be effective for skipping steps in your Background blocks. If you need to skip these as well, you can do it using the following step:

```gherkin
  Background:
    Given the Moodle site is compatible with this feature
    And the following "courses" exist:
```

Also, after changing the app version used for testing, make sure you re-run Behat init. It is the initialisation process that stores which version of the app you're using.

### Testing against multiple app versions

If you need to run tests against multiple versions of the app, you can do it in two ways:

1. Update the code in the app workspace by checking out a different version.
2. Maintain multiple copies of the mobile app workspace and switch between them by changing `config.php`.

In both cases, you'll need to re-run the Behat init command and run the tests again.

Unfortunately, the only way to run this in parallel is to have separate Moodle installations with their own configurations.

### Debugging tests

If you pause a test (for example, using the `I wait "2000" seconds` step) and open the developer tools, you can debug the application like you would during development. You can learn how to do that in [Using the Moodle App in a browser](../setup/app-in-browser.md).

Additionally, you can see log information in the console about which Behat steps have been carried out so far, and whether Behat is waiting for anything. Here is an example:

```bash
VM649:391 BEHAT: 17:45:15.477 Action - Set field Username to: student2
VM649:391 BEHAT: 17:45:15.480 PENDING+: DELAY,dom-mutation
VM649:391 BEHAT: 17:45:15.982 PENDING-: DELAY
VM649:391 BEHAT: 17:45:16.28 PENDING-:
VM649:391 BEHAT: 17:45:16.98 Action - Set field Password to: student2
VM649:391 BEHAT: 17:45:16.106 PENDING+: DELAY,dom-mutation
VM649:391 BEHAT: 17:45:16.607 PENDING-: DELAY
VM649:391 BEHAT: 17:45:16.653 PENDING-:
```

While the test is paused, you can also carry out some of the app Behat steps manually by typing commands into the console, which is convenient if you're not quite sure what command would work. You can find which commands are available in the [behat-runtime.ts](https://github.com/moodlehq/moodleapp/tree/latest/src/testing/services/behat-runtime.ts) file.

Here are some examples:

```js
// I set the field "Password" to "student2" in the app
behat.setField('Password', 'student2');

// I press "Log in" near "Forgotten" in the app
behat.press('Log in', 'Forgotten');

// I press the back button in the app
behat.pressStandard('back');
```

If you're using `moodle-docker`, remember that you can interact with the browser [using VNC](https://github.com/moodlehq/moodle-docker#using-vnc-to-view-behat-tests). With a VNC client you can view in real-time what behat is doing in the browser.

### Writing custom steps

If you find something missing to test your code, you can always implement custom steps.

If you're writing a plugin, you can include a new class under `tests/behat/behat\_{yourpluginname}.php`. If you're working on application code, you can always update [behat_app.php](https://github.com/moodlehq/moodleapp/blob/latest/local_moodleappbehat/tests/behat/behat_app.php) as well.

You can learn more about writing custom steps in the [Writing new acceptance test step definitions](https://docs.moodle.org/dev/Writing_new_acceptance_test_step_definitions) page, and if you want to see how the steps that are specific to the app work, you should look into [behat_app.php](https://github.com/moodlehq/moodleapp/blob/latest/local_moodleappbehat/tests/behat/behat_app.php) and [behat-runtime.ts](https://github.com/moodlehq/moodleapp/tree/latest/src/testing/services/behat-runtime.ts).

### Testing graphical regressions

If you want to test against graphical regressions, you can use the [local_behatsnapshots](https://github.com/NoelDeMartin/moodle-local_behatsnapshots/) plugin. It allows you to store UI snapshots in your repository and check against them every time Behat tests are run:

```gherkin
Given I enter the app
Then the UI should match the snapshot
```

Learn more about it in the [plugin documentation](https://github.com/NoelDeMartin/moodle-local_behatsnapshots/#behat-snapshots-plugin).

## Troubleshooting

### General advice

If you are stuck with an error and you can't find a way to continue, here's a list of things you can do:

- Make sure you added `$CFG->behat_ionic_wwwroot = "https://localhost:8100";` (or equivalent) to your `config.php` file, and that url is reachable from the host where your Moodle site is running.
- Remember when you need to re-run `admin/tool/behat/cli/init.php`, and make sure that you see "Configured app tests for version X.X.X". When in doubt, just run it again; it may fix your problem.
- It is possible that your tests break if you're using an unstable version of the app. Try to use stable versions using the `latest` branch if you're working with the source code or tagged releases if you're using Docker.
- Mobile Behat tests don't work well with XDebug, so if you're using it, turn it off in `php.ini` while running the tests. Also, remember to restart Apache if necessary.

### Unable to load app version from https://localhost:8100/assets/env.json

This message appears when the Moodle site is not able to reach the app. Make sure that the url is available from the host you're running the Behat commands from. Also make sure that the app is actually running at the specified url.

### The plugins required by this course could not be loaded correctly...

This means either some activity on the course is not adapted to support the moodle app or there is a timeout in the request to your behat site.

To clear the timeout message, open the app in your [development browser](../setup/app-in-browser.md), open the Inspector, open the Application tab, select Clear storage, press Clear site data, close Inspector, close the tab with mobile site, re-open mobile site in new tab and log in. Then in a separate tab, log in to your behat site (you can find the url in `$CFG->behat_wwwroot` within your `config.php` file) and make sure you can get into the course without seeing the error.

### Fatal error: Maximum execution time of 30 seconds exceeded in...

This means that your local site has not been updated/visited since an upgrade. Just go to your local behat site (you can find the url in `$CFG->behat_wwwroot` within your `config.php` file), log in as admin and run notifications, then visit a course. Do this step often to avoid timeouts!

### Test fails because of the browser language

If your operating system is in a different language than English, the tests may fail.

Chrome does not have an easy way to force the browser language to English, so the best way to solve the issue is forcing the app default language to English.

To do so, just set the `forcedefaultlanguage` attribute to `"en"` in your `moodle.config.json` file in the app.

### Application build gets killed without any error information

In some situations, it is possible that you see `Killed` in the console and a command suddenly stops without any further information. In these situations, make sure to check the [General advice](#general-advice) section, but it is possible that your computer is running out of memory.

If you are running the scripts inside of a Docker container, make sure that Docker is allocated enough memory. If you are using Docker desktop (for example, on a Mac), you can inspect these settings under Preferences > Resources > Advanced > Memory.

### MacOS: running moodle-docker commands show grep usage options and do nothing else

This is [a known issue](https://github.com/moodlehq/moodle-docker/issues/188) in moodle-docker for Mac. The workaround for now is just to explicitly initialize the `MOODLE_DOCKER_APP_RUNTIME` variable in your local environment.
