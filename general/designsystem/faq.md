---
title: FAQ
sidebar_position: 3
tags:
  - Design System
---

## How is the Design System rollout being phased? {/* #how-is-the-design-system-rollout-being-phased */}

The current phase is focused on defining and rolling out design tokens first.

Component development is planned as the next phase, with an aim to begin shipping Moodle Design System components in Moodle 5.3.

## What practical changes in Moodle Core LMS are expected with the introduction of tokens? {/* #what-practical-changes-in-moodle-core-lms-are-expected-with-the-introduction-of-tokens */}

[MDL-87729](https://moodle.atlassian.net/browse/MDL-87729) will determine this. However, variables and hard-coded values in core Moodle themes will likely be replaced or removed to reference the Design System tokens as the living source of truth.

## Will MoodleHQ adopt the usage of tokens going forward? {/* #will-moodlehq-adopt-the-usage-of-tokens-going-forward */}

Yes. We aim to use tokens in new feature development where appropriate.

The Design System team plans to track adoption over time. Updating existing code falls under the responsibility of product owners within Moodle Core LMS, not the Design System team. Consequently, automated checks for code contributions to Moodle Core LMS may change.

## Does the Design System support the Moodle App or Moodle Workplace? {/* #does-the-design-system-support-the-moodle-app-or-moodle-workplace */}

Not yet. This includes Moodle Workplace tenant theming. We have not collaborated with these Moodle products, but aim to do so in the future.
