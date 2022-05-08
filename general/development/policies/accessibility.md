---
title: Accessibility
tags:
  - Accessibility
  - Compliance
  - Certification
---

Moodle is designed to provide equal functionality and information to all people. This means that there should be no barriers for people regardless of disabilities, assistive technologies that are used, different screen sizes and different input devices (for example mouse, keyboard and touchscreen).

## Accessibility conformance

As part of our ongoing commitment to provide an accessible platform and to continuously improve compliance with WCAG 2.1 Level AA, Moodle has been working with an external auditor to review the platform since January 2020.

Key pages within Moodle, which are representative of its overall accessibility and functionality, are audited using both automated tools and user journey testing. The WCAG 2.1 Level A and Level AA issues raised from this audit were all addressed in Moodle 3.10 and Moodle 3.9.3 (both released on November 9th 2020). Many of these [accessibility improvements](https://tracker.moodle.org/browse/MDL-67688) where also back-ported to Moodle 3.7.5+ and Moodle 3.8.2+, where possible.

:::info Moodle's accreditations

Both Moodle, and the Moodle Mobile App hold a WCAG 2.1 AA accreditation based on the successful resolution of issues identified during audits.

These accreditations are renewed each year.

<div className='container' >
    <div className='row' >
        <div className='col col--6' >
            <figure>
                <a href="https://www.webkeyit.com/accessibility-services/accessibility-accreditations/moodle">
                    <img width="400px" src="https://www.webkeyit.com/accessibility-services/accessibility-accreditations/moodle/badge" alt="WCAG 2.1 AA Accreditation for Moodle LMS" />
                    <figcaption>Moodle WCAG 2.1 AA Accreditation, first issues November 10th 2020; Re-accredited on November 8th 2021</figcaption>
                </a>
            </figure>
        </div>
        <div className='col col--6' >
            <figure>
                <a href="https://www.webkeyit.com/accessibility-services/accessibility-accreditations/moodle-mobile-app">
                    <img width="400px" src="https://www.webkeyit.com/accessibility-services/accessibility-accreditations/moodle-mobile-app/badge" alt="WCAG 2.1 AA Accreditation for Moodle LMS" />
                    <figcaption>WCAG 2.1 Level AA accreditation badge for the Moodle app issued on 30 June 2021</figcaption>
                </a>
            </figure>
        </div>
    </div>
</div>

An overview of Moodle's conformance with the [WCAG 2.1](https://www.w3.org/TR/WCAG21/) guidelines can be found in our [accessibility conformance report](https://docs.moodle.org/311/en/VPAT#Moodle%20accessibility%20conformance%20report).

:::

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

Icons displayed on their own, as part of a link or as informative content must include accessible text to convey the meaning of the icon. For an image tag, this can be the "alt" attribute for the image tag. It can be valid to include both the "alt" attribute and the "title" attribute (shown when hovering with the mouse) so that all users can access the textual meaning of the icon.

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

Moodle forms created with the standard forms library are designed to be accessible. Any custom (for example javascript) form or custom form elements must also be accessible.

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

See [the WCAG 2.1 success criteria for web page titles](https://www.w3.org/TR/WCAG21/#page-titled) for further information.

### Advanced UX Widgets

When it is determined that an advanced interface is required (typically one that relies on javascript), a minimum set of principles need to be applied to make sure that the feature "provides equal functionality and information to all people". Each use case is different, but a minimum set of things to be checked are:

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

## Accessibility Tools

Moodle officially supports the following screen reader/browser configurations:

<!-- cspell:ignore Chromevox -->

- Browsers:
  - Microsoft Edge, Jaws 15+ (Latest version recommended)
  - Mozilla Firefox, NVDA 2014.1+ (Latest version recommended)
- Screen readers:
  - [NVDA Screen Reader](https://www.nvaccess.org/) (Windows)
  - [JAWS Screen Reader](http://www.freedomscientific.com/) (Windows)
  - [Chromevox Screen Reader](http://www.chromevox.com/) (Linux, Chrome OS, Windows, Mac OS X)
  - [Orca Screen Reader](https://help.gnome.org/users/orca/stable/) (Linux)
- Accessibility tools:
  - [WebAIM Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) (Chrome, Firefox)
  - [Chrome Accessibility Dev Tools](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference) (Chrome)
  - [W3C Accessibility Tool Listing](http://www.w3.org/WAI/ER/tools/complete)

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
<!-- cspell:ignore d’Accessibilité -->
<!-- cspell:ignore des -->
<!-- cspell:ignore RGAA -->

- [Référentiel Général d’Accessibilité des Administrations - RGAA](https://references.modernisation.gouv.fr/rgaa-accessibilite/)

### European Union

- [European Accessibility Act (Detailed proposal)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=COM:2015:0615:FIN)
- [European Accessibility Act (Informational page)](https://ec.europa.eu/social/main.jsp?catId=1202)
