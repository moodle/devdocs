---
title: Policies
tags:
  - Policies
  - Coding guidelines
  - Developer processes
---

:::note

This is the top-level page describing Moodle's coding standards and guidelines.  It's the place to start if you want to know how to write code for Moodle.

:::

## Moodle architecture

Moodle tries to run on the widest possible range of platforms, for the widest possible number of people, while remaining easy to install, use, upgrade and integrate with other systems.

:::info

For more about this, see [Moodle architecture](https://docs.moodle.org/dev/Moodle_architecture).

:::

## Plugins

Moodle has a general philosophy of modularity.  There are nearly 30 different standard types of plugins and even more sub-plugin types, however all of these plugin types work the same way. Blocks and activities are the only small exceptions.

:::info

For more about this, see [Moodle plugins](https://docs.moodle.org/dev/Plugins) and [Moodle sub-plugins](https://docs.moodle.org/dev/Subplugins).

:::

## Coding style

Consistent [coding style](./policies/codingstyle/index.md) is important in any development project, and particularly so when many developers are involved. A standard style helps to ensure that the code is easier to read and understand, which helps overall quality.

Writing your code in this way is an important step to having your code accepted by the Moodle community.

:::info

For more about this, see the [Moodle coding style](./policies/codingstyle/index.md).

:::

## Security

Security is about protecting the interests and data of all our users.  Moodle may not be banking software, but it is still protecting a lot of sensitive and important data such as private discussions and grades from outside eyes (or student hackers!) as well as protecting our users from spammers and other internet predators.

It's also a script running on people's servers, so Moodle needs to be a responsible Internet citizen and not introduce vulnerabilities that could allow crackers to gain unlawful access to the server it runs on.

:::info

Any single script (in Moodle core or a third party module) can introduce a vulnerability to thousands of sites, so it's important that all developers strictly follow our [Moodle security guidelines](./policies/security/index.md).

:::

## Standards

It's important that Moodle produces strict, well-formed [HTML 5](http://en.wikipedia.org/wiki/HTML5) code (preferably backwards compatible with XHTML 1.1 if possible), compliant with all common accessibility guidelines (such as [W3C WCAG 2.0](http://www.w3.org/TR/WCAG20/), [ARIA](http://www.w3.org/TR/wai-aria-practices/)).

CSS should be used for layout. Moodle comes with several themes installed. Beginning with version 3.7, only the 'Boost, and 'Classic' themes are included with the base Moodle code.

:::note Writing your own theme

We recommend that if you are writing your own theme that it should extend the Moodle 'Boost' theme.

:::

This helps consistency across browsers in a nicely-degrading way (especially those using non-visual or mobile browsers), as well as improving life for theme designers.

## JavaScript

New JavaScript in Moodle should be written as Vanilla JavaScript in the ES6 style. The use of jQuery, YUI, and other frameworks is strongly discouraged and will not be accepted into core except when dealing with legacy interfaces which require the use of those objects.

In general code should be written to avoid displaying interfaces which are removed, or adding new interfaces as the page loads.

All JavaScript must be accessible.

:::info

For more about this, see the [JavaScript guide](/docs/guides/javascript).

:::

## Internationalisation

Moodle works in over 84 languages because we pay great attention to keeping the language strings and locale information separate from the code, in language packs.

The default language for all code, comments and documentation, however, is English (AU).

:::info

For more about this, see [String API](https://docs.moodle.org/dev/String_API)

:::

## Accessibility

Moodle should work well for the widest possible range of people.

:::info

For more about this, see [Moodle Accessibility](./policies/accessibility.md).

:::

## Component library

The Component library is a developer tool provided to help identify frequently-used user interface components, and encourage their re-use.

It includes components from both Twitter Bootstrap, and from Moodle, and it displays these features using your current Moodle theme.

:::info

For more about this, see [Component library](./tools/component-library.md).

:::

## Performance

The load any Moodle site can cope with will, of course, depend on the server and network hardware that it is running on. However there are some features (intended especially for developers) that are discouraged on production sites for performance reasons.

The most important property is scalability, so a small increase in the number of users, courses, activities in a course, and so on, only causes a correspondingly small increase in server load.

:::info

For more information and advice, see [Performance and scalability](https://docs.moodle.org/dev/Performance_and_scalability).

:::

## Database

Moodle has a powerful database abstraction layer that we wrote ourselves, called [XMLDB](https://docs.moodle.org/dev/XMLDB_Documentation).  This lets the same Moodle code work on MySQL/MariaDB, PostgreSQL, MS SQL Server and Oracle. There are known issues when using Oracle, it is not fully supported and is not recommended for production sites.

We have tools and APIs for [defining and modifying tables](/docs/apis/core/dml/ddl), and [retrieving and storing data](/docs/apis/core/dml) in the database.

:::info

For more about this, see the [Moodle Database](https://docs.moodle.org/dev/Database) guidelines.

:::

## Events

In Moodle it is possible to register observers for events. An observer is notified when an event happens and receives the data related to that event. An observer can only act on the information in the event. It cannot modify the data for the event or prevent the action from occurring. The component containing the observer is communicating with the component that declared the event class. The normal rules for [inter-component communication](./policies/component-communication/index.md#event-observers) apply.

:::info

For more about this, see [Events API](https://docs.moodle.org/dev/Events_API). In particular, note the [Events naming convention](https://docs.moodle.org/dev/Events_API#Events_naming_convention).

:::

## Web services

Web services enable other systems to login to Moodle and perform operations. They should be implemented according to [Web service API functions](https://docs.moodle.org/dev/Web_service_API_functions) and [How to contribute a web service function to core](https://docs.moodle.org/dev/How_to_contribute_a_web_service_function_to_core), including the [Naming convention](https://docs.moodle.org/dev/Web_service_API_functions#Naming_convention).

:::info

For more about this, see [Web services](/docs/apis/subsystems/external/).

:::

## Manual testing

All issues integrated into the core codebase are tested both during Integration, and subsequently by our testing team. While much of this testing is automated, there are many parts which cannot be automated, and manual testing is required.

:::info

Moodle has guidelines on [how to write clear testing instructions](./process/testing/guide.md) which we recommend you read and follow.

:::

## Unit testing

[Unit testing](http://en.wikipedia.org/wiki/Unit_testing) is not simply a technique but a philosophy of software development.

The idea is to create automated tests for each bit of functionality that you are developing (at the same time you are developing it).  This not only helps everyone later test that the software works, but helps the development itself, because it forces you to work in a modular way with very clearly defined structures and goals.

Moodle uses a framework called [PHPUnit](https://github.com/sebastianbergmann/phpunit/) that makes writing unit tests fairly simple.

:::info

For more about this, see [PHPUnit](./tools/phpunit/index.md).

:::

## Acceptance testing

PHPUnit covers mostly the internal implementation of functions and classes, the user interaction testing can be automated using the [Behat framework](http://behat.org).

:::info

For more about this, see [Acceptance testing](./tools/behat/index.md).

:::

## Third Party Libraries

Moodle has a standard way to include third party libraries in your code.

:::info

For more about this, see [Third-party libraries](https://docs.moodle.org/dev/Third_Party_Libraries).

:::

## Other standards

Please note that Moodle coding style and design is pretty unique, it is not compatible with [PEAR coding standards](http://pear.php.net/manual/en/standards.php) or any other common PHP standards.

<!-- cspell:ignore 開発 -->

## Translations

- [開発](https://docs.moodle.org/ja/開発:コーディング)
