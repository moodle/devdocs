---
title: Testing
description: All the information related to testing during the Moodle development.
tags:
  - Processes
  - Core development
  - Testing
  - Quality assurance
---

This page is the top level page regarding all testing activities around the Moodle project. Testing is essential to make sure that developed code does what it is meant to do, without causing new problems.

## Manual testing

### Code testing

Code is tested as part of reviewing at some key parts of the [Moodle development process](/general/development/process).

- Development. The developer of some code should test their own work on a wide variety of environments for correctness and performance
- Peer review. Developers often test each others work early in the development process
- Integration reviews. Our integration team tests code weekly while they are evaluating suitability for integration into Moodle.

:::info More info
[[Testing instructions guide]]
:::

### Integration functional testing

There is an external team to manually test the functionality of all the issues that have been integrated each week. Developers submitting patches **should always cover the patch with unit tests and/or Behat behavioural tests**. Still, all issues are tested by a human and it is usually worth it.

:::info More info
[Testing of integrated issues](/general/development/process/testing-integrated-issues)
:::

### QA testing

Volunteer testers from the Moodle community systematically try each feature in Moodle and test that it works in the current version of the Moodle code. These tests are repeated in series of cycles, usually 4 weeks before a major release, once all major features have landed.

:::info More info
[QA testing](/general/development/process/qatesting)
:::

For major theme changes, additional manual tests may be run.

## Automated testing

### Unit tests

PHPUnit tests are supported as part of the code from Moodle 2.3 onwards. These are automated tests of very low-level code functionality that a developer should write as part of any new code.

:::info More info
[PHPUnit_integration](https://docs.moodle.org/dev/PHPUnit_integration)
:::

### Acceptance tests

Moodle uses a framework called Behat to automatically test the user-interface. Tests can be written for each plugin, and for Moodle core.

- To run the existing tests, read [[Running acceptance test]]. You really need to do this first.
- To write new tests, read [[Writing acceptance tests]].
- To define new steps that can you used when writing tests, see [[Writing new acceptance test step definitions]].

:::tip
Because Behat tests work through the Moodle user interface, they are a bit slow. Therefore, you should probably also use PHPUnit to test the detailed edge cases in your code.
:::

### Continuous integration testing

As soon as code is added to the integration repository, our continuous integration server tests the new code for:

- Coding guidelines
- PHPUnit tests
- SimpleTest unit tests on older versions of Moodle
- Detect unresolved merge conflicts
- Compare databases upgraded from previous versions
- Check the version.php is correct

A failure here notifies the integrators that the build has failed.

### Regression testing

Every day, an automated build in a test server runs a large number of tests concerning key functions of Moodle, to make sure that everything still works and that some new fix in Moodle hasn't caused problems elsewhere.

These tests must pass completely before a new release can be made.

- [[Unit tests]] using the PHPUnit framework
- [[Acceptance testing]] using the Behat framework
- Performance testing using JMeter.

:::note
Moodle uses a sponsored version of [BrowserStack](https://www.browserstack.com/) for testing on multiple browsers.
:::
