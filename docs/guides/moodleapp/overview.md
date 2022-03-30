---
title: Moodle App Overview
sidebar_position: 1
---

The Moodle App is a mobile application that helps users make the best of their Moodle sites on handheld devices. It has some additional features like offline access, and a dedicated interface adapted to mobile. It's focused on student functionality, so you won’t find all the features you have on the web for teachers and admins. You can learn more about the features available in [the user documentation](https://docs.moodle.org/).

On a technical level, it's a completely different codebase from the Moodle LMS, and interacts with a Moodle site using [[web services]]. You can find the source code of the application in github: [github.com/moodlehq/moodleapp](https://github.com/moodlehq/moodleapp).

Before embarking into any Moodle-specific documentation, we recommend that you are at least familiar with [Angular](https://angular.io/) and [Ionic Framework](https://ionicframework.com/). These are the core technologies used in the application. We'll reference any relevant concepts, but having a basic idea will take you a long way in understanding the Moodle App.

## Basic concepts

### How does it work?

When you are accessing a Moodle site on the web, you are only capable of using one site at a time. In contrast to that, the Moodle App can be used with multiple sites at once. However, you will need to switch sessions to interact with each site, so you won’t be able to use multiple sites simultaneously (but you'll continue receiving push notifications and reminders for all the sites connected in the app).

This works because the app is not coupled to any specific Moodle site, it acts as a client that will connect with a site after logging in; using the site url and user credentials. Compared to the Moodle LMS, users can always use the latest version of the app even if the site is running an old version. Some features may be missing or change depending on the version of the site, but it will work the same way for the most part.

The app can also be compiled to work with a single site, or a list of approved sites. Which may be desirable for building custom applications. For most people though, [the official app from MoodleHQ](https://moodle.com/app/) will be sufficient because it’s not restricted to any site.

Keep in mind that the application only works with moodle sites that allow it, and this is disabled by default. If you want to allow users to log into your site using the app, make sure to [enable it in the settings](https://docs.moodle.org/311/en/Moodle_app_guide_for_admins#Enable_mobile_services_on_your_site). If you are not the site owner, reach out to the administrators.

### Architecture

The code of the application follows an [hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)), with core modules that include the main functionality and addon modules that provide additional features.

Class names are prefixed by their module, so that you can identify whether you’re working with something in core or an addon. For example, `CoreCourseProvider` is a core service implementing course features, while `AddonMessagesProvider` is an addon service related with messaging.

These modules are defined as [Angular Modules](https://angular.io/guide/architecture-modules), and they are resolved at runtime using [Angular's dependency injection framework](https://angular.io/guide/architecture-services).

Pages and navigation are defined using [Angular Router](https://angular.io/guide/routing-overview), making heavy use of [lazy loading](https://angular.io/guide/lazy-loading-ngmodules).

### Web services and caching

TODO

### Delegates and handlers

TODO

### Site plugins

TODO

## Platform Support

The Moodle App only works with Moodle sites running version 3.1 or newer.

The minimum platforms supported by the application are Android 5.1 (with Webview 61 or higher) and iOS 11.

Browsers are not officially supported, but you can use a Chromium-based browser for development if you don’t need any native functionality. However, there are [some caveats](#) you should be aware of.

## Where to go next

Now that you are familiar with the basic concepts, you understand how the application works, and you’ve got your development environment set up; you're ready to embark into the particulars of what you're trying to achieve.

- Do you want to contribute to the core? Read the [[Moodle App Development Guide]]
- Do you want to adapt a plugin to mobile? Read the [[Moodle App Plugins Development Guide]].
- Do you want to customise your site in the app? Read the [[Moodle App Customisation]] page.
- Do you want to make a custom app? Read the [[Custom Moodle Apps]] page.

If you have any further questions, check out the [FAQ](#). If there's anything you want to share, you can do it in [the forum](https://moodle.org/mod/forum/view.php?id=7798) or [the Telegram developer room](#). You can also report any bugs that you find in [the tracker](https://tracker.moodle.org/browse/MOBILE).
