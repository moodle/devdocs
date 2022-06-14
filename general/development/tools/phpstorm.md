---
title: Setting up PhpStorm
tags:
 - PhpStorm
 - Tools
---
<!-- markdownlint-disable MD029 -->
[PhpStorm](http://www.jetbrains.com/phpstorm/) is a commercial IDE, it is arguably the best IDE for PHP developers with features such as code completion, code inspection, phpunit support, Behat support, database editor, debugger, etc.

## Installation

### OS X

Do not install Java manually, download a PhpStorm package with bundled java instead.

## General settings

- Uncheck "Missing @throws tag(s)" setting in "Preferences / Editor / Inspections / PHP / PHPDoc"
- Check "Strip trailing whitespace on Modified Lines" in "Preferences / Editor / General"
- Check "Show line numbers" in "Preferences / Editor / Appearance"
- Add Moodle database prefix by create file .phpstorm.meta.php in the project root directory, put the code below to enable PhpStorm recognized {table_name} as Database table:

```php
<?php

namespace PHPSTORM_META {
    override(
    // Virtual function to indicate that all SQL
    // injections will have the following replacement rules.
        sql_injection_subst(),
        map([
            '{' => "mdl_", // all `{` in injected SQL strings will be replaced with a prefix
            '}' => '',        // all `}` will be replaced with an empty string
        ]));
}
```

## Bug tracker integration

- Add tracker linking in "Preferences / Version control / Issue Navigation"
- Set Issue ID to "MDL-\d+|CONTRIB-\d+|MOBILE-\d+|MDLSITE-d+|MDLQA-\d+|UX-\d+|MDLNET-\d+|WPQA-\d+" and Issue link to "https://tracker.moodle.org/browse/$0" or just click on 'add Jira pattern' and paste "https://tracker.moodle.org"

## Code formatting

- Setup coding style to use all rules from [Coding style](/general/development/policies/codingstyle) in "Preferences / Code Style / PHP" (or simply import from https://github.com/enovation/moodle-utils/blob/master/phpstorm-config/Moodle.xml) - this will allow you to use automatic code formatting and it does nice code formatting on copy/paste.
- Set line separator to "Unix and OS X (\n)" in "Preferences / Code Style / General".
- Set right margin to 132 or 180 in "Preferences / Code Style / General".

## Tips & Tricks

- Use `/** @var admin_root $ADMIN */`  to autofill $ADMIN->...
- Remove SQL syntax inspection errors for Moodle tables surrounded by curly brackets (like: `SELECT * FROM {user}`) by adding `\{(\w+)\}` to Tools > Databases > user parameters
(more info: https://blog.jetbrains.com/phpstorm/2014/11/database-language-injection-configuration/ , and a "feature request" to improve it: https://youtrack.jetbrains.com/issue/WI-4123 )
- You can deactivate warnings for specific exceptions (in particular the coding_exception, which is unlikely to be catched in your code) by going to Settings > PHP and add them to 'Unchecked Exceptions' under the 'Analysis' tab

## Moodle code checker

Follow the instructions in the [README](https://github.com/moodlehq/moodle-local_codechecker/blob/master/README.md#ide-integration)

## PHPUnit integration

1. Install [PHPUnit](https://docs.moodle.org/dev/PHPUnit) via Composer
1. Tell PHPStorm where is composer - go to "Preferences / PHP / Composer", fill in "Path to PHP executable", "Path to composer.phar", "Path to composer.json" and make sure the option "Add packages as libraries" is enabled.
1. Go to "Run / Edit configurations"
1. Add PHPUnit configuration by clicking on "+"
1. Click "Use alternative configuration file" and select your phpunit.xml file
1. Go to "Run / Run ..." and select your new PHPUnit configuration to run

## Database editor

1. Click on the "Database" tab to see the database window
1. Click "+" in the top left and add "Database source" for your database
1. Note: click on the link to download the necessary drivers directly from IDE

## JavaScript Development

You can work on JavaScript development by add Grunt configuration:

1. Install Watchman - https://facebook.github.io/watchman/docs/install.html
1. From the main Moodle directory open terminal and run:

```shell
npm install -g grunt-cli
npm install
```

3. Open "Edit configuration"
3. Add new Grunt Task
3. Verify that the node version is set with proper version for the current Moodle version
3. In Tasks select watch
3. Save the Grunt task
3. Verify that in config.php the setting is not comment

```php
$CFG->cachejs = false;
```

9. Click on run icon
9. Happy JavaScript development

## Debugging with Xdebug with docker containers

This is very helpful when developing locally and you need to go step by step on the execution path of something of your interest.

If you're using [moodle-docker](https://github.com/moodlehq/moodle-docker), please refer to its section about [live debugging](https://github.com/moodlehq/moodle-docker#using-xdebug-for-live-debugging) before taking this section. If you are using a custom docker container, the web server container should be based on Debian-like to have the following instructions compatible.

These are the steps for configuring Xdebug to live debugging your code:

1. Be sure containers are stopped.
1. If you're using Docker on Mac or Windows, you can omit this step. So, only if you're using Docker on linux: Create a file named `add-host.docker.internal-to-etc-hosts` with execution rights on the Moodle root:

```php
#!/bin/bash
apt update
apt install -y iproute2
apt clean
apt auto-clean
HOST_DOMAIN="host.docker.internal"
ping -q -c1 $HOST_DOMAIN > /dev/null 2>&1
if [ $? -ne 0 ]; then
  HOST_IP=$(ip route | awk 'NR==1 {print $3}')
  echo -e "$HOST_IP\t$HOST_DOMAIN" >> /etc/hosts
fi
```

3. Edit the `base.yml</syntaxhighlight> from the moodle-docker root (or equivalent from your custom docker container) to append these lines into the <syntaxhighlight lang="php">webserver: environment:` section:

```php
      XDEBUG_CONFIG:
        idekey=phpstorm
        remote_enable=1
        remote_mode=req
        remote_port=9000
        remote_host=host.docker.internal
        remote_connect_back=0
      PHP_IDE_CONFIG:
        serverName=moodle-local
```

4. The result for the `webserver` service should be like this (this example is from moodle-docker):

```php
  webserver:
    image: "moodlehq/moodle-php-apache:${MOODLE_DOCKER_PHP_VERSION}"
    depends_on:
      - db
    volumes:
      - "${MOODLE_DOCKER_WWWROOT}:/var/www/html"
      - "${ASSETDIR}/web/apache2_faildumps.conf:/etc/apache2/conf-enabled/apache2_faildumps.conf"
    environment:
      MOODLE_DOCKER_DBTYPE: pgsql
      MOODLE_DOCKER_DBNAME: moodle
      MOODLE_DOCKER_DBUSER: moodle
      MOODLE_DOCKER_DBPASS: "m@0dl3ing"
      MOODLE_DOCKER_BROWSER: firefox
      MOODLE_DOCKER_WEB_HOST: "${MOODLE_DOCKER_WEB_HOST}"
      XDEBUG_CONFIG:
        idekey=phpstorm
        remote_enable=1
        remote_mode=req
        remote_port=9000
        remote_host=host.docker.internal
        remote_connect_back=0
      PHP_IDE_CONFIG:
        serverName=moodle-local
```

5. Start the moodle-docker containers, or your custom ones.
1. Only if you're using Docker on linux: From a PhpStorm terminal, run: `docker exec -it moodledocker_webserver_1 ./add-host.docker.internal-to-etc-hosts`. You have to see how packages are installed.
1. In any type of host (Mac, Windows or linux): Check that `/etc/hosts</syntaxhighlight> has a line with <syntaxhighlight lang="php">host.docker.internal</syntaxhighlight>. You can do that with the command <syntaxhighlight lang="php">docker exec -it moodledocker_webserver_1 cat /etc/hosts` (if you have a custom container name, use the name for the webserver container). The result should be something like this:

```php
127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.20.0.6      17dff32616ac
172.20.0.1      host.docker.internal
```

8. Go to your PhpStorm and go to `Run -> Edit configurations</syntaxhighlight> and select new <syntaxhighlight lang="php">PHP Remove Debug`
1. Name: "xdebug localhost" (or what you want to)
1. Configuration: check "Filter debug connection by IDE key"
1. IDE key(session id): "phpstorm"
1. Define a new server:
1. Name: must be "moodle-local"
1. Host: localhost
1. Port: must be the port you're using for the web server.
1. Debugger: use the default (Xdebug)
1. Check "Use path mappings (...)"
1. Set for your "Project files" Moodle root the "Absolute path on the server" as "/var/www/html"
1. Apply and OK on this screen. This screen will be closed.
1. Apply and OK on the next screen. Settings screen will be closed.
1. Now, test that live debugging works. To do so, please:
1. Put a breakpoint on /index.php file.
1. Press telephone icon with a red symbol with title "Start listening for PHP Debug Connections": telephone should appear with some waves now.
1. Open your browser and open your localhost Moodle site.
1. Happy debugging ;-)

Final note: Every time you start the webserver container, ONLY if you're using a linux host, you have to run the script for adding the host.docker.internal.
Final note 2: This method also works if your docker containers are in a different host from localhost: you just need to specify the proper server name and port.
Final note 3: This configuration also allows you to debug CLI scripts.

## Useful plugins

1. Php Inspections ​(EA Extended) - https://plugins.jetbrains.com/plugin/7622-php-inspections-ea-extended-/
1. SonarLint - https://plugins.jetbrains.com/plugin/7973-sonarlint/
1. Diff / Patch File Support - https://plugins.jetbrains.com/plugin/11957-diff--patch-file-support/
1. Handlebars/Mustache - https://plugins.jetbrains.com/plugin/6884-handlebars-mustache/
1. Markdown Navigator - https://plugins.jetbrains.com/plugin/7896-markdown-navigator/
1. PHP composer.json support - https://plugins.jetbrains.com/plugin/7631-php-composer-json-support/
1. PHP Advanced AutoComplete - https://plugins.jetbrains.com/plugin/7276-php-advanced-autocomplete/
