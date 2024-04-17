---
title: Function Definitions
tags:
  - Web Services
  - API
  - core_external
  - external
sidebar_position: 2
---

An External function _definition_ is the class, and collection of functions, used to define:

- any parameters that the function expects to take, including any types
- what the function will return, including any types
- whether the function has been deprecated, or not

It also includes the code that will actually be executed by the function.

The function definition should be located within the `external` namespace of a component.

:::info Example

For a component named `local_groupmanager` located in `local/groupmanager` which is responsible for creating groups on request, you may have:

- a Web service function named: `local_groupmanager_create_groups`
- defined in a class named `local_groupmanager\external\create_groups`
- which is located `local/groupmanager/classes/external/create_groups.php`

:::

A service definition:

- _must_ extend the `\core_external\external_api` class
- _must_ declare an `execute_parameters` function to describe the expected parameters of the function
- _must_ declare an `execute` function which is called with the functions and performs the expected actions
- _must_ declare an `execute_returns` function to describe the values returned by the function
- _may_ declare an `execute_is_deprecated` function to declare a function as deprecated

<Since version="4.2" issueNumber="MDL-76583" />

:::caution Writing plugins supporting Multiple Moodle versions

The External API subsystem was restructured in Moodle 4.2 and moved from classes within a manually-required file, to autoloaded and namespaced classes.

If you are developing a plugin whose codebase is used or tested in multiple Moodle versions, including older versions of Moodle, then you:

- _must_ `require_once` the `lib/externallib.php` file
- _must_ extend the `external_api` class instead of `\core_external\external_api`

This will allow your plugin to continue working without deprecation notices or failures.

Please note that deprecation notices will be added to this pathway from Moodle 4.6 onwards.

:::

### An example definition

```php title="local/groupmanager/classes/external/create_groups.php"
<?php

namespace local_groupmanager\external;

use external_function_parameters;
use external_multiple_structure;
use external_single_structure;
use external_value;

class create_groups extends \core_external\external_api {
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'groups' => new external_multiple_structure(
                new external_single_structure([
                    'courseid'  => new external_value(PARAM_INT, 'The course to create the group for'),
                    'idnumber'    => new external_value(
                        PARAM_RAW,
                        'An arbitrary ID code number perhaps from the institution',
                        VALUE_DEFAULT,
                        null
                    ),
                    'name' => new external_value(
                        PARAM_RAW,
                        'The name of the group'
                    ),
                    'description' => new external_value(
                        PARAM_TEXT,
                        'A description',
                        VALUE_OPTIONAL
                    ),
                ]),
                'A list of groups to create'
            ),
        ]);
    }

    public static function execute(array $groups): array {
        // Validate all of the parameters.
        [
            'groups' => $groups,
        ] = self::validate_parameters(self::execute_parameters(), [
            'groups' => $groups,
        ]);

        // Perform security checks, for example:
        $coursecontext = \context_course::instance($courseid);
        self::validate_context($coursecontext);
        require_capability('moodle/course:creategroups', $coursecontext);

        // Create the group using existing Moodle APIs.
        $createdgroups = \local_groupmanager\util::create_groups($groups);

        // Return a value as described in the returns function.
        return [
            'groups' => $createdgroups,
        ];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure(
            'groups' => new external_multiple_structure([
                'id' => new external_value(PARAM_INT, 'Id of the created user'),
                'name' => new external_value(PARAM_RAW, 'The name of the group'),
            ])
        );
    }
}
```

:::note

Available parameter types are defined in `lib/moodlelib.php` and are used by the `validate_parameters()` function and during return value checking to ensure that the service is called and working as defined.

:::

## See also

- [Core APIs](../../../apis.md)
- [Web services API](./writing-a-service.md)
