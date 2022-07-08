---
title: Moodle App Remote themes upgrade guide
sidebar_label: Remote themes upgrade guide
sidebar_position: 2
tags:
  - Moodle App
---

In the following guide, you will find some examples to migrate your styles from an older version to work with the Ionic 5 Moodle App (starting at version 3.9.5). You will find tables where each row is a migration to do; the left part is the old code and the right part the new one.

We recommend that you keep your old CSS rules for older versions (see [Before starting the migration](#before-starting-the-migration)), by doing so users who are still using Moodle App 3.9.4 and earlier will see the same styling you had until now.

## Before starting the migration

1. Remove all styles using ionic classes ending with `-wp` (Windows Phone is not supported, therefore it's not necessary to specify it).
2. Check [the theme file](https://github.com/moodlehq/moodleapp/blob/master/src/theme/theme.light.scss), where most variables are specified.
3. As in the previous version, do not use any Saas variables (the ones starting with `$`). But now you can use [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) (the ones starting with `--`).
4. We recommend prepending all CSS rules with `body.ionic5` in order to make them only available for Ionic 5, and prepending the old ones with `body:not(.ionic5)` for the previous versions of the Moodle App (3.9.4, 3.9.3, and so on).
5. Be aware that example rules may differ from your CSS, which could be more specific.

### How to upgrade my theme

You can follow the same process that is documented in the [Moodle App Remote themes](../customisation/remote-themes.md#how-can-you-create-your-own-theme) page.

Make sure to read it in order to understand how to style your application for newer versions of the app. If you're upgrading your styles, it is likely that the documentation has been updated since you read it.

## Colors

The main color in the app is Moodle Orange, but you can now change it by using the `--primary` variable. This will probably reduce the CSS you are applying right now, but this only covers the main color.

For other colors, check out [the colors section in the main documentation](../customisation/remote-themes.md#working-with-colors).

## Header toolbar

On the header toolbar, we've added a bottom border that you can disable.

### Border width and color (new)

```css
ion-header ion-toolbar {
    --core-header-toolbar-border-width: 2px; /* Use 0 to disable it */
    --core-header-toolbar-border-color: yellow;
}
```

### Background

```css title="Ionic 3 legacy code"
.toolbar-background-md, .toolbar-background-ios {
    background: red;
}
```

```css title="Ionic 5"
ion-header ion-toolbar {
    --core-header-toolbar-background: red;
}
```

### Text and buttons

```css title="Ionic 3 legacy code"
.toolbar-title-md,
.toolbar-title-ios {
    color: red;
}
```

```css title="Ionic 5"
ion-header ion-toolbar {
    --core-header-toolbar-color: red;
}
```

```css title="Ionic 5"
.toolbar-title-md,
.toolbar-title-ios {
    font-weight: normal;
}
```

```css title="Ionic 5"
ion-header ion-toolbar.in-toolbar h1,
ion-header ion-toolbar.in-toolbar h2 {
    font-weight: normal;
}
```

## Bottom tab bar (main menu)

### Background

```css title="Ionic 3 legacy code"
.tabs-md .tabbar,
.tabs-ios .tabbar {
    background: red;
}
```

```css title="Ionic 5"
ion-tab-bar.mainmenu-tabs {
    --core-bottom-tabs-background: red;
    --core-bottom-tabs-background-selected: transparent;
}
```

### Tab icon color

```css title="Ionic 3 legacy code"
.tabs-md .tab-button-icon,
.tabs-ios .tab-button-icon {
    color: blue;
}
```

```css title="Ionic 5"
ion-tab-bar.mainmenu-tabs {
    --core-bottom-tabs-color: blue;
}
```

### Selected tab icon color

```css title="Ionic 3 legacy code"
tabs-md .tab-button[.tab-button-icon,
.tabs-ios .tab-button[aria-selected=true](aria-selected=true]) .tab-button-icon {
    color: red;
}
```

```css title="Ionic 5"
ion-tab-bar.mainmenu-tabs {
    --core-bottom-tabs-color-selected: red;
}
```

### Badge color and text

```css title="Ionic 3 legacy code"
core-ion-tabs .tab-badge.badge {
    color: white;
    background: red;
}
```

```css title="Ionic 5"
ion-tab-bar.mainmenu-tabs {
    --core-bottom-tabs-badge-text-color: white;
    --core-bottom-tabs-badge-color: red;
}
```

## Top tabs

### Tabs background

```css title="Ionic 3 legacy code"
.core-tabs-bar {
  background-color: red;
}
```

```css title="Ionic 5"
core-tabs, core-tabs-outlet {
    --core-tabs-background: red;
}
```

### Individual tab background

```css title="Ionic 3 legacy code"
.core-tabs-bar .tab-slide {
  background-color: red;
}
```

```css title="Ionic 5"
core-tabs, core-tabs-outlet {
    --core-tab-background: red;
}
```

### Unselected tab styles

```css title="Ionic 3 legacy code"
.core-tabs-bar .tab-slide {
  color: red;
  border-bottom-color: red;
}
```

```css title="Ionic 5"
core-tabs, core-tabs-outlet {
    --core-tab-color: red;
}
```

### Selected tab styles

```css title="Ionic 3 legacy code"
.core-tabs-bar .tab-slide[aria-selected=true]{
   color: red;
   border-bottom-color: red;
   font-weigth: normal;
}
```

```css title="Ionic 5"
core-tabs, core-tabs-outlet {
    --core-tab-color-active: red;
    --core-tab-border-color-active: red;
    --core-tab-font-weight-active: bold;
}
```

## Items

### Items background color

```css title="Ionic 3 legacy code"
ion-item {
    background: red;
}
```

```css title="Ionic 5"
body {
    --ion-item-background: red;
}
```

### Item divider background color

```css title="Ionic 3 legacy code"
.item-divider-md,
.item-divider-ios {
    background: red;
    color: yellow;
}
```

```css title="Ionic 5"
body {
    --item-divider-background: red;
    --item-divider-color: yellow;
}
```

### Empty divider background

```css title="Ionic 5"
body {
    --spacer-background: red;
}
```

## Progress bar

You can now easily style progress bars.

```css title="Ionic 5"
core-progress-bar {
    --core-progressbar-height: 8px;
    --core-progressbar-color: red;
    --core-progressbar-text-color: black;
    --core-progressbar-background: white;
}
```

## More page

### Icons

The icons in the More page can now easily change their color:

```css title="Ionic 3 legacy code"
page-core-mainmenu-more ion-icon {
    color: red;
}
```

```css title="Ionic 5"
page-core-mainmenu-more {
    --core-more-icon: red;
}
```

To change a color on a particular icon, you'll have to use the class of each handler. For example, to change the color of the folder icon on the menu item named Files:

```css title="Ionic 3 legacy code"
page-core-mainmenu-more .ion-md-folder,
page-core-mainmenu-more .ion-ios-folder {
    color: red;
}
```

```css title="Ionic 5"
page-core-mainmenu-more .addon-privatefiles-handler ion-icon {\
    color: red !important;
}
```

### Item border color

```css title="Ionic 3 legacy code"
page-core-mainmenu-more .item-block.item-ios .item-inner,
page-core-mainmenu-more .item-block.item-md .item-inner {
    border-bottom-color: red;
}
```

```css title="Ionic 5"
page-core-mainmenu-more {
    --core-more-item-border: red;
}
```

The dividers background color can now be overridden using `--spacer-background`:

```css title="Ionic 5"
page-core-mainmenu-more {
    --spacer-background: blue;
}
```

## Login page

You can now personalise some colors in the Login page, but keep in mind that this only includes the credentials page (the one after you select the site).

```css title="Ionic 5"
body {
    --core-login-background: red;
    --core-login-text-color: blue;
    --core-login-input-background: green;
    --core-login-input-color: yellow;
}
```

## Messages page

Message discussion page, including chat activity and comments:

```css title="Ionic 5"
body {
    --addon-messages-message-bg: white;
    --addon-messages-message-activated-bg: gray-light;
    --addon-messages-message-note-text: gray-dark;
    --addon-messages-message-mine-bg: gray-light;
    --addon-messages-message-mine-activated-bg: gray;
    --addon-messages-discussion-badge: orange;
    --addon-messages-discussion-badge-text: white;
}
```

You can also make some modifications on the input field:

```css
body {
    --core-send-message-input-background: gray-light;
    --core-send-message-input-color: black;
}
```

## Full example

This is a full example showcasing how to handle multiple versions:

```css
/* ----- Ionic 5 styles ----- */

body.ionic5 {
    --core-header-toolbar-background: red;
}

/* Dark mode */
body.ionic5.dark {
    --core-header-toolbar-background: blue;
}

/* iOS only */
html.ios body.ionic5 {
    --core-link-color: green;
}

/* Android only */
html.md body.ionic5 {
    --core-link-color: yellow;
}


/* ----- Ionic 3 styles (legacy) ----- */

body:not(.ionic5) .toolbar-background {
    border-color: #004C9C;
    background: #004C9C;
}
```

As you can see we recommend to always add `body.ionic` to start the CSS selectors, you can also use `:root body.ionic5` or even `html` before `body`.
