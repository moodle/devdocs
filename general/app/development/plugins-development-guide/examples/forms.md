---
title: Forms
tags:
  - Moodle App
---

In this example, we are going to see how to display a form and send the data to a Web Service when it's submitted.

First, we return the initial values of the form in `otherdata`:

```php
class mobile {

    public static function view_form($args) {
        global $OUTPUT;

        return [
            'templates' => [
                [
                    'id' => 'main',
                    'html' => $OUTPUT->render_from_template('local_hello/form', []),
                ],
            ],
            'otherdata' => [
               'name' => 'Clark Ken',
            ],
        ];
    }

}
```

In the template, we use it referencing `CONTENT_OTHERDATA`:

```html ng2
{{=<% %>=}}
<ion-item>
    <ion-input
        [label]="'plugin.local_hello.name' | translate"
        labelPlacement="stacked"
        type="text"
        [(ngModel)]="CONTENT_OTHERDATA.name"
    ></ion-input>
</ion-item>
<ion-item>
    <ion-label>
        <ion-button expand="block" color="light"
            core-site-plugins-call-ws name="local_hello_submit"
            [useOtherDataForWS]="['name']">
            {{ 'plugin.local_hello.submit | translate }}
        </ion-button>
    </ion-label>
</ion-item>
```

In the template, we are creating an input text and using `[(ngModel)]` to set the value in `name` as the initial value. In this case, the input will be set to "Clark Ken". And if the user changes the value, these changes will be applied to the `name` variable. This is called 2-way data binding in Angular.

We also add a button to send this data to a Web Service, and for that we use the [`core-site-plugins-call-ws` directive](../api-reference.md#core-site-plugins-call-ws). We use the `useOtherDataForWS` attribute to specify which variable from `otherdata` we want to include in the Web Service request. If you change the input to "Louis Lane" and press the button, you will call the Web Service `local_hello_submit` with the following parameters: `['name' => 'Louis Lane']`.

This is how you would declare the Web Service:

```php title="db/services.php"
$functions = [

    'local_hello_submit' => [
        'classname'   => 'local_hello\external\submit',
        'methodname'  => 'execute',
        'classpath'   => 'local/hello/classes/external/submit.php',
        'description' => 'Submit a form',
        'type'        => 'write',
        'ajax'        => true,
        'services'    => [MOODLE_OFFICIAL_MOBILE_SERVICE],
    ],

];
```

```php title="classes/external/submit.php"
class submit extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'name' => new external_value(PARAM_RAW_TRIMMED, 'Name'),
        ]);
    }

    public static function execute($name) {
        $validatedparams = self::validate_parameters(self::execute_parameters(), compact('name'));
        [$name] = array_values($validatedparams);

        return ['message' => "Hello, $name!"];
    }

    public static function execute_returns(): external_description {
        return new external_single_structure([
            'message' => new external_value(PARAM_RAW, 'Message'),
        ]);
    }

}
```

## Using `params`

We can also achieve the same result using the `params` attribute of the `core-site-plugins-call-ws` directive instead of using `useOtherDataForWS`:

```html ng2
<ion-button expand="block" color="light"
    core-site-plugins-call-ws name="local_hello_submit"
    [params]="{name: CONTENT_OTHERDATA.name}">
    {{ 'plugin.local_hello.submit | translate }}
</ion-button>
```

## Using `form`

This could also be done without using `otherdata`, with the `form` attribute for the `core-site-plugins-call-ws` directive. However, keep in mind that you'd still need to use `otherdata` to set the initial value of the inputs.

In this example, we're not using `otherdata` at all, so the input will be empty by default:

```html ng2
{{=<% %>=}}
<form id="name-form">
    <ion-item>
        <ion-input
            [label]="'plugin.local_hello.name' | translate"
            labelPlacement="stacked"
            name="name"
            type="text"
        ></ion-input>
    </ion-item>
    <ion-item>
        <ion-label>
            <ion-button expand="block" color="light"
                core-site-plugins-call-ws name="local_hello_submit"
                form="name-form">
                {{ 'plugin.local_hello.submit | translate }}
            </ion-button>
        </ion-label>
    </ion-item>
</form>
```

## Using `core-rich-text-editor`

In some forms, you may want to use the [`core-rich-text-editor` component](../api-reference.md#core-rich-text-editor) for writing formatted content. However, you should be aware of some intricacies.

First of all, using the `[(ngModel)]` approach will not work. Instead, you have to define a [FormControl](https://angular.io/api/forms/FormControl):

```js title="JavaScript"
this.nameControl = this.FormBuilder.control(this.CONTENT_OTHERDATA.name);
```

```html ng2 title="Template"
<core-rich-text-editor placeholder="{{ 'plugin.local_hello.name | translate }}" [control]="nameControl">
</core-rich-text-editor>

...

<ion-button expand="block" color="light"
    core-site-plugins-call-ws name="local_hello_submit"
    [params]="{ name: nameControl.value }">
    {{ 'plugin.local_hello.submit | translate }}
</ion-button>
```

Notice how we're passing `nameControl.value` in `params`, rather than using `useOtherDataForWS`. In this case, the value of `CONTENT_OTHERDATA.name` is only used to initialize the content in the editor, but it won't be updated when the text changes.

If you are using the second approach, including inputs in a `<form>` and using the `form` attribute, it should work as expected:

```html ng2
<core-rich-text-editor placeholder="{{ 'plugin.local_hello.name | translate }}" name="name">
</core-rich-text-editor>
```

## Sending dynamic data

In some situations, you may need to submit dynamic data. This means that field names won't always be the same, this happens for example in quiz forms.

One challenge with this approach is that Moodle Web Services don't accept dynamic parameters, so we'll need to send them in an array of objects with the field names and values:

```php title="classes/external/submit.php"
public static function execute_parameters(): external_function_parameters {
    return new external_single_structure([
        'data' => new external_multiple_structure(
            new external_single_structure(
                [
                    'name' => new external_value(PARAM_RAW, 'data name'),
                    'value' => new external_value(PARAM_RAW, 'data value'),
                ],
            ),
            'Form data',
            VALUE_DEFAULT,
            [],
        ),
    ]);
}
```

Once we've done that, we'll need to change our form to use the new data structure in submissions. The only way to do that is using the `params` attribute. One helper you may find useful is `CoreUtilsProvider.objectToArrayOfObjects`, which will transform an object with name/value pairs into an array of objects using the format we declared in the Web Service:

```html ng2
<ion-button expand="block" color="light"
    core-site-plugins-call-ws name="local_hello_submit"
    [params]="{
        data: CoreUtilsProvider.objectToArrayOfObjects(
            { name: CONTENT_OTHERDATA.name },
            'name',
            'value'
        )
    }">
    {{ 'plugin.local_hello.submit | translate }}
</ion-button>
```

As you can see, the second and third arguments for the `CoreUtilsProvider.objectToArrayOfObjects` method indicate the field names for the objects array.

This can now be used to send any fields that you want, even if they are not declared beforehand in the Web Service.
