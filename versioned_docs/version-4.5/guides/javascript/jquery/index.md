---
title: jQuery
tags:
  - Javascript
  - jQuery
  - Deprecations
description: A description of how and when to use jQuery in Moodle
---

<DeprecatedSince versions={["3.8"]} />

The use of jQuery in new code is strongly discouraged and is not generally accepted in core. Specific exceptions to this rule are made on a case-by-case basis, generally when interfacing with legacy code which expects to be passed a jQuery object.

Moodle has supported the use of native ES6-style modules and constructs since Moodle 3.8. These are transpiled into supported code.

This page explains the recommended way to use jQuery in core and plugins, although other [older](https://docs.moodle.org/dev/jQuery_pre2.9) methods of including jQuery will still work these are no longer considered to be supported.

## Why do we need JQuery?

:::important

**We do not need jQuery and its use is discouraged**. The following is legacy documentation and no longer current advice.

:::

JQuery is useful for handling browser inconsistencies, and for utility functions that would otherwise be duplicated all over the code. Some particular things that JQuery is good at are:

- DOM Manipulations
- Promises ($.Deferred)
- Ajax

## How to use JQuery

JQuery is available via an AMD Module import and is available to all AMD JavaScript.

To make use of JQuery, either list it as a dependency of your module, or use a require call to load it.

### As a dependency of a module

<Tabs>
<TabItem value="jquery-import-es6" label="ES6 Imports">

```javascript title="mod/yourplugin/amd/src/yourwidget.js"
import jQuery from 'jquery';

jQuery('.example').hide();
```

</TabItem>
<TabItem value="jquery-amd-define" label="AMD Dependency">

```javascript title="lib/amd/src/example.js"
define(['jquery'], function(jQuery) {
    // You can make use of the jQuery object here.
    jQuery('.example').hide();
});
```

### With a require call

</TabItem>
<TabItem value="jquery-amd-require" label="AMD Requirement">

```javascript title="mod/yourplugin/amd/src/yourwidget.js"
require(['jquery'], function(jQuery) {
    // JQuery is available via the jQuery object here.
    jQuery('.example').hide();
});
// JQuery is not in scope and cannot be used.
```

</TabItem>
</Tabs>

## What about JQuery UI ?

JQuery UI is a separate project containing a library of reusable widgets that relies on JQuery. JQuery UI is available for plugins to use, but it **must not** be used in core code, and is _highly discouraged_ in plugin usage.

The problems with JQuery UI include:

- It uses an entirely different theme system for CSS that does not work well with Moodle themes
- It introduces CSS conflicts with bootstrap
- The widgets have some accessibility features - but only if used in a very specific way which is not well documented

We **do not** recommend use of jQuery as it is highly likely to break Bootstrap.

If you _still_ want to use JQuery UI in your plugin, you _must_ include it via the page requirements using the `jquery_plugin()` function.

```php
$PAGE->requires->jquery_plugin('ui');
```

Please note that this _must_ be called before any content is output.

## See also

- [JavaScript Modules](../modules.md)
- [Useful core JavaScript modules](https://docs.moodle.org/dev/Useful_core_Javascript_modules)
- [jQuery in Moodle before Moodle 2.9](https://docs.moodle.org/dev/jQuery_pre2.9)
- [jQuery Documentation](http://jquery.com)
- [jQuery UI Documentation](http://jqueryui.com)
