---
title: Plagiarism API
documentationDraft: true
tags:
  - API
  - Plagiarism
---

## Overview

The Plagiarism API is a core set of functions that all Moodle code can use to send user submitted content to Plagiarism Prevention systems

A typical user story:

1. When Plagiarism tools are enabled, every module that allows it will have a group of settings added to allow management of sending the user content to a plagiarism service.
1. A user enters some content/submits a file inside a module that a teacher/Admin has configured the tool to be used.
1. An Event is triggered which contains details about the user, module and submission they have made
1. Event handlers in the Plagiarism plugin are triggered and process anything required.
1. Hooks for displaying information returned from the Plagiarism tools to both the user and teacher (controlled by the plugin)

## Supported Modules

- Assignment
- Forum
- Workshop

## More information

- [How to Develop a new Plagiarism Plugin](https://docs.moodle.org/dev/Developing_a_Plagiarism_Plugin)
- [How to add support for a Plagiarism Plugin to my activity module](https://docs.moodle.org/dev/How_to_add_support_for_a_Plagiarism_Plugin_to_my_activity_module)
