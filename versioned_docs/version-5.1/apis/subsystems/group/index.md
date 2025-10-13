---
title: Groups API
tags:
  - API
  - Subsystem
  - group
  - grouping
  - course
documentationDraft: true
---

Moodle [Groups](https://docs.moodle.org/en/Groups) are a way of expressing collections of users within a course. They may be defined by the teacher in the course participants page, or created automatically during a bulk user upload (for example, from a text file).

A teacher can choose whether to use, or even to force, the use of groups for an entire course (from within the Course settings page), or for an individual activity (from within the Activity settings).

Groups can be used in different modes:

- None - groups are not used
- Separate - users can only see and interact with users in their own group
- Visible - users can see a list of the other groups and, depending on the activity, may be able to interact with them

If enabled at the course level, the group mode will affect how course-wide reporting functions - for example, if a course-wide group mode of "Separate groups" is enabled, this is applied within the gradebook.

Groups may be grouped together into named [Groupings](https://docs.moodle.org/en/Groupings). The course, and individual activities, can be configured to filter the groups shown to those in a specific Grouping. If a user is a member of multiple groups, then only those groups which belong to the selected grouping are shown.

When a course or activity is in the 'Separate' groups mode, only users within that group can interact with, unless they hold the `moodle/site:accessallgroups` capability. By default, this capability is given to users who hold a role with the `editingteacher`, and `manager` archetypes.

Most of these settings are handled by the core groups code and core groups API. If the activity module wants to implement group support, it need only use the Groups API to:

- Find out the current settings for this instance of the activity
- Show group controls (for example group selection menus) when appropriate
- Explore memberships and structures of groups
- Modify it's own interface to hide/show data accordingly

:::note

Groups are typically only relevant to course features such as Activity modules, some blocks and reports.

Some other core subsystems also need to be group-aware.

:::

## Group modes

There are three different group modes, these modes allow for restrictions to be put in place for access and visibility.

- No groups (`NOGROUPS` constant) - The course or activity has no groups.
- Separate groups (`SEPARATEGROUPS` constant) - Teachers and students can normally only see information relevant to that group.
- Visible groups (`VISIBLEGROUPS` constant) - Teachers and students are separated into groups but can still see all information.

This is explained in more detail on the [Groups access control](https://docs.moodle.org/dev/Groups_access_control) page.

:::caution

Only groups with `participation` enabled are available for use in Separate and Visible groups mode. This is enabled by default for groups with *Visible to all* or *Visible to members* visibility (See below) but is always disabled for groups with *See own membership* or *Membership is hidden*.

:::

Calling `groups_get_all_groups()` with the `$participationonly` argument set to `true` will only return groups with `participation` enabled. If you are calling this function within an activity plugin, you will usually want to do this unless you have a good reason not to.

## Group visibility

To help protect user privacy, each group has a `visibility` setting, which controls who can see the group and its members. The possible values are defined as `GROUPS_VISIBILITY_*` constants in grouplib.

Users with the `moodle/course:viewhiddengroups` capability can always see all groups, regardless of their visibility.
Otherwise, the following restrictions apply:

- Visible to all (`GROUPS_VISIBILITY_ALL` constant) - Everyone can see the group and its members. This is the default, and the legacy behaviour for all groups before Moodle 4.2.
- Visible to members (`GROUPS_VISIBILITY_MEMBERS` constant) - Only members of the group can see the group, and members of the group can see each others' membership of the group.
- See own membership (`GROUPS_VISIBILITY_OWN` constant) - Only members of the group can see the group, and members **cannot** see each others' membership, only their own.
- Membership is hidden (`GROUPS_VISIBILITY_NONE` constant) - No-one can see the group or its members.

The core API functions in `groupslib` such as `groups_get_all_groups()` and `groups_get_members()` will respect the group visibility and the current user's permissions, so use these as far as possible when fetching data about groups and their members. The `\core_group\visibility` class also has helper functions to determine whether a user is allowed to see a group, or its members.

## File locations

The Groups API is currently defined in [lib/grouplib.php](https://github.com/moodle/moodle/blob/main/lib/grouplib.php). This contains global functions which have the `groups_` prefix, for example: `groups_get_group()`.

## Examples

### How to find and use the "current" group

This is using an example from the module forums.

```php
// Get the course module id from a post or get request.
$id = required_param('id', PARAM_INT);

// Get the course module.
$cm = get_coursemodule_from_id('forum', $id, 0, false, MUST_EXIST);

// Get the current group id.
$currentgroupid = groups_get_activity_group($cm);
// Get the current group name from the group id.
$currentgroupname = groups_get_group_name($currentgroupid);

// Do as you please with your newly obtained group information.
```

### How to make sure that the current user can see a given item in your activity

The following example:

- fetches the course module record for the specified forum id
- checks whether it has a group mode specified (separate or visible groups)
- fetches the list of possible groups for that activity
- checks whether the forum discussion is in a valid group

For this example we are going to check to see if groups are active and whether the user has access to the discussion.

```php
// Get the course module and discussion id from a post or get request.
$id           = required_param('id', PARAM_INT);
$discussionid = required_param('discussionid', PARAM_INT);

// Get the course module.
$cm = get_coursemodule_from_id('forum', $id, 0, false, MUST_EXIST);

// Get the group id for this discussion
$discussiongroup = $DB->get_record('forum_discussions', ['id' => $discussionid], groupid);

// Check access.
if (groups_get_activity_groupmode($cm)) {
    $groups = groups_get_activity_allowed_groups($cm);
} else {
    $groups = [];
}
if (!in_array($discussiongroup->groupid, array_keys($groups))) {
    print_error('groupnotamember', 'group');
}

// Continue on with group specific discussion
```

### How to display a group menu

The following example will display the group selection dropdown using the `groups_print_activity_menu()` function.

This function will show all groups that the user has access to for the current course module.

After making a selection, the user will be redirected to the `$url` provided.

```php
// Get the course module id from a post or get request
$id = required_param('id', PARAM_INT);

// Get the course module
$cm = get_coursemodule_from_id('forum', $id, 0, false, MUST_EXIST);

// Create a moodle_url. A URL is required so that if the user selects a different group, the page can be
// reloaded with the new groups information.
$url = new moodle_url('/mod/forum/view.php', ['id' => $cm->id]);

// Print group information (A drop down box will be displayed if the user is a member of more than one group,
// or has access to all groups).
groups_print_activity_menu($cm, $url);
```

### How to get just the groups that the current user can see

The following example will check whether the current user has permission to see hidden groups on a course, and **if they do not**, will apply additional conditions to a query to restrict the results to just those groups they should see.

```php
$courseid = required_param('courseid', PARAM_INT);
$sql = "SELECT g.idnumber, gm.*
          FROM {groups} g
          JOIN {groups_members} gm ON gm.groupid = g.id
         WHERE courseid = ?";

$params = [$courseid];

$context = context_course::instance($courseid);
if (!has_capability('moodle/course:viewhiddengroups', $context)) {
    // Apply visibility restrictions.
    [
        $visibilitywhere,
        $visibilityparams
    ] = \core_group\visibility::sql_group_visibility_where($userid);
    $sql .= " AND " . $visibilitywhere;
    $params = array_merge($params, $visibilityparams);
}

$rs = $DB->get_recordset_sql($sql, $params);
```

:::note

A query like this must join on `group_members` as group visibility is dependant on the user's own memberships.

:::

<Since versions={[ 4.3 ]} />

### Group GeoPattern images

Moodle now allows groups to generate GeoPattern images. This is intended to improve the overall user experience by allowing users to differentiate groups easier in their Moodle activities and resources.

Generate the SVG image for the group and use it in your Moodle activities and resources:

```php
$group_svg_image = moodle_url::make_pluginfile_url(
    $context->id,
    'group',
    'generated',
    $group->id,
    '/',
    'group.svg'
);
```

This will create an SVG image for the specified group, which can then be used in Moodle activities and resources. Make sure to customize the code to fit your specific use case.

## Further reading

- [Groups FAQ](https://docs.moodle.org/en/Groups_FAQ)
- [Groupings FAQ](https://docs.moodle.org/en/Groupings_FAQ)
