---
title: CSS Coding Style
tags:
  - Coding guidelines
  - Policies
  - Developer processes
---

## Overview

### Scope

This document describes style guidelines for developers working on or with Moodle code. It talks purely about the mechanics of code layout and the choices we have made for Moodle.

### Goals

Consistent coding style is important in any development project, and particularly when many developers are involved. A standard style helps to ensure that the code is easier to read and understand, which helps overall quality.

Abstract goals we strive for:

- simplicity
- readability
- tool friendliness

### Useful tools

We use [stylelint](https://stylelint.io) to ensure conformance with our coding style, for more details see [Linting](https://docs.moodle.org/dev/Linting#CSS.2FSCSS.2FLESS_.28stylelint.29)

## File naming

Within plugins, CSS files are normally named `styles.css`.

In the theme, files can be named according to the theme designer's wishes but should:

- use lowercase letters and '-' to separate words
- be as succinct as possible
- be descriptive
- be placed in the folder `style/` for CSS files, or in `less/` for LESS files.

## Blocks

- Each selector should be on its own line. If there is a comma in a selector list, follow it with a line break.
- Property-value pairs should be on their own line, with four spaces of indentation and an ending semicolon.
- The closing brace should use the same level of indentation as the opening selector.
- Leave one line between blocks.

<ValidExample>

```css
@media only screen and (min-width: 768px) {
    .selector-one,
    .selector-two {
        color: #fff;
        background-color: #000;
    }
}
```

</ValidExample>

<InvalidExample>

```css
.selector_one, .selector_two { color: #fff; background-color: #000; }
```

</InvalidExample>

## Selectors

- Always use lower case and underscores or hyphens. Hyphens are preferred.
- Names should be made of simple English words.
- Verbosity is encouraged: names should be as illustrative as is practical to enhance understanding.
- Use [semantic names](https://css-tricks.com/semantic-class-names/): names tell what this is instead of what should it look like.
- Avoid using IDs. They are far more difficult to maintain and override.
- Do not over-qualify your rules by combining a tagname with a class or ID.

<ValidExample>

```css
.selector_name {
    color: #fff;
}

.selector-name {
    color: #fff;
}
```

</ValidExample>

<InvalidExample>

```css
div#selName {
    color: #fff;
}

.Color-White {
    color: #fff;
}
```

</InvalidExample>

## Properties and values

- Should be separated by a colon and a single space, do not minify them.
- Should be lowercase, except for font names and vendor-specific properties.
- For color codes, lowercase is preferred and a shorthand whenever possible.
- For color codes, if you use HSLA or RGBA, always provide a hex fallback.
- Use shorthand (except when overriding styles) for background, border, font, list-style, margin, and padding values.
- Do not use `!important`. If there is no alternative something is wrong with the CSS you are trying to override.
- Prefixed vendor-specific properties pairs should appear directly before the generic property they refer to.

## Units

- Allowed CSS units are px, rem, and em.
- Do not declare the unit when the value is 0.

<ValidExample>

```css
.something {
    margin-top: 0;
    font-size: 1.25em;
}
```

</ValidExample>

<InvalidExample>

```css
.something {
    margin-top: 0px;
    font-size: 1pt;
}
```

</InvalidExample>

## Documentation and comments

Following the general [Coding style](./index.md), comments should start with a capital letter and end with a period.

A block-style comment at the top of the CSS file should explain the purpose of the rules in the file.

```css
/**
 * File base.css.
 * Contains base styles for theme basic.
 */
```

Block-style comments can also be used to denote a section in a CSS file where all rules pertain to a specific component, view, or functionality:

```css
/**
 * SCORM Navigation Sidebar.
 */
```

Use single-line comments to provide more information to other developers about a single rule or small subset of rules:

```css
/* Required because YUI resets add a black border to all tables */
```

## Progressive enhancement

- Fallbacks should always be provided. For example, provide a background color fallback to background images and gradients.
- Use vendor prefixes only when the supported browser in question does not support the unprefixed property.
- The standard property should come after the vendor-prefixed property.

```css
.selector {
    background-color: #444; /* Fallback for browsers that don't support gradients. */
    filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#444', EndColorStr='#999'); /* IE6-IE9. */
    background-image: -webkit-gradient(linear, left top, left bottom, from(#444), to(#999)); /* Safari 4+, Chrome. */
    background-image: -webkit-linear-gradient(top, #444, #999); /* Chrome 10+, Safari 5.1+, iOS 5+. */
    background-image: -moz-linear-gradient(top, #444, #999); /* Firefox 3.6. */
    background-image: -ms-linear-gradient(top, #444, #999); /* IE10. */
    background-image: -o-linear-gradient(top, #444, #999); /* Opera 11.10+. */
    background-image: linear-gradient(top, #444, #999); /* W3C Standard. */
}
```

## Browser Hacks

- Do not use any browser-specific hacks. Moodle provides a more appropriate way to write browser-specific CSS using classes that are added to the body element. For example:

```css
.ie7 .forum-post {
    min-height: 1px;
}
```

- It is not necessary to include hacks for versions of browsers that Moodle core does not provide support for (e.g. IE8 in Moodle 3.0).

## Plugins

In plugins, the file names can be:

- `styles.css` (Recommended)
- `styles_<theme name>.css` (Not recommended, reserved to 3rd party plugins)

### bare-bones

Plugins of [Marketplace](https://marketplace.moodle.com/) should define the strict minimum, no text sizes, colours, etc ... those should belong to the theme and not be hardcoded in plugins to allow for easy theming. Of course, this requires Moodle core to provide re-usable classes to style the elements. As Moodle 2.7 has made Bootstrap 2 by default we can start using their classes, but we should make sure that there is a sensible fallback for themes not extending Bootstrap.

If a plugin is not intended to be published in Marketplace, define its own styles should not be a problem.

## Right-to-left

Since Moodle 3.2, most of the work is automatically done for developers.

### Auto flipping

Using the tool [RTLCSS-PHP](https://github.com/moodlehq/rtlcss-php), the styles are automatically flipped when the language is right-to-left. However, as there always are a few exceptions, special comments can be added to the CSS files to prevent rules from being flipped, etc...

Here is an example.

```css
.hello-world {
    margin-left: 10px;
    /*rtl:ignore*/
    padding-left: 10px;

    background: url('logo.png') 0 0 no-repeat;
    /*rtl:raw:
    background-image: url('logo-rtl.png');
    */

    color: blue;
}
```

Will become:

```css
.hello-world {
    margin-right: 10px;
    padding-left: 10px;

    background: url('logo.png') 0 100% no-repeat;
    background-image: url('logo-rtl.png');

    color: blue;
}
```

For more information on the special comments, refer to the documentation of the tool [RTLCSS-PHP](https://github.com/moodlehq/rtlcss-php).

#### Caveats

It is important to note that the special comments must NOT end a file or a rule block. All comments not preceding a block, or a rule are ignored.
Or in other words: currently the comments must always precede a statement, they will not work if they are not followed by anything.

Also note that comments in SCSS or LESS will often not produce the desired effect. When dealing with SCSS and LESS, ensure that your special RTL comments are attached to pure CSS statements: no `@extend`, indented rules, etc...

### Forcing the text direction

Whilst `.dir-rtl` should not be used any more, we've added `.text-ltr` which allows developers to force the direction of the text to left-to-right. This is especially needed for forms fields like: URLs, OS level Folders paths & apps, theme hex colors, English DB field names, emails, English text, numbers, regular expression patterns, symbols, code snippets or configuration samples.

## LESS

[LESS](http://lesscss.org/) works like CSS with some extra features. It should follow the CSS guidelines.

### Variables

- They should use camelCase to follow Bootstrap 2 that is used in core.
- As for CSS selectors, use semantic names: names tell what this is instead of what should it look like.
- As Bootstrap 2 does, do not add the word "Color" to variables for _background_ or _border_ and their derivatives.
- Declaring new variables should be done sparingly, too many variables kill the purpose of using them. If you declare one, try to set its default value from another one.
- Do not declare more variables than necessary. E.g.: If the background color and border color are likely to always be the same, prefer one variable.

<ValidExample>

```css
@textColor: red;
@wellBackground: #ccc;
@tableBackground: blue;
@blockBackground: @wellBackground;
@calendarGroupEvent: #f90;
```

</ValidExample>

<InvalidExample>

```css
@text-color: red;
@wellBackground: #ccc;
@tableBackgrounColor: blue;
@blockBackground: #ccc;
@calendarGroupEventBackground: #f90;
@calendarGroupEventBorder: #f90;
```

</InvalidExample>

### Selectors

- Selectors should be encapsulated rather than duplicated.

<ValidExample>

```css
div {
    .something {
        color: red;
        a {
            color: blue;
        }
    }
    .something-else a {
        color: green;
    }
}
```

</ValidExample>

<InvalidExample>

```css
div .something {
    color: red;
}
div .something a {
    color: blue;
}
div .something-else a {
    color: green;
}
```

</InvalidExample>

### Values and properties

- Colours, font sizes, etc... should never be hardcoded. You should, where possible, use a variable instead.
- The use of 'mixins' is encouraged instead of duplicating values and properties.

<ValidExample>

```css
.error {
    font-size: @fontSizeSmall;
    color: @errorText;
    padding: 1em;
    background-color: @errorBackground;
}
div .form-error {
    .error;
}
```

</ValidExample>

<InvalidExample>

```css title="Note the duplication of properties and values"
.error {
    font-size: 12px;
    color: red;
    padding: 1em;
    background-color: white;
}
div .form-error {
    font-size: 12px;
    color: red;
    padding: 1em;
    background-color: white;
}
```

</InvalidExample>

## Themes Clean and More

Clean theme should, where possible, not contain any CSS or LESS content. More theme, in comparison, inherits CSS styles for the logo from Clean theme, but also contains a small amount of LESS as an example for when customising a theme. Both Clean and More inherit fully all the CSS from their parent theme 'Bootstrap Base'.

## Credits

This document was drawn from the following sources:

- The [WordPress CSS Coding Standards](http://codex.wordpress.org/CSS_Coding_Standards)

## See Also

- [Coding style](./index.md)
- [Styles](/docs/apis/plugintypes/theme/styles)
- [Coding](../../policies.md)
