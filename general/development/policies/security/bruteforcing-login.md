---
title: Brute-forcing login
sidebar_position: 12
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Evil Hacker wants to break into your Moodle site by stealing the account of a registered user.

They write a script that automatically tries logging in with a range of common passwords, for example, `admin / admin`, `admin / apple`, `admin / 1234`, .... It only takes one user with we weak password that Evil Hacker can guess, and your site is compromised.

## How Moodle avoids this problem

A lockout system is present in Moodle 2.5 onwards, you just need to turn it on at **Administration > Site administration > Security > Site security settings > Account lockout threshold (`$CFG->lockoutthreshold`)**.

Moodle also counts failed login attempts, and can alert the administrator by email when there are too many.

There are admin settings to enforce a minimum level of complexity for passwords, for example, by insisting on a minimum number of characters.

## What you need to do in your code

- If you are writing an authentication plugin, ensure that all failed logins are logged correctly.

## What you need to do as an administrator

- Consider turning on the options for reporting login failures.
- Consider turning on the settings that ensure password complexity.

## See also

- [Security](../security)
- [[Coding]]
- [Brute force attack in OWASP](https://owasp.org/www-community/attacks/Brute_force_attack)
