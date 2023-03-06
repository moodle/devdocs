---
title: Applying accessibility on the Moodle App
sidebar_label: Accessibility
sidebar_position: 3
tags:
  - Moodle App
  - Accessibility
  - Compliance
  - Certification
---

## Screen readers

VoiceOver and TalkBack are the native applications for screen reading in iOS and Android devices. In order to make the code understandable to these applications we encourage the developers to use the [Rich Internet Applications (WAI-ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/) recommendations of W3C. Those documents includes a bunch of rules to be applied to the HTML code to add semantic information to it.

First step on that is to [the role](https://www.w3.org/TR/wai-aria-1.1/#role_definitions|identify) of the main elements of navigation and information of the page. Then, you should apply the correct aria attributes to the elements that conform that role.

[Here you have some examples](https://github.com/moodlehq/moodleapp/commit/b95de260ee46d6278d03cff294015aa11fd99a6b) of how to apply these attributes.

## Tools and resources

These are some tools and resources that can be useful to improve accessibility:

- [ARIA DevTools browser extension](https://chrome.google.com/webstore/detail/aria-devtools/dneemiigcbbgbdjlcdjjnianlikimpck) — Navigate a site like a non-sighted user would.
- [headingMaps browser extension](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi) — Navigate page headings.
- [Landmarks Navigation browser extension](https://chrome.google.com/webstore/detail/landmark-navigation-via-k/ddpokpbjopmeeiiolheejjpkonlkklgp) — Navigate landmarks.
- [Accessibility Pane in Chrome](https://developer.chrome.com/docs/devtools/accessibility/reference/#pane) — Inspect accessibility roles and values.
- [BingO Bakery: Headings, Landmarks, and Tabs](https://www.youtube.com/watch?v=HE2R86EZPMA) — Video introducing some basic concepts.
