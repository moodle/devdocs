---
title: Generator tool
tags:
  - tools
  - Generator
  - Testing
  - Behat
---

The Generator tool is a Moodle administration tool that allows you to generate test data for your Moodle site. It is helpful for testing and development purposes, as it can create a large number of users, courses, and other entities in a short time.

The tool provides several features to help you generate test data, such as:

1. Make test course: Create a course with a specified number of sections, activities and enrolled users.
1. Create testing scenarios: can execute behat generators on the current instance.
1. Test plan: generates JMeter test plans for the current instance.
1. Make test site: Create a site with a specified number of courses, users, and activities.

## Generator requirements

Generator tools are only intended for use in a development environment. To prevent accidental use in a production environment, the generator tools require the instance to have the debug level set to developer.

To set the debug level to developer, go to `Site administration > Development > Debugging` and set the debug messages to `DEVELOPER: extra Moodle debug messages for developers`.

## Create a test course

Creating a testing course may be done on either web and CLI.

To create the course via the web interface, as an administrator, visit `Site administration > Development > Make test course`. From this page you can specify the course size, short name, full name, and description. The tool will create a course with some activities, and some users enrolled.

To create the course via CLI, you can use the following command:

```bash
php admin/tool/generator/cli/maketestcourse.php --shortname=SIZE_S --size=S
```

## Create a testing scenario using behat generators

The Generator tool allows you to execute behat generators on the current instance. This can be done on the web or the CLI.

Before executing the behat generators, you need a `feature` file you want to execute.

:::important

The tool does not use `selenium` or any other browser wrapper. It reads the feature file and executes specific steps in it. You can check all the available steps going to `Site administration > Development > Create testing scenarios` and expanding the information container using the **Show more** button.

This means:

1. The tool will only execute a few steps, which are generators and set config values. If any other type of step is present in the `feature` file, it will show a parsing error.
1. The tool can only execute scenarios and outline scenarios. It does not support background.

:::

:::tip Example

Some example Behat generator files can be found in [`admin/tool/generator/tests/fixtures/`](https://github.com/moodle/moodle/blob/main/admin/tool/generator/tests/fixtures/). For instance, [`testscenario/scenario.feature`](https://github.com/moodle/moodle/blob/main/admin/tool/generator/tests/fixtures/testscenario/scenario.feature) creates a course with two assignment activities and enrols one teacher along with five students.

:::

### Execute a testing scenario behat file

Before running a testing scenario, you need to install all behat dependencies. If you already execute some behat on the instance you can skip this step. Otherwise, you need to install the dependencies by running the following command:

```bash
php admin/tool/generator/cli/runtestscenario.php
```

There are two ways to run a testing scenario using a behat file: via the web interface or the CLI.

To run via web interface:

1. Go to `Site administration > Development > Create testing scenarios`.
1. Upload the `feature` file you want to execute and submit the form.

To run via CLI:

1. Copy the `feature` file you want to execute to some server location. You will need the full path to the file.
1. Run the following command:

```bash
php admin/tool/generator/cli/runtestscenario.php --feature=/path/to/some/testing/scenario.feature
```
