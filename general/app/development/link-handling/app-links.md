---
title: Links in the app
sidebar_position: 1
tags:
 - Moodle App
---

## Pressing a link inside the app

When a user presses a link in the Moodle app, the behaviour changes depending on whether the URL is supported by the app or not:

- If the URL belongs to the same site and it's supported by the app, then the app will try to open the corresponding page inside the app. For example if the user presses a link to an assignment, then the assignment will be opened inside the app if possible.
- If it's a URL pointing to an external site or it's a URL not supported by the app then it will be opened in a browser. For example admin settings aren't supported by the app, so clicking a link to an admin settings page will open the page in browser.

## Extending the list of supported URLs

The app has a defined list of supported URLs. If you have a plugin adapted to work in the app and you want to support links to your plugin you will need to create a Link Handler. For more information and examples about this, please see the [Link handlers](../plugins-development-guide/index.md#link-handlers) documentation.

## Opening links in an embedded browser

To open a link in an embedded browser instead of an external browser you can use the `data-open-in` attribute:

```html
<a href="https://domain.com" data-open-in="app">
```

:::note Notice
Please notice that students cannot add data attributes to HTML elements when using the Moodle editor, only teachers and users with the right permissions are able to add them.
:::

## Adding links to any HTML element

Using the `data-app-url` attribute you can also add a link to any HTML element. This link will only be used when the element is clicked in the app, it won't affect the behaviour when using a browser.

```html
<button data-app-url="https://domain.com">
```

A possible use case is to define a link for elements that are handled using JavaScript in browser, since in most cases the JavaScript code used in browser won't work in the app. This way the app will open a certain page when the element is clicked, otherwise it wouldn't do anything.

:::note Notice
Please notice that these links will always be opened in browser or embedded browser, not inside the app.
:::

The `data-app-url` attribute can also be used to define an alternate link to be used only in the app:

```html
<a href="https://domain.com" data-app-url="https://anotherdomain.com"></a>
```

When the link above is clicked in browser it will open `https://domain.com`, but when it's clicked in the app it will open `https://anotherdomain.com`.

The behaviour can be customised with the following data attributes:

- `data-open-in`: Set it to "app" to open the page in an embedded browser instead of the system browser.
- `data-app-url-confirm`: A confirmation message to be displayed before opening the browser.
- `data-app-url-resume-action`: Set it to "refresh" to update the course page when the user goes back to the app. Right now this only works in the course page, but in the future it might be added to other pages.

An example using all the attributes:

```html
<button
    data-app-url="https://anotherdomain.com"
    data-open-in="app"
    data-app-url-confirm="You need to enrol to the course in the browser."
    data-app-url-resume-action="refresh"
>
    Click me
</button>
```

:::note Notice
Please notice that students cannot add data attributes to HTML elements when using the Moodle editor, only teachers and users with the right permissions are able to add them.
:::
