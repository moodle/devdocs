---
title: SCSS deprecation
tags:
  - Processes
  - Core development
  - Deprecation
  - SCSS
---

<Since versions={["4.4"]} issueNumber={"MDL-78334"} />

Since Moodle 4.4, it's possible to deprecate SCSS styles and classes. This allows us to safely remove SCSS and will help us keep the code cleaner and more organized.

The most common scenarios where this functionality can be used is when specific SCSS code is not being used anywhere, when the name of a class is changed or a class should not be used in the future.

:::info When should SCSS be removed?

There are situations where deprecation does not make sense. For example when a whole functionality is being removed, or a very specific SCSS class is no longer used by the code. If it is very unlikely that the SCSS class is used by any other code, it can simply be removed without the full deprecation process.

:::

## How it works

A new SCSS file called `deprecated.scss` has been added to the `theme/boost/scss/moodle` folder. All the deprecated SCSS code should be added to this file.

In this file a new mixin called `deprecated-styles` has been also added. This mixin will add a red backgound to the deprecated styles and also a `:before` pseudo-element with the text "Deprecated style in use". It is important to note that `deprecated-styles` mixin will only affect sites with `themedesignermode` setting enabled or behat test running sites.

:::tip

If all the styles depending on the same parent are deprecated, is strongly recommended to deprecate the parent selector.

:::

## How to deprecate SCSS code

To deprecate SCSS code, follow these steps:

1. Remove the SCSS code that is no longer in use from the original file.
2. Add the removed SCSS code to the `deprecated.scss` file under the comment for the current version `// Deprecated since Moodle X.Y.`
3. Add the `deprecated-styles` mixin to the removed SCSS code.
4. Add a comment to the removed SCSS code explaining why it has been deprecated.

:::note

If there is no section for the current version in the `deprecated.scss` file, it should be added. See [Final deprecation](#final-deprecation).

:::

**Example 1: Helper class has been removed**

```scss title="theme/boost/scss/moodle/deprecated.scss"
// The class ".foo" is deprecated. Use ".bar" instead.
.foo {
  @include deprecated-styles();

  color: $pink;
  @include border-right-radius(0);
  border: $border-width solid $border-color;
  table {
    margin: 1rem;
  }
  table > tbody {
    padding: .5rem;
  }
}
```

**Example 2: SCSS code is no longer in use**

```scss title="theme/boost/scss/moodle/deprecated.scss"
// The following styles are deprecated because they are no longer in use.
// Deprecating the parent selector that contains all the deprecated styles.
.path-course-view li.activity .foo {
  @include deprecated-styles();
}
.path-course-view li.activity .foo > a {
  text-decoration: none;
  color: $secondary;
}
.path-course-view li.activity .foo > a:hover {
  color: $primary;
}
```

## Final deprecation

When adding SCSS code to the `deprecated.scss` file, it is important to add it under the comment with the version when the code was deprecated. If that comment still doesn't exist, it should be added:

```scss title="theme/boost/scss/moodle/deprecated.scss"
//
// Deprecated since Moodle X.Y.
//
```

And alongside with that, a new issue should be created in the tracker to remove the deprecated SCSS code with the title `Remove SCSS deprecated in X.Y` and in the epic `X.[Y+4]` deprecations.

After 4 major versions, the deprecated SCSS code will be removed from the `deprecated.scss` file.

## Check deprecated styles in Behat tests

Is is possible to check if deprecated styles are being used while running Behat tests. To do so, add the `--scss-deprecations` flag to the Behat init command.

```bash
php admin/tool/behat/cli/init.php --scss-deprecations
```

Then, when running Behat tests, the following message will be displayed:

```bash
Run optional tests:
[...]
- SCSS deprecations: Yes
```

If deprecated styles are being used, the test will fail with the following message:

```bash
Deprecated style in use (Exception)
```
