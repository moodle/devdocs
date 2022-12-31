---
title: Unit Testing
tags:
  - Unit testing
  - Web_Services
---
{{Moodle 2.3}}Since Moodle 2.3 we are using PHP Unit framework. Writing a unit test before writing an external function will end up to be very helpful. The easiest external function is not an easy task, as you can see in [How to contribute a web service function to core](https://docs.moodle.org/dev/How_to_contribute_a_web_service_function_to_core). When writing PHPUnit tests you will:

- discover use cases you didn't think about.
- understand the feelings and the needs of the web service client developer.
- end up with a function usable by everybody, not only by your own client.
- reach integration way faster as you joined a proof of validity
- make the QA process a breeze

## How to run a PHPUnit test

you should read first the [PHPUnit](/general/development/tools/phpunit) Moodle documentation to have a grasp of PHPUnit in Moodle.

## How to write an external function PHPUnit test

If it doesn't exist create a COMPONENTFOLDER/tests/externallib_test.php file.

```php
<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * COMPONENT External functions unit tests
 *
 * @package    core_component
 * @category   external
 * @copyright  20XX Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/webservice/tests/helpers.php');
require_once($CFG->dirroot . '/COMPONENT/externallib.php');

class COMPONENT_external_testcase extends externallib_advanced_testcase {

    /**
     * Test
     */
    public function test_FUNCTION_NAME() {
        global $USER;

        $this->resetAfterTest(true);

        // Set the required capabilities by the external function
        $contextid = context_XXXX::instance()->id;
        $roleid = $this->assignUserCapability('moodle/CAPABILITYNAME', $contextid);

        $params = array(PARAM1, PARAM2, ...);

        $returnvalue = COMPONENT_external::FUNCTION_NAME($params);

        // We need to execute the return values cleaning process to simulate the web service server
        $returnvalue = external_api::clean_returnvalue(COMPONENT_external::FUNCTION_NAME_returns(), $returnvalue);

        // Some PHPUnit assert
        $this->assertEquals(EXPECTED_VALUE, RETURNED_VALUE);

        // Call without required capability
        $this->unassignUserCapability('moodle/CAPABILITYNAME', $contextid, $roleid);
        $this->expectException(required_capability_exception::class);
        $returnvalue = COMPONENT_external::FUNCTION_NAME($params);

    }
}
```

But the quickest way is most likely to look at some example like course/tests/courseexternallib_test.php - get_categories ([MDL-33995](https://tracker.moodle.org/browse/MDL-33995)). Also read [Writing PHPUnit tests](https://docs.moodle.org/dev/Writing_PHPUnit_tests).

### Coding style

- external functions often check many capabilities. Remember to assign the correct one to the $USER and also test for exception when the $USER doesn't have them.
