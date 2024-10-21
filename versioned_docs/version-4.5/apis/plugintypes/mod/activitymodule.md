---
title: Activity chooser
tags:
- MUA Project
documentationDraft: true
---

:::caution

This documentation is from the project kick-off and has not been updated since the project completed.

:::

Through our road-map creation process of looking at highly voted tracker issues and relevant forum posts, as well as MUA interaction, an update to the activity chooser to simplify and make less intimidating, was chosen.

[MDL-57828](https://tracker.moodle.org/browse/MDL-57828) was created and worked on, but unfortunately stalled, and did not complete its way through the integration process. There is a [substantial forum post](https://moodle.org/mod/forum/discuss.php?d=346664), with many suggestions and current pain points with the activity chooser. The MUA created a proposal issue ([MDL-61511](https://tracker.moodle.org/browse/MDL-61511)) to tackle the same issue.

We have recently been analysing how course creation is achieved. Two main ideas were tested with focus groups to try and find the best away to approach course creation. With this information we are confident that we have a user focused design that will improve the activity chooser for everyone.

We would like to invite everyone to express their opinion on this improvement. Course creation is a Moodle activity that is fundamental to teaching a course online, and we would like to ensure that the process is as easy and intuitive as possible.

## Features

The following are changes that we are planning on making in this project. We have a demo that can be viewed and interacted with.
[Invisio mockup of the activity chooser](https://projects.invisionapp.com/share/SVSREPYNBYG#/screens/388682478).

Our current work can be viewed at [activity chooser prototype](https://activitychooser.prototype.moodledemo.net/). Please take a look.

### Larger display area

The activity chooser will be wider and have the activities in a grid format. This allows for more activities to be seen at once.

### Activities and resources are now merged

Our research found that the distinction been activities and resources was not useful to teachers and so now these two categories have been merged together.

### Starred / Favourites tab

The user can now select activities to be added to the Starred tab. The starred tab is shown by default to users when pulling up the activity chooser.

![The starred tab](./_activitymodule/activity-chooser-starred.png)

### Recommended tab

Site administrators will now be able to set a selection of activities as recommended. These recommended activities will show up in a tab in the activity chooser for the course creator to view. If no recommendations are made then this tab will not be displayed.

![The recommended tab](./_activitymodule/activity-chooser-recommend.png)

### Smart search bar

To help find activities from the activity chooser, we will be adding a search bar, that will search through both the names of the activities, and also the information text, to try and find relevant activities that the user may want.

### Other activity types

Other activity types such as LTI will be able to be added to the activity chooser for the user to select.

### Activity information hidden

The information about an activity will be accessible through the 'i' icon. Clicking the link will show additional information about the activity. This will free up space for other activities to be shown rather than always taking up half of the activity chooser.

![Additional information about an activity](./_activitymodule/activity-chooser-info.png)

## Third party plugin developers

Course module plugins can add items to the activity chooser by implementing the `{plugin}_get_course_content_items()` callback in their plugin lib (lib.php). This callback replaces the now deprecated `{plugin}_get_shortcuts()` method.

In order for activity starring and recommendations to work, each content_item has an ID which is subject to some additional rules. Each ID:

- Must be unique to your component.
- Must not change.
- Must be of type integer.

See `lti_get_course_content_items()` for an example implementation in core.

Additionally, for recommendations to be made, plugins must implement the `{plugin}_get_all_content_items()` callback in their lib.php. This method must return a list of all content items that can be added across all courses.

Developers who are currently using the deprecated `{plugin}_get_shortcuts()` callback should implement the new callback in their plugins as soon as possible. Whilst legacy items are still included (in cases where the new callback has yet to be implemented in the plugin), these items can not be starred, nor recommended. Eventually all support for the deprecated method will be removed, as per normal deprecation policy.
