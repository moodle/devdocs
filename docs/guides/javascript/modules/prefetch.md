---
title: Prefetch
---
<Since versions={[ 3.9 ]} />

Assets including strings, and templates, can be pre-fetched shortly after the page loads to improve the perceived performance of the page when consuming those components.

```todo
Link to jsdocs here
```

```js title="Example of fetching a string and template"
import Prefetch from 'core/prefetch';

// Prefetch the string 'discussion' from the 'mod_forum' component.
Prefetch.prefetchString('discussion', 'mod_forum');

// Prefetch the strings yes, no, and maybe from the 'core' component.
Prefetch.prefetchStrings('core', ['yes', 'no', 'maybe']);

// Prefetch the templates 'core/toast'.
Prefetch.prefetchTemplate('core/toast');

// Prefetch the templates 'core/toast' and 'core/modal'.
Prefetch.prefetchTemplates(['core/toast', 'core/modal']);
```
