---
title: Moodle App Remote Themes
sidebar_label: Remote themes
sidebar_position: 1
tags:
  - Moodle App
---

## How do Remote themes work?

When you enter a site, it downloads any file configured on the `mobilecssurl` administration field and injects the styles in the app. Every time you change between sites, each style will be enabled or disabled appropriately.

The styles will remain enabled in the login page, but any other page that is not related with a specific site will use the default styles. For example, pages to add or remove sites cannot be customised with Remote themes.

## How can you create your own theme?

First of all, Remote themes are only available for sites that purchased a Premium subscription for the Moodle App. You can check the different plans in [the Apps Portal](https://apps.moodle.com). If you want, you can follow the instructions in this document without purchasing a subscription and it will work in your development environment.

In order to create your own theme, we recommend that you use the app from [latest.apps.moodledemo.net](https://latest.apps.moodledemo.net) and check the styles using the browser inspector. You can use any Chromium-based browser, but you should launch it with some special arguments. You can read more about that in the [Using the Moodle App in a browser](../development/setup/app-in-browser) page. If you need to test a different version of the app, you can also use [main.apps.moodledemo.net](https://main.apps.moodledemo.net) for the latest development version or [the Docker images](../development/setup/docker-images.md) for anything more specific.

Once you have everything ready, you can configure your theme by going to "Site administration > Mobile app > Mobile appearance" in your site and setting the `mobilecssurl` field to a url pointing to a CSS file. This file can be placed inside your Moodle installation in your custom theme, inside a local plugin, or hosted elsewhere.

You can get started with the following example, and you should see the background of the top bar change to red once you log into the app:

```css
html {
    --core-header-toolbar-background: red;
}
```

### Applying theme changes during development

For performance reasons, the app caches the styles after you log in for the first time. So if you make any changes, you won't see them unless you log out and log in again. However, there is a faster way to update them. You can also open the Preferences page in the app and click on the "Synchronise now" button. This will download the files again, and you can use this method to iterate on your styles while you make the theme.

The file can also be cached by the browser, so when you do this make sure to [disable network cache](https://developer.chrome.com/docs/devtools/network/reference/#disable-cache) as well.

### Knowing what to style

Depending on how much you want to customise the UI, you'll need to do different things.

The application defines some [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) that can help you customise basic styles, like the one we used in our example above to change the background color of the header toolbar. You can find these variables in the source code, the main ones are defined within [theme.light.scss](https://github.com/moodlehq/moodleapp/blob/main/src/theme/theme.light.scss) and [theme.dark.scss](https://github.com/moodlehq/moodleapp/blob/latest/src/theme/theme.dark.scss), and you can find others within component styles.

If you need anything more specific, the application is built using [the Ionic Framework](https://ionicframework.com/docs/theming/basics), so reading their documentation can help you understand how the UI works and which components are available. We have some custom components that you won't find listed on their documentation, but most of them built on top of Ionic's.

Finally, if you need to style something even more specific, you can always [browse the source code](https://github.com/moodlehq/moodleapp) to see how a specific page is built. You can also use the [Elements Panel](https://developer.chrome.com/docs/devtools/dom/) of your browser to inspect styles and debug anything that isn't working as you'd expect. Depending what you are trying to do, remember that this is only a development environment and it may not work correctly in a native device. If you are doing anything complicated, make sure to double check using a real device to see that everything looks good.

Notice that you will often need to use `!important` if you're overriding component styles directly, without using any variables. That's because the default styles are usually scoped to the Angular component, and you won't be able to provide more [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) in your selectors.

### Working with colors

The main color of the app is Moodle Orange, but you can change it by using the `--primary` variable. Other than the overall brand color, there are also some specific variables for other colors.

#### Basic shades

These are the variables used to define the basic color palette used throughout the app:

- `--white` and `--black`.
- Gray shades `--gray-100`, `--gray-200` ... `--gray-900`. Where the greater, the darker.

#### Semantic colors

The named colors are not directly used. Instead, the following semantic colors are used:

- `--primary` Brand color.
- `--secondary` Gray 300 shade.
- `--danger` Red.
- `--warning` Yellow.
- `--success` Green.
- `--info` Blue.
- `--light` Gray 100 shade.
- `--medium` Gray 700 shade.
- `--dark` Gray 900 shade.

Each of these also define other variants: `rgb`, `contrast`, `contrast-rgb`, `shade` and `tint`. If you want to modify any of these, it won't suffice with changing the base color they are derived from, because there are limitations and you'll have to override each variant manually.

For example, if you want to override the primary color, you'll need to override the following variables:

```css
html {
    --ion-color-primary: #006600;

    /* RGB list of the color */
    --ion-color-primary-rgb: 0,102,0;

    /* Black or white, depending on which color gives more contrast */
    --ion-color-primary-contrast: #ffffff;

    /* RGB version of the contrast color */
    --ion-color-primary-contrast-rgb: 255,255,255;

    /* Slightly darker color. (mix 12% of black) */
    --ion-color-primary-shade: #005a00;

    /* Slightly lighter color. (mix 10% of white) */
    --ion-color-primary-tint: #1a751a;
}
```

#### Specific colors

Other than the basic and semantic colors, other components and pages define their own variables that you can override. You can look at the source code to find more, but these are some of the most relevant:

```css
html {
    /* Page background */
    --background-color: white;
    --ion-background-color-rgb: 255, 255, 255;

    /* Main text color */
    --text-color: black;
    --ion-text-color-rgb: 0, 0, 0;

    /* Text used in categories and secondary content */
    --subdued-text-color: gray;

    /* Links text */
    --core-link-color: blue;
}
```

### Targeting different environments

The `html` element contains classes that indicate the environment the app is running on.

#### Platform

You can specify styles that will only apply to iOS by prepending them with `html.ios`, or `html.md` for Android:

```css
/* Red toolbar in iOS */
html.ios {
    --core-header-toolbar-background: red;
}

/* Green toolbar in Android */
html.md {
    --core-header-toolbar-background: green;
}
```

#### Moodle App and Moodle site versions

You can restrict CSS rules to a specific version using one of these classes. For example, when accessing a 3.11.2 site using the 3.9.5 app the following classes will be present in the `html` element:

- `version-3`
- `version-3-11`
- `version-3-11-2`
- `moodleapp-3`
- `moodleapp-3-9`
- `moodleapp-3-9-5`

And here's how to use them:

```css
/* Red toolbar for Moodle App version 4.1.X */
html.moodleapp-4-1 {
    --core-header-toolbar-background: red;
}

/* Green toolbar for all other versions */
html {
    --core-header-toolbar-background: green;
}
```

#### Moodle site theme

Starting on Moodle App 4.4 you can restrict CSS rules to a specific site theme. So, when accessing to your site, the app will retrieve the name of the site theme and will add a class to HTML tag following the next pattern:
`theme-site-MYTHEME` and you can use this selector to filter your rules.

#### Application theme

The application uses a light theme by default, but it adds the `dark` class to the `html` element when it is using a dark theme:

```css
/* Red toolbar for the Light Theme */
html {
    --core-header-toolbar-background: red;
}

/* Green toolbar for the Dark Theme */
html.dark {
    --core-header-toolbar-background: green;
}
```

Bear in mind that you can disable Dark Mode for all your users following [the guide for admins (Disabled features)](https://docs.moodle.org/en/Moodle_app_guide_for_admins#Disabled_features).

#### Combining classes

Of course, you can combine any of these classes to create more granular styles.

Let's say you want to have a red toolbar only in iOS, with the Dark Theme, for a Moodle site running 3.11.X:

```css
html.ios.version-3-11.dark {
    --core-header-toolbar-background: red;
}
```

### Styling the shadow DOM

Ionic is a set of web components and uses the [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to encapsulate them and make them more opaque to developers and users (hiding markup structure, style, and behaviour), thus avoiding conflicts with existing rules.

This makes it more difficult to personalise and change some parts of those components. However you can check [the official Ionic documentation](https://ionicframework.com/docs/theming/css-shadow-parts#ionic-framework-parts) to see which parts are customisable.

For example, if you look at [the documentation for an `ion-button`](https://ionicframework.com/docs/api/button#css-shadow-parts), you can style it this way:

```css
/* Disable text transformations */
ion-button::part(native) {
    text-transform: none;
}

/* Use a red background by default */
ion-button {
    --background: red;
}

/* Use a yellow background for buttons with the "my-custom-class" class */
ion-button.my-custom-class {
    --background: yellow;
}
```

You can learn more about the shadow DOM in the following resources:

- [Using shadow DOM - Web Components | MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [CSS Shadow Parts - Ionic Documentation](https://ionicframework.com/docs/theming/css-shadow-parts)
- [Shadow DOM in Ionic (and Why it's Awesome) - Ionic Blog](https://ionicframework.com/blog/shadow-dom-in-ionic-and-why-its-awesome/)

### Supporting older versions of the app

If you need to support different versions of the app, or you're upgrading your theme from an older version, you should read the [Moodle App Remote themes upgrade guide](../upgrading/remote-themes-upgrade-guide.md).

## Common customisations

In this section you will find a list of some common customisations you may want to add to your Remote theme.

### Header toolbar

The header toolbar has a bottom border that you can disable or customise, along with other parts:

```css
/* Background */
ion-header ion-toolbar {
    --core-header-toolbar-background: red;
}

/* Bottom border */
ion-header ion-toolbar {
    --core-header-toolbar-border-width: 2px; /* Use 0 to disable it */
    --core-header-toolbar-border-color: green;
}

/* Text and buttons */
ion-header ion-toolbar {
    --core-header-toolbar-color: blue;
}

ion-header ion-toolbar.in-toolbar h1,
ion-header ion-toolbar.in-toolbar h2 {
    font-weight: normal;
}
```

### Bottom tab bar (main menu)

```css
ion-tab-bar.mainmenu-tabs {
    /* Background */
    --core-bottom-tabs-background: red;
    --core-bottom-tabs-background-selected: transparent;

    /* Tab icons */
    --core-bottom-tabs-color: blue;

    /* Selected tab icon */
    --core-bottom-tabs-color-selected: green;

    /* Badges */
    --core-bottom-tabs-badge-text-color: black;
    --core-bottom-tabs-badge-color: white;
}
```

### Top tabs

```css
core-tabs, core-tabs-outlet {
    /* Background */
    --core-tabs-background: red;

    /* Tab */
    --core-tab-background: red;
    --core-tab-color: white;

    /* Selected tab */
    --core-tab-color-active: blue;
    --core-tab-border-color-active: blue;
    --core-tab-font-weight-active: bold;
}
```

### Items

```css
html {
    /* Background */
    --ion-item-background: green;

    /* Divider */
    --item-divider-background: red;
    --item-divider-color: blue;

    /* Empty Divider */
    --spacer-background: yellow;
}
```

### Progress bar

```css
core-progress-bar {
    --core-progressbar-height: 4px;
    --core-progressbar-color: red;
    --core-progressbar-text-color: green;
    --core-progressbar-background: blue;
}
```

### More page

```css
/* Icons */
page-core-mainmenu-more {
    --core-more-icon: red;
}

/* Target a specific icon */
page-core-mainmenu-more .addon-privatefiles-handler ion-icon {
    color: green !important;
}

/* Items */
page-core-mainmenu-more {
    --core-more-item-border: blue;
    --spacer-background: blue;
}
```

### Login page

You can personalise some colors in the Login page, but keep in mind that this only includes the credentials page (the one after you select the site).

```css
html {
    --core-login-background: red;
    --core-login-text-color: blue;
    --core-login-input-background: green;
    --core-login-input-color: yellow;
}
```

### Messages page

```css
html {
    --addon-messages-message-bg: white;
    --addon-messages-message-activated-bg: gray-light;
    --addon-messages-message-note-text: gray-dark;
    --addon-messages-message-mine-bg: gray-light;
    --addon-messages-message-mine-activated-bg: gray;
    --addon-messages-discussion-badge: orange;
    --addon-messages-discussion-badge-text: white;
    --core-send-message-input-background: gray-light;
    --core-send-message-input-color: black;
}
```

### Showing course summary image on course page

By default, course summary images are hidden to reduce scrolling when entering a course. If you want to change this behaviour, you can include the following CSS in your Remote theme:

```css
ion-app core-course-format .core-format-progress-list .core-course-thumb {
    display: block !important;
}
```

## Updating your theme after release

Once you have configured your theme, some users may already have downloaded previous styles and they will be cached.

If you are updating the styles and you want users to get the latest version, you can change the url of the theme file. This doesn't mean that you need to change the name of the file itself, you can just add some query parameters that will be irrelevant when the file is downloaded:

```text
https://mysite.com/mobile/mobiletheme.css?version=1
```

Every time you make some changes in your theme and you want the file to be re-downloaded in the app, just increase this number.

## Difference between Remote themes and Branded Apps

Remote theme styles can be tricky to modify. There are lots of CSS rules and some of them can change between versions. Using your own Branded App, you will have better integrations because you can also use Sass variables to change colors and styles. Additionally, you will get your custom application icon and the theming will cover the entire application, not just pages using your site.

You can find more info on the [Branded Apps](https://moodle.com/branded-app) page.
