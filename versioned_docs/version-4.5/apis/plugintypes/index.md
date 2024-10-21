---
title: Plugin types
tags:
  - Plugins
  - core
  - API
---

Moodle is a powerful, and very extensible, Learning Management System. One of its core tenets is its extensibility, and this is primarily achieved through the development of plugins.

A wider range of plugin types are available and these should be selected depending on your needs.

## Things you can find in all plugins

Although there are many different types of plugin, there are some things that work the same way in all plugin types. Please see the [Plugin files](./commonfiles) documentation that describes common files which are found in many plugin types.

## Naming conventions

Plugins typically have at least two names:

- The friendly name, shown to users, and
- A machine name used internally.

The machine name must meet the following rules:

- It must start with a lowercase latin letter
- It may contain only lowercase latin letters, numbers, and underscores
- It must end with a lowercase latin letter, or a number
- The hyphen, and minus character `-` are not allowed

If a plugin does not meet these requirements then it will be silently ignored.

:::tip

Plugin name validation takes place in `core_component::is_valid_plugin_name()` and the following regular expression is used:

```
/^[a-z](?:[a-z0-9_](?!__))*[](a-z0-9)+$/
```

:::

:::danger Activity module exception

The underscore character is not supported in activity modules for legacy reasons.

:::

<!-- cspell:ignore datapreset , ltisource , ltiservice , forumreport , accessrule , logstore -->

| Plugin type | Component name ([Frankenstyle](/general/development/policies/codingstyle/frankenstyle)) | Moodle path | Description | Moodle versions |
| --- | --- | --- | --- | --- |
| [Activity modules](./mod/index.mdx) | mod | /mod | Activity modules are essential types of plugins in Moodle as they provide activities in courses. For example: Forum, Quiz and Assignment. | 1.0+ |
| [Antivirus plugins](./antivirus/index.mdx) | antivirus | /lib/antivirus | Antivirus scanner plugins provide functionality for virus scanning user uploaded files using third-party virus scanning tools in Moodle. For example: ClamAV. | 3.1+ |
| [Assignment submission plugins](./assign/submission.md) | assignsubmission | /mod/assign/submission | Different forms of assignment submissions | 2.3+ |
| [Assignment feedback plugins](./assign/feedback.md) | assignfeedback | /mod/assign/feedback | Different forms of assignment feedbacks | 2.3+ |
| [Book tools](./mod_book/index.md) | booktool | /mod/book/tool | Small information-displays or tools that can be moved around pages | 2.1+ |
| [Custom fields](./customfield/index.md) | customfield | /customfield/field | Custom field types, used in Custom course fields | 3.7+ |
| [Database fields](./mod_data/fields.md) | datafield | /mod/data/field | Different types of data that may be added to the Database activity module | 1.6+ |
| [Database presets](./mod_data/presets.md) | datapreset | /mod/data/preset | Pre-defined templates for the Database activity module | 1.6+ |
| [LTI sources](https://docs.moodle.org/dev/External_tool_source) | ltisource | /mod/lti/source | LTI providers can be added to external tools easily through the external tools interface see [Documentation on External Tools](https://docs.moodle.org/en/External_tool). This type of plugin is specific to LTI providers that need a plugin that can register custom handlers to process LTI messages | 2.7+ |
| [File Converters](./fileconverter/index.md) | fileconverter | /files/converter | Allow conversion between different types of user-submitted file. For example from .doc to PDF. | 3.2+ |
| [LTI services](https://docs.moodle.org/dev/LTI_services) | ltiservice | /mod/lti/service | Allows the implementation of LTI services as described by the IMS LTI specification | 2.8+ |
| [Machine learning backends](./mlbackend/index.md) | mlbackend | /lib/mlbackend | Prediction processors for analytics API | 3.4+ |
| [Forum reports](./mod_forum/index.md) | forumreport | /mod/forum/report | Display various reports in the forum activity | 3.8+ |
| [Quiz reports](https://docs.moodle.org/dev/Quiz_reports) | quiz | /mod/quiz/report | Display and analyse the results of quizzes, or just plug miscellaneous behaviour into the quiz module | 1.1+ |
| [Quiz access rules](https://docs.moodle.org/dev/Quiz_access_rules) | quizaccess | /mod/quiz/accessrule | Add conditions to when or where quizzes can be attempted, for example only from some IP addresses, or student must enter a password first | 2.2+ |
| [SCORM reports](https://docs.moodle.org/dev/SCORM_reports) | scormreport | /mod/scorm/report | Analysis of SCORM attempts | 2.2+ |
| [Workshop grading strategies](https://docs.moodle.org/dev/Workshop_grading_strategies) | workshopform | /mod/workshop/form | Define the type of the grading form and implement the calculation of the grade for submission in the [Workshop](https://docs.moodle.org/dev/Workshop) module | 2.0+ |
| [Workshop allocation methods](https://docs.moodle.org/dev/Workshop_allocation_methods) | workshopallocation | /mod/workshop/allocation | Define ways how submissions are assigned for assessment in the [Workshop](https://docs.moodle.org/dev/Workshop) module | 2.0+ |
| [Workshop evaluation methods](https://docs.moodle.org/dev/Workshop_evaluation_methods) | workshopeval | /mod/workshop/eval | Implement the calculation of the grade for assessment (grading grade) in the [Workshop](https://docs.moodle.org/dev/Workshop) module | 2.0+ |
| [Blocks](./blocks/index.md) | block | /blocks | Small information-displays or tools that can be moved around pages | 2.0+ |
| [Question types](https://docs.moodle.org/dev/Question_types) | qtype | /question/type | Different types of question (for example multiple-choice, drag-and-drop) that can be used in quizzes and other activities | 1.6+ |
| [Question behaviours](https://docs.moodle.org/dev/Question_behaviours) | qbehaviour | /question/behaviour | Control how student interact with questions during an attempt | 2.1+ |
| [Question import/export formats](https://docs.moodle.org/dev/Question_formats) | qformat | /question/format | Import and export question definitions to/from the question bank | 1.6+ |
| [Text filters](./filter/index.md) | filter | /filter | Automatically convert, highlight, and transmogrify text posted into Moodle. | 1.4+ |
| [Editors](https://docs.moodle.org/dev/Editors) | editor | /lib/editor | Alternative text editors for editing content | 2.0+ |
| [Atto editor plugins](./atto/index.md) | atto | /lib/editor/atto/plugins | Extra functionality for the Atto text editor | 2.7+ |
| [Enrolment plugins](./enrol/index.md) | enrol | /enrol | Ways to control who is enrolled in courses | 2.0+ |
| [Authentication plugins](https://docs.moodle.org/dev/Authentication_plugins) | auth | /auth | Allows connection to external sources of authentication | 2.0+ |
| [Admin tools](/general/projects/api/admin-tools) | tool | /admin/tool | Provides utility scripts useful for various site administration and maintenance tasks | 2.2+ |
| [Log stores](./logstore/index.md) | logstore | /admin/tool/log/store | Event logs storage back-ends | 2.7+ |
| [Availability conditions](./availability/index.md) | availability | /availability/condition | Conditions to restrict user access to activities and sections. | 2.7+ |
| [Calendar types](https://docs.moodle.org/dev/Calendar_types) | calendartype | /calendar/type | Defines how dates are displayed throughout Moodle | 2.6+ |
| [Messaging consumers](https://docs.moodle.org/dev/Messaging_consumers) | message | /message/output | Represent various targets where messages and notifications can be sent to (email, sms, jabber, ...) | 2.0+ |
| [Course formats](./format/index.md) | format | /course/format | Different ways of laying out the activities and blocks in a course | 1.3+ |
| [Data formats](https://docs.moodle.org/dev/Data_formats) | dataformat | /dataformat | Formats for data exporting and downloading | 3.1+ |
| [User profile fields](https://docs.moodle.org/dev/User_profile_fields) | profilefield | /user/profile/field | Add new types of data to user profiles | 1.9+ |
| [Reports](https://docs.moodle.org/dev/Reports) | report | /report | Provides useful views of data in a Moodle site for admins and teachers | 2.2+ |
| [Course reports](https://docs.moodle.org/dev/Course_reports) | coursereport | /course/report | Reports of activity within the course | Up to 2.1 (for 2.2+ see [Reports](https://docs.moodle.org/dev/Reports)) |
| [Gradebook export](https://docs.moodle.org/dev/Gradebook_export) | gradeexport | /grade/export | Export grades in various formats | 1.9+ |
| [Gradebook import](https://docs.moodle.org/dev/Gradebook_import) | gradeimport | /grade/import | Import grades in various formats | 1.9+ |
| [Gradebook reports](https://docs.moodle.org/dev/Gradebook_reports) | gradereport | /grade/report | Display/edit grades in various layouts and reports | 1.9+ |
| [Advanced grading methods](https://docs.moodle.org/dev/Grading_methods) | gradingform | /grade/grading/form | Interfaces for actually performing grading in activity modules (for example Rubrics) | 2.2+ |
| [MNet services](https://docs.moodle.org/dev/MNet_services) | mnetservice | /mnet/service | Allows to implement remote services for the [MNet](https://docs.moodle.org/dev/MNet) environment (deprecated, use web services instead) | 2.0+ |
| [Webservice protocols](https://docs.moodle.org/dev/Webservice_protocols) | webservice | /webservice | Define new protocols for web service communication (such as SOAP, XML-RPC, JSON, REST ...) | 2.0+ |
| [Repository plugins](./repository/index.md) | repository | /repository | Connect to external sources of files to use in Moodle | 2.0+ |
| [Portfolio plugins](https://docs.moodle.org/dev/Portfolio_plugins) | portfolio | /portfolio | Connect external portfolio services as destinations for users to store Moodle content | 1.9+ |
| [Search engines](https://docs.moodle.org/dev/Search_engines) | search | /search/engine | Search engine backends to index Moodle's contents. | 3.1+ |
| [Media players](https://docs.moodle.org/dev/Media_players) | media | /media/player | Pluggable media players | 3.2+ |
| [Plagiarism plugins](https://docs.moodle.org/dev/Plagiarism_plugins) | plagiarism | /plagiarism | Define external services to process submitted files and content | 2.0+ |
| [Cache store](https://docs.moodle.org/dev/Cache_store) | cachestore | /cache/stores | Cache storage back-ends. | 2.4+ |
| [Cache locks](https://docs.moodle.org/dev/Cache_locks) | cachelock | /cache/locks | Cache lock implementations. | 2.4+ |
| [Themes](https://docs.moodle.org/dev/Themes) | theme | /theme | Change the look of Moodle by changing the the HTML and the CSS. | 2.0+ |
| [Local plugins](./local/index.mdx) | local | /local | Generic plugins for local customisations | 2.0+ |
| [Content bank content types](https://docs.moodle.org/dev/Content_bank_content_types) | contenttype | /contentbank/contenttype | Content types to upload, create or edit in the content bank and use all over the Moodle site | 3.9+ |
| [H5P libraries](https://docs.moodle.org/dev/H5P_libraries) | h5plib | /h5p/h5plib | Plugin type for the particular versions of the H5P integration library. | 3.9+ |
| [Question bank plugins](./qbank/index.md) | qbank | /question/bank | Plugin type for extending question bank functionality. | 4.0+ |

<details>
<summary> Obtaining the list of plugin types known to your Moodle </summary>

You can get an exact list of valid plugin types for your Moodle version using the following example:

```php title="/plugintypes.php"
<?php
define('CLI_SCRIPT', true);
require('config.php');

$pluginman = core_plugin_manager::instance();

foreach ($pluginman->get_plugin_types() as $type => $dir) {
    $dir = substr($dir, strlen($CFG->dirroot));
    printf(
        "%-20s %-50s %s" . PHP_EOL,
        $type,
        $pluginman->plugintype_name_plural($type),
        $dir)
    ;
}
```

</details>

## See also

- [Guidelines for contributing code](https://docs.moodle.org/dev/Guidelines_for_contributed_code)
- [Core APIs](../../apis.md)
- [Frankenstyle](/general/development/policies/codingstyle/frankenstyle)
- [Moodle Plugins directory](http://moodle.org/plugins)
- [Tutorial](https://docs.moodle.org/dev/Tutorial) to help you learn how to write plugins for Moodle from start to finish, while showing you how to navigate the most important developer documentation along the way.
