---
title: Aliasing and Import Maps
tags:
  - Javascript
  - ESM
  - React
  - Import Maps
description: How Moodle uses native browser import maps to resolve bare module specifiers to real URLs at runtime, including built-in specifiers, custom entries, and the ESM serving endpoint.
---

Moodle uses native browser import maps as the mechanism for resolving bare module specifiers
(for example `react` or `@moodle/lms/`) to real URLs at runtime. This replaces the need for
bundler-specific alias configuration and allows Moodle components to write standard ESM
`import` statements that work directly in the browser.

## What is an Import Map? {/* #what-is-an-import-map */}

An import map is a JSON object, embedded in the page as a `<script type="importmap">` tag,
that tells the browser how to resolve bare specifiers used in `import` statements.

```html
<script type="importmap">{
    "imports": {
        "@moodle/lms/": "http://localhost/MDL-87922/r.php/core/esm/-1/@moodle/lms/",
        "@moodlehq/design-system": "http://localhost/MDL-87922/r.php/core/esm/-1/@moodlehq/design-system",
        "react": "http://localhost/MDL-87922/r.php/core/esm/-1/react",
        "react/": "http://localhost/MDL-87922/r.php/core/esm/-1/react/",
        "react-dom": "http://localhost/MDL-87922/r.php/core/esm/-1/react-dom",
        "react-dom/": "http://localhost/MDL-87922/r.php/core/esm/-1/react-dom/"
    }
}</script>
```

With this map in place, any ES module on the page can write:

```js
import React from 'react';
import { jsx } from 'react/jsx-runtime';
import { someUtil } from '@moodle/lms/core/utils';
```

…and the browser resolves the specifier to the correct URL without any bundler step at runtime.

## How Moodle generates the Import Map {/* #how-moodle-generates-the-import-map */}

The import map is built and injected into the page automatically by
`page_requirements_manager::get_import_map()`, which is called during the page `<head>`
render phase.

### The `import_map` class {/* #the-import_map-class */}

**`core\output\requirements\import_map`** is the single source of truth for all
specifier → URL mappings and specifier → filesystem path mappings. It implements
`JsonSerializable` so it can be written directly into the page as JSON, and it is also
consulted by the ESM controller when serving files.

Key responsibilities:

- Holds a list of specifier → entry mappings.
- Accepts a **default loader URL** (the ESM serving endpoint) which is used to derive
  concrete URLs for entries that use the default loader.
- Provides `add_import()` to register additional specifiers, or to override the built-in
  ones, from a `pre_render` hook.

#### Built-in specifiers {/* #built-in-specifiers */}

The following specifiers are registered by default in `add_standard_imports()`:

| Specifier | URL in import map | Filesystem path |
|---|---|---|
| `@moodle/lms/` | `{loaderBase}@moodle/lms/` | Component's `js/esm/build/` directory |
| `@moodlehq/design-system` | `{loaderBase}@moodlehq/design-system` | `lib/js/bundles/design-system.js` |
| `react` | `{loaderBase}react` | `lib/js/bundles/react/react.js` |
| `react/` | `{loaderBase}react/` | `lib/js/bundles/react/` (prefix) |
| `react-dom` | `{loaderBase}react-dom` | `lib/js/bundles/react-dom/react-dom.js` |
| `react-dom/` | `{loaderBase}react-dom/` | `lib/js/bundles/react-dom/` (prefix) |

The `react/` prefix entry covers all sub-specifiers such as `react/jsx-runtime`.

:::note
`{loaderBase}` is the base URL of the ESM serving endpoint — the URL that
`page_requirements_manager::get_import_map()` sets as the default loader. In practice it looks like
`https://example.com/esm/12345/`, where `12345` is the JS revision number returned by
`page_requirements_manager::get_jsrev()`. All specifier URLs in the import map are built by
appending the bare specifier to this base URL.

The revision value `/esm/-1/` means the revision is invalid or in development mode. When the
revision is `-1`, the ESM controller applies short-lived cache headers so the browser re-fetches
the file on every page load instead of serving a stale cached copy.
:::

#### Adding a custom specifier {/* #adding-a-custom-specifier */}

You can extend the import map from a `pre_render` hook before the page is rendered:

```php
use core\output\requirements\import_map;

// Fetch the shared singleton from the DI container.
$importmap = \core\di::get(import_map::class);

// Map 'my-lib' to an absolute URL (e.g. a CDN). Used verbatim in the import map.
$importmap->add_import('my-lib', loader: new \core\url('https://cdn.example.com/my-lib.js'));

// Map '@myplugin/' using a filesystem path relative to $CFG->root.
// The URL in the import map will be '{loaderBase}@myplugin/'.
// The ESM controller uses $path to locate the file on disk.
$importmap->add_import('@myplugin/', path: 'local_myplugin/js/esm/build');
```

The `add_import()` signature is:

```php
public function add_import(
    string $specifier,
    ?\core\url $loader = null,
    ?string $path = null,
    bool $loadfromcomponent = false,
): void
```

- **`$specifier`** — The bare specifier string used in `import` statements
  (e.g. `react`, `@moodle/lms/`).
- **`$loader`** — An absolute `\core\url`. When provided, this URL is written directly
  into the import map and `$path` is ignored.
- **`$path`** — A filesystem path relative to `$CFG->root`, used by the ESM controller
  to locate the file on disk. Has no effect on the URL written into the import map
  (the URL always uses `{loaderBase}{specifier}`).
- **`$loadfromcomponent`** — When `true`, the specifier is treated as a
  `<component>/<module>` prefix and resolved to the component's `js/esm/build/`
  directory on disk. Used internally for `@moodle/lms/`.

## The ESM serving endpoint {/* #the-esm-serving-endpoint */}

All ESM files are served by `core\route\controller\esm_controller::serve`, registered
under the route:

```
/esm/{revision:[0-9-]+}/{scriptpath:.*}
```

The controller is intentionally thin: it delegates all resolution to the `import_map`
registry, which is the single source of truth. For a given `scriptpath` it calls
`import_map::get_path_for_script()`, which:

1. Sorts entries longest-key-first so a more-specific prefix wins
   (e.g. `react/` is matched before `react`).
2. Finds the first entry whose specifier is a prefix of the requested path.
3. Returns the absolute filesystem path to the file, or `null` if no entry matches.

If the resolved path exists on disk the file is served; otherwise a 404 is returned.

### Resolving component modules {/* #resolving-component-modules */}

Entries registered with `$loadfromcomponent = true` (i.e. `@moodle/lms/`) are resolved
differently: the path after the prefix is split into `<component>/<module>`, the component
directory is looked up via `core\component`, and the file is resolved to:

```
<component_directory>/js/esm/build/<module>.js
```

For example, `@moodle/lms/mod_book/viewer` resolves to
`<dirroot>/mod/book/js/esm/build/viewer.js`.

## HTTP caching {/* #http-caching */}

The controller applies the following caching strategy:

| Revision | Behaviour |
|---|---|
| Valid (positive integer) | Long-lived immutable cache headers + ETag. Returns `304 Not Modified` when the client already has the file cached. |
| `-1` (development / invalid) | Short-lived cache headers. Forces the browser to re-fetch on every page load. |

The revision value comes from `page_requirements_manager::get_jsrev()` and changes
whenever JavaScript files are updated, automatically busting caches.

## Writing a component React module {/* #writing-a-component-react-module */}

To expose a React module through the import map:

1. Build your TypeScript/React source (`.ts` or `.tsx`) into a compiled JavaScript file
   at `<component_directory>/js/esm/build/<module>.js` using the Moodle build tools.
   See the React build tooling guide for details.
2. Import it in browser code using the `@moodle/lms/` scope:

```js
import { BookViewer } from '@moodle/lms/mod_book/viewer';
```

The import map translates `@moodle/lms/mod_book/viewer` → the ESM endpoint URL for
`@moodle/lms/mod_book/viewer`, which the controller resolves to
`<dirroot>/mod/book/js/esm/build/viewer.js`.

:::note
The `@moodle/lms/` specifier ends with a trailing slash. This is the standard import map
convention for **package scopes**: any import that begins with `@moodle/lms/` is prefixed
with the loader base URL, allowing the entire namespace to be served from one endpoint
without registering each module individually.
:::

## Overriding a built-in specifier {/* #overriding-a-built-in-specifier */}

You can replace any of the default specifiers in a `pre_render` hook. For example, to swap
in a local React build during development:

```php
$importmap = \core\di::get(\core\output\requirements\import_map::class);
$importmap->add_import(
    'react',
    loader: new \core\url('/local/devtools/react-debug.js'),
);
```

Calling `add_import()` with the same specifier twice overwrites the previous entry, so
ordering matters when multiple hooks are involved.

## See also {/* #see-also */}

- [JavaScript Modules](../modules.md) — AMD and ESM module authoring in Moodle.
- [MDN: Import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
- [HTML spec: import maps](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps)
