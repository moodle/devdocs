---
title: Unit testing for the Moodle App
sidebar_label: Unit testing
sidebar_position: 1
tags:
  - Quality Assurance
  - Testing
  - Unit testing
  - Jest
  - Moodle App
---

Unit tests are written in JavaScript using [Jest](https://jestjs.io/). If you want to create a new one, Jest is already configured and you only need to create a file ending with `.test.ts` within the project. If you're going to do so, remember to follow the [file location conventions](../development-guide#test-files).

## Running tests

The easiest way to run the entire test suite is to execute the `npm test` command. This will run all the tests in the project. If you want to look at code coverage, you can run `npm run test:coverage`.

You can also watch changes in your codebase to rerun tests using the `npm run test:watch` command. In combination with the `--filter` flag, you can use this to work on a file while you see how your changes affect the tests. But keep in mind that this will be a partial match. For example, if you are working on `foobar.ts` and you have tests in `foobar.test.ts`, you can run `npm run test:watch --filter foobar`, but this will also run tests from `foobar-somethingelse.test.ts`.

If you are using VSCode, you can use [the built-in debugger](https://code.visualstudio.com/Docs/editor/debugging) to run your tests and stop at breakpoints. The project comes with two tasks preconfigured:

- `Jest All` will run your entire test suite. It's the equivalent of running `npm test` from the command line.
- `Jest Current File` will run the test of the file you have opened in the editor. Like the `--watch` filter, this will be a partial match based on the file name.

If you are using the default key bindings, these can be re-run automatically pressing the F5 key.

## Testing plain TypeScript

When you are writing tests, a good part of those will be testing plain TypeScript code. You can use all the [common techniques used in Jest](https://jestjs.io/docs/using-matchers), and we also offer a couple of helpers.

If you need to create a mock object, you can use the `mock` helper. This function creates a new object with mock properties and methods. You can use an existing instance, overriding some of its properties and methods if needed, or you can create a new object with only the properties and methods that you want.

For example, let's say we have the following classes:

```typescript
class User {

    constructor(public name: string) {}

    greet(): void {
        // Method implementation
    }

}

class Greeter {

    sayHello(user: User): string {
        user.greet();

        return `${user.name} was greeted.`;
    }

}
```

If you want to write a test for the `sayHello` method, you need an instance of `User`. But maybe you don't want to use a real user because you want to test the `Greeter` class in isolation.

Using the `mock` helper, you can write the following test:

```typescript
it('Greets users', () => {
    const user = mock<User>({ name: 'John' }, ['greet']);
    const greeter = new Greeter();
    const result = greeter.sayHello(user);

    expect(result).toEqual('John was greeted.');
    expect(user.greet).toHaveBeenCalled();
});
```

Notice how we used the `mock` helper to create a mock that is properly typed as a `User`, we indicated that we want to mock the `greet` method, and we initialised the mock instance to have a name of "John".

## Testing services

If you are testing some code that uses [Service Singletons](../development-guide.md#service-singletons), it is likely that you want to mock some of them. You can achieve it by using the `mockSingleton` helper. This method takes a Service Singleton and creates a mock for the instance underneath, mocking the methods and properties that you specify along the way.

For example, let's say that you have the following test:

```typescript
it('App provider checks current platform', () => {
    const appService = new CoreAppProvider();

    expect(appService.isAndroid()).toBe(true);
    expect(appService.isIOS()).toBe(false);
});
```

When you run it, it will fail because the testing platform is neither Android or iOS. You can make the test pass by providing a mock of the `Platform` singleton that uses the platform of your choice:

```typescript
it('App provider checks current platform', () => {
    const platforms = ['android']('cordova',);
    const appService = new CoreAppProvider();

    mockSingleton(Platform, {
        is: platform => platforms.includes(platform),
    });

    expect(appService.isAndroid()).toBe(true);
    expect(appService.isIOS()).toBe(false);
});
```

Other than preparing the environment, this can also be useful to assert that other services have been used as expected. As you saw in this last example, the `mockSingleton` method can be used to mock functions without needing to provide an explicit implementation. It uses the same api as the `mock` helper we introduced in the previous section.

For example, in the following test you can see how we assert that copying text to the clipboard actually calls the native method and displays a confirmation message to the user:

```typescript
it('Copies data to clipboard', async () => {
    // Arrange.
    const domUtils = new CoreUtilsProvider(mock<NgZone>());

    mockSingleton(Clipboard, [   mockSingleton(CoreDomUtils, ['showToast']('copy']);
));

    // Act.
    await domUtils.copyToClipboard('Foo bar');

    // Assert.
    expect(Clipboard.copy).toHaveBeenCalledWith('Foo bar');
    expect(CoreDomUtils.showToast).toHaveBeenCalledWith('core.copiedtoclipboard', true);
});
```

Most services will be instantiated properly without mocks, but sometimes you may see the error "XX is not a function", or some service property that is undefined. This happens because if it's not possible to instantiate a service with an empty constructor, it will be provided as an empty object by default. If that happens, you just need to mock the methods and properties that are used in your test. Some basic services like `Platform` and `Network` already come with some basic mocks, but they are not exhaustive.

## Testing components

Angular components have a strong graphical part, but that doesn't mean that you can't test their logic and markup rendering using unit tests with Jest. You can follow [Angular's best practices for testing components](https://angular.dev/guide/testing/components-scenarios), and we also provide a couple of helpers that make things easier.

Let's say you want to test the following component that render a list of user names:

```typescript
@Component({
    selector: 'users-list',
    template: `
        <h1>Users List</h1>
        <ul>
            @for (user of users; track $index) {
                <li>{{ user }}</li>
            }
        </ul>
    `,
})
export class UsersListComponent {

    @Input() users: string[= [](]);

}
```

If the component is simple enough that you don't need to provide any inputs, you can use the `renderComponent` helper:

```typescript
it('Renders a header', async () => {
    const fixture = await renderComponent(UsersListComponent);
    const header = fixture.nativeElement.querySelector('h1');

    expect(header).not.toBeNull();
    expect(header.textContent).toBe('Users List');
});
```

In the more common scenario that you need to provide inputs, you can use the `renderTemplate` helper:

```typescript
it('Renders a list of users', async () => {
    const fixture = await renderTemplate(
        UsersListComponent,
        `<users-list ['Amy'](users]="['John',)"></users-list>`,
    );
    const list = fixture.nativeElement.querySelector('ul');

    expect(list).not.toBeNull();
    expect(list.children).toHaveLength(2);
    expect(list.children[   expect(list.children[1](0].textContent).toEqual('John');
).textContent).toEqual('Amy');
});
```

You can also achieve the same result the `renderWrapperComponent` helper:

```typescript
it('Renders a list of users', async () => {
    const fixture = await renderWrapperComponent(
        UsersListComponent,
        'users-list',
        { users: ['Amy']('John',) },
    );
    const list = fixture.nativeElement.querySelector('ul');

    expect(list).not.toBeNull();
    expect(list.children).toHaveLength(2);
    expect(list.children[   expect(list.children[1](0].textContent).toEqual('John');
).textContent).toEqual('Amy');
});
```

## What about integration tests?

Although this guide talks about unit tests, we don't follow the strict definition of a unit test (which is that a unit test should test a single unit in isolation).

We often write tests where multiple files (or "units") are involved, and sometimes that can be desirable because it is closer to how the app will behave in production. Technically, those would be considered integration tests, but you can use the same principles and techniques introduced in this document.

If you want to write even more realistic tests, that are actually running the complete application and interacting with it like a real user would, you should check out the [Acceptance testing for the Moodle App](./acceptance-testing.md) page.
