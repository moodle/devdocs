---
title: Caching
tags:
  - Routing
  - Caching
  - Performance
---

<Since version="6.0" issueNumber="MDL-82652" />

Routes which return static, public assets (such as language strings and templates) can be made cacheable by browsers and reverse proxies by setting the `cachelifetime` property of the `\core\router\route` attribute.

## Declaring a cacheable route {/* #declaring-a-cacheable-route */}

`cachelifetime` accepts any relative time string understood by [`DateInterval::createFromDateString()`](https://www.php.net/manual/en/dateinterval.createfromdatestring.php), for example `'90 days'`.

```php title="A cacheable route"
#[\core\router\route(
    path: '/strings/{language}/{component}[/{identifier:.*}]',
    method: ['GET'],
    security: [],
    cachelifetime: '90 days',
    pathtypes: [
        new \core\router\parameters\path_language(),
        new \core\router\parameters\path_component(),
    ],
)]
```

:::danger

Responses are cached as `public` and `immutable`. Only use `cachelifetime` for routes whose response is identical for every user and which never contains private data.

:::

## The cache key {/* #the-cache-key */}

When `cachelifetime` is set, the route automatically gains an optional `cachekey` path parameter (`\core\router\parameters\path_cachekey`), which is a Unix timestamp placed at the start of the path:

```text
/api/rest/v2/strings/en/core                      # No cache key - not cached
/api/rest/v2/cachekey:1737584047/strings/en/core  # Cacheable
```

Because the cache key forms part of the URI, changing it (typically by using the current JavaScript/theme revision) invalidates every cached copy of the resource. You do not need to declare the parameter yourself.

## Cache headers {/* #cache-headers */}

The `\core\router\middleware\cache_control_middleware` adds the following headers when all of these are true:

- the request method is `GET`;
- the response status is 2xx;
- the route has a `cachelifetime`;
- a numeric `cachekey` was supplied, and it is not in the future (to prevent cache poisoning); and
- the lifetime resolves to a positive number of seconds.

| Header | Value |
| --- | --- |
| `Cache-Control` | `public, max-age=<seconds>, immutable` |
| `Expires` | The current time plus the lifetime |
| `Pragma` | _(empty)_ |
| `Accept-Ranges` | `none` |

The expiry is calculated from the current time, not from the cache key, so cached content does not expire early because an old key was used.

If any condition is not met, no caching headers are added.

## Fetching cacheable routes from JavaScript {/* #fetching-cacheable-routes-from-JavaScript */}

Pass the `cachekey` option to the [`core/fetch`](../../../guides/javascript/ajax/batcher.md) module:

```js
import Fetch from 'core/fetch';

const response = await Fetch.performGet('core', `strings/en/core`, {cachekey: M.cfg.jsrev});
```

Requests with a cache key bypass the [batcher](../../../guides/javascript/ajax/batcher.md) by default, so that every URL can be cached individually.
