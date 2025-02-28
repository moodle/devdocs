---
title: Course overview integration
tags:
- MUA Project
- API
- Module
- Activity
- mod
- Course
---

## Summary

<Since version="5.0" issueNumber="MDL-83872" />

The course overview table displays a summary of all activities in a course, along with relevant information such as due dates, submission state, completion status, etc. Both students and teachers can access the course overview by clicking the "Activities" tab in the course navigation. The new page replaces the old `mod/PLUGINNAME/index.php` page provided by the activity plugins.

To customize the information displayed in the course overview table, activity plugins must implement their own integration class.

## Overview Class Structure

The integration class must be located in `mod/PLUGINNAME/classes/courseformat/overview.php` using the namespace `mod_PLUGINNAME\courseformat\overview`. The `overview` class should extend the `core_courseformat\activityoverviewbase` class and implement the necessary methods to provide the required overview data.

### Class Definition

This is an example of the class definition that do not add any extra overview items. Simply by extending the `activityoverviewbase` class, the course overview will display the activity name, the section and, if the user has completion, the completion status of the activity.

```php
namespace mod_PLUGINNAME\courseformat;

use core_courseformat\activityoverviewbase;

class overview extends activityoverviewbase {
    // Implement methods here.
}
```

### Extra Overview Items

To provide extra overview items, the plugin can override the `get_extra_overview_items` method. This method should return an array of `\core_courseformat\local\overview\overviewitem` objects indexed by item shortname.

This is an example of a plugin adding an extra overview item to show if the activity has been submitted:

```php
namespace mod_PLUGINNAME\courseformat;

use core_courseformat\activityoverviewbase;
use core_courseformat\local\overview\overviewitem;
use core\output\pix_icon;

class overview extends activityoverviewbase {
    #[\Override]
    public function get_extra_overview_items(): array {
        return [
            'submitted' => $this->get_extra_submitted_overview(),
        ];
    }

    /**
     * Get the extra overview item to show if the activity has been submitted.
     *
     * @return overviewitem|null
     */
    private function get_extra_submitted_overview(): ?overviewitem {
        // Validate if the user needs this overview information. Return null otherwise.
        if (!has_capability('mod/PLUGINNAME:complete', $this->context)) {
            return null;
        }

        // All items should have a value (for filtering purposes)-
        $value = false;

        // The overview content can be a string.
        $content = '-';

        // Logic to determine if the activity is already submitted
        if (PLUGIN_LOGIC_TO_DETECT_IF_THE_USER_HAS_SUBMITTED_ANYTHING($this->cm)) {
            $value = true;
            // The overview content can also be a renderable object.
            $content = new \pix_icon(
                'i/checkedcircle',
                alt: get_string('already_submitted', 'mod_PLUGINNAME'),
                attributes: ['class' => 'text-success'],
            );
        }

        // Return the overview item. It is mandatory to provide also a name to display.
        // The name will be used as the table header in the course overview, but it could
        // also be used in other placements in the future.
        return new overviewitem(
            name: get_string('responded', 'mod_PLUGINNAME'),
            value: $value,
            content: $content,
        );
    }
}
```

## Fixed Overview Items

Some activity information is especial and they will be added automatically to the course overview table without declaring them in the `get_extra_overview_items` method.

The following are the fixed overview items:

- **Activity Name**: The name of the activity as a link, the section name and the visibility badge.
- **Completion Status**: The completion status of the activity, if enabled and apply to the current user.

However, there are other fixed overview items that are considered empty unless the plugin overrides the corresponding method:

- **Due Date**: The due date of the activity. Provided by the `get_due_date_overview` method.
- **Main action**: The main action of the activity. Provided by the `get_actions_overview` method.

### Due Date Overview

To provide a due date overview, override the `get_due_date_overview` method. This method must return an `overviewitem` object or null if there is no due date.

```php
namespace mod_PLUGINNAME\courseformat;

use core_courseformat\activityoverviewbase;
use core_courseformat\local\overview\overviewitem;

class overview extends activityoverviewbase {
    #[\Override]
    public function get_due_date_overview(): ?overviewitem {
        // Implement here how to get the due date of the activity.
        $duedate = DO_SOMETHING_TO_GET_YOUR_PLUGIN_DUE_DATE();

        if (empty($duedate)) {
            // If all overview items return null, the due date column will not be displayed.
            return new overviewitem(
                name: get_string('duedate'),
                value: null,
                content: '-',
            );
        }
        return new overviewitem(
            name: get_string('duedate'),
            value: $this->cm->name,
            content: userdate($duedate),
        );
    }
}
```

### Main Action Overview

The main action is always displayed as the last column in the course overview table. However, by default the column is empty and it is not rendered in the table. However, the plugin can define their own action cell to provide useful links to the user. For example, the main action could be the submissions count with a link to the submissions page.

For now, the main action overview is only displayed in the course overview table. However, in the future, it could be used in other places like the course page or the activity page.

To provide a main action overview, override the `get_actions_overview` method.

```php
namespace mod_PLUGINNAME\courseformat;

use core_courseformat\activityoverviewbase;
use core_courseformat\local\overview\overviewitem;
use core\output\action_link;
use core\output\local\properties\button;
use core\output\local\properties\text_align;

class overview extends activityoverviewbase {
    #[\Override]
    public function get_actions_overview(): ?overviewitem {
        // Validate if the user can do the action. Return null otherwise.
        if (!has_capability('mod/PLUGINNAME:viewreports', $this->context)) {
            return null;
        }

        $submissions = CALCULATE_YOUR_PLUGIN_SUBMISSIONS_COUNT();
        $total = CALCULATE_YOUR_PLUGIN_TOTAL_SUBMISSIONS();

        if (!$total) {
            return new overviewitem(
                name: get_string('responses', 'mod_feedback'),
                value: 0,
                content: '-',
                textalign: text_align::CENTER,
            );
        }

        // For the action content, it is recommended to style it using the
        // button enum css helper, it will make the final result consistent
        // with the rest of plugins.
        $content = new action_link(
            url: new url('/mod/feedback/show_entries.php', ['id' => $this->cm->id]),
            text: get_string(
                'count_of_total',
                'core',
                ['count' => $submissions, 'total' => $total]
            ),
            attributes: ['class' => button::SECONDARY_OUTLINE->classes()],
        );

        return new overviewitem(
            name: get_string('responses', 'mod_feedback'),
            value: $submissions,
            content: $content,
        );
    }
}
```

### Custom grade overview items

If the activity has a grade item, the course overview will display the grade of the activity to the student. If your plugin has one single grade item, you don't need to do anything.

For activities with more than one grade item (for example, mod_workshop), no grade will be shown by default because the system doesn't know the meaning of each grade item. For those cases, the plugin must implement `get_grade_item_names` to provide the generic name for each grade item. The overview report will show only the grade items with a generic name.

This is an example of a plugin with two grade items:

```php
#[\Override]
protected function get_grade_item_names(array $items): array {
    // Add some fallback in case some grade item is missing.
    if (count($items) != 2) {
        return parent::get_grade_item_names($items);
    }
    $names = [];
    foreach ($items as $item) {
        // Use the itemnunmber to know which grade item is.
        $stridentifier = ($item->itemnumber == 0) ? 'submission_gradenoun' : 'assessment_gradenoun';
        // Names must be indexed by the grade item id.
        $names[$item->id] = get_string($stridentifier, 'mod_YOURPLUGIN');
    }
    return $names;
}
```

:::note

It is not recommended to override the `get_grades_overviews` method. The method is used to provide the grade information to the course overview, but it is not intended to be used to provide extra information. If you don't want to show the grade information in your plugin, you can override the `get_grade_item_names` method and return an empty array.

:::

## Dependency Injection

The `overview` class will be loaded using [dependency injection](../../core/di/index.md). The constructor must accept a `cm_info` object to initialize the parent class, however, the constructor can also accept other dependencies that the plugin needs.

This is an example of a overview integration that needs access to the database and a clock interface for timestamps.

```php
namespace mod_PLUGINNAME\courseformat;

use core_course\activityoverviewbase;

class overview extends activityoverviewbase {
    public function __construct(
        /** @var cm_info $cm the activity course module. */
        cm_info $cm,
        /** @var \moodle_database $db the database acces. */
        protected readonly \moodle_database $db,
        /** @var \core\clock $clock the clock interface */
        protected readonly \core\clock $clock
    ) {
        parent::__construct($cm);
    }

    // The rest of your code goes here. All methods must access the
    // $this->db property to interact with the database instead of
    // using the global $DB.

    // Also, to handle timestamps, use $this->clock->time() instead.
}
```

## Redirect the index.php page to the course overview

The `activityoverviewbase` class provides a static method to redirect the old `mod/PLUGINNAME/index.php` page to the new course overview. This method should be called in the `index.php` file of the activity plugin.

This is an example of the `index.php` file of a plugin redirecting to the course overview:

```php
require_once("../../config.php");

$courseid = required_param('id', PARAM_INT);

\core_courseformat\activityoverviewbase::redirect_to_overview_page($courseid, 'YOURPLUGINNAME');
```

Once done, the plugin can deprecate any method, output or renderer related to the previous index page.
