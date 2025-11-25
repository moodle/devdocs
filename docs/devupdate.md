---
title: Moodle 5.2 developer update
tags:
- Core development
- Moodle 5.2
---

<!-- markdownlint-disable no-inline-html -->

This page highlights the important changes that are coming in Moodle 5.2 for developers.

## Badges API reorganisation

<Since version="5.2" issueNumber="MDL-82147" />

The Badges API is responsible for managing badges in Moodle, including their creation, management, and export to external platforms compliant with Open Badges standards. However, the current implementation has become complex and difficult to maintain, and can't be easily extended to support future versions of Open Badges.

To address these challenges, we're reorganising the API to significantly improve its structure and maintainability. Key changes include:

- Refactor JSON exporters to support multiple Open Badges schema versions (MDL-85621). This will allow for seamless integration with different schema requirements.

More information about the Badges API can be found in the [Badges API documentation](./apis/subsystems/badges/index.md).
