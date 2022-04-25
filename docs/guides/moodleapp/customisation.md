---
title: Moodle App Customisation
sidebar_position: 3
tags:
  - Moodle App
---

The Moodle App can be customised in different ways:

- Changing the app appearance for your site.
- Adding support in your plugin for the mobile app.
- Configuring how the app should work via Moodle site settings.
- Creating a custom application (with your custom name and icon) based on the open source code.

With the first three options, you are not required to work with the source code and your users can use the standard app.

The fourth option involves building your own application, and it is not covered in this documentation. You can learn more about that in the [[Custom Moodle Apps]] page.

## Changing the app appearance for your site

The app can retrieve your custom styles from your Moodle site. Since it is an HTML5 app, you can safely apply CSS3 styles.

In your Moodle installation, go to "Plugins > Web services > Mobile" and enter in the `mobilecssurl` field a valid URL pointing to a CSS file containing your custom styles (theme). The CSS should be placed inside your Moodle installation (in your custom theme or inside a local plugin).

Once the user is logged in to the app, there is a periodical process that retrieves your remote CSS files for applying your custom styles into the app. So if you don't see the styles right away, try removing the site from the app and adding it again.

Notice that the first time a user opens the app, they will see the default styles. Your custom styles will be applied once the user has added a site in the app. Given that styles come from a site, there is no way to change the initial "Add site / Manage account" pages styles.

You can learn more about this in the [Moodle App Remote themes](./remote-themes) page.

## Adding support in your plugin for the mobile app

You can create Moodle plugins to change how the app works. You can learn about this in the [[Moodle App Plugins Development Guide]] page.

## Configuring how the app should work via Moodle site settings

The app can be configured via Moodle site settings. You can disable features, rename strings, add new elements to the main menu, or change how log out works in the app. This requires Moodle 3.3 or the [Moodle Mobile additional features plugin](https://docs.moodle.org/en/Moodle_Mobile_additional_features).

You can learn about all the configuration options in [the user guide](https://docs.moodle.org/en/Moodle_app_guide_for_admins#Configuring_the_app_from_your_site).

## Testing and developing

You can test your changes using any Chromium-based browser, but you should launch it with some security features disabled. You can learn more about that in the [[Using the Moodle App in a browser]] page.

Also, keep in mind that the usage of Remote themes and Moodle settings could be limited depending on your [Moodle App plan](https://apps.moodle.com).

## See also

- [Branded Moodle Apps service by Moodle HQ](https://moodle.com/branded-app/)
