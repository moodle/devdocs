---
title: Roles API
tags:
  - Roles
  - Interfaces
  - Capabilities
---
The Roles API is an extension of [Access API](/docs/apis/subsystems/access.md) and defines a set of actions that user
is allowed to do on certain system levels. I.e. **capability** defines a single permission (like posting to a forum) and
**role** is composed of such permissions. For example a user with role Teacher can add activities to a course as well as
managing course participants and grading course modules, while a user with a Non Editing Teacher role can only manage
course participants and grade them, but not manage activities.

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

Role defines list of permissions - role definition is global for all contexts, but can be changed by local context overrides.

Permissions control possible user actions within Moodle (eg delete discussions, add activities etc)

Roles can be applied to users in a **context** (eg assign Fred as a teacher in a particular course)

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

1. `CAP_INHERIT`
2. `CAP_ALLOW`
3. `CAP_PREVENT`
4. `CAP_PROHIBIT`

If no permission is defined, then the capability permission is inherited from a context that is more general than the current context. If we define different permission values for the same capability in different contexts, we say that we are overriding the capability in the more specific context.

### Capability conflicts

Since the capabilities in each role could be different, there could be conflict in capabilities.

If we set a `PROHIBIT` on a capability, it means that the capability cannot be overridden and will ALWAYS  have a permission of prevent (deny). Prohibit always wins.   For example, Jeff has a naughty student role that prohibits him from postings in any forums (for the whole site), but he's also assigned a facilitator role in "Science forum" in the course Science and Math 101. Since prohibit always wins, Jeff is unable to post in "Science forum".

## Programming Interface

Although the Roles system may look complicated at first glance, implementing it in Moodle code is fairly simple.

- Examples of functions handling the **Roles** can be found at [`accesslib.php`](https://github.com/moodle/moodle/blob/master/lib/accesslib.php)

- Moodle comes with a list of predefined roles for example Student, Teacher, Course Manager etc. A new role can be created based on
    those predefined roles using **role archetype:**

```php
/**
 * Returns array of all role archetypes.
 *
 * @return array
 */
function get_role_archetypes() {
    return array(
        'manager'        => 'manager',
        'coursecreator'  => 'coursecreator',
        'editingteacher' => 'editingteacher',
        'teacher'        => 'teacher',
        'student'        => 'student',
        'guest'          => 'guest',
        'user'           => 'user',
        'frontpage'      => 'frontpage'
    );
}
```

- On each page you need to find the context the user is working in, using the `get_context_instance()` function.  For example, in the forum module:

```php
$context = get_context_instance(CONTEXT_MODULE, $cm->id);
```

or at the course level:

```php
$context = get_context_instance(CONTEXT_COURSE, $id);
```

- Then, whenever you want to check which role has a given capability do something like this:

```php
list($roleids) = get_roles_with_cap_in_context($context, 'moodle/course:manageactivities');
```

- If you want to get a list of roles that a give user has you can call

```php
$ras = get_user_roles($context, $user->id);
```

- You can assign a role to a user by calling something like

```php
role_assign($roleid, $userid, $context->id);
```

## See also

- [Hardening new Roles system](https://docs.moodle.org/dev/Hardening_new_Roles_system)
- Using Moodle course:
  - [Roles and Capabilities forum](http://moodle.org/mod/forum/view.php?f=941)
  - Key discussions at Using Moodle forums:
    - [Roles and Permissions architecture](http://moodle.org/mod/forum/discuss.php?d=38788)
    - [An example of admin roles as set in the database](http://moodle.org/mod/forum/discuss.php?d=56302#256313)
