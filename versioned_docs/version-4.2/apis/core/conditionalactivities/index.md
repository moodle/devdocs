---
title: Conditional activities API
tags: []
documentationDraft: true
---

The Conditional Activities API allowsyou to specify whether to hide, or show, an activity when a series of conditions associated with it are met.

:::note

This should not be confused with the [completion API](../activitycompletion/index.md) which is used to mark if an activity is completed or not. The Conditional Activities API is used to handle the _availability_ of an activity, whilst the Completion API helps to track the _progress_ of student in an activity.

:::

## Files

The main file containing all key functions is located at `lib/conditionlib.php`..

## Functions and Examples

The class `condition_info` defined in `lib/conditionlib.php` is the main conditional API in Moodle. Following are some important methods of the above mentioned class.

```php
fill_availability_conditions($cm)
get_full_course_module()
add_completion_condition($cmid, $requiredcompletion)
add_grade_condition($gradeitemid, $min, $max, $updateinmemory = false)
wipe_conditions()
get_full_information($modinfo = null)
is_available($information, $grabthelot = false, $userid = 0, $modinfo = null)
show_availability()
update_cm_from_form($cm, $fromform, $wipefirst=true)
```

The basic functionality of these methods can be classified as:-

1. Fetching information related to conditions
1. Adding/Updating conditional clauses to activities
1. Deleting conditions attached to activities

### Fetching information related to conditions

The following functions are normally used to fetch information regarding conditions associated with activities:

```php
get_full_course_module();
get_full_information($modinfo=null);
is_available($information, $grabthelot = false, $userid = 0, $modinfo = null);
show_availability();
```

#### get_full_course_module()

This method can fetches and returns all necessary information as a course module object which are required to determine the availability conditions.

Example:-

```php
$cm->id = $id;
$test = new condition_info($cm, CONDITION_MISSING_EVERYTHING);
$fullcm = $test->get_full_course_module();
```

#### get_full_information()

This function returns a string which describes the various conditions in place for the activity in the given context.Some possible outputs can be:-

```php
 a) From 13:05 on 14 Oct until 12:10 on 17 Oct (exact, exact)
 b) From 14 Oct until 12:11 on 17 Oct (midnight, exact)
 c) From 13:05 on 14 Oct until 17 Oct (exact, midnight 18 Oct)
```

Please refer to the inline documentation in the code for detailed explanation of the logic and all possible cases.

Example:-

```php
$ci = new condition_info($mod);
$fullinfo = $ci->get_full_information();
```

#### is_available()

This function is used to check if a given course module is currently available or not. A thing worth noting is that this doesn't take "visibility settings" and `viewhiddenactivities` capability into account. That is these settings should be properly checked after the result of is_available(), before dumping any data to the user.

Example:-

```php
$ci = new condition_info((object) ['id' => $cmid], CONDITION_MISSING_EVERYTHING);
$bool = $ci->is_available($text, false, 0);
```

#### show_availability()

This function is used to check if information regarding availability of the current module should be shown to the user or not.

Example:-

```php
$ci = new condition_info((object) ['id' => $cmid], CONDITION_MISSING_EVERYTHING);
$bool = $ci->show_availability();
```

### Adding/Updating conditional clauses to activities

```php
fill_availability_conditions($cm);
add_completion_condition($cmid, $requiredcompletion);
add_grade_condition($gradeitemid, $min, $max, $updateinmemory = false);
update_cm_from_form($cm, $fromform, $wipefirst = true)
```

#### fill_availability_conditions()

This function adds any extra availability conditions to given course module object.

```php
$rawmods = get_course_mods($courseid);
if (empty($rawmods)) {
    die;
}
if ($sections = $DB->get_records("course_sections", ["course" => $courseid], "section ASC")) {
    foreach ($sections as $section) {
        if (!empty($section->sequence)) {
            $sequence = explode(",", $section->sequence);
                foreach ($sequence as $seq) {
                    if (empty($rawmods[$seq])) {
                        continue;
                    }
                    if (!empty($CFG->enableavailability)) {
                         condition_info::fill_availability_conditions($rawmods[$seq]);
                         // Do something.
                    }
                }
            }
        }
    }
}
```

#### add_completion_condition()

In Moodle availability condition of a Module or activity can depend on another activity. For example activity B will not be unlocked until activity A is successfully completed. To add such inter-dependent conditions, this function is used.

Example:-

```php
$test1 = new condition_info((object) ['id' => $cmid], CONDITION_MISSING_EVERYTHING);
$test1->add_completion_condition(13, 3);
```

#### add_grade_condition()

This function is used to add a grade related restriction to an activity based on the grade secured in another activity. In the following example a minimum grade of 0.4 is required on gradeitem 666 to unlock the current activity in context.

Example:-

```php
$test1 = new condition_info((object) ['id' => $cmid], CONDITION_MISSING_EVERYTHING);
$test1->add_grade_condition(666, 0.4, null, true);
```

#### update_cm_from_form()

This function is used to update availability conditions from a user submitted form.

Example:-

```php
$fromform = $mform->get_data();
if (!empty($fromform->update)) {
    if (!empty($course->groupmodeforce) or !isset($fromform->groupmode)) {
        $fromform->groupmode = $cm->groupmode; // Keep the original.
    }

    // update course module first
    $cm->groupmode        = $fromform->groupmode;
    $cm->groupingid       = $fromform->groupingid;
    $cm->groupmembersonly = $fromform->groupmembersonly;

    $completion = new completion_info($course);
    if ($completion->is_enabled()) {
        // Update completion settings.
        $cm->completion                = $fromform->completion;
        $cm->completiongradeitemnumber = $fromform->completiongradeitemnumber;
        $cm->completionview            = $fromform->completionview;
        $cm->completionexpected        = $fromform->completionexpected;
    }
    if (!empty($CFG->enableavailability)) {
        $cm->availablefrom             = $fromform->availablefrom;
        $cm->availableuntil            = $fromform->availableuntil;
        $cm->showavailability          = $fromform->showavailability;
        condition_info::update_cm_from_form($cm,$fromform,true);
    }
    // Do something else with the data.
}
```

### Deleting conditions attached to activities

we have a simple function wipe_conditions() that can erase all conditions associated with the current activity.
consider an example:-

```php
$ci = new condition_info($cm, CONDITION_MISSING_EVERYTHING, false);
$ci->wipe_conditions();
```

## See Also

- [Conditional activities Adding module support](https://docs.moodle.org/dev/Conditional_activities_Adding_module_support)
- [Conditional activities](https://docs.moodle.org/dev/Conditional_activities) - original specification for this feature.

### User documentation

- [How to make a new availability condition plugin](../../plugintypes/availability/index.md).
- [Conditional Activities](https://docs.moodle.org/en/Conditional_activities)
- [Conditional Activities Settings](https://docs.moodle.org/en/Conditional_activities_settings)
- [Using Conditional Activities](https://docs.moodle.org/en/Using_Conditional_activities)
