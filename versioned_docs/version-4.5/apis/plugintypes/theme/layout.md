---
title: Layout
tags:
  - Plugins
  - Theme
  - Layout
sidebar_position: 1
---

All themes are required to define the layouts they wish to be responsible for as well as create; however, many layout files are required by those layouts. If the theme is overriding another theme then it is a case of deciding which layouts this new theme should override. If the theme is a completely fresh start then you will need to define a layout for each of the different possibilities.

:::tip

Note that a new theme that will base itself on another theme (overriding it) does not need to define any layouts or use any layout files if there are no changes that it wishes to make to the layouts of the existing theme.

:::

Layouts are defined in [`config.php`](../theme#configphp) within `$THEME->layouts`.

The following is an example of one such layout definition:
<details>
  <summary>View example of one layout definition in config.php</summary>
  <div>

```php
$THEME->layouts = [
    // Standard layout with blocks, this is recommended for most pages with general information
    'standard' => [
        'theme' => 'boost',
        'file' => 'columns2.php',
        'regions' => ['side-pre'],
        'defaultregion' => 'side-pre',
    ],
],
```

  </div>
</details>

The first thing Moodle looks at is the name of the layout, in this case it is `standard` (the array key in PHP), it then looks at the settings for the layout, this is the theme, file, regions, and default region. There are also a couple of other options that can be set by a layout:

- `theme` [ *Optional* ]. Is the theme the layout file exists in. That's right: you can make use of layouts from other installed themes.
- `file` [ *Required* ]. Is the name of the layout file this layout wants to use.
- `regions` [ *Required* ]. Is the different block regions (places you can put blocks) within the theme.
- `defaultregion` [ *Required if regions is non-empty, otherwise optional* ]. Is the default location when adding new blocks.
- `options` [ *Optional* ]. An array of layout specific options described in detail below.

The **theme** is optional. Normally the layout file is looked for in the current theme, or, if it is not there, in the parent theme. However, you can use a layout file from any other theme by giving the theme name here.

You can define whatever regions you like. You just need to pick a name for each one. Most themes just use one or both of `side_pre` and `side_post`, which is like 'left side' and 'right side', except in right to left languages, when they are reversed. If you say in [`config.php`](../theme#configphp) that your the layout provides regions called `fred` and `barney`, then you must call `$OUTPUT->blocks_for_region('fred')` and `$OUTPUT->blocks_for_region('barney')` somewhere in the layout file.

The final setting **options** is a special case that only needs to be set if you want to make use of it. This setting allows the theme designer to specify special options that they would like to create that can be later accessed within the layout file. This allows the theme to make design decisions during the definition and react upon those decisions in what ever layout file is being used.

One such place this has been used is within the boost theme. If you take a look first at `theme/boost/config.php` you will notice that several layouts specify options `langmenu` and `nonavbar` which can both be set to either true or false. The layout options can then be used on the `layout .php` files, mustache templates and renderers.

```php
<?php
$hasnavbar = (empty($PAGE->layout_options['nonavbar']) && $PAGE->has_navbar());
$hasfooter = (empty($PAGE->layout_options['nofooter']));
```

## Layout files

Layout files are used to provide a different layout of the elements of the page for different types of pages in Moodle.

In the [`config.php`](../theme#configphp) for a theme there is a list of **layouts** which map a page type to a specific PHP page in the layout folder for the theme.

<details>
  <summary>View example of layout definition for popup</summary>
  <div>

```php title="theme/boost/config.php"
    'popup' => [
        'file' => 'columns1.php',
        'regions' => [],
        'options' => ['nofooter' => true, 'nonavbar' => true],
    ],
```

This example means every page that has pagetype `popup` will be displayed with the `theme/themename/layout/columns1.php` file, it will have no block regions and there are some options that will be available to the page in the global variable `$PAGE->layout_options`.

  </div>
</details>

:::tip

It is possible to implement a layout file directly in PHP by echoing the HTML for the page, or mixing PHP tags with HTML, but a better way to create a layout file is to gather all the information required for the layout into a context and render it with a mustache template.

Using templates for layout files makes a lot of sense because they are easier to read and maintain than mixing PHP and HTML in the same file.

[Read about mustache templates](../../../guides/templates/index.md)

:::

<details>
  <summary>View example of a layout file using a template</summary>
  <div>

```php title="theme/boost/layout/columns1.php"
<?php

$bodyattributes = $OUTPUT->body_attributes([]);

$templatecontext = [
    'sitename' => format_string($SITE->shortname, true, ['context' => context_course::instance(SITEID), "escape" => false]),
    'output' => $OUTPUT,
    'bodyattributes' => $bodyattributes
];

echo $OUTPUT->render_from_template('theme_boost/columns1', $templatecontext);
```

This example puts some variables into a `templatecontext` and then calls `render_from_template` to render the mustache template for this layout. The template is located at `theme/boost/templates/columns1.mustache`.
It is possible to put PHP classes in the context for the mustache template and any public properties or methods which accept no arguments will be available to the template. `$OUTPUT` has several useful public methods which accept no arguments and is a valuable class when creating a layout template in mustache.

  </div>
</details>

<details>
  <summary>View example of the mustache template for the previous layout</summary>
  <div>

```handlebars title="theme/boost/templates/columns1.mustache"
{{{ output.doctype }}}
<html {{{ output.htmlattributes }}}>
<head>
    <title>{{{ output.page_title }}}</title>
    <link rel="shortcut icon" href="{{{ output.favicon }}}" />
    {{{ output.standard_head_html }}}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body {{{ bodyattributes }}}>

<div id="page-wrapper">

    {{{ output.standard_top_of_body_html }}}

    <div id="page" class="container-fluid">
        <div id="page-content" class="row">
            <div id="region-main-box" class="col-xs-12">
                <section id="region-main">
                    <div class="card card-block">
                    {{{ output.course_content_header }}}
                    {{{ output.main_content }}}
                    {{{ output.course_content_footer }}}
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>
{{{ output.standard_end_of_body_html }}}
</body>
</html>
{{#js}}
require(['theme_boost/loader']);
{{/js}}
```

Explaining each line of this template will answer a lot of questions. This example contains only the very minimal required functions to generate a valid layout. You should consider all of the sections below as required in every layout file (although any of the HTML tags can and should be altered).

- Calling a function on `$OUTPUT` in `PHP`. Because there is a public method on the output class named `doctype` which accepts no arguments, mustache will call it and return the output. A function to generate the `doctype` tag is called because calling this function returns the correct HTML for the document type for this theme AND it sets a different content type header (including the charset) depending on the doc type for the theme. Setting a correct charset in every page is important to prevent a class of XSS attacks.

```handlebars
{{{ output.doctype }}}
```

- The root tag, the HTML tag, has been reintroduced. A set of default attributes for the page has been included by invoking the `htmlattributes` function of the output class. This encompasses the appropriate language attribute for the entire page and potentially an XML namespace for XHTML documents.

```handlebars
<html {{{ output.htmlattributes }}}>
```

- The head section of the document has been initiated, and the title for the page has been set. Note that the title is already escaped by the output class, so triple mustache tags `{{{` are being used to prevent double escaping.

```handlebars
<head>
    <title>{{{ output.page_title }}}</title>
```

- A function is called to obtain the URL to the favicon. The favicon resides in the theme pix directory and is served through the `theme/image.php` file, which adds special caching headers for images.

```handlebars
    <link rel="shortcut icon" href="{{{ output.favicon }}}" />
```

- The standard head HTML function handles a significant amount of necessary setup for our page. It internally creates the block regions, generates meta tags including keywords for SEO, initializes common JavaScript modules, generates links to the style sheets, and injects any additional HTML set by the `$CFG->additionalhtmlhead` setting.

```handlebars
    {{{ output.standard_head_html }}}
```

- This `viewport` meta tag is recommended by bootstrap for "proper viewport rendering and touch zooming".

```handlebars
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
```

- The body attributes include the language direction and standard classes for the page.

```handlebars
<body {{{ bodyattributes }}}>

```

- In the Boost theme, a `page-wrapper` div is utilized to prevent content from disappearing under the fixed header.

```handlebars
<div id="page-wrapper">
```

- The `standard_top_of_body_html` should be included in every layout and includes skip links for accessibility as well as initialising JQuery, YUI and own static JavaScript files.

```handlebars
    {{{ output.standard_top_of_body_html }}}
```

- This is standard HTML tags defining the content region for this page. The classes come from Bootstrap 4.

```handlebars
    <div id="page" class="container-fluid">
        <div id="page-content" class="row">
            <div id="region-main-box" class="col-xs-12">
                <section id="region-main">
                    <div class="card card-block">
```

- The course content header allows Moodle plugins to inject things in the top of the page. This is used for "notifications" for example (which are the alert boxes you see after submitting a form).

```handlebars
                    {{{ output.course_content_header }}}
```

- The main content function returns the real content for the page.

```handlebars
                    {{{ output.main_content }}}
```

- The course content footer is used mainly by course formats to insert things after the main content.

```handlebars
                    {{{ output.course_content_footer }}}
```

- Close all the open tags.

```handlebars
</div>
                </section>
            </div>
        </div>
    </div>
</div>
```

- This function will add all of the JavaScript that was required while rendering the page. JavaScript is added at the end of the document so that it does not block rendering the page.

```handlebars
{{{ output.standard_end_of_body_html }}}
```

- Finish the HTML for the page.

```handlebars
</body>
</html>
```

- The final section is required for Bootstrap 4 themes and loads all the Bootstrap 4 JavaScript dependencies.

```handlebars
{{#js}}
require(['theme_boost/loader']);
{{/js}}
```

  </div>
</details>

If we had block regions in this layout we would need to insert them in the template. The way we would do this is by getting the HTML for the block region in our layout PHP file, adding it to the context and then including it in our template.

```php title="theme/boost/layout/columns2.php"
$blockshtml = $OUTPUT->blocks('side-pre');
$hasblocks = strpos($blockshtml, 'data-block=') !== false;
...
$templatecontext = [
...
    'sidepreblocks' => $blockshtml,
    'hasblocks' => $hasblocks,
...
];
echo $OUTPUT->render_from_template('theme_boost/columns2', $templatecontext);
```

```handlebars title="theme/boost/templates/columns2.mustache"
    {{#hasblocks}}
    <section data-region="blocks-column" class="hidden-print">
        {{{ sidepreblocks }}}
    </section>
    {{/hasblocks}}
```

When writing layout files, consider the variations in layouts and how the HTML utilized in each may differ. It is often unnecessary to create a distinct layout file for every layout; instead, existing layout files can often be reused across multiple layouts. Additionally, employing layout options can further minimize the need for creating additional layout files.

It's important to note again that when customizing an existing theme, the creation of layouts or layout files may not be necessary.

## Layout types

- `base`. Most backwards compatible layout without the blocks. This is the layout used by default.
- `standard`. Standard layout with blocks. This is recommended for most pages with general information.
- `course`. Main course page.
- `coursecategory`. Use for browsing through course categories.
- `incourse`. Default layout while browsing a course, typical for modules.
- `frontpage`. The site home page.
- `admin`. Administration pages and scripts.
- `mycourses`. My courses page.
- `mydashboard`. My dashboard page.
- `mypublic`. My public page.
- `login`. The login page.
- `popup`. Pages that appear in pop-up windows (no navigation, no blocks, no header).
- `frametop`. Used for legacy frame layouts only. No blocks and minimal footer.
- `embedded`. Used for embedded pages, like iframe/object embedded in moodleform. It needs as much space as possible.
- `maintenance`. Used during upgrade and install. This must not have any blocks, and it is a good idea if it does not have links to other places. For example there should not be a home link in the footer.
- `print`. Used when the page is being displayed specifically for printing.
- `redirect`. Used when a redirection is occurring.
- `report`. Used for reports.
- `secure`. Used for `safebrowser` and `securewindow`.
