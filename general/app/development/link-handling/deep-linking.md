---
title: Moodle App Deep Linking
sidebar_label: Deep linking
sidebar_position: 2
tags:
 - Moodle App
---

## Overview

The Moodle App supports being launched using a Custom URL Scheme. It lets you specify the URL to open, the username to use and also a token to authenticate the user.

Please notice that these links will only work if the app is installed in the device. For example, if you click one of these links in Safari in an iOS device without the app installed, an error will be displayed.

If you are using a custom Moodle App you have to change `moodlemobile://` to your custom URL scheme. If you are using a [BMA (Branded Moodle App)](https://moodle.com/branded-app), please contact your [Moodle Service Provider (Moodle partner)](https://moodle.com/services) for this information.

## Format

The format to create the links is the following:

```text
moodlemobile://https://username@domain.com?token=TOKEN&privatetoken=PRIVATETOKEN&redirect=http://domain.com/course/view.php?id=2
```

The only data required is the base URL of your site (in the example above, `https://domain.com`).

### Site URL

As mentioned above, this is the only required parameter. It should be the base URL of the site (wwwroot). For example, you can use this URL to open your site in the app:

```text
moodlemobile://https://domain.com
```

In the example above, if the `https://domain.com` site isn't stored in the app, the user will be redirected to the credentials screen to access the site.

### Username

If you want the app to be opened with a certain username you can specify it in the URL:

```text
moodlemobile://https://username@domain.com
```

In the example above, if the `username` user and the `https://domain.com` site aren't stored in the app, the user will be sent to the credentials screen to access the site (the username input will be pre-populated, but the user will be able to change it if he wants to). If the app has several users of this site stored, including "username", the right user will be loaded.

### Token and Private token

If you specify a token in the URL, the user will be authenticated automatically in the app. This is really useful for external apps and systems. For example, you can use this feature for SSO systems. The user token can be found in the database table `mdl_external_tokens`.

The private token is used by the app to auto-login the user in the browser, and it will only be used if you also specify a token in the URL. If you specify a private token but not a token, the private token will be ignored. The private token can also be found in the database table `mdl_external_tokens`.

It isn't recommended to include the token and private token in links that will be rendered by a browser or apps that can be inspected. Please notice that anyone with the token will be able to authenticate as the user the token belongs to.

Example:

```text
moodlemobile://https://domain.com?token=TOKEN&privatetoken=PRIVATETOKEN
```

The token has priority over the username parameter. For example, if you specify username "u1" but the token belongs to user "u2", the user u2 will be authenticated in the app.

### Redirect

The redirect parameter indicates which page you want to open in the app:

```text
moodlemobile://https://domain.com?redirect=http://domain.com/course/view.php?id=2
```

This link will open the course with id 2 in the app. Please notice that the app doesn't support all Moodle URLs, only some of them are supported.

The redirect URL should belong to the same site as the base URL. For example, if the base URL is `http://domain.com` but the redirect is `http://anothersite.com/...`, an error will be displayed.

The redirect parameter can be a relative URL based on the base URL. The example above can also be written like this:

```text
moodlemobile://https://domain.com?redirect=/course/view.php?id=2
```

## See also

- [Custom URL Scheme Cordova plugin used by the app](https://github.com/EddyVerbruggen/Custom-URL-scheme).
