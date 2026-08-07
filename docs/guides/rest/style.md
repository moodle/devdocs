---
title: Style Guide
tags:
  - rest
  - api
  - style
description: Standards and conventions for designing modern REST APIs in Moodle.
---

## 1. Purpose

This document defines the core architectural, semantic, and structural design principles for Moodle's modern REST API layer. It serves as the single source of truth for REST semantics, guiding both human developers and AI engines in creating predictable, scalable, and idiomatic integrations.

### Objectives

- standardize REST API behaviour
- improve API consistency
- improve OpenAPI generation quality
- align APIs with Moodle architecture
- support long-term maintainability
- support deterministic AI-assisted specification generation

### Scope

This document defines:

- REST resource design
- HTTP semantics
- naming conventions
- URI conventions
- response conventions
- error conventions
- versioning behaviour
- Moodle-specific REST constraints

This document does NOT define:

- implementation details
- database design
- business logic
- frontend behaviour

---

## 2. Rule Types

The style guide separates:

| Section | Purpose |
| --- | --- |
| Normative Rules  | mandatory behaviour  |
| Canonical Patterns  | reusable API patterns  |
| Rationale  | explanatory guidance  |

Normative sections MUST use only:

- MUST
- MUST NOT
- REQUIRED
- FORBIDDEN
- SHOULD
- SHOULD NOT
- MAY

---

## 3. Core REST Principles

All Moodle APIs MUST satisfy **Richardson Maturity Model Level 2**.

### 3.1 Resource-Oriented Design

API URIs MUST represent resources (nouns), never actions or operations (verbs).

Standard CRUD processing logic MUST be expressed strictly through HTTP semantics (GET, POST, PUT, PATCH, DELETE), NOT by appending action triggers to the path string.

#### REQUIRED

Resource-oriented APIs:

```http
GET /courses
GET /courses/{courseid}
POST /courses
PATCH /courses/{courseid}
DELETE /courses/{courseid}
GET /course-categories
GET /users
```

#### FORBIDDEN

RPC-style APIs:

```http
POST /core_course_get_courses
POST /createCourse
POST /doAction
POST /course/create
```

#### RATIONALE

Verb-based, RPC-style endpoints tie the API surface to Moodle's internal web service function names, leak implementation detail, and prevent HTTP tooling (caching, method-based routing, OpenAPI generators) from reasoning about intent. Resource nouns let HTTP semantics carry the verb, enabling standard caching, consistent authorization checks per method, and easier client generation.

---

### 3.2 Statelessness

APIs MUST be stateless.

Each request MUST contain:

- authentication context
- authorization context
- required identifiers
- request metadata

APIs MUST NOT depend on server-side session state.

#### RATIONALE

Moodle's REST layer must scale horizontally and support mobile, third-party, and integration clients that can't rely on sticky sessions or shared server-side session state. Requiring every request to carry its own authentication, authorization, identifiers, and metadata keeps requests independently routable and cacheable, and avoids coupling the API to Moodle's PHP session handling.

---

### 3.3 HTTP Semantics

HTTP methods MUST align with operation intent.

| Method | Usage |
| --- | --- |
| GET  | Retrieve resources  |
| POST  | Create resources  |
| PUT  | Replace resources  |
| PATCH  | Partial updates  |
| DELETE  | Remove resources  |
| HEAD  | Detect resource existence  |
| OPTIONS  | Describe communication options  |

Rules:

- GET operations MUST NOT modify state
- POST MUST NOT be used for retrieval

#### RATIONALE

Aligning methods with their defined HTTP semantics lets intermediaries such as browsers, proxies, and CDNs cache and retry requests safely. If GET could mutate state, caching and pre-fetching would become unsafe, and if POST were used for retrieval, clients could not tell idempotent operations from side-effecting ones.

---

## 4. URI Structure

All REST API URIs MUST be composed of a:

- Base URI and
- Resource-specific URI suffix

### 4.1 Base URI

All REST APIs MUST use:

```plaintext
/api/rest/v{major_version}/
```

`{major_version}` MUST represent the current major API version.

#### REQUIRED

```http
/api/rest/v2/
```

#### RATIONALE

A versioned base path lets Moodle evolve the REST API's structural conventions over time, for example changing pagination or error format, without breaking existing integrations, since old and new major versions can be served side by side. It also gives a single, predictable place for API gateways and documentation tooling to key off.

---

### 4.2 Component URI

All REST APIs MUST specify the component after the base URL.

```
/api/rest/v2/<component>
```

#### EXAMPLE

```
/api/rest/v2/mod_forum
/api/rest/v2/course
/api/rest/v2/user
/api/rest/v2/block_timeline
/api/rest/v2/core
```

#### RATIONALE

Moodle is a plugin-based platform where core and hundreds of plugins each expose functionality. Namespacing every resource under its owning component avoids naming collisions between plugins and core, mirrors Moodle's existing frankenstyle component model that developers already understand, and makes it obvious which plugin owns a given endpoint for maintenance and permission purposes.

---

### 4.3 Resource-specific URI Suffix

Resource paths MUST be appended to the component URI.

#### REQUIRED

```http
/api/rest/v2/<component>/<resource>
/api/rest/v1/<component>/<resource>/{identifier}
/api/rest/v1/<subplugintype>_<subpluginname>/<resource>/{identifier}
```

#### EXAMPLE

```
/api/rest/v2/course/courses
/api/rest/v2/course/courses/9454
/api/rest/v2/user/users/42
/api/rest/v2/mod_forum/discussions/99
/api/rest/v2/assignsubmission_comments/comments/455
```

#### RATIONALE

Appending the resource path after the component keeps a consistent, predictable URI shape across the whole API, so any client or code generator can construct or parse a URI knowing only the pattern component/resource/identifier, without needing per-endpoint special cases.

---

## 5. Resource Naming Rules

### 5.1 General Rules

Resource names MUST:

- use plural nouns
- use lowercase
- use kebab-case
- avoid verbs

#### REQUIRED

```http
/course-categories
/user-enrolments
/course-modules
```

#### FORBIDDEN

```http
/getCourses
/courseModules
/course_modules
/createDiscussion
/coursecategories
```

Resource path segments MUST use kebab-case even when equivalent JSON fields use concatenated lowercase words.

#### RATIONALE

Plural nouns describe collections consistently regardless of operation, and kebab-case is the de facto web convention for URL path segments because it's case-insensitive-safe, readable, and avoids URL-encoding issues that spaces or underscores can cause in some contexts. Path casing is deliberately decoupled from JSON body casing (see section 9.1) because URIs and JSON serialization follow different ecosystem conventions, and mixing them would force clients to guess which convention applies where.

---

## 6. Path Parameters

### 6.1 Parameters

Path parameters MUST:

- use camelCase
- use concatenated words with NO spacing or special characters
- end with `Id` when referencing identifiers

Path parameters MUST NOT use:

- kebab-case
- snake_case
- StudlyCaps

#### REQUIRED

```http
/<component>/<resource>/{courseId}
/<component>/users/{userId}
```

#### EXAMPLE

```
/course/course-categories/42
/course/courses/name:ECON-100-2026
```

#### FORBIDDEN

```http
/courses/{course_id}
/users/{userid}
/courses/{course id}
/courses/{course-id}
/users/{user}
```

#### RATIONALE

Path parameters are placeholders substituted into JSON-facing code and often map directly to JSON identifier fields, for example courseId, so matching JSON's camelCase convention keeps the two consistent for developers reading the endpoint signature next to the payload. A consistent Id suffix also makes it unambiguous, at a glance, which path segments are identifiers versus literal resource names.

---

## 7. Resource Structure Rules

### 7.1 Nested Resources

Nested resources MUST only be used only for direct ownership or containment relationships.

Rules:

- must represent clear hierarchical ownership
- must remain shallow (maximum recommended depth: 2)
- must remain readable

#### REQUIRED

```http
/courses/{courseid}/sections
/mod_forum/It was /{discussionid}/posts/{postid}
```

#### FORBIDDEN

```http
/courses/{course_id}/sections/{sectionid}/activities/{activityid}/submissions/{submissionid}
```

#### RATIONALE

Deep nesting couples URI structure tightly to data-model relationships, so any change to how resources relate would break client URLs, and long nested paths become hard to read, cache, and generate correct authorization checks for at every level. Limiting nesting to direct containment, such as a course's sections, keeps URIs stable and lets deeper relationships be expressed through query parameters or the resource's own top-level collection instead.

---

## 8. Component Namespacing

### 8.1 Core APIs

Core APIs MUST include component prefixes.

Core APIs MUST NOT include the `core_` prefix.

#### REQUIRED

```http
/course/courses
/user/users
/course/course-categories
```

---

#### FORBIDDEN

```http
/core_course/courses
/core_user/users
```

#### RATIONALE

Core Moodle subsystems, such as course or user, still need a namespace to stay consistent with the plugin URI pattern in section 8.2, but the core_ prefix used in legacy web service function names is redundant in a REST context since the absence of a frankenstyle plugin type already implies core. Dropping it keeps core URIs shorter and cleaner while still being unambiguous.

---

### 8.2 Plugin APIs

Plugin APIs MUST include Moodle component namespaces in the frankenstyle format.

#### REQUIRED

```http
/mod_forum/discussions
/mod_assign/submissions
/local_myplugin/settings
/tool_uploadcourse/jobs
```

#### FORBIDDEN

```http
/discussions
/submissions
/settings
```

#### RATIONALE

Frankenstyle component names are already the canonical, unique identifier for every Moodle plugin across core and third-party add-ons. Reusing that existing naming scheme in URIs avoids collisions between plugins that expose similarly named resources, and lets developers immediately map an API endpoint to the plugin's codebase without inventing a second naming system.

---

### 8.3 Component Naming Rules

Component prefixes MUST:

- match Moodle component names
- use lowercase
- preserve underscores
- remain globally unique

#### RATIONALE

These rules ensure the URI namespace stays in lockstep with Moodle's existing component registry (core_component), so there is exactly one source of truth for a plugin's identity. Any drift, such as a differently cased or abbreviated name in the API, would create confusion between the codebase and the API surface, and could cause collisions since Moodle already guarantees component name uniqueness.

---

## 9. Data Format Standards

### 9.1 JSON Field Naming

JSON fields SHOULD use concatenated camelCase words with NO spacers or special characters.

JSON fields MUST NOT use:

- snake_case
- StudlyCaps
- kebab-case
- UPPERCASE

### REQUIRED

```json
{
  "courseId": 42,
  "shortName": "math101",
  "createdAt": 1779193800,
  "startDate": 1779193800
}
```

### FORBIDDEN

```json
{
  "courseid": 42,
  "short_name": "math101",
  "created-at": 1779193800,
  "start date": 1779193800
}
```

#### RATIONALE

camelCase is the prevailing convention in modern JSON APIs and matches JavaScript and TypeScript client code directly, so front-end and mobile developers can consume payloads without a field-name translation layer. It's a deliberate departure from Moodle's internal PHP and database convention of snake_case, chosen to make the public API idiomatic for its consumers rather than mirroring Moodle's internal storage layer.

---

### 9.2 Nullability Rules

- Nullable fields MUST be explicit
- Arrays SHOULD NOT contain null values
- Nullable fields SHOULD only exist when semantically required

#### RATIONALE

Explicitly declaring which fields are nullable, rather than leaving it ambiguous, lets OpenAPI schemas and generated client types be accurate, so consumers can rely on strict typing instead of defensive null checks everywhere. Avoiding null inside arrays and only allowing nullable fields where a genuine "no value" state exists in the data model keeps payloads predictable and avoids nulls being used as a stand-in for missing or not-yet-implemented data.

---

### 9.3 Date and Time Standards

Dates and Timestamps MUST:

- use the ISO-8601 format
- Include the timezone

Timestamps SHOULD:

- be returned in the _current user's timezone_

Timestamps MUST NOT

- use Unix timestamp format

### REQUIRED

```json
{
  "createdAt": "2026-05-19T12:30:00+01:00"
}
```

### PROHIBITED

```json
{
  "createdAt": 1779193800
}
```

#### RATIONALE

ISO-8601 strings are self-describing and human-readable in logs and API explorers, unlike Unix timestamps which require external context to interpret and can't unambiguously carry timezone information. Returning timestamps in the current user's timezone matches how Moodle already displays dates throughout its UI, so API consumers building user-facing features get behaviour consistent with the rest of the platform without doing their own timezone conversion. This is particularly important because JavaScript's native Date object has poor built-in timezone support and handles Unix timestamps inconsistently across environments, so requiring an explicit, timezone-carrying string avoids ambiguity that JavaScript clients would otherwise introduce.

---

## 10. Collection Standards

### 10.1 Response Format

Collection endpoints MUST return:

```json
{
  "items": [
    {
      "id": 42,
      "fullName": "Introduction to Economics"
    }
  ],
  "pagination": {
    "page": 1,
    "pagesize": 25,
    "totalitems": 1
  }
}
```

#### RATIONALE

A consistent envelope for every collection endpoint means clients can write one generic pagination and list-rendering component instead of a bespoke one per endpoint, and it clearly separates the actual data (items) from metadata about the result set (pagination), avoiding ambiguity about which top-level keys are data versus paging info.

---

### 10.2 Pagination

Collection endpoints MUST support pagination via query parameters:

```http
?page=1&pagesize=25
```

The default values of these parameters are:

| Rule | Value |
| --- | --- |
| Default page  | 1  |
| Default pagesize  | 25  |
| Maximum pagesize  | 100  |

The default and maximum page sizes MAY be respecified within an endpoint.

#### RATIONALE

Mandatory pagination protects Moodle sites with large datasets, for example a site with 100,000 users, from accidentally returning unbounded result sets that could exhaust server memory or time out. Standardizing the parameter names and defaults across all endpoints means a single API client library can implement pagination once and reuse it everywhere, rather than special-casing each endpoint.

---

### 10.3 Sorting

Sorting MUST:

- be specified as query parameters
- be specified in the format:

```http
?sort=createdat,-fullname
```

Descending order MUST use `-`.

If no sort order is specified, order is not guaranteed.

#### RATIONALE

A single comma-separated sort parameter with a - prefix for descending order is a widely recognized convention, used by JSON:API and many other REST APIs, that supports multi-field sort without needing a growing number of bespoke query parameters. Explicitly stating that order isn't guaranteed when unspecified avoids clients accidentally depending on incidental database ordering that could change without notice, for example after an index change. Even when a sort is explicitly specified, rows with equal values on the sorted field or fields don't get a guaranteed relative order unless the client adds further fields as tiebreakers, for example ?sort=firstname,-id, since the guarantee only applies to the fields actually specified.

---

### 10.4 Filtering

Filtering of results MUST use query parameters:

```http
/courses?categoryid=3&visible=true
```

#### RATIONALE

Query parameters are the standard HTTP mechanism for narrowing a GET request without changing the resource identity in the path, keeping the URI stable and cacheable for a given filter combination. It also keeps filtering orthogonal to pagination and sorting, so the three concerns can be combined freely without special-case syntax.

---

## 11. Endpoint Patterns

### 11.1 Collection Resource Pattern

```http
GET /api/rest/v{version}/<component>/<resource>
```

#### REQUIRED Behaviour

- pagination
- filtering
- sorting
- authorization filtering

#### REQUIRED Response

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pagesize": 25,
    "totalitems": 100
  }
}
```

#### RATIONALE

This section exists to guarantee every collection endpoint behaves consistently: a developer or AI generator building a new endpoint for any component can follow this single pattern rather than rediscovering pagination, filtering, sorting, and authorization scoping independently each time, reducing both implementation inconsistency and security gaps, such as forgetting to filter results by capability.

---

### 11.2 Single Resource Pattern

```http
GET /api/rest/v{version}/<component>/<resource>/<identifier>
```

#### REQUIRED Behaviour

- authorization validation
- 404 handling
- capability enforcement
- expansion support

#### RATIONALE

Retrieving a single resource by identifier still requires the same authorization and capability checks as a collection, just scoped to one record; making this explicit prevents implementers from assuming that fetching one thing is lower risk than listing many and skipping checks. Standardizing 404 handling also ensures a consistently shaped error response, per section 12, rather than each endpoint inventing its own not-found behaviour.

---

### 11.3 Create Resource Pattern

```http
POST /api/rest/v{version}/<component>/<resource>
```

#### REQUIRED Behaviour

- input validation
- duplicate handling
- transactional integrity
- capability enforcement

#### REQUIRED Response

```http
201 Created
```

The response MUST include:

- Location header
- created resource representation

#### RATIONALE

Returning 201 with a Location header follows HTTP semantics for resource creation and gives clients the canonical URI of the new resource without them having to construct it themselves. Requiring the created representation in the response saves a follow-up GET, and mandating transactional integrity and duplicate handling protects Moodle's data integrity when, for example, two requests attempt to create the same course simultaneously.

---

### 11.4 Complex Resource Transformations Pattern (Cloning, Imports)

Operational processes that generate resources by copying, duplicating, or importing data from another existing asset MUST be modeled as a resource creation operation (`POST`) targeting the _destination resource collection_. The source asset identity MUST be passed strictly as a query parameter modifier or request metadata property.

#### REQUIRED Sourcing Architecture

```http
POST /api/rest/v{version}/<component>/<resource>?clonefrom=<identifier>
```

```http
POST /api/rest/v{version}/<component>/<resource>/<identifier>/<resource>?sourcecourseid=5
```

#### FORBIDDEN Sourcing Architecture

```http
POST /api/rest/v{version}/<component>/<resource>/<identifier>/duplicate
```

```http
POST /api/rest/v{version}/<component>/<resource>/<identifier>/imports
```

#### RATIONALE

Cloning or importing fundamentally creates a new resource, so it belongs under the same POST-to-collection semantics as any other creation (see section 11.3), rather than inventing an action-style sub-path like /duplicate that violates the noun-only rule in section 3.1. Passing the source as a query parameter or metadata property keeps the URI focused on the destination resource being created, which is what the client is actually requesting.

---

### 11.5 State Evaluation and Delta Query Pattern

Operational queries that compute states, track timeline deltas, or check for data synchronizations (e.g., checking for content updates since a specific marker) MUST be designed as read-only operations using `GET`. Developers and generating AI engines MUST NOT append execution command verbs (such as `/check`, `/verify`, or `/calculate`) to path strings.

#### REQUIRED Pattern

```http
GET /api/rest/v{version}/<component>/<resource>/<identifier>/updates?since=1779193800
GET /api/rest/v{version}/<component>/<resource>/<identifier>/updates?since=2026-05-19T12:30:00+01:00
```

#### FORBIDDEN Pattern

```http
POST /api/rest/v{version}/<component>/<resource>/<identifier>/updates/check
```

#### RATIONALE

Checking for updates or computing a state delta is a read-only query, not a mutation, even though it involves computation on the server. Modeling it as GET on a sub-resource, such as /updates, keeps it cacheable and safe to retry or prefetch, and avoids the anti-pattern of a POST-based command endpoint that hides a read operation behind a verb.

---

### 11.6 Declarative Property Representation Pattern

Payload objects for mutation requests using `POST`, `PUT`, and `PATCH` MUST pass exclusively state attributes that describe the final structural configuration of the target resource data model at rest rather than execution routines, transition directions, or step calculations.

#### REQUIRED Declarative Architecture

```http
PATCH /api/rest/v{version}/course-categories/5
{
  "parent": 2,
  "sortorder": 1
}
```

#### FORBIDDEN Declarative Architecture

```http
PATCH /api/rest/v{version}/course-categories/5
{
  "move": "up",
  "incrementdepth": 1
}
```

#### RATIONALE

Declarative payloads describe what the resource should look like afterwards, which is idempotent, easy to validate against a schema, and safe to retry. Imperative payloads like "move": "up" encode a transition rather than a state, so retries or race conditions between two clients could produce different results depending on execution order, undermining PATCH's idempotency expectations from section 15.2.

---

### 11.7 Declarative Resource Modification Pattern

State alterations, resource updates, lifecycle suspensions, and value updates MUST target the resource noun directly using standard mutation verbs without appending procedural execution flags or custom action sub-resource extensions to path strings.

#### REQUIRED Mutation Architecture

```http
PATCH /api/rest/v{version}/course-modules/40
{
  "visible": false
}
```

#### FORBIDDEN Mutation Architecture

```http
PATCH /api/rest/v{version}/course-modules/40
{
  "action": "hide"
}
```

#### RATIONALE

This reinforces section 11.6 specifically for lifecycle state changes such as visibility or suspension: an "action": "hide" flag is really just an RPC verb smuggled into the request body, violating the resource-oriented principle in section 3.1 just as surely as putting a verb in the URI would. Setting the actual field value directly, such as "visible": false, keeps the operation declarative, idempotent, and self-documenting from the payload alone.

---

## 12. Error Handling

### 12.1 Standard Error Format

All errors MUST use:

```json
{
  "error": {
    "code": "coursenotfound",
    "message": "Course not found",
    "details": []
  }
}
```

#### RATIONALE

A single, predictable error envelope across every endpoint means client code and error-handling middleware can be written once, rather than needing to parse endpoint-specific error shapes. Separating a stable, machine-readable code from a human-readable message lets clients branch on logic reliably while still surfacing a readable message to end users, and details gives room for structured context without breaking the top-level shape.

---

### 12.2 Validation Errors

Validation errors MUST include field-level details.

#### REQUIRED

```json
{
  "error": {
    "code": "validationerror",
    "message": "Invalid input",
    "details": [
      {
        "field": "shortname",
        "message": "Must be unique"
      }
    ]
  }
}
```

#### RATIONALE

A generic "invalid input" message forces the client, or a human filling out a form, to guess which field failed and why. Field-level details let clients map errors directly back to the offending form field, which is essential for building usable client UIs on top of the API, especially for Moodle's own forms and mobile app.

---

### 12.3 Error Code Rules

Error codes MUST:

- remain stable
- be machine-readable
- use concatenated lowercase words with NO spacers or special characters
- avoid localization

Error codes MUST NOT:

- use camelCase
- use kebab-case
- use snake_case

#### REQUIRED

- "coursenotfound"

#### PROHIBITED

- "course_not_found"
- "courseNotFound"
- "course-not-found"

#### RATIONALE

Error codes are meant to be matched programmatically by client logic, so they must stay stable across releases and be casing-convention-free to avoid clients hardcoding fragile casing assumptions; this also matches Moodle's existing legacy convention of lowercase exception and string identifiers, such as coursenotfound in language files. Avoiding localization in the code itself keeps it a stable identifier, while the separate message field, see section 12.1, carries the human-readable, localizable text.

---

## 13. HTTP Status Codes

| Status | Usage |
| --- | --- |
| 200  | Success  |
| 201  | Created  |
| 202  | Accepted  |
| 204  | No Content  |
| 400  | Invalid request  |
| 401  | Unauthenticated  |
| 403  | Unauthorized  |
| 404  | Resource not found  |
| 409  | Conflict  |
| 422  | Validation failure  |
| 429  | Rate limited  |
| 500  | Internal error  |

### RATIONALE

Using standard HTTP status codes for their documented meaning, rather than always returning 200 with an error object in the body as much legacy Moodle web service code does, lets generic HTTP infrastructure, such as proxies, monitoring, and client libraries, correctly interpret success and failure without inspecting the response body first.

---

## 14. Authentication and Authorization

### 14.1 Authentication

Preferred authentication methods:

- OAuth2
- ****** Service tokens

Session-cookie-only APIs SHOULD be avoided.

#### RATIONALE

OAuth2 and service tokens are stateless credentials that travel with each request, satisfying the statelessness requirement in section 3.2, and are supported natively by third-party integrations, mobile apps, and server-to-server clients, unlike browser session cookies which assume a same-origin browser context and don't work well for non-browser or cross-domain clients.

---

### 14.2 Authorization

Authorization MUST be scope-based.

#### REQUIRED

```plaintext
moodle/course:view
moodle/course:update
```

All endpoints MUST define:

- required scopes
- access boundaries
- ownership rules

#### RATIONALE

-*TO DO:** this rationale needs further work — the scope naming examples in this section are still under review and will be revised before this rationale is finalized.

---

## 15. Concurrency and Idempotency

### 15.1 Concurrency Control

Mutable resources SHOULD support optimistic concurrency control.

If supported, APIs MUST use:

```http
ETag
If-Match
```

Conflicting updates MUST return:

```http
412 Precondition Failed
```

#### RATIONALE

Optimistic concurrency lets Moodle avoid locking rows for the duration of an edit, which would hurt scalability, while still protecting against two clients overwriting each other's changes unknowingly, such as two teachers editing the same course settings simultaneously. ETag and If-Match are the standard HTTP mechanism for this, so existing HTTP client and proxy support can be reused rather than inventing a bespoke versioning scheme.

---

### 15.2 Idempotency

| Method | Idempotent |
| --- | --- |
| GET  | Yes  |
| PUT  | Yes  |
| DELETE  | Yes  |
| POST  | No  |
| PATCH  | No guarantee  |

Retryable POST operations SHOULD support:

```http
Idempotency-Key
```

Duplicate request behaviour MUST be explicitly defined.

#### RATIONALE

Clients on unreliable networks, particularly mobile, need to safely retry requests without accidentally creating duplicate resources; since POST is inherently non-idempotent, an explicit Idempotency-Key lets the server recognize and deduplicate a retried creation request as the same logical operation, rather than the client having to guess whether a prior request actually succeeded before retrying.

---

## 16. Legacy REST Migration and Backward Compatibility

This section defines mandatory standards for transitioning legacy Moodle RPC external functions into RESTful resource layouts while guaranteeing zero data loss, zero dropped fields, and structural regression protection for existing system consumers.

### 16.1 The Return Payload Superset Rule

When an RPC function is migrated to a REST endpoint, the new REST JSON response payload MUST be a **functional superset** of the legacy RPC return structure.

#### Normative Rules

- Redesigned REST response payloads MUST include every data property returned by the original legacy RPC external function block.
- Old fields may only be fully removed in a future major version release cycle, never in minor updates.

#### RATIONALE

-*TO DO:** this section is under revision; most of it is being removed as incorrect, so its rationale will be drafted once the replacement content is agreed.

---

## 17. Prohibited Patterns

The following are FORBIDDEN:

- RPC-style endpoints
- action-based URLs
- deep resource nesting
- generic `"data"` wrappers
- inconsistent date formats
- undocumented enum values
- POST-based retrieval APIs
- session-dependent APIs

---

## 18. Consistency Requirements

APIs MUST maintain consistency across:

- naming
- pagination
- filtering
- sorting
- error structures
- authentication
- authorization
- response formats

The same concept MUST NOT use multiple names.
