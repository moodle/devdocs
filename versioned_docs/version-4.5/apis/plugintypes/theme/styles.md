---
title: Styles
tags:
  - Plugins
  - Theme
  - Styles
sidebar_position: 4
---

Let's begin by exploring the various locations within Moodle from which CSS can be included:

- `\theme\themename\style\*.css`. This is the default location for all of the stylesheets that are used by a theme and the place which should be used by a theme designer if this theme is using CSS. Alternative to CSS is SCSS which is more powerful, flexible and easier to maintain.<br/>
New theme developers should note that the order in which CSS files are found and included creates a hierarchy.  This order ensures that the rules, within a theme's style sheets, take precedence over identical rules in other files that may have been introduced before.  This can both extend another files definitions (see parent array in the config file) and also ensures that the current theme's CSS rules/definitions have the last say.<br/>
There are other locations that can be used (although very rarely) to include CSS in a page. A developer of a php file can manually specify a stylesheet from anywhere within Moodle, like the database. Usually, if code is doing this, it is because there is a non-theme config or plugin setting that contains information requires special CSS information.  As a theme designer you should be aware of, but not have to worry about, these locations of CSS files.  Here are some examples:
- `{pluginpath}\styles.css` (for instance, `\block\blockname\styles.css` or `\mod\modname\styles.css`). Every plugin can have its own styles.css file. This file should only contain the required CSS rules for the module and should not add anything to the look of the plugin such as colours, font sizes, or margins other than those that are truly required.<br />Theme specific styles for a plugin should be located within the themes styles directory.
- `{pluginpath}\styles_themename.css`. This should only ever be used by plugin developers. It allows them to write CSS that is designed for a specific theme without having to make changes to that theme. You will notice that this is never used within Moodle and is designed to be used only by contributed code.

:::tip

As theme designers, only the first method of introducing CSS will be used: adding rules to a stylesheet file located in the theme's style directory.

:::

## CSS pre-processors

Browsers understand CSS well, but it is hard to write and maintain. The language does not support inheritance and reuse. [Support for variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) exists in more modern browsers only.  This is why CSS pre-processors were invented. Moodle supports SASS, which is recommended by far.

:::info Information

To use SASS, define `$THEME->scss = 'filename';` in your themes `config.php`. Moodle will then use one of it's in-built CSS pre-processor to compile the CSS the first time it is loaded (or every time if `themedesignermode` is enabled in `$CFG`).

For more information see: [SASS (wikipedia)](https://en.wikipedia.org/wiki/Sass_(stylesheet_language))

:::

## Core CSS organisation

None of the themes provided in the standard install by Moodle use CSS stylesheets directly. Instead they use either SCSS to generate the style sheets. They all list one main SCSS file named `moodle` or scss folders and this file uses imports to load all other required files.

:::note

As a theme designer, it is entirely up to you how you create and organize your CSS and the rules you create.

:::

## How to write effective CSS rules within Moodle

:::warning Important

Writing good CSS rules is incredibly important.

:::

Due to performance requirements and browser limitations, all of the CSS files are combined into a single CSS file that gets included every time. This means that rules need to be written in such a way as to minimise the chances of a collision leading to unwanted styles being applied. Whilst writing good CSS is something most designers strive for we have implemented several new body classes and prompt developers to use appropriate classnames.

### \<body\> CSS id and classes

The `ID` tag that gets applied to the body will always be a representation of the URI. For example if you are looking at a forum posting and the URI is `/mod/forum/view.php` then the body tags `ID` will be `#page-mod-forum-view`.

As well as the body's ID attribute the URI is also exploded to form several CSS classes that get added to the body tag, so in the above example `/mod/forum/view` you would end up with the following classes being added to the body tag: `.path-mod` and `.path-mod-forum`.

:::note

`.path-mod-forum-view` is not added as a class, this is intentionally left out to lessen confusion and duplication as rules can relate directly to the page by using the ID and do not require the final class.

:::

The body ID and body classes described above will form the bread and butter for many of the CSS rules you will need to write for your theme, however there are also several other very handy classes that get added to the body tag that will be beneficial to you once you start your journey down the rabbit hole that is theming. Some of the more interesting classes are listed below.

- If JavaScript is enabled then `jsenabled` will be added as a class to the body tag allowing you to style based on JavaScript being enabled or not.
- Either `dir-rtl` or `dir-ltr` will be added to the body as a class depending on the direction of the language pack. This allows you to determine your text-alignment based on language if required:
  - `rtl` = right to left
  - `ltr` = left to right.
- A class will be added to represent the language pack currently in use, by default `en_utf8` is used by Moodle and will result in the class `lang-en_utf8` being added to the body tag.
- The `wwwroot` for Moodle will also be converted to a class and added to the body tag allowing you to stylise your theme based on the URL through which it was reached. For example, `http://sam.moodle.local/moodle/` will become `.sam-moodle-local—moodle`.
- If the current user is not logged then `.notloggedin` will be added to the body tag.
- The course format type will be added such as `format-weeks`.
- The course id, context id and category id are all added as in `course-11 context-616 cmid-202 category-1`.
- The `pagelayout` is added as `pagelayout-incourse`.

:::info What does all of this look like in practise?

Using the above example `/mod/forum/view.php` this will be the body tag:

```html
<body
    id="page-mod-forum-view"
    class="format-weeks forumtype-social
        path-mod path-mod-forum safari dir-ltr lang-en yui-skin-sam yui3-skin-sam
        sam-moodle-local—moodle
        pagelayout-incourse
        course-11 context-616 cmid-202 category-1
        jsenabled" >
```

:::

### Writing your rules

By following the [CSS coding style](https://docs.moodle.org/dev/CSS_coding_style) and CSS best-practices and understanding the [cascading order](http://htmlhelp.com/reference/css/structure.html#cascade) of CSS a theme developer will reduce collisions and lines of CSS that is written. CSS classes have been placed where it is believed anyone may want to apply their own styles.

When starting to write rules make sure that you have a good understanding of where you want those rules to be applied, it is a good idea to make the most of the body classes mentioned above.

- If you want to write a rule for a specific page make use of the body tag's ID:

```css
    #page-mod-forum-view .forumpost {
    border: 1px solid blue;
}
```

- If you want to write a rule that will be applied all throughout the forum:

```css
.path-mod-forum .forumpost {
    border: 1px solid blue;
}
```

The other very important thing to take into consideration is the structure leading up to the tag you want to style. Browsers apply conflicting styles with priority on the more specific selectors. It can be very beneficial to keep this in mind and write full selectors that rely on the structure of the tags leading to the tag you wish to style.

By making use of body id's and classes and writing selectors to take into account the leading structure you can greatly minimise the chance of a collision both with Moodle now and in the future.

:::tip

It is also important to **write as FEW rules as possible**. CSS is extremely hard to maintain and lots of CSS is bad for client side performance.

:::

Themes based on the Bootstrap CSS framework can achieve most things without writing a single additional CSS rule. Please read [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/introduction/ the Bootstrap documentation) and learn how to use Bootstrap well to avoid adding unnecessary CSS rules for things already provided by the framework.

## Compiling SCSS on the fly

<Since version="3.2" />

You can provide a SCSS file that will be compiled (and cached) on the fly. The purpose of this feature is to dynamically allow the customisation of SCSS variables. See the [dedicated page on SCSS](https://docs.moodle.org/dev/SCSS).
