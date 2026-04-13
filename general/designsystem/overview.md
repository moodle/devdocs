---
title: Overview
sidebar_position: 1
tags:
  - Design System
---

## The Moodle Design System {/* #the-moodle-design-system */}

The Moodle Design System is a shared foundation of design principles, reusable components, and token-based styling rules for building Moodle interfaces across the ecosystem.

It gives teams one common reference for how UI should look, behave, and scale across products and features, helping interfaces feel consistently Moodle while improving the platform's long-term maintainability.

## Why a Design System is needed {/* #why-a-design-system-is-needed */}

Without a Design System, teams face recurring challenges:

- Design decisions are not centrally defined, so translating design into code often requires repeated interpretation.
- Similar UI patterns have been implemented differently across Moodle features and releases, making consistency harder to maintain.
- Styling values are maintained in multiple places (files, themes, and overrides), increasing maintenance effort and making updates harder to apply consistently.
- As Moodle LMS and its ecosystem grow, teams and contributors need stronger shared foundations to maintain both speed and consistency.

Design tokens introduce shared, reusable values that help address these challenges.

## Relationship with Bootstrap {/* #relationship-with-bootstrap */}

The Moodle Design System does not aim to replace Bootstrap. It works alongside Bootstrap by defining Moodle-specific design decisions in one place.

Instead of scattering hardcoded values across different files and components, we aim to maintain an authoritative set of design tokens. Those tokens can then be applied consistently across Bootstrap-based implementations and Moodle UI code.
