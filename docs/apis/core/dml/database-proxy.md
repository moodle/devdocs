---
title: Injecting the database
---

<Since version="6.0" issueNumber="MDL-90234" />

`\core\dml\database_proxy` allows classes to use [Dependency Injection](../di/index.md) instead of reading the global `$DB` directly.

The proxy extends `\moodle_database` and forwards calls to the current global database instance on every call. It does not open or own a connection, and destroying the proxy does not dispose of the real database.

## Constructor injection {/* #constructor-injection */}

Inject `\core\dml\database_proxy` to use the [DML API](index.md):

```php
class item_repository {
    public function __construct(
        private readonly \core\dml\database_proxy $db,
    ) {
    }

    public function get_item(int $id): \stdClass {
        return $this->db->get_record('example_items', ['id' => $id], '*', MUST_EXIST);
    }
}

$repository = \core\di::get(item_repository::class);
```

From legacy entry points, the same service can be resolved explicitly:

```php
$db = \core\di::get(\core\dml\database_proxy::class);
```

Prefer constructor injection inside services over container lookups scattered through methods.

## Lifetime and initialization {/* #lifetime-and-initialization */}

The proxy may be resolved before `$DB` is initialized and retained if `$DB` is later replaced. Each forwarded call uses the database that is current at that time, rather than a connection captured during construction.

Calling a database method before a real `moodle_database` instance is available throws `coding_exception`. Resolving a proxy does not bootstrap the database or make early queries safe.

The proxy does not add permissions, change transaction semantics, or provide an isolated database. Existing DML rules, parameterized SQL requirements, and [delegated transaction](delegated-transactions.md) behaviour still apply. Do not replace `$DB` while a transaction or recordset from the previous database is in use.

## Testing {/* #testing */}

A class accepting `database_proxy` can be directly constructed with a suitable test double when testing its own logic. Integration tests can use Moodle's normal `advanced_testcase` database setup and reset mechanisms.

Retaining the proxy avoids capturing an obsolete global database instance. It does not remove global dependencies inside legacy code or make database integration tests independent of Moodle's test database.
