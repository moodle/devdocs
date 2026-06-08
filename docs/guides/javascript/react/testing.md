---
title: JavaScript unit testing
tags:
  - react
  - javascript
  - jest
  - testing
  - typescript
description: How to write and run Jest unit tests for React and ESM TypeScript components in Moodle.
---

<Since version="5.3" issueNumber="MDL-88812" />

Moodle uses Jest as the JavaScript unit testing framework. Tests run against TypeScript source files in `public/**/js/esm/` and are integrated into the CI pipeline alongside PHPUnit and Grunt.

:::note

JavaScript unit testing with Jest was introduced in Moodle 5.3 ([MDL-87781](https://tracker.moodle.org/browse/MDL-87781)). It targets ESM TypeScript source only. AMD modules cannot run directly in Jest (see [Mocking AMD modules](#mocking-amd-modules)).

:::

## Running tests

```bash
npm test
```

The `pretest` script runs `grunt jsconfig` first to regenerate `tsconfig.aliases.json`. This is required because the alias file is gitignored and Jest needs it to resolve module path mappings.

To run a single file or pattern:

```bash
npm test -- --testPathPatterns=public/lib/js/esm/tests/String.test.ts
```

To collect coverage:

```bash
npm test -- --coverage
```

## Where to put tests

Test files must match the glob `**/esm/tests/**/*.test.{ts,tsx}`. Place them alongside the source they test:

```
public
└── lib
    └── js
        └── esm
            ├── src
            │   └── output
            │       └── ExampleComponent.tsx
            └── tests
                └── output
                    └── ExampleComponent.test.ts
```

The same convention applies to plugin components:

```
public
└── mod
    └── forum
        └── js
            └── esm
                ├── src
                │   └── output
                │       └── ExampleComponent.tsx
                └── tests
                    └── output
                        └── ExampleComponent.test.ts
```

## Writing a test

Tests use standard Jest `describe`/`it`/`expect` syntax. TypeScript source is transformed by `ts-jest` and the test environment is `jsdom`.

```typescript
import {getString} from '@moodle/lms/core/String';

describe('getString', () => {
    it('returns the resolved string', async () => {
        mockString('pluginname', 'mod_forum', 'Forum');

        await expect(getString('pluginname', 'mod_forum')).resolves.toBe('Forum');
    });
});
```

## Mocking AMD modules

AMD modules (anything loaded via `requirejs`) **cannot** run inside Jest. The Jest module system and the AMD loader are completely separate environments, so `requirejs`, `M`, jQuery, and other Moodle globals are not available.

The correct approach is to **test the ESM layer and mock everything below it**. The global `mockAmdModule()` helper registers a mock object for any AMD module identifier. Jest's mock of `core/amd` intercepts calls to `requireAsync` and `requireManyAsync` and returns the registered object.

```typescript
import {requireAsync} from '@moodle/lms/core/amd';

describe('my component', () => {
    it('fetches data via core/ajax', async () => {
        const mockAjax = {call: jest.fn().mockResolvedValue([{data: 'ok'}])};
        mockAmdModule('core/ajax', mockAjax);

        // code under test that calls requireAsync('core/ajax')...

        expect(mockAjax.call).toHaveBeenCalledWith(
            expect.arrayContaining([expect.objectContaining({methodname: 'my_ws_method'})]),
        );
    });
});
```

:::note

If code under test calls `requireAsync` or `requireManyAsync` with a module that has not been registered via `mockAmdModule`, the test will throw:

```
Error: Unexpected call to requireAsync with module name: core/notification
```

This is intentional: missing mocks produce a hard failure rather than silent wrong behaviour.

:::

### Registrations reset between tests

Mocks and test fixtures, such as the AMD module map, and the string map, are cleared between each test using the `afterEach` notation.

You do not need to clean up manually. Each test starts with a fresh state.

You can clear up any additional test state within your test file using:

- `beforeEach()`
- `afterEach()`

See the [Jest Setup and Teardown](https://jestjs.io/docs/setup-teardown) documentation for further information.

## Mocking language strings

`mockString(identifier, component, resolved)` registers a resolved value for a specific `(identifier, component)` pair. This delegates to the default `core/str` mock that is already registered in `.jest/globalSetup.ts`.

```typescript
mockString('submit', 'core', 'Submit');
mockString('cancel', 'core', 'Cancel');

await expect(getString('submit', 'core')).resolves.toBe('Submit');
```

For any string that was not registered, the default mock returns `[identifier, component]`:

```typescript
await expect(getString('other', 'core')).resolves.toBe('[other, core]');
```

This default is useful for snapshot tests and assertions that only care whether a string key was requested, not its exact value.

## Module path aliases

TypeScript path aliases (such as `@moodle/lms/core/String`) are resolved at test time from `tsconfig.aliases.json`, which is generated by `grunt jsconfig` and gitignored. If you encounter import resolution errors, run `grunt jsconfig` first.

## CI integration

A `Jest` job runs in the GitHub Action pipeline (`.github/workflows/push.yml`) in parallel with `Grunt` and `PHPUnit`.

## See also

- [Build tools](./buildtools.md)
- [Modules](../modules.md)
- [Writing PHPUnit tests](../../testing/index.md)
- [Jest](https://jestjs.io)
