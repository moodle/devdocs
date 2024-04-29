---
title: YUI
tags:
  - AJAX
  - Javascript
  - YUI
---

<DeprecatedSince versions={["2.9"]} />

:::caution

As of Moodle 2.9 we are transitioning away from YUI to AMD modules. This transition will take a long time, but it is important because the YUI team have [stopped all new development on the YUI library](http://yahooeng.tumblr.com/post/96098168666/important-announcement-regarding-yui). See [JavaScript Modules](https://docs.moodle.org/dev/_Javascript_Modules_) for more information.

:::

This document provides an brief overview of Moodle's use of YUI.

Originally this transition suggested the use of jQuery, but since Moodle 3.8 the recommendation is to write Native Vanilla code in the ES2015 module style.

The [Yahoo! User Interface (YUI)](http://yuilibrary.com) framework is a fast, powerful, modular, and [well-documented](http://yuilibrary.com/yui/docs/api/) framework with a powerful loading system.

## The Basics

YUI is an extremely extensible, fast, modular, and powerful JavaScript framework with a very capable loading system.
A number of modules are available for YUI providing a wide range of functionality to suit most situations.
All of the core YUI modules are documented on their [API](http://yuilibrary.com/yui/docs/api/). We are working to put together documentation for moodle's YUI modules too.

Since version 2.4, Moodle has included SimpleYUI to expose several features natively without requiring you to specify which features you wish to use. Prior to this a basic YUI was included. SimpleYUI loads a number of standard modules and makes them available on the global Y namespace. These include:

- [`YUI`](http://yuilibrary.com/yui/docs/api/classes/YUI.html)
- [`oop`](http://yuilibrary.com/yui/docs/api/modules/oop.html)
- [`dom`](http://yuilibrary.com/yui/docs/api/classes/DOM.html)
- [`event-custom-base`](http://yuilibrary.com/yui/docs/api/modules/event-custom-base.html)
- [`event-base`](http://yuilibrary.com/yui/docs/api/modules/event-base.html)
- [`node`](http://yuilibrary.com/yui/docs/api/classes/Node.html)
- [`event-delegate`](http://yuilibrary.com/yui/docs/api/modules/event-delegate.html)
- [`io-base`](http://yuilibrary.com/yui/docs/api/modules/io-base.html)
- [`json-parse`](http://yuilibrary.com/yui/docs/api/modules/json-parse.html)
- [`transition`](http://yuilibrary.com/yui/docs/api/modules/transition.html)
- [`selector-css3`](http://yuilibrary.com/yui/docs/api/modules/selector-css3.html)
- [`dom-style-ie`](http://yuilibrary.com/yui/docs/api/modules/dom-style-ie.html)
- [`querystring-stringify-simple`](http://yuilibrary.com/yui/docs/api/modules/querystring-stringify-simple.html)

Whilst accessing the global Y variable will suffice for many uses, we highly recommend that you look at writing your code within a [YUI module](https://docs.moodle.org/dev/How_to_create_a_YUI_3_module). It is also possible to use one of the other methods to include your JavaScript. These include:

- inclusion of a JavaScript file (e.g. a file included by a theme); and
- inclusion of a module.js file.

It is also possible to use JavaScript within a Database module - see the JavaScript template setting for further information.

## Modularity

YUI is extremely modular with different components, features, plugins, and tasks broken down into YUI Modules. When using YUI, you can choose which modules you wish to use and the YUI loader will go away and retrieve those modules, determining their dependencies automatically. This has the effect of separating out the load and execution phases of JavaScript component loading and also allows for asynchronous loading of the code. For a deeper dive on the benefits of this separation, it's well worth watching this video entitled [YUI3 Below the Surface](http://www.youtube.com/watch?v=XdM0GJEnlNU).

In order to benefit from these features, it is necessary to wrap your code in a registration function. This wrapper defines the name of the module, wraps the code in a closure to offer module sandboxing, and defines meta-data to inform the loader of any specific dependencies. A complete wrapper is shown below:

```javascript
YUI.add('moodle-block_fruit-fruitbowl', function(Y) {
  // Your module code goes here.
}, '@VERSION@', {
  requires: ['panel']
});
```

Note: From Moodle 2.5, it is possible to write your modules in such a way that you do not have to explicitly specify write the YUI.add() wrapper.

To then make use of this code, you then have to use it. For example:

```javascript
YUI().use('moodle-block_fruit-fruitbowl', function(Y) {
  // Use the class you defined earlier.
});
```

## Documentation and further information

Other YUI documentation you may find useful:

- [How to create a YUI 3 module](https://docs.moodle.org/dev/How_to_create_a_YUI_3_module)
- [API Documentation for the main YUI library](http://yuilibrary.com/yui/docs/api/)
- [YUI User Guides](http://yuilibrary.com/yui/docs/guides/)
- [YUI Tutorials](http://yuilibrary.com/yui/docs/tutorials/)
- [YUI Examples](http://yuilibrary.com/yui/docs/examples/)
- [YUI Forums](http://yuilibrary.com/forum/)

We will soon be adding API Documentation for Moodle-specific YUI modules in addition to the core YUI library.

## Books:

<!-- cspell:ignore Zakas -->

Some good books:

- [YUI 3 Cookbook](http://shop.oreilly.com/product/0636920013303.do) by Evan Goer
- [Maintainable JavaScript](http://shop.oreilly.com/product/0636920025245.do) by Nicholas C. Zakas

## Useful tools

JavaScript authoring have moved along considerably in recent years, and we highly recommend that you look at using some of the available tools to help you in your development. Most of these tools are available through [Node.js](http://nodejs.org) which is relatively trivial to install on most operating systems:

### Grunt

Moodle uses [Grunt](../index.md#grunt) for most JavaScript management. We recommend reading our Grunt documentation for further information on the available commands.

#### Use

There are several ways to use `grunt`.

During development, we recommend you run grunt in _watch_ mode:

```bash
npx grunt watch
```

To build all YUI modules across Moodle you can call `grunt` by running the following command from the root directory:

```bash
npx grunt yui
```

### JSHint

[JSHint](http://jshint.com) is a JSLint derivative for checking your code. This includes checking for errors and recommended stylistic approaches to writing JavaScript.

Since Moodle 2.5, a JSHint configuration is also included in the Moodle codebase to inform the tester of our preferences and recommendations.

#### Use

Many IDEs and editors will automatically detect if you have JSHint installed and pass your code through it for you, reporting any errors as you go.

To run jshint on the command line, simply pass it the file that you wish to check:

```bash
npx jshint blocks/fruit/yui/fruitbowl/fruitbowl.js
```

#### Documentation

There's a variety of documentation on JSHint and the error messages it returns. Start off with the jshint website:

- [JSHint](http://jshint.com)
- [JSLint Error Explanations](http://jslinterrors.com)

## Moodle Settings for JavaScript Development

The following settings will ensure that the js loaded by your browser is relatively readable.

Make sure that :

- your  Development / Debugging / Debug messages is set to "Developer : Extra Debug Moodle Messages ...." - Moodle will then use the debug non-minified and thus more readable YUI 2 and YUI 3 library files.
- You will probably want to change some of the settings at "Home / Site administration / Appearance / AJAX and JavaScript" :
  - YUI combo loading - you probably want to turn this off so that files are not combined.
  - JavaScript caching and compressing - turn this off so that your custom JS code is not minified.
  - Check the other settings on this page to see that they are as you would expect them to be.

You might want to add the following code to your config.php file when developing or debugging JavaScript code:

```php
// For javascript development or debugging.
$CFG->cachejs = false;
$CFG->yuicomboloading = false;
$CFG->yuiloglevel = 'debug';
$CFG->debug = 32767;
```

## See Also

- [JavaScript Modules](../modules.md)
- [jQuery](../jquery/index.md)
- [JavaScript FAQ](https://docs.moodle.org/dev/JavaScript_FAQ)
