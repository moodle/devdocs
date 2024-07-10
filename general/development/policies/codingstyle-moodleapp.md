---
title: Moodle App Coding style
description: The Moodle App Coding Style guidelines
tags:
  - Moodle App
  - Policies
  - Coding guidelines
  - Developer processes
---

<!-- markdownlint-disable no-inline-html -->

This document outlines the exceptions to the [Coding style](./codingstyle/index.md) and [JavaScript Coding Style](https://docs.moodle.org/dev/JavaScript_Coding_Style) which apply to the Moodle App and also includes rules for other technologies that are used in the app, like Typescript and Angular.

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

Using async/await is encouraged, but it shouldn't be mixed with .then/.catch/.finally. Using both can make code difficult to understand. As a rule of thumb, there should only be one style in a given function.

<ValidExample title="Good">

```ts
async function greet() {
    const response = await fetch('/profile.json');
    const data = await response.json();

    alert(`Hello, ${data.name}!`);
}
```

</ValidExample>

<CodeExample type="warning" title="Allowed, but discouraged">

```ts
function greet() {
    return fetch('/profile.json')
        .then(response => response.json())
        .then(data => {
            alert(`Hello, ${data.name}!`);
        });
}
```

</CodeExample>

<InvalidExample title="Bad">

```ts
async function greet() {
    const response = await fetch('/profile.json');

    return response.json().then(data => {
        alert(`Hello, ${data.name}!`);
    });
}
```

</InvalidExample>

Async/await is [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) for Promises, so it should always be possible to avoid using .then/.catch/.finally.

To prevent making asynchronous operations difficult to spot, using await should be limited to simple statements such as one liners, assignments and if guards with a single condition.

### If guards

Using if guards is encouraged to reduce indentation levels. They should handle edge cases and leave the main indentation level for normal code.

More concretely, when an if block contains a non-conditional ending statement, it should not chain other blocks.

<ValidExample title="Good">

```ts
getPrivateInfo() {
    if (!this.isLoggedIn()) {
        throw new Error('Please, log in!');
    }

    return this.privateInfo;
}
```

</ValidExample>

<InvalidExample title="Bad">

```ts
getPrivateInfo() {
    if (!this.isLoggedIn()) {
        throw new Error('Please, log in!');
    } else {
        return this.privateInfo;
    }
}
```

</InvalidExample>

### Avoid abusing user-defined type guards

User-defined type guards are an advanced TypeScript feature that can be very useful for working in heavily typed applications. However, they can also be confusing for newcomers, so they should only be used when they are really necessary.

<ValidExample title="Good">

```ts
function hasSecret(user: User): user is { secret: string } {
    return 'secret' in user;
}

function getSecret(user: User) {
    if (!hasSecret(user)) {
        throw new Error("This user doesn't have a secret");
    }

    return user.secret;
}
```

</ValidExample>

An alternative to defining type guards is to use built-in operations to perform type checks. For example, the following code would also take advantage of TypeScript inference:

<ValidExample title="Good">

```ts
interface User {
    secret: string;
}

interface Post {
    title: string;
}

function getSecret(object: User | Post) {
    if ('secret' in object) {
        throw new Error("This object doesn't have a secret");
    }

    return object.secret;
}
```

</ValidExample>

In some situations, the only solution is to use type assertions. Although this approach is simpler to understand and more straightforward, it is dangerous because we lose inference checks:

<CodeExample type="warning" title="Allowed, but discouraged">

```ts
function hasSecret(user: User): boolean {
    return 'secret' in user;
}

function getSecret(user: User) {
    if (!hasSecret(user)) {
        throw new Error("This user doesn't have a secret");
    }

    const userWithSecret = user as { secret: string };

    return userWithSecret.secret;
}
```

</CodeExample>

### Spread operator

The spread operator is allowed, but it's recommended to include a comment explaining what it is doing to make the code easier to understand. You can also replace it for simpler alternatives.

<ValidExample title="Good">

```ts
const numbers = [4, 5, 6];
const properties = { surname: 'Doe' };

console.log([1, 2, 3].concat(numbers));
console.log(Object.assign({ name: 'Mary' }, properties));
console.log(Math.max.apply(Math, numbers));
```

</ValidExample>

<ValidExample title="Good">

```ts
const numbers = [4, 5, 6];
const properties = { surname: 'Doe' };

console.log([1, 2, 3, ...numbers]); // Concatenate numbers.
// Create a new object including all properties and a new one.
console.log({ name: 'Mary', ...properties });
console.log(Math.max(...numbers)); // Find max number in array.
```

</ValidExample>

### String interpolation

It is encouraged to use string interpolation using backticks if it makes the code more readable.

<ValidExample title="Good">

```ts
function greet(name: string) {
   alert(`Hello, ${name}!`);
}
```

</ValidExample>

<CodeExample type="warning" title="Allowed, but discouraged">

```ts
function greet(name: string) {
    alert('Hello, ' + name + '!');
}
```

</CodeExample>

### Avoid declaring variables using commas

In order to have cleaner diffs, it is not allowed to declare variables using commas. This also results in a better alignment of variable names, making the code more readable.

<ValidExample title="Good">

```ts
const foo = 'foo';
const bar = 'bar';
```

</ValidExample>

<InvalidExample title="Bad">

```ts
const foo = 'foo',
      bar = 'bar';
```

</InvalidExample>

### Avoiding having too many optional arguments

In some situations, functions end up having a lot of optional arguments and this results in unreadable code and a cumbersome developer experience (having to pass multiple null or undefined values).

When these situations arise, a good approach to solve it is using an options object instead.

As a rule of thumb, when a method has more than two optional arguments that are not required to be used together, use an options object (better naming can be used for each particular scenario).

<ValidExample title="Good">

```ts
interface HelloOptions {
    surname?: string;
    emphasis?: string;
    times?: number;
}

function sayHello(name: string, { surname, emphasis, times }: HelloOptions) {
    surname = surname ?? '';
    emphasis = emphasis ?? '!';
    times = times ?? 1;

    const fullname = `${name} ${surname}`.trim();

    for (let i = 0; i < times; i++) {
        console.log(`Hello ${fullname}${emphasis}`);
    }
}

sayHello('World', { times: 3 });
```

</ValidExample>

<InvalidExample title="Bad">

```ts
function sayHello(
    name: string,
    surname: string = '',
    emphasis: string = '!',
    times: number = 1,
) {
    const fullname = `${name} ${surname}`.trim();

    for (let i = 0; i < times; i++) {
        console.log(`Hello ${fullname}${emphasis}`);
    }
}

sayHello('World', undefined, undefined, 3);
```

</InvalidExample>

### Using declaration files

[Declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) can be very useful in TypeScript and it is encouraged to use them when appropriate. But it's not recommended to abuse them either, here's some situations when it may be a good idea to use them:

- Declaring types for external dependencies — Libraries that don't include their own declarations and are missing from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) (the packages you find under `@types/` in npm).
- Global declarations and extensions — Any variable you add to the window object can be declared by extending the `Window` interface. The same idea applies for extending external dependencies.
- Local declarations — Sometimes, it may be useful to create a dedicated declaration file when source files are growing too large. But this technique should not be used to substitute proper code organisation.

### Using constants

In order to optimize [Code Splitting](https://webpack.js.org/guides/code-splitting/), constants that are exported should be declared in [a constants file](../../../general/app/development/development-guide.md#constants-files):

<ValidExample title="Good">

```ts
// src/core/features/my-feature/constants.ts
export const MY_SERVICE_NAME = '...';

// src/core/features/my-feature/services/my-service.ts
import { MY_SERVICE_NAME } from '../constants';

export class MyService implements NamedService {

    name = MY_SERVICE_NAME;

}
```

</ValidExample>

<InvalidExample title="Bad">

```ts
// src/core/features/my-feature/services/my-service.ts
export class MyService implements NamedService {

    public static readonly MY_SERVICE_NAME = '...';

    name = MyService.MY_SERVICE_NAME;

}
```

</InvalidExample>

<InvalidExample title="Bad">

```ts
// src/core/features/my-feature/services/my-service.ts
export const MY_SERVICE_NAME = '...';

export class MyService implements NamedService {

    name = MY_SERVICE_NAME;

}
```

</InvalidExample>

In contrast, constants that are private or protected should be declared as static readonly class properties. Also, avoid calling them using `this.CONSTANT` form (given that they are static members):

<ValidExample title="Good">

```ts
export class MyService {

    protected static readonly MY_CONSTANT = '...';

    public someMethod(): void {
        alert(MyService.MY_CONSTANT);
    }

}
```

</ValidExample>

<InvalidExample title="Bad">

```ts
const MY_CONSTANT = '...';

export class MyService {

    public someMethod(): void {
        alert(MY_CONSTANT);
    }

}
```

</InvalidExample>

<InvalidExample title="Bad">

```ts
export class MyService {

    protected static readonly MY_CONSTANT = '...';

    public someMethod(): void {
        alert(this.MY_CONSTANT);
    }

}
```

</InvalidExample>

## Angular

### Avoid calling methods in templates

Method calls should be avoided in template rendering, including structural directives like `ngIf` or `ngFor`. The same applies to the new control flow syntax with `@if` or `@for`.

Angular templates can be rendered very often, and calling methods on every render could cause some unintended performance issues. For that reason, it is usually safer to rely on values rather than methods.

In some situations, a simple method that only returns a value would be acceptable, but it opens the door to become an issue if the method is refactored to do something more complicated. That's why it is discouraged to use methods altogether.

<ValidExample title="Good">

```html
@if (isAdmin) {
    <div> <!-- Show admin content --> </div>
}
```

</ValidExample>

<CodeExample type="warning" title="Allowed, but discouraged">

```html
@if (site.isAdmin()) {
    <div> <!-- Show admin content --> </div>
}
```

</CodeExample>

Of course, this doesn't mean that you can't use any methods on a template. Not every method used on a template is called in every render.

For example, using methods in event handlers is fine:

<ValidExample title="Good">

```html
<button (click)="login()">
    Login
</button>
```

</ValidExample>

#### A warning about using getters

Other frameworks have patterns to solve this problem, for example Vue has [Computed Properties](https://vuejs.org/guide/essentials/computed.html#computed-properties) and React has the [useMemo hook](https://reactjs.org/docs/hooks-reference.html#usememo).

However, Angular doesn't include a built-in pattern for these situations, so these properties should be managed as part of the logic for the component.

Be careful when using getters, which may give the wrong impression that a method is not being called:

<CodeExample type="warning" title="Allowed, but discouraged">

```html
get isAdmin(): boolean {
    return this.site.isAdmin();
}
```

</CodeExample>

Even if this looks like using a property in the template, it is still calling a method in every render.

### Maximise the number of attributes per line

There is a maximum line length of 140 characters for templates. Whenever that length is surpassed, the attributes should be distributed in multiple lines trying to reduce the number of total lines, instead of dedicating one line per attribute.

<ValidExample title="Good">

```html
@for (course of courses; track course.id) {
    <ion-item
        [title]="course.title"
        [class.selected]="isSelected(course)" class="ion-text-wrap"
        button detail="true"
        (click)="selectCourse(course)">
        <ion-label>
            {{ course.title }}
        </ion-label>
    </ion-item>
}
```

</ValidExample>

<InvalidExample title="Bad">

```html
@for (course of courses; track course.id) {
    <ion-item
        [title]="course.title"
        [class.selected]="isSelected(course)"
        class="ion-text-wrap"
        button
        detail="true"
        (click)="selectCourse(course)">
        <ion-label>
            {{ course.title }}
        </ion-label>
    </ion-item>
}
```

</InvalidExample>

:::info
If you are using VSCode, this should be done automatically on every save with the [configuration that ships with the app](https://github.com/moodlehq/moodleapp/blob/latest/.vscode/settings.json#L8).
:::

### Avoid default exports

Using default exports should be avoided for Angular applications because they [cause issues with AOT compiler](https://stackoverflow.com/questions/45962317/why-isnt-export-default-recommended-in-angular). Technically only components have this problem, but in order to avoid the mental load of thinking about this every time, we disallow it altogether.

<ValidExample title="Good">

```ts
@Component({
    selector: 'my-component',
    templateUrl: 'my-component.html',
})
export class MyComponent {}
```

</ValidExample>

<InvalidExample title="Bad">

```ts
@Component({
    selector: 'my-component',
    templateUrl: 'my-component.html',
})
export default class MyComponent {}
```

</InvalidExample>

### Declaring page modules

When creating a page component, it should be declared in the feature's [lazy modules](../../../general/app/development/development-guide.md#routing). Exceptionally, pages that are used by more than one module can create a page module; but this module should only declare components, it shouldn't include any routing functionality.

<ValidExample title="Good">

```ts
// file: core/features/feature/pages/index/index.ts
@Component({
    selector: 'page-core-feature-index',
    templateUrl: 'index.html',
})
export class CoreFeatureIndexPageComponent {}
```

```ts
// file: core/features/feature/feature-lazy.module.ts
const routes: Routes = [
    {
        path: 'feature',
        component: CoreFeatureIndexPageComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CoreSharedModule,
    ],
    declarations: [
        CoreFeatureIndexPageComponent,
    ],
})
export class CoreFeatureLazyModule {}
```

</ValidExample>

<CodeExample type="warning" title="Allowed only if the page is used in multiple modules">

```ts
// file: core/features/feature/pages/index/index.page.ts
@Component({
    selector: 'page-core-feature-index',
    templateUrl: 'index.html',
})
export class CoreFeatureIndexPageComponent {}
```

```ts
// file: core/features/feature/pages/index/index.module.ts
@NgModule({
    imports: [
        CoreSharedModule,
    ],
    declarations: [
        CoreFeatureIndexPageComponent,
    ],
})
export class CoreFeatureIndexPageModule {}
```

</CodeExample>

<InvalidExample title="Bad">

```ts
// file: core/features/feature/pages/index/index.page.ts
@Component({
    selector: 'page-core-feature-index',
    templateUrl: 'index.html',
})
export class CoreFeatureIndexPageComponent {}
```

```ts
// file: core/features/feature/pages/index/index.module.ts
const routes: Routes = [
    {
        path: '',
        component: CoreFeatureIndexPageComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CoreSharedModule,
    ],
    declarations: [
        CoreFeatureIndexPageComponent,
    ],
})
export class CoreFeatureIndexPageModule {}
```

</InvalidExample>
