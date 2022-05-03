---
title: Troubleshooting on Moodle App Plugins development guide
sidebar_label: Troubleshooting
sidebar_position: 2
tags:
 - Moodle App
---

## Invalid response received

You might receive this error when using the `core-site-plugins-call-ws` directive or similar. By default, the app expects all Web Service calls to return an object, if your Web Service returns another type (string, boolean, etc.) then you need to specify it using the `preSets` attribute of the directive. For example, if your WS returns a boolean value, then you should specify it like this:

```html ng2
[preSets]="{typeExpected: 'boolean'}"
```

In a similar way, if your Web Service returns `null` you need to tell the app not to expect any result using `preSets`:

```html ng2
[preSets]="{responseExpected: false}"
```

## Values of `ion-radio`, `ion-checkbox` or `ion-select` aren't sent to my WS

Some directives allow you to specify a form id or name to send the data from the form to a certain WS. These directives look for HTML inputs to retrieve the data to send. However, `ion-radio`, `ion-checkbox` and `ion-select` don't use HTML inputs, they simulate them, so the directive isn't going to find their data and so it won't be sent to the Web Service.

There are 2 workarounds to fix this problem.

### Sending the data manually

The first solution is to send the missing params manually using the `params` property. We will use `ngModel` to store the input value in a variable, and this variable will be passed to the parameters. Please notice that `ngModel` requires the element to have a name, so if you add `ngModel` to a certain element you need to add a name too.

For example, if you have a template like this:

```html ng2
<ion-list radio-group name="responses">
    <ion-item>
        <ion-label>First value</ion-label>
        <ion-radio value="1"></ion-radio>
    </ion-item>
</ion-list>

<ion-button expand="block" type="submit" core-site-plugins-call-ws name="myws" [params]="{id: <% id %>}" form="myform">
    {{ 'plugin.mycomponent.save' | translate }}
</ion-button>
```

Then you should modify it like this:

```html ng2
<ion-list radio-group [(ngModel)]="responses">
    <ion-item>
        <ion-label>First value</ion-label>
        <ion-radio value="1"></ion-radio>
    </ion-item>
</ion-list>

<ion-button expand="block" type="submit" core-site-plugins-call-ws name="myws" [params]="{id: <% id %>, responses: responses}" form="myform">
    {{ 'plugin.mycomponent.save' | translate }}
</ion-button>
```

Basically, you need to add `ngModel` to the affected element (in this case, the `radio-group`). You can put whatever name you want as the value, we used "responses". With this, every time the user selects a radio button the value will be stored in a variable called "responses". Then, in the button we are passing this variable to the parameters of the Web Service.

Please notice that the `form` attribute has priority over `params`, so if you have an input with `name="responses"` it will override what you're manually passing to `params`.

### Using a hidden input

Since the directive is looking for HTML inputs, you need to add one with the value to send to the server. You can use `ngModel` to synchronise your radio/checkbox/select with the new hidden input. Please notice that `ngModel` requires the element to have a name, so if you add `ngModel` to a certain element you need to add a name too.

For example, if you have a radio button like this:

```html ng2
<div radio-group name="responses">
    <ion-item>
        <ion-label>First value</ion-label>
        <ion-radio value="1"></ion-radio>
    </ion-item>
</div>
```

Then you should modify it like this:

```html ng2
<div radio-group name="responses" [(ngModel)]="responses">
    <ion-item>
        <ion-label>First value</ion-label>
        <ion-radio value="1"></ion-radio>
    </ion-item>

    <ion-input type="hidden" [ngModel]="responses" name="responses"></ion-input>
</div>
```

In the example above, we're using a variable called "responses" to synchronise the data between the `radio-group` and the hidden input. You can use whatever name you want.

## I can't return an object or array in `otherdata`

If you try to return an object or an array in any field inside `otherdata`, the Web Service call will fail with the following error:

```text
Scalar type expected, array or object received
```

Each field in `otherdata` must be a string, number or boolean; it cannot be an object or array. To make it work, you need to encode your object or array into a JSON string:

```php
'otherdata' => ['data' => json_encode($data)],
```

The app will automatically parse this JSON and convert it back into an array or object.
