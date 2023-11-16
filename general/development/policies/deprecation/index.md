---
title: Deprecation
tags:
  - Processes
  - Core development
  - Deprecation
---

:::info What is deprecation?

[Deprecation](http://en.wikipedia.org/wiki/Deprecation), in its programming sense, is the process of taking older code and marking it as no longer being useful within the codebase, usually because it has been superseded by newer code. The deprecated code is not immediately removed from the codebase because doing so may cause regression errors.

:::

## Why is deprecation needed?

import { ValidExample, InvalidExample, TabItem, Tabs } from '@site/src/components';

In an open source project, the end use of the codebase varies. People may have customisations and plugins that depend on a function that has been targeted for deprecation. Rather than simply removing a function, we must gracefully deprecate the function over a period covered by a number of released versions.

## What is Moodle's deprecation policy?

- Deprecations should only be on master, not on stables (exceptions may be made for some external service integrations)
- Deprecations apply to all public APIs, classes, and files.
- Removal of a function, class, or file may only be considered after a minimum of 4 major releases since the deprecation. Example: anything deprecated in 3.2 means that it will be removed in 3.6
- All deprecations should emit debugging notices where possible
- All deprecations should be noted in the relevant upgrade.txt

## Moodle Core deprecation process

Once it is decided that a function should be deprecated, a two-step process should be followed.

:::note

Both steps should always happen as earlier as possible in the 6-months period between major releases, so all developers will have time to adjust their code and ensure it will work in the next release. Obviously, **no changes will be allowed after code freeze** (the APIs must remain 100% unmodified after it).

:::

### Step 1. Immediate action

Deprecation affects only the current master version, in other words, the deprecation only becomes effective after the next [major release](../../../releases.md).

- If the function is not a member of a class (in other words, it is an independent function), it should be moved, with its PHPDoc and all comments, to `lib/deprecatedlib.php`, which is included everywhere. If the function is a class member, it will need to be deprecated in its current location.
  - Deprecated behat step definitions should be moved to `lib/tests/behat/behat_deprecated.php`, including a call to `behat_deprecated::deprecated_message()` proposing an alternative to the deprecated method.
- If an entire class is being deprecated, the following actions should be done:
  - Add @deprecated tag on class level PHPDoc block
  - Add @deprecated tag on the PHPDoc block of all public methods
  - Add debugging on all of the public methods
- Besides, if the entire class is being moved (for example, moving multiple class definitions from a monolithic file in to individual files), follow the process for [renaming classes](/docs/apis/commonfiles#dbrenamedclassesphp).
- A debugging message should be added to the function so that, when [developer debugging mode](https://docs.moodle.org/en/Debugging) is on, attention is drawn to the deprecation. The message should state that the function being called has been deprecated. The message should help a developer whose code currently calls the function that has gone. Tell them what they should do instead.

```
 debugging('foobar() is deprecated. Please use foobar::blah() instead.', DEBUG_DEVELOPER);
 ```

- If the deprecated function has been replaced with a new function, ideally the new function should be called from the deprecated function, so that the new functionality is used. This will make maintenance easier moving forward.
- A `@deprecated` tag should be added to the PHPDoc for the function description so that IDEs describing the function will note that it is deprecated, documenting which version it was deprecated in and the MDL issue associated with it. See the guidelines in [Coding style](../codingstyle/index.md#deprecated-and-todo).
- If the function is an external function, then an additional deprecation-specific method needs to be created and set to return true. See the [adding a web service to a plugin](/docs/apis/subsystems/external/writing-a-service#deprecation) docs on that process. You should continue to add the `@deprecated since x.x` tag to the docs of all three of the relevant external methods (parameters, main method, returns) to make it clear to IDEs that the function is deprecated.
- There will need to be an issue associated with the initial part of the deprecation. A second issue needs to be created to finish the job. The first issue will be linked to second issue. The second issue needs to be a sub-task of an appropriate [deprecation META](https://tracker.moodle.org/issues/?jql=%28summary%20~%20%22meta%22%20or%20type%20%3D%20Epic%29%20AND%20summary%20~%20%22together%20deprecated%22%20order%20by%20created&runQuery=true&clear=true).

:::note Example

If the current version is 3.1.2, the function will be marked as deprecated in 3.2 and should normally be removed for 3.6, so the second issue should be an issue in a deprecation epic for the 3.6 version ([MDL-54740](https://tracker.moodle.org/browse/MDL-54740)). This second issue should include instructions on how to remove the function so that when it comes time to do so, the task is trivial for any developer.

:::

- Check the body of the function being deprecated and look for additional function calls which have no other non-deprecated uses and may also be considered for deprecation. If they belong to the same code area they can be deprecated in the same issue.
- Last but not least, every deprecation should be documented in the corresponding `upgrade.txt` files **at least** once but, **ideally**, both on this initial/immediate deprecation and also on the final deprecation/removal.

Apart from the previous points, there are a few more optional but highly recommended steps:

- A `@todo` tag can be added linking to the issues created for further action.
- A `@see` tag can be added to point to the new apis that can be used.

:::caution

Longer deprecation periods can be considered for functions that are widely used.

:::

### Step 2. Final deprecation

- If a function has been marked as deprecated for `3.[x]` (eg. 3.1) and set for removal at `3.[x + 4]` (eg. 3.5), soon after the release of `3.[x + 3].1` (eg. 3.4.1), the `3.[x + 4]` deprecation META will be processed. This means that the deprecated function will undergo final deprecation before `3.[x + 4]`, but only in the master version. This allows any potential regressions caused by the final deprecation of the function to be exposed as soon as possible.
- When a function undergoes final deprecation, all content of the function should be removed. In the skeleton that remains, an error statement should be included that indicates that the function cannot be used anymore. You can also direct developers to the new function(s) in this message.

```
 throw new coding_exception('check_potential_filename() can not be used any more, please use new file API');
 ```

- All function parameters should be removed.
- Deprecated classes must be completely removed.
- The content of the PHPDoc should be removed, leaving only the `@deprecated` tag with the notice and, optionally, the replacement information. This includes all `@param`, `@return`, and other tags, as well as the description.
- External functions deprecation process is different from the standard deprecation and functions should be completely removed.
- Last but not least, every deprecation should be documented in the corresponding `upgrade.txt` files **at least** once but, **ideally**, both on the initial/immediate deprecation and also on this final deprecation/removal.

## Parameters deprecation

Whilst it is possible to deprecate individual method parameters, care must be taken in doing so.

If a method is overridden then it is often not possible to change parameters. This includes changing any type hint, or adding a new default value. Additionally, adding a default value to any argument is only possible if all remaining arguments are optional too.

:::tip

It is strongly advised to deprecate an entire method, rather than deprecating a single parameter.

:::

- Deprecated parameters **MUST** be retained, and **MUST NOT** be renamed
- The respective parameter phpDoc should be updated stating the parameter has been deprecated since version X.X and should not be used any more
- Update all calls to the affected function and either:
  - converting to use named parameters, removing the deprecated parameter; or
  - removing if at the end of a list of optional parameters.
- Add a mention to the corresponding `upgrade.txt` file, documenting that the deprecated parameter should not be used any more
- Add a mention to the [Developer Update notes](https://github.com/moodle/devdocs/blob/main/docs/devupdate.md), documenting that the deprecated parameter should not be used any more
- _Where possible_:
  - If a type was previously specified it should be altered to be made nullable
  - If the default value is not already `null`, then it should be updated to `null`
  - If the default value was not already `null`, and a non-null value is provided, a debugging notice should be emitted
- Where it is not possible to make the the type nullable, consider deprecating the method and creating a new one with the updated parameters

:::caution Changes to default values and types

The [Covariance and Contravariance rules for PHP](https://www.php.net/manual/en/language.oop5.variance.php) prevent changes to argument types and defaults when a class is extended and that method overridden.

When deprecating a method which is _likely_ to be extended, you should strongly consider deprecating the entire method and creating a replacement method with the updated arguments instead. This includes all renderer methods.

:::

<ValidExample>
  <Tabs>
    <TabItem value="original" label="Original">

```php
/**
 * Greet a user and their pets. Remind them how old they are.
 *
 * @param string $name The name of the individual
 * @param int $age The age of the individaul
 * @param string[] $pets A list of pets that the individual has
 * @return The greeting
 */
public function greet_person(
    string $name,
    int $age,
    array $pets = [],
}: string {
    return sprintf(
        "A big, warm, welcome to %s who, at the grand old age of %d, has %d pets!",
        $name,
        $age,
        count($pets),
    );
}
```

  </TabItem>
  <TabItem value="param-deprecation" label="Deprecate a parameter" default>

```php
/**
 * Greet a user and their pets.
 *
 * @param string $name The name of the individual
 * @param null|int $age This parameter has been deprecated since 4.0 and should not be used anymore.
 * @param string[] $pets A list of pets that the individual has
 */
public function greet_person(
    string $name,
    null|int $age = null,
    array $pets = [],
}: void {
    if ($age !== null) {
        debugging(
            'The age argument has been deprecated. Please remove it from your method calls.',
            DEBUG_DEVELOPER,
        );
    }

    return sprintf(
        "A big, warm, welcome to %s who has %d pets!",
        $name,
        count($pets),
    );
}
```

  </TabItem>
  <TabItem value="method-deprecation" label="Deprecating the method instead">

```php
/**
 * Greet a user and their pets.
 *
 * @param string $name The name of the individual
 * @param null|int $age This parameter has been deprecated since 4.0 and should not be used anymore.
 * @param string[] $pets A list of pets that the individual has
 */
public function greet_person(
    string $name,
    int $age,
    array $pets = [],
}: void {
    debugging(
        'The `greet_person` method has been deprecated and replaced with `greet_person_with_pets`. ' .
            'Please update your method calls accordingly.',
        DEBUG_DEVELOPER,
    );

    return $this->greet_person_with_pets(
        name: $name,
        pets: $pets,
    );
}
```

  </TabItem>
  </Tabs>
</ValidExample>

:::note Deprecations for core methods in Moodle 4.1 and earlier

Prior to support for PHP 8.0 in Moodle 4.2, the policy for parameter argument deprecation stated that deprecated parameters must be renamed to `$unused` or a similar name.

This has been changed to no longer allow renaming of arguments because it can lead to fatal errors if the calling code makes use of named parameter arguments.

Named parameter arguments are available from PHP 8.0 onwards.

:::

## See also...

- [String deprecation](../../../projects/api/string-deprecation.md)
- [External functions deprecation](/docs/apis/subsystems/external/writing-a-service#deprecation)
- [Capabilities deprecation](/docs/apis/subsystems/access#deprecating-a-capability)
- [SCSS deprecation](./scss-deprecation.md)
- [Process](../../process.md)
- [Release process](../../process/release/index.md)
