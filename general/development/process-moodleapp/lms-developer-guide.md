---
title: The Moodle App for LMS Developers
sidebar_label: For LMS developers
sidebar_position: 2
tags:
  - Moodle App
---

This page summarises what a Moodle LMS (core or plugin) developer needs to know about the Moodle App: what it is, how it talks to a site, and what to keep in mind when a change to Moodle LMS could affect it.

## Key aspects of the Moodle App {/* #key-aspects-of-the-moodle-app */}

- Designed for students.
- Works offline.
- Supports [LMS plugins](../../app/development/plugins-development-guide/index.md), if the plugin author made them compatible.
- Supports multiple sites.
- Supports Bootstrap classes in user generated content.

See the [Platform Support](../../app/overview.md#platform-support) section of the Moodle App Overview for up-to-date minimum requirements.

## Which LMS features are supported {/* #which-lms-features-are-supported */}

Most of the student-facing functionality in Moodle LMS is supported by the app. Functionality that was still not supported included:

- RTE (rich text editor) plugins and attachments.
- Editing the user profile and preferences.
- AI features.

## How the app talks to the LMS {/* #how-the-app-talks-to-the-lms */}

- The REST v1 API and the Mobile app web service are automatically enabled on installation, provided the site uses HTTPS.
- The app is essentially a [web service](/docs/apis/subsystems/external/) client, using WS tokens for access.
- Authentication:
  - In most cases, `login/token.php` is used to obtain the token and secure token.
  - Authentication can also happen outside the app, launching it afterwards via a [Custom URL Scheme](../../app/development/link-handling/deep-linking.md).
- Performance:
  - Data retrieved from some web services is cached automatically, with the caching strategy depending on the device's connection (Wi-Fi or mobile data).
  - Some web service requests are grouped into a single request using a custom web service `tool_mobile_call_external_functions`.
- Security:
  - The app tries to use `tokenpluginfile.php` to download files, using a different access key than `webservice/pluginfile.php`, which is more secure.
  - CORS is allowed on `webservice/` endpoints.
  - A different token is used when the app launches an automatic login into the browser.
  - Requests to embed site content into the app are automatically allowed, since the LMS checks the app's User Agent.

## How the app renders content {/* #how-the-app-renders-content */}

In most cases, the app downloads structured data from the Moodle site via web services and uses local templates with Ionic web components to display it, rather than rendering HTML from the server.

- SCORM and H5P zip packages are downloaded and extracted in the app.
- In some cases it's still necessary to retrieve content already rendered by the server, such as:
  - Question types.
  - Lesson.
  - Gradebook table visualisation.
  - Some blocks.
  - Plugins.

## The mobile app rule of thumb {/* #the-mobile-app-rule-of-thumb */}

> If you are working on a bug fix or improvement that changes the UI of a page that students have access to, it is very probable that the change is going to affect the mobile app.

Examples of changes that tend to affect the app:

- Adding or removing elements from the interface (for example, adding a new field in the user profile, or removing options that were previously visible).
- Re-positioning elements (adding or removing indentation to elements on the UI).
- Changes in the course index (adding new options for students).
- Changes in the default course formats (adding subsections).
- Changes in the UI of activity modules (assignment, quiz).
- Icons in general (Font Awesome, activity icons).

## Good practices {/* #good-practices */}

- If you are working on new functionality for students, reach out to the apps team. New features should implement new web services, or expand existing ones, to return all the data required to display the information to the student — think of it as creating a web service that returns the same kind of data used in a Mustache template.
- Changes in the rendering of question types usually break the app (accessibility).
- Upgrading the H5P library, or changing its code, might require changes in the app.
- [Test your changes in the app](../process/testing/testing-lms-app.md) before sending your issue for integration review.
- Label affected issues with [`affects_mobileapp`](../tracker/labels.md).
- If in doubt, reach out to the Mobile Solutions Team via the community chat.

## See also {/* #see-also */}

- [Moodle App Overview](../../app/overview.md)
- [Testing LMS issues in the mobile app](../process/testing/testing-lms-app.md)
- [Integration review guidelines](../process/integration/index.md)
- [Peer review guidelines](../process/peer-review/index.md#the-moodle-mobile-app)
- [Moodle App Release Process](./release.md)
