---
title: Moodle App FAQ
sidebar_label: FAQ
sidebar_position: 4
tags:
  - Moodle App
---

## How can I contribute to the Moodle App?

You can help with [any issue marked with the "contribfriendly" label](https://tracker.moodle.org/browse/MOBILE-3231?jql=project%20%3D%20MOBILE%20AND%20status%20%3D%20Open%20AND%20labels%20%3D%20contribfriendly).

If you want to help with another issue, please let us know first via the tracker, you can a comment in the issue itself.

You have a detailed description of our development process here: [Moodle App Development Process](./development/development-process).

## I see this error: "Cannot connect: Verify that your have typed correctly the URL and that your site uses Moodle 2.4 or later"

- Ensure that debugging is disabled in your site: Site administration > Development > Debugging.
- Check that the ADOdb option is disabled if you are using the external database auth or enrolment plugin. You can do that in "Plugins > Authentication > External database" and in "Plugins > Enrolment > External database".
- If your site uses an SSL certificate, it must be a trusted certificate, not self-signed. You can use this tool or a similar one to check that your certificate is fine: [SSL Checker](https://www.geocerts.com/ssl-checker). All the checks must be ok, including the "Certificate Chain Complete". Otherwise the app might work on iOS but not on Android.

## The app starts but it says it cannot connect to any site I try

This may happen because you need to use a different browser with special flags enabled so cross domains XHR requests are allowed.

In short, you need to download Chromium from [the official download page](https://www.chromium.org/getting-involved/download-chromium/) and open it with this command:

```bash
chromium-browser --allow-file-access-from-files --disable-web-security
```

For additional information please, read the [Using the Moodle App in a browser](./development/app-in-browser) page.

## Some features like IMSCP, resource mini sites, local notifications are not working in the browser

Some features must be tested directly in a mobile device. You can do that using the application in the app stores, or you can learn how to compile it yourself in the [Setting up your development environment for the Moodle App](./development/setup#running-the-app-in-android-and-ios) page.

## What is the difference between a native app and a Mobile specific theme or responsive theme?

You can read about that in the following forum posts:

- [Juan Leyva forum post](https://moodle.org/mod/forum/discuss.php?d=206736#p901475)
- [Martin Dougiamas forum post](https://moodle.org/mod/forum/discuss.php?d=206736#p901751)

## I am having problems running the app from the source code

If you are having issues getting the app to compile, make sure to check out the troubleshooting section of the [Setting up your development environment for the Moodle App](./development/setup#troubleshooting) page.
