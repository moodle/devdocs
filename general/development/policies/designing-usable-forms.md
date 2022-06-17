---
title: Designing usable forms
tags:
  - Moodle User Interface Guidelines
  - UX
  - Guidelines
  - Forms
---

The following guidelines are intended to help you improve the user experience of both complex, and less complex, forms.

:::note

The terms _settings_ and _fields_ are used interchangeably here because these instructions apply to both the configuration of administration, and forms.

:::

## Labelling settings

All fields in a form should have a descriptive label (not too long) that gives a clear idea of what the setting is for.

Do not rely on _Help_ popups to compensate for a poor label. If the user has to open and read the _Help_ popup to find out what the setting is about, then your label is not clear enough.

## Naming sections

Moodle has the ability to collapse sections in a form to simplify those forms. However, having collapsible sections to simplify the forms is not enough. **Properly named sections is a key factor of usable forms.**

:::tip

If the user has to expand the section to know what it contains, the section name is not good enough.

:::

### Be accurate, clear, and concise

Use short, clear and concise section names.

When a section is collapsed by default, it is really important that its name tells the user if the setting they are looking for is part of this section or not. If it does, the user can easily scan the form and find the adequate section.

:::tip

Keep in mind that if section names are too long, scanning the form will become more difficult.

:::

### Avoid ambiguous names

It is easy to find yourself declaring a new section named *Miscellaneous*, *Advanced settings* or even *Additional options*, but you _must_ definitely avoid this. It is sometimes very difficult to re-arrange your sections to prevent ambiguous ones, but remember that a user should be able to guess the content of the section just by reading its name.

If the section name is too ambiguous, the user will not remember what was part of the section when visiting your form for a second, third, or subsequent time... thus ruining your efforts of improving the user experience.

## Re-use existing names

- **General**: Often used to name the first section (expanded by default), except when inappropriate or too vague
- **Content**: Describes a section defining the content, for example, the files available in a File resource, or the visual content of a Page resource.
- **Appearance**: A section which contains options affecting appearance and display.
- **Availability**: Contains the options affecting the availability of the content.

### Avoid using 'Options' or 'Settings'

It is usually implied that a section contains settings or options, so you should not use these terms in any of your sections names. However, in some rare occasions, you might want to be more descriptive when another section uses a similar name.

- Wrong: *Appearance settings* (should be *Appearance*)
- Acceptable: *Submission options* (when you have another section called *Submission types*, for example)

### Merging sections

If you end up with two sections with few settings inside them, it is sometimes preferable to merge them into one section. But how do we keep an accurate section name then?

Well, if the section name is still concise when it includes two subjects (e.g. *Foo & bar*), then the settings related to 'Foo' and 'Bar' could probably be placed in that one section.

## Use 'Show more/less' advanced settings sparingly

If you are tempted to use the 'Show more/less' functionality, it is probably because you have a section with many settings inside it. If so, you could probably try to split the section into multiple sections.

But there are some rare cases where those settings do not fit in another section, or are too trivial, then you might want to hide them behind a 'Show more' button.

:::important

Please keep in mind that this is not a recommended practice as it does not provide clues to the user about what is hidden behind 'Show more'. Also, due to the current coding design of Moodle forms, revealed settings can be displayed randomly throughout the section, which may confuse the user.

:::

A section should never contain *only* advanced settings.

Try your best to avoid using this feature where possible.

## Adequate number of fields and sections

Do not overload a section with too many settings. If you have too many settings it is likely that your section could be split into more sections. An average of 5 to 6 settings per section seems to be a good compromise; it allows the user to quickly scan the content of the section without missing anything.

There is nothing wrong in having only a few settings in a section. You can even only have one single setting in a section, but you can only do so when the setting could not be placed in any other section without affecting the accuracy of the section name.

In the same way that too many settings in one section is not good practice, a form with too many sections is not good practice either. Try to find a right balance between both.

## Expanding more sections

A form with 2 sections or less will expand its sections by default. Once there are more than 2 sections, all the sections but the first one will be collapsed. Any other section containing required settings will be expanded by default as well.

You should not change this default behaviour if it is avoidable, but if you do, keep in mind that expanding too many sections in a form will void the benefits of having collapsible sections.

And if you end up with a section being expanded by default because it contains a single required setting, you might want to consider moving this setting into a more important section, which is already expanded by default.

## Think about the flow

The flow of a form is important. Think about the user who will land on the page and scan through the form.

- group together sections with similar content;
- group settings with similar content within sections;
- place more important sections and settings at the top of the form;
- do not intersperse collapsed or expanded sections - the expanded sections should be at the top.
