---
title: Moodle App Notification Links
sidebar_label: Notification links
sidebar_position: 3
tags:
 - Moodle App
---

Push notifications will open the app when clicked, and you can customize which page is open by default.

The easiest way to achieve it is to include a `contexturl` property in your notification. Notice that using this property, the url will also be displayed when you see the notification in the web. You can override this behaviour in the app using `appurl` within `customdata`:

```php
$notification->customdata = [
    'appurl' => $myurl->out(),
];
```

The url will be handled using the default [link handling](./app-links.md) in the app. If you want to implement some custom behaviour when opening notifications, you can achieve it with a Site Plugin implementing a [CorePushNotificationsDelegate](../plugins-development-guide/api-reference.md#corepushnotificationsdelegate) handler.
