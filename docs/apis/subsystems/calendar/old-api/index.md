---
title: Calendar old API
tags:
  - Calendar
  - API
  - Deprecated
---
This page documents the calendar API that existed before Moodle 3.3. For the API since then, see [Calendar API](../index.md).

The Calendar API allows you to add and modify events in the calendar for user, groups, courses, or the whole site.

## Overview

The Moodle [Calendar](https://docs.moodle.org/en/Calendar) collects and displays calendar events from everything users have access to.

If your plugin generates calendar events (such as due dates) then you need to add your events to the calendar.

## File locations

All the calendar code is located in /calendar/lib.php.  You need to include this file in your script if you intend to use it.

## The calendar_event class

In general functionality of `calendar_event()` class are to create, update and delete events.

### Creating new event

Creating new calendar event to database by defining some properties for the event.

If event hook is used, it will also call `self::calendar_event_hook()` to create event for the hook.

```php
calendar_event::create($properties)
```

### Updating event

Updating an existing event in database by providing at least an event id.  If the event is a repeated events, the
rest of series event will also be updated (depending on the properties value of `repeateditall`).
This function could also be use to insert new event to database If the requested event is not exist in database.
The optional parameter `$checkcapability` is use to check user's capability to edit/add event.  By default `$checkcapability` parameter is set to true.

If event hook is used, it will also call self::calendar_event_hook() to update the hook event.

```php
calendar_event::update($data, $checkcapability = true)
```

### Deleting event

Deleting an existing event in database.  The optional parameter `$deleterepeated` is use as indicator to remove the rest
of repeated events.  The default value for `$deleterepeated` is true. Deleting an event will also deleting
all associated files related to the event's editor context.

If event hook is used, it will also call self::calendar_event_hook() to delete event for the hook.

```php
$calendar_event = new calendar_event($event_data);
$calendar_event->delete($deleterepeated = false)
```

### Event hook

The capability to use hook to perform specific action to calendar event.
This requires setting up `$CFG->calendar` and include external calendar file in `$CFG->dirroot .'/calendar/'. $CFG->calendar .'/lib.php'`.

```php
calendar_event_hook($action, array $args)
```

## Functions

List of function for calendar and calendar_event.

### Retrieve or print calendar's information

```php
calendar_get_default_courses()
calendar_get_days()
calendar_get_starting_weekday()
calendar_day_representation($tstamp, $now = false, $usecommonwords = true)
calendar_time_representation($time)
calendar_wday_name($englishname)
calendar_days_in_month($month, $year)
calendar_get_link_href($linkbase, $d, $m, $y)
calendar_get_mini($courses, $groups, $users, $cal_month = false, $cal_year = false)
calendar_get_popup($is_today, $event_timestart, $popupcontent = '')
calendar_add_month($month, $year)
calendar_sub_month($month, $year)
calendar_get_module_cached(&$coursecache, $modulename, $instance)
calendar_get_course_cached(&$coursecache, $courseid)
calendar_print_month_selector($name, $selected)
```

### Control calendar display

```php
calendar_top_controls($type, $data)
calendar_filter_controls(moodle_url $returnurl)
calendar_preferences_button(stdClass $course)
calendar_set_filters(array $courseeventsfrom, $ignorefilters = false)
calendar_get_link_previous($text, $linkbase, $d, $m, $y, $accesshide = false)
calendar_get_link_next($text, $linkbase, $d, $m, $y, $accesshide = false)
```

### Retrieve calendar_event information

```php
calendar_get_allowed_types(&$allowed, $course = null)
calendar_add_event_allowed($event)
calendar_edit_event_allowed($event)
calendar_user_can_add_event($course)
calendar_show_event_type($type, $user = null)
calendar_set_event_type_display($type, $display = null, $user = null)
calendar_get_events($tstart, $tend, $users, $groups, $courses, $withduration = true, $ignorehidden = true)
calendar_events_by_day($events, $month, $year, &$eventsbyday, &$durationbyday, &$typesbyday, &$courses)
calendar_get_upcoming($courses, $groups, $users, $daysinfuture, $maxevents, $fromtime = 0)
calendar_get_block_upcoming($events, $linkhref = NULL)
calendar_format_event_time($event, $now, $linkparams = null, $usecommonwords = true, $showtime = 0)
calendar_add_event_metadata($event)
```

## Examples

The following are examples of using the basic calendar_event API in Moodle.

### Example to create new event

Creating new calendar event for closing feedback date.

```php
$event = new stdClass;
$event->name         = get_string('stop', 'feedback').' '.$feedback->name;
$event->description  = format_module_intro('feedback', $feedback, $feedback->coursemodule);
$event->courseid     = $feedback->course;
$event->groupid      = 0;
$event->userid       = 0;
$event->modulename   = 'feedback';
$event->instance     = $feedback->id;
$event->eventtype    = 'feedbackcloses'; // For activity module's events, this can be used to set the alternative text of the event icon. Set it to 'pluginname' unless you have a better string.
$event->timestart    = $feedback->timeclose;
$event->visible      = instance_is_visible('feedback', $feedback);
$event->timeduration = 0;

calendar_event::create($event);
```

### Updating existing calendar event

Simple example of updating exiting event through moodle form.

```php
$eventid = required_param('id', PARAM_INT);
$event = calendar_event::load($eventid);

$data = $mform->get_data();
$event->update($data);
```

### Deleting existing calendar event

Simple example of deleting existing event from database.

```php
$eventid = required_param('id', PARAM_INT);
$event = calendar_event::load($eventid);
$event->delete($repeats);
```

## See also

- [Core APIs](../../../../apis.md)
- [Calendar user docs](https://docs.moodle.org/en/Calendar)
- [Calendar types](https://docs.moodle.org/dev/Calendar_types)
