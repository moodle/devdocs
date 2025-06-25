---
title: Log
---

It is not recommended to use the vanila `window.console.log()` function to output Javascript logging information.

The `core/log` module offers different levels of log output that is governed by Moodle's debugging levels.

```js title="Example use of logging"
import Log from 'core/log';

Log.info("Info class log statement");

Log.debug("Debugging information, only appears when DEBUG mode is DEBUG_DEVELOPER");

```
