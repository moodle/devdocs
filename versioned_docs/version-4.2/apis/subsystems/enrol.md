---
title: Enrolment API
tags:
  - Enrolment
  - Library
---

<!-- cspell:ignore unenrolment -->

The enrolment API gives access to the enrolment methods and also to [enrolment plugins](../plugintypes/enrol/index.md) instances.

## Difference between user enrolment and role assignment

Users enrolled in a course have at least one record in `user_enrolments` table. This table has the relation between courses and users **through an enrolment plugin instance**. However, `user_enrolments` does not contain information about the user role in the course, only information about:

- **Enrolment plugin instance**
- **Enrolment status** (active or suspended).
- **Enrolment Start and end dates**.

The specific role assignments are related to the context, not only to course (as activities and other pages can use its own). The specific roles of a user are stored in the `role_assignments` table. This table stores:

- The **user role id** in the **context**
- The **component item** that assigned the role. In the case of a regular course, the *component* is the name of the enrolment plugin and the *item id* is the specific plugin instance.

### What is enrolment?

Enrolled users may fully participate in a course. Active user enrolment allows user to enter course. Only enrolled users may be group members. Grades are stored only for enrolled users.

### Unenrolment

Unenrolment is irreversible operation that purges user participation information. Full unenrolment is suitable only if you do not need to preserve all course participation information including user grades.

### Enrolment status

Instead of full unenrolment it is usually better to only *suspend* user enrolment. If there are other ways to enter the course (such guest access) it is recommended to remove user roles at the same time.

Enrolments have two states defined by two constants:

- `ENROL_USER_ACTIVE` the enrolment is active
- `ENROL_USER_SUSPENDED` the enrolment is suspended

### Activity participation

Activity developers decide the enrolment related behaviour of module.

There are some general guidelines:

- Only users with active enrolments should receive notifications.
- Activities should display enrolled users with some capability as participants.
- By default only users with active enrolments should be displayed in reports.
- There should be option to display all enrolled users including suspended enrolments.
- For performance reasons invisible participation data should be purged on unenrolment.
- Contributions visible by other participants should be kept after unenrolment (such as forum posts).

## API functions

### is_enrolled()

Use this method to determine if a user is enrolled into a course. This method returns true for students and teachers, but false for administrators and other managers.

:::caution

User enrolments can be either active or suspended, suspended users can not enter the course (unless there is some kind of guest access allowed or have `moodle/course:view` capability) and are usually hidden in the UI.

:::

```php
function is_enrolled(
    context $context,
    stdClass $user = null,
    string $withcapability = '',
    bool $onlyactive = false
)
```

Good example is choice module where we have one slot for each participant, people that are not enrolled are not allowed to vote `is_enrolled($context, $USER, 'mod/choice:choose')`. Another example is assignment where users need to be enrolled and have capability to submit assignments `is_enrolled($this->context, $USER, 'mod/assignment:submit')`.

### get_enrolled_users()

Returns the list of enrolled users. This method allows to filter the result by capability, pagination or state.

```php
function get_enrolled_users(
    context $context,
    string $withcapability = '',
    int $groupid = 0,
    string $userfields = 'u.*',
    ?string $orderby = null,
    int $limitfrom = 0,
    int $limitnum = 0,
    bool $onlyactive = false
)
```

<details>
  <summary>View example</summary>
  <div>

Get all users who are able to submit an assignment:

```php
$submissioncandidates = get_enrolled_users($modcontext, 'mod/assignment:submit');
```

  </div>
</details>

### count_enrolled_users()

This method is used to get the total count of enrolments of a context. As `get_enrolled_users` this methods allow several filters like capability, group id or counting only active enrollments.

```php
function count_enrolled_users(
    context $context,
    string $withcapability = '',
    int $groupid = 0,
    bool $onlyactive = false
)
```

### get_enrolled_sql()

SQL `select from get_enrolled_sql()` is often used for performance reasons as it can be used in joins to get specific information for enrolled users only.

```php
function get_enrolled_sql(
    context $context,
    string $withcapability = '',
    int $groupid = 0,
    bool $onlyactive = false,
    bool $onlysuspended,
    int $enrolid = 0
)
```

### enrol_get_plugin(): enrol_plugin

Returns the enrolment plugin base class with the given name.

<details>
  <summary>View example</summary>
  <div>

```php
$instance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'manual'])
$enrolplugin = enrol_get_plugin($instance->enrol);
$enrolplugin->enrol_user($instance, $user->id, $role->id, $timestart, $timeend);
```

:::note

As can be seen in the example, to use the plugin enrol_user and unenrol_user methods you need to get the instance record of the plugin first.

:::

  </div>
</details>

## Enrolment plugin methods

Once you use `enrol_get_plugin` function to get the enrolment plugin instance, you can use that class to modify the enrolments.

### $enrol_plugin->enrol_user()

Using this method you can enrol a user into a course.

The method takes the following parameters:

- Enrol plugin instance record
- User id
- Role id
- Optional enrolment start and end timestamps
- Optional enrolment status (ENROL_USER_ACTIVE or ENROL_USER_SUSPENDED)
- If the enrol must try to recover the previous user enrolment grades (if any)

```php
$enrolplugin->enrol_user($instance, $user->id, $role->id, $timestart, $timeend, ENROL_USER_ACTIVE);
```

### $enrol_plugin->unenrol_user()

Unenrol a user from a course enrolment method.

:::note

Other enrolment methods can define other roles to the same user.

:::

The method takes the following parameters:

- Enrol plugin instance record
- User id

```php
$enrolplugin->unenrol_user($instance, $user->id);
```

### $enrol_plugin->update_user_enrol()

Updates a user enrolment **status** and the **start or end dates**.

The method takes the following parameters:

- Enrol plugin instance record
- User id
- Optional enrolment start and end timestamps
- Optional enrolment status (ENROL_USER_ACTIVE or ENROL_USER_SUSPENDED)

```php
$enrolplugin->update_user_enrol($instance, $user->id, $timestart, $timeend, ENROL_USER_SUSPENDED);
```

### $enrol_plugin->add_default_instance()

Add a new enrolment instance to a specific course an returns the instance id. This method will create a new instance record in the `enrol` table with the default values.

The method takes the following parameters:

- Course id

```php
$enrolplugin->add_default_instance($course->id);
```

### $enrol_plugin->delete_instance()

Remove an enrolment instance form a course and invalidate all related user enrolments.

The method takes the following parameters:

- Enrol plugin instance record

```php
$enrolplugin->delete_instance($instance);
```

## See also

- [Enrolment plugins](../plugintypes/enrol/index.md)
