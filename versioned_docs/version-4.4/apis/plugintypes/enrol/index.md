---
title: Enrolment plugins
tags:
  - Enrolment
  - Plugins
---

<!-- cspell:ignore enrolme -->
<!-- cspell:ignore timeend -->
<!-- cspell:ignore unenrolment -->

import {
    Lang,
    Lib,
    VersionPHP,
    DbAccessPHP,
} from '../../_files';

Moodle provides a number of ways of managing course enrolment, called enrolment plugins. Each course can decide its enabled enrolment plugins instances and any enrolment plugin can define a workflow the user must follow in order to enrol in the course.

Course enrolment information is stored in tables **enrol**, **user_enrolments** and optionally other custom database tables defined by individual enrolment plugins. By default user enrolments are protected and can not be modified manually by teachers but only via the specific enrolment plugin.

Enrolment gives users following privileges:

- User with active enrolment may enter course, other users need either temporary guest access right or moodle/course:view capability.
- "My courses" shows list of active enrolments for current user.
- Course participation - some activities restrict participation to enrolled users only. The behaviour is defined independently by each activity, for example only enrolled users with submit capability may submit assignments, the capability alone is not enough.
- Only enrolled users may be members of groups.
- Gradebook tracks grades of all enrolled users, visibility of grades is controlled by role membership.

:::caution

Enrolments and role assignments are separate concepts, you may be enrolled and not have any role and you may have a role in course and not be enrolled. Roles at course context level and below may be controlled by enrolment plugins.

:::

## File structure

All enrolment plugin files must be located inside the **enrol/pluginname** folder.

<details>
  <summary>View an example directory layout for the `enrol_pluginname` plugin.</summary>

```console
 enrol/pluginname/
 |-- db
 |   `-- access.php
 |-- lang
 |   `-- en
 |       `-- enrol_pluginname.php
 `-- lib.php
 `-- version.php
```

</details>

Some of the important files for the format plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### lib.php

import LibExample from '!!raw-loader!./_examples/lib.php';

<Lib
    plugintype="enrol"
    pluginname="pluginname"
    example={LibExample}
    legacy={false}
    required
>
The plugin lib.php must contain the plugin base class.
</Lib>

Enrolment plugins must extend `enrol_plugin` base class which is defined at the end of lib/enrollib.php. This base class contains all standard methods to define the plugin workflow.

### lang/en/enrol_pluginname.php

import langExample from '!!raw-loader!./_examples/enrol_lang.php';

<Lang
    plugintype="enrol"
    pluginname="pluginname"
    example={langExample}
/>

### db/access.php

import RepositoryAccessExample from '!!raw-loader!./_examples/access.php';

<DbAccessPHP
    plugintype="repository"
    pluginname="pluginname"
    example={RepositoryAccessExample}
/>

Depending on the enrolment workflow, the access.php file should define the following capabilities:

- **enrol/xxx:enrol** - used when `enrol_plugin::allow_enrol()` returns true.
- **enrol/xxx:unenrol** - used when `enrol_plugin::allow_unenrol()` or `enrol_plugin::allow_unenrol_user()` returns true.
- **enrol/xxx:manage** - used when `enrol_plugin::allow_manage()` returns true.
- **enrol/xxx:unenrolself** - used when plugin support self-unenrolment.
- **enrol/xxx:config** - used when plugin allows user to modify instance properties. Automatic synchronisation plugins do not usually need this capability.

See [enrolment API methods](#enrolment-api-methods) for more information.

### version.php

<VersionPHP
    plugintype="enrol"
/>

## User enrolment process

Manual enrolment plugins are the simplest way to handle user enrolments. In the core *enrol_manual*, users with necessary permissions may enrol or unenrol users manually. In the *enrol_flatfile* plugin allows automation of enrolment and unenrolment actions.

Fully automatic plugins are configured at the system level, they synchronise user enrolments with information stored in external systems (for example *enrol_ldap*, *enrol_database* and *enrol_category*). Some non-interactive plugins may require configuration of enrolment instances (for example *enrol_cohort*).

Interactive enrolment plugins require user interaction during enrolment (for example: *enrol_self* and *enrol_fee*). These plugins need to override `enrol_plugin::show_enrolme_link()`, `enrol_plugin::enrol_page_hook()` and to implement adding and editing of enrol instance.

## Enrolment expiration and suspending

User has active enrolment if all following conditions are met:

- User has record in `user_enrolments` table,
- User enrolment already started,
- User enrolment is not past timeend,
- User enrolment has active status,
- Enrol instance has active status in `enrol` table,
- Enrol plugin is enabled.

Most synchronisation plugins include a setting called *External unenrol action*. It is used to decide what happens when previously enrolled user is not supposed to be enrolled any more. Enrol plugins can provide schedulled tasks to synchronize enrolments.

Plugins that set `timeend` in `user_enrolments` table may want to specify expiration action and optional expiration notification using `enrol_plugin::process_expirations()` and `enrol_plugin::send_expiry_notifications()` methods.

## Enrolment API methods.

Each enrolment plugin can define the enrolment workflow by overriding some of the `enrol_plugin` methods.

### enrol_plugin::get_user_enrolment_actions(): array

By default, all enrolment plugins will have *editing enrolment* and *user unenrolment* actions. However, some plugins may override this method to add extra actions.

<details>
  <summary>View example</summary>
  <div>

```php
/**
 * Gets an array of the user enrolment actions
 *
 * @param course_enrolment_manager $manager
 * @param stdClass $userenrolment
 * @return array An array of user_enrolment_actions
 */
public function get_user_enrolment_actions(course_enrolment_manager $manager, $userenrolment) {
    $actions = parent::get_user_enrolment_actions($manager, $userenrolment);
    $context = $manager->get_context();
    $instance = $userenrolment->enrolmentinstance;
    $params = $manager->get_moodlepage()->url->params();
    $params['ue'] = $userenrolment->id;

    // Edit enrolment action.
    if ($this->allow_manage($instance) && has_capability("enrol/{$instance->enrol}:something", $context)) {
        $title = get_string('newaction', 'enrol');
        $icon = new pix_icon('t/edit', '');
        $url = new moodle_url('/enrol/pluginname/something.php', $params);
        $actions[] = new user_enrolment_action($icon, $title, $url);
    }

    return $actions;
}
```

  </div>
</details>

### enrol_plugin::allow_unenrol(): bool

This method returns true if other code allowed to unenrol everybody from one instance. This method is used on course reset and manual unenrol.

:::note

The unenrol action will allow resetif all following conditions are met:

- The method `enrol_plugin::allow_unenrol()` returns true
- The current user has the `enrol/pluginname:unenrol` capability.

:::

<details>
  <summary>View example</summary>
  <div>

```php
public function allow_unenrol(stdClass $instance) {
    // Add any extra validation here.
    return true;
}
```

  </div>
</details>

### enrol_plugin::allow_unenrol_user(): bool

This method returns true if other code allowed to unenrol a specific user from one instance.

:::tip

If `allow_unenrol_user` is not overridden, the default behaviour is to call `allow_unenrol()` method.

:::

:::note

The unenrol action will be displayed if all following conditions are met:

- The method `enrol_plugin::allow_unenrol_user()` returns true
- The current user has the `enrol/pluginname:unenrol` capability.

:::

<details>
  <summary>View example</summary>
  <div>

```php
public function allow_unenrol_user(stdClass $instance, stdClass $userenrolment) {
    // Add any extra validation here.
    return true;
}

```

  </div>
</details>

It is quite common in enrolment plugins to allow unenrol only if the user enrolment is suspended (for example: *enrol_database*, *enrol_flatfile*, *enrol_meta*).

<details>
  <summary>View suspended enrolment example</summary>
  <div>

```php
public function allow_unenrol_user(stdClass $instance, stdClass $userenrolment) {
    if ($userenrolment->status == ENROL_USER_SUSPENDED) {
        return true;
    }
    return false;
}
```

  </div>
</details>

### enrol_plugin::allow_enrol(): bool

Define if the enrol plugin is compatible with manual enrolments.

:::note

The edit manual enrolment action will be displayed if if all following conditions are met:

- The method `enrol_plugin::allow_enrol()` returns true
- The current user has the `enrol/pluginname:enrol` capability.

:::

<details>
  <summary>View example</summary>
  <div>

```php
public function allow_enrol(stdClass $instance) {
    // Add any extra validation here.
    return true;
}
```

  </div>
</details>

### enrol_plugin::enrol_user()

This method is the plugin enrolment hook. It will be called when user is enrolled in the course using one of the plugin instances. It is used to alter the enrolment data (for example altering the dates or the role) and also to throw exceptions if some external condions are not met.

<details>
  <summary>View example</summary>
  <div>

```php
/**
 * Enrol a user using a given enrolment instance.
 *
 * @param stdClass $instance the plugin instance
 * @param int $userid the user id
 * @param int $roleid the role id
 * @param int $timestart enrolment start timestamp
 * @param int $timeend enrolment end timestamp
 * @param int $status default to ENROL_USER_ACTIVE for new enrolments, no change by default in updates
 * @param bool $recovergrades restore grade history
 */
public function enrol_user(
    stdClass $instance,
    $userid,
    $roleid = null,
    $timestart = 0,
    $timeend = 0,
    $status = null,
    $recovergrades = null
) {
    // Add validations here.

    parent::enrol_user(
        $instance,
        $userid,
        $roleid,
        $timestart,
        $timeend,
        $status,
        $recovergrades
    );
}
```

  </div>
</details>

### enrol_plugin:allow_manage(): bool

Return true if plugin allows manual modification of user enrolments from other code. False is usually returned from plugins that synchronise data with external systems, otherwise the manual changes would be reverted immediately upon synchronisation.

:::note

The edit enrolment action in the participants list will be displayed if if all following conditions are met:

- The method `allow_manage` returns true
- The current user has the `enrol/pluginname:manage` capability.

:::

<details>
  <summary>View example</summary>
  <div>

```php
public function allow_manage(stdClass $instance) {
    // Add any extra validation here.
    return true;
}
```

  </div>
</details>

### enrol_plugin::roles_protected(): bool

Enrolment plugins can protect roles from being modified by any other plugin. Returning false will allow users to remove all roles assigned by this plugin. By default, this method returns true.

:::

<details>
  <summary>View example</summary>
  <div>

```php
public function roles_protected() {
    // Add any extra validation here if necessary.
    return false;
}
```

  </div>
</details>

### enrol_plugin:find_instance(): stdClass {#enrol_pluginfind_instance-stdclass}

Returns enrolment instance in a given course matching provided data. If enrol plugin implements this method, then it is supported
 in CSV course upload.

:::note

So far following enrol plugins implement this method: *enrol_manual*, *enrol_self*, *enrol_guest*, *enrol_cohort*.
 Method must be capable to uniquely identify instance in a course using provided data in order to implement this method. For example, *enrol_cohort* uses
 `cohortID` together with `roleID` to identify instance. For some methods (like *enrol_lti* or *enrol_payment*) it is not possible
 to uniquely identify instance in a course using provided data, so such methods will not be supported in CSV course upload.

The only exception is *enrol_self* - although it is not possible to uniquely identify enrolment instance in a course using provided data, it is still supported in CSV course upload. For *enrol_self* method `find_instance()` returns the first available enrolment instance in a course.

:::

<details>
  <summary>View example</summary>
  <div>

```php
public function find_instance(array $enrolmentdata, int $courseid) : ?stdClass {
    global $DB;
    $instances = enrol_get_instances($courseid, false);

    $instance = null;
    if (isset($enrolmentdata['cohortidnumber']) && isset($enrolmentdata['role'])) {
        $cohortid = $DB->get_field('cohort', 'id', ['idnumber' => $enrolmentdata['cohortidnumber']]);
        $roleid = $DB->get_field('role', 'id', ['shortname' => $enrolmentdata['role']]);
        if ($cohortid && $roleid) {
            foreach ($instances as $i) {
                if ($i->enrol == 'cohort' && $i->customint1 == $cohortid && $i->roleid == $roleid) {
                    $instance = $i;
                    break;
                }
            }
        }
    }
    return $instance;
}
```

  </div>
</details>

## Standard Editing UI

Moodle participants page has a standard editing UI for manual enrolments. To integrate a plugin into the start UI you need to implement the following methods:

- `enrol_plugin::use_standard_editing_ui()`
- `enrol_plugin::edit_instance_form()`
- `enrol_plugin::edit_instance_validation()`
- `enrol_plugin::can_add_instance()`
- `enrol_plugin::add_instance()`

This means that the following functions from the plugin will be called to build the add/edit form, perform validation of the data and add standard navigation links to the manage enrolments page and course navigation.

<details>
  <summary>View example</summary>
  <div>

import UiLib from '!!raw-loader!./_examples/ui_lib.php';

<CodeBlock language="php">{UiLib}</CodeBlock>

  </div>
</details>

## Sending a welcome email

Some enrol methods has the support for sending welcome mesages to users. To grant the enrol messages are consistent acorrs enrolments methods, the enrol API provides the `enrol_send_welcome_email_options` function. This method returns a list of all possible options for sending welcome email when the user enrol in a course and each option has a respective constant defined on **enrollib.php**:

```php
define('ENROL_DO_NOT_SEND_EMAIL', 0); // Do not send the welcome email.
define('ENROL_SEND_EMAIL_FROM_COURSE_CONTACT', 1); // Send welcome email from course contact.
define('ENROL_SEND_EMAIL_FROM_KEY_HOLDER', 2); // Send welcome email from course key holder.
define('ENROL_SEND_EMAIL_FROM_NOREPLY', 3); // Send welcome email from no reply.
```

<details>
  <summary>View example</summary>
  <div>

import MessageLib from '!!raw-loader!./_examples/message_lib.php';

<CodeBlock language="php">{MessageLib}</CodeBlock>

  </div>
</details>

## See also

- [Enrolment API](../../subsystems/enrol.md)
