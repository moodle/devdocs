---
title: Moodle App Release Process
sidebar_label: Release
sidebar_position: 1
tags:
  - Moodle App
  - Release notes
---

Moodle Mobile App Release Process – At a Glance

## Pre-Release (Weeks Before Launch)

- **Code Freeze**: Lock in final features.
- **Dependency Freeze**: Update and freeze npm packages.
- **Translation Prep**: Push new strings, notify translators.
- **Testing**: Add required QA tests; ensure all CI tests pass.
- **Documentation & Versioning**: Draft release notes, bump version numbers.
- **Team Coordination**: Notify all stakeholders (Community, Docs, QA, etc.).

## Release Day

- **Trigger Builds**: Launch internal CI to build final versions.
- **Testing**: Final tests and automation checks.
- **Publish**: Submit to App Store and Google Play.

## Post-Release

- **Tag & Release**: Version tagging in GitHub.
- **Docs & Notes**: Finalize user guides and release notes.
- **New Version Prep**: Create next release tracker ticket.
- **Announcements**: Broadcast release via channels.
- **Cleanup**: Tag branches, unfreeze dependencies, update plugins.
- **Verify**: CI pipelines healthy, QA complete.

## See also

- [Moodle App Release Notes](../../app_releases.md)
