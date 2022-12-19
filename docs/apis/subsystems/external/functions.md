---
title: External Functions API
tags:
  - Web_Services
  - API
  - core_external
  - external
---

## Overview

The external functions API allows you to create fully parameterised methods that can be accessed by external programs (such as [Web services API](https://docs.moodle.org/dev/Web_services_API)).

The external functions are located under every component\external\[](optional\sub\) namespace (previously in externallib.php files). Each external function is implemented inside an individual class and is complemented by two description functions:

- FUNCTIONNAME_parameters() which describes the parameters of the functions
- FUNCTIONNAME_returns() which describes the return value

The description functions uses external_description classes that have been created for this purpose.

## component\external\something.php

- This file is located under the classes/external dir of your plugin (https://docs.moodle.org/dev/Frankenstyle#Plugin_types). And it's namespaced accordingly.
- This file is composed by a class that contains the external functions and their description functions.

```php
<?php

/**
 * PLUGIN external file
 *
 * @package    component
 * @category   external
 * @copyright  20XX YOURSELF
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . "/externallib.php");

class something extends external_api {

    /**
     * Returns description of method parameters
     * @return external_function_parameters
     */
    public static function FUNCTIONNAME_parameters() {
        // FUNCTIONNAME_parameters() always return an external_function_parameters(). 
        // The external_function_parameters constructor expects an array of external_description.
        return new external_function_parameters(
                // a external_description can be: external_value, external_single_structure or external_multiple structure
                array('PARAM1' => new external_value(PARAM_TYPE, 'human description of PARAM1')) 
        );
    }

    /**
     * The function itself
     * @return string welcome message
     */
    public static function FUNCTIONNAME($PARAM1) {
 
        //Parameters validation
        $params = self::validate_parameters(self::FUNCTIONNAME_parameters(),
                array('PARAM1' => $PARAM1));

        //Note: don't forget to validate the context and check capabilities

        return $returnedvalue;
    }

    /**
     * Returns description of method result value
     * @return external_description
     */
    public static function FUNCTIONNAME_returns() {
        return new external_value(PARAM_TYPE, 'human description of the returned value');
    }



}
```

To go further, read this core developer tutorial: [Creating a web service and a web service function](https://docs.moodle.org/dev/Creating_a_web_service_and_a_web_service_function).

## Security

Before operating on any data in an external function, you must call external_api::validate_context() on the most specific context for the data. This will perform some sanity and security checks, as well as setup the correct theme, language and filters for rendering content. If your function only uses one context, validate it once at the start of your external function. If your function operates on multiple contexts (like a list of courses), you  must validate each context right before generating any response data related to that context (e.g. calling any $OUTPUT functions or $PAGE->get_renderer() ). Do not call require_login from an external function, that function is reserved for php scripts returning a web page. Do not call $PAGE->set_context() manually, this will generate warning notices. validate_context() is the only correct way to write external functions.

Also make sure you pass all arguments through external_api::validate_parameters() before using them to ensure proper cleaning/sanitisation of the input.

Also be sure to enforce proper capability checks everywhere - external functions are a public API.

## Example

You will find an example of an external.php file in the [web service template plugin](https://github.com/moodlehq/moodle-local_wstemplate). This plugin contains a web service hello_world function. To make testing easy for you, the plugin is distributed with a test client in the folder /client.

## See also

- [Core APIs](../../../apis.md)
- [Web services API](https://docs.moodle.org/dev/Web_services_API)
