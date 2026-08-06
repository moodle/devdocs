---
title: Coding conventions
tags:
  - react
  - javascript
  - typescript
  - moodle
description: Naming and testing conventions that apply to Moodle's TypeScript and React code.
---

This page describes the file naming and unit testing conventions that apply to all new TypeScript and TSX code in Moodle, including React components.

## File naming {/* #file-naming */}

File names must reflect what the file exports:

- **React components** must use `PascalCase` (also known as `StudlyCaps`), matching the name of the component they export, for example `ExampleComponent.tsx`.
- **Utility and helper files** (any TypeScript file that is not a React component) must use `camelCase`, for example `dateHelper.ts` or `formatCurrency.ts`.

```text
public/mod/forum/js/esm/src/
├── ExampleComponent.tsx   // React component: PascalCase
├── GradingPanel.tsx       // React component: PascalCase
└── dateHelper.ts          // Utility file: camelCase
```

Test files follow the name of the file they test, with a `.test` suffix, for example `ExampleComponent.test.ts` or `dateHelper.test.ts`. See [Where to put tests](./testing.md#where-to-put-tests) for the full directory convention.

## Unit testing requirement {/* #unit-testing-requirement */}

:::danger[Tests are required]

All new TypeScript and TSX code **must** be accompanied by Jest unit tests, with a minimum of **80% coverage** of the new code (statements, branches, functions, and lines). Pull requests which add TypeScript or TSX code without corresponding tests, or which fall below this coverage threshold, will not be accepted.

Use `npm test -- --coverage` to check coverage locally before submitting a pull request. See [Collecting coverage](./testing.md#running-tests) in the testing guide.

:::

See the [JavaScript unit testing](./testing.md) guide for details on writing and running Jest tests, including where to place test files and how to mock AMD modules and language strings.

## See also {/* #see-also */}

- [JavaScript unit testing](./testing.md)
- [Build tools](./buildtools.md)
