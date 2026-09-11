---
title: Defining Scopes
tags:
  - routing
  - OAuth2
  - security
---

<Since issueNumber="MDL-89710" version="5.3" />

[Scopes](./scopes.md) describe what an OAuth2 access token or Personal Access Token is allowed to do, and are declared on a route using the `#[scopeset]` attribute. This page describes how to define the scope classes that make up that catalogue in the first place.

Any component may define its own scopes. There is no central registry to update -- scopes are discovered automatically from the class hierarchy described below.

## The scope class hierarchy {/* #the-scope-class-hierarchy */}

Every scope is a PHP class which ultimately extends `\core\router\scope\abstract_scope`. This base class implements the OAuth2 library's `ScopeEntityInterface`, and provides the logic used to build a scope's identifier, summary, and description from a set of attributes.

Scopes are usually organised into a small hierarchy of classes, mirroring the resource they protect, with:

- one or more **abstract "grouping" classes**, each contributing one segment of the scope's identifier (for example `course`, then `course:content`); and
- a **concrete "leaf" class** for each action a caller may request (for example `read`, `write`, `delete`), which is the class actually referenced from a route's `#[scopeset]` attribute.

For example, Core's course content scopes are defined as:

```text
course/classes/route/scope/course/
├── abstract_scope.php              // #[identifier_attribute('course')]
├── read.php                        // core_course:course:read
├── write.php                       // core_course:course:write
├── delete.php                      // core_course:course:delete
└── content/
    ├── abstract_scope.php          // #[identifier_attribute('content')]
    ├── read.php                    // core_course:course:content:read
    ├── write.php                   // core_course:course:content:write
    └── delete.php                  // core_course:course:content:delete
```

```php title="course/classes/route/scope/course/abstract_scope.php"
namespace core_course\route\scope\course;

#[\core\router\scope\identifier_attribute('course')]
abstract class abstract_scope extends \core\router\scope\abstract_scope {
}
```

```php title="course/classes/route/scope/course/content/abstract_scope.php"
namespace core_course\route\scope\course\content;

use core_course\route\scope\course\abstract_scope as abstract_course_scope;

#[\core\router\scope\identifier_attribute('content')]
abstract class abstract_scope extends abstract_course_scope {
}
```

```php title="course/classes/route/scope/course/content/read.php"
namespace core_course\route\scope\course\content;

#[\core\router\scope\identifier_attribute('read')]
#[\core\router\scope\summary_attribute('course_content_read_scope_summary', 'core_course')]
#[\core\router\scope\description_attribute('course_content_read_scope_desc', 'core_course')]
class read extends abstract_scope {
}
```

Only the concrete leaf class (`read`, in this example) is ever instantiated or referenced from a `#[scopeset]` attribute. The intermediate `abstract_scope` classes exist purely to contribute a segment to the identifier and to group related leaf classes together; they are never granted, checked, or listed on their own.

:::note

The class name `abstract_scope` is reused, unqualified, at every level of the hierarchy purely by convention (each one lives in its own namespace). Only the leaf classes need distinctive names, and these should describe the action they represent, for example `read`, `write`, `delete`, `backup`, or `restore`.

:::

## Declaring the identifier {/* #declaring-the-identifier */}

Every class in the hierarchy -- both the abstract grouping classes and the concrete leaf class -- must carry a `\core\router\scope\identifier_attribute` attribute, contributing the segment of the identifier for that level:

```php
#[\core\router\scope\identifier_attribute('content')]
```

The identifier passed to the attribute must start with a letter, and may otherwise only contain lowercase letters, numbers, and underscores. It must **not** contain a colon (`:`) or the component name -- both of these are added automatically.

`abstract_scope::get_identifier()` builds the full, colon-separated scope identifier by walking up the class hierarchy from the leaf class, collecting the `#[identifier_attribute]` value declared at each level, until it reaches `\core\router\scope\abstract_scope` itself. It then prepends the Frankenstyle component name, taken from the leaf class's own namespace. For the `read` class above, this produces:

```text
core_course : course : content : read
```

that is `core_course:course:content:read`.

If any class in the hierarchy is missing its `#[identifier_attribute]`, a `coding_exception` is thrown when the identifier is resolved.

## Documenting the scope {/* #documenting-the-scope */}

Every **concrete** scope class must also carry a `\core\router\scope\summary_attribute`, and should normally carry a `\core\router\scope\description_attribute`:

```php
#[\core\router\scope\summary_attribute('course_content_read_scope_summary', 'core_course')]
#[\core\router\scope\description_attribute('course_content_read_scope_desc', 'core_course')]
```

- The **summary** is a short, human-readable label for the scope, for example as shown in a list of scopes available to grant to a client.
- The **description** is a longer explanation of what the scope allows, for example as shown on a consent screen, or in the generated OpenAPI documentation.

Both attributes extend `\core\lang_string`, so they take the same arguments as `get_string()` -- a string identifier and a component, with an optional `$a` object -- and are lazily resolved to the current language only when their `get_summary()` / `get_description()` accessor is called.

Core's convention is to key these lang strings after the scope's identifier (without the component prefix), for example:

```php title="course/lang/en/course.php"
$string['course_content_read_scope_summary'] = 'View content within course activities and resources';
$string['course_content_read_scope_desc'] = 'Allows access to view content within course activities and resources.';
```

Abstract grouping classes do not need a summary or description -- they are never presented to a user on their own -- and `get_summary()` / `get_description()` will simply return an empty string for an abstract class that does not declare one. Attempting to resolve the summary of a **concrete** class which does not declare `#[summary_attribute]` throws a `coding_exception`.

## Where scope classes are discovered {/* #where-scope-classes-are-discovered */}

Scope classes are placed in the `route\scope` L2 namespace of the owning component, alongside its routes (which live in the `route\api` namespace, see [Routing](./index.md)):

```text
mod_example/classes/route/scope/example/
```

There is no manual registration step. Every component's `route\scope` namespace is scanned for concrete (non-abstract) subclasses of `\core\router\scope\abstract_scope`, and the results are cached. If you add, rename, or remove a scope class, purge caches before it is picked up.

:::caution

Removing or renaming a scope class is a breaking change for any client that has been granted it. Prefer adding new scopes over renaming existing ones, and coordinate removals with an appropriate deprecation period.

:::

## Using your scope {/* #using-your-scope */}

Once defined, reference the concrete leaf class from a route's `#[scopeset]` attribute, as described in [Scopes](./scopes.md):

```php
use core\router\scope\scopeset;

#[scopeset(
    new \core_course\route\scope\course\content\read(),
)]
public function categories(/* ... */): ResponseInterface {
    // ...
}
```
