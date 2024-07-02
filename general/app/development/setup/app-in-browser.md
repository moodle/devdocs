---
title: Using the Moodle App in a browser
sidebar_label: Using the App in a browser
sidebar_position: 1
tags:
  - Moodle App
---

Browsers are not officially supported by the application in production, but you can use a **Chromium-based** browser for development if you don't need any native functionality.

The Chromium version needs to be 102 or newer, because the app's use of the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle) during development.

## Differences between Chromium and Google Chrome

Google Chrome is the Chromium open source project built, packaged, and distributed by Google. We can say that Chromium is Google Chrome without the "Google" add-ons. For that reason, we recommend using Chromium instead of Google Chrome.

## Advantages and disadvantages of using a browser instead of a native device

Main advantages:

- Faster development.
- DOM inspector.
- Network monitor.
- Emulation options.

Disadvantages:

- You can't use native functionality.
- SCORM and H5P aren't supported in browsers.
- If you need to use Cordova plugins, you will probably need to provide a way to emulate those APIs in the browser or avoid calling them in the browser environment.
- You will always need to test in a native device prior to a production release.
- You will need to verify that your CSS/layout looks the same in native devices.

## Installation and configuration

You can install the Chromium browser by downloading it from [the official download page](https://www.chromium.org/getting-involved/download-chromium).

In order to run the Moodle App, we recommend that you launch the browser with a couple of arguments. These are necessary to disable some of the limitations that don't exist in the native application, and also prepare the development environment.

```bash title="Linux"
chromium-browser --allow-file-access-from-files --disable-web-security --disable-site-isolation-trials --allow-running-insecure-content --no-referrers --unlimited-storage --auto-open-devtools-for-tabs --ignore-certificate-errors --disable-infobars --user-data-dir=~/.chromium-dev-data
```

```bash title="Windows"
start chrome.exe --allow-file-access-from-files --disable-web-security --disable-site-isolation-trials --allow-running-insecure-content --no-referrers --unlimited-storage --auto-open-devtools-for-tabs --ignore-certificate-errors --disable-infobars --user-data-dir=~/.chromium-dev-data
```

```bash title="MacOS"
open -a /Applications/Chromium.app --args --allow-file-access-from-files --disable-web-security --disable-site-isolation-trials --allow-running-insecure-content --no-referrers --unlimited-storage --auto-open-devtools-for-tabs --ignore-certificate-errors --disable-infobars --user-data-dir=~/.chromium-dev-data
```

If you are using other operative system, check out [how to run chromium with flags](https://www.chromium.org/developers/how-tos/run-chromium-with-flags) in other environments.
Depending on the version of your browser, you may get a warning message saying "You are using an unsupported command-line flag". This is expected and can safely be ignored (for development).

For more info about the user data dir, please read [the official documentation](https://chromium.googlesource.com/chromium/src/+/main/docs/user_data_dir.md).

### Creating a shortcut

We strongly recommend that you create a new shortcut and use it only for working with the app during development. In Linux, and possibly other operating systems, these arguments only work if you don't already have the same browser running. Hence if you use Google Chrome as your normal browser, you can use Chromium for development and vice versa.

In Linux, you can create such a shortcut by writing a script that is globally available. For example, you can create the following file in `/usr/local/bin/unsafe-chromium`:

```bash
chromium-browser --allow-file-access-from-files --disable-web-security --disable-site-isolation-trials --allow-running-insecure-content --no-referrers --unlimited-storage --auto-open-devtools-for-tabs  --ignore-certificate-errors --disable-infobars --user-data-dir=/home/{username}/.chromium-dev-data $@
```

Notice that this time we shouldn't use `~/.chromium-dev-data` to describe the user data dir. That's because this file can be called from a different shell, and `~` could not be interpreted properly (this may end up creating a folder called "~" in your project folder, and you probably don't want that).

Also, remember to make this file executable by running `sudo chmod +x /usr/local/bin/unsafe-chromium`.

For convenience, you can also define an application launch that calls this script.

:::note Help wanted!
These instructions have only been tested in Linux. If you are using a different operative system, [let us know](https://github.com/moodle/devdocs/issues/76) how it went (or just [edit this page](https://github.com/moodle/devdocs/edit/main/general/app/development/setup/app-in-browser.md)!).
:::

### Configuring the default browser

When you launch the application by running `npm start`, this will open a tab in your default browser. You can close this tab and open the url with your development browser, but if you want to do it automatically you can override the default browser by setting the `MOODLE_APP_BROWSER` environment variable.

For example, if you have created a shortcut like we mentioned in the previous section, you can just add the following to your `~/.bashrc` file:

```bash
export MOODLE_APP_BROWSER=/usr/local/bin/unsafe-chromium
```

:::caution Use absolute paths
Make sure to set this variable to an absolute path, and not just the name of the binary. Even if the program is loaded in the global PATH, it will not work unless it's an absolute path.
:::

:::note Help wanted!
These instructions have only been tested in Linux. If you are using a different operative system, [let us know](https://github.com/moodle/devdocs/issues/76) how it went (or just [edit this page](https://github.com/moodle/devdocs/edit/main/general/app/development/setup/app-in-browser.md)!).
:::

## Handling deep links

Using a browser, you'll realize it's not possible to handle deep links, for example if you're trying to log in using SSO.

To work around that, you can simulate a deep link being pressed running the following code in the console:

```js
handleOpenURL('moodlemobile://token=...');
```

## Using the hosted versions of the app

You can access your site using the hosted versions of the app in [latest.apps.moodledemo.net](https://latest.apps.moodledemo.net) (the latest stable version) and [main.apps.moodledemo.net](https://main.apps.moodledemo.net) (the current version in development).

### Special headers

The application also relies on the [SharedArrayBuffer API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), so in case you're hosting the app yourself you'll need to return the following headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

## Tips & tricks

Once you have everything set up, you should be able to develop like you would with any other front-end application. You can learn about the development tools you have available by reading the [Chrome DevTools documentation](https://developer.chrome.com/devtools/index).

Here's some things we find useful to work with the Moodle App in particular:

- [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh) — Browser extension to debug Angular applications during development.
- [Device Mode](https://developer.chrome.com/docs/devtools/device-mode/) — You can use this feature to make the browser behave more like a native device. This will work best if you [dock the development panel](https://developer.chrome.com/docs/devtools/customize/placement/) to one side (left or right), but you may want to do something else in your environment.
- [Console Panel](https://developer.chrome.com/docs/devtools/console/) — This panel is essential for any developer, since it will show you any errors or custom messages that you've written. You can also use the search box to filter messages seeing everything is too overwhelming. You will also see specific logs from the Moodle App, but keep in mind that they are not used in production environment. If you are not running the application yourself, you can inspect the environment by opening the /assets/env.json url.
- [Elements Panel](https://developer.chrome.com/docs/devtools/dom/) — This panel is also essential for any developer, you'll be able to inspect and modify the HTML that is actually being rendered.
- [Network Panel](https://developer.chrome.com/docs/devtools/network/) — This panel can be useful if you are trying to see how the Moodle App communicates with a Moodle site. You may also want to [disable the cache](https://developer.chrome.com/docs/devtools/network/reference/#disable-cache) in order to have the same behaviour after each reload. However, keep in mind that this only disables the browser cache, any Web Service calls that are cached by the Moodle App will remain cached. You can learn more about network requests in the [Debugging network requests in the Moodle App](../network-debug.md) page.
- [OPFS Explorer](https://chromewebstore.google.com/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd) — This browser extension can be used to view the `.sqlite` files of the database. If you download these, you can open them in any SQLite database inspector, for example [sqliteviewer.app](https://sqliteviewer.app/).
