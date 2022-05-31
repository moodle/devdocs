---
title: Unauthorised access
sidebar_position: 2
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Assuming you have dealt with the issue of [Authentication](./unauthenticated-access), so you know who is accessing your Moodle script, the next issue is that different users should only be allowed to do certain things. For example, as student should be allowed to post to a forum, but they should not be allowed to grade their own assignment as 100%.

However, in a system as complex as Moodle, different situations require different users to have different permissions to do, or not do, various things. Therefore, permissions need to be configurable and flexible.

## How Moodle avoids this problem

### Roles and capabilities

Moodle has a flexible roles system, build around the concepts of

- **contexts** - "Different situations", for example within a course (`CONTEXT_COURSE`), within a particular activity (`CONTEXT_MODULE`).
- **capabilities** - "Various things" a user might do, for example `mod/forum:replypost`, `mod/assignment:grade`.
- **roles** - Roles let administrators and teachers control which users get which capabilities in which contexts. For example, Sam might be a student in course Security 101, and Students are allowed to `mod/forum:replypost`, so Sam can reply to any post in any forum in the Security 101 course. Different role assignments and role definitions give administrators a lot of flexibility.

:::info

Follow the [roles](https://docs.moodle.org/dev/Roles) link to get a full description of the roles and capabilities.

:::

### Groups

Moodle also allows users to be put in groups. Different groups may have access to different activities, and may or may not be able to see the actions of people in other groups.

## What you need to do in your code

- Before allowing the user to see anything or do anything, make a call to has_capability or require_capability, testing the appropriate capability in the appropriate context.
  - Get the appropriate context using a call to `get_context_instance`.
- For this to work in custom code, you may need to define additional capabilities. For example, `block/myblock:viewsecretthing`. You can define extra capabilities by creating a [db/access.php](/docs/apis/commonfiles#dbaccessphp) file in your plugin.
- If appropriate, use the [groups API](https://docs.moodle.org/dev/Groups_API) to check group membership, and only show users information from groups they should be able to see.
  - Note that `require_login` checks basic groups access permissions for you.
- It is very important to check capabilities when printing UI, but also after data submission before it is processed.

## What you need to do as an administrator

- Think carefully before changing the default role definitions.
- Always review capability risks before giving permissions to users that are not trusted.
- Use the various reports, especially the [Security overview](https://docs.moodle.org/en/Security_overview) report, to ensure that users do not have more capabilities than they should.

## See also

- [Security](../security)
- [Coding](/general/development/policies)
