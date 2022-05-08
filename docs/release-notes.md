---
title: Release notes
tags:
  - Release notes
  - Moodle 4.0
---

Release date: 19 April 2022

Here is [the full list of issues fixed in 4.0](https://tracker.moodle.org/secure/IssueNavigator!executeAdvanced.jspa?jqlQuery=project+%3D+mdl+AND+resolution+%3D+fixed+AND+fixVersion+in+%28%224.0%22%29+ORDER+BY+priority+DESC&runQuery=true&clear=true).

If you are upgrading from a previous version, please see the [Moodle 4.0 Upgrade notes](https://docs.moodle.org/400/en/Upgrading).

## Server requirements

These are just the minimum supported versions. We recommend keeping all of your software and operating systems up-to-date.

- Moodle upgrade: Moodle 3.6 or later
- PHP version:
  - minimum PHP 7.3.0 __Note: the minimum PHP version has increased since Moodle 3.10__.
  - PHP 7.4.x is also supported.
  - [PHP 8.0 support](https://docs.moodle.org/dev/Moodle_and_PHP) is being implemented (see {tracker}`MDL-70745`) and **not ready for production** yet.
- PHP extensions:
  - The [`intl`](https://www.php.net/manual/en/book.intl.php) extension is now *required*.
  - The [`exif`](https://www.php.net/manual/en/book.exif.php) extension is now _recommended_.
  - The [`sodium`](https://www.php.net/manual/en/book.sodium.php) extension is now _recommended_. It will be _required_ from Moodle 4.2 onwards - see [Environment - PHP extension sodium](https://docs.moodle.org/400/en/Environment_-_PHP_extension_sodium) for more information.
- PHP setting **max_input_vars** is recommended to be >= 5000 for PHP 7.x installations. It's a requirement for PHP 8.x installations. For further details, see [Environment - max input vars](https://docs.moodle.org/400/en/Environment_-_max_input_vars).

### Database requirements

Moodle supports the following database servers. Again, version numbers are just the minimum supported version. We recommend running the latest stable version of any software.

| Database | Minimum version | Recommended |
| --- | --- | --- |
| [PostgreSQL](http://www.postgresql.org/) | 10 (increased since Moodle 3.11) | Latest |
| [MySQL](http://www.mysql.com/) | 5.7 | Latest |
| [MariaDB](https://mariadb.org/) | 10.2.29 | Latest |
| [Microsoft SQL Server](http://www.microsoft.com/en-us/server-cloud/products/sql-server/) | 2017 (increased since Moodle 3.10) | Latest |
| [Oracle Database](http://www.oracle.com/us/products/database/overview/index.html) | 11.2 | Latest |

## Client requirements

### Browser support

Moodle is compatible with any standards compliant web browser. We regularly test Moodle with the following browsers:

Desktop:

- Chrome
- Firefox
- Safari
- Edge

:::important Internet Explorer

Please note that Moodle 4.0 does _NOT_ support Internet Explorer 11.

:::

:::note Safari

Safari 7 and below has known compatibility issues with Moodle 4.0.

:::

Mobile:

- MobileSafari
- Google Chrome

For the best experience and optimum security, we recommend that you keep your browser up-to-date.

## Major UX improvements

### Navigation improvements

- {tracker}`MDL-70208` - Implement frontend functionality for primary navigation
- {tracker}`MDL-70207` - Implement backend functionality for primary navigation
- {tracker}`MDL-70202` - Implement frontend functionality for secondary navigation
- {tracker}`MDL-70198` - Implement backend functionality for secondary navigation
- {tracker}`MDL-70196` - Create a module based navigation bar
- {tracker}`MDL-72352` - Ensure that secondary navigation is backwards compatible
- {tracker}`MDL-73462` - Course and category management secondary and tertiary navigation
- {tracker}`MDL-71977` - Define the secondary navigation nodes that should be always displayed in the more menu in the module context
- {tracker}`MDL-71901` - Allow plugins to define their own secondary nav ordering
- {tracker}`MDL-70844` - Update the secondary navigation view to send site administration information in tab form
- {tracker}`MDL-72396` - Allow easy setting of the active tab for navigation views
- {tracker}`MDL-71912` - Implement tertiary navigation for plugins (also see {tracker}`MDL-71913`, {tracker}`MDL-71914` and {tracker}`MDL-71914`)
- {tracker}`MDL-73863` - Tertiary navigation in course completion
- {tracker}`MDL-72875` - Add tertiary navigation to the participants page
- {tracker}`MDL-72904` - Add tertiary navigation to the badges pages
- {tracker}`MDL-72873` - Add tertiary navigation to the gradebook
- {tracker}`MDL-72094` - Update the course reports page styling and functionality
- {tracker}`MDL-71083` - Move the user menu in the top bar into the primary navigation menu in the mobile view
- {tracker}`MDL-73393` - Ensure that existing third party themes still work with latest navigation changes
- {tracker}`MDL-71943` - Dynamic (AJAX) tabs in Moodle LMS
- {tracker}`MDL-72090` - Convert course admin pages from link farms to dropdowns
- {tracker}`MDL-72413` - Move the activity modules title, description, and activity completion into a standard module API
- {tracker}`MDL-72736` - Remove section navigation on one section per page
- {tracker}`MDL-72834` - Move the calendar link into the user menu
- {tracker}`MDL-72450` - Remove the next and previous activity links from all activity modules in Boost
- {tracker}`MDL-71148` - Combine both the custom menu & primary navigation renderers
- {tracker}`MDL-71683` - Update language menu to move from the top navigation into the user menu when logged in
- {tracker}`MDL-72005` - Update the context_header in Boost to move the breadcrumb to the top

### Course index

- {tracker}`MDL-71209` - Create the new course index list
- {tracker}`MDL-72660` - Add activity completion indicators to the course index
- {tracker}`MDL-71228` - Implement drag and drop option for sections and activities in the course index
- {tracker}`MDL-71211` - Keep the status of the course index collapsed and expanded sections per user and course
- {tracker}`MDL-71795` - Course index on activity view page
- {tracker}`MDL-71828` - Implement section links' behaviour in course index
- {tracker}`MDL-71664` - Enable drag & drop from course index to course content and vice versa
- {tracker}`MDL-72463` - Add 'highlighted' label to course index
- {tracker}`MDL-71727` - Sync course index and course content when an element is dragged
- {tracker}`MDL-72897` - Mark the current section in the course index
- {tracker}`MDL-73340` - Open course index by default first time a user access the course
- {tracker}`MDL-73310` - Show the course index on all pages within a course

### Course experience

- {tracker}`MDL-71037` - Sections are now collapsible for Topics and Weekly course formats
- {tracker}`MDL-71691` - Created a new activity UI component
- {tracker}`MDL-71689` - Improvements to add activity and add section design
- {tracker}`MDL-71663` - Created a new "move" option in the sections and activity cog menu in the course editor
- {tracker}`MDL-71779` - Made 'Add a new topic/week' option client side on Topics and Weekly formats
- {tracker}`MDL-72311` - Proceed straight to course content when creating a new course
- {tracker}`MDL-71863` - Created core_courseformat subsystem
- {tracker}`MDL-72578` - Moved activity UI component to output classes and templates
- {tracker}`MDL-73343` - New quick access to create a new course from My courses page when there is no course available

### My Courses page and overview block

- {tracker}`MDL-70801` - Implement "My courses" page
- {tracker}`MDL-58579` - Allow searching / filtering of courses in myoverview
- {tracker}`MDL-73231` - Provide option of having My courses as defaulthomepage

### Timeline block

- {tracker}`MDL-72276` - Update timeline block dropdowns to display current selection
- {tracker}`MDL-72277` - Improve the layout and usability of the items in the timeline block
- {tracker}`MDL-73068` - Only display courses in the timeline block if they contain events
- {tracker}`MDL-72295` - Add text search to the timeline block
- {tracker}`MDL-72594` - Improve displaying of overdue items in the timeline block
- {tracker}`MDL-72603` - Replace timeline block pagination with "show more" lazy loading
- {tracker}`MDL-72543` - Change the display of the event names of the items on the timeline block

### Calendar usability

- {tracker}`MDL-71817` - Render the calendar in the calendar block in month view
- {tracker}`MDL-72237` - Limit number of events shown per day in calendar month view
- {tracker}`MDL-71810` - Add a current date indicator and make calendar block responsive when switching between small and large views
- {tracker}`MDL-71808` - Move the import calendar form to its own page
- {tracker}`MDL-72045` - Improve help information provided on the calendar export page
- {tracker}`MDL-71790` - Revamp the manage subscriptions page
- {tracker}`MDL-71788` - Make it easier to copy the export URL
- {tracker}`MDL-71775` - Add footer links to the calendar block
- {tracker}`MDL-72810` - Remove 3-month calendar view

### Dashboard

- {tracker}`MDL-72092` - Arrange blocks between My courses & My dashboard
- {tracker}`MDL-73114` - Display a title in the dashboard page
- {tracker}`MDL-71964` - Welcome message for users
- {tracker}`MDL-73233` - Provide option to disable the Dashboard
- {tracker}`MDL-72116` - Remove some of the default blocks from the Dashboard

### User tours

- {tracker}`MDL-61674` - Allow user tours to be created using the Atto text editor
- {tracker}`MDL-72385` - Improve and simplify design of user tours
- {tracker}`MDL-71938` - Display number of steps in a user tour
- {tracker}`MDL-72783` - Add new user tours
- {tracker}`MDL-72781` - Remove previous user tours
- {tracker}`MDL-72557` - Implement customisable confirmation button for single step user tours
- {tracker}`MDL-71931` - Update user tours to emit events

### Other usability and user experience improvements

- {tracker}`MDL-69371` - Redesign the Moodle login page (also see {tracker}`MDL-72928`)
- {tracker}`MDL-71457` - Update the Moodle activity icons
- {tracker}`MDL-71963` - Turn confirmation page into modals
- {tracker}`MDL-71965` - New footer
- {tracker}`MDL-71456` - Create page drawers for the block and course index areas
- {tracker}`MDL-72095` - Set a main container width of Boost pages
- {tracker}`MDL-71610` - Move the turn editing on button into the navbar
- {tracker}`MDL-72305` - Show user initials as a placeholder for the user profile picture
- {tracker}`MDL-72278` - Fake blocks now in drawer are made visible on first visit
- {tracker}`MDL-72454` - Removal of back to top link
- {tracker}`MDL-72088` - Update styling across top level pages
- {tracker}`MDL-70888` - Update the layouts in Boost theme
- {tracker}`MDL-71292` - Update the page header and include course image / activity icon
- {tracker}`MDL-73608` - Provide a contact form which sends to the site support email and replace mailto link in footer
- {tracker}`MDL-73935` - Improved flexibility of site support form and consistency of site support info provided in Moodle
- {tracker}`MDL-61564` - Allow multiple cohort selection in cohort enrolment
- {tracker}`MDL-66539` - Better handling of link names and URLs with Atto
- {tracker}`MDL-73797` - Dialogues now have the action button on the right
- {tracker}`MDL-60917` - Add highest ranked results section to global search
- {tracker}`MDL-73917` - Notification preferences page improvements
- {tracker}`MDL-72500` - Easier to find a specific component in event list report
- {tracker}`MDL-32103` - Course completion is instant for activity based completion criteria (single user completions only)

## Other major features

### Report builder integration (from Moodle Workplace)

- {tracker}`MDL-70795` - Implement functionality for creating custom reports
- {tracker}`MDL-70794` - Implement functionality for creating system reports
- {tracker}`MDL-72588` - Implement custom report audiences
- {tracker}`MDL-72598` - Implement custom report schedules
- {tracker}`MDL-73598` - Allow Custom Reports to be disabled by site admin
- {tracker}`MDL-72280` - Create "Courses" custom report source
- {tracker}`MDL-73069` - Report condition to limit returned data to current user
- {tracker}`MDL-73180` - Improve definitions of previous/next relative date filters
- {tracker}`MDL-72662` - Implement relative date options in the Reportbuilder date filter
- {tracker}`MDL-72172` - Create "Cohort members" custom report source
- {tracker}`MDL-72962` - Format editable report elements (column, filters, etc)
- {tracker}`MDL-72826` - Custom report option to display unique row values
- {tracker}`MDL-71153` - Convert task logs report to a system report
- {tracker}`MDL-71070` - Convert configuration changes report to a system report

### BigBlueButton integration

- {tracker}`MDL-70658` - Integrate the BigBlueButton plugin into Moodle LMS

### Quiz and Questions

- {tracker}`MDL-71516` - Create new plugin type - Qbank (for the full list of qbank plugins added to core, see {tracker}`MDL-70329`)
- {tracker}`MDL-71679` - Update mod_quiz for new question bank
- {tracker}`MDL-71636` - Add a columnsortorder settings page
- {tracker}`MDL-71696` - Add question versions
- {tracker}`MDL-72076` - Question bank bulk action UI
- {tracker}`MDL-72553` - Add custom fields to questions
- {tracker}`MDL-52206` - Move "Require passing grade" completion option to core
- {tracker}`MDL-52456` - Add notification message for students after questions have been manually graded
- {tracker}`MDL-71984` - Add logging to quiz auto-save, process_attempt and redo_question
- {tracker}`MDL-73337` - Log editing quizzes in detail
- {tracker}`MDL-73699` - Question status UI/UX update
- {tracker}`MDL-72448` - Add qbank_history to core
- {tracker}`MDL-71614` - Add qbank_previewquestion to core

### Update LTI tool provider feature to support 1.3

- {tracker}`MDL-69543` - Update tool to support 1.3 OAuth2/OIDC launch flow
- {tracker}`MDL-71371` - Provide upgrade path for 1.1 preconfigured tools
- {tracker}`MDL-72745` - Provide account provisioning options for LTI Advantage launches
- {tracker}`MDL-69547` - Update tool enrolment code so that a user is automatically created and enrolled when launching via 1.3
- {tracker}`MDL-69545` - Update user sync task to support 1.3 messages
- {tracker}`MDL-69544` - Update grade sync task to support 1.3 messages
- {tracker}`MDL-72288` - Update library and model code to support issuer and clientid uniqueness on registrations
- {tracker}`MDL-69862` - Add dynamic registration support to the tool
- {tracker}`MDL-70354` - Return line item information during content selection

### Assignment

- {tracker}`MDL-68913` - Per attempt timing now available in assignments

### Admin configuration presets

- {tracker}`MDL-72112` - Integrate admin_presets third-party plugin in Moodle LMS
- {tracker}`MDL-73145` - Add a $CFG setting to define the preset to be installed
- {tracker}`MDL-72114` - Include pre-installed admin presets
- {tracker}`MDL-72113` - Add feature to import/export plugins visibility from Admin presets tool
- {tracker}`MDL-73394` - Store the latest site admin preset applied

### Content bank and H5P

- {tracker}`MDL-68394` - Integrate mod_h5pactivity with recent activity plugins
- {tracker}`MDL-72099` - Add navigation by contexts in the content bank
- {tracker}`MDL-71885` - Inline editing H5P content for mod_h5pactivity
- {tracker}`MDL-71956` - Inline editing H5P content anywhere

### Badges

- {tracker}`MDL-72141` - Simplifying the external badge page

### Accessibility improvements

- {tracker}`MDL-67853` - Remove online-offline options on notifications
- {tracker}`MDL-72078` - Give users an indication that they encountered an editor
- {tracker}`MDL-71604` - Move the screen reader helper button to the first row
- {tracker}`MDL-72896` - Make html_tables responsive by default

## Other Highlights

### Functional changes

- {tracker}`MDL-70456` - Add custom user field support to all places that display user identity [0,Minor] Improvement
- {tracker}`MDL-73342` - Disable some blocks by default (such as feedback, RSS and self-completion)
- {tracker}`MDL-70905` - Updated media default width/height to use 16:9
- {tracker}`MDL-72118` - Rename "HTML block" to the more easily understood "Text block"
- {tracker}`MDL-72706` - Change default value of "Hidden sections" course format setting
- {tracker}`MDL-72115` - Rename "Miscellaneous" category to "Category 1"
- {tracker}`MDL-72119` - Make "Enable xxxxx" features consistent (hide menus for disabled features)

### For administrators

- {tracker}`MDL-71347` - Add a filter to "browse list of users" for date of user account creation
- {tracker}`MDL-72031` - Separate out max_time for audio and video files in Atto/RecordRTC
- {tracker}`MDL-71515` - Improve the test outgoing mail configuration admin page
- {tracker}`MDL-67686` - Add more filters to task log (/admin/tasklogs.php)
- {tracker}`MDL-72984` - Ensure support email address is mandatory
- {tracker}`MDL-73592` - MoodleNet integration now enabled by default
- {tracker}`MDL-71621` - Parent role cannot edit custom fields in child profile
- {tracker}`MDL-73918` - Allow admins to change the page width using custom SCSS
- {tracker}`MDL-71927` - Logs and question attempt history now show time to the second, to help investigate issues
- {tracker}`MDL-71466` - Custom user field support: Admin role screens (check permissions, assign)
- {tracker}`MDL-72619` - Provide admin page to view cache size estimates
- {tracker}`MDL-67822` - New check_database_schema performance check
- {tracker}`MDL-70271` - Dropbox token and Permission Updates
- {tracker}`MDL-58395` - LDAP auth sync now skip and report problematic user accounts
- {tracker}`MDL-72251` - Tasks admin UI now shows time to nearest second

### Mobile

- {tracker}`MDL-67807` - Return concurrent sessions information to apply concurrent login limit in the mobile app
- {tracker}`MDL-69555` - Make duration of QR login and auto-login time between requests configurable
- {tracker}`MDL-73794` - Update the footer in the mobile view

### Performance

- {tracker}`MDL-72596` - Caching: Track cache I/O size in perfdebug
- {tracker}`MDL-69088` - Make file cache store purges instant with a safe and async purge
- {tracker}`MDL-68164` - Additional caching of pg_field_type postgres field metadata
- {tracker}`MDL-63983` - Improve the performance of non-contact searches in messaging when site-wide messaging is disabled (default)
- {tracker}`MDL-71014` - Cache the siteidentifier and site contextid in local cache
- {tracker}`MDL-72328` - Add TTL support for Redis caches
- {tracker}`MDL-72837` - Cache API should support versioned data

## Security improvements

- {tracker}`MDL-56873` - Set more secure defaults for the cURL allow/deny lists
- {tracker}`MDL-66776` - Send notifications when new devices are used to log in into the site
- {tracker}`MDL-71627` - Add check API for anti virus and optionally remove admin notifications
- {tracker}`MDL-71806` - Improved the UX of the Moodle security report
- {tracker}`MDL-71176` - New password and change forms should have autocomplete="new-password"

## For developers

- {tracker}`MDL-61460` - Introduce the UI components library
- {tracker}`MDL-74229` - Add navigation node keys to allow themers to hide navigation tabs
- {tracker}`MDL-74235` - Rename the icons for activities to allow support of multiple icons for multiple versions
- {tracker}`MDL-74033` - Allow full customisation of the primary navigation
- {tracker}`MDL-72779` - Set more than one value on a persistent at the same time
- {tracker}`MDL-70862` - Implement a new callback to extend gradebook plugininfo
- {tracker}`MDL-72289` - Allow callers to customise the rendered icon of inplace editable elements
- {tracker}`MDL-73347` - Allow themes to define un-addable blocks
- {tracker}`MDL-46778` - Allow use a separate DB configuration (not just prefix) for Behat similar to PHPUnit
- {tracker}`MDL-73270` - Warn where XMLRPC is currently in use
- {tracker}`MDL-67228` - Tool_replace maturity set

### Web service additions and updates

- {tracker}`MDL-71135` - Create core_course_get_state web service
- {tracker}`MDL-71165` - Create core_course_update_course web service

### Core plugins removed

- {tracker}`MDL-71473` - Jabber removed as a standard notification plugin
- {tracker}`MDL-58939` - Picasa repository and portfolio removed from core
- {tracker}`MDL-72335` - Tool_health removed from core
- {tracker}`MDL-72615` - Boxnet plugins removed from core
- {tracker}`MDL-72616` - Quiz results block removed from core
- {tracker}`MDL-72348` - Microsoft OneDrive (legacy) repository (repository_skydrive) removed from core
- {tracker}`MDL-72347` - Word censorship filter (filter_censor) removed from core
- {tracker}`MDL-72407` - VideoJS Flash plugin removed from core
- {tracker}`MDL-72042` - Flash animation media player removed from core
- {tracker}`MDL-72041` - WebCT question import format removed from core
- {tracker}`MDL-72517` - Examview question import format removed from core

### Deprecations

- {tracker}`MDL-53544` - Typo3 library removed
- {tracker}`MDL-72004` - Quiz 4.0 Class renaming and deprecation
- {tracker}`MDL-73756` - Deprecate $modinfo param to completion_info::get_data()
- {tracker}`MDL-65799` - Phase 2 of deprecation of functions in lib/deprecatedlib.php initially deprecated in 3.8
- {tracker}`MDL-71175` - Deprecate some plagiarism functions that are not used, or have replacements
- {tracker}`MDL-66266` - Remove deprecated functions in messages/classes/api.php
- {tracker}`MDL-72098` - deprecate grade_grade::insert method that just calls its parent
- {tracker}`MDL-72433` - Final deprecation of get_grades() in lib/classes/grades_external.php
- {tracker}`MDL-71476` - Remove mysql_engine.php
- {tracker}`MDL-65252` - Final deprecations of forum_count_replies and get_forum_discussion_posts
- {tracker}`MDL-67412` - Remove deprecated functions in lib/setuplib.php
- {tracker}`MDL-65801` - Remove strings deprecated in 3.8

### Component API updates

- [admin/tool/generator/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/admin/tool/generator/upgrade.txt)
- [admin/tool/log/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/admin/tool/log/upgrade.txt)
- [admin/tool/mobile/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/admin/tool/mobile/upgrade.txt)
- [admin/tool/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/admin/tool/upgrade.txt)
- [admin/tool/usertours/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/admin/tool/usertours/upgrade.txt)
- [admin/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/admin/upgrade.txt)
- [analytics/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/analytics/upgrade.txt)
- [auth/shibboleth/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/auth/shibboleth/upgrade.txt)
- [availability/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/availability/upgrade.txt)
- [backup/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/backup/upgrade.txt)
- [badges/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/badges/upgrade.txt)
- [blocks/section_links/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/blocks/section_links/upgrade.txt)
- [blocks/tag_youtube/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/blocks/tag_youtube/upgrade.txt)
- [blocks/timeline/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/blocks/timeline/upgrade.txt)
- [blocks/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/blocks/upgrade.txt)
- [cache/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/cache/upgrade.txt)
- [calendar/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/calendar/upgrade.txt)
- [completion/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/completion/upgrade.txt)
- [contentbank/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/contentbank/upgrade.txt)
- [course/format/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/course/format/upgrade.txt)
- [course/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/course/upgrade.txt)
- [customfield/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/customfield/upgrade.txt)
- [dataformat/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/dataformat/upgrade.txt)
- [enrol/database/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/enrol/database/upgrade.txt)
- [enrol/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/enrol/upgrade.txt)
- [filter/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/filter/upgrade.txt)
- [grade/grading/form/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/grade/grading/form/upgrade.txt)
- [grade/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/grade/upgrade.txt)
- [group/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/group/upgrade.txt)
- [h5p/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/h5p/upgrade.txt)
- [lib/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/lib/upgrade.txt)
- [media/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/media/upgrade.txt)
- [message/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/message/upgrade.txt)
- [mod/assign/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/assign/upgrade.txt)
- [mod/book/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/book/upgrade.txt)
- [mod/feedback/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/feedback/upgrade.txt)
- [mod/forum/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/forum/upgrade.txt)
- [mod/glossary/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/glossary/upgrade.txt)
- [mod/h5pactivity/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/h5pactivity/upgrade.txt)
- [mod/lesson/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/lesson/upgrade.txt)
- [mod/lti/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/lti/upgrade.txt)
- [mod/page/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/page/upgrade.txt)
- [mod/quiz/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/quiz/upgrade.txt)
- [mod/resource/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/resource/upgrade.txt)
- [mod/scorm/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/scorm/upgrade.txt)
- [mod/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/upgrade.txt)
- [mod/url/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/url/upgrade.txt)
- [mod/wiki/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/wiki/upgrade.txt)
- [mod/workshop/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/mod/workshop/upgrade.txt)
- [my/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/my/upgrade.txt)
- [payment/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/payment/upgrade.txt)
- [plagiarism/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/plagiarism/upgrade.txt)
- [portfolio/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/portfolio/upgrade.txt)
- [question/bank/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/question/bank/upgrade.txt)
- [question/behaviour/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/question/behaviour/upgrade.txt)
- [question/engine/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/question/engine/upgrade.txt)
- [question/format/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/question/format/upgrade.txt)
- [question/type/multichoice/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/question/type/multichoice/upgrade.txt)
- [question/type/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/question/type/upgrade.txt)
- [question/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/question/upgrade.txt)
- [report/eventlist/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/report/eventlist/upgrade.txt)
- [report/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/report/upgrade.txt)
- [repository/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/repository/upgrade.txt)
- [search/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/search/upgrade.txt)
- [theme/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/theme/upgrade.txt)
- [user/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/user/upgrade.txt)
- [webservice/upgrade.txt](https://github.com/moodle/moodle/blob/v4.0.0/webservice/upgrade.txt)

## See also

- [Moodle 3.11 release notes](https://docs.moodle.org/dev/Moodle_3.11_release_notes)
