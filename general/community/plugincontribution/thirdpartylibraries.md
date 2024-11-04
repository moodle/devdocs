---
title: Plugin with third party libraries
sidebar_position: 5
sidebar_label: Third-party libraries
tags:
  - Guidelines for contributors
  - Plugins
  - Plugin documentation
---
This page describes the correct way to include third party libraries with your plugin.

A third party library refers to any library where the latest version of the code is not maintained and hosted by Moodle. An example is "Mustache.php". Following this process means that all third party libraries are correctly listed in the page *Site administration > Development > Third party libraries*, they can be tracked and kept up to date - and we will not introduce conflicting versions of the same library in different places.

## Instructions

The process for including a third-party library is the same for both core code and plugins, except for the location of the `thirdpartylibs.xml` file. For core code, this file is located in the lib folder, while for plugins, it is found in the root of the plugins folder. There are several steps to follow.

1. Check the license to make sure the library uses a GPLv3 compatible license - see the [list of compatible licenses](https://www.gnu.org/licenses/license-list.en.html). If a library is not compatible with GPLv3 then it cannot be distributed together with the plugin in one ZIP package and hosted in the Moodle Plugins directory.
1. Check the library is not already shipped by core - we don't want multiple versions of the same library.
1. Download the latest stable release of the code.
1. Perform any build steps required to get a distributable version of the library. This will vary depending on the library - but an example is running less to generate minified css files.
1. Put that library into a sub folder in your plugin. It is best to NOT use version numbers in the foldername ("jquery" not "jquery-1.7.3").
1. Create or update the `thirdpartylibs.xml` file for your plugin, according to the format described in the [documentation](/docs/apis/commonfiles#thirdpartylibsxml).
1. Create a [`readme_moodle.txt`](/docs/apis/commonfiles#readme_moodletxt) file in the new third party library folder containing detailed instructions on how to complete steps 3-6 above. This should list download urls, build instructions etc.
1. Note any creation, update or deletion of third party libraries in your plugins `upgrade.txt` or [CHANGES](/docs/apis/commonfiles#changes).
1. Run `grunt ignorefiles` to regenerate ignored files path

## Exceptions:

### JavaScript AMD modules

JavaScript AMD modules cannot exist in a sub-folder - they must exist in a single .js file in the amd/src folder for your plugin. So - the process for AMD files is the same as above, except that the license and readme_moodle.txt file contents must be added as a JavaScript comment to the top of the libraries .js file.

## See also

- [Grunt](../../development/tools/nodejs.md#grunt) - Information for installing and using Grunt
