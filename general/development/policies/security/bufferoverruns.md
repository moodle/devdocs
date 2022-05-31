---
title: Buffer overruns and other platform weaknesses
sidebar_label: Buffer overruns
sidebar_position: 14
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Buffer overruns do not affect PHP code, since PHP is a high-level language that automatically manages memory allocation.

However, Moodle runs on a server which runs an operating system, a web server, a database and the PHP interpreter. All these are complex pieces of software, and security problems are often found with them. Thus, a Moodle server can be attacked, even if there are no security problems with Moodle.

## How Moodle avoids this problem

There is very little that Moodle can do about this.

## What you need to do in your code

- There is nothing you can do about this from PHP code.

## What you need to do as an administrator

- Keep all components of your server up-to-date.
- Subscribe to security mailing lists for all the products you use, so you are notified promptly about potential problems, and new versions.

## See also

- [Security](../security)
- [Coding](/general/development/policies)
