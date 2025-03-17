---
title: PHPUnit 11 Upgrade
tags:
- Testing
- PHPUnit
---

<Since version="5.0" issueNumber="MDL-83468" />

Moodle 5.0 updated the version of PHPUnit from version 9.6 to version 11.

This guide is intended to help you update your tests to work with the newer versions.

## Why did we make this change?

PHPUnit 9.6 is currently in maintenance support, but we don't know for how much longer.

We ultimately _need_ to update to a newer version of PHPUnit at some point to ensure that PHP version incompatibilities are addressed and we are able to keep testing Moodle properly.

The most appropriate target is for Moodle 5.0 which follows our new Series naming and versioning policies.

### Why not PHPUnit 10?

- PHPUnit 10 is the next major version of PHPUnit and introduces a number of compatibility issues with PHPUnit 9.6.
- PHPUnit 11 is the latest major version of PHPUnit and is _more_ backwards compatible with PHPunit 9.6 than PHPUnit 10 is.

Many of the features removed in PHPUnit 10 were then partially added back in PHPUnit 11.

To give a specific example, PHPUnit 9.6 has a `--debug` flag. This was removed in 10.0, and added back in 11.0 as an alias for a combination of other flags.

There are lots of other examples of this kind of thing.

## Can I make my tests work in both 9.6 and 11.4?

Yes, _usually_. But it may require some changes to your tests and/or code. For the most part any such changes are usually a good thing and are usually because the tests were wrong in the first place.

### I still can't make my tests work in both 9.6 and 11.4

Unfortunately there is only so much we can do about this -- we can't support every possible combination of PHPUnit versions and we are limited by the versions of PHPUnit that are available in the PHP ecosystem for the versions of PHP that we support.

One of the changes to Moodle's versioning policy was intended to make a balance between core maintainability, and plugin maintainability. Whilst we always strive to avoid making a breaking change to plugins, and to provide a stable for all _currently_ supported versions of Moodle, sometimes this is not possible.

We do recommend that you create a new branch of your plugin for _each series release of Moodle_. That is recommend you have a branch for Moodle 4.x, and separate branch for Moodle 5.x.

## Help -- my tests are broken!

Generally speaking we have already tried to minimise the impact of this change by updating to PHPUnit 9.6 on all stables, which already had some support for some of the new 11.4 features.

We've documented all of the issues we encountered in this transition below.

### Empty data providers

#### Problem

Data providers _must_ now provide data. You cannot have data providers which return an empty Iterator/Array.

#### Solution - use the `@requires` annotation

You may be able to use the [`@requires`](https://docs.phpunit.de/en/9.6/annotations.html#requires) annotation to skip your test based on some configuration, for example whether a specific PHP Extension is installed, for example:

```php
/**
 * @requires extension Redis
 */
```

#### Solution - skip the provider within the test

You may need to perform some check within your test, and/or add a param to the data provider to say whether it should be skipped.

### Tests now failing with `assertEqualsCanonicalizing`

#### Problem

PHPUnit 10 made some changes to `assertEqualsCanonicalizing` which mean that it now compares the array _keys_ as well as the array _values_.

This may be observed in some situations but not others, or inconsistently. This is especially true if the values are coming from the database without a `SORT BY` clause.

#### Solution - Ensure your data is consistently sorted

In some cases you may need to ensure that the data returned from the database is consistently sorted.

:::note

You should only do this if you want the data presented to the user to be sorted consistently.

If it does not matter what order the data is _fetched_, then see the next solution instead.

:::

#### Solution - Remove the array keys

You may need to wrap your asserted value in `array_values()` if the keys are not important.

### The `setMethods` method on the `MockBuilder` is deprecated and removed

#### Problem

The `setMethods` method was deprecated in PHPUnit 8.3.0 and removed in PHPUnit 10.

See [PHPUnit Issue #3687](https://github.com/sebastianbergmann/phpunit/issues/3687) for further information on the rationale.

#### Solutions

You can:

- remove the call entirely;
- replace with `onlyMethods`
- replace with `addMethods`
- refactor your test as appropriate

### Some methods have been deprecated and/or removed

#### Problem

Some methods have been deprecated and/or removed. In some cases Moodle has polyfilled these:

- `assertTag`
- `getName`
- `isInIsolation`

#### Solutions

You can:

- remove the call entirely;
- polyfill it within your own TestCase class.

### Data providers must be static

#### Problem

PHPUnit has always supported _static_ data providers, but also supported non-static ones.

That is, the following was accepted:

```php
protected function my_data_provider(): array {
    return [...];
}
```

PHPUnit has required that data providers be both public, and static, since version 10.

We've known this change has been coming for some time and have been working to remove all non-static data providers from core.

Non-static data providers was then removed in PHPunit 11.

#### Solutions

You must make the data provider static. Where this is non-trivial it probably highlights an existing bug in your tests.

Things we found:

- objects created in the data provider
- DB calls made in the provider
- other side effects

The [moodle-cs](../phpcs.md) coding style rules for phpcs can help you to fix this issue.

### Data providers returning keyed arrays must match the parameter names in their test

#### Problem

If you have a data provider such as the following:

```php
public static function my_provider(): array {
    return [
        [
            'foo' => 'bar',
            'baz' => 'qux',
        ],
    ]''
}
```

Then the test that uses this data provider must have the same parameter names:

```php
/**
 * @dataProvider my_provider
 */
public function test_my_test(string $foo, string $baz) {
    ...
}
```

If the parameter names do not match, PHPUnit will throw a warning.

There is also a warning if the data provider returns a mix of named and unnamed keys.

#### Solutions

- Change the parameter names in the test to match the data provider
- Change the data provider to match the parameter names in the test
- Remove the names
