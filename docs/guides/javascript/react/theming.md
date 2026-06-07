---
title: Theming Components
tags:
  - react
  - javascript
  - theming
  - theme
description: How to theme React Components
---

<Since version="5.2" issueNumber="MDL-88507" />

Moodle supports the theming of React components using dynamic path-resolution for React components based on the user's active theme. It allows theme developers to fully override React components for both Moodle core, and any Moodle plugin, while providing mechanisms to extend or fall back to original implementations.

## How Path Resolution Works

When a component is requested using the standard naming format (`@moodle/lms/<component>/<path>`), the system dynamically checks the user's **current theme** before falling back to the standard location.

### Resolution Logic

If a user's current theme is set to **`boost`**, a request for `@moodle/lms/core/ExampleComponent` triggers the following lookup sequence:

1. Check for a theme-specific override:

    ```
    public/theme/boost/js/esm/src/overrides/core/ExampleComponent.tsx
    ```

2. Fall back to Core (if no theme overrides exist)

    ```
    public/lib/js/esm/src/ExampleComponent.tsx
    ```

Similarly, if a user's current theme is set to **`classic`**, a request for `@moodle/lms/mod_assign/local/grader/GradingPanel` triggers the following lookup sequence:

1. Check for a theme-specific override:

    ```
    public/theme/classic/js/esm/src/overrides/mod_assign/local/grader/GradingPanel.tsx
    ```

2. Fall back to the plugin (if no theme overrides exist)

    ```
    public/mod_assign/js/esm/src/local/grader/GradingPanel.tsx
    ```

:::danger[Theme parent fallbacks]

It is worth noting that components **do not** fall back to a parent theme.

A request for a component in a child theme **does not** check the parent theme automatically.

:::

### The Override File Structure

To override a component, the file must be placed within the theme's override directory using the following structure:

```text
public/theme/<themename>/js/esm/src/overrides/<component>/<path>
```

## Importing Original or Parent Components

Theme developers often need to wrap or extend an existing component rather than rewriting it from scratch. To prevent infinite loop resolution errors, specific aliases are provided to target the core or a parent theme explicitly.

### Targeting the Core/Original Component

To pull in the un-themed, baseline version of a component, use the `theme-original` scope modifier:

```typescript title="public/theme/boost/js/esm/src/overrides/core/ExampleComponent.ts"
import {ExampleComponent as OriginalComponent} from '@moodle/lms/theme-original/core/ExampleComponent';

export const ExampleComponent = (props) => {
    // Add custom theme wrappers around the original core component
    return (
        <div className="boost-theme-wrapper">
            <OriginalComponent {...props}/>
        </div>
    );
};
```

### Targeting a Parent Theme Component

If your theme inherits from a hierarchy of themes, you can choose which overrides to attempt to load. For example, in the given theme structure:

import FileTree from '@site/src/components/FileTree';

<FileTree structure={{
    "boost": {
        "classic": {
            "retro": "Your theme is the grandchild"
        }
    }
}} />

You can explicitly fetch either:

- a version for the `classic` theme using `@moodle/lms/theme-classic/mod_myfirstplugin/ExampleComponent`; or
- a version for the `boost` theme using `@moodle/lms/theme-boost/mod_myfirstplugin/ExampleComponent`; or
- the version shipped with the plugin using `@moodle/lms/theme-original/mod_myfirstplugin/ExampleComponent`.

```typescript title="public/theme/retro/js/esm/src/overrides/mod_myfirstplugin/ExampleComponent.ts"
import {ExampleComponent as ClassicComponent} from '@moodle/lms/theme-classic/mod_myfirstplugin/ExampleComponent';

export const ExampleComponent = (props) => {
    // Extend the classic theme's implementation
    return <ClassicComponent boostEnhanced={true} {...props}/>;
};
```

## Loading components from an override

When overriding a component you must be careful not to introduce circular dependencies by loading the themed version of the _same_ component.

:::critical

Never use the bare `@moodle/lms/` alias to load the wrapped code inside an override file to reference the component you are overriding.

:::

```typescript title="public/theme/retro/js/esm/src/overrdies/mod_myfirstplugin/ExampleComponent.ts"
// We must use the `theme-original` variant to load the original here:
import {
    ExampleComponent as OriginalComponent,
} from '@moodle/lms/theme-original/mod_myfirstplugin/ExampleComponent';

// But for loading _other_ components, we can use the standard import:
import {UnrelatedComponent} from '@moodle/lms/mod_myfirstplugin/UnrelatedComponent';

export const ExampleComponent = (props) => {
    return (
        <UnrelatedComponent>
            <OriginalComponent boostEnhanced={true} {...props}/>;
        </UnrelatedComponent>
    );
};

```

## Testing theme overrides

You can write tests for your theme-specific overrides in the same way that tests can be written for other components.

When importing your component under test, you must use the `theme-<themename>` import, for example:

```typescript title="public/theme/boost/js/esm/tests/overrides/core/ExampleComponent.test.ts"
import {ExampleComponent} from '@moodle/lms/theme-boost/core/ExampleComponent';
```
