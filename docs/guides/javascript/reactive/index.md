---
title: Creating a reactive UI
tags:
  - JavaScript
  - Library
  - Frontend
---

<!-- cspell:ignore statemanager -->
<!-- cspell:ignore METHODNAME -->
<!-- cspell:ignore DATAID -->

<Since versions={[ 4.0 ]} />

Third-party plugin developers are free to use any framework they want to implement reactive interfaces like React, Angular or Vue. However, for now Moodle does not provide any of them and all core developments are framework independent.

Nevertheless, in terms of reusability, maintainability and user experience the advantages of having a reactive UI are undeniable. For this reason Moodle has an adhoc reactive library that can be used to implement small reactive applications on any Moodle page.

:::tip Example module: moodle-mod_nosferatu

GitHub repository: [moodle-mod_nosferatu](https://github.com/ferranrecio/moodle-mod_nosferatu/)

This repository provides a step-by-step tutorial for developers, covering starter, beginner, and intermediate levels. It includes helpful comments, hints, and best practices to aid in development.

:::

## Reactive pattern highlights

To understand the advantages (and disadvantages) of a reactive User Interface (UI) there are a few major points you must understand about reactivity:

- All the reactive UI logic is divided by **components** and all components are implemented in the same way (extending a `BaseComponent` class) so they can be as reusable and maintainable as possible.
- The UI must be a representation of a data structure called **state** and this representation must be updated every time that state changes. A state change is called state **mutation**.
- **User interaction never changes the UI**. Any interaction can mutate the state data but never alter the HTML structure. Only state mutations can alert components to do a UI change.
- The same happens with web services. Except for loading new UI components/templates, all web services must be designed to mutate the current state data, not the interface.

<details>
  <summary>View extra explanation on how the reactive pattern works</summary>
  <div>

One of the principles of the reactive pattern is that the HTML must always represent the current state data.

**Super Mario video game example**

Imagine there are at least two **components** on the same screen:

- **Mario**: the main character
- **Counter**: the lives counter

When the Mario **component** collides with an enemy triggers the "enemyHit" **state mutation** but it won't handle the number of life itself. The responsibility for deciding if Mario loses a life or not is in the "enemyHit" mutation which, depending on whether Mario has eaten a mushroom or not, will decide to alter the **state data** in a particular way (losing a life or making it small).

The other **component**, the lives Counter, just defines a **state watcher** method to listen to the "lives" integer in the state. Every time any mutation alters that value it will increase the displayed number because it can trust the state data. This is called the **Unique Source of Truth**. No matter if the lives change because of a "enemyHit" or an "extraLifeHit" mutation, the Counter will only trust the current state "lives" value, not the reason of the change.

Imagine now that we don't use a reactive pattern and watcher methods. Whenever the lives integer changes we need to refresh the life counter HTML manually in every involved event (the enemy hit, the extra life hit, falling into the void...). If this happens:

- If at some point we want to add a new event related to lives number (for example losing a life when level time limit is reached) we need to remember including the lives Counter refresh on that event too.
- The situation is even worse if we add a new component related to the lives number (for example a Luigi that helps the player if it is in the last life). In that case the Luigi's refresh must be added to all events one by one.
- Because the UI changes are not really driven by state mutations events but for hardcoded calls, any UI update exception will block the rest of the updates. This means that the state data will no longer be represented by the UI unless we add try-catch blocks all over the code.

Even encapsulating the logic in a few methods the complexity will increase exponentially with every new UI **component** and **mutation**.

  </div>
</details>

## The basic classes

Reactive interfaces can be used in many ways, but all of them are supported by 4 main elements.

![Basic reactive classes diagram](./_files/basic_classes.svg)

<Tabs>
  <TabItem value="components" label="Components" default>

> All reactive UI is divided into components. Each component takes care of a specific DOM element (and its children).
>
> Its basic responsibilities are:
>
> - Once created it must register itself into a reactive instance (a kind of a controller).
> - Watch a data structure called **state**. Every time that structure changes the component must guarantee its main DOM element represents the updated state.
> - Captures user interactions inside its main DOM element. If the user interaction requires some changes in the state, the component cannot change the state but can ask for its reactive instance. That is called **dispatch a mutation**.
>
> Apart, a component can also:
>
> - Delegate some of the logic to subcomponents.
> - Destroy themselves when they are not needed
> - Lock the element if the user cannot interact with temporally

  </TabItem>
  <TabItem value="reactive" label="Reactive instance">

> The reactive instance is a kind of controller. It registers every other piece in the reactive app and centralizes almost all interactions between them. All components from the same reactive application share the same reactive instance.
>
> Its basic responsibilities are:
>
> - Keep a list of all registered components.
> - Trigger component watchers when specific parts of the state changes
> - Give components read-only access to the state data
> - Dispatch mutations on the state. To do so it uses a Mutation object (a library with all available mutations) and a State Manager (the object responsible for storing the state and allow writing).

  </TabItem>
  <TabItem value="statemanager" label="State Manager">

> Components can access the state data but they cannot interact with the state manager. Only the Reactive instance and the mutations can interact with the state manager.
>
> Its basic responsibilities are:
>
> - Protect the state data from being modified by the components
> - Allow state modifications when a mutation requires it
> - Trigger JS events when the state data changes (those events are captured by the Reactive instance).

  </TabItem>
  <TabItem value="mutations" label="Mutation Library">

> The mutations object is a library containing all the available state modifications the application has. Components cannot access the mutation library directly but they can dispatch a mutation via their Reactive instance (using the dispatch method).
>
> Its basic responsibilities are:
>
> - Alter the state data when a component asks for it to the Reactive instance. To do so it needs to set the state writable using the State Manager.
> - Keep the state data consistent.
> - Centralizes and synchronizes all state changes with the backend. This means that, in general, all backend operations must be called inside mutations. Components can render mustache files, get strings, load HTML fragments, or other read-only web services, but they should never call for write web services themselves.

  </TabItem>
</Tabs>

## Parts of a component

_React Components_ represent most of the work on building a reactive UI. In general, the _Reactive Instance_ and the _State Manager_ can be used as they are provided, and Mutations contain only the interactions with the server and the state. The React Components are where all the UI logic is implemented.

Components can do many things but, in general, they are not hard to implement because they are always structured in the same way and the BaseComponent class does all the hard part for us. There are only a few scenarios where a reactive component can be more complicated than a traditional JS undefined pattern code and, even in those cases, the maintainability is much better.

Let's take a look at the component anatomy.

### Extending the BaseComponent class

All reactive UIs are object-oriented and all components extend the BaseComponent class. This means that the default component structure is very simple. For example:

<details>
  <summary>View example</summary>
  <div>

```js title="path/to/plugin/amd/src/yourcomponent.js"
import {BaseComponent} from 'core/reactive';

export default class extends BaseComponent {
(...)
}
```

  </div>
</details>

### Instantiate a Component

Any component belongs to one DOM element and is registered in a Reactive Instance. This means that to create a new instance we need to provide at least those two elements. For example:

<Tabs>
  <TabItem value="init-js-module" label="AMD module" default>

```js title="path/to/plugin/amd/src/main.js"
import {reactiveInstance} from 'YOUR_PLUGIN/reactive';
import YourComponent from 'YOUR_PLUGIN/yourcomponent;

(...)

export const init = (domElementId) => {
    return new YourComponent({
        element: document.getElementById(domElementId),
        reactive: reactiveInstance,
        (... other data your component needs ...)
    });
}
```

  </TabItem>
  <TabItem value="init-php-module" label="PHP code">

```php title="path/to/plugin/amd/src/index.php"
(...)

$PAGE->requires->js_call_amd('YOUR_PLUGIN/main', 'init', [$domelementid]);
```

  </TabItem>
</Tabs>

In case no Reactive Instance is passed, the BaseComponent will try to inherit the instance from a parent DOM element. This way subcomponents can omit that param.

### Initialize a component from a mustache template

Components are easy to embed in mustache files. To do so your class must have a static "init" method that could be called inside the `{{#js}}`.

<Tabs>
  <TabItem value="component-view" label="Component class" default>

```js title="path/to/plugin/amd/src/childcomponent.js"
import {BaseComponent} from 'core/reactive';
import {reactiveInstance} from 'YOUR_PLUGIN/reactive';

export default class extends BaseComponent {
    static init(target, selectors) {
        return new this({
            element: document.getElementById(target),
            reactive: reactiveInstance,
            selectors,
        });
    }
    // (...)
}
```

  </TabItem>
  <TabItem value="mustache-view" label="Mustache file">

```handlebars title="path/to/plugin/templates/yourthing/childcomponent.mustache"
<div id="{{uniqid}}-your-plugin-{{id}}"> (...) </div>
{{#js}}
require(['YOUR_PLUGIN/local/yourthing/childcomponent'], function(component) {
    component.init('{{uniqid}}-your-plugin-{{id}}');
});
{{/js}}
```

:::tip Generating unique id attributes

You can use the `{{uniqid}}` Mustache helper within your code to help you generate a unique id for your HTML attributes and target them in your React component.

Please note that the `{{uniqid}}` helper generates a single value each time it is rendered, and you will need to combine it with other data to create a truly unique value. In this example the name of the plugin, and a static element `id` is used to generate a unique value.

:::

  </TabItem>
</Tabs>

:::info

The init method has an id as a first param to find the main DOM Element, but it also has a second one called `selectors`. This second param is an optional (but recommended) param any component can use. We will see how to use the selectors later but they are CSS selectors to find inner DOM elements in the main element. Bypassing as an init-param, any mustache can customize the default CSS selectors, which means the component is more reusable.

:::

### The Component lifecycle hooks

All components are registered in a Reactive Instance and, when this is done, the Component can start watching the state and ask for state mutations. However, during its life, a Component can operate differently if necessary.

To understand how a component works you need to understand the component lifecycle and its hook methods:

![Component lifecycle hooks](./_files/lifecycle_hooks.svg)

<Tabs>
  <TabItem value="create" label="create" default>

**Called**: Before the component is registered to the Reactive Instance.

This method is used to define the main component attributes. The Component cannot interact with the Reactive Instance yet as instantiation has not yet completed.

#### The `create(descriptor)` hook

The `BaseComponent` construct method will register the component in the Reactive Instance after some validations. It is quite common for components to have private attributes needed for the UI logic. Components can set their own attributes in the `create` hook method.

The method will receive an object called `descriptor` which contains the data structure passed to the constructor. This method can define its own CSS selectors, classes, or any other constant needed, so defining it as the first method in the class is a good practice.

<details>
  <summary>View example</summary>
  <div>

The typical create method looks like:

```js
create(descriptor) {
    // An optional component name for debugging.
    this.name = 'courseindex_cm';

    // Those are the component CSS selectors, in uppercase
    // are used as constants.
    this.selectors = {
        EXAMPLESELECTOR: `[data-for='example']`,
    };

    // If the component manage CSS classes, the constants should
    // be defined the same way as the selectors.
    this.classes = {
        HIDDEN: 'dimmed',
    };

    // The main HTML element is stored in "this.element" as well
    // in "descriptor.element".
    this.id = this.element.dataset.id;

    (... any other data extracted from the "descriptor"...)
}
```

  </div>
</details>

:::note

When create is called the component has an `element` attribute because it should read data from the main element but it does not have a `this.reactive` attribute because the component can be registered before having a fully functional Reactive Instance. Any initialization that requires a reactive instance or a state should be done in later hooks like stateReady or getWatchers.

:::

  </TabItem>
  <TabItem value="getWatchers" label="getWatchers">

**Called**: when the Reactive Instance is registering the component.

At the moment the Reactive Instance is registering the component and asking it what parts of the state it is watching. This method returns a list of state changes the component is watching and the methods that will handle those changes, something like an event listener for state changes.

#### The `getWatchers(): array` hook

At this moment the component can specify which state changes are watching and what methods will use to listen to those changes.

The method should return an array of objects containing, with each object containing:

- watch: the state changes to watch. For example `user.username:update`
- handler: the class method to handle the state change event. For example `this._refreshUsername`.

<details>
  <summary>View examples</summary>
  <div>

This is a real example of getWatchers from a course index module:

```js
getWatchers() {
    return [
        {watch: `cm:created`, handler: this._createCm},
        {watch: `cm:deleted`, handler: this._deleteCm},
        {watch: `section:created`, handler: this._createSection},
        {watch: `section:deleted`, handler: this._deleteSection},
    ];
}
```

In case the component only watches changes in a specific element of a state collection, the function could be something like.

```js
getWatchers() {
    // The this.element is the component's main DOM element passed as a param in the construct method.
    const id = this.element.dataset.id;
    return [
        {watch: `cm[${id}]:created`, handler: this._createCm},
        {watch: `cm[${id}]:deleted`, handler: this._deleteCm},
        {watch: `section[${id}]:created`, handler: this._createSection},
        {watch: `section[${id}]:deleted`, handler: this._deleteSection},
    ];
}
```

  </div>
</details>

:::note

No need to manually `bind` or use the `call` function!

All the components code is designed to maintain the `this` value constant. This means that handlers don't need any kind of bind because the Reactive Instance will do it before registering the component. The same happens with event listeners.

:::

See the [Implement state watchers](#implementing-state-watchers) section for more information.

  </TabItem>
  <TabItem value="stateReady" label="stateReady">

**Called**: when the state data is initially loaded.

When the reactive instance has the initial state loaded. Is important to note that this method will be called even if the component is registered after the initial state is loaded. For all purposes, this method is the equivalent of a page ready for components.

#### The `stateReady(state)` hook

This is one of the most important hooks in the Component lifecycle. At this moment the component will get its state and it can ensure that the Reactive Instance is ready and its watchers are working.

Even if the component is registered once the initial state is loaded, the Reactive Instance will trigger that method when the Component is fully registered and the page is ready. For all purposes, this method is the equivalent of a page-ready event for components.

The typical actions for a stateReady are:
Add event listeners to capture user interactions.
Refresh parts of the main element using the state data.
Delegate logic to subcomponents.

The [BaseComponent helpers](#basecomponent-helpers) section will discuss this in more detail.

  </TabItem>
  <TabItem value="destroy" label="destroy">

**Called**: before the component is unregistered.

After this method is called the Component will no longer watch the state or capture the user interactions, even if the component's main DOM element is still present on the page.

#### The `destroy()` hook

This hook will be executed when the component is unregistered from the Reactive Instance or removed from the page (which will also unregister it). This method is used to clean some dependencies. In general, this method is used to propagate the unregister to the subcomponents when some logic is delegated.

<details>
  <summary>View example</summary>
  <div>

In the example the component has some drag&drop logic that uses the reactive `DragDrop` module, the drag-drop subcomponent should be removed and initialized in the `stateReady` method and unregistered in the `destroy` one.

```js
import {BaseComponent, DragDrop} from 'core/reactive';

(...)

stateReady(state) {
    (...)
    this.dragdrop = new DragDrop(this);
}

destroy() {
    this.dragdrop.unregister();
}
```

  </div>
</details>

  </TabItem>
</Tabs>

### Implementing state watchers

Reacting to state data changes is the main way in which components can refresh the interface. The major reactive framework uses complex black-boxing to encapsulate most of the watchers and templates logic. This is why the general feeling is that they magically work. In our case, we use mustache as the main template library, meaning no dynamic refresh is available. Instead, `core/reactive` components watch low-level state events, which are faster, but less magical.

To facilitate the examples, all of them will suppose the following state data:

<details>
  <summary>View example state data</summary>
  <div>

```js
{
    "activity": {"name": "Something", "id": 42},
    "students": [
       {"id": 1, "username": "Jane Doe", "attempts": 3},
       {"id": 2, "username": "John Doe", "attempts": 1},
    ],
}
```

  </div>
</details>

#### State event names

Components can subscribe to as many state events as needed. All events are identified by a string with the following formats:

- `Element:Action` (example: "students:updated")
- `Element.Attribute:Action` (example: "students.attempts:deleted")
- `SetName[ID]:Action` (example: "students[3]:created")
- `SetName[ID].attribute:Action` (example: "students[3].attempts:updated")

The same state change will dispatch more than one event, from more generic to more specific.

In case a mutation alters more than one state value all changes will be stacked in the same transaction. However, they will be sorted this order: **creations, updates and finally deletes**.

This order is important because creations may require rendering new components while update and delete require an already created element.

:::note

The best way to identify which events a mutation will produce is using the state events log in the **reactive debug tools**. To show the reactive debug tools the Debug messages should be set to DEVELOPER. Once done the reactive debug options will appear at any footer.

:::

<Tabs>
  <TabItem value="watcher_example1" label="Example 1" default>

> A mutation that does:
>
> ```js
> state.activity.name = ‘New name’;
> ```
>
> Will trigger:
>
> ```
> transaction:start
> activity.name:updated
> activity:updated
> state:updated
> transaction:end
> ```

  </TabItem>
  <TabItem value="watcher_example23" label="Example 2">

> A mutation that does:
>
> ```js
> students[2].attempts = 2;
> ```
>
> Will trigger:
>
> ```
> transaction:start
> students.attempts:updated
> students[2].attempts:updated
> students[2]:updated
> students:updated
> state:updated
> transaction:end
> ```

  </TabItem>
  <TabItem value="watcher_example3" label="Example 3">

> A mutation that does:
>
> ```js
> students[2].attempts = 2;
> delete students[1];
> ```
>
> Will trigger:
>
> ```
> transaction:start
> students.attempts:updated
> students[2].attempts:updated
> students[2]:updated
> students:updated
> state:updated
> students[1]:deleted
> students:deleted
> state:updated
> transaction:end
> ```

  </TabItem>
</Tabs>

:::note

The `state:updated` change is triggered by every state change. That is because each state change affects a specific state object that will be passed to the handler.

:::

#### State event handlers

When the event is detected the Reactive Instance will collect all the event details in a data structure and will send it to the handlers. Except for the `transaction:start` and `transaction:end` that data structure will contain always the following objects:

- `Action`: the action name
- `State`: the full state data
- `Element`: the affected state element

<details>
  <summary>View update user attemps example</summary>
  <div>

```js
import {BaseComponent} from 'core/reactive';
import {reactiveInstance} from 'YOUR_PLUGIN/reactive';

export default class extends BaseComponent {

    create() {
        this.selectors = {
            ATTEMPTS: `[data-for="attempts"]`,
        };
    }

    getWatchers() {
        return [
            {watch: `students.attempts:updated`, handler: this._refreshStudent},
        ];
    }

    // In this case we only want the affected element.
    _refreshStudent({element}) {
        const element = this.getElement(this.selectors.ATTEMPTS, element.id);
        element.innerHTML = element.attempts;
    }

}
```

  </div>
</details>

### Adding event listeners

Most components will listen to events on their inner elements like buttons, inputs, draggable… To prevent each component from reinventing the wheel, there are some good practices every component should follow.

1. All element selectors should be declared in the "create" hook as part of the "this.selectors" attribute. This way selectors can be overridden on the mustache file if necessary.
2. Unless there's a good reason for it, all event listeners should be added in the "stateReady" hook. That is the first moment where the code can guarantee there's valid state data, the "this.reactive" is correct and the "this.element" is ready.
3. To add event listeners components should use the "this.addEventListener" method instead of element one. This way the Reactive Instance can remove all listeners of a component when it is unregistered (see the [BaseComponent helpers](#basecomponent-helpers) section for more information).

<details>
  <summary>View adding a listener to a button example</summary>
  <div>

```js
import {BaseComponent} from 'core/reactive';
import {reactiveInstance} from 'YOUR_PLUGIN/reactive';

export default class extends BaseComponent {
    create() {
        // Declare selector in the create hook.
        this.selectors = {
            SUBMITBTN: `[data-for="submitattempt"]`,
        };
    }

    stateReady() {
        // Add a click listener to the submit button.
        this.addEventListener(
            this.getElement(this.selectors.SUBMITBTN),
            'click',
            this._submitAttempt
        );

    }

    _submitAttempt(event) {
        Const userid = event.target.dataset.id;
        (...)
        // In the next section this method will dispatch a state mutation.
    }
}
```

  </div>
</details>

### Dispatching mutations from a component

Components cannot alter the state themselves (it will raise an exception if they try). Instead, they can ask the Reactive Instance to execute a state mutation. For components mutations are just a bunch of async commands the Reactive Instance can execute to alter the state. The section Start a new reactive application will cover how to implement state mutations but for now considering them a BlackBox is enough.

All reactive instances have a `dispatch` method to trigger a mutation. The component can dispatch any mutation doing:

```js
this.reactive.dispatch(MUTATIONNAME, [param1, param2...]);
```

The only mandatory parameter to dispatch a mutation is the mutation name. The mutation name is the method name inside the mutation library. Let's see an example.

<details>
  <summary>View example</summary>
  <div>

Calling a mutation called `submitAttemps` from the previous example. The `submitAttempts` get the user as a param.

```js
import {BaseComponent} from 'core/reactive';
import {reactiveInstance} from 'YOUR_PLUGIN/reactive';

export default class extends BaseComponent {
    create() {
        this.selectors = {
            ATTEMPTS: `[data-for="attempts"]`,
            SUBMITBTN: `[data-for="submitattempt"]`,
        };
    }

    // Add a click listener to the submit button.
    stateReady() {
        this.addEventListener(
            this.getElement(this.selectors.SUBMITBTN),
            'click',
            this._submitAttempt
        );

    }

    getWatchers() {
        return [
            {watch: `students.attempts:updated`, handler: this._refreshStudent},
        ];
    }

    _refreshStudent({element}) {
        const element = this.getElement(this.selectors.ATTEMPTS, element.id);
        element.innerHTML = element.attempts;
    }

    _submitAttempt(event) {
        Const userid = event.target.dataset.id;
        this.reactive.dispatch(‘submitAttempt’, userid);
    }
}
```

  </div>
</details>

Because the component already reacts to the state change `students.attempts:updated` the button just dispatches the mutation without changing the interface. Who dispatches the mutation does not matter because all watchers will be alerted when this happens. Even later, when more buttons dispatch the same mutation everything will work perfectly if components are well designed. That is where the reactivity pattern shines the most.

### Component custom events

Because all components are built more or less the same way, making them reusable is easy. With the proper selectors, any component can use another component logic for part of its interface.

Some components can be designed to work as a subcomponent of another component. There are several ways in which a child component can communicate with the parent one, but the most standard one is by using custom events.

If we want to implement reusable components with custom events it is important to follow the following best practices:

1. If a component uses custom events, the event names should have a static method "getEvents" to get them (there's an example below). Also, that method should be the first method of the class, just before the "create" hook. This way all the important definition methods would be easier to discover. The method should be static because the event's name should be always accessible.
2. In case the custom event is using one of the custom events from the plugin's events.js, the static getEvents method should also return it.
3. Unless the component uses an alternative method to dispatch events (for example one from the specific plugin events.js), it is recommended to use the convenience method "this.dispatchEvent" to trigger a custom event.
4. Inside the component, custom events can be accessed via "this.events" attribute.

<details>
  <summary>View example</summary>
  <div>

A component dispatching a custom event.

```js
import {BaseComponent} from 'core/reactive';
import {debounce} from 'core/utils';

export default class extends BaseComponent {
    static getEvents() {
        return {
            renamed: 'plugin_renamevalue:changed',
        };
    }

    create() {
        this.selectors = {
            INPUT: `input`,
        };
    }

    stateReady() {
        const input = this.getElement(this.selectors.INPUT);
        const debounceddispatch = debounce(() => {
            this.dispatchEvent(
                this.events.renamed,
                {component: this},
            );
        }, 250);
        this.addEventListener(input, 'keyup', debounceddispatch);
    }
}
```

  </div>
</details>

### BaseComponent helpers

The BaseComponent class offers some helpers to standardize the components' code and make them more maintainable.

#### Add event listeners

Reactive components are that they can be registered and unregistered (or even removed) at any moment. This implies that the Reactive Instance should have a way of unregister a component, invalidating all the event listeners and the state watchers.

As explained in the getWatchers hook, watchers have an implicit "bind(this)" to ensure all components have a "this" constant in all the methods. The same happens to event listeners. The BaseComponent class has specific methods to add and remove event listeners easily:

- `this.addEventListener(ELEMENT, EVENTNAME, this.METHODNAME)`
- `this.removeEventListener(ELEMENT, EVENTNAME, this.METHODNAME)`
- `this.removeAllEventListeners()`
- `this.dispatchEvent(EVENTNAME, DETAIL)`

Using those methods your code will be much clear because:

1. Having the "this" value is constant, you don't need to worry about binding all the events and watchers all the time.
2. The method code is more reusable as it could be used as an internal function, as an event listener, or as a watcher.
3. The BaseComponent registers all listeners in a way that you can use this.removeEventListener or this.removeAllEventListeners to disable listeners just by passing the regular "this.METHODNAME".

#### Get DOM elements

Each component takes care of the main DOM element and its children. This means all the DOM queries a component uses should be inside the main DOM element but not in all the document.

There are two ways of accessing the components main DOM element:

- `this.element`
- `this.getElement(): HTMLElement`

When you need to find an inner element inside the main element you should use:

- `this.getElement(QUERY [, DATAID]): HTMLElement|undefined`
- `this.getElements(QUERY [, DATAID]): NodeList|undefined`

As you may guess, getElement returns a single element while getElements return a node list. Let's take a look at the method params:

- **QUERY**: this is a CSS query selector. In general, should be one of the constants of `this.selectors` defined in the create method.
- **DATAID**: this is an optional param. If this param is passed the method will automatically add `[data-id='${dataid}']` to the query. This is a convenience param to force all components to follow the best practices like using data attributes for the logic instead of classes or other CSS reserved values.

#### Unregister and remove

There are two ways in which a component can be invalidated:

- `this.unregister()`: will unregister the component, disabling all watchers and event listeners. However, the component's main DOM element won't be altered in any way.
- `this.remove()`: will unregister the component but also remove the component's main DOM element.

Both methods will execute the `destroy` hook.

#### Lock or unlock a component interface

Sometimes a component may be waiting for some mutations to be executed. Usually, we don't want user interactions while this is happening. To prevent this from happening the `BaseCompoment` has a boolean attribute `locked` to lock/unlock the component's main DOM element. A locked component will stop listening to user interactions like clicks, selections or drag&drop.

```js
this.locked = true; // Locks the component
this.locked = false; // Unlocks the component.
```

However, it is also possible to only lock or unlock internal elements. To do so BaseComponent has two methods:

- `setElementLocked(ELEMENT, bool)`: the first param is the HTML element to lock/unlock
- `getElementLocked(ELEMENT)`: returns the current locked value of the element.

:::note

Locking or unlocking an element won't add any style to the element. The component should add any CSS classes necessary to make this locking visual.

:::

#### Render a subcomponent

Sometimes using events to communicate components is not enough. For those cases, the BaseComponent class has a method called renderComponent.

Parameters:

- `target`: The HTML element to replace with the document.
- `template`: the mustache template path
- `data`: the mustache data

Returns:

- A Promise for a component instance.

<details>
  <summary>View example</summary>
  <div>

```js
async stateReady(state) {
    try {
        // Get the element to replace.
        const target = this.getElement(this.selectors.EXAMPLE);
        this.subcomponent = await this.renderComponent(
            target,
            'your_plugin/your_template',
            {"the": "mustache data"}
        );
    } catch (error) {
        log.error('Cannot load template');
        throw error;
    }
}
```

  </div>
</details>

:::note

For renderComponent to work, it is mandatory that the main element of the new component is at the root of the mustache template. Otherwise, the promise won't be resolved. In general, using a first-level node as a main component element is considered best practice in all reactive frameworks (some of them even throw an exception if it is not).

:::

## Start a new reactive application

Several reactive applications can coexist on the same page. For example, if an activity plugin implements one reactive application it will coexist with the course index, which is also a component but from the course editor reactive application. To ensure component logic doesn't interfere with one another, all the components, mutations, and the reactive state will belong to a specific reactive instance.

### General workflow

Every application works in a different way but the process to start a reactive framework is not that different from one another.

1. Create the Reactive Instance: for most cases, this will be a singleton where all components, mutations, and components will be registered.
2. Set mutations: this means registering the mutations library into the Reactive Instance. Those are the methods the components can dispatch.
3. Set the initial state: the initial state data can be loaded via a web service or not but the Reactive Instance won't start working until the state is ready.
4. Registering components: components can be registered at any moment. The registration does not depend on the initial state or the mutations. However, the component watchers won't be effective unless the state is ready and the component cannot dispatch mutations if they are not yet loaded.
5. The application is ready to fly.

### Create the Reactive Instance

Creating a Reactive instance is as easy as doing:

```js
export const myReactiveInstance = new Reactive(description);
```

However, the description object could have a different number of attributes depending on your need. For example, mutations and the initial state data could be sent at the moment of creation or added later using specific methods.

Apart, if your application has some special needs, you may prefer to extend the original Reactive class to create your own (see the extending the reactive class for details).

The description structure:

- `eventName`: for reactive to work, each instance must provide a custom event name to differentiate from the rest of the instances. This is a mandatory attribute.
- `eventDispatch`: a method to dispatch the custom event. This is also a mandatory attribute.
- (optional) `target`: an HTML Element in which the reactive instance is active. This is useful when the application will work only in a specific page element like a block. If none is provided the instance will create an invisible node.
- (optional) `mutations`: an object with all the available mutations. This is an optional attribute because the mutations can be overridden (setMutations) or added (addMutations) later.
- (optional) `state`: the initial state data if it is available at the moment of creation. The initial state can only be set one time (it will raise an exception if is done twice). If the application will get the initial state from a web service it must be set later using setInitialState method.

### Implement mutations library

The Reactive Instance registers all the mutations that components can dispatch. The mutations can be registered:

- At the moment of creating the Reactive instance bypassing the mutation methods as the "mutations" attribute of the description.
- Added once the Reactive Instance is created using the reactive setMutations method.
- If the amount of mutations is large enough to be divided into several files, each of them can be added to the previous mutations using the reactive addMutations method.

:::note

A mutations library is an object containing all the dispatch methods. Each mutation is free to define its own parameters **except for the first one that will be always a StateManager instance**. The StateManager object gives access to the state data but, most important, allows the mutation to disable the write mode in order to alter the state.

:::

<details>
  <summary>View example</summary>
  <div>

In the "Dispatching mutations from a component" there's an example of a component dispatching a mutation called "submitAttempt". The component asks the mutations to the Reactive Instance this way:

```js
this.reactive.dispatch(‘submitAttempt’, userid);

A possible code for that mutation can be:

export default class {
    async submitAttempt(stateManager, userId) {
        // Get the state data from the state manager.
        const state = stateManager.state;
        (... implement the mutation ...)
    }

}
```

  </div>
</details>

The main goal of mutations is to alter the state. This could be done in two different ways:

- Manually altering the state data: assign, delete or create some parts of the state as if it is a regular variable.
- Call a web service that returns a valid state update message: the State Manager provides a method called "processUpdates" that alters the state following an array of instructions called update message. In those cases the mutation can pass the web service return to the "stateManager.processUpdates" and the manager will handle all the hard work. See the "Controlling the state from the backend" section for more information.

#### Manually altering the state

All mutations must disable read mode before doing any change to the state data (otherwise it will raise an exception) but, most importantly, it MUST restore the read mode when all the changes are done. The StateManager must guarantee the user interface always represents a stable state so it will not notify the watchers until the read mode is restored.

<details>
  <summary>View example</summary>
  <div>

```js title="possible implementation of the previous submitAttempt example."
export default class {
    async submitAttempt(stateManager, userId) {
        const state = stateManager.state;
        stateManager.setReadOnly(false);
        // Call sour webservice.
        Const result = await ajax.call([{
            methodname: 'your_plugin_submit_attempt',
           {userid: userId},
        }])[0];
        if (result) {
            state.students.get(userid).attempts ++;
        }
        stateManager.setReadOnly(true);
    }
}
```

  </div>
</details>

#### Using `stateManager.processUpdates` to alter the state

When web services are designed adhoc to serve the reactive application, the backend is fully aware of the state data the frontend must display. In those cases, the mutation method is just a mere intermediary applying the changes.

To prevent the mutations from implementing over and over the same state alterations, the `StateManager` class provides a method called `processUpdates`. That method gets an array of instructions to execute on the state and alters the state notifying the watchers when it finishes.

<details>
  <summary>View example</summary>
  <div>

```js title="supposing 'your_plugin_web_service' returns a valid state update message, a possible mutation can be"
export default class {
    async submitAttempt(stateManager, userId) {
        const state = stateManager.state;
        Const updates = await ajax.call([{
            methodname: 'your_plugin_web_service',
           {userid: userId},
        }])[0];
        stateManager.processUpdates(updates);
    }
}
```

</div>
</details>

As can be seen in the example, the mutation does not need to enable or disable the read mode because the processUpdates will handle it automatically.

#### Private methods inside the mutations library

JavaScript is famous for not having private methods. This means all the methods inside the mutations library will be accessible by the Reactive Instance. To prevent components from dispatch private methods the Reactive instance "dispatch" method will raise an expectation in some cases.

Mutation names that components cannot dispatch:

- The "init" mutation is reserved (see the [section below](#reserved-init-mutation-method) for more information)
- Any method name starting with "_" is considered private. For example `_callWebservice` is a method that other mutations can use internally but no Component cannot call directly.

#### Reserved `init` mutation method

Each application can use as many mutations as they need. However, there is a reserved mutation called `init` which has a specific meaning. If there is an `init` method in the mutations library the Reactive Component will call it at the moment the mutations are registered.

The init method will receive only the StateManager as a parameter.

```js
init(stateManager) {
   // (... code to configure the mutation module or the state manager …)
}
```

This init method can be used to save some global module attributes, load strings, load templates, or configure the state manager `processUpdates` (see [Controlling the state from the backend](#controlling-the-state-from-the-backend) for more information about this last case).

### Set the initial state data

All components from the same Reactive Instance will watch the same state data and react to the changes (see Implementing State Watchers for more information). Even if all the components are registered, the Reactive Instance won't do anything with them until the initial state is loaded.

The initial state can only be initialized ones, but it could be done in two different ways:

1. If the initial state is available at the moment the Reactive instance is created, it can be passed to the construct method as the `state` attribute in the description param.
2. If the state is loaded after the page is rendered (using an ajax call normally) this could be loaded later with the `setInitialState` method.

When this happens, the components' stateReady hooks will be executed and the watchers will start working.

#### Initial state data limitations

While the JavaScript standard does not offer a suitable native solution for fully reactive data structures, implementing a deep reactive object will be a complex task. Depending on the depth of the changes tracked it will require many frontend resources and many lines of code to maintain. That is the main reason why most people use complex reactive frameworks for it.

To keep the state fast and simple, the reactive.js library can only store two kinds of data at the ROOT level:

- Objects with attributes of any kind.
- Sets (array) of objects with, at least, an `id` attribute. The rest of the attributes of the elements could be as complex as needed. The `id` attribute will be used to index the set.

This means the following cases are **NOT** allowed at a state ROOT level (they will raise an exception):

- Simple values (strings, booleans...).
- Arrays of simple values.
- Arrays of objects without ID attribute (all arrays will be converted to maps and require an ID).

<details>
  <summary>View valid and invalid examples</summary>
  <div>

<ValidExample>

Initial state data:

```js
{
    "activity": {
        "name": "Something",
        "somelist": [1, 42, 23, 56],
        "info": {
            "extras": true,
        },
    },
    "students": [
       {"id": 1, "username": "Jane Doe", "related": [42]},
       {"id": 2, "username": "John Doe", "related": [42, 56]},
    ],
}
```

</ValidExample>

<InvalidExample>

Initial state cannot store simple values at root level.

```js
{
    "name": "My incorrect application",
    "Visible": true,
}
```

</InvalidExample>

<InvalidExample>

All initial state root arrays must have an id attribute:

```js
{
    "students": [
       {"username": "Jane Without ID", "related": [42]},
       {"username": "John Without ID", "related": [42, 56]},
    ],
}
```

</InvalidExample>

  </div>
</details>

## Controlling the state from the backend

Most of the time mutations will execute some kind of ajax call to inform the server. The web services for supporting those calls can be generic and return some random data the mutation must interpret to know what state parts must be altered.

However, if the web service is aware that it is altering the state, it can send back specific instructions of the state parts that are affected. Those instructions can be executed directly by the State Manager simplifying the mutation code. Those instructions are called "state updates".

### Format of a state update message

The `stateManager.processUpdates` can process data structures like:

```js
[
    {
       "name": *THE STATE ELEMENT NAME*,
       "action": *THE UPDATE TYPE NAME*,
       "fields": {
           // ( … the affected fields of the object … )
        }
    },
    // (... more actions can be added in a single message ...)
]
```

<details>
  <summary>Example of a state update message</summary>
  <div>

```js
[
    {
       "name": "students",
       "action": "put",
       "fields": {
           "id": 5,
           "name": "John Doe",
           "attempts": 4,
        }
    },
    {
       "name": "students",
       "action": "delete",
       "fields": {
           "id": 3,
        }
    },
]
```

  </div>
</details>

The first element of the array will update or create a new element in the "students" set with the fields provided. The second element will remove the element with id 3 from the "students" set.

### Available update types

By default, the state manager can process the following actions:

- `put`: it is the most common action. Means create or update a state element using the fields provided. If the element exists it will be updated, if not it will be created. IF the element already exists and has some extra fields, they will be preserved as they are.
- `override`: like `put`, this action will create or update a state element but it will remove any other attribute that is not present in the fields.
- `update`: will update an element with the fields but it will raise an exception if the element is not in the state.
- `create`: will create a new state element but it will raise an exception if the element is already created.
- `remove`: it will delete a state element.
- `delete`: it will delete a state element but it will raise an exception if the element is not in the state.

### Implementing custom update types

The default update types covers most of the state actions reactive applications should need. However, more update types can be added or even overridden if needed. The State Manager has a method called "addUpdateTypes" that get and object containing all the new update types methods.

Any custom update method will get 3 parameters:

- The state manager instance
- The state element name
- The fields provided

<details>
  <summary>View example</summary>
  <div>

A mutations library adding and overriding update types.

```js
Const mutations = {
    init(stateManager) {
        stateManager.addUpdateTypes({
            create: this._newCreate,
            cefreshConcept: this._refreshConcept,
        });
    }

    _newCreate(stateManager, name, fields) {
        fields.timeCreated = Date.now();
        stateManager.defaultCreate(stateManager, name, fields);
    }

    _refreshConcept(stateManager, name, fields) {
        const state = stateManager.state;
        stateManager.setReadOnly(false);
        // Do some stuff with the state.
        State.activity.notice = `A refresh context of ${name} with ${fields.something} arrived`;
        // Restore the state read mode to alert watchers.
        stateManager.setReadOnly(true);
    }
};
```

:::note

In that example:

1. The mutation init method adds overrides the default create action and a new refreshConcept.
2. If the backend sends an update message with `create` as action, the _newCreate will be executed.
3. If the backend sends an update message with `refreshConcept`, the `_refreshConcept` will be executed.
4. Any other action like put, delete, or update will continue working as before using the state manager defaults.

:::

  </div>
</details>

### Adding default values to state attributes

There are cases in which the fields of the update message are exactly the ones stored in the state. Some of the examples of it could be when:

- The state has attributes that only live in the frontend and won't be provided by the backend. For example, a *locked* attribute locks user interactions when the element is pending some updates.
- The returned fields have some information that is only for the mutation, like adding some small chunk of HTML or some pre-loaded strings that do not need to be in the state all the time.
- Some of the state attributes are calculated in the front end using the provided element fields.
- Some element attributes have default values that the backend can omit to optimize the returned message size.

For those scenarios, there's a reserved action called `prepareFields`. The state manager will use this method to convert the fields provided to valid state objects.

The prepareFields method will return get the following parameters:

1. The `StateManager` object to access the full state
2. The state element name `elementName`
3. An object with the `fields` provided

<details>
  <summary>View example</summary>
  <div>

A possible prepareFields update type:

```js
prepareFields(stateManager, updateName, fields) {
    const state = stateManager.state;
    fields.extras = state.activity.extras && fields.extras;
    return fields;
}
```

  </div>
</details>

## Drag & drop helper component

Components can delegate parts of the logic to other components. In case a component wants to implement a draggable element or a drop-zone, it can delegate all the configuration stuff to a `DragDrop` component exported in the `core/reactive` module.

The `DragDrop` class will do all the HTML setup and leave only the custom logic to the parent component. The only restriction is that a draggable element will only interact with dop-zones registered in the same reactive instance. This way, if two applications has draggable elements in the same page each one will interact only with the proper ones.

In general, any draggable or drop-zone component will follow the same schema.

<details>
  <summary>View example</summary>
  <div>

```js
import {BaseComponent, DragDrop} from 'core/reactive';

export default class extends BaseComponent {
    /**
     * The state is ready.
     */
    stateReady() {
        this.dragdrop = new DragDrop(this);
    }

    /**
     * Remove all subcomponents dependencies.
     */
    destroy() {
        // The draggable element must be unregistered.
        if (this.dragdrop !== undefined) {
            this.dragdrop.unregister();
        }
    }

    // (... implement all the draggable or drop-zone required methods...)
}
```

  </div>
</details>

### Implementing a draggable element

Making a standard component draggable is easy. If the parent component has a `getDraggableData` the `dragdrop` component will set up the draggable element automatically.

Draggable methods:

- `getDraggableData(): Object|null` this is the only mandatory method for a draggable element. The `dragdrop` will use this method to get the data to pass to the valid drop-zones. If the method returns a null or undefined, the dragging will ignore the dragging action.
- (optional) `dragStart(Object dragData, Event event): void` the parent class can implement this method to capture the dragStart event.
- (optional) `dragEnd(Object dragData, Event event): void` the parent class can implement this method to capture the dragEnd event

<details>
  <summary>View example</summary>
  <div>

This is a basic example of a draggable component.

```js
import {BaseComponent, DragDrop} from 'core/reactive';

export default class extends BaseComponent {
    /**
     * The state is ready.
     */
    stateReady() {
        this.dragdrop = new DragDrop(this);
    }

    /**
     * Remove all subcomponents dependencies.
     */
    destroy() {
        // The draggable element must be unregistered.
        if (this.dragdrop !== undefined) {
            this.dragdrop.unregister();
        }
    }

    /**
     * Get the draggable data of this component.
     *
     * @returns {Object} the draggable data.
     */
    getDraggableData() {
        // This data will be passed to the drop-zones.
        return {id: 35, name: "Something"};
    }
}
```

:::note

As can be seen in th example, no event handling is required. By default, the `DragDrop` element will switch on and off some CSS classes if the element is dragged or dropped:

- `draggable`: this class is added to the `this.element` when the draggable setup is finished.
- `dragging`: this class is added when the user drags the element and is removed when it is dropped.

:::

  </div>
</details>

### Implementing a drop-zone component

Drop-zones are implemented similarly to the draggable elements. The DragDrop component will set up the `this.element` as a drop-zone depending on the methods of the parent component.

Drop-zone methods:

- `validateDropData(Object dropdata): boolean` each time a dragged element passes through a drop-zone, the DragDrop component will call this method to decide if the dragged element is valid for this drop-zone.
- `drop(Object dropdata): void` will be called only if a valid draggable data is dropped in the drop-zone. Important: the drop method should not re-validate the dragged data because the `DragDrop` will always call that handler after validateDropData, and only if it returns true.
- `(optional) hideDropZone (Object dragdata, Event event): void` will be executed when valid drag data (validateDropData returns true) enters the drop-zone. This method is used to add visual clues to the user that this is a drop-zone.
- `(optional) hideDropZone (Object dragdata, Event event): void` will be executed when valid drag data (validateDropData returns true) leaves the drop-zone. This method is used to remove visual clues to the user that this is a drop-zone.

The `DragDrop` element will switch on and off some CSS classes of the drop-zones:

- `dropready`: added when the drop--zone setup finishes
- `dragover`: added or removed when a valid draggable element enter or exits the drop-zone

<details>
  <summary>View example</summary>
  <div>

This is a basic example of a drop-zone component.

```js
import {BaseComponent, DragDrop} from 'core/reactive';

export default class extends BaseComponent {
    /**
     * The state is ready.
     */
    stateReady() {
        this.dragdrop = new DragDrop(this);
    }

    /**
     * Remove all subcomponents dependencies.
     */
    destroy() {
        // The draggable element must be unregistered.
        if (this.dragdrop !== undefined) {
            this.dragdrop.unregister();
        }
    }

    /**
     * Validate draggable data.
     *
     * @returns {boolean} if the data is valid for this drop-zone.
     */
    validateDropData(dropdata) {
        // we don’t want grumpy data in this drop-zone ;-)
        return dropdata?.name != ‘Grumpy’;
    }



    /**
     * Executed when a valid dropdata is dropped over the drop-zone.
     */
    drop(dropdata, event) {
        // We don’t need to check again for grumpy data
        // because it is already done.
        // (... some logic sending the dropdata to the server or whatever...)
    }

    /**
     * Optional method to show some visual hints to the user.
     */
    showDropZone(dropdata, event) {
        this.element.innerHTML = "DROP HERE!";
    }

    /**
     * Optional method to remove visual hints to the user.
     */
    hideDropZone(dropdata, event) {
        this.element.innerHTML = "DROP ZONE";
    }
}
```

  </div>
</details>
