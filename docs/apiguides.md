---
title: API Guides
---

Moodle has a number of core APIs that provide tools for Moodle scripts.

They are essential when writing [[Plugins|Moodle plugins]].

## Most-used General API
These APIs are critical and will be used by nearly every Moodle plugin.

### Access API (access)
The [Access API](./apiguides/access) gives you functions so you can determine what the current user is allowed to do, and it allows modules to extend Moodle with new capabilities.

### Data manipulation API (dml)
The [[Data manipulation API]] allows you to read/write to databases in a consistent and safe way.

### File API (files)
The [[File API]] controls the storage of files in connection to various plugins.

### Form API (form)
The [[Form API]] defines and handles user data via web forms.

### Logging API (log)
The [[Events API]] allows you to log events in Moodle, while [[Logging 2]] describes how logs are stored and retrieved.

### Navigation API (navigation)
The [[Navigation API]] allows you to manipulate the navigation tree to add and remove items as you wish.

### Page API (page)
The [[Page API]] is used to set up the current page, add JavaScript, and configure how things will be displayed to the user.

### Output API (output)
The [[Output API]] is used to render the HTML for all parts of the page.

### String API (string)
The [[String API]] is how you get language text strings to use in the user interface. It handles any language translations that might be available.

### Upgrade API (upgrade)
The [[Upgrade API]] is how your module installs and upgrades itself, by keeping track of its own version.

### Moodlelib API (core)
The [[Moodlelib API]] is the central library file of miscellaneous general-purpose Moodle functions. Functions can over the handling of request parameters, configs, user preferences, time, login, mnet, plugins, strings and others. There are plenty of defined constants too.

## Other General API

### Admin settings API (admin)
The [[Admin settings]] API deals with providing configuration options for each plugin and Moodle core.

### Admin presets API (adminpresets)
The [[AdminPresetsAPI|Admin presets API]] allows plugins to make some decisions/implementations related to the Site admin presets.

### Analytics API (analytics)
The [[Analytics API]] allow you to create prediction models and generate insights.

### Availability API (availability)
The [[Availability API]] controls access to activities and sections.

### Backup API (backup)
The [[Backup API]] defines exactly how to convert course data into XML for backup purposes, and the [[Restore API]] describes how to convert it back the other way.

### Cache API (cache)
The [[The Moodle Universal Cache (MUC)]] is the structure for storing cache data within Moodle. [[Cache_API]] explains some of what is needed to use a cache in your code.

### Calendar API (calendar)
The [[Calendar API]] allows you to add and modify events in the calendar for user, groups, courses, or the whole site.

### Check API (check)
The [[Check API]] allows you to add security, performance or health checks to your site.

### Comment API (comment)
The [[Comment API]] allows you to save and retrieve user comments, so that you can easily add commenting to any of your code.

### Competency API (competency)
The [[Competency API]] allows you to list and add evidence of competencies to learning plans, learning plan templates, frameworks, courses and activities.

### Data definition API (ddl)
The [[Data definition API]] is what you use to create, change and delete tables and fields in the database during upgrades.

### Editor API
The [[Editor API]] is used to control HTML text editors.

### Enrolment API (enrol)
The [[Enrolment API]] deals with course participants.

### Events API (event)
The [[Events API]] allows to define "events" with payload data to be fired whenever you like, and it also allows you to define handlers to react to these events when they happen. This is the recommended form of inter-plugin communication. This also forms the basis for logging in Moodle.

### Experience API (xAPI)
The Experience API (xAPI) is an e-learning standard that allows learning content and learning systems to speak to each other. The [[Experience API (xAPI)]]
allows any plugin to generate and handle xAPI standard statements.

### External functions API (external)
The [[External functions API]] allows you to create fully parametrised methods that can be accessed by external programs (such as [[Web services]]).

### Favourites API
The [[Favourites API]] allows you to mark items as favourites for a user and manage these favourites. This is often referred to as 'Starred'.

### H5P API (h5p)
The [[H5P API]] allows plugins to make some decisions/implementations related to the [[H5P|H5P integration]].

### Lock API (lock)
The [[Lock API]] lets you synchronise processing between multiple requests, even for separate nodes in a cluster.

### Message API (message)
The [[Message API]] lets you post messages to users. They decide how they want to receive them.

### Media API (media)
The [[Media_players#Using_media_players|Media]] API can be used to embed media items such as audio, video, and Flash.

### My profile API
The [[My profile API]] is used to add things to the profile page.

### OAuth 2 API (oauth2)
The [[OAuth 2 API]] is used to provide a common place to configure and manage external systems using OAuth 2.

### Payment API (payment)
The [[Payment API]] deals with payments.

### Preference API (preference)
The [[Preference API]] is a simple way to store and retrieve preferences for individual users.

### Portfolio API (portfolio)
The [[Portfolio API]] allows you to add portfolio interfaces on your pages and allows users to package up data to send to their portfolios.

### Privacy API (privacy)
The [[Privacy API]] allows you to describe the personal data that you store, and provides the means for that data to be discovered, exported, and deleted on a per-user basis.
This allows compliance with regulation such as the General Data Protection Regulation (GDPR) in Europe.

### Rating API (rating)
The [[Rating API]] lets you create AJAX rating interfaces so that users can rate items in your plugin. In an activity module, you may choose to aggregate ratings to form grades.

### Report builder API (reportbuilder)
The [[Report builder API]] allows you to create reports in your plugin, as well as providing custom reporting data which users can use to build their own reports.

### RSS API (rss)
The [[RSS API]] allows you to create secure RSS feeds of data in your module.

### Search API (search)
The [[Search API]] allows you to index contents in a search engine and query the search engine for results.

### Tag API (tag)
The [[Tag API]] allows you to store tags (and a tag cloud) to items in your module.

### Task API (task)
The [[Task API]] lets you run jobs in the background. Either once off, or on a regular schedule.

### Time API (time)
The [[Time API]] takes care of translating and displaying times between users in the site.

### Testing API (test)
The testing API contains the Unit test API ([[PHPUnit]]) and Acceptance test API ([[Acceptance testing]]). Ideally all new code should have unit tests written FIRST.

### User-related APIs (user)
This is a rather informal grouping of miscellaneous [[User-related APIs]] relating to sorting and searching lists of users.

### Web services API (webservice)
The [[Web services API]] allows you to expose particular functions (usually external functions) as web services.

### Badges API (badges)
The [https://docs.moodle.org/dev/OpenBadges_User_Documentation Badges] user documentation (is a temp page until we compile a proper page with all the classes and APIs that allows you to manage particular badges and OpenBadges Backpack).

### Custom fields API
The [[Custom fields API]] allows you to configure and add custom fields for different entities

## Activity module APIs
Activity modules are the most important plugin in Moodle. There are several core APIs that service only Activity modules.

### Activity completion API (completion)
The [[Activity completion API]] is to indicate to the system how activities are completed.

### Advanced grading API (grading)
The [[Advanced grading API]] allows you to add more advanced grading interfaces (such as rubrics) that can produce simple grades for the gradebook.

### Conditional activities API (condition) - deprecated in 2.7
The deprecated [[Conditional activities API]] used to provide conditional access to modules and sections in Moodle 2.6 and below. It has been replaced by the [[Availability API]].

### Groups API (group)
The [[Groups API]] allows you to check the current activity group mode and set the current group.

### Gradebook API (grade)
The [[Gradebook API]] allows you to read and write from the gradebook. It also allows you to provide an interface for detailed grading information.

### Plagiarism API (plagiarism)
The [[Plagiarism API]] allows your activity module to send files and data to external services to have them checked for plagiarism.

### Question API (question)
The [[Question API]] (which can be divided into the Question bank API and the Question engine API), can be used by activities that want to use questions from the question bank.

## See also
* [[Plugins]] - plugin types also have their own APIs
* [[Callbacks]] - list of all callbacks in Moodle
* [[Coding style]] - general information about writing PHP code for Moodle
* [[Session locks]]
