---
title: Debugging network requests in the Moodle App
sidebar_label: Debugging network requests
sidebar_position: 5
tags:
  - Moodle App
---

## Introduction

This guide will help you find and report problems with the Moodle App on your site.

It is especially useful for the following problems:

- Unable to log in on your site.
- When you receive one of the following error messages in the app:
  - "Can not find data record in database table external_functions".
  - "Invalid response value detected".
  - "Cannot get course contents".

## Enabling debugging on your Moodle site

1. Go to Debugging in the Site administration.
2. For "Debug messages" select 'DEVELOPER'.
3. Tick "Display debug messages".
4. Click the 'Save changes' button.

Remember to disable debugging again once you have finished debugging your problem.

## Enabling debugging on the Moodle App

1. Go to the More tab.
2. Go to Settings > General.
3. Enable "Display debug messages".

Remember to disable debugging again once you have finished debugging your problem.

## First attempts

At this point, you may not need to go further on this guide.

Log out and log in again into your site and try to reproduce the error. Hopefully, with Moodle and app debugging enabled you will see an explanatory message of what is happening.

If you are unable to find a solution, contact a [Moodle Partner](https://moodle.com/partners/) or post in the [Moodle for mobile forum](https://moodle.org/mod/forum/view.php?id=7798) on moodle.org for non-guaranteed community support.

## Setting up the debugging tool

### Using a Browser

In your [Chromium-based browser](./setup/app-in-browser), you can access your site using the hosted versions of the app in [latest.apps.moodledemo.net](https://latest.apps.moodledemo.net) (the latest stable version) and [main.apps.moodledemo.net](https://main.apps.moodledemo.net).

Once you're using your site, you can open the [Network panel](https://developer.chrome.com/docs/devtools/network/) of the developer tools and inspect requests. If you're only interested in web service requests, [you can filter](https://developer.chrome.com/docs/devtools/network/#filter) writing `.php` in the filter input.

### Using a mobile device or emulator

If you are using a native device, keep in mind that some requests are not executed through the webview and you won't be able to see them in the network inspector of your developer tools. Instead, you'll have to use native tools the debug the requests.

For example, in Android you can use [the Network Profiler](https://developer.android.com/studio/profile/network-profiler).

### General strategy

Here's how to debug web service errors:

1. Ignore requests that don't start with `token.php` or `server.php`.
2. Once you have selected a request you want to inspect, open the "Response" tab and check if you see an error.
3. If you don't understand how to fix the error, you can search in [Moodle Mobile FAQ](https://docs.moodle.org/en/Moodle_Mobile_FAQ) to check if there is a known solution.
4. If you are unable to find a solution, contact a [Moodle Partner](https://moodle.com/partners/) or post in the [Moodle for mobile forum](https://moodle.org/mod/forum/view.php?id=7798) on moodle.org for non-guaranteed community support.

## Troubleshooting

### How to log into a site configured to use browser or embedded authentication

You can execute the following in the JavaScript console:

```js
window.handleOpenURL("moodlemobile://URL?token=WSTOKEN");
```

You can also launch a normal authentication process (allowing the authentication popup) and capture the redirect to `moodlemobile://...` created by the `admin/tool/mobile/launch.php` script and then execute the following in the console:

```js
window.handleOpenURL("moodlemobile://token=ABCxNGUxMD........=");
```
