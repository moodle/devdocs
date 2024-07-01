---
title: Bootstrap 5 migration
tags:
- Bootstrap
---

<!-- markdownlint-disable no-inline-html -->

Bootstrap 5 has evolved with new features, improvements, and changes in its latest version, and along with this some breaking changes also come, which need to be addressed in the migration process.

:::info

See more about Bootstrap 5 breaking changes in the [official documentation](https://getbootstrap.com/docs/5.0/migration/).

:::

To achieve a smoother process and facilitate the moment of the update, the migration has been divided into different steps:

1. **PopperJS upgrade**: This is the first step in the migration process, as Bootstrap 5 requires PopperJS version 2. This step is about upgrading the current PopperJS version to version 2. Because we still need PopperJS version 1 for Bootstrap 4 both versions will co-exist until all usages are migrated to v2.
2. **SCSS Deprecation process**: A SCSS deprecation process will be needed for the cleanup after BS5 upgrade. More details about it in [SCSS deprecation](/general/development/policies/deprecation/scss-deprecation).
3. **Refactoring BS4 features dropped in BS5**: This step is about refactoring the current Bootstrap 4 features that will be deprecated or dropped in its version 5 and they can be replaced with current codebase.
4. **Create a BS5 "bridge"**: Some simple breaking changes could be also addressed in advance creating a BS5 "bridge". With small additions to this "bridge", we can refactor in advance the occurrences in the codebase for some dropped features in BS5.
5. **BS5 upgrade**: Upgrade the current Bootstrap 4 version to version 5.
6. **BS4 backwards-compatibility layer**: Alongside the update, a new backwards-compatibility layer will also be created, and some of the Bootstrap 4 syntax will still work until the final deprecation. This will help third-party plugins to be updated in a more gradual way.
7. **Final deprecation**

:::note

The migration process will be done in a gradual way, and the steps will be executed in different phases. The first phase with the PopperJS upgrade, the SCSS deprecation process and the refactoring will be included in Moodle 4.4. The other steps will be ready in following releases. This documentation page will be updated accordingly with the process.

:::

## Refactoring BS4 features dropped in BS5

<Since version="4.4" issueNumber="MDL-79914" />

Some of the Bootstrap 4 classes will be deprecated or dropped in its version 5. To prepare for this, some of the current Bootstrap 4 classes usages have been replaced with version 5 compatible classes. Doing these refactors in advance, will help us to upgrade to Bootstrap 5 in the future.

### Badges

- Badge colour class helpers `.badge-*` have been replaced with background utilities (use `.bg-primary` instead of `.badge-primary`) combined with the corresponding text colour classes (`.text-dark` or `.text-white`) to meet accessibility contrast.
- The `.badge-pill` class has been replaced with `.rounded-pill`

<InvalidExample title="Don't">

```html
<span class="badge badge-danger badge-pill">Error badge</span>
```

</InvalidExample>

<ValidExample title="Do">

```html
<span class="badge bg-danger text-white rounded-pill">Error badge</span>
```

</ValidExample>

### Media

The `.media` component has been replaced with utility classes.

<InvalidExample title="Don't">

```html
<div class="media">
    <div class="media-left">
        [...]
    </div>
    <div class="media-body">
        [...]
    </div>
</div>
```

</InvalidExample>

<ValidExample title="Do">

```html
<div class="d-flex">
    <div class="flex-shrink-0">
        [...]
    </div>
    <div class="flex-grow-1 ml-3">
        [...]
    </div>
</div>
```

</ValidExample>

### Mixins

The following previously deprecated mixins will be dropped in BS5, so they can be refactored:

- hover, hover-focus, plain-hover-focus and hover-focus-active
- float-left, float-right and float-none
- nav-divider
- img-retina
- text-hide
- invisible
- form-control-focus
- text-emphasis-variant
- size
- make-container-max-widths
- g-variant and bg-gradient-variant

<InvalidExample title="Don't">

```css
.collapse-list-item {
    padding: $collapse-list-item-padding-y $collapse-list-item-padding-x;
    @include hover-focus() {
        background-color: $collapse-list-item-hover-bg;
        border-color: $collapse-list-item-hover-border;
    }
}
```

</InvalidExample>

<ValidExample title="Do">

```css
.collapse-list-item {
    padding: $collapse-list-item-padding-y $collapse-list-item-padding-x;
    &:hover,
    &:focus {
        background-color: $collapse-list-item-hover-bg;
        border-color: $collapse-list-item-hover-border;
    }
}
```

</ValidExample>

### Forms

- The `.form-group` helper class has been replaced with margins.
- The `.form-inline` helper class has been replaced with utility classes.

<InvalidExample title="Don't">

```html
<form class="form-inline">
    <div class="form-group">
        [...]
    </div>
</form>
```

</InvalidExample>

<ValidExample title="Do">

```html
<form class="d-flex flex-wrap align-items-center">
    <div class="mb-3">
        [...]
    </div>
</form>
```

</ValidExample>

### Card decks

The `.card-deck` helper class has been replaced with utility classes.

<InvalidExample title="Don't">

```html
<div class="card-deck">
    <div class="card">
        [...]
    </div>
    <div class="card">
        [...]
    </div>
</div>
```

</InvalidExample>

<ValidExample title="Do">

```html
<div class="row row-cols-1 row-cols-sm-2">
    <div class="col">
        <div class="card">
            [...]
        </div>
    </div>
    <div class="col">
        <div class="card">
            [...]
        </div>
    </div>
</div>
```

</ValidExample>
