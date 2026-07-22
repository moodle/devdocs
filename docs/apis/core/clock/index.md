---
title: Clock
tags:
  - Time
  - PSR-20
  - PSR
  - Unit testing
  - Testing
description: Fetching the current time
---

<Since version="4.4" issueNumber="MDL-80838" />

Moodle provides a [PSR-20](https://php-fig.org/psr/psr-20/) compatible Clock interface. Classes which need the current time
should receive `\core\clock` through constructor injection.

This should be used instead of `time()` to fetch the current time. This allows unit tests to mock time and therefore to test a variety of cases such as events happening at the same time, or setting an explicit time.

:::tip[Recommended usage]

We recommend that the Clock Interface is used consistently in your code instead of using the standard `time()` method.

:::

## Usage {/* #usage */}

The Moodle Clock extends the PSR-20 Clock Interface and adds the convenience method `\core\clock::time(): int` to simplify
replacement of the global `time()` function.

### Usage via constructor injection {/* #usage-via-constructor-injection */}

Declare the clock as a constructor dependency:

```php title="Using an injected clock"
namespace mod_example;

class post {
    public function __construct(
        protected readonly \core\clock $clock,
        protected readonly \moodle_database $db,
    ) {
    }

    public function create_thing(\stdClass $data): \stdClass {
        $data->timecreated = $this->clock->time();

        $data->id = $this->db->insert_record('example_thing', $data);

        return $data;
    }
}
```

At the application boundary, obtain the highest-level service. The container supplies its clock and database dependencies:

```php title="Obtaining the injected class"
$post = \core\di::get(\mod_example\post::class);
```

Do not call `\core\di::get(\core\clock::class)` from inside `post`. That hides the dependency and uses the container as a
service locator.

### Legacy and procedural boundaries {/* #usage-in-standard-classes */}

Code which cannot receive constructor dependencies without a backwards-incompatible change may fetch the clock at its
procedural or static boundary:

```php title="Compatibility usage in legacy code"
$clock = \core\di::get(\core\clock::class);

// Fetch the current time as a \DateTimeImmutable.
$clock->now();

// Fetch the current time as a Unix timestamp.
$clock->time();
```

Keep this lookup at the boundary. Pass the clock into any objects created below it.

## Unit testing {/* #unit-testing */}

One of the most useful benefits of consistently using the Clock interface is the ability to control time in unit tests.

Calling either `advanced_testcase` helper described below performs the complete replacement: it creates a test clock, calls
`\core\di::set(\core\clock::class, $clock)` to replace the container's clock for the test, and returns that same object. No
additional container configuration is required. Any container-managed service resolved afterwards receives the replacement
clock through constructor injection. This is an example of
[replacing a dependency before obtaining the aggregate root](../di/index.md#unit-testing).

:::tip[Container Reset]

The DI container is automatically reset at the end of every test, which ensures that your clock does not bleed into subsequent tests.

:::

Moodle provides two standard test clocks, but you are welcome to create any other, as long as it implements the `\core\clock` interface.

:::warning[Call the helper before resolving the service]

The helper call is the replacement step. Call it before obtaining the service from the container because replacing
`\core\clock` does not rewrite the clock already stored in an existing service object.

:::

### Incrementing clock {/* #incrementing-clock */}

The incrementing clock increases the time by one second every time it is called. It can also be instantiated with a specific start time if preferred.

The standard testcase provides
`mock_clock_with_incrementing(?int $starttime = null): \incrementing_clock`:

```php title="Obtaining the incrementing clock"
class my_test extends \advanced_testcase {
    public function test_create_thing(): void {
        // This class inserts data into the database.
        $this->resetAfterTest(true);

        // Create the test clock, replace \core\clock in the container, and return that replacement.
        $clock = $this->mock_clock_with_incrementing();

        // Because post is resolved afterwards, the container injects $clock into it.
        $post = \core\di::get(\mod_example\post::class);
        $posta = $post->create_thing((object) [
            'name' => 'a',
        ]);
        $postb = $post->create_thing((object) [
            'name' => 'a',
        ]);

        // The incrementing clock automatically advanced by one second each time it is called.
        $this->assertGreaterThan($posta->timecreated, $postb->timecreated);
        $this->assertLessThan($clock->time(), $postb->timecreated);
    }
}
```

It is also possible to specify a start time for the clock;

```php title="Setting the start time"
$clock = $this->mock_clock_with_incrementing(12345678);
```

### Frozen clock {/* #frozen-clock */}

The frozen clock uses a time which does not change, unless manually set. This can be useful when testing code which must handle time-based resolutions.

The standard testcase provides `mock_clock_with_frozen(?int $time = null): \frozen_clock`:

```php title="Obtaining and using the frozen clock"
class my_test extends \advanced_testcase {
    public function test_create_thing(): void {
        // This class inserts data into the database.
        $this->resetAfterTest(true);

        $clock = $this->mock_clock_with_frozen();

        $post = \core\di::get(\mod_example\post::class);
        $posta = $post->create_thing((object) [
            'name' => 'a',
        ]);
        $postb = $post->create_thing((object) [
            'name' => 'a',
        ]);

        // The frozen clock keeps the same time.
        $this->assertEquals($postb->timecreated, $posta->timecreated);
        $this->assertEquals($clock->time(), $postb->timecreated);

        // The time can be manually set.
        $clock->set_to(12345678);
        $postc = $post->create_thing((object) [
            'name' => 'a',
        ]);

        // The frozen clock keeps the same time.
        $this->assertEquals(12345678, $postc->timecreated);

        // And can also be bumped.
        $clock->set_to(0);
        $this->assertEquals(0, $clock->time());

        // Bump the current time by 1 second.
        $clock->bump();
        $this->assertEquals(1, $clock->time());

        // Bump by 4 seconds.
        $clock->bump(4);
        $this->assertEquals(5, $clock->time());
    }
}
```

### Custom clock {/* #custom-clock */}

If the standard cases are not suitable, create a custom clock and register it with the DI container as a replacement.

```php title="Creating a custom clock"
class my_clock implements \core\clock {
    public int $time;

    public function __construct() {
        $this->time = time();
    }

    public function now(): \DateTimeImmutable {
        $time = new \DateTimeImmutable('@' . $this->time);
        $this->time += 5;

        return $time;
    }

    public function time(): int {
        return $this->now()->getTimestamp();
    }
}

class my_test extends \advanced_testcase {
    public function test_my_thing(): void {
        $this->resetAfterTest(true);

        $clock = new my_clock();
        \core\di::set(\core\clock::class, $clock);

        $post = \core\di::get(\mod_example\post::class);
        $posta = $post->create_thing((object) [
            'name' => 'a',
        ]);
    }
}
```
