---
title: AI Plugins
tags:
  - AI
  - LLM
  - Provider
  - Placement
---

The AI subsystem in the LMS is designed to be extensible, allowing for the integration of external AI services.
This is achieved through the use of AI plugins, which are divided into two types: Providers and Placements.

### Placements

The aim of Placements is to provide a consistent UX and UI for users when they use AI backed functionality.

Placement plugins leverage the functionality of the other components of the AI subsystem.
This means plugin authors can focus on how users interact with the AI functionality, without needing to
implement the AI functionality itself.

Because Placements are LMS plugins in their own right and are not "other" types of LMS plugins,
it gives great flexibility in how AI functionality is presented to users.

See the [Placements](/apis/plugintypes/ai/placement.md) documentation for more information
on developing Placement plugins.

### Providers

Provider plugins are the interface between the LMS AI subsystem and external AI systems.
Their focus is on converting the data requested by an Action into the format needed by the
external AI services API, and then correctly providing the response back from the AI
in an Action Response object.

Because of this design the Providers that provide the AI Actions can be swapped out, mix and matched
or upgraded; both without the need to update the Placement code and without the need to change the
way users interact with the functionality.

See the [Providers](/apis/plugintypes/ai/provider.md) documentation for more information
on developing Provider plugins.
