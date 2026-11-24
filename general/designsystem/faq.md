---
title: FAQ
sidebar_position: 3
tags:
  - Design System
---

## Where are tokens and components documented? {/* #where-are-tokens-and-components-documented */}

At [design.moodle.com](https://design.moodle.com), with examples. Component coverage is still growing, and docs will be expanded as new components are released.

## How is the Design System rollout being phased? {/* #how-is-the-design-system-rollout-being-phased */}

Design tokens and initial components have landed, starting in Moodle 5.2.

Component development has continued into 5.3, with a growing set of components in the @moodlehq/design-system package verified against the Moodle LMS theme and Bootstrap.

## What practical changes in Moodle Core LMS are expected with the introduction of the Design System? {/* #what-practical-changes-in-moodle-core-lms-are-expected-with-the-introduction-of-the-design-system */}

Changes are already happening incrementally — e.g. dialogue colours have moved from hard-coded values to Design System tokens, and the navbar Edit mode switch now uses the Design System's Switch component. Expect more of this, for both styling and components, rather than one big cutover.

In the meantime, expect some extra variation — a table with six different implementations may briefly have a seventh — but the count will drop as older variants are replaced.

New features use the Design System, and the Design System team tracks usage, but migrating existing code remains the responsibility of individual product owners.

## Why doesn't the Design System use Bootstrap's variables? {/* #why-doesnt-the-design-system-use-bootstraps-variables */}

For the broader tokens, it does. In `default.scss`, Moodle LMS redefines some Boost variables using tokens — `$gray-500`, for instance, is now set from `$mds-color-gray-500` — so tokens feed through to Bootstrap.

Component styles, however, avoid Bootstrap's Sass variables and mixins, even where tokens overlap (font, colour, spacing, etc.). These are compiled when a theme is built, so using them would make Bootstrap a direct dependency of the Design System, conflicting with how Moodle LMS includes and defines Bootstrap within Boost.

## Why use Moodle-specific classes instead of Bootstrap's? {/* #why-use-moodle-specific-classes-instead-of-bootstraps */}

`.mds-` classes sit alongside Bootstrap classes rather than overriding them. Overriding Bootstrap directly can break things unpredictably across Moodle LMS, so Design System styles are colocated with their components instead. The aim is to replace the ad hoc Bootstrap styling scattered across Moodle LMS with components defined and styled up front, giving a consistent look and feel.

They're also not direct equivalents. Bootstrap's `.nav-pills` is a container for a group of links, while `.mds-nav-pill` is a single compact navigation link with hover, pressed and selected states, an active indicator, and typography and spacing matching the Figma designs.

## Why has my custom theme's appearance changed after upgrading? {/* #why-has-my-custom-themes-appearance-changed-after-upgrading */}

Boost variables are defined with `!default`, and some are now [set from Design System tokens](#why-doesnt-the-design-system-use-bootstraps-variables). If your theme extends Boost and doesn't set its own values first, it will pick up the Design System values after upgrading.

To keep your theme's existing look, define those variables in your theme before Boost's are loaded.

## How can a theme customise Design System components? {/* #how-can-a-theme-customise-design-system-components */}

Components are styled through CSS custom properties, so a theme can override a token without touching the component's CSS. An override only affects components that use that token, keeping the impact predictable.

For example, the experimental dark mode in Moodle LMS overrides `--mds-bg-nav-pill-hover` in `dark.scss`.

## Does the Design System support the Moodle App or Moodle Workplace? {/* #does-the-design-system-support-the-moodle-app-or-moodle-workplace */}

Not yet. This includes Moodle Workplace tenant theming. We have not collaborated with these Moodle products, but aim to do so in the future.
