---
title: Dependency Injection
tags:
  - DI
  - Container
  - PSR-11
  - PSR
description: The use of PSR-11 compatible Dependency Injection in Moodle
---

<Since version="4.4" issueNumber="MDL-80072" />

Moodle supports the use of [PSR-11](https://www.php-fig.org/psr/psr-11/) compatible Dependency Injection, accessed using the `\core\di` class, which internally makes use of [PHP-DI](https://php-di.org).

Most class instances can be fetched using their class name without any manual configuration. Support for configuration of constructor arguments is also possible, but is generally discouraged.

Dependencies are stored using a string id attribute, which is typically the class or interface name of the dependency. Use of other arbitrary id values is strongly discouraged.

## Fetching dependencies

When accessing dependencies within a class, it is advisable to inject them into the constructor, for example:

```php title="Fetching a instance of the \core\http_client class from within a class"
class my_thing {
    public function __construct(
        protected readonly \core\http_client $client,
    ) {
    }
}
```

For legacy code, or for scripts accessing an injected class, Moodle provides a wrapper around the PSR-11 Container implementation which can be used to fetch dependencies:

```php title="Fetching dependencies using the DI container"
// Fetching an instance of the \core\http_client class outside of a class.
$client = \core\di::get(\core\http_client::class);

// Fetching an instance of a class which is managed using DI.
$thing = \core\di::get(my_thing::class);
```

:::tip Constructor Property Promotion and Readonly properties

When using constructor-based injection, you can simplify your dependency injection by making use of [Constructor Property Promotion](https://stitcher.io/blog/constructor-promotion-in-php-8), and [Readonly properties](https://stitcher.io/blog/php-81-readonly-properties).

The use of readonly properties is also highly recommended as it ensures that dependencies cannot be inadvertently changed.

These language features are available in all Moodle versions supporting Dependency Injection.

```php
class example_without_promotion {
    protected \core\http_client $client;

    public function __construct(
        \core\http_client $client,
    ) {
        $this->client = $client;
    }
}

class example_with_promotion {
    public function __construct(
        protected readonly \core\http_client $client,
    ) {
    }
}
```

:::

## Configuring dependencies

In some rare cases you may need to supply additional configuration for a dependency to work properly. This is usually in the case of legacy code, and can be achieved with the `\core\hook\di_configuration` hook.

<Tabs>

<TabItem value="config" label="Hook configuration">

The callback must be linked to the hook by specifying a callback in the plugin's `hooks.php` file:

```php title="mod/example/db/hooks.php"
<?php
$callbacks = [
    [
        'hook' => \core\hook\di_configuration::class,
        'callback' => \mod_example\hook_listener::class . '::inject_dependenices',
    ],
];
```

</TabItem>

<TabItem value="hook" label="Hook listener">

The hook listener consists of a static method on a class.

```php title="mod/example/classes/hook_listener.php"
<?php

namespace mod_example;

use core\hook\di_configuration;

class hook_listener {
    public static function inject_dependencies(di_configuration $hook): void {
        $hook->add_definition(
            id: complex_client::class,
            definition: function (
                \moodle_database $db,
            ): complex_client {
                global $CFG;

                return new complex_client(
                    db: $db,
                    name: $CFG->some_value,
                );
            }
        )
    }
}
```

</TabItem>

</Tabs>

## Mocking dependencies in Unit Tests

One of the most convenient features of Dependency Injection is the ability to provide a mocked version of the dependency during unit testing.

Moodle resets the Dependency Injection Container between each unit test, which means that little-to-no cleanup is required.

```php title="Injecting a Mocked dependency"
<?php
namespace mod_example;

use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;

class example_test extends \advanced_testcase {
    public function test_the_thing(): void {
        // Mock our responses to the http_client.
        $handlerstack = HandlerStack::create(new MockHandler([
            new Response(200, [], json_encode(['name' => 'Colin'])),
        ]));

        // Inject the mock.
        \core\di::set(
            \core\http_client::class,
            new http_client(['handler' => $handlerstack]),
        );

        // Call a method on the example class.
        // This method uses \core\di to fetch the client and use it to fetch data.
        $example = \core\di::get(example::class);
        $result = $example->do_the_thing();

        // The result will be based on the mock response.
        $this->assertEquals('Colin', $result->get_name());
    }
}
```

## Injecting dependencies

Dependencies can be usually be easily injected into classes which are themselves loaded using Dependency Injection.

In most cases in Moodle, this should be via the class constructor, for example:

```php title="Injecting via the constructor"
class thing_manager {
    public function __construct(
        protected readonly \moodle_database $db,
    ) {
    }

    public function get_things(): array {
        return $this->db->get_records('example_things');
    }
}

// Fetching the injected class from legacy code:
$manager = \core\di::get(thing_manager::class);
$things = $manager->get_things();

// Using it in a child class:
class other_thing {
    public function __construct(
        protected readonly thing_manager $manager,
    ) {
    }

    public function manage_things(): void {
        $this->manager->get_things();
    }
}
```

:::warning A note on injecting the Container

It is generally inadvisable to inject the Container itself. Please do not inject the `\Psr\Container\ContainerInterface`.

:::

## Advanced usage

All usage of the Container _should_ be via `\core\di`, which is a wrapper around the currently-active Container implementation. In normal circumstances it is not necessary to access the underlying Container implementation directly and such usage is generally discouraged.

### Resetting the Container

The Container is normally instantiated during the bootstrap phase of a script. In normal use it is not reset and there should be no need to reset it, however it is _possible_ to reset it if required. This usage is intended to be used for situations such as Unit Testing.

:::tip Unit testing

The container is already reset after each test when running unit tests. It is not necessary nor recommended to so manually.

:::

```php title="Resetting the Container"
\core\di::reset_container();
```

:::danger

Resetting an actively-used container can lead to unintended consequences.

:::
