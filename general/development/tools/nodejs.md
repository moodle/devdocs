---
title: NodeJS and Grunt
---

Moodle uses a [NodeJS](https://nodejs.org/en/) toolchain to perform a number of development actions, including linting, transpilation of JavaScript, compilation of the Component Library, and a number of other routine tasks.

Use of [NVM](#install-nvm-and-node) for installation of NodeJS is highly recommended over direct installation.

## Setup and installation

### Install NVM and Node

The recommended way of installing NodeJS is via the [Node Version Manager](https://github.com/nvm-sh/nvm), or NVM. NVM allows you to have several different versions of NodeJS installed and in-use at once on your computer.

- For Linux and Mac, follow [https://github.com/nvm-sh/nvm#installing-and-updating](https://github.com/nvm-sh/nvm#installing-and-updating)
- For Windows, use [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) -- Note! NVM 1.1.7 for Windows has bugs. You should upgrade to at least 1.1.9.)

:::tip Checking that NVM is working

You can confirm that NVM is working by checking the version, for example:

```bash
$ nvm --version
 0.35.3
```

:::

Moodle provides a `.nvmrc` file which can be used to automatically install the correct version of NodeJS for the current directory.

After you have installed _NVM_, you can install the correct version of NodeJS by running the following commands from your Moodle directory:

```bash title="Installing the version of NodeJS for the current directory"
nvm install
nvm use
```

:::tip Using the correct NodeJS version for your current directory

Rather than remembering to update the system version of NodeJS, you can instead have your environment install and use the correct version when you change into a directory containing a `.nvmrc`.

The approach for this will depend on your environment and [advice is available for a range of environments from the NVM project](https://github.com/nvm-sh/nvm#deeper-shell-integration).

:::

### Install local development dependencies

The Moodle JavaScript toolchain currently uses the Grunt build tool, along with other common tooling including eslint. To install these build dependencies, you should use the [Node Package Manager](https://www.npmjs.com/), or NPM.

```bash title="Installing all dependencies"
npm install
```

:::note

You may see mention of various vulnerabilities here. Moodle only uses these tools during development for activities including transpilation and to check code. These dependencies are not used in client code where these vulnerabilities are typically reported.

:::

## Grunt

As part of its build stack, Moodle uses the [Grunt](https://gruntjs.com) task runner.

:::info

Grunt is a command line tool used to prepare our JavaScript and CSS for production usage. After making any change to JavaScript or CSS files in Moodle, you must run grunt to lint, minify and package the JavaScript/CSS properly so that it can be served by Moodle.

Grunt is composed of a set of tasks, defined within the Moodle code repository in the `Gruntfile.js` file, and a grunt CLI tool which must also be installed.

:::

Once you have installed the local development dependencies, you can simply run grunt using `npx`, for example:

```bash
$ npx grunt stylelint
```

### Install grunt

JavaScript and CSS in Moodle must be processed by some build tools before they will be visible to the web browser. Grunt is a build tool written in JavaScript that runs in the [nodejs](http://nodejs.org/) environment. You will need to install NodeJS and the Grunt tools:

```bash title="Installing grunt"
nvm install && nvm use
npm install
npm install -g grunt-cli
```

### Running grunt

Typical commands:

```
grunt amd                               # Alias for "ignorefiles", "eslint:amd", "rollup"
grunt js                                # Alias for "amd", "yui" tasks.
grunt css                               # Alias for "scss", "rawcss" tasks.
grunt shifter                           # Run Shifter
grunt componentlibrary                  # Build the component library
grunt eslint --show-lint-warnings       # Show pedantic lint warnings for JS
grunt                                   # Try to do the right thing:
                                        # * If you are in a folder called amd, do grunt amd
                                        # * If you are in a folder called yui/src/something, do grunt shifter
                                        # * Otherwise build everything (grunt css js).
grunt watch                             # Run tasks on file changes
```

- On Linux/Mac it will build everything in the current folder and below.
- You need to cd into the amd folder of your module root, for example `dirroot/blocks/foo/amd`, before running `grunt amd` (this will compile only your plugins AMD source files).
- You can make output more verbose by adding `-v` parameter.
- If used with `grunt shifter` you will have to `cd` into the `module/yui/src` folder, and to show what your lint errors are you can also use the `-v` parameter.
- On Windows, you need to specify the path on the command line like `--root=admin/tool/templatelibrary`.

### Install watchman

If you get an error when running "grunt watch" complaining about `watchman`, you most likely need to install it. Check out the [watchman installation](https://facebook.github.io/watchman/docs/install.html) page.

```bash title="Installing watchman from source in Linux/Mac"
$ git clone https://github.com/facebook/watchman.git -b v4.9.0 --depth 1
$ cd watchman
$ ./autogen.sh
$ ./configure
$ make
$ sudo make install
```

If you're on Linux, you may also want to make sure that `fs.inotify.max_user_watches` is set in `/etc/sysctl.conf`:

```
fs.inotify.max_user_watches = 524288
```

And then reload running `sudo sysctl -p`.

### Using Grunt in additional plugins

You may want to use Grunt for performing tasks in your custom Moodle plugins. For building AMD and YUI modules in a plugin, the standard configuration `Gruntfile.js` located in the Moodle root should work well. For building CSS files, you will have to set up a separate Grunt installation in the root of your plugin.

If you do not have it yet, create the `package.json` file in the root of your plugin:

```json title="package.json"
    {
        "name": "moodle-plugintype_pluginname"
    }
```

Install grunt, grunt sass and grunt watch modules. Note that you should put the folder `node_modules` into your plugin's `.gitignore` file, too.

```bash title="Installing grunt and grunt modules"
    $ cd /path/to/your/plugin/root
    $ npm install --save-dev grunt grunt-contrib-sass grunt-contrib-watch grunt-load-gruntfile grunt-contrib-clean
```

Create a `Gruntfile.js` in the root of your plugin and configure the task for building CSS files from SCSS files:

```javascript
"use strict";

module.exports = function (grunt) {

    // We need to include the core Moodle grunt file too, otherwise we can't run tasks like "amd".
    require("grunt-load-gruntfile")(grunt);
    grunt.loadGruntfile("../../Gruntfile.js");

    // Load all grunt tasks.
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.initConfig({
        watch: {
            // If any .scss file changes in directory "scss" then run the "sass" task.
            files: "scss/*.scss",
            tasks: ["sass"]
        },
        sass: {
            // Production config is also available.
            development: {
                options: {
                    // Saas output style.
                     style: "expanded",
                    // Specifies directories to scan for @import directives when parsing.
                    // Default value is the directory of the source, which is probably what you want.
                    loadPath: ["myOtherImports/"]
                },
                files: {
                    "styles.css": "scss/styles.scss"
                }
            },
            prod:{
                options: {
                    // Saas output style.
                    style: "compressed",
                    // Specifies directories to scan for @import directives when parsing.
                    // Default value is the directory of the source, which is probably what you want.
                    loadPath: ["myOtherImports/"]
                },
                files: {
                    "styles-prod.css": "scss/styles.scss"
                }
            }
        }
    });
    // The default task (running "grunt" in console).
    grunt.registerTask("default", ["sass:development"]);
    // The production task (running "grunt prod" in console).
    grunt.registerTask("prod", ["sass:prod"]);
};

```

Now running `grunt` or `grunt css` in your plugin root folder will compile the file and saves it as `styles.css`. Running "grunt watch" will watch the scss/*.scss files and if some is changed, it will immediately rebuild the CSS file.

If you are working on a custom theme, you may have multiple `scss/*.scss` files that you want to compile to their `style/*.css` counterparts. You can either define an explicit list all such file pairs, or let that list be created for you by making use of [expand:true feature](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) of `Gruntfile.js`:

```javascript
// This dynamically creates the list of files to be processed.
files: [
    {
        expand: true,
        cwd: "scss/",
        src: "*.scss",
        dest: "style/",
        ext: ".css"
    }
]
```

## Common issues

A number of commons issues may be encountered depending on your environment.

### MacOS issues

If you are using MacOS, you may need to ensure that xcode is up-to-date.

```bash title="Resetting xcode"
sudo xcode-select --reset
```

#### Issues install node-sass

The `node-sass` module must be compiled from C. In some instances MacOS setup is incomplete or out-of-date and must be updated.

The following is a typical error that may be reported in this situation:

```bash title="Example error installing node-sass on MacOS"
npm ERR! code 1
npm ERR! path /Users/jun/Work/moodles/integration_master/moodle/node_modules/node-sass
npm ERR! command failed
npm ERR! command sh /var/folders/87/fnlrch612m5d40trk64lrd480000gn/T/postinstall-a2316f45.sh
npm ERR! Building: /Users/jun/.nvm/versions/node/v16.17.0/bin/node /Users/jun/Work/moodles/integration_master/moodle/node_modules/node-gyp/bin/node-gyp.js rebuild --verbose --libsass_ext= --libsass_cflags= --libsass_ldflags= --libsass_library=
npm ERR! make: Entering directory '/Users/jun/Work/moodles/integration_master/moodle/node_modules/node-sass/build'
```

To address this issue, you can run the following command to ensure that the xcode build system is fully configured:

```bash title="Configuring xcodebuild"
xcodebuild -runFirstLaunch
```
