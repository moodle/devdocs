---
title: Insecure configuration management
sidebar_label: Insecure configuration
sidebar_position: 13
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Evil Hacker somehow gets access to your server some time and installs some nasty code. For example, they could add some code to the login page that records every username and password entered, and sends it back to `evel-hacker.com`.

Unfortunately, you have no procedures in place for detecting that this is happening.

Another problem is not updating to the latest Moodle release, which means that you will be running a version of Moodle with know security holes.

## How Moodle avoids this problem

This is not really a problem that can be solved from within Moodle code. However, any Moodle code that does install other PHP code (for example, `admin/langimport.php`) must be written with extreme care.

## What you need to do in your code

- If you are writing code like `admin/langimport.php`, make sure you know what you are doing.

## What you need to do as an administrator

- Keep up-to-date with the latest Moodle release from whichever branch you are using.
  - Register your Moodle site, so you get notified of security problems before the general public.
- Think about how you deploy the Moodle code to your server. For example, if you [use git](https://docs.moodle.org//en/Git_for_Administrators), then `git status` will tell you which files have been edited.
  - Alternatively, if you upload the Moodle code manually, delete all the old code except `config.php` before you upload a new version.
- Be very careful who can access your servers.

## See also

- [Security](../security)
- [Coding](../../policies.md)
