---
title: Mustache Helper and Autoinit
tags:
  - react
  - javascript
description: How Moodle's Mustache React helper and react_autoinit work together to render, mount, and manage React components.
---

import { Since } from '@site/src/components';

<Since version="5.2" issueNumber="MDL-87765" />

This page explains the combined developer contract between `mustache_react_helper` and `react_autoinit`, including how template JSON is converted into markup, how modules are resolved, and how components mount and unmount.

## Purpose {/* #purpose */}

Use this integration when UI is produced by Mustache or fragment HTML and React components should mount automatically without manual bootstrap code.

Source files:

- `public/lib/classes/output/mustache_react_helper.php`
- `public/lib/js/esm/src/react_autoinit.ts`

## End-to-end flow {/* #end-to-end-flow */}

1. You write a `{{#react}} ... {{/react}}` block in a Mustache template.
2. `mustache_react_helper` converts the JSON config into a `<div>` with `data-react-component` and `data-react-props` attributes.
3. `react_autoinit` finds the element, imports the module via the browser import map, and mounts it.
4. If the region is replaced later (AJAX/fragments), components are mounted or unmounted automatically.

## Mustache helper (`{{#react}}`) {/* #mustache-helper-react */}

The `{{#react}}` block accepts a JSON object followed by optional fallback HTML content:

```mustache title="mod/book/templates/view.mustache"
{{#react}}
{
    "component": "@moodle/lms/mod_book/viewer",
    "props": {
        "title": "{{title}}",
        "chapter": "{{chapter}}"
    },
    "id": "book-viewer",
    "class": "book-viewer-wrapper"
}
<p>Loading…</p>
{{/react}}
```

### JSON keys {/* #json-keys */}

| Key | Required | Maps to |
|-----|----------|---------|
| `component` | Yes | `data-react-component` attribute |
| `props` | No | `data-react-props` attribute (JSON-encoded) |
| Any other key | No | Regular HTML attribute (`id`, `class`, `aria-*`, etc.) |

### Mustache tags inside the block {/* #mustache-tags-inside-the-block */}

The entire block is passed through the Mustache renderer before the JSON is parsed. This means any Mustache tag — including `{{#str}}`, `{{#quote}}`, template variables, and other helpers — can appear inside the JSON values:

```mustache
{{#react}}
{
    "component": "@moodle/lms/mod_book/viewer",
    "props": {
        "title": "{{title}}",
        "confirmLabel": "{{#str}}confirm, core{{/str}}",
        "cancelLabel": "{{#str}}cancel, core{{/str}}"
    }
}
{{/react}}
```

The rendered output is a plain string before `mustache_react_helper` attempts JSON parsing, so any valid Mustache syntax is supported.

### Parsing behaviour {/* #parsing-behaviour */}

- Mustache variables inside the block are rendered before the JSON is parsed.
- Trailing commas in the JSON object are stripped automatically.
- If the JSON is invalid but fallback HTML content is present, a plain `<div>` with the fallback is rendered.
- If the JSON is invalid and there is no fallback content, an empty string is returned.
- Invalid JSON is reported via `debugging()` at `DEBUG_DEVELOPER` level.

Boolean attribute values: if a key's value is `true`, the attribute name is emitted without a value. If `false`, the attribute is omitted.

## The DOM contract {/* #the-dom-contract */}

### `data-react-component` {/* #data-react-component */}

The component specifier must be a fully-qualified ESM import specifier in the form:

```text
@moodle/lms/<component>/<path>
```

Examples:

```html
<div data-react-component="@moodle/lms/mod_book/viewer"></div>
<div data-react-component="@moodle/lms/core_calendar/event_chip"></div>
```

### `data-react-props` {/* #data-react-props */}

An optional JSON object passed as the props to the React component:

```html
<div
    data-react-component="@moodle/lms/mod_book/viewer"
    data-react-props='{"title":"My Book","chapter":"Chapter 1"}'
></div>
```

If the value is not valid JSON, `react_autoinit` logs an error and falls back to `{}`.

## How module resolution works {/* #how-module-resolution-works */}

The specifier in `data-react-component` is passed directly to a dynamic `import()` call. The browser resolves it through the Moodle import map, which maps `@moodle/lms/<component>/<path>` to the built JS file under the component's `js/esm/build/` directory.

For example, `@moodle/lms/mod_book/viewer` resolves to `mod/book/js/esm/build/viewer.js`.

If the import fails, mounting is skipped and an error is logged to the console.

## Export contract {/* #export-contract */}

`react_autoinit` expects a **default-exported React function component**:

```tsx title="mod/book/js/esm/src/viewer.tsx"
type Props = {
    title?: string;
    chapter?: string;
};

export default function Viewer({title = 'Book', chapter = 'Chapter 1'}: Props) {
    return (
        <div>
            <h1>{title}</h1>
            <p>{chapter}</p>
        </div>
    );
}
```

The component is mounted with `react-dom/client` `createRoot`. If `module.default` is not found, `react_autoinit` logs a warning and skips mounting.

## Lifecycle internals {/* #lifecycle-internals */}

### Initial run {/* #initial-run */}

`react_autoinit` calls `init()` automatically when the bundle loads.

Sequence:

1. Wait for `DOMContentLoaded` (or resolve immediately if the DOM is already ready).
2. Scan all `[data-react-component]` elements in the document.
3. Mount each one.
4. Install a single global `MutationObserver`.

### Mount guard {/* #mount-guard */}

Each successfully mounted element receives `dataset.reactMounted = "1"`. This prevents duplicate mounting when the same region is rescanned.

### Unmount tracking {/* #unmount-tracking */}

The cleanup function returned by `createRoot().unmount` is stored in a `WeakMap<Element, () => void>`. When the element is removed from the DOM, the cleanup function is called automatically.

## Dynamic content (AJAX and fragments) {/* #dynamic-content-ajax-and-fragments */}

A `MutationObserver` watches `document.documentElement` with `childList: true` and `subtree: true`.

When content is added:

- If the added node matches `[data-react-component]`, it is mounted.
- If the added node contains matching descendants, each descendant is mounted.

When content is removed:

- If the removed node matches, it is unmounted.
- If the removed node contains matching descendants, each descendant is unmounted.

This means React components inside AJAX-loaded fragments or dynamic regions are handled automatically without any additional initializer call.

## Building components {/* #building-components */}

Run the Grunt `react` task from the Moodle root:

```bash
# Production build — minified, no source maps
grunt react

# Development build — readable output, inline source maps
grunt react:dev

# Watch mode — rebuilds changed files automatically
grunt react:watch
```

The build tool discovers all `js/esm/src/**/*.{ts,tsx}` files across core and plugins automatically. No registration is required.

## Debugging checklist {/* #debugging-checklist */}

If a component does not render:

1. Check that `data-react-component` uses the `@moodle/lms/<component>/<path>` format.
2. Confirm the built file exists under `js/esm/build/`.
3. Confirm the module has a default-exported function component.
4. Check the browser console for messages prefixed with `[react_autoinit]`.

If a component mounts multiple times:

1. Ensure the container element is not recreated on every re-render by the surrounding template.
2. Do not call `createRoot` manually on an element already managed by `react_autoinit`.

## See also {/* #see-also */}

- [Mustache templates](../../templates)
- [JavaScript modules](../modules)
