---
title: Moodle App Plugins Upgrade Guide
sidebar_label: Plugins
sidebar_position: 2
tags:
  - Moodle App
---

<!-- markdownlint-disable no-inline-html -->

In the following guide, you will learn how to upgrade your plugins to support newer versions of the app.

However, keep in mind that not all your users will be using the latest version. You can support multiple versions of the app by checking the value of `appversioncode`. Here you can find an example applied to the `choicegroup` plugin: [Choicegroup plugin](https://github.com/dpalou/moodle-mod_choicegroup/blob/ionic5/classes/output/mobile.php#L52).

As you can see in that repository, the JS and the templates are duplicated in order to have one file to support one version and another file to support another version. You could even do this for more than 2 versions, depending on how thorough you want to be. In this example, they are called "ionic3" and "latest", because it was prepared when the app was upgraded from ionic 3 to ionic 5. But you can structure this as you prefer. You can also have a single file with different HTML depending on the `appversioncode`. That's up to you.

Depending on which version of the app you're upgrading from, you'll need to go through multiple version upgrades. This guide is divided by version ranges, so you should be able to start with your current version and build up from there.

Other than the changes outlined in this document, there may be smaller API changes that aren't highlighted here. Make sure to check the [upgrade.txt](https://github.com/moodlehq/moodleapp/blob/latest/upgrade.txt) file for an exhaustive list with all the changes.

## 4.4 to 4.5

The Ionic version has been upgraded to v8 (from v7), make sure to check the relevant upgrade guides for [v8](https://ionicframework.com/docs/updating/8-0). In particular, the legacy syntax to declare input labels that was deprecated on Ionic7 now has been removed.

## 4.3 to 4.4

Starting with this release, the changes listed in [upgrade.txt](https://github.com/moodlehq/moodleapp/blob/latest/upgrade.txt) will only document breaking changes for APIs exposed to site plugins. Internal changes will no longer be documented. Make sure to check out the file to learn about the changes in this version.

Also, the Ionic version has been upgraded to v7 (from v5), make sure to check the relevant upgrade guides for [v6](https://ionicframework.com/docs/updating/6-0) and [v7](https://ionicframework.com/docs/updating/7-0). In particular, the syntax to declare input labels has been refactored. The legacy syntax will continue working for the time being, but we recommend migrating to the [modern syntax](https://ionicframework.com/docs/api/input#migrating-from-legacy-input-syntax) as soon as possible.

The Angular version has also been upgraded to v17, and it comes with new features such as [a new syntax for conditionals and loops](https://angular.dev/essentials/conditionals-and-loops) and [signals](https://angular.dev/guide/signals). Signals are not available in the app yet, but most new features like the conditionals should work. In any case, always make sure to test your code with the latest version of the app before proceeding; and keep in mind that some of your users could still be using an old version of the app. So adopt these new features with caution.

Finally, the application now needs to run in a secure context (https://). This change only affects your development environment, and it was necessary to [move on from the deprecated WebSQL API](https://tracker.moodle.org/browse/MOBILE-4304).

## 4.2 to 4.3

Font Awesome icons have been updated to version 6.4.0, so make sure that all the icons you're using in your plugin are still supported.

Other than that, there have been some changes in the APIs related to analytics. Check out [upgrade.txt](https://github.com/moodlehq/moodleapp/blob/latest/upgrade.txt) to learn about the specifics.

## 4.1 to 4.2

Font Awesome icons have been updated to version 6.3.0, so make sure that all the icons you're using in your plugin are still supported.

Additionally, the `<core-icon>` component has been removed (it was deprecated in 3.9.5). If you were still using it, you should replace it with `<ion-icon>` which now supports [using font icons](../development/plugins-development-guide/api-reference.md#ion-icon).

## 4.0 to 4.1

There is only one thing to look after when upgrading to 4.1, so it should be a relatively quick process.

### Mode classes

If your plugin is not declaring any custom CSS, you can ignore this section.

Starting in 4.1, mode and version classes have been moved from the `body` tag to the `html` tag. This change arose from [a bug on derived CSS variables](https://tracker.moodle.org/browse/MOBILE-4127), and it should be fairly straightforward to make.

<CodeDiff titles="4.0, 4.1">

```css
body {
    color: black;
}

body.dark {
    color: white;
}
```

```css
html {
    color: black;
}

html.dark {
    color: white;
}
```

</CodeDiff>

:::info
In order to avoid breaking existing styles, version 4.1 will continue adding version classes both to `body` and `html` tags. But using the classes from the `body` tag is considered a deprecated approach, and won't be supported in future versions. So we recommend that you update your plugin now.
:::

## 3.9.5 to 4.0

There haven't been any breaking changes from 3.9.5 to 4.0, but the UI of the application has changed drastically so we recommend taking special care that the UI of your plugin is still working properly. Also, remember to double check all the changes listed in [upgrade.txt](https://github.com/moodlehq/moodleapp/blob/latest/upgrade.txt).

Other than that, everything should continue working as expected. If you find something that doesn't, please [let us know](https://tracker.moodle.org/projects/MOBILE).

## 3.9.4 to 3.9.5

Starting with version 3.9.5, the Moodle App uses Ionic 5. As usual, we tried not to change our APIs and components to prevent breaking existing plugins. Unfortunately, Ionic 5 comes with a lot of breaking changes, especially related to templates. This means that plugins need to be adapted in order to look good in the new versions of the app.

Please note that if your plugin doesn't use Ionic components nor JavaScript, it's possible that you don't have to adapt it. However, we recommend you to test the plugin with new versions of the app to check if everything works correctly.

### Ionic changes

Previous versions of the app used Ionic 3, so the update involved an increase in two versions and Ionic changed a lot of their components, directives, and utilities.

You can read the official [Ionic migration documentation](https://ionicframework.com/docs/reference/migration). Even if your plugins are not Ionic applications themselves, you can find information about components and other changes.

One relevant change is that all functions related to modals are now asynchronous. This means that if your plugin is displaying a modal in JavaScript, you'll probably need to adapt your code.

Another important change is that text inside of `<ion-item>` should always be placed inside of an `<ion-label>`, otherwise it might not look good in some cases:

<CodeDiff titles="3.9.4, 3.9.5">

```html
<ion-item>My text</ion-item>
```

```html
<ion-item>
    <ion-label>My text</ion-label>
</ion-item>
```

</CodeDiff>

Finally, all Ionic directives are now components, like `<ion-label>` or `<ion-avatar>`. This means that these directives cannot be used in combination with another component.

Some common cases that will need to be modified are `core-mark-required` and `core-user-avatar`:

<CodeDiff titles="3.9.4, 3.9.5">

```html
<ion-label core-mark-required="true">
    ...
</ion-label>

<ion-avatar core-user-avatar ...>
```

```html
<ion-label>
    <span core-mark-required="true">
        ...
    </span>
</ion-label>

<core-user-avatar ...>
```

</CodeDiff>

### You can now use ES6

The minimum platform requirements for Cordova and Ionic increased, and so it also affected the Moodle App. The new version requires Android 5.1 with WebView 61+, which means that the JavaScript for the app can now be compiled to ES6.

Please notice that you **cannot** use async/await, as they aren't part of ES6 and Android WebView 61 doesn't support them.

One issue that can break your plugin's JavaScript is extending classes. In Ionic 3, when your plugin extends a class it's actually getting a function. In Ionic 5, your plugin will receive a JavaScript class and it should be extended using class syntax.

Here's an example to create a subclass of `CoreContentLinksModuleIndexHandler`:

<CodeDiff titles="3.9.4, 3.9.5" vertical>

```js
function AddonModCertificateModuleLinkHandler() {
    that.CoreContentLinksModuleIndexHandler.call(
        this,
        that.CoreCourseHelperProvider,
        'mmaModCertificate',
        'certificate',
    );

    this.name = 'AddonModCertificateLinkHandler';
}

AddonModCertificateModuleLinkHandler.prototype = Object.create(this.CoreContentLinksModuleIndexHandler.prototype);
AddonModCertificateModuleLinkHandler.prototype.constructor = AddonModCertificateModuleLinkHandler;
```

```js
class AddonModCertificateModuleLinkHandler extends this.CoreContentLinksModuleIndexHandler {

    constructor() {
        super('mmaModCertificate', 'certificate');

        this.name = 'AddonModCertificateLinkHandler';
    }

}
```

</CodeDiff>

### Changes in the app's code

We've also done some changes to the code of the app. Most of these changes probably don't affect your plugin, but you should still check this out just in case:

- `<core-icon>` has been deprecated, please use `<ion-icon>` which now supports [using font icons](../development/plugins-development-guide/api-reference.md#ion-icon).
- To "cross out" an icon using `ion-icon` you need to use `class="icon-slash"` instead of `slash="true"`.
- The function `syncOnSites` from `CoreSyncBaseProvider` now expects to receive a function with the parameters already bound:

<CodeDiff titles="3.9.4, 3.9.5" vertical>

```js
syncOnSites('events', this.syncAllEventsFunc.bind(this), [siteId]);
```

```js
syncOnSites('events', this.syncAllEventsFunc.bind(this, force), siteId);
```

</CodeDiff>

- All the delegates that previously supplied an injector parameter to its handlers no longer do that. For example, the function `getComponent()` in `CoreUserProfileFieldDelegate` used to receive an injector as a parameter, but now it won't receive any parameter.
- All the delegates that previously supplied a `NavController` parameter to its handlers no longer do that. For example, the function `openCourse()` in `CoreCourseFormatDelegate` no longer receive the `NavController` parameter.
- The handlers registered in `CoreCourseOptionsDelegate` now need to return the properties `page` and `pageParams` instead of `component` and `componentData`. Please notice this only affects your plugin if you're creating the handler yourself using JavaScript code.
- The handlers registered in `CoreUserDelegate` have changed a bit. Please notice this only affects your plugin if you're creating the handler yourself using JavaScript code.
  - Handlers can now define a `cacheEnabled` property (`false` by default) to cache `isEnabledForUser` calls.
  - In the function `isEnabledForUser`, the `navOptions` and `admOptions` parameters have been removed.
  - `isEnabledForUser` is now optional and defaults to `true`.
  - They can implement a new function called `isEnabledForCourse`; this function will receive the `navOptions` and `admOptions` parameters. If it's not defined, it'll default to `true`.
- The function `prefetchPackage` in the `CoreCourseActivityPrefetchHandlerBase` has changed. If you were using this class to implement your own prefetch handler you might need to update its code.
- `CoreInitDelegate` has been deleted. Now the initialisation of the app is done via Angular's `APP_INITIALIZER`. Please notice that `APP_INITIALIZER` cannot and shouldn't be used by plugins.
- The function `getAdditionalDownloadableFiles` in question types now needs to return a list of `CoreWSExternalFile`, it no longer accepts a list of strings.
- Files stored to be uploaded later using `CoreFileUploaderProvider` no longer have an `offline` property, now they're just instances of `FileEntry`.
- `ionViewCanLeave` function has been renamed to `canLeave`.
- The `onchange` method of the `Network` service is now called `onChange`.

### Is there any example I can look at?

If you used the app's code as an example to build your plugin, you can do the same. There are also some plugins that have been updated, for example, you can see the following PRs on the `choicegroup` plugin:

- [https://github.com/ndunand/moodle-mod_choicegroup/pull/149](https://github.com/ndunand/moodle-mod_choicegroup/pull/149)
- [https://github.com/ndunand/moodle-mod_choicegroup/pull/150](https://github.com/ndunand/moodle-mod_choicegroup/pull/150)

You can also look at the [Moodle App Plugins development guide](../development/plugins-development-guide/index.md), it has been updated to reflect how to write plugins for the latest version of the app.

## Before 3.5

Before 3.5, the app was written using Ionic 1 and Moodle plugins could add mobile support by writing an Angular JS/Ionic module, compiling it to a zip, and including it in the plugin.

Nowadays, you need to install the [Moodle App Additional Features](https://docs.moodle.org/en/Moodle_app_additional_features) plugin to make these plugins compatible with the latest versions of Moodle.

You can read about [Remote add-ons](https://docs.moodle.org/dev/Moodle_Mobile_2_(Ionic_1)_Remote_add-ons) for more details.
