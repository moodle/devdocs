---
title: Links in the Moodle App
sidebar_label: Links in the app
sidebar_position: 1
tags:
 - Moodle App
---

## Pressing a link inside the app {/* #pressing-a-link-inside-the-app */}

When a user presses a link in the Moodle app, the behaviour changes depending on whether the URL is supported by the app or not:

- If the URL belongs to the same site and it's supported by the app, then the app will try to open the corresponding page. For example if the user presses a link to an assignment, then the assignment will be opened inside the app rather than opening a browser.
- If it's a URL pointing to an external site or it's a URL not supported by the app, then it will be opened in an external browser. This can also be configured to [open in an embedded browser](#opening-links-in-an-embedded-browser-or-in-an-iframe). For example admin settings aren't supported by the app, so clicking a link to an admin settings page will open the page in an external browser.
- If it's a URL pointing to a local file it will be opened with an external app in Android, and an embedded viewer in iOS. For example opening a PDF within a SCORM package would open a PDF reader in Android or and embedded PDF viewer in iOS.
- If the link is inside an iframe (and is not pointing to a local file), it will be opened within the same iframe. This behaviour can be changed by setting the link's `target` attribute to anything other than `_self`, in which case the URL will be opened in an external browser. For example, clicking a link with a `target="_blank"` attribute would open the URL in an external browser.

## Extending the list of supported URLs {/* #extending-the-list-of-supported-urls */}

The app has a defined list of supported URLs. If you have a plugin adapted to work in the app and you want to support links to your plugin you will need to create a Link Handler. For more information and examples about this, please see the [CoreContentLinksDelegate](../plugins-development-guide/api-reference.md#corecontentlinksdelegate) documentation.

## Opening links in an embedded browser or in an iframe {/* #opening-links-in-an-embedded-browser-or-in-an-iframe */}

To change how links are opened in the app you can use the `data-app-open-in` attribute:

```html
<a href="https://domain.com" data-app-open-in="inappbrowser">
```

Possible values are:

- `inappbrowser`: Opens the link in an embedded browser instead of external browser.
- `embedded`: Displays the site inside the app, using an iframe. Only works in Moodle app 5.2 or later.
- Any other value: Opens the link in external browser (e.g. Chrome or Safari).

:::note[Notice]
Please notice that students cannot add data attributes to HTML elements when using the Moodle editor, only teachers and users with the right permissions are able to add them.
:::

:::note[Notice]
Please notice that the `data-app-open-in` name will only work in Moodle app 5.2 or later. In previous versions, the name was `data-open-in`, which is deprecated.
:::

## Adding links to any HTML element {/* #adding-links-to-any-html-element */}

Using the `data-app-url` attribute you can also add a link to any HTML element. This link will only be used when the element is clicked in the app, it won't affect the behaviour when using a browser.

```html
<button data-app-url="https://domain.com">
```

A possible use case is to define a link for elements that are handled using JavaScript in browser, since in most cases the JavaScript code used in browser won't work in the app. This way the app will open a certain page when the element is clicked, otherwise it wouldn't do anything.

:::note[Notice]
Please notice that these links will always be opened in browser or embedded browser, not inside the app.
:::

The `data-app-url` attribute can also be used to define an alternate link to be used only in the app:

```html
<a href="https://domain.com" data-app-url="https://anotherdomain.com"></a>
```

When the link above is clicked in browser it will open `https://domain.com`, but when it's clicked in the app it will open `https://anotherdomain.com`.

The behaviour can be customised with the following data attributes:

- `data-app-open-in`: To change how the link is opened in the app. Please see [Opening links in an embedded browser or in an iframe](#opening-links-in-an-embedded-browser-or-in-an-iframe) to view the possible values.
- `data-app-url-confirm`: A confirmation message to be displayed before opening the link.
- `data-app-url-resume-action`: Set it to "refresh" to update the course page when the user goes back to the app. Right now this only works in the course page, but in the future it might be added to other pages. It only works for embedded browser or system browser, it doesn't work if `data-app-open-in="embedded"`.

An example using all the attributes:

```html
<button
    data-app-url="https://anotherdomain.com"
    data-app-open-in="inappbrowser"
    data-app-url-confirm="You need to enrol to the course in the browser."
    data-app-url-resume-action="refresh"
>
    Click me
</button>
```

:::note[Notice]
Please notice that students cannot add data attributes to HTML elements when using the Moodle editor, only teachers and users with the right permissions are able to add them.
:::

## Display alternative content in the app {/* #display-alternative-content-in-the-app */}

In some cases, content that works perfectly in a web browser (Moodle LMS) might not work as intended within the Moodle app. For example, certain iframes or complex embeds. Since the Moodle app version 5.1, you can now provide alternative text or links specifically for app users using two HTML attributes.

To do so, you can use the following attributes:

- `data-app-alt-msg`: The text to display inside the element. If not present, only `data-app-alt-url` will be displayed.
- `data-app-alt-url`: A clickable URL that appears after the message text.

This `data-app-alt-url` attribute can be combined with any data attribute explained in [Adding links to any HTML element](#adding-links-to-any-html-element): `data-app-open-in`, `data-app-url-confirm` and `data-app-url-resume-action`.

Since Moodle app 5.2 you can also use the following attributes:

- `data-app-alt-url-type`: Set it to "button" to display a button instead of a link.
- `data-app-alt-url-label`: The text to display in the button or the link. If not set, the URL will be displayed.

An example using several attributes:

```html
<div
    data-app-alt-url="https://videourl.com"
    data-app-alt-msg="This video is not compatible with the app. Please click the button to open it in a browser."
    data-app-alt-url-type="button"
    data-app-alt-url-label="Watch video"
    >
  <iframe src="https://videonotappcompatible.com"></iframe>
</div>
```

:::note[Notice]
Please notice that students cannot add data attributes to HTML elements when using the Moodle editor, only teachers and users with the right permissions are able to add them.
:::
