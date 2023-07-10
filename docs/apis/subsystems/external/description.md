---
title: Function Declarations
tags:
  - Web Services
  - core_external
  - external
  - API
sidebar_position: 1
---

Before they can be used, all functions must be _declared_ to Moodle, and their inputs and outputs must be _defined_.

- Functions are _declared_ by noting them in the `db/services.php` file for a plugin.
- Functions are _defined_ within their own class located within the `\component\external` namespace of a component.

Note that there is a strict [naming convention for external service functions](https://moodledev.io/general/development/policies/naming#web-services).

Function implementation classes consist of one class containing a number of functions, some of which are mandatory.

During a Moodle installation or upgrade, the service and function _declarations_ are parsed by a service discovery process and stored within the database. An administrative UI may be used to change _some_ configuration details of these declarations.

## Service declarations

Each component wishing to create an external service function must declare that the function exists by describing it in the `db/services.php` file for that component.

This information is stored internally within Moodle, and collected as part of the service discovery during installation and upgrade.

```php title="local/groupmanager/db/services.php"
$functions = [
    // The name of your web service function, as discussed above.
    'local_myplugin_create_groups' => [
        // The name of the namespaced class that the function is located in.
        'classname'   => 'local_groupmanager\external\create_groups',

        // A brief, human-readable, description of the web service function.
        'description' => 'Creates new groups.',

        // Options include read, and write.
        'type'        => 'write',

        // Whether the service is available for use in AJAX calls from the web.
        'ajax'        => true,

        // An optional list of services where the function will be included.
        'services'    => [
            // A standard Moodle install includes one default service:
            // - MOODLE_OFFICIAL_MOBILE_SERVICE.
            // Specifying this service means that your function will be available for
            // use in the Moodle Mobile App.
            MOODLE_OFFICIAL_MOBILE_SERVICE,
        ],
    ),
);
```

<details>
<summary>Advanced options</summary>

A number of advanced options are also available, as described below:

```php title="local/groupmanager/db/services.php"
$functions = [
    // The name of your web service function, as discussed above.
    'local_myplugin_create_groups' => [
        // A comma-separated list of capabilities used by the function.
        // This is advisory only and used to indicate to the administrator
        // configuring a custom service definition.
        'capabilities' => 'moodle/course:creategroups,moodle/course:managegroups',

        // The following parameters are also available, but are no longer recommended.

        // The name of the external function name.
        // If not specified, this will default to 'execute'.
        'methodname'  => 'execute',

        // The file containing the class/external function.
        // Do not use if using namespaced auto-loading classes.
        'classpath'   => 'local/groupmanager/externallib.php',
    ),
);
```

</details>

The function name is arbitrary, but must follow [the naming convention](https://docs.moodle.org/dev/Web_service_API_functions#Naming_convention). This helps ensure that it is globally unique.
