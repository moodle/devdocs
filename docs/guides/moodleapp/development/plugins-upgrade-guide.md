---
title: Moodle App Plugins Upgrade Guide
sidebar_label: Plugins Upgrade Guide
sidebar_position: 7
tags:
  - Moodle App
---

Starting with version 3.9.5, the Moodle App uses Ionic 5. As usual, we tried not to change our APIs and components to prevent breaking existing plugins. Unfortunately, Ionic 5 comes with a lot of breaking changes, especially related to templates. This means that plugins need to be adapted in order to look good in the new versions of the app.

Please note that if your plugin doesn't use Ionic components nor JavaScript, it's possible that you don't have to adapt it. However, we recommend you to test the plugin with new versions of the app to check if everything works correctly.

## Ionic changes

Previous versions of the app used Ionic 3, so the update involved an increase in two versions and Ionic changed a lot of their components, directives and utilities.

You can read the official [Ionic migration documentation](https://ionicframework.com/docs/reference/migration). Even if your plugins are not Ionic applications themselves, you can find information about components and other changes.

One relevant change is that all functions related to modals are now asynchronous. This means that if your plugin is displaying a modal in JavaScript, you'll probably need to adapt your code.

Another important change is that text inside of `<ion-item>` should always be placed inside of an `<ion-label>`, otherwise it might not look good in some cases. For example:

```html title="Ionic 3"
<ion-item>My text</ion-item>
```

```html title="Ionic 5"
<ion-item><ion-label>My text</ion-label></ion-item>
```

Finally, all Ionic directives are now components, like `<ion-label>` or `<ion-avatar>`. This means that these directives cannot be used in combination with another component. Some common cases that will need to be modified:

```html title="Ionic 3"
<ion-label core-mark-required="true">...</ion-label>

<ion-avatar core-user-avatar ...>
```

```html title="Ionic 5"
<ion-label><span core-mark-required="true">...</span></ion-label>

<core-user-avatar ...>
```

## You can now use ES6

The minimum platform requirements for Cordova and Ionic increased, and so it also affected the Moodle App. The new version requires Android 5.1 with WebView 61+, which means that the JavaScript for the app can now be compiled to ES6.

Please notice that you **cannot** use async/await, as they aren't part of ES6 and Android WebView 61 doesn't support them.

One issue that can break your plugin's JavaScript is extending classes. In Ionic 3, when your plugin extends a class it's actually getting a function. In Ionic 5, your plugin will receive a JavaScript class and can be extended using class syntax:

Here's an example to create a subclass of `CoreContentLinksModuleIndexHandler`:

```javascript title="Ionic 3"
function AddonModCertificateModuleLinkHandler() {
    that.CoreContentLinksModuleIndexHandler.call(this, that.CoreCourseHelperProvider, 'mmaModCertificate', 'certificate');

    this.name = 'AddonModCertificateLinkHandler';
}

AddonModCertificateModuleLinkHandler.prototype = Object.create(this.CoreContentLinksModuleIndexHandler.prototype);
AddonModCertificateModuleLinkHandler.prototype.constructor = AddonModCertificateModuleLinkHandler;
```

```javascript title="Ionic 5"
class AddonModCertificateModuleLinkHandler extends this.CoreContentLinksModuleIndexHandler {

    constructor() {
        super('mmaModCertificate', 'certificate');

        this.name = 'AddonModCertificateLinkHandler';
    }

}
```

## Changes in the app's code

We've also done some changes to the code of the app. Most of these changes probably don't affect your plugin, but you should still check this out just in case:

- `<core-icon>` is now deprecated, please use `<ion-icon>` instead. Right now you can use font-awesome icons with `ion-icon`. However, it still hasn't been decided whether font awesome will be used in Moodle 4.0 or not, so font-awesome may be removed from the app in the future.
- To “cross out” an icon using `ion-icon` you need to use `class="icon-slash"` instead of `slash="true"`.
- The function `syncOnSites` from `CoreSyncBaseProvider` now expects to receive a function with the parameters already bound:

```javascript title="Ionic 3"
    syncOnSites('events', this.syncAllEventsFunc.bind(this), [siteId);
```

```javascript title="Ionic 5"
    syncOnSites('events', this.syncAllEventsFunc.bind(this, force), siteId);
```

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

## Supporting both Ionic 3 and Ionic 5

Your plugin should still support Ionic 3 so it works on devices that haven't updated the app yet. This can be done by checking the value of `appversioncode` sent by the app. Here you can find an example applied to the `choicegroup` plugin: [Choicegroup plugin](https://github.com/dpalou/moodle-mod_choicegroup/blob/ionic5/classes/output/mobile.php#L52).

As you can see in that repository, the JS and the templates are duplicated in order to have one file to support Ionic 3 and another file to support Ionic 5. In this example, they are called "ionic3" and "latest", but you can structure this as you prefer. You can also have a single file with different HTML depending on the `appversioncode`. That's up to you.

## Is there any example I can look at?

If you used the app's code as an example to build your plugin, you can do the same. There are also some plugins that have been updated, for example, you can see the following PRs on the `choicegroup` plugin:

- <https://github.com/ndunand/moodle-mod_choicegroup/pull/149>
- <https://github.com/ndunand/moodle-mod_choicegroup/pull/150>

You can also look at the [Moodle App Plugins Development Guide](./plugins-development-guide), it has been updated to reflect how to write plugins for the latest version of the app.

## Before 3.5

Before 3.5, the app was written using Ionic 1 and Moodle plugins could add mobile support by writing an Angular JS/Ionic module, compiling it to a zip, and including it in the plugin.

Nowadays, you need to install the [[Moodle App Additional Features]] plugin to make these plugins compatible with the latest versions of Moodle.

You can read about [[Moodle_Mobile_2_(Ionic_1)_Remote_add-ons|Remote add-ons]] for more details.

## See also

- [Moodle App Remote Themes Upgrade Guide](../customisation/remote-themes-upgrade-guide)
- [Moodle App Acceptance Tests Upgrade Guide](./testing/acceptance-testing#Upgrading_tests_from_an_older_version)
