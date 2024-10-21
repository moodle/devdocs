---
title: YUI Modules
tags:
  - Javascript
  - YUI
---

<DeprecatedSince versions={["2.9"]} />

:::caution

As of Moodle 2.9 we are transitioning away from YUI to AMD modules. This transition will take a long time, but it is important because the YUI team have [stopped all new development on the YUI library](http://yahooeng.tumblr.com/post/96098168666/important-announcement-regarding-yui). See [JavaScript Modules](https://docs.moodle.org/dev/_Javascript_Modules_) for more information.

:::

<!-- cspell:ignore fruitbowl -->

## YUI modules

You may want to [Jump straight to the complete example](#additional-functions-instead-of-anonymous-functions).

### What is a module and why would I want to use one?

Many people are used to writing their JavaScript code either inline, or in a separate file included using `<script>` tags in their HTML. Although both of these are supported within Moodle, we highly recommend investing a little time in looking into the [YUI](./index.md) module system as it offers some really great features which will benefit you in the long run.

These features and benefits include:

- a host of existing modules that you can hook into and use; which offer
- code sandboxing to ensure that you always have a good/clean copy of the code; with
- powerful dependency management; which can utilise
- asynchronous loading to load dependencies in parallel; and
- loading of dependencies in any order (you don't have to include script tags in a set order); and
- separation of loading from execution; and
- combo loading to reduce the number of individual HTTP transactions.

By using existing modules in your code, you can benefit in other ways too, such as:

- a consistent look and feel across Moodle; and
- most of the edge cases already catered for.

The Moodle community is in the process of improving much of its JavaScript in areas such as code, documentation, and processes. This includes updating older code, adding documentation, seeding dependency information for modules to improve load efficiency for browsers, and much more.

You may find the following resources particularly helpful:

- [YUI](./index.md); and

### Structure and naming

A YUI module is structured in a particular way, both on file, and in the file itself. Before you start writing your module, you need to know a few pieces of information:

- what is the [Frankenstyle](/general/development/policies/codingstyle/frankenstyle) name of your Moodle plugin;
- what does your YUI module do in a single word.

You can use these pieces of information to work out the namespace for your
plugin. This namespace fits into the template:

```javascript
moodle-FRANKENSTYLE-MODULENAME
```

As an example, writing a plugin for the fictional `fruit` **block** which offers fruit to users:

- you may decide to call this module the `fruitbowl` as the module offers fruit to users, and presents it in an appealing way so that they can see it.
- The block is fruit, therefore the frankenstyle name is block_fruit.

Therefor the name for this module will be:

```javascript
moodle-block_fruit-fruitbowl
```

The other thing that you need to know in order to create your first module is where in your plugin the code needs to be.

The code will need to go in your plugin directory inside a `yui` directory. Since Moodle 2.5, the structure for this directory is:

```bash
yui/
|-- src
    |-- fruitbowl
        |-- build.json
        |-- js
        |   |-- fruitbowl.js
        |-- meta
        |   |-- fruitbowl.json
```

*Note: Moodle 2.5 onwards is backwards compatibly with the previous structure.*

So in the case of `moodle-block_fruit-fruitbowl`, the JavaScript code will need to go into:

```bash
/block/fruit/yui/src/fruitbowl/js/fruitbowl.js
```

(Sorry, it does look a little more complicated than it really is)

Now that you know where your code needs to be on disk, you can actually include and write it.

### Including your module from your PHP code

Rather than using `<script>` tags to include JavaScript code, Moodle makes
use of the YUI loader and a single inline script tag in the page footer.

Moving JavaScript to a page footer is important to the perceived performance of a page, and the YUI loader helps further.

The YUI loader also intelligently loads page dependencies, in as few requests as possible by making use of a combo-loader system. It will also attempt to use the appropriate version of your JavaScript depending on your `$CFG->jsrev` settings. In normal operation, a minified version of your code is used; and with `$CFG->cachejs` false, then a debugging version is used.

To ensure that your module is loaded, there is a `yui_module()` function on the page requirements class. This can be accessed using:

```php
$PAGE->requires->yui_module();
// or:
$this->page->requires->yui_module();
```

The `yui_module` function takes the module name, and the init function to call as it's first two arguments, and an optional list of arguments as a third argument:

```php
$PAGE->requires->yui_module(
    'moodle-block_fruit-fruitbowl',
    'M.block_fruit.fruitbowl.init'
);
```

#### Passing arguments from your PHP to your module

You may want to pass a set of arguments to your JavaScript. You can do so
using the optional third argument to yui_module which accepts an array of
arguments.

```php
$PAGE->requires->yui_module('moodle-block_fruit-fruitbowl', 'M.block_fruit.fruitbowl.init',[
    'value1',
    'value2',
]);
```

These will be presented to the JavaScript function you name:

```javascript
init = function(argument1, argument2) {
    // Use the arguments here.
};
```

Often it makes more sense to pass a single argument with an associative array:

```php
$PAGE->requires->yui_module('moodle-block_fruit-fruitbowl', 'M.block_fruit.fruitbowl.init',
[[
    'key1' => 'value1',
    'key2' => 'value2',
]]);
```

These will be presented to the JavaScript function you name:

```javascript
init = function(params) {
    // Use the arguments through params.key1 and params.key2.
};
```

### A basic module

The most common use-case for JavaScript in Moodle is to utilise existing modules to do something. Your module isn't intended to be reused, or extended by some other piece of code. In these cases, you want to keep things simple.

This section will build up the YUI module gradually, but you can cheat and skip to the [completed example](https://docs.moodle.org/dev/#Additional_functions_instead_of_anonymous_functions).

#### Namespacing

One of the great benefits of using YUI is the ability to sandbox code in such a way that you can be sure that it won't interfere with other JS code in Moodle, this is done by placing your object in a JavaScript object. Using our fictitious example, this namespace is very similar to the module name namespace:

```javascript
M.FRANKENSTYLE.MODNAME
```

As a JavaScript object this would look like:

```json
M: {
  FRANKENSTYLE: {
    MODNAME: {
      // Your code and functions go here.
    }
  }
}
```

The easiest way of creating this structure is by using the logical OR operator.

```javascript
M.block_fruit = M.block_fruit || {};
M.block_fruit.fruitbowl = {};
var NS = M.block_fruit.fruitbowl;
```

This ensures that any existing code on the M.block_fruit object is not inadvertently overwritten, but also ensures that the definition for the fruitbowl code is clean.

That's to say that, if you have already used your fruitbowl code once on the page, and have modified it in some way (for example to override a function), then the next time it is used, it will be in it's original state with the original function.

#### Initialisation

Once you have your namespace, you'll want to create one or more functions on this namespace in which to put your code. Typically, we use an 'init' function to perform the initial setup. The amount that this code does should be kept to a minimum because every piece of JavaScript which has to be executed at page load is a piece of code slowing the page down. As a best practice:

- don't modify the DOM unless you need to do so;
- don't create anything you aren't using immediately (for example a JS dialogue hidden until first used); and
- use event delegation where possible.

```javascript
M.block_fruit = M.block_fruit || {};
var NS = M.block_fruit.fruitbowl = {};

NS.init = function() {
    Y.delegate('click', function(e) {
        // Alert users when they've clicked on some fruit to tell them the obvious.
        alert("You clicked on some fruit");

        // Add a border to the fruit so we can see that it was selected.
        e.setStyle('border', '1px solid black');
    }, Y.config.doc, '.fruit');
};
```

#### Separation of code from configuration and style (loose coupling)

As another best practice, we encourage you to separate out the code from configuration, and not to apply any CSS styles directly. Instead, use techniques to move the configuration out of the code itself and into variables or attributes, and use CSS classes which the theme can modify.

Typically to make it easier to read your code, and to modify it later, we recommend creating two static objects at the top of your code: one for CSS selectors, and one for CSS class names.

```javascript
var CSS = {
    FRUIT: 'fruit',
    SELECTED: 'selected'
};
var SELECTORS = {
    FRUIT: '.' + CSS.FRUIT
};
var NS;

M.block_fruit = M.block_fruit || {};
NS = M.block_fruit.fruitbowl = {};

NS.init = function() {
    Y.delegate('click', function() {
        // Alert users when they've clicked on some fruit to tell them the obvious.
        alert("You clicked on some fruit");

        // Apply the relevant class which contains indications that this fruit was selected.
        e.target.addClass(CSS.SELECTED);
    }, Y.config.doc, SELECTORS.FRUIT, this);
};
```

With this change, if at a later date you need to change the styling on a selected fruit, this can be done in the theme. An alternative theme can also choose to theme the same item in a completely different way.

It also means that if you need to change the class names, you can do so once in the JavaScript without making it difficult to work out the purpose of a particular line of code from git.

#### Additional functions instead of anonymous functions

Although it's often quicker to write an inline anonymous function when you write your event handlers, loops, and at other times, it's often much easier to read the code if you move it to a function on your namespace and call it accordingly.

```javascript
var CSS = {
        FRUIT: 'fruit',
        SELECTED: 'selected'
    },
    SELECTORS = {
        FRUIT: '.' + CSS.FRUIT
    },
    NS;

M.block_fruit = M.block_fruit || {};
NS = M.block_fruit.fruitbowl = {};

NS.init = function() {
    Y.delegate('click', this.handle_selection, Y.config.doc, SELECTORS.FRUIT, this);
};

NS.handle_selection = function(e) {
    // Alert users when they've clicked on some fruit to tell them the obvious.
    alert("You clicked on some fruit");

    // Apply the relevant class which contains indications that this fruit was selected.
    e.target.addClass(CSS.SELECTED);
};
```

Now you can clearly see your what your initialiser does, and you can call `handle_selection` for other events too without duplicating code.
