---
title: React
tags:
  - react
  - javascript
  - moodle
description: Overview of Moodle's React developer documentation and what each page covers.
---

## Overview {/* #overview */}

This section provides an end-to-end overview of React development in Moodle, including setup, bundling, integration patterns, code quality, testing, and debugging workflows.

## Build tools {/* #build-tools */}

The build documentation explains how React source code is compiled, bundled, and prepared for use in Moodle. It also covers the supporting build tools and common setup requirements.

## Coding conventions

All new TypeScript and TSX code must follow Moodle's file naming conventions, and must be accompanied by Jest unit tests with a minimum of 80% coverage. See the [coding conventions](./conventions.md) page for details.

## Unit testing

Jest is the JavaScript unit testing framework for React and ESM TypeScript components. The testing guide covers running tests, writing mocks for AMD modules and language strings, module path aliases, and CI integration.

## See also

- [Coding conventions](./conventions.md)
- [Build tools](./buildtools.md)
- [JavaScript unit testing](./testing.md)
