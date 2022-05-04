---
title: Confidential information leakage
sidebar_label: Information leakage
sidebar_position: 8
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Again, this is more a symptom of [Unauthorised access](./unauthorised-access) and other problems, rather than a problem in its own right. However, Moodle handles a lot of personal information about its users, and some countries have laws about how that information is handled, so it is worth having a separate section to consider how we protect the personal information we have about our users.

## How Moodle avoids this problem

Moodle now has enough capabilities that it can be configures to comply with various jurisdictions' privacy laws, while also being used in more permissive ways in other situations.

## What you need to do in your code

- Think about the type of information you are displaying when deciding which permissions checks to perform.
  - When a capability lets a user see more personal information about another user than normal, consider marking it as `RISK_PERSONAL`.
- Make sure you protect against [Unauthorised access](./unauthorised-access), [Cross-site scripting](./crosssite-scripting), and other problems that allow sensitive information to leak.

## What you need to do as an administrator

- Consider privacy issues when defining roles, and changing other settings.

## See also

- [Security](../security)
- [[Coding]]
