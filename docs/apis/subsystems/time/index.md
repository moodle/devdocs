---
title: Time API
tags:
  - API
  - Time
---

Internally Moodle always stores all times in unixtime format, which is a format independent of timezones.

The Time API is then used to display the correct date and time depending on user and site timezones.

:::tip

The Unix Time format is defined as the number of seconds since the Unix epoch, which began on January 1 1970 at 00:00:00 UTC.

:::

## Classifications of Time

In Moodle there are 2 cases to consider when working with time:

### System Time

In Moodle, the term 'System Time' is used to describe dates on the server, for example times when executing scheduled tasks, performing background tasks, and so on. That is, anything which does not depend on the timezone of any specific user.

### User Time

The term 'User Time' is used for times which are user-specific. That is that they are in the user's time zone.

You will see these when displaying dates and times to the user in their current timezone (which may be different for each user).

## The Time APIs

The main APIs for time in Moodle are the `\core\clock` class, which allows you to fetch and manipulate the current time; and the `core_date` class, which handles PHP `DateTimeZone` objects for either user time or server time as needed. You can then use the PHP `DateTime` classes to manipulate the time. You can also fetch a timestamp with `DateTime::getTimestamp()`.

### Fetching and manipulating the current time

<Since issueNumber="MDL-80838" version="4.4" />

The `\core\clock` Interface was added in Moodle 4.4 and is available via [Dependency Injection](../../core/di/index.md). It provides a [clock implementation](../../core/clock/index.md) which is consistent with the [PSR-20: Clock](https://www.php-fig.org/psr/psr-20/) interfaces.

This is the recommended approach for fetching the current time and should be used instead of native implementations such as `time()`, and `new \DateTime();`.

```php title="Fetching the clock"
$clock = \core\di::get(\core\clock::class);
```

:::tip Why use the Clock?

By using the clock interface fetched via Dependency Injection, it becomes easier to test different conditions within your code. For example you can inject a custom implementation of the clock which simulates a 5 minute gap between creation of different records, and allows you to test features such as sorting.

You can read more on [Unit testing](../../core/clock/index.md#unit-testing) with the Clock API.

:::

The clock interface's `now()` method returns a `\DateTimeImmutable` object representing the current time:

```php title="Fetching the current DateTime"
$now = \core\di::get(\core\clock::class)->now();
```

This can be further modified using the [`add`](https://www.php.net/manual/en/datetimeimmutable.add.php), [`sub`](https://www.php.net/manual/en/datetimeimmutable.sub.php), and [`modify`](https://www.php.net/manual/en/datetimeimmutable.modify.php) methods, for example:

```php title="Fetch the DateTime for 24 hours time"
$tomorrow = \core\di::get(\core\clock::class)
    ->now()
    ->modify('+1 day');
```

The Unix Timestamp can be fetched for the DateTime Object using the `getTimestamp()` method:

```php title="Fetching the timestamp"
$tomorrow = \core\di::get(\core\clock::class)
    ->now()
    ->modify('+1 day')
    ->getTimestamp();
```

:::danger Modifying the DateTime object

The object returned from the `\core\clock::now()` method is an instance of `\DateTimeImmutable`.

Calling any of the modifier methods (`add()`, `sub()`, or `modify()`) will not modify the object, but will return a new object with the updated time.

```php
$today = \core\di::get(\core\clock::class)
    ->now();

$tomorrow = $today->modify('+1 day');

$today !== $tomorrow;
```

:::

The `\core\time` interface also provides a helper to fetch the current Unix Timestamp in a single operation:

```php title="Fetching the current Unix Timestamp"
$now = \core\di::get(\core\clock::class)->time();
```

### Displaying time

Moodle provides a range of methods to display a Unix Timestamp in the relevant Language and Timezone.

1. Time API's for current user
   - `userdate` - Given a Unix Timestamp, return a formatted string that represents a date in the user's time.

     :::note

     The format required by this function is the [`strftime()`](https://www.php.net/manual/en/function.strftime.php) format, not the more common format used by `date()`.

     :::

   - `usergetmidnight` - Given a Unix Timestamp, return the Unix Timestamp of the most recent midnight for the current user.
   - `usertimezone` - Return the current user's timezone
   - `make_timestamp` - Given date-time, it produces a Unix Timestamp for current user.
1. System Time API
   - `format_time` - Format a date or time period in seconds as weeks, days, hours, and so on, as needed
   - `dst_offset_on` - Calculates the Daylight Saving Offset for a given Unix Timestamp
   - `find_day_in_month` - Calculates when the day appears in specific month
   - `days_in_month` - Calculate number of days in a given month
   - `dayofweek` - Calculate the position in the week of a specific calendar day
1. Older legacy date/time functions. Do not use in new code.
   - `usergetdate` - Given a Unix Timestamp, returns an array that represents the date-time in user time
   - `usertime` - Appends the users timezone offset to an integer timestamp

## Glossary

### Timezone

Moodle supports the following timezone formats:

1. UTC (specifically UTC−11 to UTC+11)
1. Time offsets from UTC (int +-(0-13) or float +-(0.5-12.5))
1. World timezones (Australia/Perth)

### Location

Timezone depends on [Location](https://docs.moodle.org/en/Location) of the user and can be forced upon by administrator.

### DST

DST is abbreviation of **Daylight Saving Time** (also known as "Day light saving" and "Summer Time"). Many countries, and sometimes just certain regions of countries, adopt daylight saving time during part of the year. Moodle automatically calculates DST for current user, depending on user location.

## Examples

### Create DateTime with date/time from a Unix Timestamp

```php
$date = new DateTime();
$date->setTimestamp(intval($unixtime);
echo userdate($date->getTimestamp());
```

### Time API's for current user

Prints the current date and time in the user's timezone:

```php
$now = \core\di::get(\core\clock::class)->time();
echo userdate($now);
```

To manually specify the display format, use one of the formatting strings defined in the <tt>core_langconfig</tt> component of the user's language. For example, to display just the date without the time, use:

```php
echo userdate(
    \core\di::get(\core\clock::class)->time(),
    get_string('strftimedaydate', 'core_langconfig'),
);
```

You can also use the <tt>DateTime</tt> class to obtain the timestamp:

```php
$date = \core\di::get(\core\clock::class)
    ->now()
    ->modify('+1 day')
    ->setTime(0, 0, 0);

echo userdate(
    $date->getTimestamp(),
    get_string('strftimedatefullshort', 'core_langconfig'),
);
```

### System Time API

Find the day of the week for the first day in this month.

```php
$now = \core\di::get(\core\clock::class)->now();

$year = $now->format('Y');
$month = $now->format('m');

$firstdayofmonth = $now->setDate($year, $month, 1);
$dayofweek = $firstdayofmonth->format('N');
echo $dayofweek;
```

## See also

- [Php DateTime class](https://www.php.net/manual/en/class.datetime)
- [Core APIs](../../../apis.md)
