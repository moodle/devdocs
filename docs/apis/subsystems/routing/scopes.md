---
title: Scopes
tags:
  - routing
  - OAuth2
  - security
---

<Since issueNumber="MDL-89710" version="5.3" />

API routes are protected by Moodle's normal login and capability checks, but when a request is authenticated with an OAuth2 access token, or a Personal Access Token, the router also enforces **Scopes**. A scope is a small, named permission (for example `core_user:user:read`) that describes what a particular token is allowed to do.

:::info[Why do we need scopes?]

The primary purpose of scopes is to limit the ability of a particular client or integration rather than giving the integration the same abilities as the owner.

For example if an administrator wishes to set up an integration with a tool which updates their user profile whenever they complete a run, then they would want to limit the integration to only performing user read and write actions and not making any other system configuration changes.

:::

Route authors declare which scopes are required to call their route; token issuers grant scopes to a token. A request is only allowed to proceed if the scopes granted to the current token satisfy the route's requirements. Scope checks are performed _in addition_ to any capability checks.

This page describes how to declare the scopes required by a route. It does not cover how to define new scope classes for a subsystem (that is, the `identifier_attribute`, `summary_attribute`, and `description_attribute` used to build a scope catalogue) -- see [Defining Scopes](./defining-scopes.md) for that.

:::note

Scope validation only applies to OAuth2 and Personal Access Token authenticated requests. It has no effect on requests authenticated via a normal Moodle session (cookie-based login).

:::

## Declaring required scopes {/* #declaring-required-scopes */}

The `\core\router\scope\scopeset` attribute is applied to a route method, alongside the `\core\router\route` attribute, to declare the scope(s) required to call it:

```php title="Requiring a single scope"
use core\router\route;
use core\router\scope\scopeset;
use core_user\route\scope\user\read;

class preferences {
    #[route(
        path: '/preferences',
        method: 'GET',
    )]
    #[scopeset(
        new read(),
    )]
    public function get_preferences(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        // ...
    }
}
```

A single `#[scopeset]` can list more than one scope. All scopes within the same `#[scopeset]` are required together (an **AND** condition):

```php title="Requiring more than one scope together (AND)"
#[scopeset(
    new \core_user\route\scope\user\read(),
    new \core_user\route\scope\user\write(),
)]
public function set_preferences(/* ... */): ResponseInterface {
    // ...
}
```

The `#[scopeset]` attribute is repeatable. When it is repeated on the same method, each `#[scopeset]` describes an alternative, independently-sufficient way to authorise the request (an **OR** condition):

```php title="Accepting either of two scope combinations (OR)"
#[scopeset(
    new \core_course\route\scope\course\content\read(),
)]
#[scopeset(
    new \core_course\route\scope\course\content\write(),
)]
public function categories(/* ... */): ResponseInterface {
    // A caller only needs `course:content:read` OR `course:content:write`, not both.
}
```

If a route declares more than one `#[scopeset]`, an access token only needs to satisfy **one** of them to be granted access.

## Explicitly declaring a route as unscoped {/* #explicitly-declaring-a-route-as-unscoped */}

Some routes are not resource-specific and do not require any scope at all -- for example, a discovery or well-known endpoint. Use the `\core\router\scope\unscoped_resource` attribute to explicitly declare this:

```php title="A route which does not require any scope"
use core\router\scope\unscoped_resource;

#[route(
    path: '/status',
)]
#[unscoped_resource]
public function status(/* ... */): ResponseInterface {
    // ...
}
```

:::danger[All API routes must declare their scope requirements]

Every method carrying a `#[route]` attribute in the `api` route group **must** also carry either one or more `#[scopeset]` attributes, or `#[unscoped_resource]`. This is enforced by a core PHPUnit test which scans every route in the `route\api` namespace, so a route added without one of these will fail the core test suite.

A route with **no** `#[scopeset]` attribute at all currently behaves identically, at runtime, to one marked `#[unscoped_resource]`: neither requires any scope. However, this is purely incidental, and should not be relied upon -- the absence of scopes must always be a deliberate, reviewable decision, expressed with `#[unscoped_resource]`, rather than an oversight.

When adding tests for your own routes, use the `assert_route_is_scoped()` or `assert_route_is_unscoped()` helpers described below.

:::

## How scope validation works {/* #how-scope-validation-works */}

Scope requirements are read from the current route by the `\core\router\middleware\moodle_oauth2_scope_attribute_middleware`, which attaches the resolved `scopeset[]` to the request as an attribute.

The `\core\router\middleware\moodle_api_authentication_middleware` then enforces them once a request has been authenticated, whether via:

- an **API key** presented as a `Bearer` token, where the granted scopes come from the key itself; or
- an **OAuth2 access token**, where the granted scopes come from the token's grant.

If none of the route's `#[scopeset]` combinations are satisfied by the scopes granted to the token, the request is rejected with an `access_denied` OAuth2 error, and the response includes a hint describing which scope(s) are missing.

### Unknown scopes fail safe {/* #unknown-scopes-fail-safe */}

A `#[scopeset]` may reference a scope class that does not exist in the currently-running version of Moodle -- for example, a scope only defined by a newer version of Moodle. In this situation the router does **not** silently drop the missing scope from the requirement (which would weaken it), and does **not** throw a fatal error. Instead it substitutes a `\core\router\scope\unknown_scope` placeholder, which can never be satisfied by any granted scopes.

This means:

- a scope set containing an unknown scope can never grant access on its own; and
- other, valid, scope sets declared on the same route (via additional `#[scopeset]` attributes) are unaffected and may still grant access.

## Checking whether a specific scope was granted {/* #checking-whether-a-specific-scope-was-granted */}

Declaring `#[scopeset]` attributes is enough to gate access to a route entirely, but sometimes a route is reachable via more than one scope combination and needs to behave differently depending on _which_ scope was actually granted to the token being used. For example, a route might allow both a broad "read any user" scope and a narrower "read self only" scope, and needs to restrict the response to the current user when only the narrower scope was granted.

Use `\core\router\util::has_scope_granted()` to check, at runtime, whether a specific scope was granted to the current request:

```php title="Restricting behaviour based on the granted scope"
use core\router\scope\scopeset;
use core\router\util;
use core_user\route\scope\user\read;
use core_user\route\scope\user\read_any;

#[scopeset(new read())]
#[scopeset(new read_any())]
public function serve(
    ServerRequestInterface $request,
    ResponseInterface $response,
    \stdClass $user,
): ResponseInterface {
    if (util::has_scope_granted($request, new read_any())) {
        // Perform a check to see if the user has the capability to access this user.
    } else {
        // This token was only granted `user:read`, not `user:read_any`.
        // Restrict the caller to reading their own record.
        $this->check_user($user);
    }

    // ...
}
```

This check is independent of, and performed in addition to, the route-level `#[scopeset]` enforcement described above -- it does not grant or deny access to the route itself, and should be used only to vary behaviour _within_ a route that the caller has already been permitted to reach.

## Unit testing scope declarations {/* #unit-testing-scope-declarations */}

The `\route_testcase` base class (see [Unit Testing](./testing.md)) provides three assertions for testing that a route declares the scopes you expect:

```php title="Asserting scope requirements"
final class my_test extends \route_testcase {
    public function test_get_preferences_is_scoped(): void {
        $this->assert_route_required_scopes(
            [['core_user:user:read']],
            [preferences::class, 'get_preferences'],
        );
    }

    public function test_status_is_unscoped(): void {
        $this->assert_route_is_unscoped([status::class, 'status']);
    }
}
```

- `assert_route_is_unscoped($callable)` -- asserts the method is explicitly marked `#[unscoped_resource]`.
- `assert_route_is_scoped($callable)` -- asserts the method declares at least one `#[scopeset]`, without checking which scopes.
- `assert_route_required_scopes($expectedscopesets, $callable)` -- asserts the method requires exactly the given scope set(s), expressed as an array of arrays of scope identifier strings (outer array is OR, inner array is AND). Scope sets that reference an unknown scope for the current Moodle version are ignored, so this assertion remains valid across versions.
