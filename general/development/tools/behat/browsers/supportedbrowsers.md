---
title: Working combinations of OS+Browser+selenium
tags:
  - Behat
---
As OS, Browsers and Selenium keeps updating, some combination might fail on different Moodle releases.

Following combinations have been tested at the time of release of Moodle version and will be supported for that combination.

## Moodle 3.9 and up

<!-- cspell:ignore Geckodriver, zerosize -->

<table><tbody>
<tr><td>

OS

</td><td>

Browser

</td><td>

Selenium Server

</td><td>

Browser Driver

</td><td>

Notes

</td></tr>
<tr><td>

Linux - Debian Stretch/Buster

</td><td>

Firefox 83.0

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[Geckodriver 0.30.0](https://github.com/mozilla/geckodriver/releases/tag/v0.30.0)

</td><td>

</td></tr>
<tr><td>

Linux - Debian Stretch/Buster

</td><td>

Chrome 86

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[86.0.4240.22](https://chromedriver.storage.googleapis.com/index.html?path=86.0.4240.22/)

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
<tr><td>

MacOS X

</td><td>

Firefox 83.0

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[Geckodriver 0.30.0](https://github.com/mozilla/geckodriver/releases/tag/v0.30.0)

</td><td>

</td></tr>
<tr><td>

MacOS X

</td><td>

Chrome 86

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[86.0.4240.22](https://chromedriver.storage.googleapis.com/index.html?path=86.0.4240.22/)

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
<tr><td>

Windows

</td><td>

Firefox 83.0

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[Geckodriver 0.30.0](https://github.com/mozilla/geckodriver/releases/tag/v0.30.0)

</td><td>

</td></tr>
<tr><td>

Windows

</td><td>

Chrome 86

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[86.0.4240.22](https://chromedriver.storage.googleapis.com/index.html?path=86.0.4240.22/)

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
</tbody></table>

:::note

Many of the combinations below, for older versions of Moodle 3.5 and up, should continue working acceptably well for Moodle 3.9 and up. Just the those listed above are actively being used now (CI infrastructure, developers...), hence, verified to be running ok. Feel free to add more relevant working combinations!

:::

## Moodle 3.5 and up

<table><tbody>
<tr><td>

OS

</td><td>

Browser

</td><td>

Selenium Server

</td><td>

Chrome Driver

</td><td>

IE Driver

</td><td>

Notes

</td></tr>
<tr><td>

Linux - Debian Stretch/Buster

</td><td>

Firefox 47.0.1

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

N/A

</td><td>

N/A

</td><td>

Requires special behat config ([more info here](https://docs.moodle.org/dev/Actual_Selenium_with_old_Firefox_47.0.1))

</td></tr>
<tr><td>

Linux - Debian Stretch/Buster

</td><td>

Chrome 66

</td><td>

[3.11.0](https://selenium-release.storage.googleapis.com/3.11/selenium-server-standalone-3.11.0.jar)

</td><td>

[2.38](http://chromedriver.storage.googleapis.com/index.html?path=2.38/)

</td><td>

N/A

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
<tr><td>

MacOS X

</td><td>

Firefox 47.0.1

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

N/A

</td><td>

N/A

</td><td>

Requires special behat config ([more info here](https://docs.moodle.org/dev/Actual_Selenium_with_old_Firefox_47.0.1))

</td></tr>
<tr><td>

MacOS X

</td><td>

Chrome 72

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[2.46](http://chromedriver.storage.googleapis.com/index.html?path=2.46/)

</td><td>

N/A

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
<tr><td>

Windows

</td><td>

Firefox 47.0.1

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

N/A

</td><td>

N/A

</td><td>

Requires special behat config ([more info here](https://docs.moodle.org/dev/Actual_Selenium_with_old_Firefox_47.0.1))

</td></tr>
<tr><td>

Windows

</td><td>

Chrome 72

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[72.0.3626.69](https://chromedriver.storage.googleapis.com/index.html?path=72.0.3626.69/)

</td><td>

N/A

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
</tbody></table>
General note: Many of the combinations below, for Moodle 3.1 and up, should continue working acceptably well for Moodle 3.5 and up. Just the those listed above are actively being used now (CI infrastructure, developers...), hence, verified to be running ok. Feel free to add more relevant working combinations!

## Moodle 3.4

<table><tbody>
<tr><td>

OS

</td><td>

Browser

</td><td>

Selenium Server

</td><td>

Chrome Driver

</td><td>

IE Driver

</td><td>

Notes

</td></tr>
<tr><td>

Linux - Debian Stretch

</td><td>

Firefox 47.0.1

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

N/A

</td><td>

N/A

</td><td>

Requires special behat config ([more info here](https://docs.moodle.org/dev/Actual_Selenium_with_old_Firefox_47.0.1))

</td></tr>
<tr><td>

Linux - Debian Stretch

</td><td>

Chrome 66

</td><td>

[3.11.0](https://selenium-release.storage.googleapis.com/3.11/selenium-server-standalone-3.11.0.jar)

</td><td>

[2.38](http://chromedriver.storage.googleapis.com/index.html?path=2.38/)

</td><td>

N/A

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
<tr><td>

MacOS X

</td><td>

Firefox 47.0.1

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

N/A

</td><td>

N/A

</td><td>

Requires special behat config ([more info here](https://docs.moodle.org/dev/Actual_Selenium_with_old_Firefox_47.0.1))

</td></tr>
<tr><td>

MacOS X

</td><td>

Chrome 72

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[2.46](http://chromedriver.storage.googleapis.com/index.html?path=2.46/)

</td><td>

N/A

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
<tr><td>

Windows

</td><td>

Chrome 72

</td><td>

[3.141.59](https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar)

</td><td>

[72.0.3626.69](https://chromedriver.storage.googleapis.com/index.html?path=72.0.3626.69/)

</td><td>

N/A

</td><td>

Any other valid combination should work ok, normally.<br/>(Here there is a [good list](https://github.com/SeleniumHQ/docker-selenium/releases) of them, as reference)

Chrome >=76 can be used since Moodle 20190909 builds.

Chrome >=93 can be used since Moodle 20210916 builds and requires to exclude the @skip_chrome_zerosize [MDL-71108](https://tracker.moodle.org/browse/MDL-71108) tags till the browser issue is fixed.

</td></tr>
</tbody></table>

## Moodle 3.2 and 3.3

<table><tbody>
<tr><td>

OS

</td><td>

Browser

</td><td>

Selenium Server

</td><td>

Chrome Driver

</td><td>

IE Driver

</td></tr>
<tr><td>

Linux - Ubuntu 16.04

</td><td>

Firefox 47.0.1

</td><td>

[2.53.1](http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.1.jar)

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Linux - Ubuntu 16.04

</td><td>

[Chrome 53.0](https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F403380%2Fchrome-linux.zip?generation=1467337264475000&alt=media)

</td><td>

[3.0.1](http://selenium-release.storage.googleapis.com/index.html?path=3.0/)

</td><td>

[2.25](http://chromedriver.storage.googleapis.com/index.html?path=2.25/)

</td><td>

N/A

</td></tr>
<tr><td>

Linux - Ubuntu 16.04

</td><td>

Phantomjs 2.1.1

</td><td>

2.53.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Windows 7/10

</td><td>

Firefox 47.0.1

</td><td>

2.53.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Windows 7/10

</td><td>

Chrome v53.0

</td><td>

[3.0.1](http://selenium-release.storage.googleapis.com/index.html?path=3.0/)

</td><td>

[2.25](http://chromedriver.storage.googleapis.com/index.html?path=2.25/)

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

Firefox 47.0.1

</td><td>

2.53.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

[Chrome v53.0](http://www.slimjet.com/chrome/google-chrome-old-version.php)

</td><td>

[3.0.1](http://selenium-release.storage.googleapis.com/index.html?path=3.0/)

</td><td>

[2.25](http://chromedriver.storage.googleapis.com/index.html?path=2.25/)

</td><td>

N/A

</td></tr>
</tbody></table>

## Moodle 3.1

<table><tbody>
<tr><td>

OS

</td><td>

Browser

</td><td>

Selenium Server

</td><td>

Chrome Driver

</td><td>

IE Driver

</td></tr>
<tr><td>

Linux - Ubuntu 16.04

</td><td>

[Firefox 47.0.1](https://download.mozilla.org/?product=firefox-47.0.1-SSL&os=linux64&lang=en-GB)

</td><td>

[2.53.1](http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.1.jar)

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Linux - Ubuntu 16.04

</td><td>

[Chrome 51.0](https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F386249%2Fchrome-linux.zip?generation=1460160957434000&alt=media)

</td><td>

2.53.1

</td><td>

2.22

</td><td>

N/A

</td></tr>
<tr><td>

Linux - Ubuntu 16.04

</td><td>

Phantomjs 2.1.1

</td><td>

2.53.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Windows 7/10

</td><td>

Firefox 47.0.1

</td><td>

2.53.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Windows 7/10

</td><td>

Chrome v51.0

</td><td>

2.53.1

</td><td>

2.22

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

Firefox 47.0.1

</td><td>

2.53.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

Chrome v51.0

</td><td>

2.53.1

</td><td>

2.22

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

PhantomJS 2.1.1

</td><td>

2.53.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
</tbody></table>

## Moodle 3.0 and lower

<table><tbody>
<tr><td>

OS

</td><td>

Browser

</td><td>

Selenium Server

</td><td>

Chrome Driver

</td><td>

IE Driver

</td></tr>
<tr><td>

Linux - Ubuntu 14.10

</td><td>

Firefox 42.0

</td><td>

2.47.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Linux - Ubuntu 14.10

</td><td>

Chrome 46.0

</td><td>

2.47.1

</td><td>

2.19.346067

</td><td>

N/A

</td></tr>
<tr><td>

Linux - Ubuntu 14.10

</td><td>

Phantomjs 2.0.0

</td><td>

2.47.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Windows 7/10

</td><td>

Firefox 41.0

</td><td>

2.47.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

Windows 7/10

</td><td>

Chrome 47.0

</td><td>

2.47.1

</td><td>

2.20

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

Firefox 41.0

</td><td>

2.47.1

</td><td>

N/A

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

Chrome 46.0

</td><td>

2.47.1

</td><td>

2.20

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

Chrome 48.0

</td><td>

2.51.0

</td><td>

2.21

</td><td>

N/A

</td></tr>
<tr><td>

MacOS X

</td><td>

PhantomJS - 2.0.0 & 2.1.1

</td><td>

2.48.2

</td><td>

N/A

</td><td>

N/A

</td></tr>
</tbody></table>
