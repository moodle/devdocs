---
title: version.php
tags:
  - Plugins
  - Common files
  - Plugin types
description: A description of the plugin version.php file, describing the various features
---

import { LanguageProperty } from '@site/src/components';

Every plugin must have a `version.php` file located in the root directory of that plugin.

It contains a number of properties, which are used during the plugin installation and upgrade process. It allows to make sure the plugin is compatible with the given Moodle site, as well as spotting whether an upgrade is needed.

## Plugin version properties

### Component

<LanguageProperty
    required
    types={["string"]}
/>

The component value contains the name of the plugin in its full [frankenstyle](/general/development/policies/codingstyle/frankenstyle) format.

```php
$plugin->component = 'plugintype_pluginname';
```

This value is used during the installation and upgrade process for diagnostics and validation purposes to make sure the plugin code has been deployed to the correct location within the Moodle code tree.

### Version

<LanguageProperty
    required
    types={["integer"]}
/>

The version number of the plugin. The format is partially date based with the form YYYYMMDDXX where XX is an incremental counter for the given year (YYYY), month (MM) and date (DD) of the plugin version's release. Every new plugin version must have this number increased in this file, which is detected by Moodle core and the upgrade process is triggered.

If multiple stable branches of the plugin are maintained, the date part YYYYMMDD should be frozen at the branch forking date and the XX is used for incrementing the value on the given stable branch (allowing up to 100 updates on the given stable branch). The key point is that the version number is always increased both horizontally (within the same stable branch, more recent updates have higher XX than any previous one) and vertically (between any two stable branches, the more recent branch has YYYYMMDD00 higher than the older stable branch). Pay attention to this. It's easy to mess up and hard to fix.

```php
$plugin->version = 2022061700;
                // YYYY
                //     MM
                //       DD
                //         XX
```

### Requirements

<LanguageProperty
    recommended
    types={["integer"]}
/>

The requires key specifies the minimum version of Moodle core requires for this plugin to function. It is _not_ possible to install the plugin on an earlier version of Moodle.

Moodle core's version number is defined in the `version.php` file located in the Moodle root directory.

```php
// Require Moodle 4.0.0.
$plugin->requires = 2022041900.00;
```

### Supported versions

<LanguageProperty
    types={["integer[]"]}
/>
<Since versions={["3.9"]} issueNumber={"MDL-59562"} />

A set of branch numbers to specify the lowest and highest branches of Moodle that the plugin supports. These value are inclusive.

```php title="Support all versions of Moodle 3.11, and 4.0"
$plugin->supported = [

    // Support from the Moodle 3.11 series.
    311,

    // To the Moodle 4.0 series.
    400,
];
```

### Incompatible versions

<LanguageProperty
    optional
    types={["integer"]}
/>
<Since versions={["3.9"]} issueNumber={"MDL-59562"} />

The _earliest_ **incompatible** version of Moodle that the plugin cannot support the specified branch of Moodle.

The plugin will not be installable on any versions of Moodle from this point on.

```php title="Specify that this version of the plugin does not support Moodle 3.11 and subsequent releases"
$plugin->incompatible = 311;
```

### Maturity

<LanguageProperty
    recommended
    types={["enum"]}
/>

The maturity of the plugin, otherwise known as its stability. This value affects the [available update notifications](https://docs.moodle.org/en/Available_update_notifications) feature in Moodle.

Administrators can configure their site so that they are not notified about an available update unless it has certain maturity level declared.

```php
// The plugin is a pre-release version.
$plugin->maturity = MATURITY_ALPHA;

// The plugin is a beta version.
$plugin->maturity = MATURITY_BETA;

// The plugin is a release candidate version.
$plugin->maturity = MATURITY_RC;

// The plugin is a stable version.
$plugin->maturity = MATURITY_STABLE;
```

### Release name

<LanguageProperty
    recommended
    types={["string"]}
/>

A human-readable version name that should help to identify each release of the plugin.

This can be any value you like, although it is recommended that you choose a pattern and stick with it. Usually this is a simple version like <tt>2.1</tt> but some plugin authors use more sophisticated schemes or follow the upstream release name if the plugin represents a wrapper for another program.

```php
// This plugin release is version 1.0 for the 52.0-flamethrower upstream dependency.
$plugin->release = '52.0-flamethrower-1.0';
```

### Peer dependenices

<LanguageProperty
    types={["string[]"]}
/>

An optional list of related plugins that this plugin depends upon to work.

Moodle core checks that these declared dependencies are met, and will prevent installation and upgrade of this plugin if any of the dependencies are not met.

```php
$plugin->dependencies = [
    // Depend upon version 2022041900 of mod_forum.
    'mod_forum' => 2022041900,

    // Depend upon version 2022041900 of block_foo.
    'block_foo' => 2022041900,
]
```

## File template

Here is a template for the plugin's version.php file to copy and paste:

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
 * @package   plugintype_pluginname
 * @copyright 2020, You Name <your@email.address>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$plugin->version = 2022060100;
$plugin->requires = 2022041900.00; // Moodle 4.0.
$plugin->supported = [400, 400];
$plugin->incompatible = 401;
$plugin->component = 'tool_example';
$plugin->maturity = MATURITY_STABLE;
$plugin->release = '41.3-lemmings-1.0';

$plugin->dependencies = [
    'mod_forum' => 2022041900,
    'mod_data' => 2022041900,
];
```

## See also

- [Moodle versions](https://docs.moodle.org/dev/Moodle_versions)
