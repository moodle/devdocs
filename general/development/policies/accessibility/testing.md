---
title: Accessibility testing
tags:
  - Accessibility
  - Accessibility testing
  - Automated testing
  - Behat
keywords:
  - accessibility
  - accessibility testing
  - behat
---

You should perform accessibility testing when introducing features or bug fixes involving user interface (UI) changes. Combining automated and manual accessibility testing is essential to ensure accessibility of code contributions to Moodle.

## Automated testing

### Browser extensions

The easiest way to check for common accessibility issues on the feature that you're working on is to use automated accessibility testing tools. There are browser extensions that can perform accessibility tests on a webpage, such as:

- [axe DevTools](https://www.deque.com/axe/devtools/extension)
- [WAVE Web Accessibility Evaluation Tools](https://wave.webaim.org/)

### Built-in browser development tools

In addition to browser extensions, web browsers such as Chrome and Edge include built-in tools to check webpages for accessibility issues.

- Google Chrome's [Lighthouse](https://developer.chrome.com/docs/lighthouse/) can audit webpages for performance, accessibility, progressive web apps, SEO, and more.
- Microsoft Edge's [Issues tool](https://learn.microsoft.com/en-us/microsoft-edge/devtools/issues/) also provides similar functionality to Lighthouse.

<!-- cspell:ignore Deque -->
### Accessibility tests using Behat

Moodle LMS uses Deque's open-source automated accessibility testing engine, [axe-core](https://github.com/dequelabs/axe-core), which allows us to run automated accessibility testing using Behat. To write accessibility tests on Behat, it is essential to add the `@accessibility` and `@javascript` tags to the test scenario.

#### Whole-page standard test

A standard Behat step to test the accessibility of the page that you're working on is:

```gherkin
And the page should meet accessibility standards
```

This step performs a whole-page test against WCAG 2.0, 2.1, and 2.2 Level A and Level AA standards.

#### With best-practice extra tests

It is also possible to specify extra tests on the accessibility Behat step. We highly recommend using the `best-practice` extra tests, which also assess the page for accessibility best practices, such as verifying proper heading levels.

```gherkin
And the page should meet accessibility standards with "best-practice" extra tests
```

#### Testing specific areas of the page

If you are introducing a UI change to a specific part of the page, you can also test only that part. In this case, you can specify the part of the page using the:

```gherkin
And the "<element>" "<selector>" should meet accessibility standards
```

#### Testing against specific rules

You may also test against specific [axe-core rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md) by listing them as comma-separated values, like below:

```gherkin
And the page should meet "wcag131, wcag141, wcag412" accessibility standards
```

#### An example of accessibility testing on Behat

<ValidExample title="Accessibility tests on the login page">

```gherkin
@javascript @accessibility
Scenario: The login page must meet accessibility standards
  Given the following config values are set as admin:
    | custommenuitems | -This is a custom item\|/customurl/ |
  When I am on site homepage
  Then the page should meet accessibility standards with "best-practice" extra tests
  And I follow "Log in"
  And the page should meet accessibility standards with "best-practice" extra tests
```

</ValidExample>

## Manual testing

It may be tempting to think that automated accessibility checks guarantee the page's accessibility. However, this is not the case. Automated accessibility tests typically cover about 30% to 50% of accessibility issues on a web page.

Combining manual accessibility testing with automated testing is essential to ensure the accessibility of the features that we implement in Moodle. Below are some examples of how we can manually test a page for accessibility issues.

### Keyboard navigability and operability tests

Ensuring that interactive elements, such as buttons, links, form elements, and custom JavaScript widgets, can be navigated to and operated with the keyboard is a strong indicator of accessibility. It helps users perform their tasks in Moodle without barriers.

Keyboard accessibility is crucial, particularly for users who rely on assistive technologies and primarily interact with content via the keyboard rather than a mouse. This includes:

- **Users who are blind or have low vision:** They use screen readers, which depend entirely on keyboard navigation to explore content.
- **Users with motor disabilities:** They are unable to use a mouse effectively and rely on keyboards, switch devices, or other input methods that mimic keyboard commands.
- **Users of voice recognition software:** This software frequently emulates standard keyboard commands for interaction.

Some practical tips to test for keyboard navigability and operability:

- **Navigate the page using the keyboard only**
  - Press `Tab` or `Shift-Tab` to navigate between interactive elements, such as buttons, links, form elements, and custom widgets.
  - Pressing `Enter` or `Space` should activate buttons or other controls. Pressing Enter should activate links.
  - Ensure that you can perform tasks on custom JavaScript widgets, such as menus, autocomplete elements, etc., using the keyboard only.
  - Ensure you can complete typical user tasks on the page using only the keyboard.
- **Check focus visibility and appearance**
  - Ensure that each interactive element receiving keyboard focus has a visible focus indicator (outline or highlight)
  - The interactive element should use the theme's default focus indicator rather than the browser's default focus indicator to maintain a consistent look with other interactive elements on the page.
  - Ensure that other elements do not obscure or hide the focused element and the focus indicator.
- **Check for logical tab order**
  - Ensure that the tab order follows the visual and logical reading order.
- **Check for focus traps**
  - Some custom widgets trap focus when keyboard navigation is used, such as menus and modal dialogues. It is essential to verify that users don't get trapped within the widget's container and that there are options to move the focus outside the widget and onto the rest of the page. For example, modal dialogues in Moodle can be closed either by pressing the Escape key or the dialogue's close button.

### Screen reader testing

Screen readers are assistive technologies that help people who are blind or have low vision access digital content. They convert the page's content into speech or braille output, allowing the user to interact with the page using a keyboard or touch gestures. Screen readers rely on well-structured, semantic HTML to help users navigate and interact with the page effectively.

The table below lists some popular screen readers. Browsers in **bold** font indicate the best compatibility with the given screen reader compared to other compatible browsers.

<!-- cspell:ignore ChromeVox -->

| Screen reader                                                                                                                   | Operating system | Browser compatibility             | Used in testing on |
|---------------------------------------------------------------------------------------------------------------------------------|------------------|-----------------------------------|--------------------|
| [NVDA](https://www.nvaccess.org/)                                                                                               | Windows          | Chrome, Edge, Firefox             | LMS                |
| [JAWS](https://www.freedomscientific.com/)                                                                                      | Windows          | Chrome, Edge, Firefox             | LMS                |
| [Narrator](https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1)         | Windows          | **Edge**, Chrome, Firefox         |                    |
| [VoiceOver](https://support.apple.com/guide/voiceover)                                                                          | macOS, iOS       | **Safari**, Chrome, Edge, Firefox | LMS, App           |
| [Talkback](https://support.google.com/accessibility/android/topic/3529932?hl=en&ref_topic=9078845&sjid=13502500306212449126-AP) | Android          | **Chrome**, Firefox               | LMS, App           |
| [ChromeVox](https://support.google.com/chromebook/answer/7031755)                                                               | Chrome OS        | **Chrome**, Firefox               |                    |

Some practical tips when testing your Moodle plugin or contribution with screen readers:

- Keyboard accessibility is essential when using a screen reader. Aside from ensuring the page can be navigated with only a keyboard, ensure the accessible names of elements, such as buttons, links, form controls, and other interactive elements, are meaningful and appropriately announced.
- Ensure you can complete typical user tasks on the page using only the keyboard and a screen reader, and that screen readers provide clear information and feedback.
- Test custom JavaScript widgets with at least two screen readers to ensure dynamic content is announced consistently across them.
- Explore screen reader commands. Screen readers typically include keyboard shortcuts that let users navigate page landmarks, headings, links, and form elements. Use these to get an overview of the page structure and ensure the page elements have meaningful accessible names. For a complete list of screen reader commands, check out the following:
  - [JAWS hotkeys](https://www.freedomscientific.com/training/jaws/hotkeys/)
  - [NVDA commands quick reference](https://download.nvaccess.org/documentation/keyCommands.html)
  - [VoiceOver (MacOS) command charts](https://help.apple.com/voiceover/command-charts/)

:::info Notes about screen reader testing

Moodle HQ directly tests with a number of different screen readers when assessing:

- Bug fixes to accessibility issues that require screen reader testing
- New pages or user interface components that are being developed for new product features or improvements

:::

### Reflow and resize text

As Moodle can be used on a variety of devices with different screen sizes and orientations, it is essential to ensure that the user interface is responsive and usable when displayed on mobile devices or when zoomed in.

You can perform the following tests on the page:

- Set the browser's viewport width to 1280 CSS pixels and increase the page zoom to 200%. Ensure the text resizes without losing content or functionality. This aligns with the [WCAG Level AA Success Criterion 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).
- Resize the browser viewport to a width of 320 CSS pixels. Alternatively, set the viewport's width to 1280 CSS pixels and increase the page zoom to 400%. Ensure that the user interface elements reflow without causing any horizontal viewport overflow. This aligns with the [WCAG Level AA Success Criterion 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## Other tools for accessible design, development, and testing

### The accessibility tree

The accessibility tree is a representation of a webpage's semantic structure based on the Document Object Model (DOM). It contains accessibility-related information of the page's elements, such as role, state, and value.

We can think of the accessibility tree as a filtered, semantic version of the DOM, containing only information relevant to assistive technologies, which means that hidden elements, such as those with `display: none;` or those with the `aria-hidden="true"` attribute, will not be rendered in the accessibility tree.

Ensuring that your Moodle plugin, or the UI changes you contribute to the core Moodle code, is built using semantic HTML or uses the appropriate ARIA attributes ensures an accurate accessibility tree that is useful for assistive technologies.

Below are several resources about how you can use the accessibility tree in various browsers:

- Chrome and Chromium-based browsers: [Full accessibility tree in Chrome DevTools](https://developer.chrome.com/blog/full-accessibility-tree/)
- Firefox: [Accessibility inspector](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/index.html)

<!-- cspell:ignore siegemedia -->
### Colour contrast checkers

To meet colour contrast requirements, user interface elements must meet the following WCAG success criteria:

- [Success Criterion 1.4.3 Contrast (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  - Minimum contrast ratio of **4.5:1** for normal text (small text).
  - Larger text (typically 18pt or 14pt bold and above) requires a minimum contrast ratio of **3:1**.
- [Success Criterion 1.4.11 Non-text Contrast (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
  - Minimum contrast ratio of **3:1** for graphical objects and user interface components.

Meeting these criteria helps users with low vision or colour blindness distinguish text and interface elements.

Automated testing tools and browser developer tools, such as Chrome's element inspector, can help check the colour contrast of text against its background. Colour contrast checker tools are also helpful for developers and designers to ensure colour contrast requirements are met.

There are many colour contrast checker tools available online. Feel free to check out some of the tools:

- [Deque Color Contrast Analyzer](https://dequeuniversity.com/color-contrast)
- [Contrast Ratio by siegemedia](https://www.siegemedia.com/contrast-ratio)
- [Colorable](https://colorable.jxnblk.com/)
