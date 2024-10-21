---
title: Deprecation API
tags:
- deprecation
---

<!-- markdownlint-disable no-inline-html -->

<Since version="4.4" issueNumbers="MDL-80005" />

When deprecating a code feature, it is often desirable to include a reasonable amount of information, and to provide a consistent deprecation message.

In some cases it is also desirable to check if a called class, or method, has been marked as deprecated.

One way to simplify this is through use of the `\core\attribute\deprecated` PHP attribute, which can be used in conjunction with the `\core\deprecation` class.

:::note

Please note that the attribute does _not_ replace the `@deprecated` phpdoc annotation. They serve slightly different purposes.

:::

The attribute can be used to specify information including:

- the replacement for that feature
- the version that the feature was deprecated in
- the relevant MDL
- the reason for deprecation
- whether the deprecation is final

## The `deprecated` attribute

The attribute is a Moodle PHP Attribute and can be applied to:

- classes, traits, interfaces, and enums
- enum cases
- global functions
- class constants, properties, and methods

```php title="Example attribute usage"
// On a global function:
#[\core\attribute\deprecated('random_bytes', since: '4.3')]
function random_bytes_emulate($length) {
    // Replaced by random_bytes since Moodle 4.3.
}

// On a class:
#[\core\attribute\deprecated(replacement: null, since: '4.4', reason: 'This functionality has been removed.')]
class example {
    #[\core\attribute\deprecated(
        replacement: '\core\example::do_something',
        since: '4.3',
        reason: 'No longer required',
        mdl: 'MDL-12345',
    )]
    public function do_something(): void {}
}

// On an enum case:
enum example {
    #[\core\attribute\deprecated('example::OPTION', since: '4.4', final: true)]
    case OPTION;
}
```

## Inspecting the attribute

The `\core\deprecation` class contains helper methods to inspect for use of the deprecated attribute and allows usage including:

- checking if a feature is deprecated
- emitting a deprecation notice if a feature is deprecated
- fetching an instance of the attribute to query further

```php title="Examples of usage"
// A method which has been initially deprecated, and replaced by 'random_bytes'. It should show debugging.
/** @deprecated since 4.3 */
#[\core\attribute\deprecated('random_bytes', since: '4.3')]
function random_bytes_emulate($length) {
    \core\deprecation::emit_deprecation_if_present(__FUNCTION__);
    return random_bytes($length);
}

// A method which has been finally deprecated and should throw an exception.
/** @deprecated since 2.7 */
#[\core\attribute\deprecated(replacement: 'Events API', since: '2.3', final: true)]
function add_to_log() {
    \core\deprecation::emit_deprecation_if_present(__FUNCTION__);
}

// Checking when an enum case is deprecated:
\core\deprecation::is_deprecated(\core\param::RAW); // Returns false.
\core\deprecation::is_deprecated(\core\param::INTEGER); // Returns true.

// On an collection of items.
foreach ($values as $value) {
    \core\deprecation::emit_deprecation_if_present($value);
    $value->do_things();
}

// Checking if a class is deprecated:
\core\deprecation::is_deprecated(\core\task\manager::class); // Returns false.

// Checking if an instantiated class is deprecated:
\core\deprecation::is_deprecated(new \moodle_url('/example/'));

// Checking if a class method is deprecated:
\core\deprecation::is_deprecated([\moodle_url::class, 'out']);
\core\deprecation::is_deprecated([new \moodle_url('/example/'), 'out']);
```

This functionality is intended to simplify deprecation of features such as constants, enums, and related items which are called from centralised APIs and difficult to detect as deprecated.
