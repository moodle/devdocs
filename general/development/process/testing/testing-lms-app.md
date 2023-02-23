---
title: Testing LMS issues in the mobile app
sidebar_label: Testing in the app
description: Information related to mobile app testing of LMS issues
tags:
  - Moodle App
  - Testing
  - Quality assurance
---

## Introduction

There are several ways an LMS issue (integrated or in development on your local site) can be tested using the Moodle mobile app.

In some cases, it might be necessary to use ngrok to expose your site to the Internet.

## Different ways the Moodle mobile app can be installed or accessed

### Installation in a mobile device via Google Play or Apple App store

This is the most common way, just install the app on your mobile device and connect to your local development site using ngrok or using its local network IP address.

### Windows 11 or macOS (Apple silicon)

Android apps can be installed on Windows 11, it will require you to install the Amazon Appstore application (so the Android subsystem is installed) and then follow any guide on the internet such as [this one](https://www.androidauthority.com/how-to-run-android-apps-on-windows-11-3048569/). The .apk version of the app is [downloadable here](https://download.moodle.org/mobile).

For macOS (Apple silicon only) follow [this guideline](https://www.macrumors.com/how-to/install-any-ios-app-m1-mac/).

### Hosted version (aka webapp)

In a [Chromium-based browser](../../../app/development/setup/app-in-browser.md) (launched with special flags that disable the web security), you can access your site using the hosted versions of the app in [master.apps.moodledemo.net](https://master.apps.moodledemo.net) (the latest stable version) and [integration.apps.moodledemo.net](https://integration.apps.moodledemo.net) (development version).

Once installed, to connect to your local site you can use its local ip address or hostname (localhost should work).

### Docker images

[Moodle HQ](https://moodle.com/) provides a couple of Docker images that contain the Moodle App ready for use. You can search all the available versions in [Docker Hub](https://hub.docker.com/r/moodlehq/moodleapp/tags).

Please check this [document for details](../../../app/development/setup/docker-images).

Once installed and running, to connect to your local site you can use its local ip address or hostname (localhost should work).

## See also

- [Debugging network requests in the Moodle App](../../../app/development/network-debug)
