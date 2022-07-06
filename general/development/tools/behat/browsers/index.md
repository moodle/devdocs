---
title: Browsers
sidebar_position: 3
tags:
  - Behat
  - Quality Assurance
---
This page complements [Behat](/general/development/tools/behat) providing info about how to run the acceptance tests suite in different browsers.

## Drivers

There are [Selenium drivers](http://docs.seleniumhq.org/projects/webdriver/) to run acceptance tests in different browsers:

- Firefox - https://code.google.com/p/selenium/wiki/FirefoxDriver
- Chrome - https://code.google.com/p/selenium/wiki/ChromeDriver
- Safari - https://code.google.com/p/selenium/wiki/SafariDriver
- Internet Explorer - https://code.google.com/p/selenium/wiki/InternetExplorerDriver
- Microsoft Edge - https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
- PhantomJS (Webkit) - http://phantomjs.org/
- IPhone - https://code.google.com/p/selenium/wiki/IPhoneDriver

Each driver should be downloaded and Selenium .jar should be started specifying the path to the driver; depending on the driver there could be other requirements.

### PhantomJS

PhantomJS is different as it is a headless browser as it is quite faster than other drivers, it doesn't need a GUI to run and can execute JS, it doesn't even need to be used through Selenium (you can do it though, but it's not officially supported) and you can do it

- Download PhantomJS: http://phantomjs.org/download.html
- Run the following command

  ```console
  /path/to/your/phantomjs/bin/phantomjs --webdriver=4444
  ```

Note that 4444 is the default port used by Selenium, so you must specify another one if you want to run them together and specify the port in `$CFG->behat_config`.

### Examples

```console title="Selenium in Linux (firefox by default + chrome)"
   java -jar /opt/selenium-server-standalone.jar -Dwebdriver.chrome.driver=/opt/chromedriver
```

```console title="Selenium in OSx (firefox & safari by default + chrome)"
  java -jar /Users/moodle/Downloads/selenium-server-standalone.jar -Dwebdriver.chrome.driver=/Users/moodle/Downloads/chromedriver
```

```console title="Selenium in Windows (started using git bash) (firefox by default + chrome + internet explorer)"
  java -jar /c/seleniumdrivers/selenium-server-standalone.jar -Dwebdriver.chrome.driver=/c/seleniumdrivers/chromedriver.exe -Dwebdriver.ie.driver=/c/seleniumdrivers/IEDriverServer.exe
```

```console title="PhantomJS"
  /path/to/your/phantomjs/bin/phantomjs --webdriver=4444
```

## Compatibility

Not all the drivers can execute all of Moodle's step definitions; we tagged the step definitions that are using features not supported by all browsers and also limitations that some browsers have; refer to the following table to know which browsers can run which tags:

<!-- cspell:ignore zerosize -->
| | File uploads (@_file_upload) | Browser dialogs (@_alert)                                         | Switch window (@_switch_window) | Switch frame (@_switch_iframe) | Bugs in chrome (@skip_chrome_zerosize) | Bug in phantomjs (@_bug_phantomjs) |
|------------------------------|-------------------------------------------------------------------|---------------------------------|--------------------------------|----------------------------------------|------------------------------------|
| Firefox                      | Yes | Yes | Yes | Yes | Yes | Yes |
| Chrome              | Yes | Yes | Yes | Yes | No (see [MDL-71108](https://tracker.moodle.org/browse/MDL-71108)) | Yes |
| Internet Explorer          | Yes | Yes | No | Yes | Yes | Yes |
| Safari          | Yes | No | No | Yes | Yes | Yes |
| PhantomJS          | No | No | Yes | Yes | Yes | No |

Note that, to skip some tag, you must prepend it with the <tt>~</tt> (logical NOT) character. Examples:

- Run all tests but `@_alert</tt> ones: <tt>--tags '~@_alert'`
- Run all chrome tests but `@skip_chrome_zerosize` ones: `--tags '@JavaScript&&~@skip_chrome_zerosize'`

## Working combinations of OS+Browser+selenium

As OS, Browsers and Selenium keeps updating, some combination of OS+Browser+Selenium will not work on specific moodle version.

We try to support the latest version of these combinations but they are not always BC and hence may not work with older releases. Please refer to [Working combinations of OS+Browser+selenium](/general/development/tools/behat/browsers/supportedbrowsers) to ensure you have correct combination of them to run acceptance test.
