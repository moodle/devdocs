---
title: Moodle Development Kit
tags:
  - tools
---

Every developer creates simple tools to avoid repeating cumbersome and/or boring tasks, and that is precisely why MDK has been created: to pack all those useful tools in a portable way across systems. Initially developed in Bash, the project moved to Python to avoid dealing with inconsistencies between Unix platforms, and eventually to support Windows.

## Key concept

The most important concept of MDK is that it works with Moodle instances. An instance of Moodle is a directory in which you have checked out a particular version together with a database using a specific database engine. This means that if you want to work on Moodle 4.3 and 4.2, using both MySQL and PostgreSQL, you will have four separate instance directories. This choice was made because it is the safest, clearest, and most straightforward solution.

## Typical workflows using MDK

To discover what MDK can do for you, here are a few common tasks it can achieve. More on [MDK's wiki](https://github.com/FMCorz/mdk/wiki/Typical-workflows).

### Installing a new instance

Say we need to create a new instance of Moodle 2.4 and install it with PostgreSQL. We also want the instance to be ready for development with appropriate config settings. We also want to create a bunch of user accounts.

```
mdk create -i -v 24 -e pgsql -r dev users
```

or the equivalent long form:

```
mdk create --install --version 24 --engine pgsql --run dev users
```

These options include:

- `--install`: launch the installation script after creating the instance
- `--engine`: database engine to install the instance on (must be used with `--install`), default: `mysqli`
- `--version`: version of Moodle create an instance of (default: `main`)
- `--run`: scripts to run after installation (default: `none`)

Check out MDK's [`scripts` folder](https://github.com/FMCorz/mdk/tree/master/mdk/scripts) for more information.

<details>
  <summary>This is equivalent to doing</summary>
  <div>

```
mkdir /dir/to/stable_24/moodle
mkdir /dir/to/stable_24/moodledata
ln -s /dir/to/stable_24/moodle /var/www/stable_24
git clone git://git.moodle.org/moodle.git /dir/to/moodle
cd /dir/to/stable_24/moodle
php admin/cli/install.php --wwwroot## "http://localhost/stable_24" --dataroot/dir/to/stable_24/moodledata --dbtype## pgsql --dbnamestable24 --dbuser## root --dbpassroot --dbhost## localhost --fullname"Stable 24 PostgreSQL" --shortname## stable_24 --adminuseradmin --adminpass=test --allow-unstable --agree-license --non-interactive
vim config.php
# Add the following settings:
# - $CFG->sessioncookiepath: /stable_24/
# - $CFG->debug: DEBUG_DEVELOPER
# - $CFG->debugdisplay: 1
# - $CFG->passwordpolicy: 0
# - $CFG->perfdebug: 15
# - $CFG->debugpageinfo: 1
# - $CFG->allowthemechangeonurl: 1
# - $CFG->cachejs: 0
# - $CFG->yuicomboloading: 0
# Include FirePHP Core
# Login to Moodle
# Create 10 students, 3 teachers and 3 managers
```

  </div>
</details>

You also can specify the name of the instance using the --name or -n parameter. This is necessary to avoid name conflicts when trying to create same Moodle version with different database engines:

```
mdk create -i -v 24 -e mysqli -r dev users -n stable_24-mysql
```

### Fixing an issue

```
mdk fix 12345
# Committing your patch
mdk push -t
```

<details>
  <summary>This is equivalent to doing</summary>
  <div>

```
git branch --track MDL-12345-24 origin/MOODLE_24_STABLE
git checkout MDL-12345-24
# Committing your patch
git push github MDL-12345-24
# Editing the tracker issue to add
# - Git repository URL
# - Git branch for 2.4
# - Git compare URL for 2.4
```

  </div>
</details>

### Peer reviewing a patch

Here we want to pull a patch from a tracker issue into a new testing branch, and then run the PHPUnit tests.

```
mdk pull 12345 -t
mdk phpunit -r
```

<details>
  <summary>This is equivalent to doing</summary>
  <div>

```
cd /dir/to/stable_24/moodle
git branch --tracker MDL-12345-24-test MOODLE_24_STABLE
git checkout MDL-12345-24-test
git pull git://github.org/Someone/moodle.git MDL-12345-24
# And now the PHPUnit part
mkdir /dir/to/stable_24/moodledata_phpu
vim config.php
# To add
# - $CFG->phpunit_dataroot = '/dir/to/stable_24/moodledata_phpu';
# - $CFG->phpunit_prefix = 'phpu_';
php admin/tool/phpunit/cli/init.php
phpunit
```

  </div>
</details>

For executing only the testcases in a file you can use:

```
mdk phpunit -r -u repository/tests/repository_test.php
```

### Backporting a fix

MDK could handle for you most of the cherry-picking work when you backport a fix. To do so, you need to have installed locally instances called "stable_XX" for each version you want to backport your fix. To do so you can use commands like:

```
mdk create -v 38 -i -r dev users makecourse -n stable_38
mdk create -v 37 -i -r dev users makecourse -n stable_37
```

Once you have the stable_XX versions, go to the instance where you have the branch you want to backport and execute:

```
mdk backport --versions 37 38 --push --update-tracker
```

The example params are:

- `-v 37 38` backports the patch to the versions 3.7 and 3.8
- `--push` pushes the branch to github
- `--update-tracker` updates the tracker issue

After the execution, your stable_XX instances will be on the fix branch, commits are pushed to you github project and backport links will be updated in the tracker.

If for some reason one cherry pick could not finish successfully, mdk will ask you if you want to keep this backport or no. If you choose to keep the partial backport, your stable_XX instance will be in cherry-picking state. In that case you need to solve any conflict and use mdk to push your changes:

1. go to your stable_XX with cherry pick conflict
1. solve conflicts with `git mergetool` or any other tool
1. `git cherry-pick --continue`
1. once all conflicts are solved, push to your repository and tracker using

```
mdk push -t
```

### Upgrading the instances

Say we need to upgrade our instances, as a new weekly release has just been made available.

```
mdk upgrade -u --all
```

<details>
  <summary>This is equivalent to doing</summary>
  <div>

```
# For each instance of Moodle...
cd /dir/to/stable_24/moodle
git checkout MOODLE_24_STABLE
git fetch origin
git reset --hard origin/MOODLE_24_STABLE
php admin/cli/upgrade.php --non-interactive --allow-unstable
```

  </div>
</details>

### Executing behat tests

In order to get the instance ready for acceptance testing (Behat) and run the test feature(s):

```
mdk behat -r --tags=@core_completion
```

For running only one feature or specific scenario:

```
mdk behat -r -n "Name of the feature/scenario"
```

## Features

For a complete list of the commands MDK has to offer, read through the [MDK README file](https://github.com/FMCorz/mdk#command-list) and the [MDK wiki](https://github.com/FMCorz/mdk/wiki). For more detail about each command, simply run them with the flag '--help'.

## Installation

Please follow the instructions from the [README file](https://github.com/FMCorz/mdk#installation).

:::note

When you install MDK, you will be asked for the following information (with default responses indicated in square brackets):

- What user are you initialising MDK for? [default - your current username]
- What is the `DocumentRoot` of your virtual host? [`~/www`] \<- **See note below**
- Where do you want to store your Moodle instances? [`~/moodles`] \<- This can be in your home directory (the default) because a symlink will be created using `DocumentRoot`
- What is your Github username? (Leave blank if not using Github)
- What is your MySQL user? [`root`]
- What is your MySQL password? [`root`]
- What is your PostgreSQL user? [`root`]
- What is your PostgreSQL password? [`root`]

By default, MDK will install instances to your home directory. A symlink will be created from your `DocumentRoot` to the install location. You will need to either change the `DocumentRoot` of your host to the path to your html root directory, for example `/var/www/html`, or create a file in `/etc/httpd/conf.d/moodlehq.conf` that configures a virtual host in your home directory.

You may need to set the path variable to null:

```
mdk config set path ""
```

:::

## Upgrading MDK

Every Moodle release, a new version of MDK is also being released in order to prepare for the development of the next Moodle version. To upgrade MDK:

1. Update all of the Moodle instances: `mdk update --all`
1. Check out the `main` branch for all of your `main` instances, e.g. in your stable_main branch: `git checkout main`
1. Upgrade MDK
   1. Via pip: `sudo pip install moodle-sdk --upgrade`
   1. Via Homebrew: `brew upgrade moodle-sdk`
1. Run MDK doctor to fix its `masterBranch` configuration. `mdk doctor --fix --masterbranch`
1. Run MDK doctor to check the `main` instances. `mdk doctor --all`
   1. If you don't see an error saying something like "stable_main is on branch main instead of MOODLE_XX_STABLE", then you're all good. Otherwise, do a hard reset your main instances:

```
mdk update -c
cd ~/moodles/[integration/stable]_main
git checkout main
git fetch `mdk config show upstreamRemote`
git reset --hard `mdk config show upstreamRemote`/main
```

## The MDK Suite

Some other tools have been developed using the name MDK as they are considered as part of the development kit but are often mistaken with the __real__ MDK. The __real__ MDK is the command line tool described above.

### MDK Browser Extension

Available for both [Firefox](https://addons.mozilla.org/en-US/firefox/addon/mdk-browser-extension/) and [Chrome](https://chrome.google.com/webstore/detail/mdk-browser-extension/iadpkkojcdoflinpncpkbonnhdlaicnc), this is a browser extension that allows quick access to useful user-scripts. The scripts add functionality to Moodle.org, Moodle Tracker and your Moodle instances. You can find more information about it on its [public repository](https://github.com/danpoltawski/userscripts-moodle).

### MDK Authentication

This is an authentication plugin for Moodle 2.x, which not only creates the user if it does not exist in the database yet, but also enrols it as a student, teacher or manager in all the available courses. More information about this plugin is available on the [public repository](https://github.com/FMCorz/moodle-auth_mdk).
