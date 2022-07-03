---
title: Time API
tags:
  - API
  - Time
---

Internally Moodle always stores all times in unixtime format (number of seconds since epoch) which is independent of timezones.

The Time API is used to display proper date-time depending on user or site timezones.

## Functions

There is a class in Moodle to handle most needs of working with times. There are 2 cases to consider when working with time:

System Time

This is when you are dealing with dates on the server e.g. executing scheduled tasks, performing background tasks - anything which does not depend on the timezone of any specific user.

User Time

This is when you are manipulating dates and times and you need to display them to the user in their current timezone (which may be different for each user).

The main API for time is in the class "core_date" which will give you php DateTimeZone objects for either user time or server time as needed. You can then use the php datetime classes to manipulate the time. When finished manipulating the time, get a timestamp with DateTime::getTimestamp().

Example: Get the current server time + 1 day.

```php
$tomorrow = new DateTime("1 day", core_date::get_server_timezone_object());
```

Get a timestamp for storing in the database:

```php
$tomorrowint = $tomorrow->getTimestamp();
```

Get a timestamp for 3pm tomorrow in the current users timezone.

```php
$time = new DateTime("now", core_date::get_user_timezone_object());
$time->add(new DateInterval("P1D"));
$time->setTime(15, 0, 0);

$timestamp = $time->getTimestamp();
```

:::danger
Never add or subtract timestamps for any reason - you will get it wrong (DST is a killer)!
:::

Other functions related to time api can be found in lib/moodlelib.php.

1. Time API's for current user
   - **make_timestamp** - Given date-time, it produces a GMT timestamp for current user.
   - **userdate** - Gets formatted string that represents a date in user time (note that the format required by this function is the [strftime()](https://www.php.net/manual/en/function.strftime.php) format, not the more common format used by date())
   - **usertime** - Given a GMT timestamp (seconds since epoch), offsets it by the timezone.  eg 3pm in India is 3pm GMT - 5.5 * 3600 seconds
   - **usergetdate** - Given a timestamp in GMT, returns an array that represents the date-time in user time
   - **usergetmidnight** - Given a date, return the GMT timestamp of the most recent midnight for the current user.
   - **usertimezone** - Returns current user's timezone
1. System Time API
   - **format_time** - Format a date/time (seconds) as weeks, days, hours etc as needed
   - **dst_offset_on** - Calculates the Daylight Saving Offset for a given date/time (timestamp)
   - **find_day_in_month** - Calculates when the day appears in specific month
   - **days_in_month** - Calculate number of days in a given month
   - **dayofweek** - Calculate the position in the week of a specific calendar day
1. Older legacy date/time functions. Do not use in new code.
   - **usertime** - Appends the users timezone offset to an integer timestamp
   - **get_timezone_offset** - Systems's timezone difference from GMT in seconds
   - **get_user_timezone_offset** - Returns user's timezone difference from GMT in hours
   - **dst_changes_for_year** -  Calculates the required DST change and returns a Timestamp Array

## Glossary

### Timezone

Moodle supports following timezone formats:

1. UTC (specifically UTC−11 to UTC+11)
1. Time offsets from UTC (int +-(0-13) or float +-(0.5-12.5))
1. World timezones (Australia/Perth)

### Location

Timezone depends on [Location](https://docs.moodle.org/en/Location) of the user and can be forced upon by administrator.

### DST

DST is abbreviation of **Daylight Saving Time** (also known as "Day light saving" and "Summer Time"). Many countries, and sometimes just certain regions of countries, adopt daylight saving time during part of the year. Moodle automatically calculates DST for current user, depending on user location.

## Examples

### Create DateTime with date/time from a unixtime (number of seconds)

```php
$date = new DateTime();
$date->setTimestamp(intval($unixtime);
echo userdate($date->getTimestamp());
```

### Time API's for current user

Prints the current date and time in the user's timezone:

```php
$now = time();
echo userdate($now);
```

To manually specify the display format, use one of the formatting strings defined in the <tt>core_langconfig</tt> component of the user's language. For example, to display just the date without the time, use:

```php
echo userdate(time(), get_string('strftimedaydate', 'core_langconfig'));
```

You can also use the <tt>DateTime</tt> class to obtain the timestamp:

```php
$date = new DateTime("tomorrow", core_date::get_user_timezone_object());
$date->setTime(0, 0, 0);
echo userdate($date->getTimestamp(), get_string('strftimedatefullshort', 'core_langconfig'));
```

### System Time API

Find the day of the week for the first day in this month.

```php
$now = new DateTime("now", core_date::get_server_timezone_object());

$year = $now->format('Y');
$month = $now->format('m');

$now->setDate($year, $month, 1);
$dayofweek = $now->format('N');
echo $dayofweek;
```

## See also

- [Php DateTime class](https://www.php.net/manual/en/class.datetime)
- [Core APIs](../../../apis.md)
