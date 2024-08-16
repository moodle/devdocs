---
title: Profiling PHP
tags:
  - profiling
  - xdebug
  - tideways
  - xhprof
  - zend
---
PHP has two types of profiler:

- XHProf is a standard designed for capturing profile traces on live servers. It was originally designed by engineers at Facebook and is suitable for production environments.
- [XDebug](http://www.xdebug.org/docs/profiler) is well known. and understood, and its trace output is supported by tools like [KCachegrind](http://kcachegrind.sourceforge.net/html/Home.html). It is not recommended for production environments.

## XHProf

XHProf is both a standard, and a profiler itself. Support for the standard, and two of the standard implementations of it, are built into Moodle.

### Extensions

Moodle supports two extensions which export to the xhprof standard:

- [xhprof](#extensions-xhprof)
- [Tideways](#extensions-tideways)

#### XHProf Extension {#extensions-xhprof}

XHProf is a function-level hierarchical profiler for PHP. The raw data collection component is implemented in C, as a PHP extension. It is capable of reporting function-level inclusive and exclusive wall times, memory usage, CPU times and number of calls for each function. Additionally, it supports ability to compare two runs (hierarchical DIFF reports), or aggregate results from multiple runs.

For more information, see:

- [Installation and API Documentation](https://www.php.net/manual/en/book.xhprof.php)
- [Change-logs and Version information](https://pecl.php.net/package/xhprof)

#### Tideways Extension {#extensions-tideways}

[Tideways](https://tideways.com/profiler/downloads) is an alternative to XHProf, and support for this is built into Moodle. The maintainer, [Tideways](https://tideways.io), is a large, paid-for service, which can be used to identify a range of issues with production services.

:::note

Whilst the service itself is a paid-for service, the instrumentation tooling is both Open Source, and free.

:::

There are two variants of the plugin. You will almost certainly want the `tideways_xhprof` plugin.

- [tideways](https://tideways.com/profiler/downloads) - the original tool, which includes both xhprof instrumentation, and support for the Tideways service.
- [tideways_xhprof](https://github.com/tideways/php-xhprof-extension) - a rewritten implementation of the original which only includes the xhprof instrumentation.

For installation details please see https://github.com/tideways/php-xhprof-extension

### Export Xhprof data to plugins

<Since versions={["3.6"]} issueNumber="MDL-63031" />

Moodle allows for a plugin to handle the Xhprof data and not insert the traces into the database.

To disable Moodle from writing traces to the database, add: `$CFG->disableprofilingtodatabase = false;` into config.php

Plugins will need to provide a `store_profiling_data` function to handle the data.

### Configuration within Moodle

Once an xhprof extension is correctly installed you will find a new "**Profiling**" option available under Settings > Site administration > Development.

:::note

This documentation assumes that you have already installed an appropriate xhprof extension. Please refer to the relevant documentation for your chosen extension for more information.

:::

To enable profiling you must ensure that the _Enable profiling_ setting is enabled. We recommend specifying one, or more, paths to profile. Paths should be specified relative to your Moodle directory, and not the web root.

:::tip

You can use the asterisk (`*`) as a wildcard when specifying a path, for example:

```
mod/*/view.php
```

:::

After you have enabled profiling you should visit the pages you wish to profile.

The generated profiles can be found under Settings - Site administration -> Development -> Profiling runs. You can view the resultant profiles as:

- a data table; and
- a callgraph.

:::note

To view a callgraph, you must have installed Graphviz, and configured the `pathtodot`.

:::

Profiles can also be compared with other runs on the same page, allowing you to compare the impact of changes you make.

### Further reading

- http://tjhunt.blogspot.co.uk/2013/05/performance-testing-moodle.html
- https://docs.google.com/presentation/d/1MV4R71UBgPgzM6I9h_yDnYcxIJlgCoLBUDtJJr-TzNI/present#slide=id.i0 presentation about using XHProf

## Xdebug

[Xdebug](http://xdebug.org/docs/profiler) is a powerful PHP debugging tool which is actively maintained, and provides a range of useful debugging features.

Among its major features are stack and function tracing, code coverage analysis, remote debugging, and profiling of scripts.

This page will focus on its profiling feature, which provides developer with detailed information about the script performance, helps identifying which parts of the code are slow. Collected information is being stored in cachegrind compatible file and can be analysed using one of external tools, these include:

- [KCachegrind](http://kcachegrind.sourceforge.net/)
- [WinCacheGrind](http://sourceforge.net/projects/wincachegrind/)
- [xdebugtoolkit](http://code.google.com/p/xdebugtoolkit/)
- [Webgrind](https://github.com/jokkedk/webgrind#readme)

Xdebug is simple to install and operate. it does not require code changes.

### Installing Xdebug extension

Xdebug is available as an extension to PHP and is typically installed using pecl. Exact instructions will depend on your Operating System.

For full instructions, see the [Xdebug installation documentation](https://xdebug.org/docs/install).

Once the Xdebug extension is installed and specified in php configuration, you should restart your webserver.

:::note tip

Information about Xdebug should appear in `phpinfo()` function output. If not, make sure that `zend_extension` line is not commented out, extension file exists in specified location and refer to webserver logs for more details.

:::

### Configuring the Xdebug Profiler

When Xdebug extension is installed, it must be configured as a profiler.

A number of parameters relate to profiling. First of all, profiler should be enabled -- there are two primary ways of doing it.

Both methods of configuration require that you set the xdebug mode to `profiler`:

```ini title="php.ini"
xdebug.mode = profile
```

The default configuration once the mode is set to profiler is for the profiler to start for every request.

This behaviour is configured via the [`start_with_request`](https://xdebug.org/docs/all_settings#start_with_request) option. With its default setting (`default`) it will profile every request.

It can also be enabled for specific pages by watching for a [_trigger_](https://xdebug.org/docs/all_settings#start_with_request#trigger)..

```ini title="php.ini"
xdebug.mode = profile
xdebug.start_with_request = trigger
```

This tells the xdebug extension to look for a specific variable as a trigger named `XDEBUG_TRIGGER`. The following locations are checked for the presence of this variable:

- `$_ENV` - environment variables
- `$_GET` - HTTP GET params
- `$_POST` - HTTP POST params
- `$_COOKIE` - An HTTP cookie name

:::tip Configuring the trigger

By default, the content of the variable is not checked, but this can be configured with the `xdebug.trigger_value` parameter, for example:

```ini title="php.ini"
xdebug.mode = profile
xdebug.start_with_request = trigger
xdebug.trigger_value = ProfileMe
```

:::

When using a trigger to start xdebug, open any php page on your server in your browser having added `XDEBUG_PROFILE` parameter to URL string, for example `http://servername/moodle2/index.php?XDEBUG_PROFILE=ProfileMe`.

If that page already has some parameters, just add our trigger to the URL end, for example: `http://servername/moodle2/mod/forum/view.php?id=5&XDEBUG_PROFILE=ProfileMe`.

The profile should be generated in the directory you specified with `xdebug.output_dir` directive:

```shell
cachegrind.out._moodle2_mod_forum_view_php.1289838411
cachegrind.out._moodle2_index_php.1289837892
```

:::tip Profiling POST and AJAX requests

Triggering profiling with POST requests or AJAX queries is also possible without code changes with a number of browser plugins available to help. Plugins are available for most browsers to insert the `XDEBUG_PROFILE` variable into cookie data, thus making profiling enabled for as long as you wish for all requests, the include:

- [Easy Xdebug for Firefox](https://addons.mozilla.org/en-US/firefox/addon/58688/)
- [Chrome](https://chrome.google.com/extensions/detail/eadndfjplgieldjbigjakmdgkmoaaaoc)
- [Safari](https://github.com/benmatselby/xdebug-toggler)

:::

### Analyzing Xdebug profiling files

Profiling data is recorded in the cachegrind format, so it can be analysed using one of external tools, such as [KCachegrind](https://kcachegrind.github.io/html/Home.html), [WinCacheGrind](http://sourceforge.net/projects/wincachegrind/), [xdebugtoolkit](http://code.google.com/p/xdebugtoolkit/) or web-based analyser [Webgrind](https://github.com/jokkedk/webgrind#readme). Using these tools is pretty simple. KCachegrind includes a feature to show the matching code if the web-server is run on the same box.

The Xdebug profiler documentation page has a [section](http://xdebug.org/docs/profiler#misc) about KCachegrind that worth reading for everyone who starts using KCachegrind.

### Quick summary

1. Install Xdebug 3 extension on your server
2. Configure xdebug
3. When you want to profile a page, add `&XDEBUG_PROFILE` to the end of the URL
4. Open the `cachegrind.out` file generated with one of the tools mentioned above

## See also

- [Forum thread about profiling Moodle 2.0](http://moodle.org/mod/forum/discuss.php?d=162045)
XHProf articles:
- [Presentation about XHProf](https://docs.google.com/present/view?id=dcbkgbgf_45fbg3rnmk&)
- [Profiling with XHProf](http://techportal.ibuildings.com/2009/12/01/profiling-with-xhprof/)
- [XHProf – Profiling and Reporting](http://www.open.ac.uk/blogs/XHProf/?page_id=46) from Moodle perspective written by [James Brisland](http://moodle.org/user/view.php?id=264538&course=5)
Xdebug articles:
- [Introducing xdebug](http://devzone.zend.com/article/2803-Introducing-xdebug)
- [Xdebug Quick start: Profiling in PHP](http://blog.teamlazerbeez.com/2010/05/04/xdebug-quickstart-profiling-in-php/)

<!-- cspell:ignore xhprof , cachegrind, pecl , xdebugtoolkit , webgrind , phpinfo , callgraph, graphviz -->
