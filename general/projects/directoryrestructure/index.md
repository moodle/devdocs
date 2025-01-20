---
title: Directory Restructure
tags:
  - Project
  - Documentation
---

import { ProjectSummary } from '@site/src';

<ProjectSummary
    projectName="directoryrestructure/index"
/>

<!-- cspell:ignore directoryrestructure -->

Like many applications of its time, Moodle currently places all of its source in a web-accessible root directory.

In Moodle's case this includes all source code, configuration, metadata for the git repository, the Composer `vendor` directory, the NodeJS `node_modules` directory, and any dot-files.

In modern web development this is recognised as a poor practice, and its continued use and existence is queried regularly in security reviews performed by users, partners, and their clients.

Whilst Moodle currently implements a number of internal checks to try and alert administrators of misconfiguration, this is still not an ideal situation.

## Project statement

This project aims to restructure the Moodle source code to move all current content into a sub-directory of the main repository. This allows for code to be restructured in the future outside of the web root.

## Target versions

This work is targeted at Moodle 5.1 as the first issue to land after the on-sync period.

Some other related issues, such as changes to the deployment of Moodle to add Composer and Node, may be included at the same time.

## Benefits

A restructure of the code itself has few _immediate_ benefits itself, but it allows for greater change and flexibility in the future as a direct result.

### Immediate benefits

Restructuring the Moodle codebase allows for the migration of a number of key files out of the web root, in particular:

- The Moodle configuration file, `config.php`;
- The `node_modules` directory, used for NodeJS Dependencies;
- The `vendor` directory, used for Composer dependencies;
- The Grunt build system;
- Various additional metadata files.

By moving these files out of the public web root, a number of possible attack vectors are entirely removed, and the risk of information leak as a result of server misconfiguration is heavily reduced. NodeJS and Composer dependencies are no longer web-accessible.

### Future benefits

A change in the directory structure which moves the `node_modules`, and `vendor` directories out of the web root makes it possible to use NodeJS and Composer as part of a production deployment without risk of any accidental exposure of their content and, as a result, it becomes possible to make greater changes to support installation of libraries and plugins through these mechanisms.

Other future benefits are discussed below.

## Approach

### Initial change

The initial change for this issue is simply to move all current code into a new `public` directory.

This initial change can be summarised wi th the following change:

```bash title="Move all content into the new 'public' directory"
rm -rf public
mkdir -p public
for f in *; do
  git mv $f public
done
```

### Immediate follow-up

Following this initial change, some of the non-public content would be moved back into the root of the project. This includes:

- All Project Metadata, including:
  - GitHub workflows and metadata
  - Readme files, Contribution guidelines, and so on
- The Moodle Behat Extension
- Composer and NodeJS configuration
- The Moodle `config.php` configuration file
- PHPUnit configuration
- Coding Style and related configuration

### Future

In the future new code should make use of modern best-practice coding techniques. Existing code should be progressively updated to gradually move out of the web root.

## Risks and Weaknesses

Whilst this change does offer a number of benefits, it is not without some risk. For the most part these risks are well-defined, and superficial, but they do cross a number of areas.

### The introduction of new bugs

Any new feature, no matter the size, risks introducing regressions and bugs. In this case there is a higher chance that bugs may be introduced due to the nature of the change, but in most instances these bugs will be spotted quickly and easily and, often, the solutions will be similar.

### Introducing incompatible plugins

Due to the change of directory structure, there may be a risk of community plugins unable to share a codebase between existing Moodle versions and the release introducing this directory structure change. At this time I believe that this is not the case, and steps have been taken to avoid this scenario, but there may be situations where this is not true.

In cases where this does occur it is likely that these situations are a result of incorrect assumptions made by the plugin, and hard-coded path resolution, rather than bugs.

### Reconfiguration of Production Systems

In order for this change to be effective, it will require some reconfiguration of production systems.

For Moodle Partners, and larger installations, this should be relatively simple - changing a server configuration parameter to adjust the web root to use the sub-folder instead of the current project root.

In some cases this may pose more of a problem where users are unable to directly configure their web server, or host Moodle in a sub-directory.

For those hosting Moodle in a sub-directory of their website it should be possible to add some server configuration.

For those who are unable to directly configure their web server they may need to contact their hosting provider or seek additional help. At this time the impact for this smaller group of users is unknown.

### Increased difficulty during backport

Due to the change in directory structure, there may be some increased difficulty during some backports.

Where existing files are modified, the Git Version Control System will transpose the file paths automatically, but where new files are added in a newer branch and backported to an older branch then Git will confirm their location during the backport.

This only impacts Moodle core, and does not impact plugins. It is not expected to cause significant issues.

## Future, and Related Scope

Whilst the initial benefit of this migration is to move some of our configuration, development dependencies, and library code out of the web root, the real goal of this change is the subsequent changes that become possible.

Some of the potential future scope defined here builds upon the Routing feature introduced to Moodle 4.5, which was initially intended for use with our new Web Service framework. As part of the design of these Routing changes we ensured that it would be possible to support the loading of standard pages, and for stubbing of the pages that they replace. That is to say that these changes allow for user-facing content to be handled purely through the new Router, and for plugins to have no user-accessed content.

:::note

The following sections suggest _possible_ future benefits. These are not currently part of the roadmap, but are ideas of some of the changes which may be realised by making this change.

:::

### Additional deployment steps

Moodle is currently deployed by simply unzipping the codebase into a web-accessible directory with no additional steps being required. The same is usually true for plugins – users can install Moodle plugins by placing them into the relevant directory and they only need to run run a standard Moodle web upgrade with no additional deployment process.

A change to the directory structure of the codebase would require existing sites to reconfigure their site. For the most part this reconfiguration is relatively minor, but the interruption to existing processes provides an opportunity to change the deployment process even further.

One such change would be to add an additional "build" phase to the process.

There are two main build processes that we may wish to consider adding:

- Installation of some code using the Composer tooling; and
- Requiring some form of JavaScript build process.

#### Build step: Composer

A new Composer build step would require that a command such as the following be run:

```sh
composer install --no-dev -o
```

:::tip Current approach to PHP dependencies

In Moodle 5.0 and earlier all PHP userland dependencies are managed manually without the use of Composer, or similar.

Most of these libraries are intended by their maintainers to be installed using Composer and often have a large number of dependencies.

:::

Adding this deployment step allows the third-party libraries that Moodle core uses internally to be included using Composer instead of the current, manual, approach. This has an immediate impact in reducing the overhead of managing third-party library code. This is a frequently requested feature internally.

With every Moodle release the team currently go through the list of included third-party libraries and manually update them. This requires extensive time in development, peer review, and subsequent reviews. Many of these libraries are intended by their maintainer to be installed using Composer, and not manually installed. Some of them have extremely large dependencies which must also be included, or we have chosen _not_ to import them because of their size.

By adding in this deployment step, and subsequently migrating some of the third-party libraries included in Moodle to use Composer for their deployment, approximately 400,000 lines of code can be removed from the codebase, and time previously allocated to their management significantly reduced.

In addition it becomes possible for Moodle to use libraries which have previously been considered as being too large, for example `phpseclib`, and the Google API Client (approximately 170MB combined).

There are some caveats to this change, notably that any library which Moodle currently has to manually modify will need to be handled in a different way through either:

- forking and maintaining outside of Moodle; or
- applying patches through the Composer [`cweagans/composer-patches`](https://github.com/cweagans/composer-patches) or [`magento/quality-patches`](https://experienceleague.adobe.com/en/docs/commerce-operations/tools/quality-patches-tool/usage) tools.

The addition of a Composer build step also opens up possibilities for plugin installation (discussed later).

I would recommend that this change to the deployment be completed as part of the initial restructure.

#### Build step: NodeJS {#build-step-nodejs}

A new NodeJS build step would require that a command such as the following be run during the build:

```sh
npm ci
npm run build
```

This change allows for future greater change in our JavaScript build process away from including transpiled JavaScript in the Moodle source.

:::tip Current approach to building JavaScript in Moodle

In Moodle 5.0 and earlier the transpilation of JavaScript is considered a development-time task, performed by core and plugin developers.

No additional build phase is required by the Moodle administrator.

JavaScript goes through a build process using the _Grunt_ tooling. Code is minified and transpiled to add and use appropriate polyfills.

This build process takes place during development, and the built files are shipped with both the core product, and all plugins.

:::

Whilst this has worked reasonably well for many years, it does have a number of limitations – in particular:

- It is difficult to keep up-to-date with browser support; and
- Plugins built on different versions of Moodle can have different build files.

This combination of issues slows down the pace of development.

The addition of a JS build step may allow for future expansion in the form of a JS-based frontend system such as React, Vue, or Angular, depending on the technology and approach chosen.

At this point it is not known whether the addition of a build step for NodeJS could extend to Moodle plugin support.

### Plugin installation via Composer

If a Composer build step is created, it would be much easier to support the installation of Moodle plugins using Composer.

Composer already has support for Custom installers, which allows Moodle to install plugins in the correct location within Moodle.

This technically is possible already without the addition of a build step, and migration of the directory structure, however, moving out of the web root and combining with the Composer build step requirement allows this to be standardised as the primary installation method. It also allows Moodle to formalise a standard way of doing this for all Moodle plugins.

### Tooling systems

Whilst Web and Mobile are the standard ways to interact with Moodle, many tasks are best performed on the command line. At present Moodle administrators and developers have two options available to them:

- [Moosh](https://moosh-online.com/)
- [MDK](https://github.com/fmcorz/mdk)

These are both mature external tools which have been created out of a need which Moodle does not fulfill internally.

Many parts of this problem have been solved over the past few years with the addition of autoloading, class discovery, and more, but Moodle still lacks a mature and capable CLI library. Moodle does have a CLI library, but it lacks many features and is difficult to work with.

Adoption of Composer would make it easier to use libraries such as the [`symfony/console`](https://packagist.org/packages/symfony/console) library and, when combined with automatic discovery of possible commands, allows CLI-based tooling to be more easily built for the maintenance, management, and development of Moodle.

Many other projects use similar tooling to standardise and simplify their administrator and developer workflows. Examples include the Symfony [Symfony CLI](https://github.com/symfony-cli/symfony-cli), the [Laravel Artisan CLI tooling](https://laravel.com/docs/11.x/artisan), and [Wordpress CLI](https://wp-cli.org/).

This functionality should really be built into Moodle, and allow for different parts of Moodle to define their own actions.

The introduction of these types of tooling is currently blocked by the inability for Moodle to use well-defined CLI libraries.

### Plugins behind the web root

As part of the introduction of a new Web Service framework, Moodle 4.5 introduced a Routing Engine based on the [Slim Framework](https://www.slimframework.com/). One of the intended targets of this routing engine is to support the handling of standard Moodle pages, allowing them to have 'pretty' URLs which are more user and SEO friendly. Code already exists for this functionality and is expected to land in Moodle 5.0 (See MDL-82565 for more information).

One of the benefits of the use of the routing engine in this manner is a simplified entry point to Moodle with standardised parameter validation and handling.

By combining page-level routing with the creation of a new directory structure it becomes possible to create entire new plugin types which are not web accessible and are instead in a folder structure outside of the web root. This drastically reduces the footprint of available pages in Moodle and reduces risk.

An additional benefit of moving new plugin types to be outside of the web root is that direct access to files such as JavaScript, and css, can be entirely prevented. This media is only ever intended to be accessed using one of the specially-designed accessor scripts and not directly but there is currently no way to prevent direct access to these.

Whilst the use of page-level routing is available without placing plugins behind the web root, doing so allows Moodle to force a single approach for new code, encourage best practices, and further reduce the potential for security breaches.

## FAQ

### How does this impact me as a plugin developer?

For the most part there should be no impact to plugin development, but there will be an impact on testing systems due to the change in installation location.

### What about Backporting changes across the point of change

For the most part, Git is able to handle the file renames very easily. Where a new file is backported, then a conflict will arise, but in most cases this is just to confirm that the file name guessed by Git is correct. The same is true where a file is deleted.

### What does this mean for our Moodle Downloads?

Moodle provides a number of standard zip downloads. These are intended as drop-and-go solutions.

The change of restructuring directories will not have any immediate impact on this, except for the same need to reconfigure the server.

In the future, any change to the build process will require changes to the download server to ensure that when the zip files are generated these build steps are also run and the generated files included with Moodle.

### How does this change impact Git history?

Git is a very mature tool and is capable of understanding moves and renames.

When a file is moved the move forms a part of the file history, but individual lines in the file still retain their own history.

- A `git blame` will continue to show the last change information for each individual line.
- A `git log` will only show the history since the file was placed in its current location. To view the full history including file moves, you can use `git log --follow`. The follow option can be set by default using the [`log.follow`](https://git-scm.com/docs/git-log#Documentation/git-log.txt-logfollow) configuration option.
- The `git merge` and `git cherry-pick` commands are aware of renames and work well for existing files.

## Future possibilities

In addition to the initial and near-future benefits of this change, several other possibilities are opened by this change. Some of these are described in more detail below.

### Adoption of a Frontend Framework {#frontend-framework}

The addition of a [NodeJS installation and build phase](#build-step-nodejs) to the deployment system opens up the possibility for Moodle to formally adopt a new Frontend web framework such as React, Angular, Vite, and others.

At the moment this is not possible because:

- there is no current build phase; and
- it is generally advised not to place source files and the `node_modules` directory in a web-accessible location.

### Design System

Adoption of a new [Frontend framework](#frontend-framework) opens up the possibility of a tightly coupled integration with a Design System from the outset.

Systems such as [Storybook](https://storybook.js.org/) allow components to be designed, prototyped, developed, and tested outside of the Moodle environment and encourage reusable component design. They also allow us to close the loop on UX development in Moodle with every component able to be designed, tested, and walked through every step of the entire development cycle with relevant approvals.

Ideally a design system would be incorporated with any new frontend system from day zero to realise the most from it.

### A simplified plugintype system

Moodle currently has a number of plugin types whose directories are spread across the Moodle codebase. Some are in top-level directories, others are nested.

All plugins have a set of common behaviours and requirements, combined with their own individual requirements.

Whilst these unique requirements can be  part of what makes them work well, they also make for a complex ecosystem which is hard for developers to learn – each one works in different ways with a range of classes, specifically-named methods, JavaScript, and more being required. There is no standard approach to plugin-type design, nor documentation.

A longer-term benefit of the altered web root, combined with the ability to have plugins behind the web root, is the creation of a single simplified plugin type for all new plugin types going forward.

Rather than having many plugin types Moodle could move to a single "plugins" folder outside of the web root, with plugins advertising a number of features which they implement.

For example, rather than having plugins for `mod_forum`, with additional support plugins for `block_newsitem`, and `block_searchforums`; a single `forum` plugin could be created which implements features for a forum activity, a block for news items, and a block for search forums by implementing classes in:

- `plugins/forum/classes/features/activity/forum.php`;
- `plugins/forum/classes/features/block/newsitems.php`; and
- `plugins/forum/classes/features/block/searchforums.php`.

Each of these classes would extend the relevant _feature_ class, containing full documentation on how to implement that feature. They would also be able to share common JS and CSS between all features without breaching any part of the [component communication principles](../../development/policies/component-communication/index.md).

Whilst a migration to a single simplified plugin type does not specifically require a move to a location outside of the web root, it again allows for the promotion of best practices.

### Moodle Framework

With the combination of several of the above changes, it would be possible to support the concept of Moodle-as-a-framework.

By moving all Moodle plugins into relevant Packagist repositories (or our own Moodle Packagist Repository), and creating tooling to create "Build your own Adventure" Moodle packages, Moodle is left with a relatively small and simple core product, and set of core subsystems. Every component is isolated and testable both in isolation, and as part of a whole-Moodle system with all standard plugins enabled.

This approach is a fundamental change in our way of thinking and deployment.
