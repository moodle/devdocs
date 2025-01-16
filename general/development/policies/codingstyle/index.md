---
title: Coding style
description: The Moodle Coding Style guidelines
tags:
  - Policies
  - Coding guidelines
  - Developer processes
---

## Overview

### Scope

This document describes **style** guidelines for developers working on or with Moodle code. It talks purely about the mechanics of code layout and the choices we have made for Moodle. The intent of this specification is to reduce cognitive friction when scanning code from different authors. It does so by enumerating a shared set of rules and expectations about how to format PHP code.

Unless otherwise specified, this Coding Style document **will defer to [PSR-12](https://www.php-fig.org/psr/psr-12/), and [PSR-1](https://www.php-fig.org/psr/psr-1/)** in that order.

Where a **de-facto Moodle standard** is encountered but is undocumented, an appropriate **MDLSITE** issue should be raised to have the standard either documented within this Coding style guide, or rejected and the PSR recommendations adopted instead.

:::info
A "de-facto Moodle standard" is any coding style which is commonly and typically used in Moodle.
:::

### Goals

Consistent coding style is important in any development project, and particularly when many developers are involved. A standard style helps to ensure that the code is easier to read and understand, which helps overall quality.

Abstract goals we strive for:

- simplicity
- readability
- tool friendliness, such as use of method signatures, constants, and patterns that support IDE tools and autocompletion of method, class, and constant names.

When considering the goals above, each situation requires an examination of the circumstances and balancing of various trade-offs.

:::note
Much of the existing Moodle code may not follow all of these guidelines - we continue to upgrade this code when we see it.
:::

For details about using the Moodle API to get things done, see the [coding guidelines](../../policies.md).

### Useful tools

Several tools are available to help you in write code that conforms to this guide:

- The Moodle [Code checker](https://moodle.org/plugins/view.php?plugin=local_codechecker) (integrates with [eclipse/phpstorm](https://github.com/moodlehq/moodle-local_codechecker/blob/main/README.md#ide-integration))
- The Moodle [PHPdoc checker](https://moodle.org/plugins/local_moodlecheck)

It is worth using both tools to check the code you are writing as they both perform slightly different checks.
If you can get your code to pass both then you are well on the way to making friends with those who will be reviewing your work.

## File Formatting

### PHP tags

Always use "long" php tags. However, to avoid whitespace problems, DO NOT include the closing tag at the very end of the file.

import Example_PhpTags_Good from '!!raw-loader!./_examples/phptags_good.php';

<ValidExample>

<CodeBlock language="php" title="Using long tags in a PHP file">{Example_PhpTags_Good}</CodeBlock>

</ValidExample>

### Indentation

Use an indent of **4 spaces** with no tab characters. Editors should be configured to treat tabs as spaces in order to prevent injection of new tab characters into the source code.

**Do not** indent the main script level:

<ValidExample>

```php title="An example of correct indentation at the main script level"
<?php
require('config.php');
$a = required_param('a', PARAM_INT);
if ($a > 10) {
    call_some_error($a);
} else {
    do_something_with($a);
}
```

</ValidExample>

<InvalidExample>

```php title="An example of incorrect indentation at the main script level"
<?php
    require('config.php');
    $a = required_param('a', PARAM_INT);
    if ($a > 10) {
        call_some_error($a);
    } else {
        do_something_with($a);
    }
```

</InvalidExample>

SQL queries use special indentation, see [SQL coding style](./sql.md).

### Maximum Line Length

The key issue is readability.

Aim for 132 characters if it is convenient, it is not recommended to use more than 180 characters.

The exception are string files in the `/lang` directory where lines `$string['id'] = 'value';` should have the value defined as a single string of any length, wrapped by quotes (no concatenation operators, no heredoc and no newdoc syntax). This helps to parse and process these string files without including them as a PHP code.

#### Wrapping lines

Whenever wrapping lines, following rules should generally apply:

- Indent with 4 spaces by default.
- Indent the wrapped line with control statement conditions or a function/class declaration with 4 additional spaces to visually distinguish it from the following body of the control statement or the function/class.

See examples in the following sections.

#### Wrapping control structures

<ValidExample>

```php
while ($fileinfolevel && $params['component'] === 'user'
        && $params['filearea'] === 'private') {
    $fileinfolevel = $fileinfolevel->get_parent();
    $params = $fileinfolevel->get_params();
}
```

</ValidExample>

#### Wrapping if-statement conditions

There is nothing special and the control structures rule would still apply.

<ValidExample>

```php
if (($userenrol->timestart && $userenrol->timestart < $limit) ||
        (!$userenrol->timestart && $userenrol->timecreated < $limit)) {
    return false;
}
```

</ValidExample>

However, if you have a few conditions in one control structure, try setting some helper variables for evaluating the conditions to improve the readability.

<ValidExample>

```php
$iscourseorcategoryitem = ($element['object']->is_course_item() || $element['object']->is_category_item());
$usesscaleorvalue = in_array($element['object']->gradetype, [GRADE_TYPE_SCALE, GRADE_TYPE_VALUE]);

if ($iscourseorcategoryitem && $usesscaleorvalue) {
    // This makes the conditions easier to review and understand.
}
```

</ValidExample>

Compare it with the following.

<InvalidExample>

```php
// DO NOT DO THIS.
if (($element['object']->is_course_item() || $element['object']->is_category_item())
        && ($element['object']->gradetype == GRADE_TYPE_SCALE
        || $element['object']->gradetype == GRADE_TYPE_VALUE)) {
    // Too long lines with complex conditions are discouraged even when they are indented properly.
}
```

</InvalidExample>

#### Wrapping class declarations

<ValidExample>

```php
class foo implements bar, baz, qux, quux, quuz, corge, grault,
        garply, waldo, fred, plugh, xyzzy, thud {

    // Class body indented with 4 spaces.
}
```

</ValidExample>

Alternatively you may want to provide each implemented interface on its own line if it helps readability:

<ValidExample>

```php
class provider implements
        // These lines are indented with 8 spaces to distinguish them visually from the class body.
        \core_privacy\local\metadata\provider,
        \core_privacy\local\request\subsystem\provider,
        \core_privacy\local\request\core_userlist_provider {

    // Class body indented with 4 spaces.
}
```

</ValidExample>

#### Wrapping of the function signatures

<ValidExample>

```php title="Wrapping function signatures with 8 spaces"
/**
 * ...
 */
protected function component_class_callback_failed(\Throwable $e, string $component, string $interface,
        string $methodname, array $params) {
    global $CFG, $DB;

    if ($this->observer) {
        // ...
    }
}
```

</ValidExample>

<ValidExample>

```php title="Wrapping function signatures following PSR-12"
/**
 * ...
 */
protected function component_class_callback_failed(
    \Throwable $e,
    string $component,
    string $interface,
    string $methodname,
    array $params
) {
    global $CFG, $DB;

    if ($this->observer) {
        // ...
    }
}
```

</ValidExample>

#### Wrapping parameters of a function call

Normally, parameters will just fit on one line. If they eventually become too long to fit a single line or of it helps readability, indent with 4 spaces.

<ValidExample>

```php title="Wrapping function calls the Moodle way"
do_something($param1, $param2, null, null,
    $param5, null, true);
```

</ValidExample>

<ValidExample>

```php title="Wrapping function calls following PSR-12"
do_something(
    $param1,
    $param2,
    null,
    null,
    $param5,
    null,
    true
);
```

</ValidExample>

#### Wrapping arrays

There is nothing special and the general rules apply again. Indent the wrapped line with 4 spaces.

<ValidExample>

```php
$plugininfo['preferences'][$plugin] = ['id' => $plugin, 'link' => $pref_url,
    'string' => $modulenamestr];
```

</ValidExample>

In many cases, the following style with each item on its own line will make the code more readable.

<ValidExample>

```php
$plugininfo['preferences'][$plugin] = [
    'id' => $plugin,
    'link' => $pref_url,
    'string' => $modulenamestr,
];
```

</ValidExample>

:::note

The last item has a trailing comma left there which allows to extend the list of items later with a cleaner diff.
For the same reason, it is better not to align the assignment operators.

:::

#### Wrapping arrays passed as function parameter

This is just an example of combining some of the examples above.

<ValidExample>

```php
$url = new moodle_url('/course/loginas.php', [
    'id' => $course->id,
    'sesskey' => sesskey(),
]);
```

</ValidExample>

### Line Termination

- Every line must be terminated by a Unix line feed character (LF, decimal 10, hexadecimal 0x0A).
- Carriage returns (CR, decimal 13, hexadecimal 0x0D) must NOT be used alone or with LFs.
- There must be no whitespace characters (spaces or tabs) at the end of any line.
- There must be no extra blank lines at the end of a file; every file should end with a single LF character.

:::note

This is consistent with the conventions of [PSR-12](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-12-extended-coding-style-guide.md#22-files).

:::

### Whitespace

Similar to [Section 2.3 of PSR-12](https://www.php-fig.org/psr/psr-12/#23-lines), each line of code should not have trailing whitespace. This is also applicable for multiline string literals such as SQL statements.

#### Assignment operator

- One or more spaces are allowed before assignments.
- One and only one space is allowed after assignments.

<ValidExample>

```php
$foo = true;
$foobar = false;
$bafoo = 'Hello world';
```

</ValidExample>

<ValidExample>

```php
$foo    = true;
$foobar = false;
$bafoo  = 'Hello world';
```

</ValidExample>

When making decisions about the spaces to apply before assignments, please consider both surrounding and similar code.

## Naming Conventions

### Filenames

Filenames should:

- be whole english words
- be as short as possible
- use lowercase letters only
- end in `.php`, `.html`, `.js`, `.css` or `.xml`

### Classes

Class names should always be lower-case English words, separated by underscores:

<ValidExample>

```php
class some_custom_class {
    function class_method() {
        echo 'foo';
    }
}
```

</ValidExample>

Always use `()` when creating new instances even if constructor does not need any parameters.

<ValidExample>

```php title="Example of class instantiation"
$instance = new some_custom_class();
```

</ValidExample>

When you want a plain object of no particular class, for example when you are preparing some data to insert into the database with $DB->insert_record, you should use the PHP standard class `stdClass`. For example:

<ValidExample>

```php
$row = new stdClass();
$row->id = $id;
$row->field = 'something';
$DB->insert_record('table', $row);
```

</ValidExample>

Alternatively you can cast an array to an object:

<ValidExample>

```php title="Creating a stdClass from an object"
$row = (object) [
    'id' => $id,
    'field' => 'something',
];
$DB->insert_record('table', $row);
```

</ValidExample>

:::info

Before Moodle 2.0, Moodle defined a class named `object` extending `stdClass`, and recommended instantiation using `new object();`.
This has now been deprecated. Please use `stdClass` or the array instantiation instead.

:::

### Functions and Methods

Function names should be simple English lowercase words, and start with the [Frankenstyle](./frankenstyle.md) prefix and plugin name to avoid conflicts between plugins. Words should be separated by underscores.

Verbosity is encouraged: function names should be as illustrative as is practical to enhance understanding.

The uses of type hints and return type declarations is required in PHP in all possible locations for all new code. There will be necessary exclusions, such as code extending existing non-compliant code and implementing things where it is not available. Progressive approach will be applied.

:::note

There is no space between the function name and the following (brackets). There is also no whitespace between the nullable character (question mark - ?) and params or return types or between the function closing brackets and the colon.

:::

<ValidExample>

```php
function report_participation_get_overviews(string $action, ?int userid): ?array {
    // Actual function code goes here.
}
```

</ValidExample>

There is an exception for [activity modules](/docs/apis/plugintypes/mod) modules|activity modules]] that still use only plugin name as the prefix for legacy reasons.

<ValidExample>

```php
function forum_set_display_mode($mode = 0) {
    global $USER, $CFG;

    // Actual function code goes here.
}
```

</ValidExample>

#### Function Parameters

Parameters are always simple lowercase English words (sometimes more than one, like `$initialvalue`), and should always have sensible defaults if possible.

Use `null` as the default value instead of `false` for situations like this where a default value isn't needed.

<ValidExample>

```php
public function foo($required, $optional = null);
```

</ValidExample>

However, if an optional parameter is boolean, and its logical default value should be true, or false, then using true or false is acceptable.

:::note Type hinting with optional parameters

When type-hinting optional parameters, technically the nullable hint is optional, but it is highly recommended as it leads to consistent code.

```php
/**
 * Get the name, using a default if not available.
 *
 * @param null|string $default The value to get if not found
 */
public function get(?string $default = null): string;
```

:::

### Web service functions

Web service functions should be of the format `{fullcomponent}_{methodname}`, where

- `{fullcomponent}` is the full Frankenstyle name of the component
- `{methodname}` is the name of the method in the form of `{verb}_{noun}`
  - `{verb}` - preferably one of `get`, `create`, `delete`, `update` or any verb that describes the action well
  - `{noun}` - object(s) or entities that the action affects

<ValidExample>

- core_block_get_dashboard_blocks
- core_calendar_update_event_start_day
- core_cohort_create_cohorts
- core_cohort_delete_cohort_members
- core_auth_confirm_user
- core_auth_is_minor

</ValidExample>

### Variables

Variable names should always be easy-to-read, meaningful lower-case English words. If you really need more than one word then run them together, but keep them as short as possible. Use **plural** names for arrays of objects. Use **positive** variables names always (allow, enable not prevent, disable).

<ValidExample>

```php
$quiz = null;
$errorstring = null;
$assignments = null; // For an array of objects.
$i = null; // Only in little loops.
$allowfilelocking = false;
```

</ValidExample>

<InvalidExample>

```php
$Quiz = null; // Variables should be all lower case.
$camelCase = null; // Variables should not be in camelCase, PascalCase.
$aReallyLongVariableNameWithoutAGoodReason = null; // Variable names should be sensible and short.
$error_string = null; // Variable names should not contain underscores.
$preventfilelocking = true; // Variable names should not be negative.
 ```

</InvalidExample>

Core global variables in Moodle are identified using uppercase variables (that is `$CFG`, `$SESSION`, `$USER`, `$COURSE`, `$SITE`, `$PAGE`, `$PERF`, `$DB`, and `$THEME`). Don't create any more!

### Constants

Constants should always be in upper case, and always start with [Frankenstyle](./frankenstyle.md) prefix and plugin name (in case of activities the module name only for legacy reasons). They should have words separated by underscores.

<ValidExample>

```php
define('BLOCK_COURSE_OVERVIEW_SHOWCATEGORIES_NONE', '0');
define('FORUM_MODE_FLATOLDEST', 1);
```

</ValidExample>

### Booleans and the null value

Use lower case for **true**, **false** and **null**.

### Namespaces

Formal namespaces are required for any new classes in Moodle. The following exceptions apply:

1. There is no requirement to move existing non-namespaced classes to a namespace; and
1. Where an existing mechanism exists for loading a class, and that mechanism does not support the use of a namespaced class, the existing [Frankenstyle](./frankenstyle.md) prefix on the class name will be allowed.

The use of a [Frankenstyle prefix on class names](./frankenstyle.md#class-names) is deprecated and should only be used in the above exceptions.

<ValidExample>

```php title="Correct use of namespaces"
// A namespace for the `mod_forum` plugin.

namespace mod_forum;
class example {
}

// A namespace for the `external` subsystem usage in the `mod_forum` plugin.
namespace mod_forum\external;
class example {
}

// A namespace for the `core_user` core subsystem.
namespace core_user;
class example {}
```

</ValidExample>

<InvalidExample>

```php title="Incorrect use of namespaces"
// Namespaced classes are no longer allowed for new code, except where it is unavoidable.
class mod_forum_example {
}

class mod_forum_external_example {
}

class core_user_example {
}
```

</InvalidExample>

The use of namespaces must conform to the following rules:

1. Classes belonging to a namespace must be created in a classes directory, for example:

- in the `mod_forum` plugin classes should be placed in `mod/forum/classes`;
- for core code, classes should be placed in `lib/classes`; or
- for a core subsystem, classes should be placed in `subsystemdir/classes`.

1. The classname and filename for all namespaced classes must conform to the [automatic class loading](https://docs.moodle.org/dev/Automatic_class_loading) rules. The use of formal PHP namespaces is **required** in all new code.
1. Use at most one namespace declaration per file.

<ValidExample>

```php title="mod/porridge/classes/local/equipment/spoon.php"
<?php

namespace mod_porridge\local\equipment;

class spoon {
    // Your code here.
}
```

</ValidExample>

BAD:

<InvalidExample>

```php title="mod/porridge/classes/local/equipment/spoon.php"
<?php
namespace mod_porridge\local\equipment;

class spoon {
    // Your code here.
}

namespace mod_porridge\local\procedures; // We are changing the namespace here, do not do it.

class eat {
    // Another code here.
}

// End of file.
```

</InvalidExample>

#### Further notes

- The namespace declaration _may_ be preceded with a doc block.
- The [class naming](#classes) rules also apply to the names for each level of namespace.
- The namespace declaration must be the first non-comment line in the file, followed by one blank line, followed by any (optional)
`use` statements
- Each `use` statement must be on its own line.
- There should be a single empty line following the final `use` statement.
- The use of `use` statements should be made to avoid repetition of long namespaces in the code.
- Do not import an entire namespace with a `use` statement, import individual classes only.
- Do not alias class imports (`use XXX as YYY;`) unless it is absolutely required to resolve a conflict.
- It is recommended that class aliases be alphabetically sorted.

<ValidExample>

```php title="An example of correct class importing"
<?php
use mod_porridge\local\equipment\bowl; // One class per line.
use mod_porridge\local\equipment\spoon; // One class per line.

```

</ValidExample>

<InvalidExample>

```php title="Examples of incorrect class importing"
<?php

use mod_porridge\local\equipment\spoon, mod_porridge\local\equipment\bowl; // Multiple classes per line.
use mod_porridge\local; // Importing an entire namespace.
use core; // Importing an entire namespace.
use mod_breakfast; // Importing an entire namespace.
use mod_porridge\local\equipment\spoon as silverspoon; // Named import with no good reason.
```

</InvalidExample>

- Never use the `__NAMESPACE__` magic constant.
- Never use the `namespace` keyword anywhere but the namespace declaration.

<InvalidExample>

```php title="Incorrect: An example of the namespace keyword used incorrectly"
$obj = new namespace\Another();
```

</InvalidExample>

- Do not use bracketed "namespace" blocks.

<InvalidExample>

```php title="Incorrect: An example of a bracketed namespace"
namespace {
    // Global scope.
}
```

</InvalidExample>

- Namespaces *MUST* only be used for classes existing in a subfolder of `classes`.
- For new classes - the maximum level of detail should be used when deciding the namespace.

<ValidExample>

```php title="Correct: Use the maximum level of detail in the namespace"
namespace xxxx\yyyy; // xxxx is the component, yyyy is the api.

class zzzz {
}
```

</ValidExample>

- Never use a leading backslash (\) in "namespace" and "use" statements.
- Global functions called from namespaced code should never use a leading
backslash (`\`).
  Classes from outside the current scope use the leading backslash or are
  imported by the `use` keyword. See
[PHP manual](https://www.php.net/manual/en/language.namespaces.fallback.php) for
details.

<ValidExample>

```php title="Correct: Examples of correct usages"
<?php
namespace mod_breakfast\local;

use moodle_url;

echo get_string('goodmorning', 'mod_breakfast'); // No leading backslash for global functions.
$url = new moodle_url(...); // Leading backslash not needed here because we imported it into our namespace via "use".
$tasks = \core\task\manager::get_all_scheduled_tasks(); // Leading slash needed here.
$a = new \stdClass(); // Leading slash needed here.
```

</ValidExample>

<InvalidExample>

```php title="Incorrect; Examples of incorrect usages"
<?php
namespace \mod_breakfast; // The leading backslash should not be here.

use \core\task\manager; // The leading backslash should not be here.

\get_string('xxxx', 'yyyy'); // The leading backslash should not be here.
```

</InvalidExample>

#### Parts of a namespace

Given the following fully qualified name of a class:

``` title="Anatomy of a namespace"
\<level1>\<level2>\<level3>\...\<classname>
```

There are clear rules for what is allowable at each level of namespace.
Only the first level is mandatory.
Nested namespaces are used when the class implements some core API or when the plugin maintainer want to organise classes to separate namespaces within the plugin - see rules regarding the level2 for details.

#### Rules for level1

The first level, when used, **MUST** be _either_:

- a full component name (for example `\mod_forum`). All classes using namespaces in a plugin *MUST* be contained in this level 1 namespace; or
- `\core` for all core apis

#### Rules for level2

The second level, when used, **MUST** be _either_:

- The short name of a [core API](/docs/apis).
  The classes in this namespace must either implement or use the API in some way; or
- `\local` for any other classes in a component, if the maintainer wants to organise them further (note that for most components, it's probably enough to have all their own classes in the root level1 namespace only).

#### Rules for level3

There are no rules limiting what can be used as a level 3 namespace.
This is where a plugin or addon can make extensive use of namespaces with no
chance of conflict with any other plugin or api, now and forever onwards.

#### Namespaces within `**/tests` directories

:::info

These rules were agreed in [MDLSITE-4800](https://tracker.moodle.org/browse/MDLSITE-4800)

:::

- The use of namespaces is strongly recommended for unit tests.
- When using namespaces, the namespace of the test class should match the namespace of the code under test.
- Test classes should be named after the class under test, and suffixed with `_test.php`.
- The 1st level namespace of the test class **must** match the component it belongs to.
- Sub-namespaces are allowed, strictly following the general namespace rules for levels 2 & 3 above. Always trying to match as much as possible the namespace of the code being covered.
- Sub-directory structure must match the namespace structure, but will be placed in the `tests` directory instead.

:::note

Autoloading of tests is not supported (but autoloading the standard class from a test is).

:::

#### Examples

<ValidExample>

```php title="Correct: Examples of correct namespaces"
// Plugin's own namespace when not using nested namespaces (typical)
// Namespace location: mod/breakfast/classes/
// Test location: mod/breakfast/tests/
namespace mod_breakfast;

// Plugin's own namespace when using nested namespaces
// Namespace location: mod/breakfast/classes/local/
// Test location: mod/breakfast/tests/local/
namespace mod_breakfast\local;

// Plugin's own namespace when using nested namespaces with further organisation
// Namespace location: mod/breakfast/classes/local/utils/
// Test location: mod/breakfast/tests/local/utils/
namespace mod_breakfast\local\utils;

// Plugin's namespace to implement core API
// Namespace location: mod/breakfast/classes/event/
// Test location: mod/breakfast/tests/event/
namespace mod_breakfast\event;
```

</ValidExample>

<InvalidExample>

```php
namespace mymodule;                     // Violates the level1 rules - invalid component name
namespace mod_breakfast\myutilities;    // Violates the level2 rules - invalid core API name
namespace mod_forum\test;               // While technically correct ("test" is a valid API) - it's not ok
                                        // because the namespace in tests should match the namespace of the code
                                        // being covered, and normally components don't have any "test"
                                        // level-2 to be covered. Only then it could be used.
```

</InvalidExample>

## Strings

Since string performance is not an issue in current versions of PHP, the main criteria for strings is readability.

### Single quotes

Always use single quotes when a string is literal, or contains a lot of double quotes (like HTML):

<ValidExample>

```php
$a = 'Example string';
echo '<span class="'.s($class).'"></span>';
$html = '<a href="http://something" title="something">Link</a>';
```

</ValidExample>

### Double quotes

These are a lot less useful in Moodle. Use double quotes when you need to include plain variables or a lot of single quotes.

<ValidExample>

```php
echo "<span>$string</span>";
$statement = "You aren't serious!";
```

</ValidExample>

Complex SQL queries should be always enclosed in double quotes.

<ValidExample>

```php
$sql = "SELECT e.*, ue.userid
          FROM {user_enrolments} ue
          JOIN {enrol} e ON (e.id = ue.enrolid AND e.enrol = 'self' AND e.customint2 > 0)
          JOIN {user} u ON u.id = ue.userid
         WHERE :now - u.lastaccess > e.customint2";
```

</ValidExample>

### Variable substitution

Variable substitution can use either of these forms:

<ValidExample>

```php
$greeting = "Hello $name, welcome back!";

$greeting = "Hello {$name}, welcome back!";
```

</ValidExample>

### String concatenation

Strings must be concatenated using the "." operator.

<ValidExample>

```php
$longstring = $several . $short . 'strings';
```

</ValidExample>

If the lines are long, break the statement into multiple lines to improve readability. In these cases, put the "dot" at the end of each line.

<ValidExample>

```php
$string = 'This is a very long and stupid string because ' . $editorname .
    " couldn't think of a better example at the time.";
```

</ValidExample>

The dot operator may be used without any space to either side (as shown in the above examples), or with spaces on each side; whichever the developer prefers.

### Language strings

#### Capitals

Capitals should only be used when:

1. starting a sentence, or
1. starting a proper name, like Moodle.

```
// Correct.
Always look like this example.

// Incorrect.
Never Like This Example.
```

#### Structure

Strings should not be designed for UI concatenation, as it may cause problems in other languages. Each string should stand alone.

<InvalidExample>

```php title="Strings should not be designed to be concatenated to make a sentence"
// Incorrect.
$string['overduehandling'] = 'When time expires';
$string['overduehandlingautosubmit'] = 'the attempt is submitted automatically';
$string['overduehandlinggraceperiod'] = 'there is a grace period in which to submit the attempt, but not answer more questions';
$string['overduehandlingautoabandon'] = 'that is it. The attempt must be submitted before time expires, or it is not counted';
```

</InvalidExample>

<ValidExample>

```php title="Strings should be complete without concatenation"
// Correct.
$string['overduehandling'] = 'Time expiry behaviour';
$string['overduehandlingautosubmit'] = 'Unfinished attempts will be autosubmitted immediately';
$string['overduehandlinggraceperiod'] = 'Unfinished attempts have a short grace period to be submitted for grading';
$string['overduehandlingautoabandon'] = 'Unfinished attempts are immediately discarded';
```

</ValidExample>

#### Whitespace

Language strings should not contain or even rely on any leading or trailing whitespace. Such strings are not easy to be translated in the translation tool, AMOS.

## Objects

### Importing `stdClass`

For namespaced classes, importing `stdClass` via the `use` operator or using its fully qualified name are both acceptable.

<ValidExample>

```php
use stdClass;

// Using stdClass via import.
$foo = new stdClass();
```

```php
// Using stdClass with its fully qualified name.
$foo = new \stdClass();
```

</ValidExample>

### Dynamic properties

`stdClass` objects can be created with dynamic properties by casting an associative array to an object or by instantiating a new `stdClass` object and assigning properties to it.

<ValidExample>

```php
// Object casting.
$foo = (object) [
    'bar' => 1,
    'baz' => 2,
];

// Setting dynamic properties.
$foo = new stdClass();
$foo->bar = 1;
$foo->baz = 2;
```

</ValidExample>

### Empty objects

Generic PHP objects can be instantiated by the `new` operator or created by casting an empty array to an object. Both can be used in a number of situations.

<ValidExample>

Empty object creation

```php
// Via empty array object casting.
$foo = (object) [];

// Via the `new` operator.
$foo = new stdClass();
```

Empty objects within an object with properties or arrays

```php
// Empty object within an object.
$foo = (object) [];
$foo->bar = (object) [];

// Empty object within an array.
$boo = [
    'far' => (object) [],
];
```

```php
// Instantiating an empty object within an object.
$foo = new stdClass();
$foo->bar = new stdClass();

// Instantiating an empty object within an array.
$boo = [
    'far' => new stdClass(),
];
```

Returning empty objects

```php
/**
 * A function that returns an empty object via casting.
 *
 * @return stdClass
 */
function foo() {
    return (object) [];
}

/**
 * A function that returns an empty object by instantiating `stdClass` is also fine.
 *
 * @return stdClass
 */
function bar() {
    return new stdClass();
}
```

</ValidExample>

## Arrays

### Array syntax

When declaring new arrays, the Short Array Syntax should be used.

<ValidExample>

```php
// Empty array.
$myarray = [];

// Array with values.
$myarray = ['some', 'value'];

// Associative arrays.
$myarray = [
  'some' => 'value',
];

// Empty object from casting an empty array.
$myobject = (object) [];

// Object from casting an array.
$myobject = (object) ['some', 'value'];

// Object from casting an associative array.
$myobject = (object) [
  'some' => 'value',
];
```

</ValidExample>

The Long Array Syntax should not be used for new code, _but may be used_ where it matches surrounding code.

<InvalidExample>

```php
// Using the long array syntax when creating arrays.
$myarray = array();
$myarray = array('some', 'value');
$myarray = array(
  'some' => 'value',
);

// Using the long array syntax when casting arrays to objects.
$myarray = (object) array();
$myarray = (object) array('some', 'value');
$myarray = (object) array(
  'some' => 'value',
);
```

</InvalidExample>

:::note

See MDLSITE-4776 for the discussion on this coding style change.

:::

### Numerically indexed arrays

When declaring arrays, a trailing space must be added after each comma delimiter to improve readability:

<ValidExample>

```php
$myarray = [1, 2, 3, 'Stuff', 'Here'];
```

</ValidExample>

Multi-line indexed arrays are fine, but pad each successive lines as above with an 4-space indent:

<ValidExample>

```php
$myarray = [1, 2, 3, 'Stuff', 'Here',
    $a, $b, $c, 56.44, $d, 500];
```

</ValidExample>

:::note

The example above also can be written as follows:<br/>
(with special attention to the last line having a trailing comma to extend the list of items later with a cleaner diff)

<ValidExample>

```php
$myarray = [
    1, 2, 3, 'Stuff', 'Here',
    $a, $b, $c, 56.44, $d, 500,
];
```

</ValidExample>

:::

In any case, brackets and newlines need to be balanced, irrespectively of the number of elements per line.

### Associative arrays

Use multiple lines if this helps readability. For example:

<ValidExample>

```php
$myarray = [
    'firstkey' => 'firstvalue',
    'secondkey' => 'secondvalue',
];
```

</ValidExample>

## Classes

### Class declarations

- Classes must be named according to Moodle's naming conventions.
- Classes must go under their respective "component/classes" dir to get the benefits of autoloading and [namespacing](#namespaces). There aren't such luxuries out from there.
- Each php file will contain only one class (or interface, or trait, etc.). Unless it's part of old APIs where multi-artifact files were allowed.
- The brace should always be written on the line beside the class name.
- Every class must have a documentation block that conforms to the PHPDocumentor standard.
- All code in a class must be indented with 4 spaces.
- Placing additional code (side-effects) in class files is only permitted to require artifacts not provided via autoloading (old classes or libs out from the "classes" directories and not loaded by Moodle's bootstrap). In those cases, the use of the [`MOODLE_INTERNAL` check](#require--include) will be required.

<ValidExample>

```php
/**
 * Short description for class.
 *
 * Long description for class (if any)...
 *
 * @package    mod_mymodule
 * @copyright  2008 Kim Bloggs
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class sample_class {
    // All contents of class
    // must be indented 4 spaces.
}
```

</ValidExample>

:::note

The classes PHPDoc style is defined with more detail in the [Documentation and comments / Classes](#phpdoc-classes) section in this document.

:::

### Class member variables

Member variables must be named according to Moodle's variable naming conventions.

Any variables declared in a class must be listed at the top of the class, above the declaration of any methods.

The var construct is not permitted. Member variables always declare their visibility by using one of the **private**, **protected**, or **public** modifiers. Giving access to member variables directly by declaring them as public is permitted but discouraged in favor of accessor methods (set/get).

## Functions and methods

### Function and method declaration

Functions must be named according to the Moodle function naming conventions.

Methods inside classes must always declare their visibility by using one of the private, protected, or public modifiers.

As with classes, the brace should always be written on same line as the function name.

Don't leave spaces between the function name and the opening parenthesis for the arguments.

The return value must not be enclosed in parentheses. This can hinder readability, in additional to breaking code if a method is later changed to return by reference.

Return should only be one data type. It is discouraged to have multiple return types

<ValidExample>

```php
/**
 * Documentation Block Here
 */
class sample_class {

    /**
     * Documentation Block Here
     */
    public function sample_function() {
        // All contents of function
        // must be indented four spaces.
        return true;
    }
}
```

</ValidExample>

### Function and method usage

Function arguments should be separated by a single trailing space after the comma delimiter.

<ValidExample>

```php
three_arguments(1, 2, 3);
```

</ValidExample>

### Magic methods

Magic methods are heavily discouraged, justification will be required when used. Note: laziness will not be a valid argument.

(See [MDL-52634](https://tracker.moodle.org/browse/MDL-52634) for discussion of rationale)

## Control statements

In general, use white space liberally between lines to add clarity.

### If / else

Put a space before and after the control statement in brackets, and separate the operators by spaces within the brackets. Use inner brackets to improve logical grouping if it helps.

Indent with four spaces.

:::note Do not use `elseif`

Always use the `else if` variant

:::

Always use braces (even if the block is one line and PHP doesn't require it). The opening brace of a block is always placed on the same line as its corresponding statement or declaration.

<ValidExample>

```php
if ($x == $y) {
    $a = $b;
} else if ($x == $z) {
    $a = $c;
} else {
    $a = $d;
}
```

</ValidExample>

### Switch

Put a space before and after the control statement in brackets, and separate the operators by spaces within the brackets. Use inner brackets to improve logical grouping if it helps.

Always indent with four spaces. Content under each case statement should be indented a further four spaces.

<ValidExample>

```php
switch ($something) {
    case 1:
        break;

    case 2:
        break;

    default:
        break;
}
```

</ValidExample>

### Foreach

As above, uses spaces like this:

<ValidExample>

```php
foreach ($objects as $key => $thing) {
    process($thing);
}
```

</ValidExample>

### Ternary Operator

The ternary operator is only permitted to be used for **short**, **simple to understand** statements. If the statement can't be understood in one sentence, use an if statement instead.

Whitespace must be used around the operators to make it clear where the operation is taking place.

<ValidExample>

```php
$username = isset($user->username) ? $user->username : *; **
$users = is_array($users) ? $users : [$users];
```

</ValidExample>

<InvalidExample>

```php
$toload = (empty($CFG->navshowallcourses))?self::LOAD_ROOT_CATEGORIES:self::LOAD_ALL_CATEGORIES;
$coefstring = ($coefstring==* or $coefstring=='aggregationcoefextrasum') ? 'aggregationcoefextrasum' : 'aggregationcoef';
```

</InvalidExample>

:::note

Since PHP 7.0, many of those `isset()` ternaries can be changed to use the new shorthand [null coalescing operator](https://www.php.net/manual/en/migration70.new-features.php#migration70.new-features.null-coalesce-op) so, the above is equivalent to:

```php
$username = $user->username ?? *;
```

:::

## Require / include

Each file that is accessed via browser should start by including the main config.php file.

<ValidExample>

```php
require(__DIR__ . '/../../config.php');
```

</ValidExample>

Any other include/require should use a path starting with `__DIR__` or an absolute path starting with `$CFG->dirroot` or `$CFG->libdir`. Relative includes starting with "../" can [sometimes behave strangely under PHP](https://www.php.net/manual/en/function.include.php), so should not be used. Our [CLI scripts](https://docs.moodle.org/dev/CLI_scripts) must not use relative config.php paths starting with "../".

For library files in normal usage, require_once should be used (this is different from config.php which should always use 'require' as above). Examples:

<ValidExample>

```php
require_once(__DIR__ . '/locallib.php');
require_once($CFG->libdir . '/filelib.php');
```

</ValidExample>

Includes should generally only be done at the top of files or inside functions/methods that need them. Using include/require in the middle of a file in global scope very hard to audit the security of the code.

All other scripts with the exception of imported 3rd party libraries and files without *side-effects* (that is single class definitions, interfaces or traits), should use following code at the very top to prevent direct execution which might reveal error messages on misconfigured production servers.

```php
defined('MOODLE_INTERNAL') || die();
```

:::info Side-effects

The term side-effects refers to any global scope code not being:

- the `namespace`;
- a `use` statements;
- namespace constants; or
- `strict_types` declarations (declarations in general).

:::

Please note that the existence or absence of side-effects in a file only affects as explained above, at code level. It shouldn't be considered in other parts of the coding style unless specifically mentioned.

## Documentation and comments

Code documentation explains the code flow and the purpose of functions and variables. Use it whenever practical.

### PHPDoc

Moodle stays as close as possible to "standard" [PHPDoc format](https://www.phpdoc.org/) to document our files, classes and functions. This helps IDEs (like Netbeans or Eclipse) work properly for Moodle developers, and also allows us to generate web documentation automatically.

PHPDoc has a number of tags that can be used in different places (files, classes and functions). We have some particular rules for using them in Moodle that you must follow:

#### Types

Some of the tags below (@param, @return, etc.) do require the specification of a valid php type and a description. All these are allowed:

- PHP primitive types: int, bool, string, etc.
- PHP complex types: array, stdClass (not Array, object).
- PHP classes:full or relative (to current namespace) class names.
- true, false, null (always lowercase).
- static: for methods returning a new instance of the child/caller class.
- self: for methods returning a new instance of the parent/called class.
- $this: for methods returning the current instance of the class.
- void: for methods with a explicit empty "return" statement.

Also, there are some basic rules about how to use those types:

- We use [short type names](https://www.php.net/manual/en/language.types.type-juggling.php) (bool instead of boolean, int instead of integer).
- With cases represented as array of given type, it's highly recommended to document them as type[] instead of the simpler and less informative "array" alternative (for example `int[]` or `stdClass[]`).
- When multiple different types are possible, they must be separated by a vertical bar (pipe) (for example `@return int|false`).
- All primitives and keywords must be lowercase. The case of the complex types and classes must match the original.

<ValidExample>

```php
/**
 * A method with correct type declarations.
 *
 * @param stdClass $obj Some object.
 * @param array $arr Some array.
 * @param bool $boo Some boolean.
 * @param int $num Some integer.
 * @return static Returns the instance of the class itself (PHP 8.0 and above).
 */
 ```

</ValidExample>

<InvalidExample>

```php
/**
 * Some method with incorrect type declarations.
 *
 * @param object $obj An object that should be using `stdClass` for its type declaration.
 * @param Array $arr An array that should be using `array` for its type declaration.
 * @param boolean $boo A boolean that should be using `bool` for its type declaration.
 * @param integer $num An integer that should be using `int` for its type declaration.
 * @return BOOL Returns a boolean that should be declared using the lowercase `bool`.
 */
 ```

</InvalidExample>

#### Tags

##### `@copyright`

These include the year and copyright holder (creator) of the original file. Do not change these in existing files!

<ValidExample>

```
  @copyright 2008 Kim Bloggs
```

</ValidExample>

##### `@license`

These must be GPL v3+ and use this format:

<ValidExample>

```
  @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
```

</ValidExample>

##### `@param`

Don't put hyphens or anything fancy after the variable name, just a space.

<ValidExample>

```
  @param [[#Types|type]] $name Description.
```

</ValidExample>

##### `@return`

The `@return` tag is mandatory if the function has a return statement, but can be left out if it does not have one.

The description portion is optional, it can be left out if the function is simple and already describes what is returned.

<ValidExample>

```
  @return [[#Types|type]] Description.
```

</ValidExample>

##### `@var`

The `@var` tag is used to document both class properties and constants, don't use `@const` for the later.

<ValidExample>

```
  @var [[#Types|type]] Description.
```

</ValidExample>

Exceptionally, when none of the available [types](https://docs.moodle.org/dev/#Types) define the returned value, inline @var phpdocs (within the body of the methods) providing type hinting are allowed to the returned type. Don't abuse!

##### `@uses`

If a function uses die or exit, please add this tag to the docblock to help developers know this function could terminate the page:

<ValidExample>

```
  @uses exit
```

</ValidExample>

##### `@access`

The access can be used to specify access control for an element

1. Should only be used when the method definition does not already specify access control.
1. In the case of functions, specifying public access is redundant and so should be avoided.

<ValidExample>

```
  @access private
```

</ValidExample>

##### `@package`

The package tag should always be used to label php files with the correct [Frankenstyle](./frankenstyle.md) component name. Full rules are explained on that page, but in summary:

1. If the file is part of any component plugin, then use the plugin component name (for example **mod_quiz** or **gradereport_xls**)
1. If the file is part of a core subsystem then it will be core_xxxx where xxxx is the name defined in get_core_subsystems(). (for example **core_enrol** or **core_group**)
1. If the file is one of the select few files in core that are not part of a subsystem (such as lib/moodlelib.php) then it just as a package of **core**.
1. Each file can only be part of ONE package.

(We do not have standards for `@subpackage` at all. You can use within your @package how you like.)

<ValidExample>

```
  @package gradereport_xls
```

</ValidExample>

##### `@category`

We use `@category` only to highlight the public classes, functions or files that are part of one of our [Core APIs](/docs/apis), or that provide good example implementations of a Core API. The value must be one of the ones on the [API guides](/docs/apis) page.

<ValidExample>

```php
  @category preferences
```

</ValidExample>

##### `@since`

When adding a new classes or function to the Moodle core libraries (or adding a new method to an existing class), use a `@since` tag to document which version of Moodle it was added in. For example:

<ValidExample>

```php
  @since Moodle 2.1
```

</ValidExample>

##### `@see`

If you want to refer the user to another related element (include, class, function, define, method, variable), but not to URLs, then you can use `@see`.

<ValidExample>

```
  @see some_other_function()
```

</ValidExample>

This tag can be used inline too, within phpdoc comments.

<ValidExample>

```php
   /**
    * This function uses {@see get_string()} to obtain the currency names...
    * .....
```

</ValidExample>

##### `@link`

If you want to refer the user to an external URL, but not to related elements, use @link.

<ValidExample>

```
  @link https://docs.moodle.org/dev/Core_APIs
```

</ValidExample>

This tag can be used inline too, within phpdoc comments.

<ValidExample>

```php
   /**
    * For details about the implementation below, visit {@link https://docs.moodle.org/dev/Core_APIs} and read...
    * .....
```

</ValidExample>

##### `@deprecated` (and `@todo`)

When deprecating an old API, use a `@deprecated` tag to document which version of Moodle it was deprecated in, and add `@todo` and `@see` if possible. Make sure to mention relevant MDL issues. For example:

<ValidExample>

```php
/**
 * ...
 * @deprecated since Moodle 2.0 MDL-12345 - please do not use this function any more.
 * @todo MDL-22334 This will be deleted in Moodle 2.2.
 * @see class_name::new_function()
 */
```

</ValidExample>

If it is important that developers update their code, consider also adding a `debugging('...', DEBUG_DEVELOPER);` call to repeat the deprecated message. If the old function can no longer be supported at all, you may have to throw a coding_exception. There are examples of the various options in `lib/deprecatedlib.php`.

##### `@throws`

This tag is valid and can be used optionally to indicate the method or function will throw and exception. This is to help developers know they may have to handle the exceptions from such functions.

##### Other specific tags

There are some tags that are only allowed within some contexts and not globally. More precisely:

- `@Given`, `@When`, `@Then`, within the [behat steps definitions](../../tools/behat/writing.md#writing-new-acceptance-test-step-definitions).
- `@covers`, `@coversDefaultClass`, `@coversNothing`, `@uses` to better control coverage within [unit tests](https://docs.moodle.org/dev/Writing_PHPUnit_tests#Generators).
- `@dataProvider` and `@testWith`, to provide example data and expectations, within [unit tests](https://docs.moodle.org/dev/Writing_PHPUnit_tests#Generators).
- `@depends`, to express dependencies between tests, where each producer returned data in passed to consumers. See [`@depends` examples](https://docs.phpunit.de/en/9.6/writing-tests-for-phpunit.html#writing-tests-for-phpunit-examples-stacktest2-php) for more information.
- `@group`, for easier collecting unit tests together, following the guidelines in the [PHPUnit MoodleDocs](../../tools/phpunit/index.md#using-the-group-annotation).
- `@requires`, to specify unit test requirements and skip if not fulfilled. See [`@requires` usages](https://docs.phpunit.de/en/9.6/incomplete-and-skipped-tests.html#incomplete-and-skipped-tests-requires-tables-api) for more information.
- `@runTestsInSeparateProcesses` and `@runInSeparateProcess`, to execute an individual test or a testcase in isolation. To be used only when strictly needed.

### Files

All files that contain PHP code should contain, without any blank line after the php open tag, a full GPL copyright statement at the top, plus a SEPARATE docblock right under it containing a:

1. short one-line description of the file
1. longer description of the file
1. `@package` tag (required)
1. `@category` tag (only when everything in the file is related to one of the [Core APIs](/docs/apis))
1. `@copyright` (required)
1. `@license` (required)

For files containing only one artifact, the file phpdoc block is optional as long as the artifact (class, interface, trait, etc.) is documented. Read the following "Classes" section about that case.

```php
<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle. If not, see <https://www.gnu.org/licenses/>.

/**
 * This is a one-line short description of the file.
 *
 * You can have a rather longer description of the file as well,
 * if you like, and it can span multiple lines.
 *
 * @package    mod_mymodule
 * @category   backup
 * @copyright  2008 Kim Bloggs
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
```

### Classes {#phpdoc-classes}

All classes must have a complete docblock like this:

<ValidExample>

```php
/**
 * Short description for class.
 *
 * Long description for class (if any)...
 *
 * @package    mod_mymodule
 * @category   backup
 * @copyright  2008 Kim Bloggs
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class policy_issue {
```

</ValidExample>

For files containing only one artifact (class, interface, trait, etc.), specifically for all the files within `classes` directories, but also any other file fulfilling the condition anywhere else, it will be enough with the class phpdoc block. The file phpdoc block will be considered optional at all effects, giving to the class one precedence.

The [@package](https://docs.moodle.org/dev/#@package), [@copyright](https://docs.moodle.org/dev/#@copyright) and [@license](https://docs.moodle.org/dev/#@license) tags (and the optional [@category](https://docs.moodle.org/dev/#@category) tag ), as shown in the example above, must be present always in the file (in whichever docblock, but all together).

### Properties

All properties should have a docblock with the following minimum information:

<ValidExample>

```php
class example {
    /** @var string This variable does something */
    protected $something;
}
```

</ValidExample>

or

<ValidExample>

```php
class example {
    /**
     * This variable does something and has a very long description which can
     * wrap on multiple lines
     * @var string
     */
    protected $something;
}
```

</ValidExample>

Even if there are several properties all sharing something in common, do not use [DocBlock templates](https://en.wikipedia.org/wiki/PHPDoc#DocBlock_Templates). Instead, document every property explicitly as in the following example:

<ValidExample>

```php
class zebra {
    /** @var int The number of white stripes */
    protected $whitestripes = 0;

    /** @var int The number of black stripes */
    protected $blackstripes = 0;

    /** @var int The number of red stripes */
    protected $redstripes = 0;
}
```

</ValidExample>

### Constants

Class constants should be documented in the following way:

<ValidExample>

```php
class sam {
   /**
    * This is used when Sam is in a good mood.
    */
   const MOOD_GOOD = 0;
}
```

</ValidExample>

### Functions

All functions and methods should have a complete docblock like this:

<ValidExample>

```php
/**
 * The description should be first, with asterisks laid out exactly
 * like this example. If you want to refer to a another function,
 * use @see as below. If it's useful to link to Moodle
 * documentation on the web, you can use a @link below or also
 * inline like this {@link https://docs.moodle.org/dev/something}
 * Then, add descriptions for each parameter and the return value as follows.
 *
 * @see clean_param()
 * @param int   $postid The PHP type is followed by the variable name
 * @param array $scale The PHP type is followed by the variable name
 * @param array $ratings The PHP type is followed by the variable name
 * @return bool A status indicating success or failure
 */
```

</ValidExample>

You must include a description even if it appears to be obvious from the `@param` and/or `@return` lines.

An exception is made for overridden methods which make no change to the meaning of the parent method and maintain the same arguments/return values. In this case you should omit the comment completely, and apply the `#[\Override]` attribute. This can safely be applied in older versions of PHP before the attribute was supported. Use of the `@inheritdoc` or `@see` tags is explicitly forbidden as a replacement for any complete docblock.

<ValidExample>

```php
class example implements templatable {

    #[\Override]
    public function export_for_template(renderer_base $output) {
        return ['foo' => 'bar'];
    }
}
```

</ValidExample>

### Defines

All defines should be documented in the following way:

<ValidExample>

```php
/**
 * PARAM_INT - integers only, use when expecting only numbers.
 */
define('PARAM_INT', 'int');

/**
 * PARAM_ALPHANUM - expected numbers and letters only.
 */
define('PARAM_ALPHANUM', 'alphanum');
```

</ValidExample>

### Inline comments

<!-- vale Microsoft.Ellipses = NO -->
Inline comments must use the "// " (2 slashes + whitespace) style, laid out neatly so that it fits among the code and lines up with it.
The first line of the comment must begin with a capital letter (or a digit, or '...') and the comment must end with a proper punctuation character. Permitted final characters are '.', '?' or '!'.
<!-- vale Microsoft.Ellipses = YES -->

<ValidExample>

```php
function forum_get_ratings_mean($postid, $scale, $ratings = null) {
    if (!$ratings) {

        $ratings = [];     // Initialize the empty array.

        $rates = $DB->get_records('forum_ratings', ['post' => $postid)];

        // ... then process each rating in
        // turn.
        foreach ($rates as $rate) {
            do_something_with($rate);
        }

        // Do we need to tidy up?
        if (!empty($rates))
            // 42 more things happen here!
            finsh_up();
        }
```

</ValidExample>

<ValidExample>

```php title="An example of correct single-line comment styling"
// Comment explaining this piece of code.
```

</ValidExample>

<InvalidExample>

```php title="Example of incorrect commenting"
/*  Comment explaining this piece of code. */
# Comment explaining this piece of code.
// comment explaining this piece of code (without capital letter and punctuation)
```

</InvalidExample>

If your comment is due to some MDL issue, please feel free to include the correct MDL-12345 in your comment. This makes it easier to track down decisions and discussions about things.

#### Using TODO

This is especially important if you know an issue still exists in that code that should be dealt with later. Use a TODO along with a MDL code to mark this. For example:

<ValidExample>

```php
// TODO MDL-12345 This works but is a bit of a hack and should be revised in future.
```

</ValidExample>

If you have a big task that is nearly done, apart a few TODOs, and you really want to mark the big task as finished, then you should file new tracker tasks for each TODO and change the TODOs comments to point at the new issue numbers.

There is a nice "to-do checker" reporting tool, restricted to admins and available via web @ [`lib/tests/other/todochecker.php`](https://github.com/moodle/moodle/blob/main/lib/tests/other/todochecker.php).

Finally, don't forget to add any MDL-12345 used by your TODOs (and @todos too, unless part of the [deprecation process](../deprecation/index.md), those are handled apart) to the "Review TODOs Epic": MDL-47779 (requires login to see the issues)

### CVS keywords

We have stopped using CVS keywords such as $Id$ in Moodle 2.0 completely.

## Exceptions

Use exceptions to report errors, especially in library code.

Throwing an exception has almost exactly the same effect as calling print_error(), but it is more flexible. For example, the caller can choose to catch the exception and handle it in some way. It also makes it easier to write unit tests.

:::note

Since 2021, it has been [agreed to deprecate `print_error()`](https://tracker.moodle.org/browse/MDL-69936) and, instead, to `throw moodle_exception()` is the correct way to proceed.

:::

Any exception that is not caught will trigger an appropriate call to print_error, to report the problem to the user. Exceptions "error codes" will be translated only when they are meant to be shown to final users.

Do not abuse exceptions for normal code flow. Exceptions should only be used in erroneous situations.

### Exception classes

We have a set of custom exception classes. The base class is moodle_exception. You will see that the arguments you pass to new `moodle_exception(...)` are very similar to the ones you would pass to print_error. There are more specific subclasses for particular types of error.

To get the full list of exception types, search for the regular expression 'class +\w+_exception +extends' or ask your IDE to list all the subclasses of moodle_exception.

Where appropriate, you should create new subclasses of moodle_exception for use in your code.

<Since version="4.5" issueNumber="MDL-81903" />

If you create a custom exception class it *may* live in the `classes/exception/` directory, and be namespaced in `<plugin>/exception/`

A few notable exception types:

- `moodle_exception`: base class for exceptions in Moodle. Use this when a more specific type is not appropriate.
- `coding_exception`: thrown when the problem seems to be caused by a developer's mistake. Often thrown by core code that interacts with plugins. If you throw an exception of this type, try to make the error message helpful to the plugin author, so they know how to fix their code.
- `dml_exception` (and subclasses): thrown when a database query fails.
- `file_exception` thrown by the File API.

## Dangerous functions and constructs

PHP includes multiple questionable features that are highly discouraged because they are very often source of serious security problems.

1. do not use `eval()` function - language packs are exception (to be solved in future).
1. do not use `preg_replace()` with /e modifier - use callbacks in order to prevent unintended PHP execution.
1. do not use backticks for shell command execution.
1. do not use `goto`, neither the operator neither labels - use other programming techniques to control the execution flow.

## Policy about coding-style only fixes

Way before this coding-style guide was defined and agreed, a lot of code had been written already. Obviously such code does not follow the coding-style at all. While **we enforce conformance for all the new code**, we are not paranoid about the status of all the previous one.

In any case, in order to normalize the (progressive, non-critical) transition, a policy issue (MDL-43233) was created and agreed about. And these are the rules to apply to coding-style only changes:

1. Related coding-style changes (same lines, a variable within a method/function, adjacent comments, etc.) within a real issue are allowed.
1. Unrelated coding-style changes (other methods, blocks of code, comments, etc.) within a real issue are only accepted for main and in a separate commit.
1. Coding-style only issues are only accepted for main along the first 2 months of every cycle.

## Git commits

Constructing a clear and informative commit is an important aspect of the craft of creating open source code and the history of commits is a vital part of the communication between developers. Time should be spent on crafting commits appropriately and using the git tools to achieve it.

Git commits should:

- Tell a perfect, cleaned up version of the history. As if the code was written perfectly first time.
- Include the MDL-xxxx issue number associated with the change
- Include CODE AREA when appropriate. (Code area, is just a short name for the area of Moodle that this change affects. It can be a component name if that makes sense, but does not have to be. Remember that your audience here is humans not computers, so if a shortened version of a component name is more readable and distinctive, use that instead.)
- Be formatted as:

<ValidExample>

```
MDL-xxxx CODE AREA: short summary (72 chars soft limit)

Blank line on line 2, followed by an unlimited length detailed explanation
following if necessary. This section might include the motivation for the change
and contrast it with the previous behaviour.
```

</ValidExample>

Git commits should not:

- Include changes from bugs found and fixed before integration
- Include many separate revisions to the same lines of code for a single issue
- Arbitrarily split when part of a atomic set of logical changes

For more guidance, see [Commit cheat sheet](https://docs.moodle.org/dev/Commit_cheat_sheet)

## Credits

This document was drawn from the following sources:

1. The original [Coding guidelines](https://docs.moodle.org/en/index.php?title=Development:Coding&oldid=976) page
1. The [Zend guidelines](http://framework.zend.com/manual/en/coding-standard.html) and
1. Feedback from all core Moodle developers

## See also

- [JavaScript Coding Style](https://docs.moodle.org/dev/Javascript/Coding_Style)
- [CSS Coding Style](https://docs.moodle.org/dev/CSS_Coding_Style)
- [SQL coding style](./sql.md)
- [Coding](../../policies.md)
- [CodeSniffer](../../policies/codingstyle/index.md)
- [Code Checker plugin](https://moodle.org/plugins/local_codechecker)
- [Accessibility coding guidelines](../accessibility.md#coding-standards)
