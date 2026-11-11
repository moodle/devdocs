---
title: The Fetch batcher
tags:
  - Javascript
  - AJAX
  - Fetch
  - Routing
---

<Since version="6.0" issueNumber="MDL-82652" />

The `core/fetch` module makes requests to the Moodle [REST API (routes)](../../../apis/subsystems/routing/index.md). In addition to immediate requests, it can queue several requests and send them as a single HTTP `$batch` request, reducing the number of round trips.

## Immediate requests {/* #immediate-requests */}

Static methods perform a single request immediately:

```js
import Fetch from 'core/fetch';

const response = await Fetch.performGet('mod_example', 'animals', {params: {type: 'mammal'}});
```

`performGet`, `performHead`, `performPost`, `performPut`, `performPatch` and `performDelete` are available.

## Batching requests {/* #batching-requests */}

The same methods are available on an _instance_. Instance calls are queued and sent together.

### The automatic batcher {/* #the-automatic-batcher */}

`Fetch.getBatcher()` returns a shared singleton which automatically executes the queue 50ms after the last request was added.

```js
import Fetch from 'core/fetch';

const batcher = Fetch.getBatcher();
const [mammals, reptiles] = await Promise.all([
    batcher.performGet('mod_example', 'animals', {params: {type: 'mammal'}}),
    batcher.performGet('mod_example', 'animals', {params: {type: 'reptile'}}),
    batcher.performDelete('mod_example', `animals/${pig.id}`),
]);
```

Each call returns a `Promise` resolving to a standard `Response` for that sub-request, and failures reject only the individual promise.

### A manual batcher {/* #a-manual-batcher */}

Create an instance yourself and call `execute()` when ready. An optional constructor argument sets an auto-execute delay in milliseconds.

```js
const batcher = new Fetch();
const results = Promise.all([
    batcher.performGet('mod_example', 'animals', {params: {type: 'mammal'}}),
    batcher.performGet('mod_example', 'animals', {params: {type: 'reptile'}}),
]);

batcher.execute();
await results;
```

## Behaviour notes {/* #behaviour-notes */}

- If a batch contains a single request, the batch endpoint is _not_ used; it is sent as a normal request.
- The queue is flushed automatically once it holds more than 20 requests.
- If the `$CFG->batch_fetch_requests` setting (JS: `M.cfg.batchFetchRequests`, default `true`) is disabled, each request is executed immediately instead of being queued.

## Cacheable requests bypass the batcher {/* #cacheable-requests-bypass-the-batcher */}

Requests made with a `cachekey` (see [route caching](../../../apis/subsystems/routing/caching.md)) are sent individually, even via a batcher. Hiding them inside a generic `$batch` request would prevent browsers and reverse proxies caching each URL.

```js
const response = await Fetch.getBatcher().performGet('core', 'strings/en/core', {cachekey: M.cfg.jsrev});
```

To batch these requests anyway, set `$CFG->batch_api_asset_requests = true` (JS: `M.cfg.batchApiAssetRequests`).

## See also {/* #see-also */}

- [AJAX](./index.md)
- [Routing: Caching](../../../apis/subsystems/routing/caching.md)
