---
title: Collections and pagination
---

<Since version="6.0" issueNumber="MDL-90234" />

The router provides an opt-in collection attribute, a pagination request value object, and a collection payload response. Together they describe and validate pagination and return a consistent envelope.

:::note[API design and implementation]

Follow the REST style guide's [collection standards](../../../guides/rest/style.md#10-collection-standards) when designing an endpoint. This page describes the router helpers used to implement collections, pagination, and sorting.

:::

## Declaring a collection {/* #declaring-a-collection */}

Add `#[\core\router\schema\collection]` alongside your handler's route attribute:

```php
#[\core\router\route(
    path: '/items',
    method: ['GET'],
)]
#[\core\router\schema\collection(
    pagesize: 25,
    maxpagesize: 100,
    sortable: ['name'],
)]
```

The router adds query-parameter validation and OpenAPI documentation for:

| Parameter | Meaning |
| --- | --- |
| `page` | Page number, starting at 1; defaults to 1. |
| `pagesize` | Items per page, from 1 to `maxpagesize`; defaults to `pagesize`. |
| `sort` | Comma-separated field names from `sortable`; prefix a field with `-` for descending order. |

The default page size is 25 and maximum is 100 unless overridden. Omit `sortable`, or pass an empty array, to omit the sort parameter. Unsupported sort fields and out-of-range pagination values are rejected with `invalid_parameter_exception`.

For example, `?page=2&pagesize=10&sort=-name` requests the second page ordered by descending name.

## Reading pagination and fetching items {/* #reading-pagination-and-fetching-items */}

Use `pagination_request::from_request()` after the router has validated the request. This value object does not itself validate arbitrary input.

```php
$pagination = \core\router\pagination_request::from_request($request);
$offset = $pagination->get_offset();
$limit = $pagination->get_limit();
$order = $pagination->get_order_by(['name' => 'i.name']);
```

The public readonly properties are `page`, `pagesize`, and `sort`. The sort map contains field names mapped to booleans: true means descending. Offset is `(page - 1) * pagesize`.

`get_order_by()` maps client-facing fields to trusted SQL expressions and returns an ORDER BY clause body, without the `ORDER BY` keyword. Unknown fields are ignored by this method; the collection attribute's request validation rejects unsupported client fields earlier.

Never interpolate raw client sort input into SQL. Supply a fixed mapping and add a deterministic default order and tie-breaker:

```php
$order = $pagination->get_order_by(['name' => 'i.name']);
$order = $order ? "{$order}, i.id ASC" : 'i.name ASC, i.id ASC';
```

The handler or its domain service must apply permissions, visibility, search, and other filters **before** pagination. Sorting by hidden information can also leak values; only expose safe sort fields.

### Determining whether more items exist {/* #determining-whether-more-items-exist */}

Fetch one extra visible result to determine `hasMore` without counting the entire collection:

```php
// The service applies visibility and filters in its query before offset/limit.
$items = $this->repository->find_visible_items(
    offset: $pagination->get_offset(),
    limit: $pagination->get_limit() + 1,
    order: $order,
);
$items = array_values($items);

$hasmore = count($items) > $pagination->get_limit();
if ($hasmore) {
    array_pop($items);
}
```

Avoid fetching a page and then discarding invisible rows: that can produce short pages and incorrect `hasMore`, or leak inaccessible records through metadata.

## Returning a collection response {/* #returning-a-collection-response */}

Return `\core\router\schema\response\collection_response` from the handler:

```php
return new \core\router\schema\response\collection_response(
    items: $items,
    totalitems: null,
    hasmore: $hasmore,
    request: $request,
    response: $response,
);
```

The response wraps your items in this payload:

```json
{
    "items": [
        {"id": 42, "name": "Example"}
    ],
    "pagination": {
        "page": 1,
        "pageSize": 25,
        "totalItems": null,
        "hasMore": false
    }
}
```

`items` is always a sequential array. The response derives page and pageSize from the validated request, but does not fetch records, calculate a total, or determine hasMore.

Pass an exact visible total as `totalitems` if calculated; otherwise pass null. Never use zero to mean unknown or include inaccessible records in the total. Pages beyond the end can return an empty items array with hasMore false.

The collection attribute does not automatically add a response schema. Use `collection_object` to describe the envelope in your response definition:

```php
new \core\router\schema\response\response(
    content: new \core\router\schema\response\content\payload_response_type(
        schema: new \core\router\schema\objects\collection_object(
            itemtype: new \mod_example\route\schema\item_object(),
        ),
    ),
)
```

`item_object` is your component's item schema; it can also be reused by an individual-resource response. The collection attribute does not enable ETags. Add [conditional-request handling](conditional-requests.md) separately only when the endpoint supports it.
