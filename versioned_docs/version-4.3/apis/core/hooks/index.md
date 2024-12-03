---
title: Hooks API
tags:
- hooks
- API
- core
---

<Since version="4.3" issueNumber="MDL-74954" />

This page describes the Hooks API which is a replacement for some of the lib.php based one-to-many
[plugin callbacks](https://docs.moodle.org/dev/Callbacks) implementing on
[PSR-14](https://www.php-fig.org/psr/psr-14/).

The most common use case for hooks is to allow customisation of standard plugins or core functionality
through hook callbacks in local plugins. For example adding a custom institution password
policy that applies to all enabled authentication plugins through a new local plugin.

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

A _Hook emitter_ is a place in code where core or a plugin needs to send or receive information
to/from any other plugins. The exact type of information flow facilitated by hooks is not defined.

### Hook instance

Information passed between subsystem and plugins is encapsulated in arbitrary PHP class instances.
These can be in any namespace, but generally speaking they should be placed in the `some_component\hook\*`
namespace. Where possible, hooks are expected to implement the `core\hook\described_hook` interface.

The names of hook classes should follow the standard pattern of general to more specific, this groups
hooks for the same item when sorting alphabetically. For example `core\hook\course_delete_pre` instead
of `pre_course_delete`.

### Hook callback

The code executing a hook does not know in advance which plugin is going to react to a hook.

Moodle maintains an ordered list of callbacks for each class of hook. Any plugin is free to register
its own hook callbacks by creating a `db/hooks.php` file. The specified plugin callback method is called
whenever a relevant hook is dispatched.

### Hooks overview page

The **Hooks overview page** lists all hooks that may be triggered in the system together with all
registered callbacks. It can be accessed by developers and administrators from the Site
administration menu.

This page is useful especially when adding custom local plugins with hook callbacks that modify
standard Moodle behaviour.

In special cases administrators may override default hook callback priorities or disable some unwanted
callbacks completely:

```php title="/config.php"
$CFG->hooks_callback_overrides = [
    \mod_activity\hook\installation_finished::class => [
        'test_otherplugin\\callbacks::activity_installation_finished' => ['disabled' => true],
    ],
];
```

The hooks overview page will automatically list any hook which is placed inside any `*\hook\*` namespace within any Moodle component.
If you define a hook which is _not_ in this namespace then you **must** also define a new `\core\hook\discovery_agent` implementation in `[component]\hooks`.

## Adding new hooks

1. Developer first identifies a place where they need to ask or inform other plugins about something.
1. Depending on the location a new class implementing `core\hook\described_hook` is added to `core\hook\*` or
`some_plugin\hook\*` namespace as appropriate.
1. Optionally the developer may wish to allow the callback to stop any subsequent callbacks from receiving the object.
If so, then the object should implement the `Psr\EventDispatcher\StoppableEventInterface` interface.
1. Optionally if any data needs to be sent to hook callbacks, the developer may add internal hook
constructor, some instance properties for data storage and public methods for data access from callbacks.

Hook classes may be any class you like. When designing a new Hook, you should think about how consumers may wish to change the data they are passed.

All hook classes should be defined as final, if needed traits can help with code reuse in similar hooks.

:::important Hooks not located in standard locations

If you define a hook which is _not_ in the `[component]\hook\*` namespace then you **must** also define a new `\core\hook\discovery_agent` implementation in `[component]\hooks`.

```php title="/mod/example/classes/hooks.php"
<?php

namespace mod_example;

class hooks implements \core\hook\hook\discovery_agent {
    public static function discover_hooks(): array {
        return [
            [
                'class' => \mod_example\local\entitychanges\create_example::class,
                'description' => 'A hook fired when an example was created',
            ],
        ];
    }
}
```

:::

### Example of hook creation

Imagine mod_activity plugin wants to notify other plugins that it finished installation,
then mod_activity plugin developer adds a new hook and calls it at the end of plugin
installation process.

```php title="/mod/activity/classes/hook/installation_finished.php"
<?php
namespace mod_activity\hook;

class installation_finished implements \core\hook\described_hook {
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
The registration is done by adding a `db/hooks.php` file to plugin.
Callbacks **must** be provided as PHP callable strings in the form of "some\class\name::static_method".

Hook callbacks are executed in the order of their priority from highest to lowest.
Any guidelines for callback priority should be described in hook descriptions if necessary.

:::important

Callbacks _are executed during system installation and all upgrades_, the callback
methods must verify the plugin is in correct state. Often the easiest way is to
use function during_initial_install() or version string from the plugin configuration.

:::

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

Callback registrations are cached, so developers should to either increment the version number for the
component they place the hook into. During development it is also possible to purge caches.

In this particular example, the developer would probably also add some code to `db/install.php`
to perform the necessary action in case the hook gets called before the `local_stuff` plugin
is installed.

## Deprecation of legacy lib.php callbacks

Hooks are a direct replacement for one-to-many lib.php callback functions that were implemented
using the `get_plugins_with_function()`, `plugin_callback()`, or `component_callback()` functions.

If a hook implements the `core\hook\deprecated_callback_replacement` interface, and if deprecated `lib.php`
callbacks can be listed in `get_deprecated_plugin_callbacks()` hook method
then developers needs to only add extra parameter to existing legacy callback functions
and the hook manager will trigger appropriated deprecated debugging messages when
it detects plugins that were not converted to new hooks yet.

:::important Legacy fallback

Please note **it is** possible for plugin to contain both legacy `lib.php` callback and PSR-14 hook
callbacks.

This allows community contributed plugins to be made compatible with multiple Moodle branches.

The legacy `lib.php` callbacks are automatically ignored if hook callback is present.

:::

## Example how to migrate legacy callback

This example describes migration of `after_config` callback from the very end of `lib/setup.php`.

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

The hook needs to be emitted immediately after the current callback execution code,
and an extra parameter `$migratedtohook` must be set to true in the call to `get_plugins_with_function()`.

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
// Dispatch the new Hook implementation immediately after the legacy callback.
core\hook\manager::get_instance()->dispatch(new core\hook\after_config());
```

## Hooks which contain data

It is often desirable to pass a data object when dispatching hooks.

This can be useful where you are passing code that consumers may wish to change.

Since the hook is an arbitrary PHP object, it is possible to create any range of public data and/or method you like and for the callbacks to use those methods and properties for later consumption.

```php title="/lib/classes/hook/block_delete_pre.php"
<?php

namespace core\hook;

final class block_delete_pre implements described_hook, deprecated_callback_replacement {
    public static function get_hook_description(): string {
        return 'A hook dispatched just before a block instance is deleted';
    }

    public function __construct(
        protected stdClass $blockinstance,
    ) {}

    public function get_instance(): stdClass {
        return $this->blockinstance;
    }

    public static function get_deprecated_plugin_callbacks(): array {
        return ['pre_block_delete'];
    }
}
```

When dispatching the hook, it behaves as any other normal PHP Object:

```php title="/lib/blocklib.php"
// Allow plugins to use this block before we completely delete it.
if ($pluginsfunction = get_plugins_with_function('pre_block_delete', 'lib.php', true, true)) {
    foreach ($pluginsfunction as $plugintype => $plugins) {
            foreach ($plugins as $pluginfunction) {
                $pluginfunction($instance);
            }
        }
    }
}
$hook = new \core\hook\block_delete_pre($instance);
core\hook\manager::get_instance()->dispatch($hook);
```

## Hooks which can be stopped

In some situations it is desirable to allow a callback to stop execution of a hook. This can happen in situations where the hook contains that should only be set once.

The Moodle hooks implementation has support for the full PSR-14 specification, including Stoppable Events.

To make use of Stoppable events, the hook simply needs to implement the `Psr\EventDispatcher\StoppableEventInterface` interface.

```php title="/lib/classes/hook/block_delete_pre.php"
<?php

namespace core\hook;

final class block_delete_pre implements
    described_hook,
    deprecated_callback_replacement.
    Psr\EventDispatcher\StoppableEventInterface
{
    public static function get_hook_description(): string {
        return 'A hook dispatched just before a block instance is deleted';
    }

    public function __construct(
        protected stdClass $blockinstance,
    ) {}

    public function get_instance(): stdClass {
        return $this->blockinstance;
    }

    public function isPropagationStopped(): bool {
        return $this->stopped;
    }

    public function stop(): void {
        $this->stopped = true;
    }

    public static function get_deprecated_plugin_callbacks(): array {
        return ['pre_block_delete'];
    }
}
```

A callback will only be called if the hook was not stopped before-hand. Depending on the hook implementation, it can stop he

```php title="/local/myplugin/classes/callbacks.php"
<?php

namespace local_myplugin;

class callbacks {
    public static function block_pre_delete(\core\hook\block_delete_pre $hook): void {
        // ...
        $hook->stop();
    }
}
```
