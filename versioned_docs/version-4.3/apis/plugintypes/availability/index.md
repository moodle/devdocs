---
title: Availability conditions
tags:
  - Availability
  - core_availability
---

Availability conditions allow teachers to restrict an activity or section so that only certain users can access it. These are accessed using the [Availability API](../../subsystems/availability/index.md).

Some of the conditions included with Moodle are:

- Date - users can only access activity after specified date
- Grade - users can only access activity if they have a certain grade in another activity

A relatively simple example is the grouping condition which can be found in `/availability/condition/grouping`. It is a good basis for a new plugin when starting to implement a new condition.

To see this condition in action:

- Go to a course and edit any section
- Expand the **Restrict access** heading
- Click the **Add restriction** button
- Click **Grouping**

## File structure

import {
    Lang,
    Lib,
} from '../../_files';

All availability condition plugin files must be located inside the **/availability/condition/pluginname** folder.

<details>
  <summary>View an example directory layout for the `availability_grouping` plugin.</summary>

```console
 availability/condition/grouping
├── classes
│   ├── condition.php
│   ├── frontend.php
├── lang
│   └── en
│       └── availability_grouping.php
├── version.php
└── yui
    ├── build
    │   └── moodle-availability_grouping-form
    │       ├── moodle-availability_grouping-form-debug.js
    │       ├── moodle-availability_grouping-form-min.js
    │       └── moodle-availability_grouping-form.js
    └── src
        └── form
            ├── build.json
            ├── js
            │   └── form.js
            └── meta
                └── form.json
```

</details>

Some of the important files for the format plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### lang/en/availability_name.php

import langExample from '!!raw-loader!./_examples/lang.php';
import langDescription from './_examples/lang.md';

<Lang
    plugintype="availability"
    pluginname="pluginname"
    example={langExample}
    description={langDescription}
/>

### classes/condition.php

This PHP class implements the back-end of the condition; in other words, this class contains the code which decides whether a user is allowed to access an activity that uses this condition, or not.

Here's an outline of the code (with standard PHPdoc comments omitted to save space) for a simple example in which there is a boolean value that controls whether access is allowed or not.

```php
// You must use the right namespace (matching your plugin component name).
namespace availability_name;

class condition extends \core_availability\condition {
    // Any data associated with the condition can be stored in member
    // variables. Here's an example variable:
    protected $allow;

    public function __construct($structure) {
        // Retrieve any necessary data from the $structure here. The
        // structure is extracted from JSON data stored in the database
        // as part of the tree structure of conditions relating to an
        // activity or section.
        // For example, you could obtain the 'allow' value:
        $this->allow = $structure->allow;

        // It is also a good idea to check for invalid values here and
        // throw a coding_exception if the structure is wrong.
    }

    public function save() {
        // Save back the data into a plain array similar to $structure above.
        return (object)array('type' => 'name', 'allow' => $this->allow);
    }

    public function is_available(
        $not,
        \core_availability\info $info,
        $grabthelot,
        $userid
    ) {
        // This function needs to check whether the condition is available
        // or not for the user specified in $userid.

        // The value $not should be used to negate the condition. Other
        // parameters provide data which can be used when evaluating the
        // condition.

        // For this trivial example, we will just use $allow to decide
        // whether it is allowed or not. In a real condition you would
        // do some calculation depending on the specified user.
        $allow = $this->allow;
        if ($not) {
            $allow = !$allow;
        }
        return $allow;
    }

    public function get_description(
        $full,
        $not,
        \core_availability\info $info
    ) {
        // This function returns the information shown about the
        // condition on editing screens.
        // Usually it is similar to the information shown if the
        // user doesn't meet the condition.
        // Note: it does not depend on the current user.
        $allow = $not ? !$this->allow : $this->allow;
        return $allow ? 'Users are allowed' : 'Users not allowed';
    }

    protected function get_debug_string() {
        // This function is only normally used for unit testing and
        // stuff like that. Just make a short string representation
        // of the values of the condition, suitable for developers.
        return $this->allow ? 'YES' : 'NO';
    }
}
```

There are other functions you might also want to implement. For example, if your condition should apply to lists of users (in general, conditions which are 'permanent' such as group conditions apply to lists, whereas those which are 'temporary' such as date or grade conditions do not) then you should also implement is_applied_to_user_lists and filter_user_list functions. To see the full list, look at the PHPdoc for the condition and tree_node classes inside availability/classes.

### classes/frontend.php

You will also need to write a frontend.php class which defines the behaviour of your plugin within the editing form (when a teacher is editing the activity settings).

The class is required, but all the functions are theoretically optional; you can leave them out if you don't need any special behaviour for that function. In practice it's likely you will need at least one of them.

```php
namespace availability_name;

class frontend extends \core_availability\frontend {

    protected function get_javascript_strings() {
        // You can return a list of names within your language file and the
        // system will include them here.
        // Should you need strings from another language file, you can also
        // call $PAGE->requires->strings_for_js manually from here.)
        return [];
    }

    protected function get_javascript_init_params(
        $course,
        \cm_info $cm = null,
        \section_info $section = null
    ) {
        // If you want, you can add some parameters here which will be
        // passed into your JavaScript init method. If you don't include
        // this function, there will be no parameters.
        return ['frog'];
    }

    protected function allow_add(
        $course,
        \cm_info $cm = null,
        \section_info $section = null
    ) {
        // This function lets you control whether the 'add' button for your
        // plugin appears. For example, the grouping plugin does not appear
        // if there are no groupings on the course. This helps to simplify
        // the user interface. If you don't include this function, it will
        // appear.
        return true;
    }
}
```

### YUI

The Availability API generates a dialogue to allow teachers to configure the availability conditions. Each availability plugin can add to this form by writing a JavaScript module in the YUI format which generates its form fields, errors, and configuration.

:::note

Although JavaScript standards in Moodle have moved on, the core availability system is implemented in YUI, so for now, the plugins need to use YUI too. (Please, someone, do [MDL-69566](https://tracker.moodle.org/browse/MDL-69566)!)

:::

YUI does require more boilerplate configuration that AMD modules, but the same build toolset is used as for AMD modules and you can still make use of the `grunt watch` command.

#### yui/src/form/meta/form.json

The metadata file lists any dependencies that your YUI module has on other code.

Typically this will include the `moodle-core_availability-form` dependency, and possibly some other YUI dependencies.

```javascript title="availability/condition/example/yui/src/form/meta/form.json"
{
  "moodle-availability_name-form": {
    "requires": [
        "base",
        "node",
        "event",
        "moodle-core_availability-form"
    ]
  }
}
```

#### yui/src/form/build.json

The build.json file describes how the YUI compiler will build your YUI module.

YUI modules can be broken down into smaller, succint, pieces of code. This is very useful for larger modules, but rarely necessary in smaller code.

Typically you should only need to set the name of your plugin in this file>

```javascript title="availability/condition/example/yui/src/form/build.json"
{
  "name": "moodle-availability_name-form",
  "builds": {
    "moodle-availability_name-form": {
      "jsfiles": [
        "form.js"
      ]
    }
  }
}
```

#### yui/src/js/form.js

This file contains the actual JavaScript code for your plugin. It should follow the below format in order to integrate with the core JavaScript. Additional feautres are available and you can add any extra functions you like to break your code down too.

```javascript title="availability/condition/example/yui/src/js/form.js"
M.availability_name = M.availability_name || {};

M.availability_name.form = Y.Object(M.core_availability.plugin);

M.availability_name.form.initInner = function(param) {
    // The 'param' variable is the parameter passed through from PHP (you
    // can have more than one if required).

    // Using the PHP code above it'll show 'The param was: frog'.
    console.log('The param was: ' + param);
};

M.availability_name.form.getNode = function(json) {
    // This function does the main work. It gets called after the user
    // chooses to add an availability restriction of this type. You have
    // to return a YUI node representing the HTML for the plugin controls.

    // Example controls contain only one tickbox.
    var html = '<label>'
        + M.get_string('title', 'availability_name')
        + ' <input type="checkbox"/></label>';
    var node = Y.Node.create('<span>' + html + '</span>');

    // Set initial values based on the value from the JSON data in Moodle
    // database. This will have values undefined if creating a new one.
    if (json.allow) {
        node.one('input').set('checked', true);
    }

    // Add event handlers (first time only). You can do this any way you
    // like, but this pattern is used by the existing code.
    if (!M.availability_name.form.addedEvents) {
        M.availability_name.form.addedEvents = true;
        var root = Y.one('#fitem_id_availabilityconditionsjson');
        root.delegate('click', function() {
            // The key point is this update call. This call will update
            // the JSON data in the hidden field in the form, so that it
            // includes the new value of the checkbox.
            M.core_availability.form.update();
        }, '.availability_name input');
    }

    return node;
};

M.availability_name.form.fillValue = function(value, node) {
    // This function gets passed the node (from above) and a value
    // object. Within that object, it must set up the correct values
    // to use within the JSON data in the form. Should be compatible
    // with the structure used in the __construct and save functions
    // within condition.php.
    var checkbox = node.one('input');
    value.allow = checkbox.get('checked') ? true : false;
};

M.availability_name.form.fillErrors = function(errors, node) {
    // If the user has selected something invalid, this optional
    // function can be included to report an error in the form. The
    // error will show immediately as a 'Please set' tag, and if the
    // user saves the form with an error still in place, they'll see
    // the actual error text.

    // In this example an error is not possible...
    if (false) {
        // ...but this is how you would add one if required. This is
        // passing your component name (availability_name) and the
        // name of a string within your lang file (error_message)
        // which will be shown if they submit the form.
        errors.push('availability_name:error_message');
    }
};
```

### Testing

We strongly recommend writing both unit tests, and functional tests for your availability conditions.

## See also

- Using the [Availability API as a consumer](../../subsystems/availability/index.md)
- [Conditional activities API](../../core/conditionalactivities/index.md)
