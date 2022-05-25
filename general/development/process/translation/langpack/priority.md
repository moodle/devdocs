---
title: Translation priority
sidebar_label: Priority
sidebar_position: 2
tags:
  - Processes
  - Translation
  - Language
---

This page gives a letter based priority grade to every file or file group in a language pack. The aim is to help new language packs to reach as quickly as possible a usable state.

- It is generally advisable to first translate the most current Moodle branch (version).
- AMOS will automatically propagate the translations you commit into the applicable lower (older) Moodle versions.
- It is very desirable to begin translating the upcoming next (DEV) Moodle core version before the [expected release date](https://docs.moodle.org/dev/Releases#General_release_calendar). You can always foresee that some Moodle users will want to start working in the newest Moodle version as soon as it is available; it would be better if is already translated by then.
- You can easily check how important it would be to translate older Moodle version by looking at [the Moodle downloads statistics page](https://download.moodle.org/local/downloadmoodleorg/stats.php) for your language pack.

## Moodle versions translation priority

:::info

First, make sure [langconfig](./langconfig) is properly set up.

:::

- `Priority A`: These files should be translated. This category includes files with mostly strings which are visible for students.
- `Priority B`: These strings are used for teacher views or strings for less often used parts of Moodle.
- `Priority C`: These strings are mostly admin or modules that are not often enabled on sites.
- Special cases:
  - All plugins with *mobile* in their name, related to [mobile devices](https://docs.moodle.org/en/Moodle_Mobile).
  - [MoodleCloud strings](https://moodle.org/plugins/local_moodlecloudsignup) are used for accessing the [MoodleCloud](https://moodle.com/moodlecloud/) free trial and paid hosting services.
  - The strings inside the `tool_usertours.php` file are used for [User tours](https://docs.moodle.org/en/User_tours) in Moodle 3.2 onwards.

| Priority | Name | Character | Tips |
|---|---|---|---|
| A | core | General lang file, lots of strings are used in several contexts |  |
| A | core_admin | General lang file, most strings are used for admins, but its mixed | In the first step leave out very technical strings |
| A | core_calendar | Calendar related strings |  |
| A | core_langconfig | Config file for language and time setting |  |
| A | core_license | List of licenses for uploaded files |  |
| A | core_mimetype | List of media types used by mouse over to icons |  |
| A | core_my | My Moodle page; all users |  |
| B | core_backup | Course backup process, teachers and admins only |  |
| B | core_blogs | Blog related strings |  |
| B | core_completion | Most of them teachers only a few for students |  |
| B | core_condition | Most of them teachers only |  |
| B | core_grades | Most of them visible for teachers, only a few for students |  |
| B | core_group | Teachers only |  |
| B | core_message | Messenger system, visible for all users |  |
| B | core_pix | Emoticons |  |
| B | core_question | General question related string; teachers only |  |
| B | core_repository | Mostly for teachers and admins |  |
| C | core_access | Accessibility |  |
| C | core_auth | Mostly administrative |  |
| C | core_blocks | Most of them are visible in block settings |  |
| C | core_bulkusers | Bulk user related process for admin only |  |
| C | core_cohort | Admin only |  |
| C | core_countries | List of countries for selection in user profile | Search for a list of countries for your language to translate |
| C | core_currencies | List of currencies; used for Paypal payment process only | Search for a list of currencies for our language to translate |
| C | core_dbtransfer | Admin only |  |
| C | core_debug | Admin only |  |
| C | core_editor | Editor is self explaining for most users |  |
| C | core_edufields | Only for Moodle community hub used |  |
| C | core_enrol | Only a handful are used for students, most for teachers and admins |  |
| C | core-error | Global error messages |  |
| C | core_filters | Most for admins, some for teachers, feature is disabled by default |  |
| C | core_grading | Mostly for admins |  |
| C | core_hub | Admins only, some for teachers if hub ist active |  |
| C | core_ims_cc | IMS Common cartridge import/export |  |
| C | core-install | Installation and update routine; admin only |  |
| C | core_iso6392 | Country list |  |
| C | core_media | Media types for multimedia filter |  |
| C | core_mnet | Moodle network system; admin only |  |
| C | core_notes | Notes about students; teachers only |  |
| C | core_pagetype | Admins only, not directly used for interface |  |
| C | core_plagiarism | Access to external plagiarism system |  |
| C | core_plugin | Plugin system; admin only |  |
| C | core_portfolio | Portfolio system, external system |  |
| C | core_rating | Grade ratings; mostly teachers only |  |
| C | core_role | Admin only, roles and capability names | Not quite sure about default role names here |
| C | core_search | General search function disabled in 2.x, some are relevant for forum search |  |
| C | core_simpletest | Empty |  |
| C | core_table | Report download for teachers only |  |
| C | core_tag | Tag system, not used often |  |
| C | core_timezone | Time zones, list of countries and regions | Search for a list of timezones in your language |
| C | core-userkey | Admin only |  |
| C | core_webservice | Admin only |  |
| C | core_xmldb | Admin only |  |
| C | core_form |  |  |
| B | assignfeedback_comments | Teacher and admin |  |
| B | assignfeedback_file | Teacher only |  |
| B | assignment_offline | Title only for teachers |  |
| B | assignment_online | Title only for teachers |  |
| B | assignment_upload | Title only for teachers |  |
| B | assignment_uploadsingle | Title only for teachers |  |
| B | assignsubmission_comments | Setting for admins only |  |
| B | assignsubmission_file | Settings for teachers and admins |  |
| B | assignsubmission_onlinetext | Settings for teachers and admins |  |
| C | auth_* | Authentication settings for admins only |  |
| B | block_activity_modules | Title only |  |
| C | block_admin_bookmarks | Title only |  |
| B | block_blog_menu | Title only |  |
| B | block_blog_recent |  |  |
| B | block_blog_tags | Title only |  |
| A | block_calendar_month | Title only |  |
| A | block_calendar_upcoming | Title only |  |
| A | block_comments | Title only |  |
| C | block_community |  |  |
| B | block_completionstatus |  |  |
| C | block_course_list |  |  |
| B | block_course_overview | Title only |  |
| B | block_course_summary |  |  |
| B | block_feedback |  |  |
| B | block_glossary_random |  |  |
| A | block_html |  |  |
| A | block_login | Title only |  |
| C | block_mentees |  |  |
| B | block_messages | Title only |  |
| C | block_mnet_hosts |  |  |
| B | block_myprofile |  |  |
| A | block_navigation |  |  |
| A | block_news_items | Title only |  |
| B | block_online_users |  |  |
| B | block_participants | Title only |  |
| A | block_private_files |  |  |
| C | block_quiz_results |  |  |
| A | block_recent_activity | Title only |  |
| C | block_rss_client |  |  |
| C | block_search |  |  |
| A | block_search_forums |  |  |
| C | block_section_links |  |  |
| B | block_selfcompletion |  |  |
| A | block_settings |  |  |
| A | block_site_main_menu | Title only |  |
| B | block_social_activities | Title only |  |
| C | block_tag_flickr |  |  |
| C | block_tag_youtube |  |  |
| C | block_tags |  |  |
| C | booktool_exportimscp |  |  |
| C | booktool_importhtml |  |  |
| B | booktool_print |  |  |
| B | coursereport_completion |  |  |
| B | coursereport_log |  |  |
| B | coursereport_outline |  |  |
| B | coursereport_participation |  |  |
| B | coursereport_progress |  |  |
| B | coursereport_stats |  |  |
| B | datafield_* | Title of data field for database activity; teacher only |  |
| C | editor_textarea | Title only |  |
| C | editor_tinymce | Language elements for HTML editor | TinyMCE - the editor - is translated in lots of languages. Check first if a translation for your language is available on TinyMCE site. |
| C | enrol_authorize | Course enrollment processes: for admins and teachers only |  |
| C | enrol_category | Course enrollment processes: for admins and teachers only |  |
| B | enrol_cohort | Course enrollment processes: for admins and teachers only |  |
| C | enrol_database | Course enrollment processes: for admins and teachers only |  |
| C | enrol_flatfile | Course enrollment processes: for admins and teachers only |  |
| A | enrol_guest | Course enrollment processes: for admins and teachers only |  |
| C | enrol_imsenterprise | Course enrollment processes: for admins and teachers only |  |
| C | enrol_ldap | Course enrollment processes: for admins and teachers only |  |
| B | enrol_manual | Course enrollment processes: for admins and teachers only |  |
| B | enrol_meta | Course enrollment processes: for admins and teachers only |  |
| C | enrol_mnet | Course enrollment processes: for admins and teachers only |  |
| B | enrol_paypal | Course enrollment processes: for admins and teachers only |  |
| A | enrol_self | Course enrollment processes: for admins and teachers only |  |
| B | filter_activitynames | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| C | filter_algebra | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| C | filter_censor | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| B | filter_data | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| C | filter_emailprotect | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| B | filter_emoticon | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| B | filter_glossary | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| B | filter_mediaplugin | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| C | filter_multilang | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| C | filter_tex | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| C | filter_tidy | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| B | filter_urltolink | Filters are disabled per default setting. Teacher can enable/disable on course and/or activity level if admin enabled them on site level |  |
| B | format_scorm | Course format type |  |
| B | format_social | Course format type |  |
| A | format_topics | Course format type |  |
| A | format_weeks | Course format type |  |
| C | gradeexport_* | Grade import/export for teachers and admins only |  |
| C | gradeimport_* | Grade import/export for teachers and admins only |  |
| C | gradereport_* | Grade import/export for teachers and admins only |  |
| C | gradingform_* | Grade import/export for teachers and admins only |  |
| C | local_qeupgradehelper | Question engine upgrade helper |  |
| B | message_email | Messenger system, for students available if enabled |  |
| B | message_popup | Messenger system, for students available if enabled |  |
| C | mnetservice_enrol | Mnet for admins only; will be replaced from 2.4 or 2.5 |  |
| A | mod_assign | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_assignment | Activity module; visible for students, teachers and admins. Priority set for most often used activities | Assignment module, replaced by assign module from Moodle 2.3 |
| A | mod_book | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_chat | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| A | mod_choice | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_data | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_feedback | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| A | mod_folder | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| A | mod_forum | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| A | mod_glossary | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_imscp | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_label | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_lesson | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_lti | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_page | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| A | mod_quiz | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| A | mod_resource | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_scorm | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_survey | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| A | mod_url | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_wiki | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| B | mod_workshop | Activity module; visible for students, teachers and admins. Priority set for most often used activities |  |
| C | portfolio_* | Connection to external portfolio; has to be enabled by admin first |  |
| C | profilefield_* | For admins only to create custom profile fields |  |
| C | qbehaviour_* | Advanced setting for quizzes |  |
| C | qformat_* | Question import/export; advanced feature for teachers |  |
| C | qtype_calculated | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| C | qtype_calculatedmulti | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| C | qtype_calculatedsimple | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_description | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| B | qtype_essay | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_match | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_missingtype | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_multianswer | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_multichoice | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_numerical | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| B | qtype_random | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| B | qtype_randomsamatch | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_shortanswer | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | qtype_truefalse | Quiz question settings for teachers; priority defined by assumption which types are mostly used | Usage can differ by teaching concepts and cultural aspects. |
| A | quiz_grading | Quiz settings; some strings will be visible for students, most for teachers |  |
| B | quiz_overview | Quiz settings; some strings will be visible for students, most for teachers |  |
| A | quiz_responses | Quiz settings; some strings will be visible for students, most for teachers |  |
| B | quiz_statistics | Quiz settings; some strings will be visible for students, most for teachers |  |
| B | quizaccess_* | Quiz activity settings for teachers |  |
| C | report_* | Detailed reports for teachers and/or admins |  |
| C | repository_alfresco | Repository settings, some strings are visible for students in file picker |  |
| A | repository_coursefiles | Repository settings, some strings are visible for students in file picker | Enabled per default |
| B | repository_dropbox | Repository settings, some strings are visible for students in file picker |  |
| C | repository_equella | Repository settings, some strings are visible for students in file picker |  |
| B | repository_filesystem | Repository settings, some strings are visible for students in file picker |  |
| B | repository_flickr | Repository settings, some strings are visible for students in file picker |  |
| B | repository_flickr_public | Repository settings, some strings are visible for students in file picker |  |
| B | repository_googledocs | Repository settings, some strings are visible for students in file picker |  |
| B | repository_local | Repository settings, some strings are visible for students in file picker | Enabled per default |
| C | repository_merlot | Repository settings, some strings are visible for students in file picker |  |
| A | repository_recent | Repository settings, some strings are visible for students in file picker | Enabled per default |
| C | repository_s3 | Repository settings, some strings are visible for students in file picker |  |
| A | repository_upload | Repository settings, some strings are visible for students in file picker |  |
| A | repository_url | Repository settings, some strings are visible for students in file picker |  |
| A | repository_user | Repository settings, some strings are visible for students in file picker | Enabled per default |
| C | repository_webdav | Repository settings, some strings are visible for students in file picker |  |
| A | repository_wikimedia | Repository settings, some strings are visible for students in file picker |  |
| A | repository_youtube | Repository settings, some strings are visible for students in file picker |  |
| C | scormreport_* | Reports for SCORM packages |  |
| C | theme_* | Theme settings; only for admins |  |
| C | tool_* | Admin only features |  |
| C | webservice_* | Admin only features |  |
| C | workshopallocation_* | Workshop module settings |  |
| C | workshopeval_best | Workshop module settings |  |
| C | workshopform_* | Workshop module settings |  |

## See also

- [Less than 25 % of the lang strings are visible for students](https://moodle.org/mod/forum/discuss.php?d=214169) forum discussion which led to the creation of this page
