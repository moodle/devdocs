---
title: Setting up your development environment for the Moodle App
sidebar_label: Setting up your environment
sidebar_position: 1
tags:
 - Moodle App
---

The structure of this page is the following:

- The first part, up to the point where you get the `npm start` command to work, includes the basics of what you need to work on the app.
- The second part indicates how to build the app to run it on a native device (or emulator).
- You can find [troubleshooting advices in a separate page](./troubleshooting.md). If you encounter a problem that is not already listed, please consider adding it.

Most of your development can happen on a browser, you only need to use an emulator if you have to work on native functionality.

If you are just [adding mobile support to plugins](../plugins-development-guide/index.md), you probably don't need to build the app yourself and you can skip reading this page.

## Requirements

### Install a browser for development

Most of the time we recommend that you use a browser for development; the app will work in any Chromium-based browser. We recommend using the Chromium browser (an open source alternative to Google Chrome). You can get it from the [official download page](https://www.chromium.org/getting-involved/download-chromium).

To learn more about using a browser for development, and why it needs to be Chromium-based, read the [Using the Moodle App in a browser](./app-in-browser.md) page.

### Install git

You will need to install Git in order to get the source code and upload your changes. If you are not familiar with it, we recommend that you get started reading the following guide: [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Install Node.js and Npm

We recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm) to make this easier, you can prepare the correct environment running `nvm install` in the project root. Remember to run this every time you work with the app, or if you're not working on any other node projects in your computer you can run ``nvm alias default `node -v` `` to make it the default.

It may seem simpler and easier to install directly from [nodejs.org](http://nodejs.org), but actually it is more tricky to get that to work. If you have previously installed Node directly, and want to switch to nvm, you need to uninstall node completely before installing nvm - or search for troubleshooting instructions online.

### Install native SDKs

If you intend to run the application in a native device, you will need to install that platform's native SDKs. You can learn how to set up your environment by reading Ionic's documentation for [Android](https://ionicframework.com/docs/developing/android) and [iOS](https://ionicframework.com/docs/developing/ios).

### Windows only: Native build dependencies

`node-gyp` requires native build tools for your platform. If you're developing on Mac or Linux, you'll probably have these already ([refer to the docs if you don't](https://github.com/nodejs/node-gyp/blob/main/README.md)). On Windows, run the following command as administrator (in cmd or Powershell):

```bash
npm install --global --production windows-build-tools
```

Warning! This installer can take a very, very long time to run. We were seeing it take hours. Literally. Be prepared to be very patient. Don't just make the natural assumption that it has crashed.

### Mac only: Push notifications

This is only be necessary if you intend to compile the native iOS application. The push notifications plugin requires CocoaPods to work on a Mac; you can find the complete installation instructions in [the official documentation](https://cocoapods.org/), but it should work by running the following commands:

```bash
sudo gem install cocoapods
pod setup
```

Please note that for compiling the app in Mac you need to open the `Moodle.xcworkspace` file, more information here: [MOBILE-1970](https://tracker.moodle.org/browse/MOBILE-1970).

## Running the app in a browser

You can obtain a copy of the source code by cloning the public repository:

```bash
git clone git@github.com:moodlehq/moodleapp.git
```

Once you have the correct environment set up, you can run the application with the following two commands:

```bash
cd moodleapp
npm install
npm start
```

This will launch the application in a browser and you should be ready to start coding (you may also want to [configure the default browser](./app-in-browser.md#configuring-the-default-browser) for future runs). This compiles the entire application and can take a while, so don't worry if it doesn't open the browser instantly. Keep in mind that this command may open the browser before the dev server is ready, and you could get a network error. If that happens, just wait until the dev server is ready and launch the application again. It should be ready when you see a "Compiled successfully" message in the console.

Congratulations, you have just completed the basics to become a Moodle App developer!

If you need to work with native features or build packaged versions of the app, you can read the rest of this page.

## Running the app in Android and iOS

The first time you want to run the application in a native device, this process will take a bit longer than usual because it needs to create the native projects and install native plugins. These will be created under the `platforms/` and `plugins/` folders respectively. If you ever run into issues during this process, try deleting both of these folders to get a clean start.

In order to run the application on a native device, you can use one of the following commands:

```bash
npm run dev:android  # Uses Live Reload, read below
npm run dev:ios      # Does NOT use Live Reload, read below
npm run prod:android # Uses AOT compilation, read below
npm run prod:ios     # Uses AOT compilation, read below
```

If you get any errors while building, please see the [Troubleshooting](./troubleshooting.md) section.

You can also inspect the HTML and look at the console logs by using [Chrome's Remote Debugging for Android](https://developer.chrome.com/docs/devtools/remote-debugging/) and [Safari's Develop menu for iOS](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/15.1/mac/12.0). This will only work with emulators or devices connected to your computer running with the development environment.

### Developing using Live Reload

Most of the time, it is recommended to develop using the `npm start` command. Working in a browser is faster, easier, and doesn't have as much overhead. However, in some situations you may want to run the application in a native device. If you want a similar development experience, you'll want to enable [Live Reload](https://ionicframework.com/docs/cli/livereload).

In Android, you can use the `npm run dev:android` command and the application will launch on a device or emulator. Whenever you make any changes to your code, the application will reload automatically. Keep in mind that this command may launch the application before the dev server is ready, and you could get a network error. If that happens, just wait until the dev server is ready and launch the application again (you should see "Compiled successfully" in the console).

In iOS, there are some limitations using live reload and that's why the `npm run dev:ios` command doesn't enable it by default. You can still use it by running `npx ionic cordova run ios --livereload --external`, but keep in mind that this will serve your application on an IP and will expose it to anyone connected to the same Wi-Fi network. Other than privacy concerns, this may cause some problems if you are working with iframes or local files. If you have any problems with that, you'll have to use the `npm run dev:ios` command to recompile the application every time you change the code.

### Compiling using AOT

Angular has 2 ways of compiling: [JIT](https://angular.io/guide/glossary#jit) and [AOT](https://angular.io/guide/glossary#aot).

Running `npm start`, `npm run dev:android` or `npm run dev:ios` compiles using JIT, which is faster to compile but the app takes longer to start. This is acceptable during development because it allows you to use Live Reload.

The `npm run prod:android` and `npm run prod:ios` commands use AOT compilation because they generate production bundles.

## See also

- [Moodle App Coding Style](../../../development/policies/codingstyle-moodleapp.md)
- [Debugging network requests in the Moodle App](../network-debug.md)
- [Moodle Docker](https://github.com/moodlehq/moodle-docker)
- [Ionic CLI docs](http://ionicframework.com/docs/cli/)
