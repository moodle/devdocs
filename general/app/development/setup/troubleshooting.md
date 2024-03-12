---
title: Troubleshooting when setting up your development environment for the Moodle App
sidebar_label: Troubleshooting
sidebar_position: 3
tags:
 - Moodle App
---

This page contains a list of common errors that have been found and how to solve them. However, keep in mind that these may be platform-dependent and could not fix the problem in your machine, even if you are seeing the same error message.

## General advice

If you are stuck with an error and you can't find a way to continue, here's a list of things you can do:

- Using git, look at the changes you have in your working directory and make sure that they aren't causing the problem. Be specially careful with changes in `package.json` and `package-lock.json`. You can see a list of the files you have modified running `git status`.
- Make sure that you are using the proper node and npm versions. You can see it looking at the `engines` key in `package.json`. If you are using [nvm](https://github.com/nvm-sh/nvm), just run `nvm install`.
- Make sure that all dependencies have been installed properly. To be extra sure, run `npm ci`; this will remove the `node_modules/` folder and install all dependencies again exactly as described in your `package-lock.json`. You may want to delete `cordova-plugin-moodleapp/node_modules` as well.
- Clear Angular's cache by removing the `.angular` folder.
- If you are having issues trying to build for Android or iOS, try removing the `www/`, `platforms/`, and `plugins/` folders and try again.
- Make sure to use the scripts configured in the app repository, such as `npm start` and `npm run dev:android`. The Ionic, Angular, and Cordova CLIs have many commands you could be using, such as `ionic serve`, `cordova run android`, `ng lint`, etc. We don't recommend using them because they haven't been tested as thoroughly. If you end up using them anyways, make sure to use them through `npx`, such as `npx ionic serve`. This will ensure that you're using the proper version of the CLIs instead of relying on a globally installed dependency.
- If you are using a development version, maybe the repository is broken and it's not your fault. Try checking out the `latest` branch and see if you're getting the same error.
- Try cloning the repository in a new folder and run through the instructions in this page again. If you can, try doing it on a different computer to make sure that you're doing everything properly and it's not a problem in your machine.
- Try creating [a blank Ionic application](https://ionicframework.com/docs/cli/commands/start) and see if you're having the same problems. Make sure that you are using the same version of the main dependencies (Angular, Cordova, Ionic CLI, etc.).
- If you are searching for help online, maybe your problem has nothing to do with the Moodle App in particular an it's related with Ionic, Cordova, Angular, etc. Searching using the proper context will give you better solutions.

## I get a blank page when launching the app

This error can happen when the application is launched properly but there is a runtime error. If you get a network connection error, this may be the expected behaviour. Wait until you see "Compiled successfully" in the console and reload.

If that's not the case and you really are getting a blank page, look at the console and you should see some error indicating why the application is not rendering properly. Keep in mind that at the moment the application is already logging some errors and warnings, so make sure that you're not stuck trying to fix something that isn't causing the problem. You can follow any updates about this on [MOBILE-3854](https://tracker.moodle.org/browse/MOBILE-3854).

If you are not seeing any relevant logs, check out what to do on the [General advice](#general-advice) section.

## Strange NPM errors

To get more debug output from npm commands, see [the available configuration flags](https://docs.npmjs.com/cli/v7/using-npm/config). In particular try adding `--loglevel verbose`, `--loglevel info` or `--loglevel silly` to the command-line.

## I can't change the language

If you're getting a network error for a url like `https://localhost:8100/assets/lang/es.json`, this probably means that you haven't installed the language packs. You can install them with `npm run lang:update-langpacks`.

## Error: `libsass` bindings not found. Try reinstalling node-sass?

Most of the time, running the following command will fix the problem:

```bash
npm rebuild node-sass
```

## com.android.dex.DexException: Multiple dex files define XXX

Open the file `platforms/android/build.gradle` and add this code at the end:

```groovy
configurations {
    all*.exclude group: 'com.android.support', module: 'support-v4'
}
```

## Could not resolve all dependencies for configuration ':\_debugCompile'.

Open the Android SDK Manager and make sure you have installed: Android Support Repository, Android Support Library, Google Play Services and Google Repository.

## Could not find com.android.support:support-v4:XXX

Open the file `platforms/android/build.gradle` and add this code at the end:

```groovy
configurations.all {
    resolutionStrategy.force 'com.android.support:support-v4:24.0.0'
}
```

## ERROR: In `<declare-styleable>` FontFamilyFont, unable to find attribute android:font

Open the file `platforms/android/build.gradle` and add this code at the end:

```groovy
android {
   compileSdkVersion 26
   buildToolsVersion "26.0.1"
}
```

## Error: Could not find gradle wrapper within Android SDK. Might need to update your Android SDK.

Download [Android Studio](https://developer.android.com/studio/) and copy the folder `android-studio/plugins/android/lib/templates` into `android-sdk-folder/Sdk/tools`.

## Could not find com.android.support:support-v4:27.1.0

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

## Error: not found: make

If you see this error in Ubuntu, run `sudo apt-get install build-essential` and retry.

## Current working directory is not a Cordova-based project.

If you see this error during `npm start`, run `mkdir www` and retry.

## ReferenceError: internalBinding is not defined

This [seems to be](https://stackoverflow.com/questions/53146394/node-app-fails-to-run-on-mojave-referenceerror-internalbinding-is-not-defined) an error with `natives` prior to 1.1.6. It can be fixed by running `npm install <natives@1.1.6>`.

## npm update check failed

You may get the following error on Windows:

```bash
 │                   npm update check failed                     │
 │             Try running with sudo or get access               │
 │            to the local update config store via               │
 │ sudo chown -R $USER:$(id -gn $USER) C:\Users\username\.config │
```

The suggested command does not work on Windows, so the solution is to manually check the ownership of all the files in `C:\Users{username}.config\configstore`. In some cases, it can be `update-notifier-npm.json` that got changed to be owned by Administrator.

## Unhandled rejection Error: Command failed: C:\cygwin64\bin\git.EXE ...

This is a common issue for Cygwin user running Node. However, you just need to ensure that `Msysgit` is on your windows path and that the cygwin bin folder is not. Then always use another shell like Powershell for your Moodle App development.

You don't need your Cygwin bin folder on the Windows path because it automatically gets added to the path when you launch Cygwin bash.

## The product name change (`<name>` tag) in config.xml is not supported dynamically

This happens when you create the iOS platform with a certain `<name>` and then you change that name in config.xml. The solution seems to be removing and adding the iOS platform again:

```bash
npx ionic platform remove ios
npx ionic platform add ios
```

## Failed to install 'cordova-plugin-x'

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

## doc.find is not a function

This happens in some environments, the solution is to run `npx cordova platform add ios` before running the failing command. You should do this in a clean environment, once you've seen the error running the command may not work. Try deleting `www/`, `platforms/` and `plugins/` before trying again.

[Find more about this in StackOverflow](https://stackoverflow.com/questions/47404622/edit-config-for-ios-usage-descriptions-doc-find-is-not-a-function)

## Mac: linker code failed with exit code 1

If you get this error when trying to build the Moodle app with XCode, some dependencies might not have installed correctly.

Ensure you have followed the [Mac only: Push notifications](./index.md#mac-only-push-notifications) steps above (particularly opening the .xcworkspace file rather than the .xcodeproj file). Then run the following:

```bash
cd platforms/ios
pod install
```

Now try running the build again in XCode.

## Windows: `npm start` hangs after "Starting 'watch'"

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
