---
title: Activity completion API
tags:
  - Conditional activities
  - API
---

:::note

There are changes to the completion API introduced in **Moodle 3.11** to be incorporated to this page. Please refer to [Student activity completion](https://docs.moodle.org/dev/Student_activity_completion) for details.

:::

Activities do not need to be changed to support conditional availability, but they do need changing to support the completion system.

If you make no changes to an activity whatsoever, it can only support 'manual' completion (where the user ticks a box).

## Feature support

To support the completion system, your activity must include a `[activityname]_supports` function in its `lib.php`. Here is an example:

```php
 /**
  * Indicates API features that the forum supports.
  *
  * @param string $feature
  * @return null|bool
  */
function forum_supports(string $feature): bool {
    switch($feature) {
        case FEATURE_COMPLETION_TRACKS_VIEWS:
            return true;
        case FEATURE_COMPLETION_HAS_RULES:
            return true;
        default:
            return null;
    }
}
```

The relevant features for completion are:

- **`FEATURE_COMPLETION_TRACKS_VIEWS`** - the activity can support completion 'on view', meaning that an activity becomes marked complete as soon as a user clicks on it.
- **`FEATURE_GRADE_HAS_GRADE`** - the activity provides (or may provide, depending on settings) a grade for students. When an activity supports grades, it can support completion 'on grade', meaning that an activity becomes marked complete as soon as a user is assigned a grade.
- **`FEATURE_COMPLETION_HAS_RULES`** - the activity has custom completion rules.

## Completion on view

Completion on view means that, if selected, an activity is marked as complete as soon as the user views it.

'View' is usually defined as seeing the activity's main page; if you click on the activity, and there isn't an error, you have probably viewed it. However it is up to each activity precisely how they define 'view'.

### How to implement

In your activity's `[activityname]_supports` function, return true for `FEATURE_COMPLETION_TRACKS_VIEWS`.

Then add this code to run whenever a user successfully views the activity. In order for navigation to work as expected (that is so that the navigation block on the activity's page takes account that you have viewed this activity, if there is another activity that depends on it) you should put this code before printing the page header.

```php
 $completion = new completion_info($course);
 $completion->set_module_viewed($cm);
```

### Performance issues

Calling this method has no significant performance cost if 'on view' completion is not enabled for the activity. If it is enabled, then the performance cost is kept low because the 'viewed' state is cached; it doesn't add a database query to every request.

## Completion on grade

Completion on grade means that, if selected, an activity is marked as complete as soon as the user receives a grade from that activity.

### How to implement

In your `[activityname]_supports` function, return true for `FEATURE_GRADE_HAS_GRADE`. No other action is necessary.

### Performance issues

When 'on grade' completion is enabled, there will be some additional database queries after a grade is assigned or changed. Unless your activity changes grades very frequently, this is unlikely to be an issue.

## Custom completion rules

Custom completion rules allow for activity-specific conditions. For example, the forum has custom rules so that a teacher can configure it to mark a user as having completed the activity when that user makes a certain number of posts to the forum.

Implementing custom completion rules is more complex than using the system-provided 'view' or 'grade' conditions, but the instructions below should help make it clear.

### Implementation overview

To implement custom completion rules, you need to:

1. Return true for `FEATURE_COMPLETION_HAS_RULES` in your activity's `_supports` function.
1. Add database fields to your activity's main table to store the custom completion settings.
1. Add backup and restore code to back up these fields.
1. Add information about the completion settings to the activities cm_info object.
1. Add controls to your activity's settings form so that users can select the custom rules, altering these database settings.
1. Add a function that checks the value of these rules (if set).
1. Add function returns descriptions for the completion states.
1. Add code so that whenever the value affecting a rule might change, you inform the completion system.

### Database fields for completion settings

When you provide a custom completion rule for a activity, that rule requires data to be stored with each activity instance: whether the rule is enabled for that instance, and any options that apply to the rule.

Usually the best place to store this information is your activity's main table because:

- The information in the relevant row of this table is likely to be available in most parts of your code, so code changes are minimised.
- You already read this row with most requests, so there is no need for additional database queries which would reduce performance.
- The main table is used for most other activity options so it is a logical place for this information.
If you are adding a basic completion condition you probably only need to add one field. To add a field to an existing activity, you need to change the db/install.xml and the db/upgrade.php in the same way as adding any other field.

#### Example

Throughout this section I am using the forum as an example. The forum provides three completion options but because they all behave the same way, I am only showing one of them.

The forum adds this field to store a completion option:

- **`completionposts`** - this may be 0 or an integer. If it's an integer, say 3, then the user needs to add 3 forum posts (either new discussions or replies) in order for the forum to count as 'completed'.

### Backup and restore for completion fields

Activities do not need to back up the generic completion options, which are handled by the system, but they do need to back up any custom options. You should add backup and restore logic for the fields mentioned above.

Remember that your restore code should handle the case when these fields are not present, setting the fields to a suitable default value.

#### Example

The following code in `backup_forum_stepslib.php` lists the fields to back up:

```php
$forum = new backup_nested_element('forum', ['id'], [
    'type', 'name', 'intro', 'introformat',
    'assessed', 'assesstimestart', 'assesstimefinish', 'scale',
    'maxbytes', 'maxattachments', 'forcesubscribe', 'trackingtype',
    'rsstype', 'rssarticles', 'timemodified', 'warnafter',
    'blockafter', 'blockperiod', 'completiondiscussions', 'completionreplies',
    'completionposts',
]);
```

As you can see, I added the **`completionposts`** field (and the others that aren't covered in this example) to the list of fields.

### Add information about the completion settings to the activities cm_info object

You will need to add information about the custom rules into the activities `cm_info` object by either adding, or modifying the `module_get_coursemodule_info` callback

```php
/**
 * Add a get_coursemodule_info function in case any forum type wants to add 'extra' information
 * for the course (see resource).
 *
 * Given a course_module object, this function returns any "extra" information that may be needed
 * when printing this activity in a course listing.  See get_array_of_activities() in course/lib.php.
 *
 * @param stdClass $coursemodule The coursemodule object (record).
 * @return cached_cm_info An object on information that the courses
 *                        will know about (most noticeably, an icon).
 */
function forum_get_coursemodule_info($coursemodule) {
    global $DB;

    $dbparams = ['id' => $coursemodule->instance];
    $fields = 'id, name, intro, introformat, completionposts, completiondiscussions, completionreplies, duedate, cutoffdate';
    if (!$forum = $DB->get_record('forum', $dbparams, $fields)) {
        return false;
    }

    $result = new cached_cm_info();
    $result->name = $forum->name;

    if ($coursemodule->showdescription) {
        // Convert intro to html. Do not filter cached version, filters run at display time.
        $result->content = format_module_intro('forum', $forum, $coursemodule->id, false);
    }

    // Populate the custom completion rules as key => value pairs, but only if the completion mode is 'automatic'.
    if ($coursemodule->completion == COMPLETION_TRACKING_AUTOMATIC) {
        $result->customdata['customcompletionrules']['completiondiscussions'] = $forum->completiondiscussions;
        $result->customdata['customcompletionrules']['completionreplies'] = $forum->completionreplies;
        $result->customdata['customcompletionrules']['completionposts'] = $forum->completionposts;
    }

    // Populate some other values that can be used in calendar or on dashboard.
    if ($forum->duedate) {
        $result->customdata['duedate'] = $forum->duedate;
    }
    if ($forum->cutoffdate) {
        $result->customdata['cutoffdate'] = $forum->cutoffdate;
    }

    return $result;
}
```

### Form changes for completion settings

When you have custom completion conditions, you need to add controls to your module's settings form `mod_form.php` so that users can select these conditions. You can add any necessary controls.

- Implement the `add_completion_rules` function which adds the form controls for your new rules.
- Implement the `completion_rule_enabled` function which is called during form validation to check whether one of your activity's completion rules has been selected.
- Implement other form changes if necessary to set up the form with your data. If your data is in the form of simple text boxes or dropdowns then this is not necessary, but you might want to have a checkbox that enables the rule with a separate control to set its value. This needs form tweaks.

<Since
  version="4.3"
  issueNumber="MDL-78528"
/>

The default completion form has undergone a significant rebuild to enhance code reusability and maintainability. To prevent duplicate IDs, a suffix has been introduced to the form elements related to completion rules.

:::info From Moodle 4.3 onwards

Any custom completion rules added will need to use `$this->get_suffix()`.

:::

#### Example

The forum offers a checkbox with a text input box beside it. You tick the checkbox to enable the rule, then type in the desired number of posts.

First, the function that adds these controls:

```php
/**
 * Add elements for setting the custom completion rules.
 *
 * @category completion
 * @return array List of added element names, or names of wrapping group elements.
 */
public function add_completion_rules() {

    $mform = $this->_form;

    $group = [
        $mform->createElement(
            'checkbox',
            $this->get_suffixed_name('completionpostsenabled'),
            ' ',
            get_string('completionposts', 'forum')
        ),
        $mform->createElement(
            'text',
            $this->get_suffixed_name('completionposts'),
            ' ',
            ['size' => 3]
        ),
    ];
    $mform->setType('completionposts', PARAM_INT);
    $mform->addGroup(
        $group,
        $this->get_suffixed_name('completionpostsgroup'),
        get_string('completionpostsgroup','forum'),
        [' '],
        false
    );
    $mform->addHelpButton(
        $this->get_suffixed_name('completionpostsgroup'),
        'completionposts',
        'forum'
    );
    $mform->disabledIf(
        $this->get_suffixed_name('completionposts'),
        $this->get_suffixed_name('completionpostsenabled'),
        'notchecked'
    );

    return [$this->get_suffixed_name('completionpostsgroup')];
}

protected function get_suffixed_name(string $fieldname): string {
    return $fieldname . $this->get_suffix();
}
```

- The function creates a checkbox and a text input field, which is set to accept only numbers.
- These are grouped together so they appear on the same line, and we add a help button.
- The text input field is disabled if the checkbox isn't ticked.
- Note that this function must return the top-level element associated with the completion rule. (If there are multiple elements, you can return more than one.)
  - This is used so that your controls become disabled if automatic completion is not selected.

Next, a function for checking whether the user selected this option:

```php
/**
 * Called during validation to see whether some activity-specific completion rules are selected.
 *
 * @param array $data Input data not yet validated.
 * @return bool True if one or more rules is enabled, false if none are.
 */
public function completion_rule_enabled($data) {
    return (!empty($data[$this->get_suffixed_name('completionpostsenabled')]) &&
            $data[$this->get_suffixed_name('completionposts')] != 0);
}
```

- The custom completion rule is enabled if the 'enabled' checkbox is ticked and the text field value is something other than zero.
  - This is used to give an error if the user selects automatic completion, but fails to select any conditions.
That's all the 'required' functions, but we need to add some extra code to support the checkbox behaviour. I overrode `get_data` so that if there is a value in the edit field, but the checkbox is not ticked, the value counts as zero (the rule will not be enabled).

```php
function get_data() {
    $data = parent::get_data();
    if (!$data) {
        return $data;
    }
    if (!empty($data->completionunlocked)) {
        // Turn off completion settings if the checkboxes aren't ticked.
        $autocompletion = !empty($data->{$this->get_suffixed_name('completion')}) &&
                $data->{$this->get_suffixed_name('completion')} == COMPLETION_TRACKING_AUTOMATIC;
        if (empty($data->{$this->get_suffixed_name('completionpostsenabled')}) || !$autocompletion) {
        $data->{$this->get_suffixed_name('completionposts')} = 0;
        }
    }
    return $data;
}
```

You may have noticed the `completionunlocked` check. When some users have already completed the activity, the completion settings are 'locked'; they are disabled and cannot be edited, so there will be no value set for those fields in the `$data` object. Normally this will automatically work but when dealing with checkboxes you need to include a check for the `completionunlocked` value before doing anything that would cause one of those fields to be changed in the database.
Finally, forum already had a `data_preprocessing` function but I added code to this to set up the checkboxes when the form is displayed, and to make the default value of the text fields 1 instead of 0:

```php
function data_preprocessing(&$default_values){
    // [Existing code, not shown]

    // Set up the completion checkboxes which aren't part of standard data.
    // We also make the default value (if you turn on the checkbox) for those
    // numbers to be 1, this will not apply unless checkbox is ticked.
    $default_values[$this->get_suffixed_name('completionpostsenabled')] =
            !empty($default_values[$this->get_suffixed_name('completionposts')]) ? 1 : 0;
    if (empty($default_values[$this->get_suffixed_name('completionposts')])) {
        $default_values[$this->get_suffixed_name('completionposts')] = 1;
    }
}
```

Phew! That's the form done.

### Completion state function

When you create completion conditions, you need to write a function *module*`_get_completion_state` that checks the value of those conditions for a particular user.

The function receives as parameters `$course`, `$cm`, and `$userid` - all self-explanatory, I hope - and `$type`. This has two values:

- **`COMPLETION_AND`** - if multiple conditions are selected, the user must meet all of them.
- **`COMPLETION_OR`** (not currently used) - if multiple conditions are selected, any one of them is good enough to complete the activity.
Your function should return:
- **`true`** if your custom completion options are enabled and the user meets the conditions.
- **`false`** if your custom completion options are enabled but the user does not yet meet the conditions.
- `$type` (not false!) if none of your custom completion options are not enabled.

#### Example

Here's the function for forum (simplified to include only the one completion option):

```php title="mod/forum/lib.php"
 /**
  * Obtains the automatic completion state for this forum based on any conditions
  * in forum settings.
  *
  * @param object $course Course
  * @param object $cm Course-module
  * @param int $userid User ID
  * @param bool $type Type of comparison (or/and; can be used as return value if no conditions)
  * @return bool True if completed, false if not, $type if conditions not set.
  */
 function forum_get_completion_state($course, $cm, $userid, $type) {
     global $CFG,$DB;

     // Get forum details
     $forum = $DB->get_record('forum', ['id' => $cm->instance], '*', MUST_EXIST);

     // If completion option is enabled, evaluate it and return true/false
     if ($forum->completionposts) {
         return $forum->completionposts <= $DB->get_field_sql("
 SELECT
     COUNT(1)
 FROM
     {forum_posts} fp
     INNER JOIN {forum_discussions} fd ON fp.discussion=fd.id
 WHERE
     fp.userid = :userid AND fd.forum = :forumid
        ", [
            'userid' => $userid,
            'forumid' => $forum->id,
        ]);
     } else {
         // Completion option is not enabled so just return $type
         return $type;
     }
 }
```

### Add function returns descriptions for the completion states

When you create completion conditions, you need to write a function `[activityname]_get_completion_active_rule_descriptions` that gives a human-readable description of the completion state.

The input for the method is the `cm_info` object for that activity.

You need to return an array of strings for each completion rule that is active.

```php
/**
 * Callback which returns human-readable strings describing the active completion custom rules for the module instance.
 *
 * @param cm_info|stdClass $cm object with fields ->completion and ->customdata['customcompletionrules']
 * @return array $descriptions the array of descriptions for the custom rules.
 */
function mod_forum_get_completion_active_rule_descriptions($cm) {
    // Values will be present in cm_info, and we assume these are up to date.
    if (empty($cm->customdata['customcompletionrules']) || $cm->completion != COMPLETION_TRACKING_AUTOMATIC) {
        return [];
    }

    $descriptions = [];
    foreach ($cm->customdata['customcompletionrules'] as $key => $val) {
        switch ($key) {
            case 'completiondiscussions':
                if (!empty($val)) {
                    $descriptions[] = get_string('completiondiscussionsdesc', 'forum', $val);
                }
                break;
            case 'completionreplies':
                if (!empty($val)) {
                    $descriptions[] = get_string('completionrepliesdesc', 'forum', $val);
                }
                break;
            case 'completionposts':
                if (!empty($val)) {
                    $descriptions[] = get_string('completionpostsdesc', 'forum', $val);
                }
                break;
            default:
                break;
        }
    }
    return $descriptions;
}
```

### Notifying the completion system

Finally you need to notify the completion system whenever these values might have changed for a user (in the case of the forum example, whenever somebody adds or deletes a post). The completion system will end up calling the function above - but only if it needs to.

- To ensure performance is not compromised, you should notify the system only when the completion state might actually have changed. Don't notify the system unless your custom completion rule is actually enabled.
- You need to pass in the 'possible result' of the change. This is used to significantly improve performance. There are three values:
  - **`COMPLETION_COMPLETE`** - this change will either have no effect on the user's completion state, or it will make it complete. The change cannot make a user's state *in*complete if it was complete previously. In the forum example, when you add a post, there is no way this can make the user's state incomplete, so this possible result applies.
  - **`COMPLETION_INCOMPLETE`** - this change will either have no effect on the user's completion state, or it will make it incomplete. The change cannot make a user's state complete if it was incomplete previously. Deleting a forum post would fall into this category.
  - **`COMPLETION_UNKNOWN`** - this change might have either effect. Using this option is much slower than the others, so try to avoid using it in anything that might happen frequently.
- If the user whose completion state would be updated is not the current user, then the optional `$userid` parameter must be included. For example, if a teacher deletes a student's forum post, then it is the student's completion state which may need updating, not the teacher's.

#### Example

Here's the code that runs when somebody makes a new forum post:

```php
// Update completion state
$completion = new completion_info($course);
if ($completion->is_enabled($cm) && $forum->completionposts) {
    $completion->update_state($cm, COMPLETION_COMPLETE);
}
```

### Completion Checks in Cron Tasks

If you need to check completion as part of a cron task or another part of Moodle that does not already include the completion_info class, you will need to include it.

#### Example

```php
require_once($CFG->dirroot.'/lib/completionlib.php');
```

## See Also

- [Activity completion and availability](https://docs.moodle.org/dev/Conditional_activities) - Original Specification
- [Course completion](https://docs.moodle.org/dev/Course_completion) - Original Specification
- [Policy - Retroactive effects of completion settings](https://docs.moodle.org/dev/Policy_-_Retroactive_effects_of_completion_settings)
- [Core APIs](../../../apis.md)

### User Docs

- [Completion Docs](https://docs.moodle.org/en/Category:Completion)
- [Activity Completion](https://docs.moodle.org/en/Activity_completion)
- [Course Completion](https://docs.moodle.org/en/Course_completion)
