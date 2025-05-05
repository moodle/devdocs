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

Moodle supports use of a [PSR-20](https://php-fig.org/psr/psr-20/) compatible Clock interface, which should be accessed using Dependency Injection.

This should be used instead of `time()` to fetch the current time. This allows unit tests to mock time and therefore to test a variety of cases such as events happening at the same time, or setting an explicit time.

:::tip Recommended usage

We recommend that the Clock Interface is used consistently in your code instead of using the standard `time()` method.

:::

## Usage

The usage of the Clock extends the PSR-20 Clock Interface and adds a new convenience method, `\core\clock::time(): int`, to simplify replacement of the global `time()` method.

### Usage in standard classes

Where the calling code is not instantiated via Dependency Injection itself, the simplest way to fetch the clock is using `\core\di::get(\core\clock::class)`, for example:

```php title="Usage in legacy code"
$clock = \core\di::get(\core\clock::class);

// Fetch the current time as a \DateTimeImmutable.
$clock->now();

// Fetch the current time as a Unix Time Stamp.
$clock->time();
```

### Usage via Constructor Injection

The recommended approach is to have the Dependency Injector inject into the constructor of a class.

```php title="Usage in injected classes"
namespace mod_example;

class post {
    public function __construct(
        protected readonly \core\clock $clock,
        protected readonly \moodle_database $db,
    )

    public function create_thing(\stdClass $data): \stdClass {
        $data->timecreated = $this->clock->time();

        $data->id = $this->db->insert_record('example_thing', $data);

        return $data;
    }
}
```

When using DI to fetch the class, the dependencies will automatically added to the constructor arguments:

```php title="Obtaining the injected class"
$post = \core\di::get(post::class);
```

## Unit testing

One of the most useful benefits to making consistent use of the Clock interface is to mock data within unit tests.

When testing code which makes use of the Clock interface, you can replace the standard system clock implementation with a testing clock which suits your needs.

:::tip Container Reset

The DI container is automatically reset at the end of every test, which ensures that your clock does not bleed into subsequent tests.

:::

Moodle provides two standard test clocks, but you are welcome to create any other, as long as it implements the `\core\clock` interface.

:::warning

When mocking the clock, you _must_ do so _before_ fetching your service.

Any injected value within your service will persist for the lifetime of that service.

Replacing the clock after fetching your service will have *no* effect.

:::

### Incrementing clock

The incrementing clock increases the time by one second every time it is called. It can also be instantiated with a specific start time if preferred.

A helper method, `mock_clock_with_incrementing(?int $starttime = null): \core\clock`, is provided within the standard testcase:

```php title="Obtaining the incrementing clock"
class my_test extends \advanced_testcase {
    public function test_create_thing(): void {
        // This class inserts data into the database.
        $this->resetAfterTest(true);

        $clock = $this->mock_clock_with_incrementing();

        $post = \core\di::get(post::class);
        $posta = $post->create_thing((object) [
            'name' => 'a',
        ]);
        $postb = $post->create_thing((object) [
            'name' => 'a',
        ]);

        // The incrementing clock automatically advanced by one second each time it is called.
        $this->assertGreaterThan($postb->timecreated, $posta->timecreated);
        $this->assertLessThan($clock->time(), $postb->timecreated);
    }
}
```

It is also possible to specify a start time for the clock;

```php title="Setting the start time"
$clock = $this->mock_clock_with_incrementing(12345678);
```

### Frozen clock

The frozen clock uses a time which does not change, unless manually set. This can be useful when testing code which must handle time-based resolutions.

A helper method, `mock_clock_with_frozen(?int $time = null): \core\clock`, is provided within the standard testcase:

```php title="Obtaining and using the frozen clock"
class my_test extends \advanced_testcase {
    public function test_create_thing(): void {
        // This class inserts data into the database.
        $this->resetAfterTest(true);

        $clock = $this->mock_clock_with_frozen();

        $post = \core\di::get(post::class);
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

### Custom clock

If the standard cases are not suitable for you, then you can create a custom clock and inject it into the DI container.

```php title="Creating a custom clock"
class my_clock implements \core\clock {
    public int $time;

    public function __construct() {
        $this->time = time();
    }

    public function now(): \DateTimeImmutable {
        $time = new \DateTimeImmutable('@' . $this->time);
        $this->time = $this->time += 5;

        return $time;
    }

    public function time(): int {
        return $this->now()->getTimestamp();
    }
}

class my_test extends \advanced_testcase {
    public function test_my_thing(): void {
        $clock = new my_clock();
        \core\di:set(\core\clock::class, $clock);

        $post = \core\di::get(post::class);
        $posta = $post->create_thing((object) [
            'name' => 'a',
        ]);
    }
}
```
