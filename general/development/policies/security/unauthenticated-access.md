---
title: Unauthenticated access
sidebar_position: 1
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Moodle runs on a web server somewhere. A user sits at their computer somewhere else. Before we let that user enrol in a course, post to a forum, or submit an assignment, we would like to be sure who that user is.

If you don't know who the user is, you cannot correctly determine which actions they should be allowed to perform within Moodle.

## How Moodle avoids this problem

This is a common problem to all web applications, and a common solution it to require users to log in with a user name and a password.

In fact, Moodle can have different **authentication plugins** that authenticate the user in different ways, but most of the standard authentication plugins are based on a user name and password system.

Another example of authentication is when you let users create their own accounts using Email-based self-registration. They must enter an email address. Moodle then sends an email to that address, and they must click on the link in that email to complete their registration. That authenticates that the user has access to that email address. A similar case is when you don't allow self-registration, but instead, manually create an account for each user, and give the user their user name and password in person, while verifying their identity in another way.

Yet another example is a **captcha**. This is some task that humans are able to do, like typing in the letters in a blurry image, but computers cannot. It authenticates that the thing filling in a form is a human, not an automated script.

## What you need to do in your code

- Most authentication issues are taken care of by the Moodle system and the authentication plugins.
- In every Moodle script you create, add a call to `require_login` or `require_course_login` as near the start as possible. That is, as soon as you have the `$course` and `$cm` parameters that you need to pass (if applicable).
  - The only exception to this is a few pages like the front page, which should be available to everyone.
- If you are writing a new authentication plugin, make sure you know what you are doing.

## What you need to do as an administrator

- Think carefully about which authentication method is appropriate for your site.
  - Be very cautious about allowing users to self-register.

## See also

- [Security](../security)
- [[Coding]]
