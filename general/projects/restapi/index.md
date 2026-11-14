---
title: REST API Conversion
tags:
  - Project
  - REST
  - Users
---

import { ProjectSummary } from '@site/src';

{/* <!-- cspell:ignore restapi --> */}

<ProjectSummary
    projectName="restapi"
/>

Moodle's existing web-service system is aging, and has several limitations which make it harder than necessary to use. These mostly revolve around different ways in which it does not follow established protocols, but extend more generally to the shape and nature of REST endpoints, and lack of modern authentication such as OAuth2.

The foundations to deliver a new REST API have been underway for some time with most parts of that foundation now complete, including Moodle's new Routing system, support for automatic OpenAPI specification generation, OAuth2 and Personal Access Token authentication, and OAuth2 scoping.

The new REST API is intended to replace the legacy Web Service system gradually, with endpoints added over time rather than promising one-to-one parity.

User management is the first reference implementation ([MDL-90030](https://tracker.moodle.org/browse/MDL-90030)), with other core services expected to follow including Course, Cohort, Calendar, Messaging, and other core systems, before expanding out to include all Moodle plugins.
