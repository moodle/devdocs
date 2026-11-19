---
title: Moodle 6.0 developer update
tags:
- Core development
- Moodle 6.0
---

{/* <!-- markdownlint-disable no-inline-html --> */}

{/* <!-- cspell:ignore httpswwwroot --> */}

This page highlights the important changes that are coming in Moodle 6.0 for developers.

## $CFG->httpswwwroot property removal

<Since version="6.0" issueNumber="MDL-89722" />

The long-deprecated `$CFG->httpswwwroot` has been removed. It has been an alias for `$CFG->wwwroot` since Moodle 3.4, and any remaining usage in third-party code should be replaced with `$CFG->wwwroot`

## Fetch requests reject with the Response

<Since version="6.0" issueNumber="MDL-89243" />

The `core/fetch` module now rejects a failed request with its `Response` object instead of the response's status text. This gives callers access to the status, headers and body of the error response.

This is a breaking change for any code which uses the rejection reason as a string. Code which must work on both older and newer versions of Moodle can check the type of the reason:

```js
import Fetch from 'core/fetch';

Fetch.performGet('mod_example', 'animals')
    .catch((reason) => {
        // Moodle 6.0 and later reject with the Response. Earlier versions reject with its status text.
        const message = reason instanceof Response ? reason.statusText : reason;
        throw new Error(message, {cause: reason});
    });
```
