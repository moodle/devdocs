---
title: Composer
tags:
- tools
---

## Use composer to download Moodle code

`Composer.json` now includes meta information and hence composer can be used to download the Moodle code base.
You can do it by creating `composer.json` file with following information

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/moodle/moodle.git"
        }
    ],
    "require": {
        "moodle/moodle": "v4.2.0"
    }
}
```

And then execute:

```sh
php composer.phar install
```

## How to prepare and submit composer changes

There are a number of situations where we need to update the bundled [composer.json](https://github.com/moodle/moodle/blob/main/composer.json)] in core. When we upgrade, for a given branch, [the phpunit](https://tracker.moodle.org/browse/MDL-71036) or [the behat-extension](https://tracker.moodle.org/browse/MDL-70637) versions... we also have to update the [composer.lock](https://github.com/moodle/moodle/blob/main/composer.lock) file, in order to guarantee that all the tests will run in a stable, verified environment.

As far as there are a number of variables affecting how that lock file will be generated, here there are some standard steps to follow, in order to guarantee that any change to composer will be always applied in the same, standard and verified way.

1. Pre-requisite: Always use the **lower PHP version supported** in the branch the changes are happening. So, if a given branch (`MOODLE_37_STABLE`) works with PHP 7.1, 7.2 and 7.3, all the following steps will be executed using PHP 7.1 (the lower version supported).
1. Perform the required changes to the `composer.json` file. Normally.
1. Remove the composer.lock file that is going to be regenerated.<br/>
`rm composer.lock`
1. Remove completely the vendor directory.<br/>
`rm -fr vendor`
1. Clean all composer caches.<br/>
`php composer.phar clearcache`
1. Run `php composer.phar update`, a new `composer.lock` will be regenerated.
1. Check that the `composer.lock` file, together with other changes, does include the changes you've performed in the `composer.json` file.
1. Ideally, run both phpunit and behat tests and verify that there isn't any problem, using all the supported PHP versions.
1. Done, you can send the changes for review, integration and, if everything goes ok, will be applied upstream without problem.
