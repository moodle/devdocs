---
title: Composer support for plugins
tags:
  - Composer
  - Plugins
  - Package management
description: How to make your Moodle plugin available via Composer, and developer tips for working with Composer-based Moodle sites.
---

<Since version="5.2" issueNumber="MDL-87473" />

Moodle 5.2 introduced native support for distributing and installing Moodle plugins using [Composer](https://getcomposer.org/), the PHP package manager. Plugin developers can publish their plugins to [Packagist](https://packagist.org/) and site administrators can install them with a simple `composer require` command.

The [moodle/composer-installer](https://github.com/moodle/composer-installer) Composer plugin handles placing each Moodle plugin package into the correct location within the Moodle directory structure, based on the plugin type declared in the package's `composer.json`.

## Making your plugin available via Composer {/* #making-your-plugin-available-via-composer */}

### Adding a composer.json {/* #adding-a-composerjson */}

Add a `composer.json` file to the root of your plugin directory with at minimum the following fields:

- `name`: the Composer package name, where the package component follows the format `moodle-[plugintype]_[pluginname]` (for example, `myplugin/moodle-block_myblock`)
- `type`: the Moodle plugin type in the format `moodle-[plugintype]` (for example, `moodle-block`)
- `require`: the Moodle version requirement, to communicate which versions your plugin supports

In `require`, include a production dependency on `moodle/composer-installer`.

```json title="composer.json"
{
    "name": "myplugin/moodle-block_myblock",
    "description": "A description of my Moodle block plugin",
    "type": "moodle-block",
    "require": {
        "moodle/moodle": "^5.2",
        "moodle/composer-installer": "*"
    },
    "license": "GPL-3.0-or-later"
}
```

The `type` field is what the `moodle/composer-installer` package uses to determine the installation path. For example, a package with `"type": "moodle-block"` will be installed into `blocks/myblock/` within the Moodle directory.

:::tip[Vendor name]

The vendor prefix in the `name` field (for example, `myplugin`) is your Packagist vendor name and is independent of any Moodle conventions. The package name component (`moodle-block_myblock`) follows the Moodle convention.

:::

### Publishing to Packagist {/* #publishing-to-packagist */}

Once your plugin has a valid `composer.json` and is in a public Git repository, you can publish it to [Packagist](https://packagist.org/):

1. Visit [https://packagist.org/packages/submit](https://packagist.org/packages/submit) and submit your repository URL.
2. Set up a [GitHub webhook](https://packagist.org/about#how-to-update-packages) to keep Packagist in sync whenever you push to your repository.

Once published, site administrators can install your plugin with:

```bash
composer require myplugin/moodle-block_myblock
```

The installer will automatically place the plugin into `blocks/myblock/` within their Moodle directory.

## Development tips {/* #development-tips */}

### Creating a development Moodle site {/* #creating-a-development-moodle-site */}

The [moodle/seed](https://github.com/moodle/seed) project provides a quick way to spin up a new Moodle site using Composer. This is particularly useful for plugin developers who want a reproducible development environment.

```bash
composer create-project moodle/seed [yourlocation]
```

The Moodle scaffolding tool will guide you through the initial site configuration. Within your `[yourlocation]` directory you will find:

- a `composer.json` and `composer.lock`
- a `vendor/` directory
- a `moodle/` directory containing your Moodle installation

To target a specific version of Moodle:

```bash
cd [yourlocation]
composer require "moodle/moodle:~5.2.0"
```

To install a plugin from Packagist:

```bash
cd [yourlocation]
composer require myplugin/moodle-block_myblock
```

### Developing a plugin with a local path repository {/* #developing-a-plugin-with-a-local-path-repository */}

When working on your plugin locally, you can tell Composer to use your local checkout instead of downloading from Packagist by adding a `path` repository to your site's `composer.json`:

```json title="composer.json (Moodle site root)"
{
    "repositories": [
        {
            "type": "path",
            "url": "/path/to/your/local/moodle-block_myblock",
            "options": {
                "symlink": false
            }
        }
    ],
    "require": {
        "moodle/composer-installer": "*",
        "myplugin/moodle-block_myblock": "*"
    }
}
```

Do not use symlinked plugin paths with Moodle. Many PHP entry points in plugins (for example, `view.php` and `index.php`) include `config.php` using relative paths like `require_once('../../config.php')`. With symlinked plugins, PHP resolves the symlink target first, which can make those relative includes resolve outside your Moodle site.

Set `"symlink": false` so Composer mirrors (copies) the plugin into the Moodle tree instead of symlinking it. This avoids relative include path issues.

When developing with a mirrored path repository, re-run `composer update myplugin/moodle-block_myblock` (or remove and re-require the package) after local changes so the copied plugin is refreshed.

:::note

For local path repositories, use `"*"` or `"@dev"` in your `require` constraint so Composer can resolve your local development version regardless of tagged releases.

:::

### Declaring dependencies {/* #declaring-dependencies */}

:::caution[Current recommendation]

Moodle currently supports plugins installed both with Composer and without Composer. Composer-declared runtime dependencies are only guaranteed to be installed when the plugin itself is installed via Composer.

For now, avoid introducing Composer-only runtime dependencies that would break non-Composer plugin installs.

:::

When adding Composer metadata to your plugin, these dependency rules apply:

- You can declare dependencies on other Moodle plugins as Composer package requirements.
- You should declare a production dependency on `moodle/composer-installer` in `require` (not `require-dev`) so Moodle package types are installed into the correct locations.

```json title="composer.json with Moodle package dependencies"
{
    "name": "myplugin/moodle-block_myblock",
    "type": "moodle-block",
    "require": {
        "moodle/moodle": "^5.2",
        "moodle/composer-installer": "*",
        "abgreeve/moodle-block_stash": "^5.2"
    },
    "license": "GPL-3.0-or-later"
}
```

If your plugin has required Moodle plugin dependencies, continue to declare them in `version.php` too, so dependency checks also work for non-Composer installation workflows.

## See also {/* #see-also */}

- [`composer.json`](../../apis/commonfiles/index.mdx#composerjson) — common file reference for Moodle plugins
- [moodle/composer-installer](https://github.com/moodle/composer-installer) — the Composer plugin that installs Moodle packages into the correct directory
- [moodle/seed](https://github.com/moodle/seed) — a Composer project template for spinning up a new Moodle site
- [Packagist](https://packagist.org/) — the main Composer package repository
- [Composer documentation](https://getcomposer.org/doc/) — full Composer reference
