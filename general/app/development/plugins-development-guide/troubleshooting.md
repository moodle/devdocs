---
title: Troubleshooting Moodle App Plugins Development
sidebar_label: Troubleshooting
sidebar_position: 3
tags:
 - Moodle App
---

## Plugin changes are not picked up in the app

Remember to go through the list of tips in the [Seeing plugin changes in the app](./index.md#seeing-plugin-changes-in-the-app) section.

## Invalid response received

You might get this error when using the [core-site-plugins-call-ws](./api-reference.md#core-site-plugins-call-ws) directive or similar.

By default, the app expects all Web Service calls to return an object. If your Web Service returns another type, you need to specify it using the `preSets` attribute in the directive.

For example, if your Web Service returns a boolean you should specify it like this:

```html ng2
<ion-button core-site-plugins-call-ws name="local_sample_submit" [preSets]="{ typeExpected: 'boolean' }">
    {{ 'plugin.local_sample.submit' | translate }}
</ion-button>
```

Similarly, if the Web Service returns `null` you need to tell the app not to expect any result using `preSets`:

```html ng2
<ion-button core-site-plugins-call-ws name="local_sample_submit" [preSets]="{ responseExpected: false }">
    {{ 'plugin.local_sample.submit' | translate }}
</ion-button>
```

## I can't return an object or array in `otherdata`

If you try to return an object or an array in any field inside `otherdata` in [content responses](./api-reference.md#content-responses), the Web Service call will fail with the following error:

```text
Scalar type expected, array or object received
```

Each field in `otherdata` must be a string, number or boolean; it cannot be an object or array. If you need to send complex values, you can use `json_encode`:

```php
'otherdata' => ['data' => json_encode($data)],
```

The app will parse the string and it will be available as an array or object.
