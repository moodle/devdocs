---
title: Running acceptance tests
sidebar_position: 1
tags:
  - Quality Assurance
  - Behat
---
Moodle uses [Behat](https://behat.org), a php framework for automated functional testing, as part of a suite of testing tools.

Behat takes a set of Features, Scenarios, and Steps, and uses these to step through actions and test results using a real web browser. This is possible thanks to a protocol implemented in most modern web browsers called Webdriver.

This documentation covers how to run Behat tests within Moodle, including requirements, setup, useful tips and tricks, and basic troubleshooting.

## Requirements

1. Any recent OS with [supported version of Moodle](../../../releases.md) installed
1. A recent browser (Firefox and Chrome as standard, but [other browsers](./browsers/index.md) are possible)
1. The WebDriver implementation for your browser
1. A recent version of Selenium (Optional, but recommended)
1. A recent Java Runtime Environment (Required if using Selenium)

### Recommended extras

Some extra software is also recommended for testing with Behat.

#### Pre-configured browser profiles: moodle-browser-config

Available for [all supported versions of Moodle](../../../releases.md), the [moodle-browser-config](https://github.com/andrewnicols/moodle-browser-config) is a recommended inclusion for Behat. This configuration tooling provides a range of standard browser profiles for testing.

:::note

In future, the **moodle-browser-config** tool may be included as composer dependency to Moodle but this is currently not the case.

:::

##### Installation

1. Check out the moodle-browser-config repository:

   ```console title="Clone the moodle-browser-config repository"
   git clone https://github.com/andrewnicols/moodle-browser-config
   ```

2. Open your Moodle installation's `config.php` in your preferred editor, and require the tool's `init.php`:

   ```php
   require_once('/path/to/your/git/dir/moodle-browser-config/init.php');
   ```

##### Provided profiles

The full list of profiles which are included with `moodle-browser-config` are provided in its [own documentation](https://github.com/andrewnicols/moodle-browser-config).

The following is a summary of the profiles that most users may be interested in.

<!-- cspell:ignore Browserstack, Saucelabs, headlessfirefox, geckodriver, Geckodriver, chromedriver, Chromedriver -->
<!-- cspell:ignore headlessgeckodriver, headlesschrome, headlesschromedriver, headlessedge, Edgedriver, edgedriver -->
<!-- cspell:ignore headlessedgedriver, MYTHEME, rehomed -->

You can also provide your own custom profiles, including for remote services such as Browserstack, and Saucelabs, as
well as for other browsers supporting the W3C Webdriver specification.

Please note that `Safari` and `Safaridriver` are not currently supported as they do not meet the W3C WebDriver specification.

| Profile name | Description | Uses Selenium? | Displays GUI? |
| --- | --- | --- | --- |
| firefox | Use Firefox via Selenium | Yes | Yes |
| headlessfirefox | Use Firefox via Selenium, without displaying the GUI | Yes | No |
| geckodriver | Use Firefox with Geckodriver directly | No | Yes |
| headlessgeckodriver | Use Firefox with Geckodriver directly, without displaying the GUI | No | No |
| chrome | Use Chrome via Selenium | Yes | Yes |
| headlesschrome | Use Chrome via Selenium, without displaying the GUI | Yes | No |
| chromedriver | Use Chrome with Chromedriver directly | No | Yes |
| headlesschromedriver | Use Chrome with Chromedriver directly, without displaying the GUI | No | No |
| edge | Use Edge via Selenium | Yes | Yes |
| headlessedge | Use Edge via Selenium, without displaying the GUI | Yes | No |
| edgedriver | Use Edge with Edgedriver directly | No | Yes |
| headlessedgedriver | Use Edge with Edgedriver directly, without displaying the GUI | No | No |

#### chromedriver-wrapper

When using Google Chrome, you must use the correct version of the `chromedriver` browser driver for the version of Chrome that you use.

Since Google Chrome automatically updates on a regular basis, you will need to regularly upgrade your driver to match the version of Chrome that you are using.

To make this easier, a `chromedriver-wrapper` utility has been written. This inspects the version of Chrome that is in your path, and downloads the correct version of `chromedriver` for that version, before starting it.

Installation instructions can be found at [https://github.com/andrewnicols/chromedriver-wrapper](https://github.com/andrewnicols/chromedriver-wrapper).

## Getting started

:::tip Environment

These notes assume that you have already installed a supported Java Runtime Environment, and the [moodle-browser-config](./running.md#pre-configured-browser-profiles-moodle-browser-config) tool.

:::

### Setting up Selenium

Generally we recommend use of Selenium, though this is not a fixed requirement. You can use the browser's driver implementation directly but this is harder to setup for the first time.

Selenium is written in Java, and requires a recent version of the JRE to run. Please ensure that you have this installed prior to starting.

Since Moodle 3.9.5 / 3.10.2 / 3.11.0 Moodle will work with any modern version of Selenium. At time of writing that is `3.141.59`, and 4.1.0.

:::warning

There appears to be an issue with the version 4 jars - particularly in 4.1.0 that generates a **"Could not open connection: Capability value must be set"** error which appears to be an issue between Selenium and the MInkExtension for JavaScript tests - see https://githubmemory.com/repo/Behat/MinkExtension/activity for more information. The quick work around is to use the earlier version (3.141.59).

:::

1. Download the Selenium Server (Grid) from [https://www.selenium.dev/downloads/](https://www.selenium.dev/downloads/). This is a single JAR file, put it anywhere handy.
1. Start Selenium

   ```console title="Version 3.141.59"
   java -jar selenium-server-standalone-3.141.59.jar
   ```

   ```console title="Version 4.0.0 and later"
   java -jar selenium-server-4.0.0-beta-3.jar standalone
   ```

:::tip

You can optionally specify a number of settings, depending on the version of Selenium that you are using, including the port to run on.
See the help for the version of Selenium that you are using.

:::

### Setting up your browsers

Selenium is just an intelligent wrapper to start, and manage your browser sessions. It doesn't actually include any web browsers itself.

Moodle HQ run all behat tests against both Firefox and Chrome multiple times per day. Other combinations, including Microsoft Edge, are also supported.

To use Behat, you will need a recent version of your preferred browser, as well as a `driver` for that browser. The driver is responsible for communication between Selenium (or Moodle directly) and the browser.

Both the browser, and its driver, must be placed inside your `$PATH` - this may be somewhere like `/usr/bin`, `/usr/local/bin`, or perhaps a user bin directory like `~/bin` which is present in your `$PATH`

#### Chrome

You can download Google Chrome from [https://www.google.com.au/chrome](https://www.google.com.au/chrome).

You will need the [correct version of the chromedriver](https://chromedriver.chromium.org/downloads) as per the
documentation. Alternatively you can make use of the [chromedriver-wrapper utility](./running.md#chromedriver-wrapper) noted in the Recommended extras sections.

Either the `chromedriver` binary must be in a directory in your `$PATH`, or the `chromedriver-wrapper/bin` folder must be in your `$PATH`.

#### Firefox

You can download Mozilla Firefox from [https://www.mozilla.org/en-US/firefox/new/](https://www.mozilla.org/en-US/firefox/new/).

You will need the [correct version of geckodriver](https://github.com/mozilla/geckodriver/releases) as per the [documentation](https://firefox-source-docs.mozilla.org/testing/geckodriver/Support.html).

The `geckodriver` binary must be in a directory in your `$PATH`.

### Setting up Moodle

1. Create a new `dataroot` area for files especially for behat
2. Set the following in your Moodle `config.php`:

   ```php
   $CFG->behat_dataroot = '/path/to/the/dataroot/you/created';
   $CFG->behat_wwwroot = 'http://127.0.0.1/path/to/your/site';
   $CFG->behat_prefix = 'beh_';
   ```

3. We recommend that you also include the `behat-browser-config` if you have not done so already.

   ```php
   require_once('/path/to/moodle-browser-config/init.php');
   ```

:::note About the behat_wwwroot

You will need to set the `behat_wwwroot` to your Moodle site, but it **must** use a different value to your `$CFG->wwwroot`.

One common way to do this is to use `127.0.0.1` for behat, but `localhost` for standard use. Alternatively you can add an additional hostname in your `/etc/hosts` file and use this instead.

If you use Docker, then you may be able to use `host.docker.internal` where your site is hosted on the docker host

:::

### Configure Behat for Moodle

After setting your configuration, you can simply initialise behat:

```console
php admin/tool/behat/cli/init.php
```

This will install all required Composer dependencies, install a new Moodle site, and put configuration in place

When it finishes it will give advice on how to run Behat.

### Run Behat tests

:::warning

Before running behat, ensure that your Selenium server is running.

The easiest way to run behat, and test that everything works is by simply running it using the command provided when you
initialised Behat. If you didn't make a note of it, you can just run the initialisation again.

:::

```console
php admin/tool/behat/cli/init.php
```

This will give you a command which you can then run. This command will run every behat scenario, which will take a considerable amount of time. This command will look a bit like this:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml
```

To make this more useful you an combine it with flags, for example to only run certain `tags` or for a specific Behat Feature file, or Scenario.

To run all features/scenarios which are tagged with `mod_forum`:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml --tags=@mod_forum
```

To run one specific feature file:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml `pwd`/mod/forum/tests/behat/private_replies.feature
```

To run one specific scenario within a feature file:

```console title="To run the Scenario on line 38 of the file"
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml `pwd`/mod/forum/tests/behat/private_replies.feature:38
```

To run one specific scenario by name:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml --name="As a teacher I can see my own response"
```

See the upstream documentation on Behat, and Gherkin filters for more information.

#### Running using a different browser

The default browser in Behat is **Firefox**. To specify a different browser profile, you can add the `--profile` argument. For example, to use Chrome in Headless mode:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml --profile=headlesschrome
```

:::tip

If you are using the `moodle-browser-config` utility, then you can use any profile listed in [moodle-browser-config](./running.md#pre-configured-browser-profiles-moodle-browser-config). Otherwise you can write your own browser profile configuration.

:::

### Advanced testing

#### Run tests without Selenium (chromedriver, geckodriver)

Historically, Behat required Selenium server, however browsers now make use of their own automation layer. For example, Firefox uses `Geckodriver` and Chrome uses `Chromedriver`. As a result the use of Selenium itself is now optional.

The moodle-browser-config tool includes standard profiles to use these drivers directly and without the use of Selenium.

To use the drivers directly, you must run the driver itself, for example to run `chromedriver`:

```console
chromedriver
```

To run `geckodriver`:

```console
geckodriver
```

:::note

geckodriver runs on port 4444 by default. You cannot geckodriver at the same time as selenium.

:::

After starting your preferred browser, you can then run behat and specify an alternative profile, for example:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml --profile=geckodriver
```

#### Headless browsers

There are a number of reasons that you may prefer to use a headless browser. It can be particularly helpful if you are running the tests on a remote system, for example over SSH, or if you do not want to be interrupted by browsers popping up on your machine.

The following headless profiles are some of those provided in the moodle-browser-config tool as standard:

1. `headlessfirefox` Use Firefox via Selenium, without displaying the GUI
2. `headlessgeckodriver` Use Firefox with Geckodriver directly, without displaying the GUI
3. `headlesschrome` Use Chrome via Selenium, without displaying the GUI
4. `headlesschromedriver` Use Chrome with Chromedriver directly, without displaying the GUI
These can be provided to the `--profile` argument to behat:

   ```console
   vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml --profile=headlesschrome
   ```

#### Parallel runs

Out-of-the-box, Moodle will configure Behat to run a single Moodle installation with all tests run in series. This is great for developer use where you are running a single test. or a small suite of tests. However this can be quite slow. A lot of time is spent waiting in Behat for things to happen. This may be for a page to load, for additional content to load, or even explicit waits because some interactions must be deliberately slowed down. As a result, a system running behat will not have a particularly high load most of the time.

If you want to run a large suite of tests then it is possible to take advantage of the relatively low resource consumption by running several behat runners in parallel. This is commonly referred to as a **Parallel run**.

A parallel run of behat takes the same codebase and creates several installations rather than just a single Moodle installation. The behat Feature files are then grouped and allocated between each of the separate installations.

To support this, each of the parallels runs needs its own:

- `behat_wwwroot`
- `behat_dataroot`
- `database`

Rather than using an entirely separate database, the same database is actually used, but a different `behat_prefix` is used to prefix the table names in the database differently.

##### Installation

The Behat initialisation command is responsible for preparing Moodle to run a standard run. You'll have used this before when installing for a standard run:

```console
php admin/tool/behat/cli/init.php
```

The same command can be used to prepare Moodle for a parallel run by specifying the `--parallel` or `-j` parameter:

```console title="Below command will initialise moodle to run 3 parallel tests."
php admin/tool/behat/cli/init.php --parallel=3
```

This can be combined with the `--add-core-features-to-theme` or `-a` flag to prepare Behat to run with all installed themes.

A number of advanced options are also available but you are unlikely to need these:

1. `-m=<number>` or `--maxruns=<number>` Max parallel site which should be initialised at one time. If your system is slow, then you can initialise sites in chucks.
1. `--fromrun=<number>` Initialise site to run specified run from. Used for running acceptance tests on different vms
1. `--torun=<number>` Initialise site to run specified run till. Used for running acceptance tests on different vms
1. `-o` or `--optimize-runs` This option will split features with specified tags in all parallel runs, so they are executed first when parallel run gets executed.
You can view details of all of these using the `--help` flag to `admin/tool/behat/cli/init.php`

##### Running Parallel tests

You can use the Moodle behat runner to run all tests, including Standard runs. It is an intelligent wrapper around the standard `./vendor/bin/behat` command which specifies the configuration file, and other required features.

```console
php admin/tool/behat/cli/run.php
```

Many of the standard options and parameters that can be passed to `./vendor/bin/behat` can also be passed to the Moodle runner, for example:

1. `--tags` Run tests which match the specified tags
1. `--name="Scenario name"` Run a test matching the supplied scenario name
1. `--feature="/path/to/test.feature"` Run a specific feature file.
1. `--suite` Features for specified theme will be executed.
The runner also includes a number of custom parameters relating to parallel runs:
1. `--replace` Replace args string with run process number, useful for output and reruns.
1. `--fromrun` Execute run starting from (Used for parallel runs on different vms)
1. `--torun` Execute run till (Used for parallel runs on different vms)
The `--replace` feature is particularly useful and can be used to replace a string in the command with the run number. This is useful when specifying output formats, and rerun files as noted below.

The following example demonstrates how Behat might be initialised with three parallel runs, to run on all themes:

```console
php admin/tool/behat/cli/init.php --parallel=3 --add-core-features-to-theme
```

And then to run all tests matching the `@tool_myplugin` tag, against the `classic` theme:

```console
php admin/tool/behat/cli/run.php --tags="@tool_myplugin" --suite="classic"
```

##### Custom parameters for parallel runs

You can set following custom config options for parallel runs via $CFG->behat_parallel_run. It's an array of options where 1st array is for 1st run and so on.

```php
$CFG->behat_parallel_run = [
        [
           'dbtype' => 'mysqli',
           'dblibrary' => 'native',
           'dbhost' => 'localhost',
           'dbname' => 'moodletest',
           'dbuser' => 'moodle',
           'dbpass' => 'moodle',
           'behat_prefix' => 'mdl_',
           'wd_host' => 'http://127.0.0.1:4444/wd/hub',
           'behat_wwwroot' => 'http://127.0.0.1/moodle',
           'behat_dataroot' => '/home/example/bht_moodledata'
       ],
       // ...
],
```

To set different selenium servers for parallel runs, you can use following.

```php
$CFG->behat_parallel_run = [
        [=> 'http://127.0.0.1:4444/wd/hub']('wd_host'),
        [=> 'http://127.0.0.1:4445/wd/hub']('wd_host'),
        [=> 'http://127.0.0.1:4446/wd/hub']('wd_host'),
];
```

:::tip

Running parallel (headless) runs on different selenium servers avoid random focus failures.

:::

#### Tests filters

With the `--tags` or the `-name` Behat options you can filter which tests are going to run or which ones are going to be skipped. There are a few tags that you might be interested in:

- `@JavaScript`: All the tests that runs in a browser using JavaScript; they require Selenium or the browser's own automation layer, as per [Run tests without Selenium](./running.md#run-tests-without-selenium-chromedriver-geckodriver) to be running, otherwise an exception will be thrown.
- `@_file_upload`: All the tests that involves file uploading or any OS feature that is not 100% part of the browser. They should only be executed when Selenium is running in the same machine where the tests are running.
- `@_alert`: All the tests that involves JavaScript dialogs (alerts, confirms...) are using a feature that is OS-dependant and out of the browser scope, so they should be tag appropriately as not all browsers manage them properly.
- `@_switch_window`: All the tests that are using the `I switch to "NAME" window` step should be tagged as not all browsers manage them properly.
- `@_switch_iframe`: All the tests that are using the `I switch to "NAME" iframe` steps should be tagged as it is an advanced feature and some browsers may have problems dealing with them
- `@_cross_browser`: All the tests that should run against multiple combinations of browsers + OS in a regular basis. The features that are sensitive to different combinations of OS and browsers should be tagged as @_cross_browser.
- `@componentname`: Moodle features uses the [Frankenstyle](https://docs.moodle.org/dev/Frankenstyle) component name to tag the features according to the Moodle subsystem they belong to.

#### Output formats

Behat is able to output in a number of different formats, and to different locations as required.

This can be achieved by specifying the `--format`, and `--out` parameters when running behat, for example:

```console title="Run behat, using the 'pretty' format and outputting the value to /tmp/pretty.txt"
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml \
        --format=pretty --out=/tmp/pretty.txt
```

It is also possible to output to multiple formats simultaneously by repeating the arguments, for example:

Since Moodle 3.1 option for output is:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml \
        --format=pretty --out=/tmp/pretty.txt \
        --format=moodle_progress --out=std
```

The following output formats are supported:

1. `progress`: Prints one character per step.
1. `pretty`: Prints the feature as is.
1. `junit`: Outputs the failures in JUnit compatible files.
1. `moodle_progress`: Prints Moodle branch information and dots for each step.
1. `moodle_list`: List all scenarios.
1. `moodle_stepcount`: List all features with total steps in each feature file. Used for parallel run.
1. `moodle_screenshot`: Take screenshot and core dump of each step. With following options you can dump either or both.
1. `--format-settings '{"formats": "image"}'`: will dump image only
1. `--format-settings '{"formats": "html"}'`: will dump html only.
1. `--format-settings '{"formats": "html,image"}'`: will dump both.
1. `--format-settings '{"formats": "html", "dir_permissions": "0777"}'`
Note: If you want to see the failures immediately (rather than waiting ~3 hours for all the tests to finish) then either use the `-v` option to output a bit more information, or change the output format using `--format`. Format `pretty` (**-f pretty**) is sufficient for most cases, as it outputs each step outcomes in the command line making easier to see the progress.

When working with parallel runs, you may wish to have an output for each run. If you were to specify a standard path for this then each of the parallel runs would overwrite the others file. The `--replace` option allows this to be handled:

```console
admin/tool/behat/cli/run.php \
        --replace="{runprocess}" \
        --format=pretty --out=/tmp/pretty_{runprocess}.txt \
        --format=moodle_progress --out=std
```

In this example, the `--replace` argument is provided with a value of `{runprocess}`. Anywhere that `{runprocess}` appears in the command it will be replaced with the run number. The above command will generate a set of commands like:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun1/behat/behat.yml \
        --format=pretty --out=/tmp/pretty_1.txt \
        --format=moodle_progress --out=std

vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun2/behat/behat.yml \
        --format=pretty --out=/tmp/pretty_2.txt \
        --format=moodle_progress --out=std

vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun3/behat/behat.yml \
        --format=pretty --out=/tmp/pretty_3.txt \
        --format=moodle_progress --out=std
```

#### Rerun failed scenarios

With slow systems or parallel run you may experience see some random failures. These may happen when your system is too slow, when it is too fast, or where a page depends on external dependencies.

To help with this it is possible to rerun any failed scenarios using the `--rerun` option to Behat.

The following example runs Behat with the rerun option:

```console
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml \
        --format=pretty --out=/tmp/pretty.txt \
        --format=moodle_progress --out=std \
        --rerun
```

If any single test fails then the command will return a non-zero exit code. Running the same command again will mean that only failed scenarios are run.

For a parallel run it can be called as follows:

```console
admin/tool/behat/cli/run.php \
        --replace="{runprocess}" \
        --format=pretty --out=/tmp/pretty_{runprocess}.txt \
        --format=moodle_progress --out=std \
        --rerun
```

:::tip

The Moodle behat runner also includes an `--auto-rerun` option which will automatically rerun failed scenarios exactly once.

:::

#### Running behat with specified theme

Behat can be run with any installed theme, but it must be initialised with the `-a` or `--add-core-features-to-theme` option first.

After configuring the theme can be specified using the `--suite` parameter.

:::note

The default theme in Moodle (boost) has the suite name `default`.

```console title="Initialise Behat for all themes"
php admin/tool/behat/cli/init.php --add-core-features-to-theme
```

```console title="Run Behat against all initalised themes"
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml
```

```console title="Run Behat against just the default theme when all themes were initialised"
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml --suite=default
```

```console title="Run Behat against just the 'classic' theme when all themes were initialised"
vendor/bin/behat --config /Users/nicols/Sites/moodles/sm/moodledata_behat/behatrun/behat/behat.yml --suite=classic
```

:::

#### Using Docker to start selenium server

There are a wide range of docker images available which contain a browser with Selenium. You will probably be using the official SeleniumHQ images unless you have a specific reason not to.

The complete list of available SeleniumHQ images is available at [https://hub.docker.com/u/selenium/](https://hub.docker.com/u/selenium/).

Moodle uses the *standalone* version and any recent version with version 3.141.59 or higher is supported.

For any test which uploads files, for example when interacting with the filepicker, you must also ensure that the Moodle directory is mounted as on your local filesystem.

An example usage is:

```console
docker run -d -p 4444:4444 -v `pwd`:`pwd` selenium/standalone-firefox:latest
```

#### Change config.php file

In the Moodle `config.php` file you must change the `$CFG->behat_wwwroot` to an address that can be reached from within the docker image.

You cannot use `localhost` or `127.0.0.1` as this will be the IP address of the docker container itself.

On some more recent versions of Docker you can use `http://host.docker.internal/`, for example if my site is located at `/sm` on my development machine, I can set the following:

```php
$CFG->behat_wwwroot = 'http://host.docker.internal/sm';
```

#### Manually configuring other browsers

If you would prefer not to use the `moodle-browser-config` tool but still wish to specify different browsers then you can do so using the `$CFG->behat_profiles` array. Each key/value pair contains a profile name, and the configuration for that profile. For example:

```php
$CFG->behat_profiles = [
        'chrome' => [
            'browser' => 'chrome',
            'tags' => '@JavaScript',
        ],
];
```

See [alternative browsers](./browsers/index.md) for more details.

## Troubleshooting

### Increasing timeouts

You may see errors such as:

```
   Javascript code and/or AJAX requests are not ready after 10 seconds.
   There is a Javascript error or the code is extremely slow.
```

Sometimes this indicates a genuine problem with the code, but if you are using a slow computer, it may just mean that your browser did not finish generating parts of the UI before behat tried was finished.

If you find that this happens regularly on different scenarios then you may want to increase the timeout:

```php
$CFG->behat_increasetimeout = 2;
```

This will increase all the timeouts by a factor of 2; if that isn't sufficient, you could use 3.

Increasing timeouts will make tests run a bit slower (because there are points where Behat waits up to a timeout to make sure something doesn't happen) so don't do this unless you need to.

:::note

This is usually an indicator that your development machine is not well tuned. A better option would be to find out where the bottleneck is. This is usually the database configuration.

:::

### New step definitions or features are not executed

If you are adding new tests or steps definitions update the tests list

```console
php admin/tool/behat/cli/util.php --enable
```

:::tip

For parallel runs, all options for initialising parallel runs are valid

:::

### Tests are failing

<!-- cspell:ignore Bselenium -->
If you followed all the steps and you receive an unknown weird error probably your browser version is not compatible with the Selenium version you are running. Please refer to [Working combinations](./browsers/index.md#compatibility) to run the acceptance test.

### The tests are failing, and the error message is completely useless

For example, it just says "Error writing to database" with no stack trace.

Add `-vv` command-line option to get very verbose output.

### Errors during setup (before test are launched)

Typical errors are:

- Behat requirement not satisfied: http://127.0.0.1/m/stable_master is not available, ensure you specified correct url and that the server is set up and started.
- `init.php` or `util.php` complain that `"Unknown error 1 This is not a behat test site!"`.  Delete the behat `wwwroot` (look in `config.php` for `$CFG->behat_dataroot`) and drop the behat DB tables (look in `config.php` for `$CFG->behat_prefix`).  Then try again.
- Behat is configured but not enabled on this test site.
In order to fix those errors please check that: the `behat_dataroot` has correct write permissions and that the `$CFG->behat*` variables are placed before the `lib/setup.php` include:

```php
require_once(__DIR__ . '/lib/setup.php');
```

### Selenium server is not running

#### Chrome specific

If you are using chrome, you need to ensure that the driver matches the version of the installed chrome browser – which may change on OS updates/upgrades. Moodle or Selenium will not give the appropriate message – see [MDL-67659](https://tracker.moodle.org/browse/MDL-67659/). One solution is the one suggested in the issue and use Andrew Nicols' [Chromedriver Wrapper](https://github.com/andrewnicols/chromedriver-wrapper/) which will ensure you have the appropriate driver before running the tests.

## Examples

### Quick setup and testing using moodle-docker

This is a quick guide to help locally pass tests for your developments, before submitting them:

1. Set up a default Moodle install using [moodle-docker](https://github.com/moodlehq/moodle-docker), with the database and Moodle version of your choice. See its README for more details. This will start some docker containers.
2. Initialize behat to start testing with this command, from the webserver container:

   ```console
   php admin/tool/behat/cli/init.php
   ```

3. Run the behat test of your choice, from the webserver container. For instance:

   ```console
   vendor/bin/behat --config /var/www/behatdata/behatrun/behat/behat.yml --tags tool_task
   ```

And you'll see something like:

```
Moodle 4.0dev (Build: 20210507), 0b47ea0a44a092f9000729ca7b15fff23111538b
Php: 7.3.26, mysqli: 5.7.21, OS: Linux 5.4.0-66-generic x86_64
Run optional tests:

Accessibility: No
Server OS "Linux", Browser: "firefox"
Started at 09-05-2021, 06:00
...................................................................... 70
...............................
12 scenarios (12 passed)
101 steps (101 passed)
2m53.27s (47.61Mb)
```

## See also

- [Acceptance testing for the mobile app](/docs/moodleapp/development/testing/acceptance-testing)
- Vagrant profile with Moodle and Behat preconfigured: https://github.com/mackensen/moodle-hat
- Docker containers for Moodle Developers and Behat: https://github.com/moodlehq/moodle-docker
- Docker environment with Behat preconfigured : https://github.com/tobiga/docker_moodle_environment
