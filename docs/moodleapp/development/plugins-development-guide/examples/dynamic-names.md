---
title: Accepting dynamic names in a Web Service
tags:
  - Moodle App
---

We want to display a form where the names of the fields are dynamic, like it happens in quiz. This data will be sent to a new Web Service that we have created.

The first issue we find is that the Web Service needs to define the names of the parameters received, but in this case they're dynamic. The solution is to accept an array of objects with name and value. So in the `\_parameters()` function of our new Web Service, we will add this parameter:

```php
'data' => new external_multiple_structure(
     new external_single_structure(
        [
            'name' => new external_value(PARAM_RAW, 'data name'),
            'value' => new external_value(PARAM_RAW, 'data value'),
        ]
    ),
    'The data to be saved', VALUE_DEFAULT, []
)
```

Now we need to adapt our form to send the data as the Web Service requires it. In our template, we have a button with the `core-site-plugins-call-ws` directive that will send the form data to our Web Service. To make this work we will have to pass the parameters manually, without using the `form` attribute, because we need to format the data before it is sent.

Since we will send the parameters manually and we want it all to be sent in the same array, we will use `ngModel` to store the input data into a variable that we'll call `data`, but you can use the name you want. This variable will be an object that will hold the input data with the format "name->value". For example, if I have an input with name "a1" and value "My answer", the data object will be:

```javascript
{a1: 'My answer'}
```

So we need to add `ngModel` to all the inputs whose values need to be sent to the `data` WS param. Please notice that `ngModel` requires the element to have a name, so if you add `ngModel` to a certain element you need to add a name too. For example:

```html ng2
<ion-input name="<% name %>" [(ngModel)]="CONTENT_OTHERDATA.data['<% name %>']">)
```

As you can see, we're using `CONTENT_OTHERDATA` to store the data. We do it like this because we'll use `otherdata` to initialise the form, setting the values the user has already stored. If you don't need to initialise the form, then you can use the `dataObject` variable, an empty object that the mobile app creates for you:

```html ng2
[(ngModel)]="dataObject['<% name %>']"
```

The app has a function that allows you to convert this data object into an array like the one the WS expects: `objectToArrayOfObjects`. So in our button we'll use this function to format the data before it's sent:

```html ng2
<ion-button expand="block" type="submit" core-site-plugins-call-ws name="my_ws_name"
    [params]="{id: <% id %>, data: CoreUtilsProvider.objectToArrayOfObjects(CONTENT_OTHERDATA.data, 'name', 'value')}"
    successMessage
    refreshOnSuccess="true">
```

As you can see in the example above, we're specifying that the keys of the `data` object need to be stored in a property called "name", and the values need to be stored in a property called "value". If your Web Service expects different names you need to change the parameters of the `objectToArrayOfObjects` function.

If you open your plugin now in the app it will display an error in the JavaScript console. The reason is that the `data` variable doesn't exist inside `CONTENT_OTHERDATA`. As it is explained in previous sections, `CONTENT_OTHERDATA` holds the data that you return in `otherdata` for your method. We'll use `otherdata` to initialise the values to be displayed in the form.

If the user hasn't answered the form yet, we can initialise the `data` object as an empty object. Please remember that we cannot return arrays or objects in `otherdata`, so we'll return a JSON string.

```php
'otherdata' => ['data' => '{}'],
```

With the code above, the form will always be empty when the user opens it. But now we want to check if the user has already answered the form and fill the form with the previous values. We will do it like this:

```php
$userdata = get_user_responses(); // It will held the data in a format name->value. Example: ['a1' => 'My value'].

// ...

'otherdata' => ['data' => json_encode($userdata)],
```

Now the user will be able to see previous values when the form is opened, and clicking the button will send the data to our Web Service in array format.
