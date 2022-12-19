---
title: Writing a new service
tags:
  - Web Services
  - Plugins
  - core_external
  - external
---
{{Moodle_2.0}}

# Quick start

## File structure

The file structure is explained in these two documents:

- [Web services API](https://docs.moodle.org/dev/Web_services_API)
- [External function API](./functions.md)

# Tutorial

We will create a web service into a local plugin. This service will contain one *local_myplugin_create_groups($groups)* web service function. This web service function will create a group into a Moodle course.

## Write the specification documentation

Before starting coding, let's identify our needs writing some short specification documents.

### functional specification

*local_myplugin_create_groups($groups)* will take a list of groups as parameters and it will return the same groups with their newly created id. If ever one group creation fails, the function will throw an exception, and no creation will happen.

### technical specification

- **the core function the external function will call**: *groups_create_group()* from [/group/lib.php](http://cvs.moodle.org/moodle/group/).
- **the parameter types**: a list of object. This object are groups, with id/name/courseid.
- **the returned value types**: a list of objects (groups) with their id.
- **the user capabilities to check**: *moodle/course:managegroups*

## Write a simple test client

The first thing you should code is a web service test client. You will often discover use cases that you didn't think about. We are not showing any test client code here, see [How to create a web service client](https://docs.moodle.org/dev/Creating_a_web_service_client).

## Declare the service

This step is optional. You can pre-build a service including any web service functions, so the Moodle administrator doesn't need to do it. Add into /local/myplugin/db/services.php:

```php
  $services = array(
      'mypluginservice' => array(                                                // the name of the web service
          'functions' => array ('local_myplugin_create_groups'), // web service functions of this service
          'requiredcapability' => '',                // if set, the web service user need this capability to access 
                                                                              // any function of this service. For example: 'some/capability:specified'                 
          'restrictedusers' => 0,                                             // if enabled, the Moodle administrator must link some user to this service
                                                                              // into the administration
          'enabled' => 1,                                                       // if enabled, the service can be reachable on a default installation
          'shortname' =>  '',       // optional – but needed if restrictedusers is set so as to allow logins.
          'downloadfiles' => 0,    // allow file downloads.
          'uploadfiles'  => 0      // allow file uploads.
       )
  );
```

Note: it is not possible for an administrator to add/remove any function from a pre-built service.

## Declare the web service function

Following the [Web service API](https://docs.moodle.org/dev/Web_services_API), you must declare the web service function in the *local/myplugin/db/services.php* file.

```php
$functions = array(
    'local_myplugin_create_groups' => array(         //web service function name
        'classname'   => 'local_myplugin_external',  //class containing the external function OR namespaced class in classes/external/XXXX.php
        'methodname'  => 'create_groups',          //external function name
        'classpath'   => 'local/myplugin/externallib.php',  //file containing the class/external function - not required if using namespaced auto-loading classes.
                                                   // defaults to the service's externalib.php
        'description' => 'Creates new groups.',    //human readable description of the web service function
        'type'        => 'write',                  //database rights of the web service function (read, write)
        'ajax' => true,        // is the service available to 'internal' ajax calls. 
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE)    // Optional, only available for Moodle 3.1 onwards. List of built-in services (by shortname) where the function will be included.  Services created manually via the Moodle interface are not supported.
        'capabilities' => '', // comma separated list of capabilities used by the function.
    ),
);
```

Web service functions should match the [naming convention](https://docs.moodle.org/dev/Web_services_Roadmap#Naming_convention).

## Write the external function descriptions

Every web service function is mapped to an external function. External function are described in the [External functions API](./functions.md).
Each external function is written with two other functions describing the parameters and the return values. These description functions are used by web service servers to:

- validate the web service function parameters
- validate the web service function returned values
- build WSDL files or other protocol documents
These two description functions are located in the same file and the same class mentioned in local/myplugin/db/services.php.

Thus for the web service function **local_myplugin_create_groups()**, we need write a class named **local_myplugin_external** in the file **local/myplugin/externallib.php**. The class will contain:

- create_groups(...)
- create_groups_parameters()
- create_groups_return()

### create_groups_parameters()

```php
require_once("$CFG->libdir/externallib.php");

class local_myplugin_external extends external_api {

    /**
     * Returns description of method parameters
     * @return external_function_parameters
     */
    public static function create_groups_parameters() {
        return new external_function_parameters(
            array(
                'groups' => new external_multiple_structure(
                    new external_single_structure(
                        array(
                            'courseid' => new external_value(PARAM_INT, 'id of course'),
                            'name' => new external_value(PARAM_TEXT, 'multilang compatible name, course unique'),
                            'description' => new external_value(PARAM_RAW, 'group description text'),
                            'enrolmentkey' => new external_value(PARAM_RAW, 'group enrol secret phrase'),
                        )
                    )
                )
            )
        );
    }
```

A web service function without parameters will have a parameter description function like that:

```php
/**
     * Returns description of method parameters
     * @return external_function_parameters
     */
    public static function functionname_parameters() {
        return new external_function_parameters(
            array(
               //if I had any parameters, they would be described here. But I don't have any, so this array is empty.
            )
        );
    }
```

A parameter can be described as:

- a list => external_multiple_structure
- an object => external_single_structure
- a primary type => external_value

Our create_groups() function expects one parameter named *groups*, so we will first write:

```php
    /**
     * Returns description of method parameters
     * @return external_function_parameters
     */
    public static function create_groups_parameters() {
        return new external_function_parameters(
            array(
                'groups' => ...
                
            )
        );
    }
```

This *groups* parameter is a list of group. So we will write :

```php
                'groups' => new external_multiple_structure(
                    ...
                )          
```

An external_multiple_structure object (list) can be constructed with:

- *external_multiple_structure* (list)
- *external_single_structure* (object)
- *external_value* (primary type).

For our function it will be a *external_single_structure*:

```php
                    new external_single_structure(
                        array(
                            'courseid' => ...,
                            'name' => ...,
                            'description' => ...,
                            'enrolmentkey' => ...,
                        )
                    )           
```

Thus we obtain :

```php
                'groups' => new external_multiple_structure(
                    new external_single_structure(
                        array(
                            'courseid' => ...,
                            'name' => ...,
                            'description' => ...,
                            'enrolmentkey' => ...,
                        )
                    )
                )          
```

Each group values is a *external_value* (primary type):

- *courseid* is an integer
- *name* is a string (text only, not tag)
- *description* is a string (can be anything)
- *enrolmentkey* is also a string (can be anything)

We add them to the description :

```php
                'groups' => new external_multiple_structure(
                    new external_single_structure(
                        array(
                            'courseid' => new external_value(PARAM_INT, 'id of course'), //the second argument is a human readable description text. This text is displayed in the automatically generated documentation.
                            'name' => new external_value(PARAM_TEXT, 'multilang compatible name, course unique'),
                            'description' => new external_value(PARAM_RAW, 'group description text'),
                            'enrolmentkey' => new external_value(PARAM_RAW, 'group enrol secret phrase'),
                        )
                    )
                )          
```

### create_groups_returns()

It's similar to create_groups_parameters(), but instead of describing the parameters, it describes the return values.

```php
public static function create_groups_returns() {
        return new external_multiple_structure(
            new external_single_structure(
                array(
                    'id' => new external_value(PARAM_INT, 'group record id'),
                    'courseid' => new external_value(PARAM_INT, 'id of course'),
                    'name' => new external_value(PARAM_TEXT, 'multilang compatible name, course unique'),
                    'description' => new external_value(PARAM_RAW, 'group description text'),
                    'enrolmentkey' => new external_value(PARAM_RAW, 'group enrol secret phrase'),
                )
            )
        );
    }
```

### Required, Optional or Default value

A value can be VALUE_REQUIRED, VALUE_OPTIONAL, or VALUE_DEFAULT. If not mentioned, a value is VALUE_REQUIRED by default.

```php
                            'yearofstudy' => new external_value(PARAM_INT, 'year of study',VALUE_DEFAULT, 1979),                        
```

- VALUE_REQUIRED - if the value is not supplied => the server throws an error message
- VALUE_OPTIONAL - if the value is not supplied => the value is ignored. Note that VALUE_OPTIONAL can't be used in top level parameters, it must be used only within array/objects key definition. If you need top level Optional parameters you should use VALUE_DEFAULT instead.
- VALUE_DEFAULT - if the value is not supplied => the default value is used
Note: Because some web service protocols are strict about the number and types of arguments - it is not possible to specify an optional parameter as one of the top-most parameters for a function. Examples:

Not cool:

```php
    public static function get_biscuit_parameters() {                                                                  
        return new external_function_parameters(                                                                                    
            array(                                                                                                                  
                'chocolatechips' => new external_value(PARAM_BOOL, PARAM_REQUIRED),
                'glutenfree' => new external_value(PARAM_BOOL, PARAM_DEFAULT, false),
                'icingsugar' => new external_value(PARAM_BOOL, VALUE_OPTIONAL), // ERROR! top level optional parameter!!!
            )
        );
    }
             
```

Cool:

```php

    public static function get_biscuit_parameters() {                                                                  
        return new external_function_parameters(                                                                                    
            array(
                'ifeellike' => new external_single_structure(
                    array(                                                                                                                  
                        'chocolatechips' => new external_value(PARAM_BOOL, VALUE_REQUIRED),
                        'glutenfree' => new external_value(PARAM_BOOL, PARAM_DEFAULT, false),
                        'icingsugar' => new external_value(PARAM_BOOL, VALUE_OPTIONAL), // ALL GOOD!! We have nested the params in a external_single_structure.
                    )
                )
            )
        );
    }
     
```

## Implement the external function

We declared our web service function and we defined the external function parameters and return values. We will now implement the external function:

```php
    /**
     * Create groups
     * @param array $groups array of group description arrays (with keys groupname and courseid)
     * @return array of newly created groups
     */
    public static function create_groups($groups) { //Don't forget to set it as static
        global $CFG, $DB;
        require_once("$CFG->dirroot/group/lib.php");

        $params = self::validate_parameters(self::create_groups_parameters(), array('groups'=>$groups));

        $transaction = $DB->start_delegated_transaction(); //If an exception is thrown in the below code, all DB queries in this code will be rollback.

        $groups = array();

        foreach ($params['groups'] as $group) {
            $group = (object)$group;

            if (trim($group->name) == '') {
                throw new invalid_parameter_exception('Invalid group name');
            }
            if ($DB->get_record('groups', array('courseid'=>$group->courseid, 'name'=>$group->name))) {
                throw new invalid_parameter_exception('Group with the same name already exists in the course');
            }

            // now security checks
            $context = get_context_instance(CONTEXT_COURSE, $group->courseid);
            self::validate_context($context);
            require_capability('moodle/course:managegroups', $context);

            // finally create the group
            $group->id = groups_create_group($group, false);
            $groups[] = (array)$group;
        }

        $transaction->allow_commit();

        return $groups;
    }
```

### Parameter validation

```php
 $params = self::validate_parameters(self::create_groups_parameters(), array('groups'=>$groups));
```

This *validate_parameters* function validates the external function parameters against the description. It will return an exception if some required parameters are missing, if parameters are not well-formed, and check the parameters validity. It is essential that you do this call to avoid potential hack.

**Important:** the parameters of the external function and their declaration in the description **must be the same order**. In this example we have only one parameter named $groups, so we don't need to worry about the order.

### Context and Capability checks

```php
/// now security checks
$context = context_course::instance($group->courseid);
self::validate_context($context);
require_capability('moodle/course:managegroups', $context);
```

Note: validate_context() is required in all external functions before operating on any data belonging to a context. This function does sanity and security checks on the context that was passed to the external function - and sets up the global $PAGE and $OUTPUT for rendering return values. Do NOT use require_login(), or $PAGE->set_context() in an external function.

### Exceptions

You can throw exceptions. These are automatically handled by Moodle web service servers.

```php
//Note: it is good practice to add detailled information in $debuginfo, 
//         and only send back a generic exception message when Moodle DEBUG mode < NORMAL.
//         It's what we do here throwing the invalid_parameter_exception($debug) exception
throw new invalid_parameter_exception('Group with the same name already exists in the course'); 
```

### Correct return values

The return values will be validated by the Moodle web service servers:

- return values contain some values not described => these values will be skipped.
- return values miss some required values (VALUE_REQUIRED) => the server will return an error.
- return values types don't match the description (int != PARAM_ALPHA) => the server will return an error
**Note:** cast all your returned objects into arrays.

## Making web service accessible through Apache Thrift

This step is optional. If you wish to generate SDK for different programming languages and platforms using [Apache Thrift framework](http://thrift.apache.org) then [Moodle Thrift tools](https://bitbucket.org/hhteam/moodle_thrift_tools/wiki/Home) can help you.

Two steps should be performed:

- Generate .thrift files for Moodle API using thriftgenerator script.
- Generate thrift handlers for PHP and copy the php files generated to your plugin source tree.
It is also recommended to include thrift files into the distribution of your plugin in order to simplify creation of client bindings for the users of your API.

That's it. Now the web API of your plugin is accessible through Apache Thrift Framework.

## Bump the plugin version

Edit your local/myplugin/version.php and increase the plugin version. This should trigger a Moodle upgrade and the new web service should be available in the administration (*Administration > Plugins > Web Services > Manage services*)

## Deprecation

External functions deprecation process is slightly different from the standard deprecation. If you are interested in deprecating any of your external functions you should **also** (apart from the applicable points detailed in the [standard deprecation docs](/general/development/policies/deprecation)) create a <tt>FUNCTIONNAME_is_deprecated()</tt> method in your external function class. Return true if the external function is deprecated. This is an example:

```php
     * Mark the function as deprecated.
     * @return bool
     */
    public static function create_groups_is_deprecated() {
        return true;
    }
```

# See also

- [Web services developer documentation](./index.md)
- [Web services user documentation](https://docs.moodle.org/en/Web_services)
- [Implement a web service client](https://docs.moodle.org/dev/Creating_a_web_service_client)
- Code example: [Adding a web service, using APIs](https://gist.github.com/timhunt/51987ad386faca61fe013904c242e9b4) by (Tim Hunt)
Specification:
- [External services security](./security.md)
- [External services description](./description.md)
- [Session locks#Read only sessions in web services](https://docs.moodle.org/dev/Session_locks#Read_only_sessions_in_web_services)
