---
title: Question bank plugins
tags:
  - Plugins
  - Question
  - qbank
description: Question bank plugins allow you to extend the functionality of the Moodle Question bank.
documentationDraft: true
---

<Since
  version="4.0"
  issueNumber="MDL-70329"
/>

Question bank plugins allow you to extend the functionality of the Moodle Question bank. They just one of the plugin types used by core_question. To see how they fit in, please read [this overview of the question subsystems](../subsystems/question/).

Question bank plugins can extend the question bank in many ways, including:

- Table columns
- Action menu items
- Bulk actions
- Navigation node (tabs)
- Question preview additions (via callback)

The place to start implementing most of these is with a class `classes/plugin_features.php` in your plugin, that declares which features you want to add to the question bank. Until more documentation is written, looking at the examples of the plugins in Moodle core should give you a good idea what you need to do.
