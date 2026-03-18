---
title: React Profiler
tags:
  - react
  - javascript
  - moodle
description: How to use Moodle's React profiling and dev-mode bundle infrastructure, including programmatic mounting and the Profiler HOC.
---

## How it works

Developer mode is signalled by `jsrev = -1`, which is set when **Site administration → Development → Debugging → Cache JavaScript** is disabled. This is the same convention used by Moodle's existing JS and CSS loaders.

When `jsrev === -1`:

- **PHP** — `import_map::resolve_react_dev_path()` substitutes `client.development.js` (the unminified React DOM profiling build) for `client.js` at file-serve time, giving cleaner stack traces and full React warnings.
- **Browser** — `isProfilerEnabled()` returns `true`. `mountReactApp()` automatically wraps every component tree in a React [`<Profiler>`](https://react.dev/reference/react/Profiler) and logs render timings to the console.

## Writing a new React component

Place source files under `<component>/js/esm/src/` and build output to `<component>/js/esm/build/`. The import map resolves `@moodle/lms/<component>/<module>` to `<componentdir>/js/esm/build/<module>.js`.

:::caution

The module must have a **default-exported** React function component:

:::

```ts
// mod_book/js/esm/src/viewer.ts
export default function Viewer({ title }: { title: string }) {
    return <h1>{title}</h1>;
}
```

## Mounting programmatically

Most components should be mounted via the Mustache helper, which handles auto-initialisation automatically — see [Mustache helper](./reactautoinit.md#mustache-helper-react). Use `core/mount` directly when you need to mount from TypeScript/JavaScript — for example, when the mount point is created dynamically, when you need the unmount handle, or when mounting inside an existing JS module lifecycle.

```ts
import { mountReactApp, unmountReactApp } from "@moodle/lms/core/mount";

const unmount = mountReactApp(container, MyComponent, props, { id: "my-app" });

// Unmount when done:
unmount();
// or, if you only have the container element:
unmountReactApp(container);
```

`mountReactApp` wraps the component in `<Profiler>` automatically when dev mode is active — no extra code needed.

## Console output in dev mode

When profiling is active the browser console shows:

| Output | Meaning |
|--------|---------|
| `[mount] MyComponent - 2.34ms` | Collapsed group for each render |
| `console.warn` Slow render | Actual render time exceeded 16 ms (60 fps budget) |
| `console.error` Very slow render | Actual render time exceeded 50 ms |
| `[react_autoinit] Initializing...` | Auto-init started |
| `[react_autoinit] Found N component(s) to mount` | Components detected in DOM |
| `[react_autoinit] Mounted via default: <specifier>` | Successful mount |
| `[react_autoinit] Unmounted: <specifier>` | Clean unmount after DOM removal |
