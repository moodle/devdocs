---
title: Service Descriptions
tags:
  - Web Services
  - core_external
  - external
  - API
---
{{Moodle_2.0}}

## Purpose

This document explains how we describe and where we store the external services and functions in Moodle 2.0.

### Service discovery

We store the service descriptions and a part of the function descriptions in the component/db/services.php file. Function implementations are located under \component\external classes (previously in externallib.php files). These external functions, one per class (and file) also contain the other part of the function descriptions (the function parameters descriptions).

During the upgrades the descriptions are parsed by a service discovery function that fills the database tables. Administrative UI may be used to change some configuration details. Services can also be defined via the admin UI, but it is recommended to use the new local plugin (look at the readme.txt into the Moodle local folder) when adding custom new services.

### Administration pages

Moodle administrators will be able to manage services. By default all services will be disabled.

List of administration functionalities:

- enable a service (all the functions into this service will be available)
- associate a web service user (the user has web service capability) to some services => a user can only call a service that he is associated with
- create a custom service (name the service + add and remove existing external functions from this service)
- search easily function by component in order to create a custom service

### external_functions table

This table lists the web service functions. It makes sense to call it external_functions as 1 web service function <=> 1 external function. This table maps the web service function name to the actual implementation of that function.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| **id** | int(10) | auto-incrementing |  |
| **name** | varchar(200) |  | the web service name (e.g. the unique name of the external function in the web service API) - a unique identifier for each function; ex.: core_get_users, mod_assignment_submit |
| classname | varchar(100) |  | name of the class that contains method implementation; ex.: core_user_external, mod_assignment_external |
| methodname | varchar(100) |  | static method; ex.: get_users, submit |
| classpath | varchar(255) | NULL | optional path to file with class definition - recommended for core classes only, null means use component/externallib.php; this path is relative to dirroot; ex.: user/externallib.php |
| component | varchar(100) |  | Component where function defined, needed for automatic updates. Service description file is found in the db folder of this component. |
| description | text |  | A short human readable description of the function. It will be used to generate documentation and help the administrator to search a web service function. (NB: decide later if it's really improving the performance compare to add an access to the phpfile) |

Detailed function description is stored as a complex PHP structure in the implementation class using suffix _parameters and _returns.

### external_services table

A *service* is defined as a group of external functions. The main purpose of these *services* is to allow defining of granular access control for multiple external systems.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| **id** | int(10) | auto-incrementing |  |
| **name** | varchar(150) |  | Name of service (gradeexport_xml_export, mod_chat_export) - appears on the admin page. This name is not human readable when displayed into administration. We will use lang file to translate them automatically if a lang string exist. |
| enabled | int(1) | 0 | service enabled, for security reasons some services may be disabled- administrators may disable any service via the admin UI |
| requiredcapability | varchar(255) | NULL | if capability name specified, user needs to have this permission in security context or in system context if context restriction not specified |
| restrictedusers | int(1) | 1 | 1 means on users explicitly listed in external_services_users may access this service, 0 means any user may use this service |
| component | varchar(100) | NULL | Component where service defined - null means custom service defined in admin UI. |
| timecreated | bigint(10) |  | The time the service was enabled or defined? |
| timemodified | bigint(10) |  | The last time the service was updated |
| shortname | varchar(255) |  | The short name of the service |
| downloadfiles | tinyint(1) |  | A flag for something to do with download and files? |

### external_services_functions table

Lists all functions that are available in each service.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| **id** | int(10) | auto-incrementing |  |
| **externalserviceid** | int(10) |  | foreign key, reference external_services.id |
| **functionname** | varchar(200) |  | unique name of external function: references external_functions.name; the string value here simplifies service discovery and maintenance |

### Function description

We need to describe each function in detail, including input and output, so that we can:

- help programmers quickly understand what they have to send and what to expect
- validate all incoming data as automatically as possible for security/correctness
- generate WSDL files for SOAP
- generate documentation for other protocols

There are three main parts working together to do this:

#### services.php

In the db/services.php of each component, is a structure something like this to describe the web service functions, and optionally, any larger services built up of several functions.

```php
$functions = array(
    'moodle_user_create_users' => array(           //web service name (unique in all Moodle)
        'classname'   => 'moodle_user_external', //class containing the function implementation
        'methodname'  => 'create_users',              //name of the function into the class
        'classpath'   => 'user/externallib.php',     //file containing the class (only used for core external function, not needed if your file is 'component/externallib.php'),
        'description' => 'create some users',
        'type' => 'write',
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE)    // Optional, only available for Moodle 3.1 onwards. List of built-in services (by shortname) where the function will be included. Services created manually via the Moodle interface are not supported.
    )
);

$services = array(
    'servicename' => array(
        'functions' => array ('functionname', 'secondfunctionname'), //web service function name
        'requiredcapability' => 'some/capability:specified',
        'restrictedusers' => 1,
        'enabled'=>0, //used only when installing the services
    )
);
```

The function name is arbitrary, but must follow [the naming convention](https://docs.moodle.org/dev/Web_service_API_functions#Naming_convention). This helps ensure that it is globally unique.

The actual param description and description of returned values can be obtained from the same class by static method calls by adding '_parameters' and '_returns' to the methodname value.

#### externallib.php

It's the file referenced as the location for the web service function implementation. It also contains complete descriptions of the required parameters.

*Base description classes:*

```php
abstract class external_description {
    public $desc; //human readable description
    public $required;

    public function __construct($desc, $required) {
        $this->desc = $desc;
        $this->required = $required;
    }
}

class external_value extends external_description {
    public $type;
    public $default;
    public $allownull;

    public function __construct($type, $desc='', $required=VALUE_REQUIRED, $default=null, $allownull=true) {
        parent::_construct($desc, $required);
        $this->type      = $type;
        $this->default   = $default;
        $this->allownull = $allownull;
    }
}

class external_single_structure extends external_description {
    public $keys; //an associative array of external_description

    public function __construct(array $keys, $desc='', $required=VALUE_REQUIRED) {
        parent::_construct($desc, $required);
        $this->keys = $keys; //key=>external_description
    }
}

class external_multiple_structure extends external_description {
    public $content; //the content type of the list => external_description

    public function __construct(external_description $content, $desc='', $required=VALUE_REQUIRED) {
        parent::_construct($desc, $required);
        $this->content = $content;
    }
}

class external_function_parameters extends external_single_structure {
}

```

*Externallib.php examples:*<br/>
These examples include param/return value descriptions and function implementations. See the create_users function for difference between Mandatory/Optional/Default.

```php
class moodle_group_external extends external_api { //see following chapter 'function implementation' to have a look to the external_api class
    public static function add_member_parameters() {
        return new external_function_parameters(
            array(
                'groupid' => new external_value(PARAM_INT, 'some group id'),
                'userid'  => new external_value(PARAM_INT, 'some user id')
            )
        );
    }
    public static function add_member($groupid, $userid) {
        $params = self::validate_parameters(self::add_member_parameters(), array('groupid'=>$groupid, 'userid'=>$userid));

        // all the parameter/behavioural checks and security constrainsts go here,
        // throwing exceptions if neeeded and and calling low level (grouplib)
        // add_member() function that will be one in charge of the functionality without
        // further checks.

    }
    public static function add_member_returns() {
        return null;
    }


    public static function add_members_parameters() {
        return new external_function_parameters(
            array(
                'membership' => new external_multiple_structure(
                    self::add_member_parameters()
                )
            )
        );
    }
    public static function add_members(array $membership) {
        $params = self::validate_parameters(self::add_members_parameters(), array('membership'=>$membership));
        foreach($params['membership'] as $one) { // simply one iterator over the "single" function if possible
            self::add_member($one->groupid, $one->userid);
        }
    }
    public static function add_members_returns() {
        return null;
    }


    public static function get_groups_parameters() {
        return new external_function_parameters(
            array(
                'groups' => new external_multiple_structure(
                    new external_single_structure(
                        array(
                            'groupid' => new external_value(PARAM_INT, 'some group id')
                        )
                    )
                )
            )
        );
    }
    public static function get_groups(array $groups) {
        $params = self::validate_parameters(self::get_groups_parameters(), array('groups'=>$groups));

        // all the parameter/behavioural checks and security constrainsts go here,
        // throwing exceptions if needed and and calling low level (grouplib)
        // get_groups() function that will be one in charge of the functionality without
        // further checks.

    }
    public static function get_groups_returns() {
        return new external_multiple_structure(
            new external_single_structure(
                array(
                    'id' => new external_value(PARAM_INT, 'some group id'),
                    'name' => new external_value(PARAM_TEXT, 'multilang compatible name, course unique'),
                    'description' => new external_value(PARAM_RAW, 'just some text'),
                    'enrolmentkey' => new external_value(PARAM_RAW, 'group enrol secret phrase')
                )
            )
        );
    }
}


class moodle_user_external extends external_api {
    public static function create_users_parameters() {
        new external_function_parameters(
            array(
                'users' => new external_multiple_structure(
                    new external_single_structure(
                        array(
                            'username'    => new external_value(PARAM_RAW, 'Username policy is defined in Moodle security config'),
                            'password'    => new external_value(PARAM_RAW, 'Plain text password consisting of any characters'),
                            'firstname'   => new external_value(PARAM_NOTAGS, 'The first name(s) of the user'),
                            'lastname'    => new external_value(PARAM_NOTAGS, 'The family name of the user'),
                            'email'       => new external_value(PARAM_EMAIL, 'A valid and unique email address'),
                            'auth'        => new external_value(PARAM_SAFEDIR, 'Auth plugins include manual, ldap,
                                                                imap, etc', VALUE_DEFAULT,'manual', false),
                            'idnumber'    => new external_value(PARAM_RAW, 'An arbitrary ID code number perhaps from the institution',
                                                                VALUE_DEFAULT, null),
                            'emailstop'   => new external_value(PARAM_NUMBER, 'Email is blocked: 1 is blocked and 0 otherwise',
                                                                VALUE_DEFAULT, 0),
                            'lang'        => new external_value(PARAM_SAFEDIR, 'Language code such as "en_utf8" must exist on server',
                                                                VALUE_DEFAULT, $CFG->lang, false),
                            'theme'       => new external_value(PARAM_SAFEDIR, 'Theme name such as "standard" must exist on server',
                                                                VALUE_OPTIONAL),
                            'timezone'    => new external_value(PARAM_ALPHANUMEXT, 'Timezone code such as Australia/Perth,or 99 for default',
                                                                VALUE_OPTIONAL),
                            'mailformat'  => new external_value(PARAM_INTEGER, 'Mail format code is 0 for plain text, 1 for HTML etc',
                                                                VALUE_OPTIONAL),
                            'description' => new external_value(PARAM_TEXT, 'User profile description, as HTML', VALUE_OPTIONAL),
                            'city'        => new external_value(PARAM_NOTAGS, 'Home city of the user', VALUE_OPTIONAL),
                            'country'     => new external_value(PARAM_ALPHA, 'Home country code of the user, such as AU or CZ',
                                                                VALUE_OPTIONAL),
                            'preferences' => new external_multiple_structure(
                                new external_single_structure(
                                    array(
                                        'type'  => new external_value(PARAM_ALPHANUMEXT, 'The name of the preference'),
                                        'value' => new external_value(PARAM_RAW, 'The value of the preference')
                                    )
                                ), 'User preferences', VALUE_OPTIONAL),
                            'customfields' => new external_multiple_structure(
                                new external_single_structure(
                                    array(
                                        'type'  => new external_value(PARAM_ALPHANUMEXT, 'The name of the custom field'),
                                        'value' => new external_value(PARAM_RAW, 'The value of the custom field')
                                    )
                                ), 'User custom fields', VALUE_OPTIONAL)
                        )
                    )
                )
            )
        );
    }
    public static function create_users(array $users) {
        $params = self::validate_parameters(self::create_users_parameters(), array('users'=>$users));

        foreach ($params['users'] as $user) {
            // all the parameter/behavioural checks and security constrainsts go here,
            // throwing exceptions if neeeded and and calling low level (userlib)
            // add_user() function that will be one in charge of the functionality without
            // further checks.
        }
    }
    public static function create_users_returns() {
        return new external_multiple_structure(
            new external_value('userid', PARAM_INT, 'id of the created user')
        );
    }
}
```

Note the use of Moodle-oriented PARAM_XXXX constants to define the format of each field.  These are used by the validation function *validate_parameters()* to verify the data and throw an exception and abort the operation completely if the data changed during cleaning (ie it was malformed).

#### Params

We use the clean_param function to check data.  We have added in *moodlelib.php* some new checks for common Moodle data so that we get better cleaning.  eg

```php
...
        case PARAM_AUTH:
            $param = clean_param($param, PARAM_SAFEDIR);
            if (exists_auth_plugin($param)) {
                return $param;
            } else {
                return '';
            }

        case PARAM_LANG:
            $param = clean_param($param, PARAM_SAFEDIR);
            $langs = get_list_of_languages(false, true);
            if (in_array($param, $langs)) {
                return $param;
            } else {
                return '';  // Specified language is not installed
            }

        case PARAM_THEME:
            $param = clean_param($param, PARAM_SAFEDIR);
            if (file_exists($CFG->dirroot.'/theme/'.$param)) {
                return $param;
            } else {
                return '';  // Specified theme is not installed
            }
...
```

##### Parameters types

Note, this list will almost certainly be out of date by the time you read it. Do yourself a favour, and look at the list in lib/moodlelib.php. That is guaranteed to be up-to-date.

- 'PARAM_ALPHA',    'alpha'
- 'PARAM_ALPHAEXT', 'alphaext'
- 'PARAM_ALPHANUM', 'alphanum'
- 'PARAM_ALPHANUMEXT', 'alphanumext'
- 'PARAM_AUTH',  'auth'
- 'PARAM_BASE64',   'base64'
- 'PARAM_BOOL',     'bool'
- 'PARAM_CAPABILITY',   'capability'
- 'PARAM_CLEANHTML', 'cleanhtml'
- 'PARAM_EMAIL',   'email'
- 'PARAM_FILE',   'file'
- 'PARAM_FLOAT',  'float'
- 'PARAM_HOST',     'host'
- 'PARAM_INT',      'int'
- 'PARAM_LANG',  'lang'
- 'PARAM_LOCALURL', 'localurl'
- 'PARAM_NOTAGS',   'notags'
- 'PARAM_PATH',     'path'
- 'PARAM_PEM',      'pem'
- 'PARAM_PERMISSION',   'permission'
- 'PARAM_RAW', 'raw'
- 'PARAM_RAW_TRIMMED', 'raw_trimmed'
- 'PARAM_SAFEDIR',  'safedir'
- 'PARAM_SAFEPATH',  'safepath'
- 'PARAM_SEQUENCE',  'sequence'
- 'PARAM_TAG',   'tag'
- 'PARAM_TAGLIST',   'taglist'
- 'PARAM_TEXT',  'text'
- 'PARAM_THEME',  'theme'
- 'PARAM_URL',      'url'
- 'PARAM_USERNAME',    'username'
- 'PARAM_STRINGID',    'stringid'
- 'PARAM_CLEAN',    'clean'
- 'PARAM_INTEGER',  'int'
- 'PARAM_NUMBER',  'float'
- 'PARAM_ACTION',   'alphanumext'
- 'PARAM_FORMAT',   'alphanumext'
- 'PARAM_MULTILANG',  'text'
- 'PARAM_TIMEZONE', 'timezone'
- 'PARAM_CLEANFILE', 'file'
- 'PARAM_COMPONENT', 'component'
- 'PARAM_AREA', 'area'
- 'PARAM_PLUGIN', 'plugin'

### Function implementation

As you probably understood when you read the previous chapter examples, the functions are generally stored in externallib.php files, as methods in a class that extends **'external_api**'.  The actual file location is referenced by **'classpath**' in the services.php description.

```php
class moodle_user_external extends external_api {
    public static function create_users($users)
    $params = self::validate_parameters(self::create_users_parameters(), array('users'=>$users)); //ws object are associative array, ws list are non associative array

        foreach ($params['users'] as $user) {
            // all the parameter/behavioural checks and security constraints go here,
            // throwing exceptions if needed and and calling low level (userlib)
            // add_user() function that will be one in charge of the functionality without
            // further checks.
        }
    }
}
```

Note: there is more examples in the previous chapter

external_api file:

```php
/**
 * Base class for external api methods.
 */
class external_api {

     ...

     /**
     * Validates submitted function parameters, if anything is incorrect
     * invalid_parameter_exception is thrown.
     * This is a simple recursive method which is intended to be called from
     * each implementation method of external API.
     * @param external_description $description description of parameters
     * @param mixed $params the actual parameters
     * @return mixed params with added defaults for optional items, invalid_parameters_exception thrown if any problem found
     */
    public static function validate_parameters(external_description $description, $params) {
         ...
    }

    ...
}
```

### Way to fill the database tables

The Moodle upgrade takes care of the updates. We added two functions *lib/upgradelib.php/external_update_description()* and *lib/upgradelib.php/external_delete_description()* that update all web service descriptions into the database. *lib/upgradelib.php/external_update_description()* is also called during Moodle installation process.

### Return values are filtered by the servers

Web service functions should be able to return whatever they want. Each server should be looking at the web services description and returns the expected values.

Some bulk requests may terminate unexpectedly in the middle of processing elements, these partial failures should be indicated by special exceptions classes which include list of completed elements and original exception.

TODO: special exceptions and the way to manage them need to be detailed.

# See also

- [Web services](./index.md)
- [External services security](./security.md)
