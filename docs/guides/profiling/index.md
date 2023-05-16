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

## Tideways (replacement for XHProf)

[Tideways](https://tideways.com/profiler/downloads) is a PHP7-compatible replacement for XHProf, and support for this is built into Moodle. ([Tideways](https://tideways.io/) is a large, paid-for service, which helps to identify a range of issues with production servers. Whilst the service itself is a paid-for service, the instrumentation tooling is both Open Source, and free.)

When the XHProf PHP extension is installed, the "Profiling"  section is displayed in "Site administration / Development". And when the profiling setting (`profilingenabled`) is enabled, a new link "Profiling runs" is also displayed in the Development tab. From this section, apart from access to the profiling runs, you can also import .mpr (Moodle profiling) files.

There are two variants of the plugin. You will almost certainly want the tideways_xhprof plugin.

- [tideways](https://tideways.com/profiler/downloads) - the original tool, which includes both xhprof instrumentation, and support for the Tideways service. This version is compatible with:
  - Moodle 3.0.6
  - Moodle 3.1.2
  - Moodle 3.2 onwards
- [tideways_xhprof](https://github.com/tideways/php-xhprof-extension) - a rewritten implementation of the original which only includes the xhprof instrumentation. Compatible with:
  - Moodle 3.1.12
  - Moodle 3.2.9
  - Moodle 3.3.6
  - Moodle 3.4.3
  - Moodle 3.5 onwards

For installation details please see https://github.com/tideways/php-xhprof-extension

See

- [Setting up xhprof on Moodle](https://docs.moodle.org/dev/Setting_up_xhprof_on_Moodle)
- http://tjhunt.blogspot.co.uk/2013/05/performance-testing-moodle.html
- https://docs.google.com/presentation/d/1MV4R71UBgPgzM6I9h_yDnYcxIJlgCoLBUDtJJr-TzNI/present#slide=id.i0 presentation about using XHProf

### Export Xhprof data to plugins

Starting at 3.6, Moodle allows for a plugin to handle the Xhprof data and not insert the traces into the database as implemented in ([MDL-63031](https://tracker.moodle.org/browse/MDL-63031))[](https://tracker.moodle.org/browse/MDL-63031)

To disable Moodle from writing traces to the database, add: `$CFG->disableprofilingtodatabase = false;` into config.php

Plugins will need to provide a _store_profiling_data function to handle the data.

## Xdebug

[Xdebug](http://xdebug.org/docs/profiler) is a powerful PHP debugging tool. The first release of Xdebug was in 2002, since that it keeps growing and remains popular among PHP developers. Among its major features are stack and function tracing, code coverage analysis, remote debugging and scripts profiling. As the page topic suggests, we will focus on its profiling feature, which provides developer with detailed information about the script performance, helps identifying which parts of the code are slow. Collected information is being stored in cachegrind compatible file and can be analysed using one of external tools, such as [KCachegrind](http://kcachegrind.sourceforge.net/html/Home.html), [WinCacheGrind](http://sourceforge.net/projects/wincachegrind/), [xdebugtoolkit](http://code.google.com/p/xdebugtoolkit/) or web-based analyser [Webgrind](https://github.com/jokkedk/webgrind#readme). Xdebug is simple to install and operate, it does not require code changes.

### Installing Xdebug extension

The first step that has to be done is installing Xdebug extension. This procedure depends on the OS you are using, but general idea is to obtain Xdebug php extension and specify full path to it using *zend_extension* setting in *php.inf* file. Official [Xdebug installation documentation](http://www.xdebug.org/docs/install) explains its installation on Windows, installing through PEAR/PECL and compiling from source.
Xdebug has been packaged for many Linux distributions, so it can be installed using corresponding package management tool. On Debian or Ubuntu, for example one would need to execute:

```shell
# apt-get install php5-xdebug
```

This will put *xdebug.so* in default php modules directory and create */etc/php5/conf.d/xdebug.ini* file with single line:

 zend_extension=/usr/lib/php5/20090626/xdebug.so

Note that this is equal to specifying the same line in *php.inf*, example above just reflects split php configuration.

Once the Xdebug extension is installed and specified in php configuration, one may restart the webserver and information about Xdebug should appear in *phpinfo()* function output. If not, make sure that *zend_extension* line is not commented out, extension file exists in specified location and refer to webserver logs for more details.

### Configuring Xdebug Profiler

When Xdebug extension is installed, it is time to configure profiling functionality. (If you are running apache2 as your web server and are using split configuration files such as the default apt-get install mentioned above, these settings should be added to "/etc/php5/apache2/conf.d/xdebug.ini".)  There are number of parameters related to profiling, all of them start with *xdebug.profiler_* prefix. First of all, profiler should be enabled. There are two ways of doing it. One way is keeping it always enabled, so profiling information will be generated on every page request:

 xdebug.profiler_enable=1

Another way is making Xdebug writing profiling information on demand by triggering it with GET/POST or COOKIE variable named *XDEBUG_PROFILE*:

 xdebug.profiler_enable_trigger = 1

This option is preferable for several reasons: profiling data files are relatively large especially on complex scripts and you may run out of disk-space pretty quick, it allows generating profiling information only when you need it, thus it is easier to find the generated file in output directory, finally, on demand profiling can be done on production servers, though it is not recommended. If you have enabled *xdebug.profiler_enable_trigger* option, make sure that *xdebug.profiler_enable* is disabled, otherwise this will lead to dump file being generated on each request.

Whatever method of profiling enabling you have chosen, profiling data files will be generated on each request (or request with a trigger parameter) in directory specified with *xdebug.profiler_output_dir* directive. By default is it set to */tmp*, but you may change it to any more suitable location.

 xdebug.profiler_output_dir=/tmp

Generated file will be named in accordance with *xdebug.profiler_output_name* setting. This setting can handle some specifiers and use them in the file name. Default name pattern is *cachegrind.out.%p*; in the actual file name %p will be replaced with process ID value. The fill list of specifier can be found [here](http://www.xdebug.org/docs/all_settings#trace_output_name). More intuitive naming is recommended, so that it is easier to find the file you have just generated in the bunch of others:

 xdebug.profiler_output_name=cachegrind.out.%R.%t

With this naming pattern, timestamp and script name will be reflected in the file name.

When you are done with configuration, it is time to test it. First of all, the webserver has to be restarted, so that the new config will come into effect. Depending on your operating system and web server, you should be able to restart it with a command similar to:

 sudo service apache2 restart

(This should work for apache2 on several flavours of Linux.)

### Profiling a page

Now assuming that Xdebug was configured to use a trigger for script profiling, open any php page on your server in your browser having added *XDEBUG_PROFILE* parameter to URL string:

 `http://servername/moodle2/index.php?XDEBUG_PROFILE`

or if it already has some parameters, just add our trigger to the URL end:

 `http://servername/moodle2/mod/forum/view.php?id=5&XDEBUG_PROFILE`

As a result, the new file should be generated in directory you specified with *xdebug.profiler_output_dir* directive:

 cachegrind.out._moodle2_mod_forum_view_php.1289838411
 cachegrind.out._moodle2_index_php.1289837892

Triggering profiling with POST requests or AJAX queries is also possible without code changes. [Easy Xdebug](https://addons.mozilla.org/en-US/firefox/addon/58688/) plugin for FireFox has profiling toggle button that inserts XDEBUG_PROFILE variable into cookie data, thus making profiling enabled for as long as you wish for all requests. Similar plugins exist for [Chrome](https://chrome.google.com/extensions/detail/eadndfjplgieldjbigjakmdgkmoaaaoc) and [Safari](https://github.com/benmatselby/xdebug-toggler) browsers.

### Analyzing Xdebug profiling files

As it was pointed out earlier, profiling data is recoded in cachegrind format, so it can be analysed using one of external tools, such as [KCachegrind](https://kcachegrind.github.io/html/Home.html), [WinCacheGrind](http://sourceforge.net/projects/wincachegrind/), [xdebugtoolkit](http://code.google.com/p/xdebugtoolkit/) or web-based analyser [Webgrind](https://github.com/jokkedk/webgrind#readme). Using these tools is pretty simple. I prefer KCachegrind which has a feature to show the matching code if web-server is run on the same box. Xdebug profiler documentation page has a [section](http://xdebug.org/docs/profiler#misc) about KCachegrind that worth reading for everyone who starts using KCachegrind.

### Quick summary

1. Install Xdebug 3 extension on your server.

2. Add something like this to your php.ini file:
```
zend_extension = /usinir/local/lib/php/pecl/20190902/xdebug.so
xdebug.mode = profile
xdebug.start_with_request = trigger
xdebug.output_dir = /var/tmp
xdebug.profiler_output_name = cachegrind.out.%R.%t

```
or add something like this to your .htaccess file

```ini
php_flag  xdebug.mode = profile
php_flag  xdebug.start_with_request = trigger
php_value xdebug.output_dir /var/tmp
php_value xdebug.profiler_output_name cachegrind.out.%R.%t
```

3. When you want to profile a page, add <tt>&XDEBUG_PROFILE</tt> to the end of the URL.

4. Open the <tt>cachegrind.out....</tt> file that is generated with one of the tools mentioned above.

## See also

- [Forum thread about profiling Moodle 2.0](http://moodle.org/mod/forum/discuss.php?d=162045)
XHProf articles:
- [<s>Presentation about XHProf</s>](https://docs.google.com/present/view?id=dcbkgbgf_45fbg3rnmk&)
- [<s>Profiling with XHProf</s>](http://techportal.ibuildings.com/2009/12/01/profiling-with-xhprof/)
- [<s>XHProf – Profiling and Reporting</s>](http://www.open.ac.uk/blogs/XHProf/?page_id=46) from Moodle perspective written by [James Brisland](http://moodle.org/user/view.php?id=264538&course=5)
Xdebug articles:
- [Introducing xdebug](http://devzone.zend.com/article/2803-Introducing-xdebug)
- [Xdebug Quick start: Profiling in PHP](http://blog.teamlazerbeez.com/2010/05/04/xdebug-quickstart-profiling-in-php/)


<!-- cspell:ignore xhprof , cachegrind, pecl , xdebugtoolkit , webgrind , phpinfo -->
