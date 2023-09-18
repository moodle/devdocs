---
title: JavaScript
---

import { Since, CodeBlock, TabItem, Tabs } from '@site/src/components';

Moodle makes heavy use of JavaScript to improve the experience for its users.

All new JavaScript in Moodle should use the ES2015+ module format, which is
transpiled into the CommonJS format.
Modules are loaded in the browser using the RequireJS loader.

All Moodle JavaScript can use the same Mustache templates and translated strings which are available to Moodle PHP code, and the standard Moodle web service framework can be used to fetch and store data.

This guide covers how to get started with JavaScript in Moodle, and introduces key concepts and features including module format and structure, including your code, using templates, using translation features, tooling, and handling events.

:::note
You may see the terms `ES6` and `ES2015` used interchangeably.
ES2015 is the 6th generation of the Ecma Script specification.
ES2015 represents a big change from previous versions of the Ecma Script
specification.
:::

## Useful References

Moodle uses vanilla JavaScript combined with helpers for performing common actions, and a small collection of libraries
for serving and managing dependencies.

The JavaScript documentation available on the Mozilla Developer Network is one of the best reference documentations
available. You may find the following references particularly useful:

- [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference).
- [ES2015+ Cheat-sheet](https://devhints.io/es6)

## Modules

JavaScript in Moodle is structured into ES2015 modules which are transpiled into the CommonJS format.

Like our PHP classes and Mustache templates, our JavaScript modules each belong to a particular {term}`component`
and must be named according to our standard [name and namespace conventions](/general/development/policies/naming#javascript).

The naming scheme for Moodle's JavaScript fits into the pattern:

`[component_name]/[optional/sub/namespace/][modulename]`

The first directory in any subfolder must be either a Moodle API, or `local`.

The following are examples of valid module names:

```
// For a module named `discussion` in the `mod_forum` component:
mod_forum/discussion

// For a module named `grader` in the `mod_assign` component which is
// part of the `grades` API:
mod_assign/grades/grader

// For a module named `confirmation` in the `block_newsitems` component
// which is a modal and not part of a core API:
block_newsitems/local/modal/confirmation

// For a module name `selectors` in the `core_user` component and relates
// to the `participants` module:
core_user/local/participants/selectors
```

:::tip
When structuring a new module you may find it clearer to create a main entry-point module with related modules stored in
a subdirectory.

For example when creating a new module which controls interactions on the Participants page and which is part of
the `core_user` component you will create a `participants` module.
The full namespace for this module will be `core_user/participants`.

The `core_user/participants` module may interact with DOM elements which are identified by CSS Selectors.
The Moodle convention is to place the selectors in a `selectors` module.

The module will also call a set of Web Services.
The Moodle convention is to place calls to Web Services in a `repository` module.

Since `participants` isn't a formal API in Moodle you must create your submodules in the `local/participants`
directory.

```console
.
├── local
│   └── participants
│       ├── repository.js       // core_user/local/participants/selectors
│       └── selectors.js        // core_user/local/participants/repository
└── participants.js             // core_user/participants
```

:::

## Writing your first module

The convention in Moodle is to have one JavaScript Module which is your initial entrypoint.
This usually provides a function called `init` which you then [export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) from the module.
This `init` function will be called by Moodle.

Your module will probably also have one or more dependencies which you will `import`.

As you start to build out the structure of your code you will start to export more functions, as well as Objects,
Classes, and other data structures.

:::note
This guide isn't intended to teach you how to write JavaScript.
If you are new to JavaScript, you may want to start with the [MDN JavaScript
basics guide](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web).
:::

A module which calls to the browser `console.log` function would look like:

```js title="mod/example/lib/amd/src/helloworld.js"
export const init = () => {
    window.console.log('Hello, world!');
};
```

In this example a new variable called `init` is created and exported using
the ES2015 [export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) keyword.
The variable is assigned an arrow function expression which takes no
arguments, and when executed will call the browser `console.log` function
with the text `"Hello, world!"`.

### Listen to a DOM Event

Usually you will want to perform an action in response to a user
interacting with the page.

You can use the [document.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method to do
this.

To add a `click` listener to the entire body you would write:

```js title="mod/example/lib/amd/src/helloworld.js"
export const init = () => {
    document.addEventListener('click', e => {
        window.console.log(e.target);
    });
};
```

In this example any time that a user clicks anywhere on the document the item
that was clicked on will be logged to the browser console.

Usually you won't want to listen for every click in the document but only for
some Elements in the page.

If you wanted to display a browser alert every time a user clicks on a button,
you might have a template like the following example:

```handlebars title="mod/example/templates/helloworld.mustache"
 <button data-action="mod_example/helloworld-update_button">Click me</button>
```

You can write a listener which looks for clicks to this button:

```js title="mod/example/lib/amd/src/helloworld.js"
const Selectors = {
    actions: {
        showAlertButton: '[data-action="mod_example/helloworld-update_button"]',
    },
};

export const init = () => {
    document.addEventListener('click', e => {
        if (e.target.closest(Selectors.actions.showAlertButton)) {
            window.alert("Thank you for clicking on the button");
        }
    });
};
```

This example shows several conventions that are used in Moodle:

- CSS Selectors are often stored separate to the code in a `Selectors`
  object. This allows you to re-use a Selector and to group them
  together in different ways. It also places all selectors in one place so
  that they're easier to update.
- The `Selectors` object is stored in a `const` variable which is \_not\_
  exported. This means that it's private and only available within your
  module.
- A `data-*` attribute is used to identify the button in the JavaScript
  module.
  Moodle advises not to use class selectors when attaching event listeners because
  so that it's easier to restyle for different themes without any changes to
  the JavaScript later.
- A namespace is used for the `data-action` to identify what the button is intended for.
- By using `e.target.closest()` you can check whether the element that was
  clicked on, or any of its parent elements matches the supplied CSS Selector.

Instead of having one event listener for every button in your page, you can
have one event listener which checks which button was pressed.
If you have a template like the following:

```handlebars title="mod/example/templates/helloworld.mustache"
 <div>
     <button data-action="mod_example/helloworld-update_button">Click me</button>
     <button data-action="mod_example/helloworld-big_red_button">Do not click me</button>
 </div>
```

Then you can write one event listener which looks at all buttons on the page.
For example:

```js title="mod/example/lib/amd/src/local/helloworld/selectors.js"
export default {
    actions: {
        showAlertButton: '[data-action="mod_example/helloworld-update_button"],
        bigRedButton: '[data-action="mod_example/helloworld-big_red_button"],
    },
};
```

```js title="mod/example/lib/amd/src/helloworld.js"
import Selectors from './local/helloworld/selectors';

const registerEventListeners = () => {
    document.addEventListener('click', e => {
        if (e.target.closest(Selectors.actions.showAlertButton)) {
            window.alert("Thank you for clicking on the button");
        }

        if (e.target.closest(Selectors.actions.bigRedButton)) {
            window.alert("You shouldn't have clicked on that one!");
        }
    });
};

export const init = () => {
    registerEventListeners();
};
```

You will notice several key differences in this example when compared with the previous one:

- The list of Selectors has been moved to a new Module which is included using
  the [import](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) keyword.
  The new `selectors` module is a dependency of the `helloworld` module.
- The call to `document.addEventListener` has been moved to a new
  `registerEventListeners` function.
  This is another Moodle convention which encourages you to structure your
  code so that each part has clear responsibilities.
- One event listener is present and it checks if the Element clicked on was
  one that it's interested in.

## Including JavaScript from your pages

Once you have written a JavaScript module you need a way to include it within your content.

Moodle has three main ways to include your JavaScript and the best way will depend on your content. These are:

- from a template via `requirejs`;
- from PHP via the output requirements API; and
- from other JavaScript via `import` or `requirejs`.

### Including from a template

Most recent code in Moodle makes heavy use of Mustache templates and you will often find that your JavaScript is
directly linked to the content of one of your templates.

All JavaScript in Mustache templates must be places in a `{{#js}}` tag.
This tag ensures that all JavaScript is called in a consistent and reliable way.

:::caution
You shouldn't add too much JavaScript directly to a template.
JavaScript placed directly into Templates isn't transpiled for consistent use in all browsers and it isn't passed through minification processes.
Some browser-specific features won't be available.
:::

This simplest form of this is:

```handlebars title=mod/forum/templates/discussion.mustache
<div>
    <!—- Your template content goes here. —->
</div>

{{#js}}
require(['mod_forum/discussion'], function(Discussion) {
    Discussion.init();
});
{{/js}}
```

Any time that this template is rendered and placed on the page the `mod_forum/discussion` module will be fetched and the `init()` function called on it.

:::note Since Moodle 4.0
Moodle no longer supports Internet Explorer. It's now safe to use Arrow functions.
<!--
TODO:
Moodle no longer supports Internet Explorer. It's now safe to use <Term reference="arrowFunctions">Arrow functions</Term>.
-->
:::

Often you may want to link the JavaScript to a specific `DOMElement` in the template.
You can use the `{{uniqid}}` Mustache tag to give that DOM Element a unique ID and then pass that into the Module.

```handlebars title=mod/forum/templates/discussion.mustache
<div id="mod_forum-discussion-wrapper-{{uniqid}}">
    <!—- Your template content goes here. —->
</div>

{{#js}}
require(['mod_forum/discussion'], function(Discussion) {
    Discussion.init(document.querySelector("mod_forum-discussion-wrapper-{{uniqid}}"));
});
{{/js}}
```

In this example you have added a new `id` to the `div` element.
You then fetch the DOM Element using this id and pass it into the `init` function.

:::note
The `{{uniqid}}` tag gives a new unique string for each rendered template including all its children.
It isn't a true unique id and must be combined with other information in the template to make it unique.
:::

### Including from PHP

Much of Moodle's code still creates HTML content in PHP directly.
This might be a simple `echo` statement or using the `html_writer` output functions.
A lot of this content is being migrated to use Mustache Templates which are the recommended approach for new content.

Where content is generated in PHP you will need to include your JavaScript at the same time.

Although several older ways to include JavaScript from PHP, it's strongly
recommended that all new JavaScript only use the `js_call_amd` function on the
`page_requirements_manager`.
This has a similar format to the version used in Templates:

```php
// Call the `init` function on `mod_forum/discussion`.
$PAGE->requires->js_call_amd('mod_forum/discussion', 'init');
```

The `js_call_amd` function turns this into a `requirejs` call.

You can also pass arguments to your function by passing an array as the third argument to `js_call_amd`, for example:

```php
// Call the `init` function on `mod_forum/discussion`.
$PAGE->requires->js_call_amd('mod_forum/discussion', 'init', [$course->id]);
```

If you pass a multi-dimensional array as the third argument, then you can use Array destructuring within the JavaScript to get named values.

<Tabs>
<TabItem value="php-js_call_admin-args" label="PHP">

```php
$PAGE->requires->js_call_amd('mod_forum/discussion', 'init', [[
    'courseid' => $course->id,
    'categoryid' => $course->category,
]]);
```

</TabItem>
<TabItem value="js-js_call_admin-args" label="JavaScript">

```js
export const init = ({courseid, category}) => {
    window.console.log(courseid);
    window.console.log(category);
};
```

</TabItem>
</Tabs>

:::caution
A limit applies to the length of the parameters passed in the third argument.
If data is already available elsewhere in the DOM, you should avoid passing it as a parameter.
:::

## Passing data to your Module

You will often need to work with data as part of your JavaScript module.
This might be simple data, like the a database id, or it may be more complex
like full Objects.

Moodle provides several ways to achieve this:

- you can pass a small amount of data into the module initialisation, but this is no longer recommended
- you can store this data in the DOM as a data attribute which is fetched in your code
- a Moodle Web Service can be used to fetch more complex data structures dynamically

### Using data attributes

The easiest way to pass data is to use data attributes.

```{eval-rst}
.. TODO::

    Document the main ways that we pass data.

    Focus on:

        * data- attributes in HTML being ready
        * the limitations of the data passed into `js_call_amd`
        * web services


```

## Promises

```{eval-rst}
.. TODO::

    We should document things like:

        * Use ``then`` and ``catch`` consistently (thennables)
        * Don't use ``catch`` if you are returning a Promise just by habit - only use it if you mean to
        * You _must_ return at the end of a thennable
        * It's generally a good idea to return a Promise from a fucntion if the function is primarily tasked with
          creating that Promise
```

:::important
You shouldn't use the `done`, `fail`, or `always` functions on Promises.
These are a jQuery feature which isn't present in the Native Promise implementation.
:::

### Examples

import GetModal from '!!raw-loader!./_examples/promises/getModal';

<CodeBlock language="js" title="Create a modal in a function">{GetModal}</CodeBlock>

## Working with Strings

One of the most helpful core modules is `core/str` which allows you to fetch and render language Strings in JavaScript.

The `core/str` module has several core methods to support fetching strings:

- `getString` - fetch a single string, returned in a _native_ Promise
- `getStrings` - fetch a set of strings, returned in an array of _native_ Promises
- `get_string` - fetch a single string, returned in a _jQuery_ Promise
- `get_strings` - fetch a set of strings, returned in an array of _jQuery_ Promises

Strings are fetched on request from Moodle, and are then cached in LocalStorage.

import WorkingWithStrings from '!!raw-loader!./_examples/str';

<CodeBlock language="js" title="Example">{WorkingWithStrings}</CodeBlock>

:::caution Native vs jQuery promises

<Since version="4.3" issueNumber="MDL-79064" />

The `getString` and `getStrings` methods should be preferred from Moodle 4.3 onwards. These return _native_ Promises, which differ slightly in behaviour from jQuery Promises.

Care should be taken in the following scenarios:

- when writing a plugin which supports Moodle 4.2 or earlier, you _must_ use the `get_string` and `get_strings` methods
- you should _never_ use `.done` or `.fail` as they do not exist in the native Promise specification, and their failure behaviour differs

:::

## Templates

## Modals

## Notifications

## AJAX Calls

## Preferences

## Prefetch

<Since versions={[ 3.9 ]} />

Assets including strings, and templates, can be pre-fetched shortly after the page loads to improve the perceived performance of the page when consuming those components.

```todo
Link to jsdocs here
```

```js title="Example of fetching a string and template"
import Prefetch from 'core/prefetch';

// Prefetch the string 'discussion' from the 'mod_forum' component.
Prefetch.prefetchString('discussion', 'mod_forum');

// Prefetch the strings yes, no, and maybe from the 'core' component.
Prefetch.prefetchStrings('core', ['yes', 'no', 'maybe']);

// Prefetch the templates 'core/toast'.
Prefetch.prefetchTemplate('core/toast');

// Prefetch the templates 'core/toast' and 'core/modal'.
Prefetch.prefetchTemplates(['core/toast', 'core/modal']);
```

## Reactive state

<Since versions={[ 4.0 ]} />

Reactivity is one of the latest developments patterns incorporated to web development. Frameworks like React, Angular and Vue are competing for being the standard for web applications. However, for now there is not a clear winner on what is the best solution in terms of performance, standarizations and reusability.

While third-party developers are free to use any reactive framework they want, core developments are framework independant. Nevertheless, some part of Moodle implements a basic reactive state pattern by an adhoc library. This library does not represent a full reactive solution but helps implementing resuable and easy to mantain frontend applications.

See the [Creating reactive UI](./javascript/reactive) for more information.

## Tools

Moodle uses common and popular tools to ensure code quality, and to improve the
end-user experience.

Most of the Moodle JavaScript tooling requires [NodeJS](/general/development/tools/nodejs).

### Grunt

[Grunt](https://gruntjs.com/) is a command-line tool used to compile JavaScript, and CSS, and to lint JavaScript, CSS, and Behat tests.

:::tip
Rather than running `grunt` on the entire Moodle source every time you make changes, you can use `grunt watch`
in the background to build just the files you change as you write them.
:::

#### Installing grunt

<Tabs>
<TabItem value="global_grunt" label="Global">

```console
npm -g install grunt-cli
```

</TabItem>
</Tabs>

#### Using grunt

<Tabs>
<TabItem value="npx_grunt" label="NPX">

```bash
npx grunt
```

</TabItem>
<TabItem value="global_grunt" label="Global">

```bash
grunt
```

</TabItem>
</Tabs>

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
- [JavaScript FAQ](https://docs.moodle.org/dev/JavaScript_FAQ)
