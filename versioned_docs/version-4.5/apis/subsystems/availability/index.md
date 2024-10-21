---
title: Availability API
tags:
  - Availability
  - core_availability
---

The availability API controls access to activities and sections. For example, a teacher could restrict access so that an activity cannot be accessed until a certain date, or so that a section cannot be accessed unless users have a certain grade in a quiz.

:::note

In older versions of Moodle, the conditional availability system defaulted to off; and users could enable it from the advanced features page in site administration. It is enabled by default for new installs of Moodle since Moodle 3.1, but sites which have been upgraded may still have to manually enable it.

You can still call the API functions even if the system is turned off.

:::

## Using the API

In most cases you do not need to use the API directly because the course and activity API already handles it for you. For example, if you are writing a module:

- Moodle will automatically prevent users from accessing your module if they do not meet the availability conditions (unless they have the ability to access hidden activities). This is calculated when you call `require_login` and pass your activity's information.
- Your activity's form will automatically include controls for setting availability restriction, as part of the standard form controls.

There are two special cases in which you may need to use the API directly.

- Checking whether the current user can access an activity
- Displaying a list of users who may be able to access the current activity

### Check access for a user

#### Activities

Some availability information can be accessed from an instance of the `cm_info` class, specifically in the `uservisible` property.

This property considers a range of factors to indicate whether the activity should be visible to that user, including:

- whether the activity was hidden by a teacher
- whether the activity is available based on the availability API

The `cm_info` object also includes an `availableinfo` property which provides HTML-formatted information to explain to the user why they cannot access the activity.

```php title="Checking and displaying availability information"
$modinfo = get_fast_modinfo($course);
$cm = $modinfo->get_cm($cmid);
if ($cm->uservisible) {
    // User can access the activity.
} else if ($cm->availableinfo) {
    // User cannot access the activity, but on the course page they will
    // see a link to it, greyed-out, with information (HTML format) from
    // $cm->availableinfo about why they can't access it.
} else {
    // User cannot access the activity and they will not see it at all.
}
```

#### Course sections

Some availability information can be accessed from an instance of the `section_info` class, specifically in the `uservisible` property.

This property considers a range of factors to indicate whether the activity should be visible to that user, including:

- whether the activity was hidden by a teacher
- whether the activity is available based on the availability API

The `section_info` object also includes an `availableinfo` property which provides HTML-formatted information to explain to the user why they cannot access the activity.

:::warning Checking sections and activities

The `uservisible` check for an _activity_ automatically includes all relevant checks for the section that the activity is placed in.

You **do not** need to check visibility and availability for _both_ the section and the activity.

:::

#### Accessing information for a different user

The availability information in both the `cm_info` and `section_info` classes is calculated  for the current user. You can also obtain them for a different user by passing a user ID to `get_fast_modinfo`, although be aware that doing this repeatedly for different users will be slow.

### Display a list of users who may be able to access the current activity

Sometimes you need to display a list of users who may be able to access the current activity.

While you could use the above approach for each user, this would be slow and also is generally not what you require. For example, if you have an activity such as an assignment which is set to be available to students until a certain date, and if you want to display a list of potential users within that activity, you probably don't want to make the list blank immediately the date occurs.

The system divides availability conditions into two types:

- Applied to user lists, including:
  - User group
  - User grouping
  - User profile conditions
- Not applied to user lists, including:
  - The current date
  - completion
  - grade

In general, the conditions which we expect are likely to change over time (such as dates) or as a result of user actions (such as grades) are not applied to user lists.

If you have a list of users (for example you could obtain this using one of the 'get enrolled users' functions), you can filter it to include only those users who are allowed to see an activity with this code:

```php
$info = new \core_availability\info_module($cm);
$filtered = $info->filter_user_list($users);
```

:::note

The above example does not include the `$cm->visible` setting, nor does it take into account the `viewhiddenactivities` setting.

:::

## Using availability conditions in other areas

The availability API is provided for activities (course-modules) and sections. It is also possible to use it in other areas such as _within_ a module. See [Availability API for items within a module](https://docs.moodle.org/dev/Availability_API_for_items_within_a_module).

## Programmatically setting availability conditions

In some situations you may need to _programmatically_ configure the availability conditions for an activity - for example you may have a custom enrolment plugin which creates assessable activities according to a student information system.

To configure the availability, you can generate a JSON structure using an instance of the `core_availability\tree` class, and setting it against the activity or section record in the database, for example:

```php
$restriction = \core_availability\tree::get_root_json([
    \availability_group\condition::get_json($group->id),
]);
$DB->set_field(
    'course_modules',
    'availability',
    json_encode($restriction),
    [
        'id' => $cmid,
    ]
);
rebuild_course_cache($course->id, true);
```

The following code can be used to programmatically set start and end date restrictions.

```php
use \core_availability\tree;

$dates = [];
$dates[] = \availability_date\condition::get_json(">=", $availability['start']);
$dates[] = \availability_date\condition::get_json("<", $availability['end']);

$showc = [true, true];
$restrictions = tree::get_root_json($dates, tree::OP_AND, $showc);

$DB->set_field(
    'course_modules',
    'availability',
    json_encode($restrictions),
    [
        'id' => $cmid,
    ]
);
rebuild_course_cache($course->id, true);
```

The ```$showc``` array determines if the course modules will be shown or invisible when not available.

## See also

- Writing [Availability condition](../../plugintypes/availability/index.md) plugins
