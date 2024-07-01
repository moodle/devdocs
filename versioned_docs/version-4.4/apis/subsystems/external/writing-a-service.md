---
title: Writing a new service
tags:
  - Web Services
  - Plugins
  - core_external
  - external
sidebar_position: 5
---

This documentation covers the creation of a new external service for use in a web service of a fictional local plugin, `local_groupmanager`.

## Functional specification

The `local_groupmanager` plugin has a need to create groups within a course and would like to do so using its own web service.

:::important

When defining a new service definition, Moodle requires that the name of the definition be in the form:

```sh
[frankenstyle_component]_[methodname]
```

The [naming convention](https://moodledev.io/general/development/policies/naming#web-services) further dictates that the `methodname` component be in the form:

```sh
[methodname]  - The name of the method in the form of [verb]_[noun]
[verb]        - Usually one of get, create, delete, update
                A similar verb that well describes the action may also be used
[noun]        - The object being modified
                Usually in Plural form
```

:::

Per the Moodle naming convention for web services the name of the function should be:

```
local_groupmanager_create_groups
```

### Inputs

The `local_groupmanager_create_groups` external service definition will take a list of _groups_ as its only parameters.

### Outputs

The service will return a list of the created groups, including the `id` element of those groups.

### Exceptions and failures

If _any_ group creation fails, the function will throw an exception, and no groups will be created.

## Technical specification

- **the core function the external function will call**: `groups_create_group()` from [/group/lib.php](http://github.com/moodle/moodle/tree/main/moodle/group/lib.php).
- **the parameter types**: a list of object. This object are groups, with `id`/`name`/`courseid`.
- **the returned value types**: a list of objects (groups) with their id.
- **the user capabilities to check**: `moodle/course:managegroups`

## Declare the web service function

An external function must be declared before it can be used in your plugin.
Function declarations should be placed in the `db/services.php` file of your plugin. For example in our fictitious plugin this would be located in `local/groupmanager/db/services.php`.

```php
$functions = [
    // The name of your web service function, as discussed above.
    'local_groupmanager_create_groups' => [
        // The name of the namespaced class that the function is located in.
        'classname'   => 'local_groupmanager\external\create_groups',

        // A brief, human-readable, description of the web service function.
        'description' => 'Creates new groups.',

        // Options include read, and write.
        'type'        => 'write',

        // Whether the service is available for use in AJAX calls from the web.
        'ajax'        => true,

        // An optional list of services where the function will be included.
        'services' => [
            // A standard Moodle install includes one default service:
            // - MOODLE_OFFICIAL_MOBILE_SERVICE.
            // Specifying this service means that your function will be available for
            // use in the Moodle Mobile App.
            MOODLE_OFFICIAL_MOBILE_SERVICE,
        ]
    ],
];
```

<details>
<summary>Advanced options</summary>

A number of advanced options are also available, as described below:

```php
$functions = [
    // The name of your web service function, as discussed above.
    'local_groupmanager_create_groups' => [
        // A comma-separated list of capabilities used by the function.
        // This is advisory only and used to indicate to the administrator configuring a custom service definition.
        'capabilities' => 'moodle/course:creategroups,moodle/course:managegroups',

        // The following parameters are also available, but are no longer recommended.

        // The name of the external function name.
        // If not specified, this will default to 'execute'.
        // 'methodname'  => 'execute',

        // The file containing the class/external function.
        // Do not use if using namespaced auto-loading classes.
        // 'classpath'   => 'local/groupmanager/externallib.php',
    ),
);
```

</details>

## Write the external function descriptions

Every web service function is mapped to an external function. External function are described in the [External functions API](./functions.md).
Each external function is written with two other functions describing the parameters and the return values. These description functions are used by web service servers to:

- validate the web service function parameters
- validate the web service function returned values
- build WSDL files or other protocol documents

These two description functions are located in the class declared in `local/groupmanager/db/services.php`.

Thus for the web service function `local_groupmanager_create_groups()`, we should write a class named `create_groups` in the `local_groupmanager\external` namespace.

This will be located in the file `local/groupmanager/classes/external/create_groups.php`. The class will contain:

- `execute(...)`
- `execute_parameters()`
- `execute_return()`

### Defining parameters

```php
<?php
namespace local_groupmanager\external;

use external_function_parameters;
use external_multiple_structure;
use external_single_structure;
use external_value;

class create_groups extends \core_external\external_api {

    /**
     * Returns description of method parameters
     * @return external_function_parameters
     */
    public static function execute_parameters() {
        return new external_function_parameters([
            'groups' => new external_multiple_structure(
                new external_single_structure([
                    'courseid' => new external_value(PARAM_INT, 'id of course'),
                    'name' => new external_value(
                        PARAM_TEXT,
                        'multilang compatible name, course unique'
                    ),
                    'description' => new external_value(
                        PARAM_RAW,
                        'group description text'
                    ),
                    'enrolmentkey' => new external_value(
                        PARAM_RAW,
                        'group enrol secret phrase'
                    ),
                ])
            )
        ]);
    }
}
```

A web service function without parameters will have a parameter description function like that:

```php
/**
 * Returns description of method parameters
 * @return external_function_parameters
 */
public static function execute_parameters(): external_function_parameters {
    return new external_function_parameters([
        // If this function had any parameters, they would be described here.
        // This example has no parameters, so the array is empty.
    ]);
}
```

A parameter can be described as:

- a list => `external_multiple_structure`
- an object => `external_single_structure`
- a primary type => `external_value`

Our `create_groups()` function expects one parameter named `groups`, so we will first write:

```php
/**
 * Returns description of method parameters
 * @return external_function_parameters
 */
public static function execute_parameters(): external_function_parameters {
    return new external_function_parameters([
        'groups' => ...
    ]);
}
```

This *groups* parameter is a list of group. So we will write :

```php
'groups' => new external_multiple_structure(
    ...
)
```

An external_multiple_structure object (list) can be constructed with:

- `external_multiple_structure` (list)
- `external_single_structure` (object)
- `external_value` (primary type).

For our function it will be a `external_single_structure`:

```php
new external_single_structure([
    'courseid' => ...,
    'name' => ...,
    'description' => ...,
    'enrolmentkey' => ...,
])
```

Thus we obtain :

```php
'groups' => new external_multiple_structure(
    new external_single_structure([
        'courseid' => ...,
        'name' => ...,
        'description' => ...,
        'enrolmentkey' => ...,
    ])
)
```

Each group values is a *external_value* (primary type):

- `courseid` is an integer
- `name` is a string (text only, not tag)
- `description` is a string (can be anything)
- `enrolmentkey` is also a string (can be anything)

We add them to the description :

```php
'groups' => new external_multiple_structure(
    new external_single_structure([
        // The second argument is a human readable description text.
        // This text is displayed in the automatically generated documentation.
        'courseid' => new external_value(PARAM_INT, 'id of course'),
        'name' => new external_value(PARAM_TEXT, 'multilang compatible name, course unique'),
        'description' => new external_value(PARAM_RAW, 'group description text'),
        'enrolmentkey' => new external_value(PARAM_RAW, 'group enrol secret phrase'),
    ])
)
```

### execute_returns()

It's similar to execute_parameters(), but instead of describing the parameters, it describes the return values.

```php
public static function execute_returns() {
    return new external_multiple_structure(
        new external_single_structure([
            'id' => new external_value(PARAM_INT, 'group record id'),
            'courseid' => new external_value(PARAM_INT, 'id of course'),
            'name' => new external_value(PARAM_TEXT, 'multilang compatible name, course unique'),
            'description' => new external_value(PARAM_RAW, 'group description text'),
            'enrolmentkey' => new external_value(PARAM_RAW, 'group enrol secret phrase'),
        ])
    );
}
```

### Required, Optional or Default value

A value can be `VALUE_REQUIRED`, `VALUE_OPTIONAL`, or `VALUE_DEFAULT`. If not mentioned, a value is `VALUE_REQUIRED` by default.

```php
'yearofstudy' => new external_value(PARAM_INT, 'year of study', VALUE_DEFAULT, 1979),
```

- `VALUE_REQUIRED` - if the value is not supplied => the server throws an error message
- `VALUE_OPTIONAL` - if the value is not supplied => the value is ignored. Note that VALUE_OPTIONAL can't be used in top level parameters, it must be used only within array/objects key definition. If you need top level Optional parameters you should use VALUE_DEFAULT instead.
- `VALUE_DEFAULT` - if the value is not supplied => the default value is used

:::caution

Because some web service protocols are strict about the number and types of arguments - it is not possible to specify an optional parameter as one of the top-most parameters for a function.

<InvalidExample>

```php
public static function get_biscuit_parameters() {
    return new external_function_parameters([
        'chocolatechips' => new external_value(
            PARAM_BOOL,
            'if biscuit contains chocolate chips',
            VALUE_REQUIRED
        ),
        'glutenfree' => new external_value(
            type: PARAM_BOOL,
            required: VALUE_DEFAULT,
            default: false,
            allownull: false
        ),
        // ERROR! top level optional parameter!!!
        'icingsugar' => new external_value(
            PARAM_BOOL,
            'if biscuit has icing sugar on top',
            VALUE_OPTIONAL
        ),
    ]);
}
```

</InvalidExample>

<ValidExample>

```php
public static function get_biscuit_parameters() {
    return new external_function_parameters([
        'ifeellike' => new external_single_structure([
                'chocolatechips' => new external_value(
                    PARAM_BOOL,
                    'if biscuit contains chocolate chips',
                    VALUE_REQUIRED
                ),
                'glutenfree' => new external_value(
                    type: PARAM_BOOL,
                    required: VALUE_DEFAULT,
                    default: false,
                    allownull: false
                ),
                // ALL GOOD!! We have nested the params in an external_single_structure.
                'icingsugar' => new external_value(
                    PARAM_BOOL,
                    'if biscuit has icing sugar on top',
                    VALUE_OPTIONAL
                ),
        ]),
    ]);
}
```

</ValidExample>

:::

## Implement the external function

We declared our web service function and we defined the external function parameters and return values. We will now implement the external function:

```php
    /**
     * Create groups
     * @param array $groups array of group description arrays (with keys groupname and courseid)
     * @return array of newly created groups
     */
    public static function execute($groups) {
        global $CFG, $DB;
        require_once("$CFG->dirroot/group/lib.php");

        $params = self::validate_parameters(self::execute_parameters(), ['groups' => $groups]);

        $transaction = $DB->start_delegated_transaction(); //If an exception is thrown in the below code, all DB queries in this code will be rollback.

        $groups = array();

        foreach ($params['groups'] as $group) {
            $group = (object)$group;

            if (trim($group->name) == '') {
                throw new invalid_parameter_exception('Invalid group name');
            }
            if ($DB->get_record('groups', ['courseid' => $group->courseid, 'name' => $group->name])) {
                throw new invalid_parameter_exception('Group with the same name already exists in the course');
            }

            // now security checks
            $context = get_context_instance(CONTEXT_COURSE, $group->courseid);
            self::validate_context($context);
            require_capability('moodle/course:managegroups', $context);

            // finally create the group
            $group->id = groups_create_group($group, false);
            $groups[] = (array) $group;
        }

        $transaction->allow_commit();

        return $groups;
    }
```

### Parameter validation

```php
$params = self::validate_parameters(self::execute_parameters(), [
    'groups' => $groups,
]);
```

This *validate_parameters* function validates the external function parameters against the description. It will return an exception if some required parameters are missing, if parameters are not well-formed, and check the parameters validity. It is essential that you do this call to avoid potential hack.

**Important:** the parameters of the external function and their declaration in the description **must be the same order**. In this example we have only one parameter named $groups, so we don't need to worry about the order.

### Context and Capability checks

```php
// Perform security checks.
$context = context_course::instance($group->courseid);
self::validate_context($context);
require_capability('moodle/course:managegroups', $context);
```

Note: validate_context() is required in all external functions before operating on any data belonging to a context. This function does sanity and security checks on the context that was passed to the external function - and sets up the global $PAGE and $OUTPUT for rendering return values. Do NOT use require_login(), or $PAGE->set_context() in an external function.

### Exceptions

You can throw exceptions. These are automatically handled by Moodle web service servers.

```php
// Note: It is good practice to add detailled information in $debuginfo,
//       and only send back a generic exception message when Moodle DEBUG mode < NORMAL.
//       It's what we do here throwing the invalid_parameter_exception($debug) exception
throw new invalid_parameter_exception('Group with the same name already exists in the course');
```

### Correct return values

The return values will be validated by the Moodle web service servers:

- return values contain some values not described => these values will be skipped.
- return values miss some required values (VALUE_REQUIRED) => the server will return an error.
- return values types don't match the description (int != PARAM_ALPHA) => the server will return an error
**Note:** cast all your returned objects into arrays.

## Bump the plugin version

Edit your `local/groupmanager/version.php` and increase the plugin version. This should trigger a Moodle upgrade and the new web service should be available in the administration (*Administration > Plugins > Web Services > Manage services*)

## Deprecation

External functions deprecation process is slightly different from the standard deprecation. If you are interested in deprecating any of your external functions you should **also** (apart from the applicable points detailed in the [standard deprecation docs](/general/development/policies/deprecation)) create a `FUNCTIONNAME_is_deprecated()` method in your external function class. Return true if the external function is deprecated. This is an example:

```php
    /**
     * Mark the function as deprecated.
     * @return bool
     */
    public static function execute_is_deprecated() {
        return true;
    }
```

## See also

- [Web services developer documentation](./index.md)
- [Web services user documentation](https://docs.moodle.org/en/Web_services)
- [Implement a web service client](https://docs.moodle.org/dev/Creating_a_web_service_client)
- Code example: [Adding a web service, using APIs](https://gist.github.com/timhunt/51987ad386faca61fe013904c242e9b4) by (Tim Hunt)
Specification:
- [External services security](./security.md)
- [External services description](./description.md)
- [Session locks#Read only sessions in web services](https://docs.moodle.org/dev/Session_locks#Read_only_sessions_in_web_services)
