---
title: Coding guidelines
tags:
  - Accessibility
  - Coding guidelines
keywords:
  - accessibility
  - accessibility coding guidelines
---

All features in Moodle _must_ be accessible to all users regardless of their abilities. Therefore, accessibility must be built in from the planning and design stage through to development and testing, to ensure we release features that are accessible by default.

## Semantic HTML

It is highly recommended to use [semantic HTML](https://developer.mozilla.org/en-US/curriculum/core/semantic-html/). Doing so is important because using HTML elements for their intended purpose (for example, using `<button>` for a button and `<h1>` for a main heading) provides essential information to assistive technologies like screen readers. This helps users of these technologies understand and interact with the user interface components effectively.

In addition, using semantic HTML for interactive elements, such as buttons, links, and form controls, allows you to leverage the built-in keyboard support in browsers.

Moodle supports HTML5, so incorporating semantic HTML5 elements when building the user interface for your plugin or core contribution is a significant step towards ensuring accessibility.

<ValidExample title="Using semantic button element">

Below are some examples of using a semantic HTML button element in Mustache templates.

- A button labelled by the button's text.

```html
<button type="button" class="btn btn-secondary">
    {{#str}} deletecategory, customfield, {{name}} {{/str}}
</button>
```

- An icon button labelled by its `aria-label` attribute.

```html
<button type="button" class="btn icon" aria-label="{{#str}} deletecategory, customfield, {{name}} {{/str}}">
    {{#pix}} t/delete, core {{/pix}}
</button>
```

- An icon button with a visually hidden text label.

```html
<button type="button" class="btn btn-icon">
    {{#pix}} t/delete, core {{/pix}}
    <span class="visually-hidden">
        {{#str}} deletecategory, customfield, {{name}} {{/str}}
    </span>
</button>
```

</ValidExample>

:::warning Using non-semantic HTML: A link element as a button

Consider the following example where a link element is used as a button:

```html
<a href="#" class="btn btn-secondary" role="button">
    {{#str}} deletecategory, customfield, {{name}} {{/str}}
</a>
```

For assistive technologies to properly recognise the link element as a button, we need to set a value of `button` for the `role` attribute. Additionally, as specified in the [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/button/), buttons are activated when pressing `Space` or `Enter` keys. Given that links are natively activated by pressing the `Enter` key only, links that act as buttons need to implement an event handler in JavaScript for the `Space` key press event.

:::

## Accessible Rich Internet Applications (ARIA)

ARIA is a set of special attributes added to HTML to improve accessibility. It bridges the gap between HTML's native accessibility and the complex interactions of modern web applications.

ARIA helps assistive technologies, like screen readers, understand dynamic and interactive web content.

It defines:

- Role (`toolbar`, `tooltip`, `button`, `menu`, `dialog`, etc.)
- States (`aria-expanded`, `aria-hidden`, etc.)
- Properties (`aria-haspopup`, `aria-label`, `aria-describedby`, etc.)

to communicate what elements are and how they behave, and it is especially useful for making custom widgets and dynamic content accessible.

### When to use ARIA?

We typically use ARIA when creating interactive widgets for which there is no native HTML equivalent. Some examples include autocomplete form elements, searchable combo boxes, dropdown menus, and tabbed interfaces.

We also use ARIA attributes to clarify relationships between elements on the page or their states. For example, we need to display a validation error message on a form field. We then use the `aria-describedby` attribute to indicate that the error message pertains to the form field with the invalid input.

Another use of ARIA attributes is to enhance dynamic content updates, such as defining `aria-live` regions on parts of the page that are updated dynamically. This is especially important for assistive technology users, so they are promptly notified of changes when performing actions on the page.

### What ARIA is not

ARIA is not a replacement for semantic HTML. Sure, we can create a button element using a `<span>` tag and assign it an ARIA role of `button`, but we already have the semantic `<button>` HTML element that works out of the box. We should use semantic HTML as much as possible and utilise ARIA as necessary to further enhance the element.

There's also a common misconception that adding ARIA attributes to custom widgets will make them automatically accessible. This is not the case. We need to write JavaScript to:

- Ensure that the custom widget is operable by keyboard-only users
- Manage keyboard focus so users will know where they are as they operate the custom widget
- Update ARIA states and properties as needed
  - For example, updating a menu button's `aria-expanded` attribute to let screen reader users know whether the button is collapsed or expanded.

ARIA attributes also do not affect visual styling. For example, we have a [listbox widget](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) and update the `aria-selected` attribute of the currently selected list item via JavaScript. This is great for screen reader users because they can tell which list item is selected via the `aria-selected` attribute. However, the `aria-selected` attribute does not affect the listbox items' visual styling. So we must ensure that we apply the appropriate CSS styles to indicate the current selection for sighted users.

There's a saying that "No ARIA is better than bad ARIA". We should remember not to overuse ARIA attributes. Improper use of ARIA attributes can lead to confusion and a worse user experience for assistive technology users.

<InvalidExample title="Using a <span> tag to create a button">

```html
<span class="btn btn-secondary" role="button" tabindex="0">
    {{#str}} deletecategory, customfield, {{name}} {{/str}}
</span>
```

For this to work and behave as a button, we need to do the following:

- Set a value of `button` for the `role` attribute.
- Implement event handlers in JavaScript for both `Space` and `Enter` key press events, in addition to the `click` event.
- Make the element focusable by adding a `tabindex` attribute with a value of `0`. This is because `<span>` elements are not natively focusable, so we need to add the `tabindex` attribute to include it in the page's tab sequence.
- Most likely, we'll also have to write extra CSS styles to make the appearance consistent with other native button elements.

</InvalidExample>

## Bootstrap

Moodle uses [Bootstrap](https://getbootstrap.com/) as its front-end framework. Bootstrap's pre-designed components make it easy for Moodle developers to build responsive user interfaces for Moodle core and plugins, and help us meet zoom-related accessibility requirements, such as the WCAG Success Criteria [1.4.10 Reflow (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and [1.4.4 Resize Text (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).

However, while Bootstrap's components are designed to be [operable by touch, mouse, and keyboard](https://getbootstrap.com/docs/5.3/getting-started/accessibility/), we need to ensure that the Bootstrap components we use are accessible enough to convey the intended functionality to assistive technology users. Where necessary, we need to implement additional JavaScript to update the relevant ARIA attributes or improve keyboard operability. The default Boost theme includes an `aria` JavaScript module that enhances the accessibility of Bootstrap components, such as dropdown menus, combo boxes, toolbars, etc.

## Developing accessible Moodle features

Moodle is committed to accessibility. As Moodle developers, we must ensure that the features that we create for Moodle and its plugins are designed and developed with accessibility in mind. Below are some ways to help you develop accessible features for your plugin or core contribution.

### Page titles

The page title is the first piece of information announced by screen readers when the page is loaded. Therefore, it is essential to ensure that page titles are unique, concise, and informative enough to convey the page's purpose without requiring the user to read the content.

Some tips for providing a meaningful page title:

1. **Accurate and informative**
   - Describe the page's content or purpose; reflect any change of context (for example, search results).
2. **Concise**
   - Keep it brief while still being meaningful.
3. **Unique**
   - Each page title should be distinct within the site.
4. **Front-loaded**
   - Put the most identifying information first (Example: "`Gradebook setup | Physics 101`" rather than "`Physics 101 | Gradebook setup`").

:::note change of context

(not to be confused with Moodle's `\core\context` class and its implementations)

According to the [WCAG Understanding docs](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html#dfn-changes-of-context), a change in context is a major change that, if made without user awareness, can disorient users who are not able to view the entire page simultaneously. It can include changes of user agent, viewport, focus, or content that changes the meaning of the web page.

:::

#### Example

Consider that a student is on the submission page of an assignment activity called `Kinetics problem set 1` in the `Physics 101` course on the `Mount Orange School` Moodle site.

Then a suitable page title for the page would be something like:

<ValidExample>

The most unique identifying information first represented by the activity name and its sub-page, then followed by broader identifiers such as the course name and the site name.

`Kinetics problem set 1: Submit assignment | Physics 101 | Mount Orange School`

</ValidExample>

<ValidExample>

The most unique identifying information first represented by the name of the sub-page, followed by the activity name that the page belongs to, then followed by broader identifiers such as the course name and the site name.

`Submit assignment | Kinetics problem set 1 | Physics 101 | Mount Orange School`

</ValidExample>

#### Separating components of a page title

To separate the components of the page title, use the `moodle_page::TITLE_SEPARATOR` constant.

<ValidExample>

```php
[$course, $cm] = get_course_and_cm_from_cmid($id);
// Activity name and its sub-page as the unique identifying information.
$pagename = format_string($cm->name) . ': ' . get_string('view');
// Course name.
$coursename = format_string($course->fullname);
// Set the page title, combining the activity page's name and course name using the title separator constant.
$PAGE->set_title($pagename . moodle_page::TITLE_SEPARATOR . $coursename);
```

</ValidExample>

#### Site name on the page title

There is no need to add the name of the site when setting the page title using `$PAGE->set_title()`. The site name is automatically appended to the end of the page title in the correct format when using `$PAGE->set_title()`.

:::info

Administrators can use the `sitenameinititle` configuration setting to configure how this is shown in the title with possible options including:

- the _full name_ of the site, for example, "Mount Orange School"
- the _short name_ of the site, for example: "MOS"

This is automatically handled by `$PAGE->set_title()`.
:::

#### Useful resources

- [Understanding Success Criterion 2.4.2: Page Titled (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/page-titled)
- [Technique G88: Providing descriptive titles for Web pages](https://www.w3.org/WAI/WCAG22/Techniques/general/G88)

### Headings

A proper heading structure on a page helps screen reader users navigate the page easily by heading. To enable this, we must use semantic headings, such as `h1`-`h6` heading tags. We should not use fake headings, which are text designed to look like headings via CSS but lack semantic meaning.

We should also ensure that the page does not skip headings. For example, the page has an `h1` heading, but the next heading is `h3`. This can cause confusion among screen reader users who navigate the page by heading.

We also must ensure that there is only one `h1` page heading. Ideally, the page heading reflects the page title.

We set the page heading by calling `$PAGE->set_heading()` and outputting it on the header via `$OUTPUT->header()`.

We can set successive headings using the `$OUTPUT->heading()` method.

<ValidExample title="Setting page headings">

```php
// Set the page's main heading (h1).
$PAGE->set_heading(format_string($course->fullname));
// Output the page header that contains the main heading.
echo $OUTPUT->header();

// Output a level 2 heading.
echo $OUTPUT->heading(get_string('pluginname', 'mod_yourmodulename'));

// Output a level 3 heading.
echo $OUTPUT->heading(get_string('someheading', 'mod_yourmodulename'), 3);
```

</ValidExample>

#### Useful resources

- [Understanding Success Criterion 1.3.1: Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- [Understanding Success Criterion 2.4.6: Headings and Labels (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)

### Colours and contrast

All text must be displayed in a colour with sufficient contrast against its background colour so that it is legible for all users. The required contrast ratio depends on the size of the text:

- **Normal text** (under 18pt, or under 14pt if bold): a contrast ratio of at least **4.5:1**.
- **Large text** (18pt and above, or 14pt and above if bold): a contrast ratio of at least **3:1**.

For more information about testing colour contrast, check out the [Accessibility testing > Colour contrast checkers](./testing#colour-contrast-checkers) developer documentation.

#### Do not rely on colour alone to convey meaning

Colour alone **must not** be used to convey information, indicate an action, prompt a response, or distinguish a visual element. When colour is used to communicate meaning, an additional visual cue (such as text, an icon, or a pattern) must also be provided.

<InvalidExample title="Using colour alone to indicate an error">

In this example, the error message is styled in red via the `.text-danger` CSS class, but there is no other indication that it represents an error. Users who cannot perceive colour differences may not recognise the message as an error.

```html
<p class="text-danger">The username field is required.</p>
```

</InvalidExample>

<ValidExample title="Using colour combined with an icon and text to indicate an error">

In this example, the error message includes an error icon and is explicitly prefixed with "Error:" in addition to being styled in red. This provides multiple cues to convey the error state.

```html
<p class="text-danger">
    {{#pix}} i/invalid, core {{/pix}}
    Error: The username field is required.
</p>
```

</ValidExample>

#### Useful resources

- [Understanding Success Criterion 1.4.3: Contrast (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Understanding Success Criterion 1.4.1: Use of Color (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)

### Icons

Icons in Moodle are typically used as part of an interactive element, such as a button or a link, to visually represent the action that will be performed when the element is activated. Icons within interactive elements are considered decorative content and should be hidden from assistive technologies. The accessible name should be placed within the button or link itself. This can be achieved using an `aria-label` attribute, or a visually hidden text label within the element itself and not the icon's markup.

<ValidExample title="Icon link with visually hidden text in a Mustache template">

In this example, leaving the `alt` parameter of the `pix` helper empty ensures that the icon is hidden from screen readers. The accessible name for the link is provided by the visually hidden text within the link.

```html
<a href="{{url}}">
    {{#pix}} i/settings, core {{/pix}}
    <span class="visually-hidden">
        {{#str}} settings, core {{/str}}
    </span>
</a>
```

</ValidExample>

<ValidExample title="Icon button with an aria-label attribute">

```html
<button type="button" class="btn btn-icon" aria-label="{{#str}} delete, core {{/str}}">
    {{#pix}} t/delete, core {{/pix}}
</button>
```

</ValidExample>

<ValidExample title="A link that opens in a new window with a decorative icon">

This example markup for a link that opens in a new window uses a decorative icon as an indication for sighted users that clicking on it will open the link in a new window. For screen reader users, the visually hidden text lets them know that it opens in a new window.

```html
<a href="{{url}}" target="_blank" rel="noopener">
    {{linkname}}
    {{#pix}} i/externallink, core {{/pix}}
    <span class="visually-hidden">
        {{#str}} opensinnewwindowbracketed, core {{/str}}
    </span>
</a>
```

</ValidExample>

#### Informative icons

In some cases, an icon may be used to provide additional information that is not already conveyed by the text. For example, an icon next to a form field label to indicate that the field is required. In this case, the icon should have an appropriate accessible name to convey its meaning.

<ValidExample title="An informative icon with an aria-label attribute">

This example passes a `required` language string to the Mustache `pix` helper for the icon's accessible name.

```html
<span>
    {{#pix}}req, core, {{#str}} required, core {{/str}}{{/pix}}
</span>
```

This renders an icon with an accessible name "Required" (or the equivalent in the user's language), and is visible to assistive technologies, such as screen readers.

```html
<i class="icon fa fa-circle-exclamation text-danger fa-fw " title="Required" role="img" aria-label="Required"></i>
```

</ValidExample>

#### Target size

It is important to ensure that an icon button's/link's target size (the clickable/touch area) is large enough and has sufficient spacing around it so that it can be easily activated by mouse, touch, and other pointer inputs.

- The minimum target size for interactive elements is **24 by 24 CSS pixels**, as specified by [WCAG 2.2 Success Criterion 2.5.8: Target Size (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- For an enhanced experience, a target size of **44 by 44 CSS pixels** is recommended, as outlined in [WCAG 2.2 Success Criterion 2.5.5: Target Size (Enhanced) (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html).

#### Useful resources

- [Understanding Success Criterion 1.1.1: Non-text Content (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [Understanding Success Criterion 2.5.8: Target Size (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

### Keyboard support

All interactive components must be fully operable through a keyboard-only interface. This ensures that users who cannot use a mouse, including those who rely on assistive technologies, can access and interact with all features.

Some important things to keep in mind:

- All interactive components must be focusable via the keyboard (that is, they are reachable using the `Tab` key).
- It must be possible to move focus away from any component using only the keyboard. A component must never "trap" focus.
  - For example, if a modal dialogue is open, the user should be able to close it (for example, by pressing `Escape` or activating a `Close` button) and return focus to the element that triggered the dialogue using only the keyboard.
- The element that currently has focus must have a visible focus indicator.

#### The `tabindex` attribute

The `tabindex` attribute controls whether and how an element participates in the tab sequence. Only the following values should be used:

- `tabindex="0"`: Adds the element to the natural tab order. Use this when a non-interactive element (such as a `<div>` or `<span>`) needs to be focusable. Interactive elements like `<button>`, `<a>`, and `<input>` are already focusable by default and do not need `tabindex="0"`.
- `tabindex="-1"`: Removes the element from the tab order but allows it to be focused programmatically via JavaScript (using `element.focus()`). This is useful for managing focus within custom widgets.

:::warning Avoid positive `tabindex` values

Using `tabindex` values greater than `0` (for example, `tabindex="1"`, `tabindex="5"`) is an anti-pattern. Positive values override the natural tab order, making keyboard navigation unpredictable and confusing, especially for sighted keyboard users who expect focus to follow the visual layout.

:::

#### Visible focus indicators

The element that currently has keyboard focus must have a clearly visible focus indicator. Moodle overrides the default browser focus styles on most elements to ensure sufficient visibility.

However, when creating custom components, you may need to add additional CSS rules or use CSS utility classes for rendering accessible focus indicators, such as `.aalink` and `.aabtn` classes.

#### Focus management in composite components

In some cases, a single component contains many smaller focusable elements (for example, a toolbar with multiple buttons). To keep the tab sequence manageable, only the parent component should exist in the tab order. Focus among child elements should then be managed using arrow key navigation. This can be implemented using either the **roving `tabindex`** technique or the **`aria-activedescendant`** technique.

For more information, see the W3C's guidance on [keyboard navigation inside components](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#keyboardnavigationinsidecomponents).

#### Useful resources

- [Understanding Success Criterion 2.1.1: Keyboard (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [Understanding Success Criterion 2.1.2: No Keyboard Trap (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)
- [Understanding Success Criterion 2.4.7: Focus Visible (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [ARIA APG: Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

### Links

Links should have descriptive, meaningful text that clearly conveys the purpose of the link without requiring the surrounding context. Avoid generic link text such as "click here", "read more", "more info", "learn more," or "here".

<InvalidExample title="Non-descriptive link text">

```html
<p>
    To learn about accessibility guidelines, <a href="{{url}}">click here</a>.
</p>
```

</InvalidExample>

<ValidExample title="Descriptive link text">

```html
<p>
    Learn more about the <a href="{{url}}">Moodle accessibility coding guidelines</a>.
</p>
```

</ValidExample>

If multiple links on the same page share identical visible text but point to different destinations, add visually hidden text to make each link unique for screen reader users.

<ValidExample title="Adding visually hidden text to differentiate links">

```html
<a href="{{url1}}">
    {{#str}} view, core {{/str}}
    <span class="visually-hidden">{{activityname1}}</span>
</a>

<a href="{{url2}}">
    {{#str}} view, core {{/str}}
    <span class="visually-hidden">{{activityname2}}</span>
</a>
```

</ValidExample>

#### Useful resources

- [Understanding Success Criterion 2.4.4: Link Purpose (In Context) (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- [Technique G91: Providing link text that describes the purpose of a link](https://www.w3.org/WAI/WCAG22/Techniques/general/G91)

### Forms

Moodle forms created with the standard [Moodle Forms API (moodleform)](/docs/apis/subsystems/form) are designed to be accessible. However, any custom form, whether built in PHP, JavaScript, or a Mustache template, must also meet accessibility requirements.

#### Form labels

Every form field must have a corresponding label.

There are several ways to label form elements:

| Method                                   | Visibility                         | Recommended?                                          | Notes                                                                                                                                         |
|:-----------------------------------------|:-----------------------------------|:------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|
| **Explicit `<label>`** (with `for`/`id`) | Visible                            | ✅ **Yes** (Best method)                               | Creates unambiguous association; clicking label focuses the input; broadest support across browsers and assistive technologies                |
| **Implicit `<label>`** (wrapping input)  | Visible                            | ⚠️ Acceptable                                         | Support may vary across some assistive technology and browser combinations                                                                    |
| **`aria-labelledby`**                    | Visible (references existing text) | ⚠️ Use when using a `<label>` element is not possible | Clicking the referenced text does NOT focus the input; useful for complex labeling situations                                                 |
| **`aria-label`**                         | Invisible                          | ⚠️ Use sparingly                                      | Completely invisible to sighted users; useful only for screen reader users; appropriate when no visible label is needed (e.g., search fields) |
| **`title` attribute**                    | Invisible (tooltip on hover)       | ⚠️ Generally not recommended                          | Tooltip display on keyboard focus may be inconsistent across browsers; intended for extra, non-essential information                          |
| **`placeholder`**                        | Visible (until user types)         | ❌ **Highly discouraged**                              | Disappears when typing; default styling fails contrast; intended for hints, not labels                                                        |

<ValidExample title="A text input with a visible label">

```html
<label for="username">{{#str}} username, core {{/str}}</label>
<input type="text" id="username" name="username">
```

</ValidExample>

#### Keyboard operability

All form fields must be focusable and operable using only the keyboard. The form must be submittable without a mouse.

#### Error identification and messaging

When a form field contains an invalid entry:

- The field should be marked with `aria-invalid="true"` to indicate its invalid state to assistive technologies.
- The error message should be programmatically associated with the field using the `aria-describedby` attribute, so that screen readers announce the error when the field receives focus.
- Error messages must be visible, clear, and descriptive, explaining what went wrong and how to fix it.

<ValidExample title="A form field with an associated error message">

```html
<label for="email">{{#str}} email, core {{/str}}</label>
<input type="email" id="email" name="email" aria-invalid="true" aria-describedby="email-error">
<span id="email-error" class="text-danger">
    {{#str}} invalidemail, core {{/str}}
</span>
```

</ValidExample>

#### Useful resources

- [Understanding Success Criterion 1.3.1: Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- [Understanding Success Criterion 3.3.1: Error Identification (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [Understanding Success Criterion 3.3.2: Labels or Instructions (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)

### Decorative content

Any component that is purely decorative — meaning it conveys no information or functionality that is not already provided by other elements on the page — can be hidden from assistive technologies.

To hide decorative content from screen readers, use one of the following techniques:

- Set `aria-hidden="true"` on the element.
- Set `role="presentation"` (or `role="none"`) on the element.
- For images, set an empty `alt` attribute (`alt=""`).

<ValidExample title="Hiding a decorative image from assistive technologies">

```html
<img src="decorative-banner.png" alt="">
```

</ValidExample>

:::note A layout table

Before the days of responsive CSS, tables in Moodle were often used for page layout. When using tables for layout purposes, the table must be hidden from assistive technologies by adding `role="presentation"` to the `<table>` element.

```html
<table role="presentation">
    <tr>
        <td>{{definition}}</td>
        <td>{{#str}}byname, core, {{authorname}} {{/str}}</td>
    </tr>
    <tr>
        <td colspan="2">{{description}}</td>
    </tr>
</table>
```

**Note**: This is for example purposes only of the use of the `presentation` role. Please avoid using layout tables in your Moodle code. Layout tables are discouraged because they misuse semantic markup and can confuse users. Modern CSS layout techniques are the preferred approach.

:::

:::warning

Only use these techniques on truly decorative content. Hiding meaningful content from assistive technologies will make the interface inaccessible to screen reader users.

:::

#### Useful resources

- [Understanding Success Criterion 1.1.1: Non-text Content (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [WCAG definition of "pure decoration"](https://www.w3.org/TR/WCAG22/#dfn-pure-decoration)

### Landmark regions

The layout of each page should be divided into meaningful landmark regions, where each region has the correct landmark role and a unique label. Landmarks help screen reader users understand the structure of the page and quickly navigate to different sections.

Common landmark roles include:

| Role            | HTML element | Purpose                                         |
|-----------------|--------------|-------------------------------------------------|
| `banner`        | `<header>`   | The site-wide header area.                      |
| `navigation`    | `<nav>`      | A group of navigation links.                    |
| `main`          | `<main>`     | The primary content of the page.                |
| `complementary` | `<aside>`    | Supporting content related to the main content. |
| `contentinfo`   | `<footer>`   | The site-wide footer area.                      |
| `search`        | `<search>`   | A search functionality.                         |

When multiple landmarks of the same type exist on a page (for example, multiple `<nav>` elements), each must have a unique accessible label using `aria-label` or `aria-labelledby` to distinguish them.

<ValidExample title="Labelling multiple navigation landmarks">

```html
<nav aria-label="{{#str}} sitemenubar, admin {{/str}}">
    <!-- Site navigation links -->
</nav>
<nav aria-label="{{#str}} course, core {{/str}}">
    <!-- Course navigation links -->
</nav>
```

</ValidExample>

:::note

In Moodle, landmark regions are typically defined in the layout files of the theme. When building pages or components, ensure your content is placed within the appropriate landmark region.

:::

#### Useful resources

- [ARIA Landmarks Example](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/general-principles.html)
- [Understanding Success Criterion 1.3.1: Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)

### Dynamic content

When parts of a page are updated dynamically via JavaScript (for example, loading search results, updating a status message, or refreshing a list), it is important to ensure that these changes are communicated to assistive technology users.

#### Live regions

Use ARIA live regions to announce dynamic content changes to screen readers. A live region is defined by adding the `aria-live` attribute to a container element. When the content within that container changes, screen readers will announce the update.

- `aria-live="polite"`: The update is announced when the user is idle. Use this for non-urgent updates.
- `aria-live="assertive"`: The update is announced immediately, interrupting the user's current task. Use this sparingly, only for urgent information such as error messages or time-sensitive alerts.

<ValidExample title="A status message container using a polite live region">

```html
<div aria-live="polite" id="status-message">
    <!-- Status updates will be announced to screen readers when inserted here. -->
</div>
```

</ValidExample>

#### Busy states

While content within a live region is being updated, set `aria-busy="true"` on the container to prevent screen readers from announcing intermediate or incomplete updates. Once the update is complete, remove the attribute or set it to `false`.

<ValidExample title="Using aria-busy during a content update">

```html
<div aria-live="polite" aria-busy="true" id="results-container">
    <!-- Content is loading... -->
</div>
```

Once the content has finished loading:

```html
<div aria-live="polite" aria-busy="false" id="results-container">
    <!-- Updated results are displayed here. -->
</div>
```

</ValidExample>

#### Focus management

When dynamic updates significantly change the page content (for example, opening a modal dialog or navigating to new content), focus must be managed appropriately:

- Move focus to the new content so the user is aware of the change.
- When the new content is dismissed (for example, closing a modal), return focus to the element that triggered the change.

#### Useful resources

- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [Understanding Success Criterion 4.1.3: Status Messages (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)

### Advanced UX widgets

When building advanced interactive components that rely on JavaScript (such as custom dropdown menus, tabbed interfaces, tree views, or modal dialogs), a set of accessibility principles must be applied to ensure the feature provides equal functionality and information to all users.

Each custom widget should:

- Be fully operable using only the keyboard.
- Map to a recognised widget pattern from the [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/).
- Implement all keyboard interactions described in the relevant APG pattern.
- Use the correct WAI-ARIA roles, states, and properties as specified for that pattern.

<ValidExample title="A tab interface implementing the ARIA Tabs pattern">

The following example demonstrates the expected ARIA roles, states, and properties for a tabbed interface following the [APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

```html
<div role="tablist" aria-label="{{#str}} coursetabs, core {{/str}}">
    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
        {{#str}} overview, core {{/str}}
    </button>
    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">
        {{#str}} grades, core {{/str}}
    </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    <!-- Tab 1 content -->
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
    <!-- Tab 2 content -->
</div>
```

In addition to the HTML structure, the following keyboard interactions must be implemented in JavaScript:

- `Left Arrow` / `Right Arrow`: Move focus between tabs.
- `Home` / `End`: Move focus to the first or last tab.
- `Space` or `Enter`: Activate the focused tab.

</ValidExample>

#### Useful resources

- [ARIA Authoring Practices Guide (APG) Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [ARIA APG: Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

### CSS and visual presentation

CSS choices can have a direct impact on accessibility. The following areas require particular attention.

#### Zoom and reflow

Pages must remain usable when zoomed to 200% and 400%. Content should reflow into a single column at 400% zoom without horizontal scrolling or overlapping elements. Using Bootstrap's responsive grid system and relative units (such as `rem` and `em`) helps meet this requirement.

#### CSS order versus DOM order

If CSS is used to visually reorder elements differently from the DOM order (for example, using `order` in Flexbox or Grid), keyboard navigation will still follow the DOM order. This discrepancy can confuse keyboard users. Ensure that the visual order matches the DOM order, or provide custom keyboard navigation to account for the difference.

#### Animations

CSS animations and transitions can cause discomfort for users with vestibular disorders. From Moodle 4.3 onwards, CSS animations can be marked as non-essential by using the `optional-animation` SCSS mixin, which respects the user's `prefers-reduced-motion` system setting.

#### Useful resources

- [Understanding Success Criterion 1.4.4: Resize Text (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [Understanding Success Criterion 1.4.10: Reflow (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Understanding Success Criterion 2.3.3: Animation from Interactions (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

## External resources

<!-- cspell:ignore ATAG -->
<!-- cspell:ignore Deque -->
<!-- cspell:ignore UAAG -->

- [W3C Accessibility Standards Overview](https://www.w3.org/WAI/standards-guidelines/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [Authoring Tool Accessibility Guidelines (ATAG) 2.0](https://www.w3.org/TR/ATAG20/)
- [User Agent Accessibility Guidelines (UAAG) 2.0](https://www.w3.org/TR/UAAG20/)
- [WebAIM: Web Accessibility In Mind](https://webaim.org/)
- [Deque University Web Accessibility Checklist](https://dequeuniversity.com/checklists/web/)
