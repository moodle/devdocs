---
title: Hooks API
tags:
- hooks
- API
- core
---

import { Since } from '@site/src/components';

<Since version="4.3" />

This page describes the Hooks API which is a replacement for some of the lib.php based one-to-many
[plugin callbacks](https://docs.moodle.org/dev/Callbacks) implementing on
[PSR-14](https://www.php-fig.org/psr/psr-14/).

The most common use case for hooks is to allow customisation of standard plugins or core functionality
through hook callbacks in local plugins. For example adding a custom institution password
policy that applies to all enabled authentication plugins through a new local plugin.

Hooks are not a means to implement or describe features of plugins of some type.

## General concepts

### Mapping to PSR-14

Moodle does not allow camelCase for naming of classes and method and Moodle already has events,
however the PSR-14 adherence has higher priority here.

| PSR-14            | Hooks                                                |
|-------------------|------------------------------------------------------|
| Event             | Hook                                                 |
| Listener          | Hook callback                                        |
| Emitter           | Hook emitter                                         |
| Dispatcher        | Hook dispatcher (implemented in Hook manager)        |
| Listener Provider | Hook callback provider (implemented in Hook manager) |

### Hook emitter

Hook emitter is a place in code where core or a plugin needs to send or receive information
to/from any other plugins. The exact type of information flow facilitated by hooks is not defined.

### Hook instance

Information passed between subsystem and plugins is encapsulated in arbitrary PHP class instances.
For now Moodle hooks are expected to be placed in `some_component\hook\*` namespaces and they
are expected to implement `core\hook\described_hook` interface.

The names of hook classes should follow the standard pattern of general to more specific, this groups
hooks for the same item when sorting alphabetically. For example `core\hook\course_delete_pre` instead
of `pre_course_delete`.

### Hook callback

The code executing a hook does not know in advance which plugin is going to react to a hook.

System maintains ordered list of callbacks for each class of hook. Any plugin is free to register
hook callbacks by adding a db/hooks.php file. The specified plugin callback method is called
whenever a relevant hook is dispatched.

### Hooks overview page

**Hooks overview page** lists all hooks that may be triggered in the system together with all
registered callbacks. It can be accessed by developers and administrators from the Site
administration menu.

This page is useful especially when adding custom local plugins with hook callbacks that modify
standard Moodle behaviour.

In special cases administrators may override default hook callback priorities or disable some unwanted
callbacks completely:

```php title="/config.php"
$CFG->hooks_callback_overrides = [
    'mod_activity\\hook\\installation_finished' => [
        'test_otherplugin\\callbacks::activity_installation_finished' => ['disabled' => true],
    ]
];
```

## Adding of new hooks

1. Developer first identifies a place where they need to ask or inform other plugins about something.
2. Depending on the location a new class implementing core\hook\described_hook is added to core\hook\* or
some_plugin\hook\* namespace.
3. Optionally if any data needs to be sent to hook callbacks developer needs to add internal hook
constructor, some instance properties for data storage and public methods for data access from callbacks.
4. Optionally hook class may also implement public methods to add information that is passed back
to the original hook execution point, or simply depend on objects passed by reference as hook data.
5. Hooks may have stoppable interface which may be used to stop execution of remaining callbacks.

All hook classes should be defined as final, if needed traits can help with code reuse in similar hooks.

### Example of hook creation

Imagine mod_activity plugin wants to notify other plugins that it finished installation,
then mod_activity plugin developer adds a new hook and calls it at the end of plugin
installation process.

```php title="/mod/activity/classes/hook/installation_finished.php"
<?php
namespace mod_activity\hook;

class installation_finished implements \core\hook\describe_hook {
    public static function get_hook_description(): string {
        return 'Hook dispatched at the very end of installation of mod_activity plugin.';
    }
}
```

```php title="/mod/activity/db/install.php"
<?php
function xmldb_activity_install() {
   $hook = new \mod_activity\hook\installation_finished();
   \core\hook\manager::get_instance()->dispatch($hook);
}

```

## Registering of hook callbacks

Any plugin is free to register callbacks for all core and plugin hooks.
The registration is done by adding a db/hooks.php file to plugin.
Callbacks must be provided as PHP callable strings in the form of "some\class\name::static_method".

Hook callbacks are executed in the order of their priority, the rules
for priority numbers should be described in hook descriptions if necessary.

Callbacks are executed also during system installation and all upgrades, the callback
methods must verify the plugin is in correct state. Often the easies way is to
use function during_initial_install() or version string from the plugin configuration.

### Example of hook callback registration

First developer needs to add a new static method to some class that accepts instance of
a hook as parameter.

```php title="/local/stuff/classes/local/hook_callbacks.php"
<?php
namespace local_stuff\local;
use \mod_activity\hook\installation_finished;

class hook_callbacks {
    public static function activity_installation_finished(installation_finished $hook): void {
        if (during_initial_install()) {
            return;
        }
        if (!get_config('local_stuff', 'version') {
            return;
        }
        // Do something...
    }
}
```

Then developer has to register this new method as the hook callback by adding it to the db/hooks.php file.

```php title="/local/stuff/db/hooks.php"
<?php
$callbacks = [
    [
        'hook' => mod_activity\hook\installation_finished::class,
        'callback' => local_stuff\local\hook_callbacks::class . '::activity_installation_finished',
        'priority' => 500,
    ],
];
```

Callback registrations are cached, so developer needs to either bump the local_stuff version
or administrators need to purge all caches.

In this particular example developer would probably also add some code to db/install.php
to perform the necessary action in case the hook gets called before the local_stuff plugin
is installed.

## Deprecation of legacy lib.php callbacks

Hooks are a direct replacement for one-to-many lib.php callback functions that were implemented
using get_plugins_with_function(), plugin_callback() or component_callback() functions.

If hook implements `core\hook\deprecated_callback_replacement` and if deprecated lib.php
callbacks can be listed in get_deprecated_plugin_callbacks() hook method
then developers needs to only add extra parameter to existing legacy callback functions
and the hook manager will trigger appropriated deprecated debugging messages when
it detects plugins that were not converted to new hooks yet.

Please note it is possible for plugin to contain both legacy lib.php callback and hook
callback so that 3rd party plugins can be made compatible with multiple Moodle branches.
The legacy lib.php callbacks are automatically ignored if hook callback is present.

## Example how to migrate legacy callback

This example describes migration of after_config callback from the very end of lib/setup.php
file.

First we need a new hook:

```php title="/lib/classes/hook/after_config.php"
<?php
namespace core\hook;

final class after_config implements described_hook, deprecated_callback_replacement {
    public static function get_hook_description(): string {
        return 'Hook dispatched at the very end of lib/setup.php';
    }
    public static function get_deprecated_plugin_callbacks(): array {
        return ['after_config'];
    }
}
```

Then hook needs to be added right after the current place of callback execution
and an extra parameter $migratedtohook has to be set to true in get_plugins_with_function()
call.

```php title="/lib/setup.php"

// Allow plugins to callback as soon possible after setup.php is loaded.
$pluginswithfunction = get_plugins_with_function('after_config', 'lib.php', true, true);
foreach ($pluginswithfunction as $plugins) {
    foreach ($plugins as $function) {
        try {
            $function();
        } catch (Throwable $e) {
            debugging("Exception calling '$function'", DEBUG_DEVELOPER, $e->getTrace());
        }
    }
}
core\hook\manager::get_instance()->dispatch(new core\hook\after_config());

```
