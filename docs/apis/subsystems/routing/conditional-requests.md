---
title: ETags and conditional requests
---

<Since version="6.0" issueNumber="MDL-90234" />

ETags identify a resource representation. Clients can use them to avoid downloading unchanged data or to protect updates against stale representations.

Use `\core\router\conditional_request` for runtime handling and the `\core\router\schema\etag` attribute to document conditional requests.

:::note[API design and implementation]

See the REST style guide's [concurrency control rules](../../../guides/rest/style.md#151-concurrency-control) when deciding whether a resource supports conditional writes. This page describes the router helpers for implementing conditional reads and writes.

:::

## Conditional reads {/* #conditional-reads */}

Build the representation that the caller is allowed to see, then pass it to `conditional_request::respond()`:

```php
#[\core\router\route(
    path: '/items/{itemId}',
    method: ['GET'],
    // Declare path parameters, scopes, and a response schema for this resource.
)]
#[\core\router\schema\etag]
public function get_item(
    \Psr\Http\Message\ServerRequestInterface $request,
    \Psr\Http\Message\ResponseInterface $response,
    int $itemId,
): \core\router\schema\response\payload_response {
    $item = $this->repository->get_visible_item($itemId);

    return \core\router\conditional_request::respond($request, $response, $item);
}
```

The repository in this example is an application service responsible for permissions, visibility, and missing resources. Configure the route's path parameters and authentication as described in [Routing](index.md).

`respond()` returns a `payload_response` with:

- The representation and an `ETag` header for an unconditional or non-matching request.
- An empty `304 Not Modified` response with the same `ETag` when `If-None-Match` matches.

The ETag is generated once and reused for the comparison. The helper does not perform authorization: check access before evaluating conditional headers, including for a possible 304 response.

### Sending conditional headers {/* #sending-conditional-headers */}

Copy the response's ETag, **including its literal double quotes**:

```http
ETag: "abc123"
```

```http
If-None-Match: "abc123"
```

For example:

```bash
curl -H 'If-None-Match: "abc123"' 'https://example.com/api/rest/v2/mod_example/items/42'
```

Swagger UI does not add these quotes automatically.

Both `If-None-Match` and `If-Match` accept a comma-separated list of entity-tags, or `*` alone. Tags may contain commas inside their quotes. Malformed values, including unquoted tags, throw `\core\exception\invalid_parameter_exception`.

`If-None-Match` uses weak comparison: `W/"abc123"` matches `"abc123"`. `*` matches an existing representation. These helpers assume the handler has already established that the resource exists.

## Conditional writes {/* #conditional-writes */}

Before changing a resource, call `assert_if_match()` with its current representation:

```php
$current = $this->repository->get_visible_item($itemId);
\core\router\conditional_request::assert_if_match($request, $current);

$updated = $this->repository->update_item($itemId, $changes);
$response = $response->withHeader(
    'ETag',
    \core\router\conditional_request::generate_etag($updated),
);

return new \core\router\schema\response\payload_response(
    payload: $updated,
    request: $request,
    response: $response,
);
```

`assert_if_match()`:

- Allows the operation when the header is absent.
- Allows `*`, assuming the resource exists.
- Requires a strong match against at least one supplied tag.
- Throws `\core\exception\precondition_failed_exception` for a non-match, producing a 412 response. A weak tag alone cannot satisfy `If-Match`.

Use the same representation as the read endpoint, including its field visibility and serialization. A different field set or ordering can produce a different ETag.

:::warning[Concurrent updates]

Checking an ETag and then writing does not make the operation atomic. The application must coordinate concurrent changes using appropriate transactions, locks, or an atomic update strategy.

:::

## Lower-level helpers {/* #lower-level-helpers */}

`generate_etag($representation)` returns a quoted strong ETag based on the SHA-1 hash of the string, or the JSON encoding of an array or `stdClass`. It is a representation validator, not a credential or security signature.

`is_not_modified($request, $current, ?string $etag = null)` checks `If-None-Match` without building a response. Pass an already-generated, quoted ETag as the third argument to avoid hashing twice. Neither helper loads the resource or checks permissions.

## Documenting headers and responses {/* #documenting-headers-and-responses */}

The `#[\core\router\schema\etag]` attribute adds conditional-request documentation:

- GET and HEAD routes document `If-None-Match` and the 304 response.
- Other methods document `If-Match` and the 412 response.

The attribute does **not** implement conditional handling or add the ETag header to your successful response schema. Declare that header explicitly in your [response definition](responses.md):

```php
new \core\router\schema\response\response(
    headers: [new \core\router\schema\parameters\etag()],
    content: new \core\router\schema\response\content\payload_response_type(
        schema: new \mod_example\route\schema\item_object(),
    ),
)
```

`item_object` represents your component's response schema. The reusable `etag`, `if_match`, and `if_none_match` header schemas live in `\core\router\schema\parameters` and implement `referenced_object`.
