---
title: Component library
tags:
  - Coding_guidelines
  - Core_development
  - Developer_tools
  - Guidelines_for_contributors
  - Interfaces
  - Moodle_User_Interface_Guidelines
  - Processes
  - Themes
  - Usability
---

The Component Library is a developer tool provided to help identify frequently-used user interface components, and encourage their re-use.

It includes components from both Twitter Bootstrap, and from Moodle, and it displays these features using your current Moodle theme.

This should help you to work on your theme features, bringing together most of Moodle into one convenient location.

The library is a tool for visual designers, front-end developers, UX developers and anybody creating core Moodle code or Moodle extensions. Its use will allow you to create user interfaces more efficiently.

## Getting started

### Where is the Component Library?

The library is built right into Moodle, but is only shown to developers. You can find it in your site by navigating to Site administration -> Development -> UI Component library.

If you cannot see "UI Component library" then you will need to build it first - see below.

You can also browse the Component Library online http://componentlibrary.moodle.com/admin/tool/componentlibrary/docspage.php/library/getting-started/

### Building the Component Library

The Component Library is written using the same Hugo tooling that the Twitter Bootstrap framework uses. It also includes the Bootstrap libraries for the version of Bootstrap used in Moodle.

The library is built from your console, and you will need to install the same NodeJS dependencies that we use for many of our other development features.

See our [Grunt](./nodejs.md#grunt) documentation for information on how to install these dependencies.

Once you have installed the NodeJS dependencies you can then use the [grunt](http://gruntjs.com/) tooling to build the library.:

```console title="Building the component library"
grunt componentlibrary
```

Simples! What could be easier!?

### What should be documented

The main aim of this library is to improve consistency of the user interface to provide a better user (and developer) experience by re-using components across Moodle.

Whenever a new Moodle feature is created or updated, the building blocks for the UI of the feature should be documented in this library.

The initial aim is to document any new UI feature which:

- is made available in the `core` component, or any core subsystem
- is made available for re-use in a plugin which offers sub-plugins

The documentation of other features will also be welcomed.
