---
title: Moodle 5.3 developer update
tags:
- Core development
- Moodle 5.3
---

{/* <!-- markdownlint-disable no-inline-html --> */}

This page highlights the important changes that are coming in Moodle 5.3 for developers.

## Linear navigation support

<Since version="5.3" issueNumber="MDL-84921" />

Moodle 5.3 introduces support for sequential linear navigation controls within course views. By default, third-party course formats do not display linear navigation elements. To explicitly opt in and declare support for this feature, course formats must override the `uses_linear_navigation()` method.

Activity modules can also take part in this navigation: the `\core_course\cm_info` class provides `get_navigation_url()`, `set_navigation_url()`, and `reset_navigation_url()` methods so a module can override the URL the "Previous" and "Next" controls lead to, or remove itself from the navigation flow altogether.

For a comprehensive integration guide, structural configuration examples, and page-state API controls, see the [Linear navigation support guide](./apis/plugintypes/format/linear_navigation.md).

## Supplementary content in the sticky footer

<Since version="5.3" issueNumber="MDL-88601" />

The `moodle_page` class now includes `set_supplementary_content()` and `get_supplementary_content()` methods, allowing any part of Moodle to inject an `action_link` as supplementary content into the sticky footer, regardless of whether the current course format supports linear navigation.

For instance, `mod_forum` uses this new mechanism to display a "Go to all discussions" link in the sticky footer when viewing an individual discussion.

For more information, see the [Adding supplementary content to the sticky footer](./apis/plugintypes/format/linear_navigation.md#adding-supplementary-content-to-the-sticky-footer) section.

## Scopes for API routes

<Since version="5.3" issueNumber="MDL-89710" />

API routes can now declare the scopes required to call them, using the `#[scopeset]` attribute alongside the existing `#[route]` attribute. When a request is authenticated with an OAuth2 access token or Personal Access Token, the router checks that the token was granted a scope combination which satisfies the route's requirements, in addition to any existing capability checks.

Every API route **must** now declare its scope requirements, either with one or more `#[scopeset]` attributes, or by explicitly opting out with `#[unscoped_resource]`. This is enforced by a core PHPUnit test that scans all routes in the `route\api` namespace, so any new route which omits this declaration will fail the test suite.

For details on declaring scopes on a route, and on defining new scope classes for a subsystem, see [Scopes](./apis/subsystems/routing/scopes.md) and [Defining Scopes](./apis/subsystems/routing/defining-scopes.md).
