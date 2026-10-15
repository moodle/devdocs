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
    cookies: false,
    cachelifetime: '90 days',
    pathtypes: [
        new \core\router\parameters\path_language(),
        new \core\router\parameters\path_component(),
        new \core\router\schema\parameters\path_parameter(
            name: 'identifier',
            type: param::STRINGID,
        ),
    ],
)]
```

:::danger

Responses are cached as `public` and `immutable`. Only use `cachelifetime` for routes whose response is identical for every user and which never contains private data.

Anything that causes the response to vary, such as the language or the theme, must be part of the path and _not_ a header parameter. Caches store responses by URL, so a value sent in a request header is ignored, and every user would get whichever version was requested first.

:::

## The cache key {/* #the-cache-key */}

When `cachelifetime` is set, the route automatically gains an optional `cachekey` path parameter (`\core\router\parameters\path_cachekey`), which is a Unix timestamp placed at the start of the path:

```text
/api/rest/v2/core/strings/en/core                      # No cache key - not cached
/api/rest/v2/cachekey:1737584047/core/strings/en/core  # Cacheable
```

Because the cache key forms part of the URI, changing it invalidates every cached copy of the resource. Use the revision that changes with the resource:

- `M.cfg.langrev` for strings;
- `M.cfg.templaterev` for templates.

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

const response = await Fetch.performGet('core', `strings/en/core`, {cachekey: M.cfg.langrev});
```

Requests with a cache key bypass the [batcher](../../../guides/javascript/ajax/batcher.md) by default, so that every URL can be cached individually.
