---
title: Accessibility
tags:
  - Accessibility
  - Compliance
  - Certification
---

Moodle is designed to provide equal functionality and information to all people. This means that there should be no barriers for people regardless of disabilities, assistive technologies that are used, different screen sizes and different input devices (for example mouse, keyboard and touchscreen).

## Accessibility conformance

As part of our ongoing commitment to accessibility and continuously improving conformance with the WCAG 2.1 Level AA success criteria, Moodle is working with an external team of accessibility specialists to review the accessibility of its products through regular accessibility audits.

### Accessibility accreditations

#### Moodle LMS

Moodle LMS has been accredited to meet [WCAG 2.1 Level AA conformance](https://tracker.moodle.org/secure/attachment/147694/Moodle%20Statement%20of%20Conformance%202024.pdf).

The table below provides a history of the accessibility audits performed on the Moodle LMS.

| Audit period   | Target conformance | Accreditation date | Tracker epic                                             | Fixed versions               |
|----------------|--------------------|--------------------|----------------------------------------------------------|------------------------------|
| January 2020   | WCAG 2.1 Level AA  | 10 November 2020   | [MDL-67688](https://tracker.moodle.org/browse/MDL-67688) | v3.10, v3.9.3                |
| September 2021 | WCAG 2.1 Level AA  | 8 November 2021    | [MDL-72657](https://tracker.moodle.org/browse/MDL-72657) | v4.0, v3.11.5, v3.10.8       |
| May 2022       | WCAG 2.1 Level AA  | 3 May 2023         | [MDL-74624](https://tracker.moodle.org/browse/MDL-74624) | v4.2, v4.1.3, v4.0.8         |
| August 2023    | WCAG 2.1 Level AA  | 24 January 2024    | [MDL-78185](https://tracker.moodle.org/browse/MDL-78185) | v4.4, v4.3.1, v4.2.4, v4.1.7 |

<details>

<summary>Table column information</summary>

- **Audit period** - when the accessibility audit was performed
- **Target conformance** - the target WCAG guidelines version and the conformance level for the accreditation
- **Accreditation date** - the date the accessibility accreditation was issued
- **Tracker epic** - link to the Epic issue in the Moodle Tracker that contains the issues fixed for the accessibility audit
- **Fixed versions** - the Moodle versions that include the fixes from the issues raised from the audit

</details>

#### Moodle App

The Moodle App was accredited to meet [WCAG 2.1 Level AA conformance](https://www.webkeyit.com/accessibility-services/accessibility-accreditations/moodle-mobile-app) on 9 May 2023. See [MOBILE-4182](https://tracker.moodle.org/browse/MOBILE-4182) for more details.

#### Moodle Workplace

Moodle Workplace has been accredited to meet [WCAG 2.1 Level AA conformance](https://www.grackledocs.com/en/accreditations/12295) on 27 Jun 2024.

The table below provides a history of the accessibility audits performed on Moodle Workplace.

| Audit period   | Target conformance | Accreditation date | Fixed versions               |
|----------------|--------------------|--------------------|------------------------------|
| August 2023    | WCAG 2.1 Level AA  | 27 June 2024       | v4.4, v4.3, v4.2, v4.1       |

<details>

<summary>Table column information</summary>

- **Audit period** - when the accessibility audit was performed
- **Target conformance** - the target WCAG guidelines version and the conformance level for the accreditation
- **Accreditation date** - the date the accessibility accreditation was issued
- **Fixed versions** - the Moodle versions that include the fixes from the issues raised from the audit

</details>

### Accessibility accreditation process

1. External auditors perform an accessibility audit on key pages/screens within the Moodle product using automated tools and user journey testing. These pages are selected as representative of the product's overall accessibility and functionality.
    - The audit is performed on a test site that contains the latest released version of the Moodle product at the time of the audit.
2. The Level A and Level AA issues raised from this audit are all addressed. Level AAA issues raised will also be fixed where practical.
    - The accessibility fixes and improvements are applied to:
        - The development branch for the upcoming major version of the Moodle product
        - The current released version(s) of the Moodle product
3. The external auditors verify the accessibility fixes.
4. Once all fixes have been verified, a conformance report is issued to Moodle.

:::info

The WCAG accreditation expires after 12 months as it is recognised that software and browsers are constantly evolving. Moodle will be undertaking the accreditation process annually.

:::

<!-- cspell:ignore VPAT -->

### Voluntary Product Accessibility Template (VPAT)

#### Moodle LMS

An overview of Moodle LMS' conformance with the [WCAG 2.1](https://www.w3.org/TR/WCAG21/) guidelines can be found in our [accessibility conformance report](https://docs.moodle.org/en/VPAT#Moodle%20accessibility%20conformance%20report).

#### Moodle Workplace

An overview of Moodle Workplace's conformance with the [WCAG 2.1](https://www.w3.org/TR/WCAG21/) guidelines can be found in our [accessibility conformance report](https://docs.moodle.org/en/Moodle_Workplace_VPAT#WCAG_2.x_report).

## Authoring features

One of Moodle's biggest features is its ability to create and share content to other users.
Where possible a range of accessibility authoring and auditing features have been added to the user interface so that content is as accessible as possible.

One example of this is in the "Atto text editor" which includes an "Accessibility checker" and an "Accessibility helper" which provide additional information for content authors on the accessibility of their content. One example of this is a check to ensure that content meets WCAG AA colour contrast requirements.

All accessibility features of the "MathJax" content filter are enabled as standard, allowing screen readers to read math content directly.

## Coding standards

All components in Moodle _must_ be available for use by all users. Accessibility needs to be part of the design of every new feature in Moodle.

For simple features with no requirement for an advanced user interface, simple adherence to standard HTML5 does provide an accessible feature. In this case, [advice from W3C](https://www.w3.org/TR/wai-aria-practices/#no_aria_better_bad_aria) is not to use ARIA at all than to use it incorrectly.

Bootstrap and Bootstrap components [do not support accessibility by default](https://getbootstrap.com/docs/4.0/getting-started/accessibility/#color-contrast). All features implemented using Bootstrap components _must be_ checked and enhanced where necessary. Moodle has created an "aria" JavaScript module which improves accessibility features of some default Bootstrap features, including menus.

### Colours

All text that is presented needs to be displayed in a colour with sufficient contrast to its background colour so that the text is legible for all users. The foreground and background colours should meet the [WCAG requirement for contrast](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html), which varies depending on the size of the text. This can be tested with the [WebAIM Web Accessibility Evaluation Tool](https://wave.webaim.org/).

It is worth noting that colour alone **must not** be used to imply meaning. An example of a failure for this would be to display error messages in "red" with no other information to convey that this is an error message.

See [the W3C advice on the use of colour](https://www.w3.org/TR/WCAG21/#use-of-color) from WCAG 2.1 for more information.

### Icons

Icons (Images) can be displayed in a variety of ways, and the correct use of icons will depend on the context in which they are used.

See [the WCAG 2.1 requirement for text alternatives](https://www.w3.org/TR/WCAG21/#text-alternatives) for more information.

#### Solitary Icons

Icons displayed on their own, as part of a link or as informative content must include accessible text to convey the meaning of the icon. For an image tag, this can be the `"alt"` attribute for the image tag. It can be valid to include both the `"alt"` attribute and the "title" attribute (shown when hovering with the mouse) so that all users can access the textual meaning of the icon.

#### Icons and Text

When an icon is displayed immediately before or after some text that also describes the meaning of the icon, it is redundant to repeat the same text twice. In this case, it is correct to hide the icon from screen readers by setting the "role" attribute to "presentation" or hiding it with the "aria-hidden" attribute set to "true".

#### Multiple icons

When multiple icons are displayed in a row as links, it is important that each icon is large enough and has sufficient space around it so the icon can be easily clicked with the mouse.

The minimum valid size for a link target is 44 by 44 pixels.

See [the WCAG 2.1 requirement for target size](https://www.w3.org/TR/WCAG21/#target-size) for more information.

### Keyboard Support

All components should be entirely operable through a keyboard-only interface.

See [the WCAG 2.1 requirement for keyboard accessibility](https://www.w3.org/TR/WCAG21/#keyboard-accessible) for more information.

Some important things to consider is that all components should be focusable with the keyboard (available in the tab sequence), and should allow the focus to be moved away using only the keyboard.

The element that currently has focus should have a visual focus indicator. The W3C provide information on [ARIA focus management](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_discernable_predictable) as part of it's ARIA best practices.

In some cases, a single component can contain many smaller components. In order to not pollute the page tab sequence, the parent element can exist in the tab sequence once and should maintain focus within its smaller components with arrow key navigation (roving `tabindex` or active descendant). The W3C provide information [ARIA keyboard navigation inside components](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_general_within) as part of it's ARIA best practices.

### Forms

Moodle forms created with the standard forms library are designed to be accessible. Any custom (for example JavaScript) form or custom form elements must also be accessible.

- All form elements must have a label
- The form must be able to be completed entirely with the keyboard
- Invalid entries in the form fields should be indicated with the "aria-invalid" attribute set to "true"
- Warning messages for invalid form fields should be associated with the invalid field using the "aria-describedby" attribute. See [the WCAG 2.1 success criteria for Error Identification](https://www.w3.org/TR/WCAG21/#error-identification) for further information on this.

### Presentation Only

Any component that contains no information or functionality that is not provided by other components on the page can be considered decorative only. Content that meets this description can be hidden from screen readers using a suitable technique (aria-hidden or presentation role).

See [the WCAG 2.1 description of pure decoration](https://www.w3.org/TR/WCAG21/#dfn-pure-decoration) for more information.

### Landmark regions

The layout of each page of content should be separated into valid regions where each region has a unique label and the correct landmark role. This is typically done in the layout files of the theme.

See [the ARIA best practice advice on landmarks](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_landmark) for further information.

### Page Titles

All pages should have a unique title that describes the current page.

Some tips for providing a meaningful page title:

- The page title must be accurate and informative.
- If the page causes a _change of context_ (for example, a search functionality), it should describe the result or change of context to the user.
- It should be concise.
- If possible, it should uniquely identify the page.
- The most identifying information should come first.

:::note change of context

(not to be confused with Moodle's `\core\context` class and its implementations)

According to the [WCAG 2.1 Understanding Docs](https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html#dfn-changes-of-context), a change in context is a major change that, if made without user awareness, can disorient users who are not able to view the entire page simultaneously. It can include changes of user agent, viewport, focus, or content that changes the meaning of the web page.

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

When separating the components of the page tile, please use the `moodle_page::TITLE_SEPARATOR` constant.

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

You should not add the name of the site when setting the page title using `$PAGE->set_title()`. The site name is automatically appended to the end of the page title in the correct format when using `$PAGE->set_title()`.

:::info

Administrators can use the `sitenameinititle` configuration setting to configure how this is shown in the title with possible options including:

- the _full name_ of the site, for example, "Mount Orange School"
- the _short name_ of the site, for example: "MOS"

This is automatically handled by `$PAGE->set_title()`.
:::

#### Useful resources

- [Understanding Success Criterion 2.4.2: Page Titled (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/page-titled)
- [Technique G88: Providing descriptive titles for Web pages](https://www.w3.org/WAI/WCAG21/Techniques/general/G88)

### Advanced UX Widgets

When it is determined that an advanced interface is required (typically one that relies on JavaScript), a minimum set of principles need to be applied to make sure that the feature "provides equal functionality and information to all people". Each use case is different, but a minimum set of things to be checked are:

- Does this component work entirely when accessed only via the keyboard?
- Does this component map to any widget from the [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/) document and if so, does it implement all of the "Keyboard Interaction" and "WAI-ARIA Roles, States and Properties" listed for that widget?

## External Resources

<!-- cspell:ignore ATAG -->
<!-- cspell:ignore UAAG -->

- [W3C Accessibility Standards Overview](https://www.w3.org/WAI/standards-guidelines/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/)
- [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices/)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [Authoring Tool Accessibility Guidelines (ATAG) 2.0](https://www.w3.org/TR/ATAG20/)
- [User Agent Accessibility Guidelines (UAAG) 2.0](https://www.w3.org/TR/UAAG20/)

## Accessibility Testing

### Screen readers

Screen readers that implement the web accessibility API of their supported operating system and conform with the WCAG 2.1 Level AA guidelines should work well with Moodle products.

The table below lists some of the popular screen readers available. Browsers in **bold** font indicate the best compatibility with the given screen reader compared to other compatible browsers.

<!-- cspell:ignore ChromeVox -->

| Screen reader                                                                                                                   | Operating system | Browser compatibility             | Used in testing on |
|---------------------------------------------------------------------------------------------------------------------------------|------------------|-----------------------------------|--------------------|
| [NVDA](https://www.nvaccess.org/)                                                                                               | Windows          | Chrome, Edge, Firefox             | LMS                |
| [JAWS](http://www.freedomscientific.com/)                                                                                       | Windows          | Chrome, Edge, Firefox             | LMS                |
| [Narrator](https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1)         | Windows          | **Edge**, Chrome, Firefox         |                    |
| [VoiceOver](https://support.apple.com/guide/voiceover)                                                                          | macOS, iOS       | **Safari**, Chrome, Edge, Firefox | LMS, App           |
| [Talkback](https://support.google.com/accessibility/android/topic/3529932?hl=en&ref_topic=9078845&sjid=13502500306212449126-AP) | Android          | **Chrome**, Firefox               | LMS, App           |
| [ChromeVox](https://support.google.com/chromebook/answer/7031755)                                                               | Chrome OS        | **Chrome**, Firefox               |                    |

:::info Notes about screen reader testing

Moodle HQ directly tests with a number of different screen readers when assessing:

- Bug fixes to accessibility issues that require screen reader testing
- New pages or user interface components that are being developed for new product features or improvements

:::

### Accessibility testing tools

Aside from screen readers, Moodle LMS is also tested using a variety of accessibility tools:

#### Built-in browser dev tools

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/accessibility/reference)
- [Firefox Accessibility Inspector](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/index.html)

#### Browser Extensions

- [axe DevTools](https://www.deque.com/axe/devtools/) (Chrome, Firefox)
- [WebAIM Web Accessibility Evaluation Tool (WAVE)](https://wave.webaim.org/extension/) (Chrome, Firefox)

#### HTML Validator

- [Nu HTML Checker](https://github.com/validator/validator)

#### Behat

<!-- cspell:ignore Deque -->

Moodle LMS' automated acceptance testing integrates Deque Systems' accessibility testing engine, [axe-core](https://github.com/dequelabs/axe-core), to support automated accessibility testing through Behat.

## International Legislation

Moodle aims to comply with the following international legislation where possible.

### USA

- [Section 508](http://www.section508.gov/)

### UK

<!-- cspell:ignore SENDA -->

- [Equality Act 2010](http://www.legislation.gov.uk/ukpga/2010/15/contents)
- [Public sector equality duty](http://www.equalityhumanrights.com/advice-and-guidance/public-sector-equality-duty/)
- [SENDA - Special Educational Needs and Disability Act/Bill](http://www.parliament.the-stationery-office.co.uk/pa/ld200001/ldbills/003/2001003.htm)

### Germany

<!-- cspell:ignore Barrierefreie -->
<!-- cspell:ignore Informationstechnik -->
<!-- cspell:ignore Verordnung -->
<!-- cspell:ignore BITV -->

- [Barrierefreie Informationstechnik-Verordnung - BITV](http://www.einfach-fuer-alle.de/artikel/bitv/)

### France

<!-- cspell:ignore Référentiel -->
<!-- cspell:ignore Général -->
<!-- cspell:ignore d'Accessibilité -->
<!-- cspell:ignore des -->
<!-- cspell:ignore RGAA -->

- [Référentiel Général d'Accessibilité des Administrations - RGAA](https://references.modernisation.gouv.fr/rgaa-accessibilite/)

### European Union

- [European Accessibility Act (Detailed proposal)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=COM:2015:0615:FIN)
- [European Accessibility Act (Informational page)](https://ec.europa.eu/social/main.jsp?catId=1202)
