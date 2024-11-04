<!-- markdownlint-disable first-line-heading -->
For an Activity, you _must_ define the following three functions, which are described below:

```php title="mod/[modname]/lib.php"
function [modname]_add_instance($instancedata, $mform = null): int;
function [modname]_update_instance($instancedata, $mform): bool;
function [modname]_delete_instance($id): bool;
```

- The `[modname]_add_instance()` function is called when the activity creation form is submitted. This function is only called when adding an activity and should contain any logic required to add the activity.
- The `[modname]_update_instance()` function is called when the activity editing form is submitted.
- The `[modname]_delete_instance()` function is called when the activity deletion is confirmed. It is responsible for removing all data associated with the instance.

:::note

The `lib.php` file is one of the older parts of Moodle and functionality is gradually being migrated to class-based function calls.

:::

##### Activity module support functions

Activity modules can implement a global function to provide additional information about the module
features. These functions are optional and can be used to provide additional features or to modify the behaviour of the activity module.

```php title="mod/[modname]/lib.php"
function [modname]_supports(string $feature): bool|string|null;
```

The function `[modname]_supports` is used to check if the activity module supports a particular feature. The function should return `true` if the feature is supported, `false` if it is not supported, `null` if the feature is unknown, or string for the module purpose for some features.

Each feature is identified by a constant, which is defined in the `lib
/moodlelib.php` file. Some of the available features are:

- `FEATURE_GROUPS` and `FEATURE_GROUPINGS`: The activity module supports groups and groupings.
- `FEATURE_SHOW_DESCRIPTION`: The activity module supports showing the description on the course page.
- `FEATURE_QUICKCREATE`: The activity `[modname]_add_instance()` function is able to create an instance without showing a form using the default settings. It is used by the `core_courseformat_create_module` webservice to know which activities are compatible. If this feature is supported, the activity module should provide a `quickcreatename` string in the language file that will be used as the name of the instance created.
- `FEATURE_COMPLETION`: The activity module supports activity completion. For now this feature only affects the bulk completion settings. However, in the future ([MDL-83027](https://tracker.moodle.org/browse/MDL-83027)) activities can set to false to disable all completion settings.

<details>
  <summary>View example</summary>
  <div>

```php
function [modname]_supports($feature) {
    return match ($feature) {
        FEATURE_GROUPS => true,
        FEATURE_GROUPINGS => true,
        FEATURE_MOD_INTRO => true,
        FEATURE_COMPLETION_TRACKS_VIEWS => true,
        FEATURE_GRADE_HAS_GRADE => true,
        FEATURE_BACKUP_MOODLE2 => true,
        FEATURE_SHOW_DESCRIPTION => true,
        FEATURE_MOD_PURPOSE => MOD_PURPOSE_COLLABORATION,
        default => null,
    };
}
```

  </div>
</details>

:::tip

To have your Activity plugin classified in the right Activity category, you must define the function `[modname]_supports` and add the `FEATURE_MOD_PURPOSE` constant:

<details>
  <summary>View example</summary>
  <div>

```php
function [modname]_supports(string $feature) {
    switch ($feature) {
        [...]
        case FEATURE_MOD_PURPOSE:
            return MOD_PURPOSE_XXXXXX;

        default:
            return null;
    }
}
```

  </div>
</details>

The available activity purposes for this feature are:

- **Administration** (`MOD_PURPOSE_ADMINISTRATION`) <br/>
Tools for course administration, such as attendance tracking or appointment scheduling.
- **Assessment** (`MOD_PURPOSE_ASSESSMENT`)<br/>
Activities that allow the evaluation and measurement of student understanding and performance.<br/>
  - Core activities in this category: Assignment, Quiz, Workshop.
- **Collaboration** (`MOD_PURPOSE_COLLABORATION`)<br/>
Tools for collaborative learning that encourage knowledge sharing, discussions, and teamwork.<br/>
  - Core activities in this category: Database, Forum, Glossary, Wiki.
- **Communication** (`MOD_PURPOSE_COMMUNICATION`)<br/>
Activities that facilitate real-time communication, asynchronous interaction, and feedback collection.<br/>
  - Core activities in this category: BigBlueButton, Chat, Choice, Feedback, Survey.
- **Interactive content** (`MOD_PURPOSE_INTERACTIVECONTENT`)<br/>
Engaging interactive activities that encourage active learner participation.<br/>
  - Core activities in this category: H5P, IMS package, Lesson, SCORM package.
- **Resources** (`MOD_PURPOSE_CONTENT`)<br/>
Activities and tools to organise and display course materials like documents, web links, and multimedia.<br/>
  - Core activities in this category: Book, File, Folder, Page, URL, Text and media area.
- **Other** (`MOD_PURPOSE_OTHER`)<br/>
Other types of activities.

:::
