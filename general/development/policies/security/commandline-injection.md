---
title: Command-line injection
sidebar_position: 6
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

This is very like SQL injection, except that it arises when we execute a command-line program rather than when we do a database query.

## How Moodle avoids this problem

Always try to avoid using command-line tools if at all possible. Look for equivalent PHP libraries.

However, when there is no other option, it is the standard approach of cleaning the input, and then escaping the values that came from the user before including them in the command-line.

## What you need to do in your code

- Try to avoid using shell commands if at all possible.
  - Many utilities are available as PHP libraries.
- If you can't avoid shell commands, use `escapeshellcmd` and `escapeshellarg`.

## What you need to do as an administrator

- This is not something you can do much about.
- However, turn off Moodle features that use shell commands (for example, the LaTeX filter) unless you actually need them.

## See also

- [Security](../security)
- [Coding](../../policies.md)
