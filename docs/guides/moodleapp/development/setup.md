---
title: Setting up your development environment for the Moodle App
sidebar_label: Setting up your environment
sidebar_position: 3
tags:
 - Moodle App
---

The structure of this page is the following:

- The first part, up to the point where you get the `npm start` command to work, includes the basics of what you need to work on the app.
- The second part indicates how to build the app to run it on a native device (or emulator).
- The third part includes a list of troubleshooting advice. If you encounter a problem that is not already listed, please consider adding it.

Most of your development can happen on a browser, you only need to use an emulator if you have to work on native functionality.

If you are just [adding mobile support to plugins](./plugins-development-guide), you probably don't need to build the app yourself and you can skip reading this page.

## Requirements

### Install a browser for development

Most of the time we recommend that you use a browser for development; the app will work in any Chromium-based browser. We recommend using the Chromium browser (an open source alternative to Google Chrome). You can get it from the [official download page](https://www.chromium.org/getting-involved/download-chromium).

To learn more about using a browser for development, and why it needs to be Chromium-based, read the [Using the Moodle App in a browser](./app-in-browser) page.

### Install git

You will need to install Git in order to get the source code and upload your changes. If you are not familiar with it, we recommend that you get started reading the following guide: [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Install Node.js and Npm

We recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm) to make this easier, you can prepare the correct environment running `nvm install` in the project root. Remember to run this every time you work with the app, or if you’re not working on any other node projects in your computer you can run ``nvm alias default `node -v` `` to make it the default.

It may seem simpler and easier to install directly from [nodejs.org](http://nodejs.org), but actually it is more tricky to get that to work. If you have previously installed Node directly, and want to switch to nvm, you need to uninstall node completely before installing nvm - or search for trouble-shooting instructions online.

### Install native SDKs

If you intend to run the application in a native device, you will need to install that platform's native SDKs. You can learn how to set up your environment by reading Ionic’s documentation for [Android](https://ionicframework.com/docs/developing/android) and [iOS](https://ionicframework.com/docs/developing/ios).

### Windows only: Native build dependencies

`node-gyp` requires native build tools for your platform. If you're developing on Mac or Linux, you'll probably have these already ([refer to the docs if you don't](https://github.com/nodejs/node-gyp/blob/master/README.md)). On Windows, run the following command as administrator (in cmd or Powershell):

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

Please note that for compiling the app in Mac you need to open the `Moodle.xcworkspace` file, more information here: {tracker MOBILE-1970}.

### Linux only: `libsecret`

If you are using [the gulp push script](./scripts/gulp-push), you need to have `libsecret` installed before running `npm install`. Depending on your distribution, you will need to run one of the following commands:

```bash title="Debian/Ubuntu"
sudo apt-get install libsecret-1-dev
```

```bash title="Red Hat"
sudo yum install libsecret-devel
```

```bash title="Arch Linux"
sudo pacman -S libsecret
```

## Running the app in a browser

You can obtain a copy of the source code by cloning the public repository. If you want to work on the latest development version, you should check out the `integration` branch:

```bash
git clone git@github.com:moodlehq/moodleapp.git
cd moodleapp
git checkout integration
```

Once you have the correct environment set up, you can run the application with the following two commands:

```bash
npm install
npm start
```

This will launch the application in a browser and you should be ready to start coding (you may also want to [configure the default browser](./app-in-browser##configuring-the-default-browser) for future runs). This compiles the entire application and can take a while, so don't worry if it doesn't open the browser instantly. Keep in mind that this command may open the browser before the dev server is ready, and you could get a network error. If that happens, just wait until the dev server is ready and launch the application again. It should be ready when you see a "Compiled successfully" message in the console.

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

If you get any errors while building, please see the [Troubleshooting](#troubleshooting) section below.

You can also inspect the HTML and look at the console logs by using [Chrome's Remote Debugging for Android](https://developer.chrome.com/docs/devtools/remote-debugging/) and [Safari's Develop menu for iOS](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/15.1/mac/12.0). This will only work with emulators or devices connected to your computer running with the development environment.

### Developing using Live Reload

Most of the time, it is recommended to develop using the `npm start` command. Working in a browser is faster, easier, and doesn't have as much overhead. However, in some situations you may want to run the application in a native device. If you want a similar development experience, you'll want to enable [Live Reload](https://ionicframework.com/docs/cli/livereload).

In Android, you can use the `npm run dev:android` command and the application will launch on a device or emulator. Whenever you make any changes to your code, the application will reload automatically. Keep in mind that this command may launch the application before the dev server is ready, and you could get a network error. If that happens, just wait until the dev server is ready and launch the application again (you should see "Compiled successfully" in the console).

In iOS, there are some limitations using live reload and that's why the `npm run dev:ios` command doesn't enable it by default. You can still use it by running `npx ionic cordova run ios --livereload --external`, but keep in mind that this will serve your application on an IP and will expose it to anyone connected to the same Wi-Fi network. Other than privacy concerns, this may cause some problems if you are working with iframes or local files. If you have any problems with that, you'll have to use the `npm run dev:ios` command to recompile the application every time you change the code.

### Compiling using AOT

Angular has 2 ways of compiling: [JIT](https://angular.io/guide/glossary#jit) and [AOT](https://angular.io/guide/glossary#aot).

Running `npm start`, `npm run dev:android` or `npm run dev:ios` compiles using JIT, which is faster to compile but the app takes longer to start. This is acceptable during development because it allows you to use Live Reload.

The `npm run prod:android` and `npm run prod:ios` commands use AOT compilation because they generate production bundles.

### Using Android emulators

Most of the time, you should be using an emulator running recent versions of Android, and it should work fine. But sometimes, you may want to use an older version to test a specific behaviour.

If you want to run the application in an Android 5 emulator, you’ll need to upgrade the system webview because emulators come with version 37 preinstalled. Your first idea may be to upgrade the webview using the Google Play store, but it will not work because the webview served by Google Play is `com.google.android.webview` whilst the system webview used in emulators is `com.android.webview`. You can do the following instead.

Once you have [created your Android 5 virtual device](https://developer.android.com/studio/run/managing-avds), you’ll need to do download [the apk for Webview 61](https://android.googlesource.com/platform/external/chromium-webview/+/refs/heads/oreo-m3-release/prebuilt/x86_64/) and run the following commands:

```bash
# Open the folder where the “emulator” script is installed
cd $(dirname `which emulator`)

# Boot the emulator in write mode (you can get a list of device names running “emulator -list-avds”)
emulator @DeviceName -writable-system

# In a different shell, make /system writable
adb remount

# Uninstall the webview app manually and reboot the device
adb shell
rm -rf /data/data/com.android.webview
rm -rf /system/app/webview
reboot

# Install the new version
adb install webview.apk
```

After doing this, remember to run the emulator in write mode for subsequent sessions, but you don’t need to call the `remount` command every time.

## Troubleshooting

This section contains a list of common errors that have been found and how to solve them. However, keep in mind that these may be platform-dependent and could not fix the problem in your machine, even if you are seeing the same error message.

### General advice

If you are stuck with an error and you can't find a way to continue, here's a list of things you can do:

- Using git, look at the changes you have in your working directory and make sure that they aren't causing the problem. Be specially careful with changes in `package.json` and `package-lock.json`. You can see a list of the files you have modified running `git status`.
- Make sure that you are using the proper node and npm versions. You can see it looking at the `engines` key in `package.json`. If you are using [nvm](https://github.com/nvm-sh/nvm), just run `nvm install`.
- Make sure that all dependencies have been installed properly. To be extra sure, run `npm ci`; this will remove the `node_modules/` folder and install all dependencies again exactly as described in your `package-lock.json`.
- If you are having issues trying to build for Android or iOS, try removing the `www/`, `platforms/` and `plugins/` folders and try again.
- If you are using a development version, maybe the repository is broken and it's not your fault. Try checking out the `master` branch and see if you're getting the same error.
- Try cloning the repository in a new folder and run through the instructions in this page again. If you can, try doing it on a different computer to make sure that you're doing everything properly and it's not a problem in your machine.
- Try creating [a blank Ionic application](https://ionicframework.com/docs/cli/commands/start) and see if you're having the same problems. Make sure that you are using the same version of the main dependencies (Angular, Cordova, Ionic CLI, etc.).
- If you are searching for help online, maybe your problem has nothing to do with the Moodle App in particular an it's related with Ionic, Cordova, Angular, etc. Searching using the proper context will give you better solutions.

### I get a blank page when launching the app

This error can happen when the application is launched properly but there is a runtime error. If you get a network connection error, this may be the expected behaviour. Wait until you see "Compiled successfully" in the console and reload.

If that's not the case and you really are getting a blank page, look at the console and you should see some error indicating why the application is not rendering properly. Keep in mind that at the moment the application is already logging some errors and warnings, so make sure that you're not stuck trying to fix something that isn't causing the problem. You can follow any updates about this on {tracker MOBILE-3854}.

If you are not seeing any relevant logs, check out what to do on the [General advice](#general-advice) section.

### Strange NPM errors

To get more debug output from npm commands, see [the available configuration flags](https://docs.npmjs.com/cli/v7/using-npm/config). In particular try adding `--loglevel verbose`, `--loglevel info` or `--loglevel silly` to the command-line.

### I can't change the language

If you're getting a network error for a url like `http://localhost:8100/assets/lang/es.json`, this probably means that you haven't installed the language packs.

Currently, you can install them in your machine running the `scripts/update_lang.sh` script, but it may not work in your system if you don't have php installed. For future improvements, you can subscribe to {tracker MOBILE-3864}.

### Error: `libsass` bindings not found. Try reinstalling node-sass?

Most of the time, running the following command will fix the problem:

```bash
npm rebuild node-sass
```

### com.android.dex.DexException: Multiple dex files define XXX

Open the file `platforms/android/build.gradle` and add this code at the end:

```groovy
configurations {
    all*.exclude group: 'com.android.support', module: 'support-v4'
}
```

### Could not resolve all dependencies for configuration ':\_debugCompile'.

Open the Android SDK Manager and make sure you have installed: Android Support Repository, Android Support Library, Google Play Services and Google Repository.

### Could not find com.android.support:support-v4:XXX

Open the file `platforms/android/build.gradle` and add this code at the end:

```groovy
configurations.all {
    resolutionStrategy.force 'com.android.support:support-v4:24.0.0'
}
```

### ERROR: In `<declare-styleable>` FontFamilyFont, unable to find attribute android:font

Open the file `platforms/android/build.gradle` and add this code at the end:

```groovy
android {
   compileSdkVersion 26
   buildToolsVersion "26.0.1"
}
```

### Error: Could not find gradle wrapper within Android SDK. Might need to update your Android SDK.

Download [Android Studio](https://developer.android.com/studio/) and copy the folder `android-studio/plugins/android/lib/templates` into `android-sdk-folder/Sdk/tools`.

### Could not find com.android.support:support-v4:27.1.0

Open the file `platforms/android/build.gradle` and configure like this:

```groovy
allprojects {
    repositories {
        jcenter()
        maven {
            url "https://maven.google.com"
        }
    }
}
```

### Error: not found: make

If you see this error in Ubuntu, run `sudo apt-get install build-essential` and retry.

### Current working directory is not a Cordova-based project.

If you see this error during `npm start`, run `mkdir www` and retry.

### ReferenceError: internalBinding is not defined

This [seems to be](https://stackoverflow.com/questions/53146394/node-app-fails-to-run-on-mojave-referenceerror-internalbinding-is-not-defined) an error with `natives` prior to 1.1.6. It can be fixed by running `npm install <natives@1.1.6>`.

### npm update check failed

You may get the following error on Windows:

```bash
 │                   npm update check failed                     │
 │             Try running with sudo or get access               │
 │            to the local update config store via               │
 │ sudo chown -R $USER:$(id -gn $USER) C:\Users\username\.config │
```

The suggested command does not work on Windows, so the solution is to manually check the ownership of all the files in `C:\Users{username}.config\configstore`. In some cases, it can be `update-notifier-npm.json` that got changed to be owned by Administrator.

### Unhandled rejection Error: Command failed: C:\cygwin64\bin\git.EXE ...

This is a common issue for Cygwin user running Node. However, you just need to ensure that `Msysgit` is on your windows path and that the cygwin bin folder is not. Then always use another shell like Powershell for your Moodle App development.

You don't need your Cygwin bin folder on the Windows path because it automatically gets added to the path when you launch Cygwin bash.

### The product name change (`<name>` tag) in config.xml is not supported dynamically

This happens when you create the iOS platform with a certain `<name>` and then you change that name in config.xml. The solution seems to be removing and adding the iOS platform again:

```bash
npx ionic platform remove ios
npx ionic platform add ios
```

### Failed to install 'cordova-plugin-x'

Sometimes, you may see an error message similar to this:

```bash
CordovaError: Version of installed plugin: "cordova-plugin-x@x.x.x" does not satisfy dependency plugin requirement "cordova-plugin-x@>=x.x.x".
```

This can happen when a cordova plugin (let's call it "X") is installed with an incorrect version. You can find this by removing the plugin and adding it again with the correct version:

```bash
npx cordova plugin remove cordova-plugin-x
npx cordova plugin add cordova-plugin-x@x.x.x # Make sure to use the proper version here
```

Please notice that if there is any plugin installed that depends on `cordova-plugin-x` you'll have to remove and re-add them too.

### doc.find is not a function

This happens in some environments, the solution is to run `npx cordova platform add ios` before running the failing command. You should do this in a clean environment, once you've seen the error running the command may not work. Try deleting `www/`, `platforms/` and `plugins/` before trying again.

[Find more about this in StackOverflow](https://stackoverflow.com/questions/47404622/edit-config-for-ios-usage-descriptions-doc-find-is-not-a-function)

### Mac: linker code failed with exit code 1

If you get this error when trying to build the Moodle app with XCode, some dependencies might not have installed correctly.

Ensure you have followed the [#Mac_only:\_Push_notifications Mac only: Push notifications][Mac only: Push notifications](#Mac_only:_Push_notifications) steps above (particularly opening the .xcworkspace file rather than the .xcodeproj file). Then run the following:

```bash
cd platforms/ios
pod install
```

Now try running the build again in XCode.

### Windows: `npm start` hangs after "Starting 'watch'"

If you follow the above procedure to run the app on a Windows system and get repeated 'Waiting for connectivity with NPM' like this:

```bash
$ npm start

> moodlemobile@3.9.5 start C:\Users\xxx\workspace\moodleapp
> ionic serve

> npm.cmd run ionic:serve:before

> moodlemobile@3.9.5 ionic:serve:before C:\Users\xxx\workspace\moodleapp
> gulp

[Using gulpfile ~\workspace\moodleapp\gulpfile.js
[13:59:24](13:59:24]) Starting 'default'...
[Starting 'lang'...
[13:59:24](13:59:24]) Starting 'env'...
[Finished 'env' after 802 ms
[13:59:27](13:59:25]) Finished 'lang' after 3.4 s
[Finished 'default' after 3.4 s
> npm.cmd run ionic:serve -- --host=localhost --port=8100 --project=app
[npm](13:59:27]) > moodlemobile@3.9.5 ionic:serve C:\Users\xxx\workspace\moodleapp
[> gulp watch & NODE_OPTIONS=--max-old-space-size=4096 ng serve "--host=localhost" "--port=8100" "--project=app"
[INFO](npm]) Waiting for connectivity with npm...
[[13:59:46](npm]) Using gulpfile ~\workspace\moodleapp\gulpfile.js
[[13:59:46](npm]) Starting 'watch'...
[Waiting for connectivity with npm...
[INFO](INFO]) Waiting for connectivity with npm...
[Waiting for connectivity with npm...
[INFO](INFO]) Waiting for connectivity with npm...
```

You can resolve the problem (sort of) by pressing ctrl-c to get out of it, then rerun the last command displayed, but this time with 'npx' before each of the 2 commands. (This assumes you are using a bash shell.)

```bash
npx gulp watch & NODE_OPTIONS=--max-old-space-size=4096 npx ng serve "--host=localhost" "--port=8100" "--project=app"
```

There will be a pause (a few minutes) while building everything. It should finish with the line:

`
: Compiled successfully.
`

Then you can access it by running Chrome and connecting to localhost:8100.

## See also

- [Moodle App Coding Style](./coding-style)
- [Debugging network requests in the Moodle App](./network-debug)
- [Moodle Docker](https://github.com/moodlehq/moodle-docker)
- [Ionic CLI docs](http://ionicframework.com/docs/cli/)
