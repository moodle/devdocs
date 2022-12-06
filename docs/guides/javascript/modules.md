---
title: Javascript Modules
tags:
  - AJAX
  - Javascript
---
{{Moodle 2.9}}

# JavaScript Modules

## What is a JavaScript module and why do I care?

A JavaScript module is nothing more than a collection of JavaScript code that can be used (reliably) from other pieces of JavaScript.

## Why should I package my code as a module?

By packaging your code as a module you break your code up into smaller reusable pieces. This is good because:

a) Each smaller piece is simpler to understand / debug

b) Each smaller piece is simpler to test

c) You can re-use common code instead of duplicating it

# How do I write a JavaScript module in Moodle?

Since version 2.9, Moodle supports JavaScript modules written using the Asynchronous Module Definition ([AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)) API. This is a standard API for creating JavaScript modules and you will find many useful third party libraries that are already using this format.

To edit or create an AMD module in Moodle you need to do a couple of things.

Since version 3.8, Moodle supports [ECMAScript 2015 features](https://github.com/lukehoban/es6features#readme) (aka ES6) in a cross browser compatible way thanks to [Babel JS](https://babeljs.io/). In order to achieve the compatibility with older browsers Babel will compile the newer ES6 features back into ES5 JavaScript. Unfortunately this means that in order for your JavaScript changes to show in the browser they must be compiled by running [Grunt](https://docs.moodle.org/dev/Grunt), even with the cachejs config setting set to false (i.e. "Development mode").

Note that, for Moodle 3.10 and up (see [MDLSITE-6130](https://tracker.moodle.org/browse/MDLSITE-6130)), any new Javascript module **must** be written on ES6.

## Install NVM and Node

The recommended way of installing NodeJS is via the [Node Version Manager](https://github.com/nvm-sh/nvm), or NVM. NVM allows you to have several different versions of NodeJS installed at and in-use at any once on your computer. Supported versions of Moodle all use version {{NodeJSExactVersion}} of NodeJS.

For Linux and Mac, follow https://github.com/nvm-sh/nvm#installing-and-updating

For Windows, use https://github.com/coreybutler/nvm-windows/releases -- Note! NVM 1.1.7 for Windows has bugs. You should upgrade to at least 1.1.9.)

Confirm it is working (version below in on Linux, and probably not current):
 $ nvm --version
 0.35.3
After you have installed **nvm**, you should install the correct version of NodeJS by running the following commands from your Moodle directory:
 nvm install
 nvm use
If your primary use of NodeJS is for Moodle then we recommend that you set NodeJS version {{NodeJSExactVersion}} as your default version. You can do this by running:
 nvm alias default {{NodeJSExactVersion}}

## Install grunt

The AMD modules in Moodle must be processed by some build tools before they will be visible to your web browser. We use "[grunt](https://docs.moodle.org/dev/grunt)" as a build tool to wrap our different processes. Grunt is a build tool written in JavaScript that runs in the "[nodejs](http://nodejs.org/)" environment.

Once this is done, you can run the the following commands from your Moodle directory:
 npm install
**This may mention vulnerabilities, that's fine and doesn't apply.**
 npm install -g grunt-cli
Troubleshooting: on Mac, if you get weird errors, try running <code>sudo xcode-select --reset</code>. And, this probably means that you need to have Xcode or simlar build tools installed and resonably up to date.

## Development mode (Moodle v2.9 to v3.7)

To avoid having to constantly run grunt, make sure you set the following in your config.php

```php
// Prevent JS caching
$CFG->cachejs = false;
```

Moodle will now run your module from the amd/src module. Don't forget to switch this off and run 'grunt' before deploying the new version!

In this mode - if you get a strange message in your JavaScript console like "No define call for core/first" it means you have a syntax error in the JavaScript you are developing.
Or, "No define call for theme_XXX/loader" as you are probably missing the 'src' folder with relevant JS files. which might happen when you turn debugging ON on a theme that was bought, without 'src' folder :-(

## Development mode (Moodle v3.8 and above)

All JavaScript code is now compiled using Babel which means Moodle will only ever serve minified JavaScript to the browser, even in development mode. However in development mode Moodle will also send the browser the corresponding source map files for each of the JavaScript modules. The source map files will tell the browser how to map the minified source code back to the unminified original source code so that the original source files will be displayed in the sources section of the browser's development tools.

While in development mode each of the JavaScript modules will appear in the browser's source tree as separate modules (no more giant first.js file!) and they will also be loaded with individual network requests (this is a compromise we had to make thanks to some browser bugs with source map files).

To enable development mode set the **cachejs** config value to **false** in the admin settings or directly in your config.php file:

```php
// Prevent JS caching
$CFG->cachejs = false;
```

Since all JavaScript must now be compiled you must run [Grunt](https://docs.moodle.org/dev/Grunt) in order for you changes to appear in the browser. However rather than running Grunt manually each time on either the whole project or each file you modified, it is recommended that you just run the **grunt watch** task at the root of your Moodle directory. The grunt watch task will listen for changes to the JavaScript files in the Moodle directory and will automatically lint and compile only the file that is changed after each change is detected. This removes the need to manually run grunt after each change.

## Development mode (Moodle v3.10 and above)

All the above for Moodle 3.8 and up applies, plus (see [MDLSITE-6130](https://tracker.moodle.org/browse/MDLSITE-6130)), any new Javascript module must be written on ES6.

## Running grunt

You can run grunt in your plugin's 'amd' directory and it will only operate on your modules. If you're having problems or just want to check your work it is worth running for the 'lint' feature. This can find basic problems. This sub-directory support wont work on Windows unfortunately but there is an alternative: Run grunt from the top directory with the --root=path/to/dir to limit execution to a sub-directory.

See [Grunt#Running grunt](https://docs.moodle.org/dev/Grunt#Running_grunt) for more details of specific grunt commands which can be used.

If you get the error message
 /usr/bin/env: node: No such file or directory
Then see the thread https://github.com/nodejs/node-v0.x-archive/issues/3911

On Ubuntu 14.04 this fixed it for me:
 sudo ln -fs /usr/bin/nodejs /usr/local/bin/node
Note: Once you have run grunt and built your code, you will then need to purge Moodle caches otherwise the changes made to your minified files may not be picked up by Moodle.

## ES6 Modules (Moodle v3.8 and above)

In addition to AMD module syntax Moodle now supports the [ES6 syntax](https://github.com/lukehoban/es6features#modules) for writing JavaScript modules. All modules (defined using either syntax) are compatible with one another. Behind the scenes the ES6 module syntax is converted into an AMD syntax as part of the Babel compiling process.

Note that, for Moodle 3.10 and up (see [MDLSITE-6130](https://tracker.moodle.org/browse/MDLSITE-6130)), any new Javascript module must be written on ES6.

The call from a PHP file takes the same format

```php
$PAGE->requires->js_call_amd('myplugin/myfile','init');
```

And a minimal ES6 file will work with

```php
export const init = () => {
    window.console.log('we have been started');
};
```

### Export default

There is one slight difference between the ES6 definition for exporting modules and the RequireJS (AMD) definition.

ES6 allows you to export a "default" value which is actually no different to exporting a named value where the name is "default". Unfortunately, RequireJS allows for unnamed default exports (e.g. you can do "return SomeClass;") which can be imported by just requiring them in other AMD modules.

That's a bit confusing, get to the point! Well, it basically means that in Moodle you won't be able to write an ES6 module that exports both a default and named exports, e.g. "export default function() {...}" and "export const FOO = 'bar'" in the same module. The export default will simply override all other exports in that module.

### Inline JavaScript

Another important note is that ES6 support is only for stand alone JavaScript files because it relies on the compilation from Babel and Grunt. That means any inline JavaScript (either in PHP or in Mustache templates) won't support the ES6 features. Instead it would be best to keep the inline JavaScript as minimal as possible and only use it to load a stand alone JavaScript module.

## Minimum (getting started) module for plugins

This shows the absolute minimum module you need to get started adding modules to your plugins. It's actually quite simple...

```javascript
// Put this file in path/to/plugin/amd/src
// You can call it anything you like

export const init = () => {
    document.addEventListener('change', e => {
        const someNode = e.target.closest('.someclass');
        if (someNode) {
            alert('It changed!');
        }
    });
};
```

For older versions of Moodle prior to 3.8, you will need to use the legacy ES5 format instead:

```javascript
define([], function() {

    return {
        init: function() {
            document.addEventListener('change', function(e) {
                var someNode = e.target.closest('.someclass');
                if (someNode) {
                    alert('It changed!');
                }
            });
        }
    };
});
```

This code passes the jquery module into our function (parameter $). There are a number of other useful modules available in Moodle, some of which you'll probably need in a practical application. See [Useful core JavaScript modules](https://docs.moodle.org/dev/Useful_core_Javascript_modules). Simply list them in both the define() first parameter and the function callback. E.g.,

```javascript
import jQuery from 'jquery'; // We recommend that you strongly consider whether you really need jQuery. It is typically not needed in modern code.
import * as Str from 'core/str';
import Ajax from 'core/ajax';

export const init = config => {
};
```

The idea here is that we will run the 'init' function from our (PHP) code to set things up. This is called from PHP like this...

```php
    $PAGE->requires->js_call_amd('frankenstyle_path/your_js_filename', 'init');
```

Don't forget to supply the complete '[Frankenstyle](/general/development/policies/codingstyle/frankenstyle)' path. The .js is not needed.

js_call_amd takes a third parameter which is an *array* of parameters. These will translate to individual parameters in the 'init' function call. For example...

```php
    $PAGE->requires->js_call_amd('block_iomad_company_admin/department_select', 'init', array($first, $last));
```

...calls

```javascript
export const init = (first, last) {
    window.console.log(`The first name was '${first}' and the last name was '${last}'`);
};
```

A more comprehensive explanation follows...

## "Hello World" I am a JavaScript Module

Lets now create a simple JavaScript module so we can see how to lay things out.

Each JavaScript module is contained in a single source file in the `<componentdir>/amd/src` folder. The final name of the module is taken from the file name and the component name. E.g. block_overview/amd/src/helloworld.js would be a module named "block_overview/helloworld". the name of the module is important when you want to call it from somewhere else in the code.

After running grunt - the minified JavaScript files are stored in the `<componentdir>/amd/build` folder. The JavaScript files are renamed to show that they are minified (helloworld.js becomes helloworld.min.js).

Don't forget to add the built files (the ones in amd/build) to your git commits, or in production no-one will see your changes.

Lets create a simple module now:

blocks/overview/amd/src/helloworld.js

```javascript
// Standard license block omitted.
/*
 * @module     block_overview/helloworld
 * @copyright  2015 Someone cool
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as Str from 'core/str';

/**
 * Reveal all of the hidden notes.
 */
const showAllNotes = () => {
    document.querySelectorAll('.note.hidden').map(note => note.removeClass('hidden'));
};

/**
 * Hide all of the notes.
 */
const hideAllNotes = () => document.querySelectorAll('.note').map(note => note.addClass('hidden'));

/**
 * Return a personalised, formal, greeting.
 *
 * @param   {String} name The name of the person to greet
 * @returns {Promise}
 */
export const formal = name => Str.get_string('formallygreet', 'block_overview', name);

/**
 * Return a personalised, informal, greeting.
 *
 * @param   {String} name The name of the person to greet
 * @returns {Promise}
 */
export const informal = name => {
    return Str.get_string('informallygreet', 'block_overview', name);
};
```

It's important to note tha tonly functions which are exported will be callable from outside the module. These are part of the public API.

## Loading modules dynamically

What do you do if you don't know in advance which modules will be required? In a limited number of situations you may not know the modules that you need until you call them. You can make use of dynamic imports to import them when you know what they are. Note: This is not the recommended approach in most cases.

```javascript
export const showTheThing = thingToShow => {
    // Load the module for this thing.
    import(`local_examples/local/types/type_${thingToShow.modname}`)
    .then(thingModule => {
        window.console.log(`The ${thingToShow.modname} is now available under thingModule within this scope`);

        return thingModule;
    });
};
```

## Including an external JavaScript/jquery library

If you want to include a JavaScript / jquery library downloaded from the internet you can do so as follows:

**Warning: if the library you download, supports AMD but is already "named" you will not be able to include it directly**
e.g.

```javascript
// DO NOT DO THIS - IT DOES NOT WORK IN MOODLE
define("typeahead.js", *[ "jquery" ], function(a0) {
    return factory(a0);
});
```

will not work, as moodle injects it's own define name when loading the library.

If the library is in AMD format and has a define:
e.g. i want to include the jquery final countdown timer on my page ( hilios.github.io/jQuery.countdown/ )

- download the module in both normal and minified versions
- place the modules in your moodle install e.g. your custom theme dir, or plugin dir
- /theme/mytheme/amd/src/jquery.countdown.js
you can now include the module and initialise it (there are multiple ways to do this)
php:

1. Create your own AMD module and initialise it:

In your PHP file:

```php
$this->page->requires->js_call_amd('theme_mytheme/countdowntimer', 'init', $params);
```

JavaScript module:

```javascript
// /theme/mytheme/amd/src/countdowntimer.js
import Countdown from 'theme_mytheme/jquery.countdown');
import $ from 'jquery';

export const init = params => {
    $('#clock').countdown(params.targetItem, event => {
             $(event.target).html(event.strftime('%D days %H:%M:%S'));
    });
};
```

2. Call your JavaScript module from your template:

```javascript
// /theme/mytheme/templates/countdowntimer.mustache
<span id="theme_mytheme-clock-{{uniqid}}"></span>
{{#js}}
require(['theme_mytheme/countdowntimer'], function(myModule) {
    myModule.init({
        targetItem: 'theme_mytheme-clock-{{uniqid}}'
    });
});
{{/js}}
```

Note: If you feel that you need to work around [MDL-62468](https://tracker.moodle.org/browse/MDL-62468), then you should probably be putting the data into the DOM in your template via data Attributes, or loading it via a Web Service.

Another example of adding a 3rd-party library to a Moodle plugin (by Ruslan Kabalin)

If you want use https://github.com/R-TEK/colr_pickr in your plugin but this module isn't RequireJS-compatible.

You need to configure requirejs in your plugin to use third-party library:

```php
$config = ['paths' => ['colorpicker' => 'CDN or local path...']];
$requirejs = 'require.config(' . json_encode($config) . ')';
$PAGE->requires->js_amd_inline($requirejs);
```

Then in your JS module in the plugin:

```javascript
define([colorpicker], function(ColorPicker) {
    const button = document.getElementById('my_picker');
    let picker = new ColorPicker(button, '#ff0000');
}
```

And another example of using https://github.com/itsjavi/bootstrap-colorpicker (that has a [jQuery](./jquery/index.md) dependency) with native ES6 JS:
 NOTE: It is advised to move away from [jQuery](./jquery/index.md) related plugins, as Moodle core is moving away from jQuery.
<br>

```javascript
import ColourPicker from 'local_myplugin/bootstrap-colorpicker';

const myElement = document.querySelector('.myelement');
const picker = new ColourPicker(myElement);
```

## Embedding AMD code in a page

So you have created lots of cool JavaScript modules. Great. How do we actually call them? Any JavaScript code that calls an AMD module must execute AFTER the requirejs module loader has finished loading. We have provided a function "js_call_amd" that will call a single function from an AMD module with parameters.

```php
$PAGE->requires->js_call_amd($modulename, $functionname, $params);
```

that will "do the right thing" with your block of AMD code and execute it at the end of the page, after our AMD module loader has loaded.
Notes:

- the $modulename is the 'componentname/modulename' discussed above
- the $functionname is the name of a public function exposed by the amd module.
- the $params is an array of params passed as arguments to the function. These should be simple types that can be handled by json_encode (no recursive arrays, or complex classes please).
- if the size of the params array is too large (> 1Kb), this will produce a developer warning. Do not attempt to pass large amounts of data through this function, it will pollute the page size. A preferred approach is to pass css selectors for DOM elements that contain data-attributes for any required data, or fetch data via ajax in the background.
AMD / JS code can also be embedded on a page via mustache templates
see here: https://docs.moodle.org/dev/Templates#What_if_a_template_contains_JavaScript.3F

## Troubleshooting

### npm-shrinkwrap.json sha1 / sha512 changes

If grunt changes all the hashes in npm-shrinkwrap.json then try this:
 rm -rf node_modules && npm i

## But I have a mega JS file I don't want loaded on every page?

Loading all JS files at once and stuffing them in the browser cache is the right choice for MOST js files, there are probably some exceptions. For these files, you can rename the JavaScript file to end with the suffix "-lazy.js" which indicates that the module will not be loaded by default, it will be requested the first time it is used. There is no difference in usage for lazy loaded modules, the require() call looks exactly the same, it's just that the module name will also have the "-lazy" suffix.

## Useful links

- [JavaScript AMD with RequireJS](https://assets.moodlemoot.org/sites/15/20171004085436/JavaScript-AMD-with-RequireJS-presented-by-Daniel-Roperto-Catalyst.pdf) presented by Daniel Roperto, Catalyst. (MoodleMOOT AU 2017)
- [Useful core JavaScript modules](https://docs.moodle.org/dev/Useful_core_Javascript_modules)
- [Guide to adding third party jQuery for AMD](https://docs.moodle.org/dev/Guide_to_adding_third_party_jQuery_for_AMD) by Patrick Thibaudeau
- [How to get variables from PHP into JavaScript AMD modules in M3.5](https://moodle.org/mod/forum/discuss.php?d=378112#p1524459) Justin Hunt, on Moodle forums.
- [MDL-67327](https://tracker.moodle.org/browse/MDL-67327) JavaScript issues when not following the official documentation, since Moodle 3.8
- [Error from grunt watch - Moodle 3.9](https://moodle.org/mod/forum/discuss.php?d=405829) Forum Discussion
