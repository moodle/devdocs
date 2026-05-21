---
title: Frontend Development
tags:
  - react
  - javascript
  - moodle
---
## Overview {/* #overview */}

Moodle now supports modern frontend development using **ECMAScript modules (ESM)**, **React**, and **TypeScript**.

These technologies enable component-based UI development while remaining compatible with Moodle's existing frontend systems.

This document describes the recommended approach for implementing frontend functionality in Moodle, ensuring consistency, maintainability, and compatibility with the theming system.

## Mechanics: Building Frontend Features {/* #mechanics-building-frontend-features */}

### Frontend Source Structure {/* #frontend-source-structure */}

Frontend source code should be located within:

```console
├── component
│       └── js
│            └── esm
│                 └── src
```

- Source code is written in **TypeScript**
- Code is compiled into browser-ready JavaScript
- Compiled files should not be edited directly

### Rendering React Components from Templates {/* #rendering-react-components-from-templates */}

React components are rendered using the **React template helper**. See the [Mustache Helper docs](./javascript/react/reactautoinit) for more details.

```mustache
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

This:

- inserts a container element
- registers the component for automatic initialisation

Templates **determine where the component appears**, while React defines the UI.

### Auto initialisation {/* #auto-initialisation */}

When the page loads:

1. Moodle finds components registered by the React helper
2. The corresponding ESM module is loaded
3. The module's **default export** is treated as a React component. Moodle automatically renders this component into the container created by the template helper. The component receives the props defined in the template.

The default function mounts the React component. This is covered in more detail on the [Mustache helper and Autoinit](./javascript/react/reactautoinit) page.

### Component contract {/* #component-contract */}

React modules should export a **default React component**.

In practice, this means exporting a function that returns JSX:

```ts
type Props = {
    title: string;
};

export default function Viewer({title}: Props) {
    return <h1>{title}</h1>;
}
```

Core components follow this pattern consistently, and developers are strongly encouraged to do the same.

While other patterns may work, using a React component ensures consistency, maintainability, and compatibility with Moodle's frontend architecture.

### Passing Props {/* #passing-props */}

Templates should pass only the minimal data required to initialise the component.

In most cases, this means passing identifiers (such as IDs) or simple configuration values, rather than full data objects.

<ValidExample>

```json
{
    "courseid": 42
}
```

```ts
type Props = {
    courseid: number;
};
```

Component:

```ts
useEffect(() => {
    fetchCourse(courseid).then(setCourse);
}, [courseid]);
```

</ValidExample>

<InvalidExample>

```json
{
    "course": {
        "id": 42,
        "fullname": "Physics 101",
        "teachers": [],
        "activities": []
    }
}
```

</InvalidExample>

Why this is bad

- Duplicates backend logic in PHP
- Couples template structure to component internals
- Bloats page payload
- Makes reuse harder

:::info

If the data can be fetched by the component, it should not be passed via props.

:::

:::warning

In some cases, small amounts of preloaded data may be passed to avoid unnecessary requests. This should be limited and carefully considered.

:::

### Using Moodle APIs {/* #using-moodle-apis */}

Moodle is in the process of improving support for using existing JavaScript APIs from ESM based code.

Commonly used APIs such as string handling and web service helpers are being progressively rolled out as ESM compatible modules.

Where ESM component wrappers are available, developers should prefer them.

Where they are not available, AMD files may be accessed using compatibility helpers.

Developers should:

- prefer ESM native APIs where available
- use compatibility helpers for AMD files when required
- avoid introducing new AMD based patterns

Support for ESM compatible APIs will continue to improve over time.

### Recommended pattern for Data Fetching {/* #recommended-pattern-for-data-fetching */}

React components should avoid directly embedding data fetching logic where possible. Instead, data should be handled through service modules.

This helps keep components simple, improves reuse, and avoids duplication of API logic

#### Service Modules {/* #service-modules */}

Data fetching should be implemented in dedicated service files.

Example structure:

```
services/
    └── courses.ts

```

Example:

```ts
// services/courses.ts
export const fetchCourse = (courseid: number) => Ajax.call([{
    methodname: 'core_course_get_courses',
    args: {ids: [courseid]}
}])[0];
```

Service modules should:

- encapsulate API calls
- handle request / response transformations
- remain independent of the UI

#### Using Services in Components {/* #using-services-in-components */}

Components should call service functions and manage the resulting state.

Example:

```ts
const [course, setCourse] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
    setLoading(true)
    fetchCourse(courseid)
    .then(setCourse)
    .finally(() => setLoading(false));
}, [courseid]);
```

Components are responsible for:

- triggering data loading
- managing loading and error states
- rendering UI based on state

This pattern makes it easier to migrate to ESM implementations as they become available.

This approach is already used in parts of Moodle, where data fetching is separated into dedicated modules.
The exact structure may differ, but the key principle is to keep API interactions separate.

<InvalidExample>

```ts
useEffect(() => {
    Ajax.call([{
        methodname: 'core_course_get_courses',
        args: {ids: [courseid]}
    }])[0]
        .then(setCourse)
        .catch(setError)
        .finally(() => setLoading(false));
}, [courseid]);

```

</InvalidExample>

While this example works, it tightly couples the component to the API and makes the code harder to reuse and maintain.

### Styling and Theming {/* #styling-and-theming */}

Components must remain compatible with Moodle's theming system.

Although React components control their own markup, themes must still be able to customise the appearance of those components

#### Use Design System and Tokens {/* #use-design-system-and-tokens */}

Where available, components should use the Moodle design system and design tokens rather than defining custom styles.

This helps ensure visual consistency across the platform and reduces duplication.

Avoid:

- hard coded colours
- hard coded spacing
- custom styles that duplicate the design system components

#### Avoid Inline Styles {/* #avoid-inline-styles */}

Inline styles should be avoided unless absolutely necessary.

Inline styles:

- cannot be overridden by themes
- make styling harder to maintain

Instead prefer class based styling

Where appropriate, components should support passing additional class names via props.

#### Do Not Assume Fixed Styling {/* #do-not-assume-fixed-styling */}

Components should not assume a specific visual appearance.

Avoid:

- relying on specific colours or spacing
- tightly coupling layouts to styling assumptions

Themes may significantly alter the look and feel of components.

### Initialising Frontend Behaviour {/* #initialising-frontend-behaviour */}

Historically, templates used the `{{#js}}` helper:

```mustache
{{#js}}
require(['core/module'], function(module) {
    module.init();
});
{{/js}}
```

This pattern remains supported but is **discouraged for new React-based components**.

Developers should prefer the **React template helper** for new UI.

The `{{#js}}` helper may still be used for:

- enhancing existing Mustache-rendered markup
- working with legacy components

## Design Philosophy {/* #design-philosophy */}

### Templates Provide Placement, Not Structure {/* #templates-provide-placement-not-structure */}

Historically:

`PHP → Template → UI`

Now:

`Template → React component → UI`

Templates define **where a component appears**.

React components define **how the UI is structured**.

### Minimal Server Context {/* #minimal-server-context */}

Previously, PHP assembled large template contexts.

Now, the server should provide only **minimal props**.

```
Server → minimal props
        ↓
React initialises
        ↓
Component fetches data
```

Components retrieve additional data asynchronously.

### Components are Self Contained {/* #components-are-self-contained */}

React components should encapsulate:

- UI structure
- state
- user interaction
- data loading state and calls to service files

This improves maintainability and reuse.

Components should orchestrate when and how data is loaded, while delegating actual API calls to service functions (in separate files).

### Maintainability and Consistency {/* #maintainability-and-consistency */}

Frontend code should prioritise:

- small, composable components
- reuse of existing APIs and design system elements
- predictable markup for theming
- separation of concerns between server and client

### Transition from Legacy Patterns {/* #transition-from-legacy-patterns */}

| Historical approach              | Modern approach                    |
|----------------------------------|------------------------------------|
| PHP builds full template context | PHP provides minimal props         |
| Mustache renders UI              | React renders UI                   |
| JavaScript enhances templates    | Components manage UI and behaviour |

### Relationship to Reactive UI System {/* #relationship-to-reactive-ui-system */}

Moodle previously introduced a custom [reactive UI system](./javascript/reactive/) to support dynamic interfaces.

With the adoption of React, new reactive UI development should use **React-based components** instead.

The reactive system remains supported for existing code but should not be used for new features.
