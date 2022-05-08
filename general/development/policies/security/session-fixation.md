---
title: Session fixation
sidebar_position: 10
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

<!-- cspell:ignore OWASP -->
:::info Session fixation definition from OWASP

**Session fixation** is an attack that permits an attacker to hijack a valid user session. [...] The attack consists of obtaining a valid session ID (for example, by connecting to the application), inducing a user to authenticate himself with that session ID, and then hijacking the user-validated session by the knowledge of the used session ID. The attacker has to provide a legitimate Web application session ID and try to make the victim's browser use it. [...] The session fixation attack is a class of **session hijacking**, which steals the established session between the client and the Web Server after the user logs in. Instead, the session fixation attack fixes an established session on the victim's browser, so the attack starts before the user logs in.<br/>

:::

## How Moodle avoids this problem

## What you need to do in your code

## What you need to do as an administrator

## See also

- [Security](../security)
- [Coding](https://docs.moodle.org/dev/Coding)
- [Session fixation in OWASP](https://owasp.org/www-community/attacks/Session_fixation)
