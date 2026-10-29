---
title: TypeScript coding style
tags:
  - Coding guidelines
  - Policies
  - Developer processes
  - react
---

<Since version="6.0" issueNumber="MDL-87988" />

This page describes the coding style for the TypeScript and TSX sources under `js/esm/src` in Moodle core and plugins.

Moodle follows [XO](https://github.com/xojs/xo)'s rules for TypeScript, with a small number of overrides listed below. This page does not repeat XO's rules: the linter is the reference, and it tells you which rule a line breaks and how to fix it.

AMD and YUI JavaScript is not affected. It is still linted by ESLint, using the rules in `.eslintrc`.

## Running the linter {/* #running-the-linter */}

```bash
# Lint every TypeScript source
grunt xo

# Apply the fixes XO can make itself
grunt xo --fix

# Lint only some files
grunt xo --files=public/lib/js/esm/src/fetch.ts,public/lib/js/esm/src/url.ts
```

The build tasks lint first and stop if XO reports an error, so a bundle is never built from sources that do not pass. This applies to `grunt react`, `grunt js` and plain `grunt`. In [`grunt react:watch`](/docs/guides/javascript/react/buildtools#watch-mode-uses-esbuild-native-context), each change is linted before the rebuild, and the rebuild is skipped while the sources have errors. For installing and running Grunt, see [NodeJS and Grunt](../../tools/nodejs.md#grunt).

Warnings are reported but do not stop the build.

To build while you are still fixing a lint error, pass `--skip-lint`, for example `grunt react --skip-lint` or `grunt react:watch --skip-lint`. The bundle is built from the sources as they are, so run `grunt xo` before you commit.

:::warning

Run XO through `grunt xo`, not `npx xo`. Without the source globs that Grunt supplies, XO also lints every Markdown and HTML file in the tree.

:::

:::tip

`--fix` rewrites code, not just whitespace. Review the diff before you commit it.

:::

## Rules {/* #rules */}

The rules are:

- XO's TypeScript rules
- the two classic rules from [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks):
  - `react-hooks/rules-of-hooks`, as an error
  - `react-hooks/exhaustive-deps`, as a warning
- the Moodle overrides below

The configuration is in `xo.config.mjs` at the root of the Moodle repository. Each override has its reason next to it.

:::note

The newer React Compiler rules in eslint-plugin-react-hooks, such as `react-hooks/refs` and `react-hooks/set-state-in-effect`, are not enabled. `eslint-plugin-react` is not used either, because it does not run on the ESLint version that XO bundles. TypeScript already covers most of what it checks, such as prop types.

:::

## Moodle overrides {/* #moodle-overrides */}

An override is only added where following XO would change something Moodle needs to keep, such as a released API name, a wire format, or the supported browsers. A rule being inconvenient is not a reason to override it. Propose a new override on the tracker.

### Moodle conventions {/* #moodle-conventions */}

Some overrides only apply the general [Coding style](./index.md), so they are not explained again here:

- `@stylistic/max-len` is 132, the [maximum line length](./index.md#maximum-line-length).
- `jsdoc/require-asterisk-prefix` is `always`, matching the [docblock layout](./index.md#documentation-and-comments).
- `jsdoc/check-values` is off, because the [`@license`](./index.md#license) and [`@since`](./index.md#since) tags do not hold the values it expects.

The others are specific to TypeScript:

| Rule | Moodle setting | Why |
|---|---|---|
| `jsdoc/require-param`, `jsdoc/check-param-names` | `checkDestructured: false` | An options object needs its own `@param`, but its keys are described once on its type. |
| `unicorn/prefer-https` | off | The GPL header in core's TypeScript files, as in most of core, uses `http://` URLs. |
| `unicorn/filename-case` | camelCase, PascalCase or snake_case | A filename is the module's import name. Components use PascalCase, utility modules camelCase, and existing modules such as `react_autoinit` keep snake_case. |
| `unicorn/name-replacements` | `params`, `utils`, `func`, `args`, `props` and `repository` allowed | The longer names would be worse. `params` and `utils` are published names, `props` is React's own term, and `repository` is the name core uses for web service modules. |
| `unicorn/consistent-boolean-name` | off | Option names match the server-side parameters they are sent as, such as `loginrequired`. |
| `import-x/no-duplicates` | off, replaced by `no-duplicate-imports` with `allowSeparateTypeImports: true` | Its fix merges `import type {A}` into `import B` from the same module as `import B, type {A}`, which does not parse. ESLint's own rule reports the duplicate and leaves the fix to you. A separate `import type` line is allowed. |
| `@typescript-eslint/naming-convention` | relaxed | Components may use PascalCase, as JSX requires. Object keys and type members may use any case, because they often name something external, such as an HTTP header or a snake_case web service field. |

### Supported browsers {/* #supported-browsers */}

esbuild does not downlevel or polyfill the bundles, so the code must already run in every browser listed under `browserslist` in `package.json`. These rules would otherwise suggest features that are too new:

| Rule | Moodle setting | What it would suggest |
|---|---|---|
| `unicorn/no-array-sort` | off | `Array.prototype.toSorted()` (ES2023) |
| `unicorn/prefer-promise-with-resolvers` | off | `Promise.withResolvers()` (ES2024) |
| `unicorn/prefer-at` | off | `Array.prototype.at()` (ES2022) |
| `unicorn/logical-assignment-operators` | off | `??=`, `\|\|=` and `&&=` (ES2021) |
| `unicorn/prefer-top-level-await` | off | Top-level `await` (ES2022), which needs Safari 15 |
| `@typescript-eslint/prefer-nullish-coalescing` | `ignoreIfStatements: true` | `??=` in place of an `if` that assigns a default |
| `require-unicode-regexp` | `requireFlag: 'u'` | The regular expression `v` flag (ES2024) |

The syntax ones matter most. An older browser cannot parse `??=`, top-level `await` or the `v` flag at all, so the whole module fails to load, not just the line that uses them.

### Null {/* #null */}

XO bans the `null` type in favour of `undefined`. Moodle keeps `null`, because some values are `null` by contract:

- the browser's `Storage.getItem()` returns `null`
- React's `useRef(null)` uses `null`
- a web service argument set to `null` is sent in the request, while `undefined` is left out

`@typescript-eslint/no-restricted-types` is configured with XO's list minus `null`.

## Disabling a rule inline {/* #disabling-a-rule-inline */}

Sometimes code has a good reason to break a rule in one place. Disable the rule for that line only, and give the reason after `--`. XO reports a disable comment that has no reason, and one that no longer suppresses anything.

<ValidExample>

```ts
/* eslint-disable-next-line @typescript-eslint/naming-convention -- Released API name from core/pending. */
static Promise<T>(
```

</ValidExample>

<InvalidExample>

```ts
/* eslint-disable @typescript-eslint/naming-convention */
static Promise<T>(
```

</InvalidExample>

Use a block (`eslint-disable` and `eslint-enable`) only when several lines in a row need the same exception, and give the reason on the opening comment.

### Disabling a rule for a whole file {/* #disabling-a-rule-for-a-whole-file */}

When a rule cannot apply anywhere in a file, such as generated code, disable it at the very top of the `.ts` or `.tsx` file, without an `eslint-enable`. Name each rule and give the reason, as for an inline disable. The rest of the rules still apply to the file.

<ValidExample>

```ts
/* eslint-disable no-var -- Generated file. */
```

</ValidExample>

XO rejects an `eslint-disable` that names no rule, because it would turn off every rule for the file. To skip a file entirely, list it in the plugin's `.eslintignore` instead, as described below.

## Excluding a file in a plugin {/* #excluding-a-file-in-a-plugin */}

A plugin can exclude whole files from linting with an `.eslintignore` file in its root. XO and ESLint both read it, so one list covers the TypeScript and the AMD sources. Use it for a file that cannot pass yet, such as generated code or a file you are still migrating, rather than turning linting off for the whole plugin.

Third-party code listed in the plugin's `thirdpartylibs.xml` is already excluded from both, so it does not need an entry here.

```text title="local/example/.eslintignore"
# Generated by the API client generator.
js/esm/src/generated/client.ts
```

Each line is a path or glob relative to the plugin root. Lines starting with `#` are comments. Negated patterns (`!`) are not supported.

Prefer an inline disable when only a few lines break a rule, so the rest of the file is still linted.

## See also {/* #see-also */}

- [Build tools](/docs/guides/javascript/react/buildtools)
