---
title: Roles API
tags:
  - Roles
  - Interfaces
  - Capabilities
---
The Roles API is an extension of the [Access API](./access.md) and defines a set of actions
that a user is allowed to perform on certain system levels. A **capability** defines a single permission
(like posting to a forum) and a **role** is composed of a set of permissions, for example: a user with the Teacher
role can add activities to a course, as well as managing course participants and grading course modules, while
a user with a Non-editing Teacher role can only manage course participants and grade them, but not manage activities.

## Definitions

- A **role** is an identifier of the user's status in some context. Teacher, Student and Forum moderator are all examples of possible roles.

- A **capability** is a description of some particular Moodle feature. Capabilities belong to a component. and are assigned to roles. For example, `mod/forum:replypost` is a capability.

- A **permission** is the level in which a capability is applied to a role. Example values include:
  - Allow
  - Prevent
  - Prohibit
  - Inherit
- A **context** is an area in Moodle. There are several context types for:
  - the whole site
  - a user
  - a course category
  - a course
  - an activity
  - a block

### Roles

A role is defined with a list of permissions - each role definition is global defined and applies equally to all
context levels, but these can be overridden in individual contexts. For example, a 'Student' role may not normally
have the `moodle/site:accessallgroups` capability, but in the context of a specific forum the Teacher may grant
this role. Permissions control possible user actions within Moodle (for example to delete discussions, add
activities, and so on)

Roles can be applied to users in a **context** (for example to assign Fred as a Teacher in a particular course)

### Context

Here are the possible contexts, listed from the most general to the most specific.

| CONTEXT NAME        | CONTEXT AREA       | CONTEXT LEVEL |
|---------------------|--------------------|---------------|
| `CONTEXT_SYSTEM`    | the whole site     | 10            |
| `CONTEXT_USER`      | another user       | 30            |
| `CONTEXT_COURSECAT` | a course category  | 40            |
| `CONTEXT_COURSE`    | a course           | 50            |
| `CONTEXT_MODULE`    | an activity module | 70            |
| `CONTEXT_BLOCK`     | a block            | 80            |

An authorized user will be able to assign an arbitrary number of roles to each user in any context.

See [Roles and modules#Context](https://docs.moodle.org/dev/Roles_and_modules#Context) for more information.

### Capabilities

Capabilities can have the following permissions:

- `CAP_INHERIT`
- `CAP_ALLOW`
- `CAP_PREVENT`
- `CAP_PROHIBIT`

:::info

If no permission is defined for a capability in a role, then the permission is inherited from a context that is
more general than the current context. If we define different permission values for the same capability in different
contexts, we say that we are overriding the capability in the more specific context.

:::

### Capability conflicts

Since the capabilities in each role could be different, there can be conflicts in capabilities.

If we set a `PROHIBIT` on a capability, it means that the capability cannot be overridden and will ALWAYS
have a permission of prevent (deny). Prohibit always wins. For example, Jeff has a naughty student role that
prohibits him from postings in any forums (for the whole site), but he's also assigned a facilitator role in
"Science forum" in the course Science and Math 101. Since prohibit always wins, Jeff is unable to post
in "Science forum".

Another example would be, if a user has a Teacher and a Student role at the same time in a given course, then
the following settings are possible:

- The `moodle/site:accessallgroups` capability is granted to the Teacher, but is prevented for the Student on site level
- The `moodle/site:accessallgroups` capability is granted to the Teacher, but is prevented for the Student in the category
- The `moodle/site:accessallgroups` capability is granted to the Teacher, but is prohibited for the Student in the category
- The `moodle/site:accessallgroups` capability is granted to the Teacher in the category, but is prevented for the Student
in the course

### Hardening Roles system

Hardening a role, refers to limiting the ability of a role to assign or to acquire permissions.

Roles have a great freedom when assigning capabilities to students. The problem might arise when students are assigned
permission that allows adding of content that is not cleaned before display - such as editing resources or
adding activities. They could then use any type of XSS attack to gain full administrative access quite easily.

The solution has two parts: educate admins and teachers about the risks associated with each capability and
optionally allow central management of risks.

<!-- cspell:ignore bitmask, bitmasks, MANAGETRUST, DATALOSS -->
#### Risk bitmask in capabilities

Adds a risk bitmask field to each capability. Each bit indicates presence of different risk associated with
given capability. Basic risks are

- **RISK_SPAM** - user can add a visible content to a site, send messages to other users
- **RISK_PERSONAL** - access to private personal information, for example backups with user details, non-public
information in profile (hidden email)
- **RISK_XSS** - user can submit content that is not cleaned (both HTML with active content and unprotected files)
- **RISK_CONFIG** - user can change global configuration, actions are missing sanity checks
- **RISK_MANAGETRUST** - manage trust bitmasks of other users
- **RISK_DATALOSS** - can destroy large amounts of information that cannot easily be recovered.
In default configuration Guest role should have only capabilities without risks, Student roles also SPAM, Teacher roles PERSONAL and XSS too. Admins have all capabilities by default.

When creating a new capability you might need to define risks and assign those in `mod/xxx/db/access.php`
with `riskbitmask`:

```php
$capabilities = [
    'tool/brickfield:viewcoursetools' => [
        'riskbitmask' => RISK_PERSONAL,
        'captype' => 'read',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'teacher' => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ],
        'clonepermissionsfrom' => 'coursereport/participation:view',
    ],
];
```

## Programming Interface

- Moodle comes with a list of predefined roles, including a Student, Teacher, Non-editing teacher, and Course
Manager role. Each of these roles are based on a **role archetype**, which acts as a template for roles.
Any custom role created by the site administrator can also _choose_ to follow one of these role archetypes.
When a plugin defines a new capability, it may specify how it would expect to be applied within these role archetypes,
and these are applied to any role which follows this archetype. For example, if you create a new activity module with
named _mod_example_, with a capability `mod/example:view`, you may specify that the `teacher`, and `editingteacher`
archetypes are granted the capability with the allow permission. Any role which is based on these archetypes will be
granted this capability with the 'allow' permission.

- The role archetypes do not change often, and are currently defined as:
  - **manager** - A system level role used to manage courses without being directly enrolled in them
  - **coursecreator** - A system level role used to create new courses
  - **editingteacher** - A course level role used to grade students as well as manage a given course
  - **teacher** - A course level role used to grade students (but not adding/editing activities)
  - **student** - A course level role for participating in a course, completing activities, but not grading other
course participants
  - **guest** - Courses can allow non-authenticated access if desired. In general user with guest role not supposed
to change anything like form submissions.
  - **user** - This role is assigned to every authenticated user.
  - **frontpage** - All authenticated users on site home page (which actually is a course).

<details>
  <summary>Fetching a list of the role archetypes programmatically</summary>

  In some rare situations you may need to fetch a list of available role archetypes. You can do so using the
  `get_role_archetypes()` function, for example:

```php title="Fetching a list of role archetypes"
$archetypes = get_role_archetypes();
```

</details>

- When handling a role on each page you need to find the context the user is working in, using the
`context::instance_by_id()` or `context_[type]::instance($typeid)` function, for example:

```php
$context = context::instance_by_id($contextid);
```

<details>
<summary>Fetching roles and users who hold a capability</summary>

Moodle has a flexible and detailed capability system which allows administrators to define many similar roles
for different purposes. It is quite common to have multiple teacher-like roles but need to restrict their access
depending on their usage. For example in a University setting you may have a lecturer who presents the course
materials, and then a number of Ph.D students who lead smaller groups of students in labs, seminars, and workshops.
These roles may both be considered a form of teacher, but they will have different permissions to suit their needs.
As a result we strongly discourage that you think in terms of which roles or users hold a capability, but rather
whether a specific user holds a capability.

:::danger There are some situations where you _do_ need to get a list of roles with a capability in a specific
context, but these are very rare. You can do so using the `get_roles_with_cap_in_context()` function:

```php title="Fetching a list of roles which hold a capability in the specified context"
[$roleids] = get_roles_with_cap_in_context($context, 'moodle/course:manageactivities');
```

:::

</details>

<details>
<summary>Assigning user a role (for custom enrolment plugin development)</summary>

For certain institutions' enrolment process might be different to a standard workflow. For example enrolment is
managed by an external system, so you might need to develop a custom
[Enrolment Plugin](https://moodle.org/plugins/browse.php?list=category&id=22).

:::danger In case of custom enrolment plugin development only

```php title="To get a list of roles for a user"
$ras = get_user_roles($context, $user, $checkparentcontexts);
```

```php title="To assign a role to a user"
role_assign($roleid, $userid, $contextid, $component, $enrolmentpluginid);
```

:::
</details>

## See also

- Relevant discussions on [moodle.org](https://moodle.org/):
  - [Roles and Capabilities forum](http://moodle.org/mod/forum/view.php?f=941)
