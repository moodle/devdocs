---
title: Testing instructions guide
sidebar_label: Instructions guide
tags:
  - Processes
---
This page has suggestions for developers on how to write good testing instructions for the weekly [testing of integrated issues](./integrated-issues).

We recommend that you:

1. Number the steps in your test, and make use of sub-lists.
2. Only put one action (preparation or validation) on each line - A step should only define a unique operation.
3. Be explicit when a configuration setting, plugin, etc needs to be enabled - saying "Enable _x_" is not sufficient, instead consider outlining **where** the user needs to go and **what** they need to do to enable _x_. As a rule of thumb, try to write these steps as if the tester has never used Moodle before.
4. Promote test validations - **Confirm**, **Verify** or **Ensure** - should be in **bold** so that they are easily identifiable.
5. Make use of the [Jira Markdown formatting](https://tracker.moodle.org/secure/WikiRendererHelpAction.jspa?section=all).

In addition, the following items may be included:

1. Setup requirements. If so, explain them with detailed information and/or provide a link to the documentation, for example [https://docs.moodle.org/en/OAuth_2_services](https://docs.moodle.org/en/OAuth_2_services).
2. Whether testing involves git/shell interaction, SQL operations or commands in general, don't assume the tester knows how to perform that stuff. Instead, add them explicitly to the instructions.
3. Whether multiple themes (for example boost, or classic) should be used.
4. Whether more than one browser should be used.
5. Whether extra testing around the issue is required.

:::info Information for testers

You should specify which themes and browsers have tested, and attach some screenshots.

:::
