---
title: Modules
tags:
  - AJAX
  - Javascript
  - AMD
  - ESM
---

A JavaScript module is a package of code that can be reliably used and shared with other code in a reusable format.

By packaging your code as a module you break your code up into smaller reusable pieces. This is good because:

1. Each smaller piece is simpler to understand, and debug
2. Each smaller piece is simpler to test
3. You can re-use common code instead of duplicating it

Since Moodle 3.10, any new JavaScript code written for Moodle core **must** be written in the [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) format (commonly referred to as ES6). See  MDLSITE-6130 for further information.

For community code, we strongly recommend the use of ESMs, which have been supported since Moodle 3.8.

:::note

From Moodle versions 2.9 to 3.8, Moodle supported JavaScript modules written using the [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) API. This is a standard API for creating JavaScript modules and you will find many useful third party libraries that are already using this format. This format is still widely used within Moodle, but is no longer accepted for new code.

:::

For information on the development toolchain, see our [documentation on how to install and use NodeJS and Grunt](/general/development/tools/nodejs#grunt).

### Development mode

<Since version="3.8" />

All JavaScript code is now transpiled using Babel which means Moodle will only ever serve minified JavaScript to the browser, even in development mode.

In development mode Moodle will also send the browser the corresponding source map files for each of the JavaScript modules. The source map files will tell the browser how to map the minified source code back to the un-minified original source code so that the original source files will be displayed in the sources section of the browser's development tools.

To enable development mode set the `cachejs` config value to `false` in the admin settings or directly in your `config.php` file:

```php title="Disabling JavaScript caching"
// Prevent JS caching
$CFG->cachejs = false;
```

:::note

If you use `mdk`, this is also applied from the `mdk run dev` script.

:::

### Transpiling Modules

Since all JavaScript must now be transpiled you must use the [Grunt](/general/development/tools/nodejs#grunt) in order for you changes to appear in the browser.

You can build all modules in Moodle by using the `grunt amd` command, for example:

```bash title="Build all modules"
npx grunt amd
```

This can be very slow, and therefore during development we recommend having `grunt` watch for changes using the `grunt watch` command, for example:

```bash title="Watching for changes"
npx grunt watch
```

## ES Modules

<Since version="3.8" />

Moodle's preferred module format is the ESM format, with the older AMD format also supported. All modules (defined using either syntax) are compatible with one another. Behind the scenes the ESM format is transpiled into an AMD module by Babel.

Note that, for Moodle 3.10 and up (see [MDLSITE-6130](https://tracker.moodle.org/browse/MDLSITE-6130)), any new JavaScript intended for Moodle core **must** be written in the ESM format.

The call from a PHP file might look like:

```php title="Call the 'init' function on myplugin/myfile"
$PAGE->requires->js_call_amd('mod_myplugin/myfile', 'init');
```

And a minimal ESM file will work with:

```php title="mod/myplugin/amd/src/myfile.js"
export const init = () => {
    window.console.log('we have been started');
};
```

### Export default

There is one slight difference between the ESM definition for exporting modules and the RequireJS (AMD) definition.

The ESM format allows you to export both "named" items, and a "default" value. Unfortunately the RequireJS loader can only support either of these formats in the same file, and not both together.

That is to say that you can either use a named export, such as:

```js title="Example of a named export"
export const init = () => {
    window.console.log('The init function was called');
};
```

Or you can use a "default" export, for example:

```js title="Example of a default export"
export default () => {
    window.console.log('The default was called');
};
```

If both are used, then the _default_ export will override all _named_ exports.

### Inline JavaScript

Moodle's minimum browser version requirements means that ESM usage is now supported in all supported browsers. Whilst this is true, we do recommend that inline code be kept to a minimum and that inline code should call code in a module instead.

This has benefits including being easier to maintain, and debug, and the availability of linting and performance tooling.

## First module for your plugin

This shows the absolute minimum module you need to get started adding modules to your plugins.

```js title="path/to/plugin/amd/src/somefile.js"
export const init = () => {
    window.alert("The init function was called");
};
```

The idea here is that we will call the 'init' function from either PHP, or a Mustache Template as follows:

```php title="Calling init from PHP"
$PAGE->requires->js_call_amd('plugintype_pluginname/somefile', 'init');
```

```mustache title="Calling init from a Mustache template"
{{#js}}
require(['plugintype_pluginname/somefile'], (module) => module.init());
{{/js}}
```

:::note

You must use the complete '[Frankenstyle](/general/development/policies/codingstyle/frankenstyle)' plugin name, but you do not need to supply the `.js` extension.

:::

The `js_call_amd` function takes a third parameter which is an *array* of parameters. These will translate to individual parameters in the 'init' function call. For example:

```php title="Initialising a Module from PHP with argument"
$PAGE->requires->js_call_amd('plugintype_pluginname/somefile', 'init', [
    $first,
    $last,
]);
```

```javascript title="Consuming these variables in the init function"
export const init = (first, last) {
    window.console.log(`The first name was '${first}' and the last name was '${last}'`);
};
```

## "Hello World" I am a JavaScript Module

Each JavaScript module is contained in a single source file in the `<componentdir>/amd/src` folder. The final name of the module is taken from the file name and the component name - for example, `block_overview/amd/src/helloworld.js` would create a module named `block_overview/helloworld`. the name of the module is important when you want to call it from somewhere else in the code.

After running grunt - the minified JavaScript files are stored in the `<componentdir>/amd/build` folder. The JavaScript files are renamed to show that they are minified (`helloworld.js` becomes `helloworld.min.js`).

:::tip

Don't forget to add the built files (the ones in amd/build) to your git commits, or in production no-one will see your changes.

:::

```javascript title="blocks/overview/amd/src/helloworld.js"
// Standard license block omitted.
/**
 * @module     block_overview/helloworld
 * @copyright  2022 Someone cool
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
export const formal = (name) => Str.get_string('formallygreet', 'block_overview', name);

/**
 * Return a personalised, informal, greeting.
 *
 * @param   {String} name The name of the person to greet
 * @returns {Promise}
 */
export const informal = (name) => {
    return Str.get_string('informallygreet', 'block_overview', name);
};
```

It's important to note that only functions which are exported will be callable from outside the module. These are part of the public API.

## Advanced examples

### Loading modules dynamically

In some cases you may not know which modules you need to load in advance. In these situations you can make use of dynamic imports to import them when you know what they are.

:::caution

This is not the recommended approach in most cases, but is available for advanced cases.

:::

```javascript
export const showTheThing = (thingToShow) => {
    // Load the module for this thing.
    import(`local_examples/local/types/type_${thingToShow.modname}`)
    .then((thingModule) => {
        window.console.log(`The ${thingToShow.modname} is now available under thingModule within this scope`);

        return thingModule;
    });
};
```

## Calling modules from a page

After you have created your JavaScript modules, then next area to consider is how you should call them.

Any JavaScript code that calls a JavaScript module must execute _after_ the requirejs module loader has finished loading. Moodle provides a function `js_call_amd` that will call a single function from the module with the specified parameters.

```php title="js_call_amd usage"
$PAGE->requires->js_call_amd($modulename, $functionname, $params);
```

Please note that:

- the `$modulename` is the `componentname/modulename` discussed above
- the `$functionname` is the name of a public function exposed by the amd module.
- the `$params` is an array of parameters passed as arguments to the function. These should be simple types that can be handled by `json_encode` (no recursive arrays, or complex classes please).
- if the size of the params array is too large (> 1Kb), this will produce a developer warning. Do not attempt to pass large amounts of data through this function, it will pollute the page size. A preferred approach is to pass css selectors for DOM elements that contain data-attributes for any required data, or fetch data via ajax in the background.
AMD / JS code can also be embedded on a page via mustache templates
see here: https://docs.moodle.org/dev/Templates#What_if_a_template_contains_JavaScript.3F

## Troubleshooting

### npm-shrinkwrap.json sha1 / sha512 changes

If you have installed additional dependencies at some point into your `node_modules` folder then you may find that this can cause changes to the `npm-shrinkwrap.json` file. The easiest way to rectify this is:

```bash
git checkout npm-shrinkwrap.json
npm ci
```

## But I have a mega JS file I don't want loaded on every page?

Loading all JS files at once and stuffing them in the browser cache is the right choice for MOST js files, there are probably some exceptions. For these files, you can rename the JavaScript file to end with the suffix "-lazy.js" which indicates that the module will not be loaded by default, it will be requested the first time it is used. There is no difference in usage for lazy loaded modules, the require() call looks exactly the same, it's just that the module name will also have the "-lazy" suffix.
