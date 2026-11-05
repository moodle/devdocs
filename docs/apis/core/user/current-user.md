---
title: Accessing the current user
---

<Since version="6.0" issueNumber="MDL-90234" />

`\core\current_user` is an injectable accessor for the authenticated/current Moodle user. It provides a small API around the live `$USER` global rather than capturing the user when the service is constructed.

## Injecting the accessor {/* #injecting-the-accessor */}

Use [constructor injection](../di/index.md) in services:

```php
class item_service {
    public function __construct(
        private readonly \core\current_user $currentuser,
    ) {
    }

    public function get_owner_id(): int {
        return $this->currentuser->get_id();
    }
}
```

The container can autowire this class without additional configuration. From legacy entry points, use `\core\di::get(\core\current_user::class)`.

The accessor can be retained across login or test-user changes: each call reads the current global user. It is not a fixed-user model and cannot be constructed with an arbitrary user record.

## Available methods {/* #available-methods */}

| Method | Behaviour |
| --- | --- |
| `get_user_object(): stdClass` | Returns the current global user object, not a clone or a freshly loaded database record. |
| `get_id(): int` | Returns the current user ID, or 0 if no ID is set. |
| `has_capability(string $capability, context $context, bool $doanything = true): bool` | Calls Moodle's capability API with the current user explicitly supplied. |
| `require_capability(string $capability, context $context, bool $doanything = true, string $errormessage = 'nopermissions', string $stringfile = ''): void` | Checks the current user's capability and throws `required_capability_exception` if it is missing. |
| `get_timezone_object(): DateTimeZone` | Returns the effective timezone using `core_date` and the current user, including site timezone policy. |

For example:

```php
$context = \core\context\system::instance();
$this->currentuser->require_capability('moodle/site:config', $context);

$timezone = $this->currentuser->get_timezone_object();
```

The context parameter is a `\core\context`. The `$doanything` argument preserves the underlying capability API's site-administrator override; pass false to disable that override for the check.

`get_user_object()` exposes the existing mutable object, including any extra properties held in session state. It does not guarantee a complete or fresh database record. Retaining the returned object separately does not give it the accessor's live-user behaviour.

:::note[Authentication and authorization]

Resolving this service does not log in a user or enforce access to an endpoint. Continue to require authentication, capabilities, token scopes, and resource visibility as appropriate. A nonzero ID alone is not proof of a non-guest authenticated account.

:::

## Testing and legacy dependencies {/* #testing-and-legacy-dependencies */}

In an `advanced_testcase`, use `setUser()`, `setAdminUser()`, and the usual reset mechanisms. An already-resolved accessor follows these changes:

```php
$this->resetAfterTest();
$currentuser = \core\di::get(\core\current_user::class);

$user = $this->getDataGenerator()->create_user();
$this->setUser($user);
$this->assertSame((int) $user->id, $currentuser->get_id());
```

For isolated service tests, inject a test double of `current_user` through the constructor. This only substitutes calls made through the accessor: legacy helpers which read `$USER` directly still see the global user. Use normal test-user setup for integration paths containing those helpers, rather than making the injected identity disagree with global state.
