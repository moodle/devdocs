---
title: Data-loss
sidebar_position: 7
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

This is more a symptom or other vulnerabilities, than a vulnerability in its own right.

For example, Evil Hacker can use cross-site request forgery or SQL injection to maliciously destroy lots of your data. Or the fact that someone has permission to destroy a lot of data may indicate that the code is not performing sufficient authorisation checks.

However, it is also possible for users to accidentally destroy lots of data if the user-interface is badly designed and confusing.

## How Moodle avoids this problem

- Writing secure code so that data cannot be destroyed maliciously.
- Trying to design clear interfaces, so that users understand the effects of their actions.

## What you need to do in your code

- Actions that destroy a significant amount of data should have a confirmation step.
  - Capabilities that let people destroy a lot of information should have `RISK_DATALOSS`.
- Follow the guidelines for avoiding:
  - [Unauthorised access](./unauthorised-access)
  - [Cross-site request forgery (XSRF)](./crosssite-request-forgery)
  - [SQL injection](./sql-injection)
  - [Command-line injection](./commandline-injection)
  - and so on.

## What you need to do as an administrator

- Be careful!

## See also

- [Security](../security)
- [Coding](https://docs.moodle.org/dev/Coding)
