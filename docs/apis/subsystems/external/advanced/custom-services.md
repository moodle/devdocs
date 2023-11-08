---
title: Service creation
tags:
  - Web Services
  - core_external
  - external
  - API
---

Moodle comes with two built-in services that your functions can be attached to.

In rare situations, you may need to create a create a _custom_ service declaration.

The recommended way of creating a new _service_ declaration is by placing it into the `db/services.php` file as a new service declaration.

Moodle Administrators can also manually create a service declaration using the web interface.

This is an advanced feature and, in most cases, _you will not need to use this feature_.

:::note

Whilst writing a service declaration is _optional_, if you do not create a service declaration, then the Moodle administrator will have to create one manually through the Web UI.

If you define a web service here, then the administrator cannot add or remove any function from it.

:::

## Declaring a custom service declaration

Service declarations should be placed in the `db/services.php` file of your plugin (after function declaration), for example `local/groupmanager/db/services.php`.

```php title="local/groupmanager/db/services.php"
$services = [
    // The name of the service.
    // This does not need to include the component name.
    'myintegration' => [

        // A list of external functions available in this service.
        'functions' => [
            'local_groupmanager_create_groups',
        ],

        // If set, the external service user will need this capability to access
        // any function of this service.
        // For example: 'local_groupmanager/integration:access'
        'requiredcapability' => 'local_groupmanager/integration:access',

        // If enabled, the Moodle administrator must link a user to this service from the Web UI.
        'restrictedusers' => 0,

        // Whether the service is enabled by default or not.
        'enabled' => 1,

        // This field os optional, but requried if the `restrictedusers` value is
        // set, so as to allow configuration via the Web UI.
        'shortname' =>  '',

        // Whether to allow file downloads.
        'downloadfiles' => 0,

        // Whether to allow file uploads.
        'uploadfiles'  => 0,
    ]
];
```

:::note

It is not possible for an administrator to add/remove any function from a pre-built service.

:::
