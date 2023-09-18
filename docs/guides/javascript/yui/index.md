---
title: YUI
tags:
  - AJAX
  - Javascript
  - YUI
---

import DeprecatedSince from '@site/src/components/DeprecatedSince';

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

The usefull hints you previously found here are moved to [another place](https://moodledev.io/docs/guides/javascript#tools)
