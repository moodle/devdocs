---
title: NodeJS and Grunt
sidebar_position: 1
---

Moodle uses a [NodeJS](https://nodejs.org/en/) toolchain to perform a number of development actions, including linting, transpilation of JavaScript, compilation of the Component Library, and a number of other routine tasks.

Use of [NVM](#node-version-manager) for installation of NodeJS is highly recommended over direct installation.

## Setup and installation

### Install NVM and Node

The recommended way of installing NodeJS is via the [Node Version Manager](https://github.com/nvm-sh/nvm), or NVM. NVM allows you to have several different versions of NodeJS installed and in-use at once on your computer.

- For Linux and Mac, follow <https://github.com/nvm-sh/nvm#installing-and-updating>
- For Windows, use <https://github.com/coreybutler/nvm-windows/releases> -- Note! NVM 1.1.7 for Windows has bugs. You should upgrade to at least 1.1.9.)

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

### Grunt

As part of its build stack, Moodle uses the [Grunt](https://gruntjs.com) task runner.

Grunt is composed of a set of tasks, defined within the Moodle code repository in the `Gruntfile.js` file, and a grunt CLI tool which must also be installed.

Once you have installed the local development dependencies, you can simply run grunt using `npx`, for example:

```bash
$ npx grunt stylelin
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
