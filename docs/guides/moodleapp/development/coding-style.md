---
title: Moodle App Coding style
sidebar_label: Coding style
sidebar_position: 2
tags:
  - Moodle App
---

This document outlines the exceptions to the [Coding style](/general/development/policies/codingstyle) and [[JavaScript Coding Style]] which apply to the Moodle App and also includes rules for other technologies that are used in the app, like Typescript and Angular.

Unless otherwise specified, developers should follow the indications included on those documents.

Most rules are enforced with [ESLint](https://github.com/typescript-eslint/typescript-eslint) and won't be mentioned in this document, make sure to integrate a linter in your development environment.

## Goals

Consistent coding style is important in any development project, and particularly when many developers are involved. A standard style helps to ensure that the code is easier to read and understand, which helps overall quality.

Abstract goals we strive for:

- simplicity
- readability
- tool friendliness

Note that much of the existing code may not follow all of these guidelines — we continue to upgrade this code when we see it.

## TypeScript

### Disabling ESLint rules

In some situations, it may be necessary to [disable ESLint rules using inline comments](https://eslint.org/docs/user-guide/configuring/rules#disabling-rules). Although this is discouraged, it is allowed on certain use-cases.

Most of the time, however, this could be solved by refactoring code. So think twice before disabling a rule.

Warnings should be treated with the same severity as errors, even if they are allowed by the linter. The reasoning behind this is that warnings are useful when new rules are introduced that affect existing code, but new code should always conform to the rules or explicitly disable them.

### Using async / await

Using async/await is encouraged, but it shouldn’t be mixed with .then/.catch/.finally. Using both can make code difficult to understand. As a rule of thumb, there should only be one style in a given function.

✔️ Good

```ts
async function greet() {
    const response = await fetch('/profile.json');
    const data = await response.json();

    alert(`Hello, ${data.name}!`);
}
```

⚠️ Allowed, but discouraged

```ts
function greet() {
    return fetch('/profile.json')
        .then(response => response.json())
        .then(data => {
            alert(`Hello, ${data.name}!`);
        });
}
```

❌ Bad

```ts
async function greet() {
    const response = await fetch('/profile.json');

    return response.json().then(data => {
        alert(`Hello, ${data.name}!`);
    });
}
```

Async/await is [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) for Promises, so it should always be possible to avoid using .then/.catch/.finally.

To prevent making asynchronous operations difficult to spot, using await should be limited to simple statements such as one liners, assignments and if guards with a single condition.
