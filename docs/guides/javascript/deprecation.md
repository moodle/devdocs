---
title: Deprecation of JavaScript
tags:
  - deprecation
---

The deprecation of JavaScript follows the same general principle as the deprecation of other Moodle code. That is:

- Deprecations should only be on the `main` branch, not on stables. Exceptions to this may be made in certain conditions, including:
  - for some external service integrations
  - where a feature is discovered to have been broken irreparably
  - to address security issues
- Deprecations apply to all public APIs, classes, and files.
- All deprecations should be noted with an [upgrade note](/general/development/upgradenotes).
- Deprecations are split into three stages:
  1. Initial deprecation
  2. Final deprecation
  3. Removal
- All deprecations should emit debugging notices where possible

## JavaScript specifics {/* #JavaScript-specifics */}

<Since version="5.2" issueNumber="MDL-87867" />

From Moodle 5.2 a new deprecation utility is included in Moodle core for JavaScript. That can be found in the `core/deprecated` AMD module and is intended to function in a similar way to its PHP Attribute equivalent.

### Usage {/* #usage */}

The `core/deprecated` module exports a single, default, function which can be used to emit appropriate deprecation information when called.

This may be included in places such as:

- the body of the file, not in any method, so that the use of the file emits the deprecation notices; and
- within a method, so that when a method is called the deprecation notice is emitted.

The basic usage of the API requires that a description of the thing being deprecated is provided. Other arguments are optional, but at least one of the following must be provided:

- the reason for deprecation;
- the replacement to use; or
- the MDL in which the item was deprecated.

```javascript title="Basic usage"
import emitDeprecation from 'core/deprecated';

export const myFunction = (the, args) => {
    emitDeprecation('myFunction', {
        replacement: 'myNewFunction',
        since: '5.2',
        mdl: 'MDL-12345',
    });

    const modified = args.slice(0, 1);
    args = args.slice(1);

    // Call myNewFunction.
    return myNewFunction(the, modified, args);
}
```

When this method is called the following actions will happen:

- a notice will be printed to the browser console; and
- a modal will be displayed.

This deprecation will cause failures when running Behat if any code path makes use of the functionality.

#### Silent deprecation {/* #silent-deprecation */}

In some cases it is necessary to deprecate a feature silently, emitting to the console but not displaying any modal. This may happen for deprecation of widely used features over a longer period where the initial deprecation is expected to take a long time.

To do this, you can set the `emit: false` property on the deprecation call:

```javascript title="Emitting in the Console only"
import emitDeprecation from 'core/deprecated';

export const myFunction = (the, args) => {
    emitDeprecation('myFunction', {
        replacement: 'myNewFunction',
        since: '5.2',
        mdl: 'MDL-12345',
        emit: false,
    });

    const modified = args.slice(0, 1);
    args = args.slice(1);

    // Call myNewFunction.
    return myNewFunction(the, modified, args);
}
```

#### Final deprecation {/* #final-deprecation */}

After the initial deprecation period, deprecations typically then become 'final'. This means that instead of a warning being issued and a backwards-compatible call being made, an Error is shown.

In some cases deprecations may also be marked as final because there is no alternative.

To mark a deprecation as final, you can set the `final: true` property on the deprecation call:

```javascript title="Basic usage"
import emitDeprecation from 'core/deprecated';

export const myFunction = (the, args) => {
    emitDeprecation('myFunction', {
        replacement: 'myNewFunction',
        since: '5.2',
        mdl: 'MDL-12345',
        final: true,
    });

    const modified = args.slice(0, 1);
    args = args.slice(1);

    // Call myNewFunction.
    return myNewFunction(the, modified, args);
}
```

### Tips and tricks {/* #tips-and-tricks */}

#### Hiding deprecations {/* #hiding-deprecations */}

If you wish to stop this deprecation from displaying and from causing Behat failures, you can set the following in your `config.php`:

```php title="Ignoring the deprecation of 'myFunction'"
$CFG->jsdeprecationignorelist = [
    'myFunction',
];
```

The name in this list should match the first argument to the `emitDeprecation` method.
