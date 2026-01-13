---
title: Routing
---

<Since issueNumber="MDL-81301" version="4.5" />

Moodle includes a powerful routing system based upon the [Slim Framework](https://www.slimframework.com/), and [FastRoute](https://github.com/nikic/FastRoute).

Routes are defined by creating classes within the `route` L2 namespace of a component, and associating methods with the `\core\router\route` attribute. Routes have a Route _group_ identified by the L3 namespace, for example `api`. Unknown route groups are ignored.

The currently supported list of route groups are:

| Route Group | Namespace | URI Prefix | Purpose |
| --- | --- | --- | --- |
| API  | `api` | `/api/rest/v2` | REST Web Services |

Routes may optionally describe additional metadata including:

- path parameters
- optional path parameters
- header parameters
- HTTP method types (GET, POST, and so on)
- Responses
- Examples

When invoked, any parameter to the route method will be resolved using a combination of [Dependency Injection](../../core/di/index.md) and resolution of path, query, and header parameters.

## Using the `route` attribute

When applied to a method, the `\core\router\route` attribute will create a route. Class-level attributes can also be defined and are used to define a route prefix, and some defaults, but cannot handle a route directly.

The path will be combined with the URI prefix described by the route _group_ (for example `api` has a prefix of `/api/rest/v2`), and the component (for example `mod_example`) to create a fully-qualified path.

Route groups are pre-defined by the Routing Subsystem and will provide a URI prefix, relevant [Middleware](https://www.php-fig.org/psr/psr-15/meta/), and some rules -- as an example the `api` route group has a route prefix of `/api/rest/v2`, and will apply a range of Route Middleware to configure CORS, perform Input and Output Sanitisation, normalise paths, and more.

:::note

Any unknown Route Group will be ignored.

:::

In the following example, the namespace of the class has:

- A Level 2 namespace of `route`; and
- A Level 3 namespace of `api`.

This relates to the `api` route group giving it a path prefix of `/api/rest/v2`.

```php title="A simple route"
// mod/example/classes/route/api/example.php
namespace mod_example\route\api;

use core\router\schema\response\payload_response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class example {
    #[\core\router\route(
        // Resolves to https://example.com/moodle/api/rest/v2/mod_example/example
        path: '/example',
    )]
    public function example_route(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        return new payload_response(
            request: $request,
            response: $response,
            payload: [],
        );
    }
}
```
