---
title: Accessibility checklist
tags:
  - Processes
  - Integration
  - Accessibility
sidebar_position: 4
---

<!-- cspell:ignore Deque -->

This checklist helps reviewers perform an accessibility review of a patch. It is designed to be used alongside the [Accessibility coding guidelines](../../policies/accessibility/coding-guidelines.md) and the [Accessibility testing](../../policies/accessibility/testing.md) documentation.

:::tip Before you start: identify the nature of the changes

- **Backend only** (web services, database, events, hooks)? → No accessibility review needed.
- **Changes to HTML, CSS, or JavaScript?** → Accessibility review is necessary. Use this checklist.
- **Only standard HTML elements, no custom behaviour?** → A quick check is recommended, but a full review may not be needed.

:::

## Quick-reference checklist

Use this as a quick scan. If any item fails or you are unsure, refer to the detailed section linked in each item.

### Automated

- [ ] Run [Axe DevTools](https://www.deque.com/axe/devtools/) or [WAVE](https://wave.webaim.org/) on the affected page(s). Fix any issues before continuing.

### Structure and semantics

- [ ] The page has a descriptive, unique **page title** with the most specific information first. ([Details](#page-title-and-headings))
- [ ] There is exactly one **`h1`** heading and the heading hierarchy has no skipped levels. ([Details](#page-title-and-headings))
- [ ] **Semantic HTML** elements are used (for example, `<button>` for buttons, `<nav>` for navigation). ([Details](#buttons))

### Keyboard and focus

- [ ] All interactive elements are **reachable and operable** using only the keyboard. ([Details](#keyboard-operability))
- [ ] No element uses `tabindex` greater than `0`. ([Details](#tabindex-values))
- [ ] Every focused element has a clearly **visible focus indicator**. ([Details](#visible-focus-indicators))
- [ ] No component **traps** keyboard focus. ([Details](#keyboard-operability))

### Visual presentation

- [ ] Text and interactive elements meet **colour contrast** requirements. ([Details](#colour-and-contrast))
- [ ] The page is **usable at 200% and 400% zoom** without overlap or horizontal scrolling. ([Details](#zoom-and-reflow))
- [ ] **Colour is not the only** means of conveying information. ([Details](#colour-and-contrast))
- [ ] CSS **visual order matches DOM order**, or custom keyboard handling compensates. ([Details](#css-order-versus-dom-order))
- [ ] CSS animations respect `prefers-reduced-motion`. ([Details](#animations))

### Content and alternatives

- [ ] **Icons** inside buttons/links are hidden from assistive technologies; the accessible name is on the interactive element. ([Details](#icons-and-images))
- [ ] Decorative images have `alt=""`. Informative images have meaningful alt text. ([Details](#icons-and-images))
- [ ] **Link text** is descriptive — no "click here" or "read more". ([Details](#link-text))
- [ ] **Buttons** without visible text have an accessible name (`aria-label` or visually hidden text). ([Details](#buttons))

### Dynamic content and custom widgets

- [ ] Dynamic updates use **`aria-live`** regions so screen readers are notified. ([Details](#dynamic-content))
- [ ] Custom widgets follow an [ARIA APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/) with correct roles, states, and keyboard interactions. ([Details](#custom-components))

### Forms

- [ ] Every form field has a **`<label>`** (with matching `for`/`id`). ([Details](#forms))
- [ ] Invalid fields use `aria-invalid` and error messages are linked via `aria-describedby`. ([Details](#forms))

---

## Detailed guidance

The sections below provide more context for each checklist item. For full explanations and code examples, refer to the [Accessibility coding guidelines](../../policies/accessibility/coding-guidelines.md).

### Run an automated check

Run an automated accessibility checker on the affected page(s) before starting the manual review:

- [Axe DevTools](https://www.deque.com/axe/devtools/) or [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- An HTML validator such as the [Nu HTML validator](https://validator.w3.org/nu/#textarea)

Any reported issues must be fixed before continuing with the manual review.

<details>
<summary>Related documentation</summary>

- [Accessibility testing > Automated testing](../../policies/accessibility/testing.md#automated-testing) — browser extensions, built-in dev tools, and Behat accessibility tests

</details>

### Page title and headings

- The page must have a descriptive, unique **page title**. The most specific information should come first (for example, "Submit assignment | Kinetics problem set 1 | Physics 101" rather than "Physics 101 | Activity").
- There must be exactly **one `h1`** heading on the page. It should reflect the page title.
- Headings must follow a **strict hierarchy** — no skipped levels (for example, `h2` followed directly by `h4`).

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Page titles](../../policies/accessibility/coding-guidelines.md#page-titles)
- [Coding guidelines > Headings](../../policies/accessibility/coding-guidelines.md#headings)

</details>

### Keyboard operability

- **Tab** through every interactive element on the page. Ensure all buttons, links, form fields, and custom widgets are reachable.
- **Activate** elements using `Enter` and/or `Space` as appropriate.
- Confirm that focus is **never trapped** — you must always be able to leave a component (for example, pressing `Escape` to close a modal).
- Complete typical user tasks using only the keyboard.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Keyboard support](../../policies/accessibility/coding-guidelines.md#keyboard-support)
- [Accessibility testing > Keyboard navigability and operability tests](../../policies/accessibility/testing.md#keyboard-navigability-and-operability-tests)

</details>

### `tabindex` values

- `tabindex` greater than `0` (for example, `tabindex="1"`) is **always wrong**. Only `0` and `-1` are acceptable.
- If `tabindex="0"` is on a natively focusable element (`<button>`, `<a>`, `<input>`, etc.), it should be removed.
- If `tabindex="0"` is on a non-interactive element, the element must also have an appropriate `role` (for example, `role="button"`).

<details>
<summary>Related documentation</summary>

- [Coding guidelines > The `tabindex` attribute](../../policies/accessibility/coding-guidelines.md#the-tabindex-attribute)

</details>

### Visible focus indicators

- Every interactive element must show a **clearly visible focus indicator** when focused via keyboard.
- Moodle overrides default browser focus styles. For custom components, use CSS utility classes such as `.aalink` and `.aabtn`, or add custom focus styles.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Visible focus indicators](../../policies/accessibility/coding-guidelines.md#visible-focus-indicators)
- [Accessibility testing > Keyboard navigability and operability tests](../../policies/accessibility/testing.md#keyboard-navigability-and-operability-tests)

</details>

### Colour and contrast

- Text and interactive elements must meet the required **contrast ratios** (4.5:1 for normal text, 3:1 for large text).
- Colour must **not be the only** means of conveying information. If colour indicates a state (for example, red for errors), an additional cue such as text or an icon must also be present.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Colours and contrast](../../policies/accessibility/coding-guidelines.md#colours-and-contrast)
- [Accessibility testing > Colour contrast checkers](../../policies/accessibility/testing.md#colour-contrast-checkers)

</details>

### Zoom and reflow

- Set the browser viewport to **1280px wide** and zoom to **200%**. Verify the page remains usable.
- Set the viewport to **320px wide** (or 1280px at **400% zoom**). Verify content reflows into a single column without horizontal scrolling or overlapping elements.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Zoom and reflow](../../policies/accessibility/coding-guidelines.md#zoom-and-reflow)
- [Accessibility testing > Reflow and resize text](../../policies/accessibility/testing.md#reflow-and-resize-text)

</details>

### CSS order versus DOM order

If CSS visually reorders elements (for example, using Flexbox `order`), keyboard navigation will still follow the DOM order. This discrepancy confuses keyboard users. Ensure the visual order matches the DOM order, or provide custom keyboard navigation.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > CSS order versus DOM order](../../policies/accessibility/coding-guidelines.md#css-order-versus-dom-order)

</details>

### Animations

CSS animations should respect the user's `prefers-reduced-motion` setting. From Moodle 4.3 onwards, use the `optional-animation` SCSS mixin to mark animations as non-essential.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Animations](../../policies/accessibility/coding-guidelines.md#animations)

</details>

### Icons and images

- **Icons inside buttons or links** (decorative): Hide the icon from assistive technologies (empty `alt`, or `aria-hidden="true"`). The accessible name should be on the button/link itself (`aria-label` or a `<span class="visually-hidden">`).
- **Informative icons** (conveying meaning not provided by surrounding text): Give the icon an accessible name (for example, via the `alt` attribute).
- **Decorative images**: Use `alt=""`.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Icons](../../policies/accessibility/coding-guidelines.md#icons)
- [Coding guidelines > Decorative content](../../policies/accessibility/coding-guidelines.md#decorative-content)

</details>

### Buttons

- Buttons without visible descriptive text must have an accessible name.
- For icon-only buttons, hide the icon from assistive technologies and provide the accessible name on the button using `aria-label` or a `<span class="visually-hidden">`.

```html title="Icon button with visually hidden text"
<button type="button" class="btn btn-primary">
    <i class="icon fa-user-plus fa-fw" aria-hidden="true"></i>
    <span class="visually-hidden">Add a new user</span>
</button>
```

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Semantic HTML](../../policies/accessibility/coding-guidelines.md#semantic-html)

</details>

### Link text

- Link text must clearly describe the link's purpose. Avoid "click here", "read more", "here", or "more info".
- If multiple links share the same visible text but go to different destinations, add visually hidden text to make each link unique.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Links](../../policies/accessibility/coding-guidelines.md#links)

</details>

### Custom components

When the patch introduces custom interactive widgets (for example, tabs, modals, dropdown menus), check that:

- The widget follows a recognised [ARIA APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/).
- All keyboard interactions from the APG pattern are implemented.
- The correct ARIA roles, states, and properties are used and updated via JavaScript.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Advanced UX widgets](../../policies/accessibility/coding-guidelines.md#advanced-ux-widgets)
- [Accessibility testing > Keyboard navigability and operability tests](../../policies/accessibility/testing.md#keyboard-navigability-and-operability-tests)
- [Accessibility testing > Screen reader testing](../../policies/accessibility/testing.md#screen-reader-testing)

</details>

### Dynamic content

If parts of the page are updated dynamically via JavaScript, check that:

- The container uses **`aria-live`** (`"polite"` for non-urgent updates, `"assertive"` for urgent ones) so screen readers announce changes.
- While loading, the container has **`aria-busy="true"`** (removed once complete).
- **Focus is managed** — if content is inserted, focus moves to it; if content is removed, focus returns to the triggering element.

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Dynamic content](../../policies/accessibility/coding-guidelines.md#dynamic-content)
- [Accessibility testing > Screen reader testing](../../policies/accessibility/testing.md#screen-reader-testing)

</details>

### Forms

Unless the patch uses custom form fields, Moodle forms (moodleforms) are already accessible. For **custom forms**, check:

- Every field has a **`<label>`** with a `for` attribute matching the field's `id`.
- The form is **fully operable by keyboard**.
- Invalid fields are marked with **`aria-invalid="true"`** and error messages are linked via **`aria-describedby`**.
- Error messages are **visible, clear, and descriptive**.

When a patch introduces ad-hoc forms, ensure they follow the [forms guidelines](../../policies/designing-usable-forms.md).

<details>
<summary>Related documentation</summary>

- [Coding guidelines > Forms](../../policies/accessibility/coding-guidelines.md#forms)

</details>

### Other visual checks

- **Visual structure**: If empty space, indentation, or colour is used to convey hierarchy, the same structure must be represented in the HTML (for example, nested lists, headings, or [`role="list"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/List_role)).
- **Hover/focus-only elements**: If elements only appear on hover, ensure keyboard users can also reveal them. Moodle provides the `focus-control` (on the parent) and `v-parent-focus` (on the child) CSS classes for this.

## Provide feedback

If accessibility issues are found, explain:

1. **What** the issue is.
2. **Why** it is a problem (who is affected).
3. **How** to fix it (with a reference to the relevant [WCAG success criterion](https://www.w3.org/TR/WCAG22/) or [coding guideline](../../policies/accessibility/coding-guidelines.md) section where possible).

## Further reading

- [Accessibility coding guidelines](../../policies/accessibility/coding-guidelines.md) — detailed guidance with code examples
- [Accessibility testing](../../policies/accessibility/testing.md) — automated and manual testing techniques
- [Deque University Web Accessibility Checklist](https://dequeuniversity.com/checklists/web/) — a more comprehensive general-purpose checklist
