---
title: Theme plugins
tags:
  - Plugins
  - Theme
---

A Moodle theme allows users to customize the appearance and functionality of their Moodle site, from overall design to specific activities. Users can create their own themes or modify existing ones, leveraging CSS and JavaScript for customization. The theme architecture ensures smooth fallbacks for minimal changes, fostering flexibility and ease of use.

## File structure

import {
    Lang,
    Lib,
    VersionPHP,
} from '../../_files';

Theme plugins are located in the `/theme` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for a `theme_example` plugin.</summary>

```console
 theme/example
 |-- amd
 |   └-- src
 |-- classes
 |   └-- output
 |-- fonts
 |-- fonts_core
 |-- fonts_plugins
 |   └-- plugintype
 |        └-- pluginname
 |-- lang
 |   └-- en
 |       └-- theme_example.php
 |-- layout
 |-- pix
 |   └-- favicon.ico
 |   └-- screenshot.png
 |-- pix_plugins
 |   └-- plugintype
 |        └-- pluginname
 |-- style
 |-- scss
 |-- templates
 |-- config.php
 |-- settings.php
 └-- version.php
```

</details>

Some of the important files for the Theme plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

:::tip Override icons and templates

You can customize icons in base themes:

1. Without altering core code by placing them in `$CFG->dataroot/pix` and `$CFG->dataroot/pix_plugins`. If a theme extends a base theme and includes its own icons, those will take precedence.
1. Adding custom icons to a theme by placing them in the theme's `pix_core` and `pix_plugins` directories, as described in the [Override images section](./theme/images#override-images).

:::

Similarly, mustache templates in base themes can be overridden without impacting core code by placing them in `templates/[componentname]/[templatename].mustache`.

### config.php

All theme options are set within the `config.php` file for the theme.

<details>
  <summary>View basic theme config.php</summary>
  <div>

```php
<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Boost config.
 *
 * @package   theme_boost
 * @copyright 2016 Frédéric Massart
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/lib.php');

$THEME->name = 'boost';
$THEME->sheets = [];
$THEME->editor_sheets = [];
$THEME->editor_scss = ['editor'];
$THEME->usefallback = true;
$THEME->scss = function($theme) {
    return theme_boost_get_main_scss_content($theme);
};

$THEME->layouts = [
    // Most backwards compatible layout without the blocks.
    'base' => array(
        'file' => 'drawers.php',
        'regions' => array(),
    ),
    // Standard layout with blocks.
    'standard' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    // Main course page.
    'course' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
        'options' => array('langmenu' => true),
    ),
    'coursecategory' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    // Part of course, typical for modules - default page layout if $cm specified in require_login().
    'incourse' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    // The site home page.
    'frontpage' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
        'options' => array('nonavbar' => true),
    ),
    // Server administration scripts.
    'admin' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    // My courses page.
    'mycourses' => array(
        'file' => 'drawers.php',
        'regions' => ['side-pre'],
        'defaultregion' => 'side-pre',
        'options' => array('nonavbar' => true),
    ),
    // My dashboard page.
    'mydashboard' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
        'options' => array('nonavbar' => true, 'langmenu' => true),
    ),
    // My public page.
    'mypublic' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'login' => array(
        'file' => 'login.php',
        'regions' => array(),
        'options' => array('langmenu' => true),
    ),

    // Pages that appear in pop-up windows - no navigation, no blocks, no header and bare activity header.
    'popup' => array(
        'file' => 'columns1.php',
        'regions' => array(),
        'options' => array(
            'nofooter' => true,
            'nonavbar' => true,
            'activityheader' => [
                'notitle' => true,
                'nocompletion' => true,
                'nodescription' => true
            ]
        )
    ),
    // No blocks and minimal footer - used for legacy frame layouts only!
    'frametop' => array(
        'file' => 'columns1.php',
        'regions' => array(),
        'options' => array(
            'nofooter' => true,
            'nocoursefooter' => true,
            'activityheader' => [
                'nocompletion' => true
            ]
        ),
    ),
    // Embeded pages, like iframe/object embeded in moodleform - it needs as much space as possible.
    'embedded' => array(
        'file' => 'embedded.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    // Used during upgrade and install, and for the 'This site is undergoing maintenance' message.
    // This must not have any blocks, links, or API calls that would lead to database or cache interaction.
    // Please be extremely careful if you are modifying this layout.
    'maintenance' => array(
        'file' => 'maintenance.php',
        'regions' => array(),
    ),
    // Should display the content and basic headers only.
    'print' => array(
        'file' => 'columns1.php',
        'regions' => array(),
        'options' => array('nofooter' => true, 'nonavbar' => false, 'noactivityheader' => true),
    ),
    // The pagelayout used when a redirection is occuring.
    'redirect' => array(
        'file' => 'embedded.php',
        'regions' => array(),
    ),
    // The pagelayout used for reports.
    'report' => array(
        'file' => 'drawers.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    // The pagelayout used for safebrowser and securewindow.
    'secure' => array(
        'file' => 'secure.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre'
    )
];

$THEME->parents = [];
$THEME->enable_dock = false;
$THEME->extrascsscallback = 'theme_boost_get_extra_scss';
$THEME->prescsscallback = 'theme_boost_get_pre_scss';
$THEME->precompiledcsscallback = 'theme_boost_get_precompiled_css';
$THEME->yuicssmodules = [];
$THEME->rendererfactory = 'theme_overridden_renderer_factory';
$THEME->requiredblocks = '';
$THEME->addblockposition = BLOCK_ADDBLOCK_POSITION_FLATNAV;
$THEME->iconsystem = \core\output\icon_system::FONTAWESOME;
$THEME->haseditswitch = true;
$THEME->usescourseindex = true;
// By default, all boost theme do not need their titles displayed.
$THEME->activityheaderconfig = [
    'notitle' => true
];
```

  </div>
</details>

Everything is added to `$THEME`. This is the theme's configuration object, it is created by Moodle using default settings and is then updated by whatever settings are added to it.

- `$THEME->name`. The theme's name should simply be whatever the theme's name is, most likely whatever the theme directory is named.
- `$THEME->sheets`. An array containing the names of the CSS stylesheets to include for this theme. Boost uses SCSS instead of CSS so it doesn't list any files here.

:::note

It is just the name of the stylesheet and does not contain the directory or the file extension. Moodle assumes that the theme's stylesheets will be located in the `{theme}/style` directory of the theme and have .css as an extension.

:::

- `$THEME->editorsheets`. An array containing the names of the CSS stylesheets to include for text editor content area. Boost does not list any stylesheets here so text editors will use plain text styles.
- `$THEME->layouts`. Any of the different layout types can be mapped. For more information see the [layouts section](./theme/layout).
- `$THEME->parents`. Defines the themes that the theme will extend. Boost has no parents, but if a theme is extending boost, it should be listed it here like:

```php
$THEME->parents = ['boost'];
```

- `$THEME->enable_dock`. Boost does not support docking blocks.
- `$THEME->csstreepostprocessor`. Boost uses a function to post process the CSS. This is an advanced feature and is used in boost to automatically apply vendor prefixes to CSS styles.
- `$THEME->rendererfactory`. Almost all themes need this setting to be set to `theme_overridden_renderer_factory` or the theme will not be able to customise any core renderers.
- `$THEME->undeletableblocktypes`. This is a comma separated list of block types that cannot be deleted in this theme. If you don't define this, the admin and settings blocks will be undeletable by default. Because Boost provides alternate ways to navigate it does not require any blocks.

:::tip

When you first begin writing themes, make sure you take a look at the configuration files of the other themes that get shipped with Moodle. You will get a good picture of how everything works, and what is going on in a theme, simply by reading it and taking notice of what it is including or excluding.

:::

Have a look at the following theme options for a complete list of theme options which include lesser used specialised or advanced settings:

<details>
  <summary>Complete theme options</summary>
  <div>

#### `$THEME->blockrtlmanipulations`

Allows the theme to manipulate how the blocks are displayed in a *right-to-left* language. Not recommended CSS is automatically flipped for RTL.

#### `$THEME->csspostprocess`

Allows the user to provide the name of a function that all CSS should be passed to before being delivered.

#### `$THEME->csstreepostprocessor`

<Since version="3.2" />

Allows the user to provide the name of a function that can perform manipulations on an in-memory representation of the CSS tree. Some useful manipulations are available such as the `theme_boost\autoprefixer` which will automatically add vendor prefixes to all CSS that requires them.

#### `$THEME->doctype`

The doctype of the served documents.

#### `$THEME->editor_sheets`

An array of stylesheets to include just within the body of the text editors like Tiny. This is required if you want content to resemble its final appearance in the page, while it is being edited in the text editor.

#### `$THEME->enablecourseajax`

If set to false the course AJAX features will be disabled.

#### `$THEME->enable_dock`

If set to true the side dock is enabled for blocks.

#### `$THEME->prescsscallback`

<Since version="3.2" />

The name of a function that will return some SCSS code to inject at the beginning of the SCSS file specified in `$THEME->scss`.

#### `$THEME->extrascsscallback`

<Since version="3.2" />

The name of a function that will return some SCSS code to inject at the end of the SCSS file specified in `$THEME->scss`.

#### `$THEME->hidefromselector`

Used to hide a theme from the theme selector (unless theme designer mode is on). Accepts true or false.

#### `$THEME->javascripts`

<DeprecatedSince version=" " />

An array containing the names of JavaScript files located in `/javascript/` to include in the theme.

:::danger Deprecated

The `$THEME->javascripts` setting should no longer be used. Please use AMD [JavaScript Modules](../../../guides/javascript/modules.md) instead.

:::

#### `$THEME->javascripts_footer`

<DeprecatedSince version=" " />

As above but will be included in the page footer.

:::danger Deprecated

The `$THEME->javascripts_footer` setting should no longer be used. Please use AMD [JavaScript Modules](../../../guides/javascript/modules.md) instead.

:::

#### `$THEME->layouts`

An array setting the layouts for the theme.

#### `$THEME->scss`

<Since version="3.2" />

The name of a SCSS file in the theme's `scss/` folder to compile on the fly. Sheets with the same name will be ignored. This can also be a function which returns SCSS, in which case all import paths will be relative to the scss folder in this theme or any of it's parents.

#### `$THEME->name`

Name of the theme. Most likely the name of the directory in which this file resides.

#### `$THEME->parents`

An array of themes to inherit from. If the theme you inherit from inherits from a parent as well, you need to indicate the grandparent here too.

#### `$THEME->parents_exclude_javascripts`

An array of JavaScript files NOT to inherit from the themes parents.

#### `$THEME->parents_exclude_sheets`

An array of stylesheets NOT to inherit from the themes parents.

#### `$THEME->plugins_exclude_sheets`

An array of plugin sheets to ignore and NOT include.

#### `$THEME->renderfactory`

Sets a custom render factory to use with the theme, used when working with custom renderers. You most likely want this set to `theme_overridden_renderer_factory`.

#### `$THEME->sheets`

An array of stylesheets to include for this theme. Should be located in the theme's style directory. Not required if using SCSS.

#### `$THEME->yuicssmodules`

Old setting to define a list of YUI CSS modules to be included. These files interfere with existing styles and it is recommended to set this to an empty string to prevent any files being included.

:::danger Attention

This setting should probably be set to `''` to prevent and YUI CSS being included.

:::

#### `$THEME->undeletableblocktypes`

An array of block types that must exist on all pages in this theme or this theme will be unusable. If a block type listed here is missing when a page is loaded. It will be auto-created (but only shown for themes that require it).

#### `$THEME->addblockposition`

Either `BLOCK_ADDBLOCK_POSITION_FLATNAV`, `BLOCK_ADDBLOCK_POSITION_DEFAULT` or `BLOCK_ADDBLOCK_POSITION_CUSTOM`. Defines where to put the "Add a block" controls when editing is enabled.

  </div>
</details>

<!-- cspell:ignore themename -->

### lang/en/themename.php

import langExample from '!!raw-loader!./_examples/lang.php';
import langDescription from './_examples/lang.md';

<Lang
    plugintype="theme"
    pluginname="boost"
    example={langExample}
    description={langDescription}
/>

### version.php

<VersionPHP
    plugintype="theme"
/>

## Insights

### Getting your theme to appear correctly in theme selector

If you follow the examples on this page to the letter, when you go to the `Theme Selector` page you may be discouraged to find that your theme does not appear like the other themes do. In fact, instead of your theme's name, you will see something along the lines of `[pluginname](https://docs.moodle.org/dev/pluginname)`.

To correct this, you must add the `theme/THEMENAME/lang/en/theme_THEMENAME.php` file, where `THEMENAME` is the name of the theme folder. Inside that file, add the string `$string[]('pluginname') = 'THEMENAME';`. Make `THEMENAME` the name of your theme, however you want it displayed in the Theme selector.

Also, make sure to change your [`config.php`](#configphp) file and [`version.php`](#versionphp) file to reflect the correct name:

```php title="config.php"

$THEME->name = 'NAME';

```

```php title="version.php"

$plugin->component = 'THEMENAME'; // Full name of the plugin (used for diagnostics)

```

The `screenshot` for the theme should be about `500 x 400 px`.

### Required theme `divs`

Some parts of Moodle may rely on particular `divs`, for example the div with id `page-header`. Consequently all themes must include at least the `divs` (with the same ids) that are present in the `boost` theme.

Missing out these elements may result in unexpected behaviour within specific modules or other plugins.

## Caching

When Moodle is not running in theme designer mode it will look for a cached version of the compiled CSS for the current theme to serve to the browser requesting the page. If the cached file doesn't yet exist then the CSS will be built and cached during the page request.

The cached CSS is located on disk in Moodle's local cache:

```
 <moodledata>/localcache/theme/<global_theme_revision>/<theme_name>/css/all_<theme subrevision>.css
```

The cache path consists of a global theme revision (`themerev` config value) and a per theme sub-revision (`themesubrev` plugin config value). If either of those are incremented it will change the path to the cache file and cause a new file to be generated.

Individual theme's CSS cache can be built by using the admin CLI script:

```bash
  php admin/cli/build_theme_css.php --themes boost
```

The script will only increment the theme sub-revision of the theme(s) being built which means existing theme cache's remain untouched.

## See also

<!-- cspell:ignore HRDNZ -->

- MoodleAcademy courses. For instance:
  - [Moodle Page Layout and Site Navigation](https://moodle.academy/course/view.php?id=110)
  - [Accessible Development Practices](https://moodle.academy/course/view.php?id=54)

- MoodleBites Theme Design. Completely online courses [Level 1](https://www.moodlebites.com/mod/page/view.php?id=3208) and [Level 2](https://www.moodlebites.com/mod/page/view.php?id=3210) are designed to assist Moodle administrators, designers, and developers get up-to-speed with Moodle Theme design, and are run by [HRDNZ](https://www.hrdnz.com) (Certified Moodle Partner since 2006).
