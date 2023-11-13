---
title: API Guides
---

Moodle has a number of core APIs that provide tools for Moodle scripts.

They are essential when writing [Moodle plugins](https://docs.moodle.org/dev/Plugins).

## Most-used General API

These APIs are critical and will be used by nearly every Moodle plugin.

### Access API (access)

The [Access API](./apis/subsystems/access.md) gives you functions so you can determine what the current user is allowed to do, and it allows modules to extend Moodle with new capabilities.

### Data manipulation API (dml)

The [Data manipulation API](./apis/core/dml/index.md) allows you to read/write to databases in a consistent and safe way.

### File API (files)

The [File API](./apis/subsystems/files/index.md) controls the storage of files in connection to various plugins.

### Form API (form)

The [Form API](./apis/subsystems/form/index.md) defines and handles user data via web forms.

### Logging API (log)

The [Events API](https://docs.moodle.org/dev/Events_API) allows you to log events in Moodle, while [Logging 2](https://docs.moodle.org/dev/Logging_2) describes how logs are stored and retrieved.

### Navigation API (navigation)

The [Navigation API](./apis/core/navigation/index.md) allows you to manipulate the navigation tree to add and remove items as you wish.

### Page API (page)

The [Page API](https://docs.moodle.org/dev/Page_API) is used to set up the current page, add JavaScript, and configure how things will be displayed to the user.

### Output API (output)

The [Output API](./apis/subsystems/output/index.md) is used to render the HTML for all parts of the page.

### String API (string)

The [String API](https://docs.moodle.org/dev/String_API) is how you get language text strings to use in the user interface. It handles any language translations that might be available.

### Upgrade API (upgrade)

The [Upgrade API](./guides/upgrade/index.md) is how your module installs and upgrades itself, by keeping track of its own version.

### Moodlelib API (core)

The [Moodlelib API](https://docs.moodle.org/dev/Moodlelib_API) is the central library file of miscellaneous general-purpose Moodle functions. Functions can over the handling of request parameters, configs, user preferences, time, login, mnet, plugins, strings and others. There are plenty of defined constants too.

## Other General API

### Admin settings API (admin)

The [Admin settings](./apis/subsystems/admin/index.md) API deals with providing configuration options for each plugin and Moodle core.

### Admin presets API (adminpresets)

The [Admin presets API](https://docs.moodle.org/dev/AdminPresetsAPI) allows plugins to make some decisions/implementations related to the Site admin presets.

### Analytics API (analytics)

The [Analytics API](./apis/subsystems/analytics/index.md) allow you to create prediction models and generate insights.

### Availability API (availability)

The [Availability API](./apis/subsystems/availability/index.md) controls access to activities and sections.

### Backup API (backup)

The [Backup API](./apis/subsystems/backup/index.md) defines exactly how to convert course data into XML for backup purposes, and the [Restore API](./apis/subsystems/backup/restore.md) describes how to convert it back the other way.

### Cache API (cache)

The [The Moodle Universal Cache (MUC)](https://docs.moodle.org/dev/The_Moodle_Universal_Cache_(MUC)) is the structure for storing cache data within Moodle. [Cache API](./apis/subsystems/muc/index.md) explains some of what is needed to use a cache in your code.

### Calendar API (calendar)

The [Calendar API](./apis/core/calendar/index.md) allows you to add and modify events in the calendar for user, groups, courses, or the whole site.

### Check API (check)

The [Check API](./apis/subsystems/check/index.md) allows you to add security, performance or health checks to your site.

### Comment API (comment)

The [Comment API](https://docs.moodle.org/dev/Comment_API) allows you to save and retrieve user comments, so that you can easily add commenting to any of your code.

### Communication API (communication)

The [Communication API](./apis/subsystems/communication/index.md) provides access to the messaging system and other communication providers (such as Matrix).

### Competency API (competency)

The [Competency API](https://docs.moodle.org/dev/Competency_API) allows you to list and add evidence of competencies to learning plans, learning plan templates, frameworks, courses and activities.

### Data definition API (ddl)

The [Data definition API](./apis/core/dml/ddl.md) is what you use to create, change and delete tables and fields in the database during upgrades.

### Editor API

The [Editor API](./apis/subsystems/editor/index.md) is used to control HTML text editors.

### Enrolment API (enrol)

The [Enrolment API](./apis/subsystems/enrol.md) deals with course participants.

### Events API (event)

The [Events API](https://docs.moodle.org/dev/Events_API) allows to define "events" with payload data to be fired whenever you like, and it also allows you to define handlers to react to these events when they happen. This is the recommended form of inter-plugin communication. This also forms the basis for logging in Moodle.

### Hooks API

The [Hooks API](./apis/core/hooks/index.md) allows core and plugins to communicate indirectly with other plugins.

### Experience API (xAPI)

The Experience API (xAPI) is an e-learning standard that allows learning content and learning systems to speak to each other. The [Experience API (xAPI)](https://docs.moodle.org/dev/Experience_API_(xAPI))
allows any plugin to generate and handle xAPI standard statements.

### External functions API (external)

The [External functions API](./apis/subsystems/external/functions.md) allows you to create fully parametrised methods that can be accessed by external programs (such as [Web services](./apis/subsystems/external/index.md)).

### Favourites API

The [Favourites API](./apis/subsystems/favourites/index.md) allows you to mark items as favourites for a user and manage these favourites. This is often referred to as 'Starred'.

### H5P API (h5p)

The [H5P API](https://docs.moodle.org/dev/H5P_API) allows plugins to make some decisions/implementations related to the [H5P integration](https://docs.moodle.org/dev/H5P).

### Lock API (lock)

The [Lock API](./apis/core/lock/index.md) lets you synchronise processing between multiple requests, even for separate nodes in a cluster.

### Message API (message)

The [Message API](./apis/core/message/index.md) lets you post messages to users. They decide how they want to receive them.

### Media API (media)

The [Media](https://docs.moodle.org/dev/Media_players#Using_media_players) API can be used to embed media items such as audio, video, and Flash.

### My profile API

The [My profile API](https://docs.moodle.org/dev/My_profile_API) is used to add things to the profile page.

### OAuth 2 API (oauth2)

The [OAuth 2 API](https://docs.moodle.org/dev/OAuth_2_API) is used to provide a common place to configure and manage external systems using OAuth 2.

### Payment API (payment)

The [Payment API](https://docs.moodle.org/dev/Payment_API) deals with payments.

### Preference API (preference)

The [Preference API](./apis/core/preference/index.md) is a simple way to store and retrieve preferences for individual users.

### Portfolio API (portfolio)

The [Portfolio API](https://docs.moodle.org/dev/Portfolio_API) allows you to add portfolio interfaces on your pages and allows users to package up data to send to their portfolios.

### Privacy API (privacy)

The [Privacy API](./apis/subsystems/privacy/index.md) allows you to describe the personal data that you store, and provides the means for that data to be discovered, exported, and deleted on a per-user basis.
This allows compliance with regulation such as the General Data Protection Regulation (GDPR) in Europe.

### Rating API (rating)

The [Rating API](https://docs.moodle.org/dev/Rating_API) lets you create AJAX rating interfaces so that users can rate items in your plugin. In an activity module, you may choose to aggregate ratings to form grades.

<!-- cspell:ignore reportbuilder -->
### Report builder API (reportbuilder)

The [Report builder API](./apis/core/reportbuilder/index.md) allows you to create reports in your plugin, as well as providing custom reporting data which users can use to build their own reports.

### RSS API (rss)

The [RSS API](https://docs.moodle.org/dev/RSS_API) allows you to create secure RSS feeds of data in your module.

### Search API (search)

The [Search API](https://docs.moodle.org/dev/Search_API) allows you to index contents in a search engine and query the search engine for results.

### Tag API (tag)

The [Tag API](./apis/subsystems/tag/index.md) allows you to store tags (and a tag cloud) to items in your module.

### Task API (task)

The [Task API](./apis/subsystems/task/index.md) lets you run jobs in the background. Either once off, or on a regular schedule.

### Time API (time)

The [Time API](./apis/subsystems/time/index.md) takes care of translating and displaying times between users in the site.

### Testing API (test)

The testing API contains the Unit test API ([PHPUnit](/general/development/tools/phpunit)) and Acceptance test API ([Acceptance testing](/general/development/tools/behat)). Ideally all new code should have unit tests written FIRST.

### User-related APIs (user)

This is a rather informal grouping of miscellaneous [User-related APIs](./apis/core/user/index.md) relating to sorting and searching lists of users.

### Web services API (webservice)

The [Web services API](./apis/subsystems/external/writing-a-service.md) allows you to expose particular functions (usually external functions) as web services.

### Badges API (badges)

The [https://docs.moodle.org/dev/OpenBadges_User_Documentation Badges] user documentation (is a temp page until we compile a proper page with all the classes and APIs that allows you to manage particular badges and OpenBadges Backpack).

### Custom fields API (customfield)

The [Custom fields API](./apis/core/customfields/index.md) allows you to configure and add custom fields for different entities

## Activity module APIs

Activity modules are the most important plugin in Moodle. There are several core APIs that service only Activity modules.

### Activity completion API (completion)

The [Activity completion API](./apis/core/activitycompletion/index.md) is to indicate to the system how activities are completed.

### Advanced grading API (grading)

The [Advanced grading API](./apis/core/grading/index.md) allows you to add more advanced grading interfaces (such as rubrics) that can produce simple grades for the gradebook.

### Conditional activities API (condition) - deprecated in 2.7

The deprecated [Conditional activities API](./apis/core/conditionalactivities/index.md) used to provide conditional access to modules and sections in Moodle 2.6 and below. It has been replaced by the [Availability API](./apis/subsystems/availability/index.md).

### Groups API (group)

The [Groups API](./apis/subsystems/group/index.md) allows you to check the current activity group mode and set the current group.

### Gradebook API (grade)

The [Gradebook API](https://docs.moodle.org/dev/Gradebook_API) allows you to read and write from the gradebook. It also allows you to provide an interface for detailed grading information.

### Plagiarism API (plagiarism)

The [Plagiarism API](./apis/subsystems/plagiarism.md) allows your activity module to send files and data to external services to have them checked for plagiarism.

### Question API (question)

The [Question API](https://docs.moodle.org/dev/Question_API) (which can be divided into the Question bank API and the Question engine API), can be used by activities that want to use questions from the question bank.

## See also

<!-- cspell:ignore codingstyle -->
- [Plugins](https://docs.moodle.org/dev/Plugins) - plugin types also have their own APIs
- [Callbacks](https://docs.moodle.org/dev/Callbacks) - list of all callbacks in Moodle
- [Coding style](/general/development/policies/codingstyle) - general information about writing PHP code for Moodle
- [Session locks](https://docs.moodle.org/dev/Session_locks)
