---
title: Accessibility checklist
tags:
  - Processes
  - Integration
  - Accessibility
sidebar_position: 4
---

<!-- cspell:ignore ACTIVITYNAME, Deque -->

This document proposes a checklist for accessibility reviews. Not all aspects of accessibility can be checked automatically, so this checklist is intended to guide reviewers when doing an accessibility check to a patch.

:::tip Identify the Nature of Changes

1. **Are the changes on the backend only (webservices, database updates, events, hooks...)?**
    - If yes, no accessibility review is needed.
2. **Are there changes to the HTML, CSS, or JavaScript?**
    - If yes, an accessibility review is necessary.
3. **Do the changes only involve standard HTML elements without altering default browser behaviour?**
    - If yes, a quick accessibility check is recommended, but a complete review may not be necessary.

:::

## Do an automated check

Use the automatic accessibility checks via [Axe DevTools](https://www.deque.com/axe/devtools/) or [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)) to check for common issues. If there are any issues, the changes must be fixed before continuing.

When possible, run an HTML validator and check for errors. For example, using [Nu HTML validator](https://validator.w3.org/nu/#textarea).

## General Checks

Those are some quick checks you can do to ensure that the changes are accessible.

### Use of tabindex

Tabindex > 0 is wrong. Using any tabindex value other than 0 (for focusable elements) or -1 (for non-focusable elements) is an anti-pattern. It can cause unexpected behaviour for keyboard users.

### Zoom test

Test the page in 200% and 400% zoom. If the page is not usable or elements are overlapped, the changes must be fixed before continuing.

### Icons and images

If the patch uses icons or images, check if they has a proper `alt` text.

Most icons should have an empty alt text for icons, particularly in interactive containers such as buttons or links. This will assist mouse users, particularly when hovering over the icon button/link, which will display a tooltip without hovering over the icon itself.

Decorative images should have an empty alt text (alt=""). In contrast, icons should have a descriptive alt text unless the alt text will be redundant with the surrounding elements.

### Buttons

Buttons with no comprehensive text should have an `aria-label` or `aria-labelledby` attribute.

However, for the buttons with only icons:

- The icon itself should have an empty `alt` attribute so assistive technologies will ignore it.
- Extra text must added to the button using a `span` with the `sr-only` class. This text will be only visible for assistive technologies.

```html title="An example of a button with a descriptive sr-only text"
<button type="button" class="btn btn-primary">
  <img src="./pix/add_user.png" alt="">
  <span class="sr-only">Add a new user</span>
</button>
```

```html title="Another example using fontawesome icons"
<button type="button" class="btn btn-primary">
  <i class="icon fa-user-plus fa-fw " aria-hidden="true"></i>
  <span class="sr-only">Add a new user</span>
</button>
```

### Visible focus

All focusable elements should have a visible focus indicator that should be **different** from the default browser focus indicator. The focus indicator should be visible in all states (normal, hover, focus, active, disabled).

By default, Moodle overrides the focus indicator of most HTML elements to ensure accessibility. However, in some cases, it is necessary to add extra CSS rules to ensure the focus indicator is visible and has enough contrast. For those cases, Moodle provides some CSS helpers:

- Adding `aalink` to a link (or any other element acting as a link) will ensure the focus indicator is visible.
- The CSS class `focus-visible` should be used to ensure the focus indicator is only visible when the element is focused using the keyboard.
- In action menus or action menu sub panels, you can use `dropdown-item-outline` to ensure the focus indicator is visible on all the item and not only in the link element within.

### Page headers and title

Each new page should have a specific and descriptive page title.

:::info Example

Use "Settings in forum ACTIVITYNAME" instead of just "Activity settings".

:::

Each page should have one, and only one, `H1` element. The test of the title should be as descriptive and specific as possible.

Most assistive technologies can enumerate the page titles. To ensure the structure is clear, it is mandatory that all headers follow an strict heading hierarchy. For example, a `H2` element should not be followed by a `H4` element.

You can read more information about page titles in this [Accessibility policies page section](../../policies/accessibility/index.md#page-titles).

## Usability accessibility Checks

Some more checks related to the changes:

### Do the UI uses colors or icons to indicate states or relevant information?

If yes, it should provide an alternative textual alternative compatible for assistive technologies.

Usually, this means adding a text in the same element (for example, a badge text); or adding a `description`, `title` or `alt` attribute depending on the HTML element.

### Do all links in the page have a correct descriptive text?

The readable text of the link should be descriptive enough to understand the link purpose without the need to read the surrounding text. For example, avoid using "click here" or "more" as link text, instead use "Click here to read more about the accessibility guidelines".

Another important aspect is to ensure the link text is unique. If there are two links with the same text, it can be confusing for screen reader users. In those cases, it is recommended to add some extra text to the link to make it unique, read below to know how to do it.

In some cases, parts of the link text can be hidden using CSS so it is only readable by assistive technologies. To do so you can use several methods:

- Add a span with `sr-only` class to the element. The `sr-only` class is only visible for assistive technologies.
- If parts of the link meaning is represented by an icon, add an `alt` text to the icon so it will be read with the rest of the link text.

### Is CSS ordering elements different than DOM?

If yes, it can cause unexpected behaviour for keyboard users. The patch should provide an ad-hoc keyboard navigation using an AMD module.

### When the new elements are focused, do the down and tab keys still work in the default way?

If not means the code has a pointer cancellation. In this case the patch should implement a proper custom component pattern. See [Review Custom Components](#review-custom-components) for more information.

### Does Any of the elements have a CSS animation?

If yes, it is recommended the patch should provide a way to stop the animation.

From Moodle 4.3 onwards, any CSS animation could be marked as optional by importing the `optional-animation` SCSS mixin.

### Does the patch adds tabindex="0" to any element?

If yes, there are a few things you need to check:

- If the element is a link, a button or a form control, then the `tabindex` should be removed.
- Otherwise, the element should also provide a proper `role` attribute to indicate the assistive technology how to interact with it. For example, if the element acts a a button it should have a `role="button"` attribute.

### Does the page use visuals like empty space, indentations or colors to represent structure or precedence?

If yes, then this structure should also be represented in the HTML (nested lists, or by adding [`role="list"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/List_role)) or using explanatory
textual elements.

### Does the page have elements that only appear on hover or focus?

If yes, then the patch should provide a way to make those elements visible for keyboard users.

Disappearing elements should be avoided when possible. However, in some pages decluttering the UI is necessary. In those cases, Moodle provides some CSS helpers to ensure the element will still be visible for keyboard users:

1. Add a `focus-control` class to the parent container. It is important the parent container has some visible focus element (for example, a link or a button), otherwise it cannot be browsable using the keyboard.
2. Add `v-parent-focus` to all elements that should appear only when the parent container has a focus within.

## Review Custom Components

Custom JavaScript keyboard controls should be implemented when creating custom interactive elements using non-interactive HTML elements, or when dealing with complex widgets like tabs, modals, or custom select menus. However, these custom controls should mimic the standard browser navigation as closely as possible.

Conduct an in-depth review focusing on proper usage of ARIA roles and attributes, keyboard accessibility, and interaction feedback. Any custom component should fit one of the [patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) defined by the ARIA Authoring Practices Guide.

### Review Dynamic Content

If the patch partially update the page content using JavaScript, check:

- If the changes are announced to screen readers. This can be done by using the [`aria-live`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live) attribute.
- While the element is updating, the element should have a [`aria-busy="true"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy) attribute to prevent the user from interacting with the element until the update is finished. Once the update is finished, the attribute should be removed.
- The focus is managed correctly. For example, if the focus is moved to a new element, the focus should be moved back to the original element when the new content is removed.

You can read more about dynamic content in the [ARIA live regions reference documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).

## Forms checks

Unless custom forms fields are used, all moodleforms are considered accessible.

When a patch introduce adhoc forms, it is important they follow the [forms guidelines](../../policies/designing-usable-forms.md).

### Checks for custom forms (not using moodleforms)

- All form fields should have an `id` attribute and a `label` elements with the same value in the `for` attribute. The label can be visible or hidden using CSS, but it should be present in the HTML.
- The form should be usable with the keyboard only. This means that all form fields should be focusable and the form should be submittable using the keyboard only.
- If the form have data validation:
  - The error messages should be visible and announced.
  - The messages should be clear and descriptive.

## Provide Feedback

If any accessibility issues are found, provide constructive feedback. Explain the issue, why it's a problem, and how it can be fixed. If possible, provide references to the relevant WCAG guidelines.

Remember, the goal of accessibility is to ensure that everyone, regardless of their abilities or disabilities, can use and interact with web content. This workflow is designed to help developers ensure that their changes meet this goal.

## More advanced checks

Once you control all the points in this checklist, you can read the [Deque University Web Accessibility Checklist](https://dequeuniversity.com/checklists/web/) to learn more about accessibility in Moodle.
